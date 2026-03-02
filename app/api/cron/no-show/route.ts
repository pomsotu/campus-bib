/**
 * L2-W8 — No-Show Handler (Cron)
 *
 * Runs every 15 minutes (via Supabase pg_cron or Vercel cron).
 * Detects sessions that have passed without being marked as completed.
 *
 * Flow:
 * 1. Find sessions where end_time has passed and status is still "scheduled"
 * 2. Wait 30 minutes after end_time before marking (grace period)
 * 3. Send check-in notification to client: "Did this session happen?"
 * 4. If no manual status change after 2 hours → auto-mark as no-show
 * 5. Send rebooking offer to the lead
 * 6. Notify the client
 *
 * We handle this in two stages:
 *   Stage 1 (30min after end): Send check-in to client
 *   Stage 2 (2hr after end): Auto-mark no-show + send rebooking to lead
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/automation/supabase-admin";
import { verifyCronRequest, unauthorizedResponse } from "@/lib/automation/cron-auth";
import { sendEmail } from "@/lib/automation/email";
import {
  noShowRebookingLeadSubject,
  noShowRebookingLeadHtml,
  noShowClientSubject,
  noShowClientHtml,
} from "@/lib/automation/templates/no-show-rebooking";

// ─── Helpers ────────────────────────────────────────────────

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ─── Route Handler ──────────────────────────────────────────

export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request)) {
    return unauthorizedResponse();
  }

  const now = new Date();
  const thirtyMinAgo = new Date(now.getTime() - 30 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  const results = {
    check_ins_sent: 0,
    no_shows_marked: 0,
    rebooking_emails_sent: 0,
    errors: [] as string[],
  };

  try {
    // ─── Stage 1: Check-in (30min+ after end, still "scheduled") ──
    // Send a gentle check-in to the client asking if the session happened
    const { data: checkInSessions } = await supabaseAdmin
      .from("sessions")
      .select("*, leads!inner(name, email), clients!inner(name, email, business_name, service_type)")
      .eq("status", "scheduled")
      .lt("end_time", thirtyMinAgo.toISOString())
      .gte("end_time", twoHoursAgo.toISOString()); // Not yet in 2hr window

    for (const session of checkInSessions || []) {
      // Check if check-in already sent
      const { data: existing } = await supabaseAdmin
        .from("automations")
        .select("id")
        .eq("automation_type", "no-show-check-in")
        .eq("metadata->>session_id", session.id)
        .limit(1);

      if (existing && existing.length > 0) continue;

      // Send check-in to client (not the lead yet — give client a chance to respond)
      const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/sessions`;
      await sendEmail({
        to: session.clients.email,
        subject: `Did your session with ${session.leads.name} happen?`,
        html: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                       max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a2e; line-height: 1.6;">
            <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h2 style="margin-top: 0;">Quick check-in 👋</h2>
              <p>Hey ${session.clients.name},</p>
              <p>Your session with <strong>${session.leads.name}</strong> was scheduled for 
              ${formatDate(session.scheduled_time)} at ${formatTime(session.scheduled_time)}.</p>
              <p>Did it happen? Please mark the status in your dashboard:</p>
              <div style="text-align: center; margin: 24px 0;">
                <a href="${dashboardUrl}" 
                   style="background-color: #6366f1; color: white; padding: 12px 28px; 
                          text-decoration: none; border-radius: 8px; font-weight: 600;
                          display: inline-block;">
                  Update Status →
                </a>
              </div>
              <p style="color: #6b7280; font-size: 14px;">
                If we don't hear back within 2 hours, we'll automatically mark it as a no-show 
                and send your lead a rebooking link.
              </p>
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">— Campus BIB</p>
            </div>
          </body>
          </html>
        `,
        tags: [
          { name: "workflow", value: "no-show-check-in" },
          { name: "client_id", value: session.client_id },
        ],
      });

      // Log check-in
      await supabaseAdmin.from("automations").insert({
        client_id: session.client_id,
        automation_type: "no-show-check-in",
        triggered_at: now.toISOString(),
        target_email: session.clients.email,
        status: "sent",
        metadata: { session_id: session.id },
      });

      results.check_ins_sent++;
    }

    // ─── Stage 2: Auto no-show (2hr+ after end, still "scheduled") ──
    const { data: noShowSessions } = await supabaseAdmin
      .from("sessions")
      .select("*, leads!inner(name, email), clients!inner(name, email, business_name, service_type)")
      .eq("status", "scheduled")
      .lt("end_time", twoHoursAgo.toISOString());

    for (const session of noShowSessions || []) {
      // Check if already processed
      const { data: existing } = await supabaseAdmin
        .from("automations")
        .select("id")
        .eq("automation_type", "no-show-auto-mark")
        .eq("metadata->>session_id", session.id)
        .limit(1);

      if (existing && existing.length > 0) continue;

      // Mark session as no-show
      await supabaseAdmin
        .from("sessions")
        .update({
          status: "no-show",
          updated_at: now.toISOString(),
        })
        .eq("id", session.id);

      // Get booking link for rebooking
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
        sessionTime: formatTime(session.scheduled_time),
        bookingLink,
      };

      // Send rebooking email to lead
      const leadResult = await sendEmail({
        to: session.leads.email,
        subject: noShowRebookingLeadSubject(templateData),
        html: noShowRebookingLeadHtml(templateData),
        tags: [
          { name: "workflow", value: "no-show-rebooking" },
          { name: "client_id", value: session.client_id },
        ],
      });

      // Notify client that it's been handled
      const clientResult = await sendEmail({
        to: session.clients.email,
        subject: noShowClientSubject(templateData),
        html: noShowClientHtml(templateData),
        tags: [
          { name: "workflow", value: "no-show-notification" },
          { name: "client_id", value: session.client_id },
        ],
      });

      // Log
      await supabaseAdmin.from("automations").insert({
        client_id: session.client_id,
        automation_type: "no-show-auto-mark",
        triggered_at: now.toISOString(),
        target_email: session.leads.email,
        status: "sent",
        metadata: {
          session_id: session.id,
          lead_email_sent: leadResult.success,
          client_email_sent: clientResult.success,
        },
      });

      results.no_shows_marked++;
      if (leadResult.success) results.rebooking_emails_sent++;
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      ...results,
    });
  } catch (err) {
    console.error("[cron/no-show] Error:", err);
    return NextResponse.json(
      { error: "Cron job failed", details: String(err) },
      { status: 500 }
    );
  }
}
