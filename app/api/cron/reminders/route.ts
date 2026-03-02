/**
 * L2-W7 — Session Reminders (Cron)
 *
 * Runs every hour (via Supabase pg_cron or Vercel cron).
 * Checks for upcoming sessions and sends reminders:
 *   - 24-hour reminder: sessions starting in 23-24 hours
 *   - 1-hour reminder: sessions starting in 0-1 hour
 *
 * Multi-tenant: processes ALL clients' sessions in a single run.
 * Uses the `automations` table to track what's been sent (idempotent).
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/automation/supabase-admin";
import { verifyCronRequest, unauthorizedResponse } from "@/lib/automation/cron-auth";
import { sendEmail } from "@/lib/automation/email";
import {
  reminder24hrSubject,
  reminder24hrLeadHtml,
  reminder24hrClientHtml,
  reminder1hrSubject,
  reminder1hrLeadHtml,
  reminder1hrClientHtml,
} from "@/lib/automation/templates/reminders";

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
    timeZoneName: "short",
  });
}

// ─── Route Handler ──────────────────────────────────────────

export async function GET(request: NextRequest) {
  if (!verifyCronRequest(request)) {
    return unauthorizedResponse();
  }

  const now = new Date();
  const results = {
    reminders_24hr_sent: 0,
    reminders_1hr_sent: 0,
    errors: [] as string[],
  };

  try {
    // ─── 24-Hour Reminders ────────────────────────────────
    const twentyThreeHours = new Date(now.getTime() + 23 * 60 * 60 * 1000);
    const twentyFourHours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find sessions starting in the 23-24 hour window that haven't been reminded yet
    // We check the automations table to see if a 24hr reminder was already sent
    const { data: sessions24hr } = await supabaseAdmin
      .from("sessions")
      .select("*, leads!inner(name, email), clients!inner(name, email, business_name, service_type)")
      .eq("status", "scheduled")
      .gte("scheduled_time", twentyThreeHours.toISOString())
      .lte("scheduled_time", twentyFourHours.toISOString());

    for (const session of sessions24hr || []) {
      // Check if 24hr reminder already sent (idempotency)
      const { data: existing } = await supabaseAdmin
        .from("automations")
        .select("id")
        .eq("automation_type", "reminder-24hr")
        .eq("metadata->>session_id", session.id)
        .limit(1);

      if (existing && existing.length > 0) continue; // Already sent

      const templateData = {
        leadName: session.leads.name || "there",
        clientName: session.clients.name,
        clientBusinessName: session.clients.business_name || session.clients.name,
        serviceType: session.clients.service_type || "service",
        sessionDate: formatDate(session.scheduled_time),
        sessionTime: formatTime(session.scheduled_time),
        meetingLink: session.meeting_link || "#",
        rescheduleLink: `${process.env.NEXT_PUBLIC_APP_URL || ""}/reschedule/${session.id}`,
      };

      // Send to lead
      const leadResult = await sendEmail({
        to: session.leads.email,
        subject: reminder24hrSubject(templateData),
        html: reminder24hrLeadHtml(templateData),
        tags: [
          { name: "workflow", value: "reminder-24hr" },
          { name: "client_id", value: session.client_id },
        ],
      });

      // Send to client
      const clientResult = await sendEmail({
        to: session.clients.email,
        subject: reminder24hrSubject(templateData),
        html: reminder24hrClientHtml(templateData),
        tags: [
          { name: "workflow", value: "reminder-24hr" },
          { name: "recipient", value: "client" },
        ],
      });

      // Log automation (also serves as idempotency marker)
      await supabaseAdmin.from("automations").insert({
        client_id: session.client_id,
        automation_type: "reminder-24hr",
        triggered_at: now.toISOString(),
        target_email: session.leads.email,
        status: leadResult.success && clientResult.success ? "sent" : "partial",
        metadata: {
          session_id: session.id,
          lead_email_id: leadResult.id,
          client_email_id: clientResult.id,
          lead_success: leadResult.success,
          client_success: clientResult.success,
        },
      });

      results.reminders_24hr_sent++;
    }

    // ─── 1-Hour Reminders ─────────────────────────────────
    const oneHour = new Date(now.getTime() + 60 * 60 * 1000);

    const { data: sessions1hr } = await supabaseAdmin
      .from("sessions")
      .select("*, leads!inner(name, email), clients!inner(name, email, business_name, service_type)")
      .eq("status", "scheduled")
      .gte("scheduled_time", now.toISOString())
      .lte("scheduled_time", oneHour.toISOString());

    for (const session of sessions1hr || []) {
      // Idempotency check
      const { data: existing } = await supabaseAdmin
        .from("automations")
        .select("id")
        .eq("automation_type", "reminder-1hr")
        .eq("metadata->>session_id", session.id)
        .limit(1);

      if (existing && existing.length > 0) continue;

      const templateData = {
        leadName: session.leads.name || "there",
        clientName: session.clients.name,
        clientBusinessName: session.clients.business_name || session.clients.name,
        serviceType: session.clients.service_type || "service",
        sessionDate: formatDate(session.scheduled_time),
        sessionTime: formatTime(session.scheduled_time),
        meetingLink: session.meeting_link || "#",
        rescheduleLink: `${process.env.NEXT_PUBLIC_APP_URL || ""}/reschedule/${session.id}`,
      };

      // Send to lead
      const leadResult = await sendEmail({
        to: session.leads.email,
        subject: reminder1hrSubject(templateData),
        html: reminder1hrLeadHtml(templateData),
        tags: [
          { name: "workflow", value: "reminder-1hr" },
          { name: "client_id", value: session.client_id },
        ],
      });

      // Send to client
      const clientResult = await sendEmail({
        to: session.clients.email,
        subject: reminder1hrSubject(templateData),
        html: reminder1hrClientHtml(templateData),
        tags: [
          { name: "workflow", value: "reminder-1hr" },
          { name: "recipient", value: "client" },
        ],
      });

      // Log
      await supabaseAdmin.from("automations").insert({
        client_id: session.client_id,
        automation_type: "reminder-1hr",
        triggered_at: now.toISOString(),
        target_email: session.leads.email,
        status: leadResult.success && clientResult.success ? "sent" : "partial",
        metadata: {
          session_id: session.id,
          lead_email_id: leadResult.id,
          client_email_id: clientResult.id,
        },
      });

      results.reminders_1hr_sent++;
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      ...results,
    });
  } catch (err) {
    console.error("[cron/reminders] Error:", err);
    return NextResponse.json(
      { error: "Cron job failed", details: String(err) },
      { status: 500 }
    );
  }
}
