/**
 * L2-W9 — Post-Session Follow-up (Cron)
 *
 * Runs every hour (via Supabase pg_cron or Vercel cron).
 * 1 hour after a session's end_time, automatically:
 *
 * 1. Marks the session as "completed" (if still "scheduled")
 * 2. Sends lead: thank you + feedback request + rebooking CTA
 * 3. Sends client: completion summary + payment status
 * 4. Updates lead status to "completed"
 * 5. Logs everything
 *
 * The post-session workflow ties the loop — without it,
 * clients have to manually follow up with every lead.
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/automation/supabase-admin";
import { verifyCronRequest, unauthorizedResponse } from "@/lib/automation/cron-auth";
import { sendEmail } from "@/lib/automation/email";
import {
  postSessionLeadSubject,
  postSessionLeadHtml,
  postSessionClientSubject,
  postSessionClientHtml,
} from "@/lib/automation/templates/post-session";

// ─── Helpers ────────────────────────────────────────────────

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// ─── Route Handler ──────────────────────────────────────────

export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request)) {
    return unauthorizedResponse();
  }

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  const results = {
    sessions_completed: 0,
    follow_ups_sent: 0,
    errors: [] as string[],
  };

  try {
    // Find sessions that ended 1-2 hours ago and are still "scheduled"
    // (haven't been manually marked completed or caught by no-show handler)
    const { data: sessions } = await supabaseAdmin
      .from("sessions")
      .select("*, leads!inner(name, email), clients!inner(name, email, business_name, service_type)")
      .eq("status", "scheduled")
      .lt("end_time", oneHourAgo.toISOString())
      .gte("end_time", twoHoursAgo.toISOString()); // Don't overlap with no-show handler

    for (const session of sessions || []) {
      // Idempotency check
      const { data: existing } = await supabaseAdmin
        .from("automations")
        .select("id")
        .eq("automation_type", "post-session-followup")
        .eq("metadata->>session_id", session.id)
        .limit(1);

      if (existing && existing.length > 0) continue;

      // Mark session as completed
      await supabaseAdmin
        .from("sessions")
        .update({
          status: "completed",
          updated_at: now.toISOString(),
        })
        .eq("id", session.id);

      // Update lead status
      if (session.lead_id) {
        await supabaseAdmin
          .from("leads")
          .update({
            status: "completed",
            updated_at: now.toISOString(),
          })
          .eq("id", session.lead_id);
      }

      // Get booking link for rebooking CTA
      const { data: settings } = await supabaseAdmin
        .from("client_settings")
        .select("setting_value")
        .eq("client_id", session.client_id)
        .eq("setting_key", "booking_link")
        .single();

      const bookingLink =
        (settings?.setting_value as { url?: string })?.url || "#";

      const templateData = {
        leadName: session.leads.name || "there",
        clientName: session.clients.name,
        clientBusinessName: session.clients.business_name || session.clients.name,
        serviceType: session.clients.service_type || "service",
        sessionDate: formatDate(session.scheduled_time),
        bookingLink,
        paymentPending: session.payment_status === "pending",
        paymentAmount: session.payment_amount,
      };

      // Send follow-up to lead
      const leadResult = await sendEmail({
        to: session.leads.email,
        subject: postSessionLeadSubject(templateData),
        html: postSessionLeadHtml(templateData),
        tags: [
          { name: "workflow", value: "post-session" },
          { name: "recipient", value: "lead" },
          { name: "client_id", value: session.client_id },
        ],
      });

      // Send completion summary to client
      const clientResult = await sendEmail({
        to: session.clients.email,
        subject: postSessionClientSubject(templateData),
        html: postSessionClientHtml(templateData),
        tags: [
          { name: "workflow", value: "post-session" },
          { name: "recipient", value: "client" },
          { name: "client_id", value: session.client_id },
        ],
      });

      // Log automation
      await supabaseAdmin.from("automations").insert({
        client_id: session.client_id,
        automation_type: "post-session-followup",
        triggered_at: now.toISOString(),
        target_email: session.leads.email,
        status: leadResult.success && clientResult.success ? "sent" : "partial",
        metadata: {
          session_id: session.id,
          lead_id: session.lead_id,
          lead_email_sent: leadResult.success,
          client_email_sent: clientResult.success,
          payment_status: session.payment_status,
        },
      });

      results.sessions_completed++;
      if (leadResult.success) results.follow_ups_sent++;
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      ...results,
    });
  } catch (err) {
    console.error("[cron/post-session] Error:", err);
    return NextResponse.json(
      { error: "Cron job failed", details: String(err) },
      { status: 500 }
    );
  }
}
