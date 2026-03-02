/**
 * L2-W4 — Booking Confirmation & Setup
 *
 * Webhook endpoint that receives booking events from Calendly.
 * When a lead books a session, this workflow:
 *
 * 1. Receives Calendly webhook event
 * 2. Matches the booking to an existing lead via email
 * 3. Creates a session record in Supabase
 * 4. Sends confirmation emails to both lead and client
 * 5. Updates lead status to "booked"
 * 6. Logs the automation event
 *
 * Note: Google Calendar event creation + Zoom link are handled by Calendly.
 * We store the meeting link from the Calendly event data.
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/automation/supabase-admin";
import { sendEmail } from "@/lib/automation/email";
import {
  bookingConfirmationLeadSubject,
  bookingConfirmationLeadHtml,
  bookingConfirmationClientSubject,
  bookingConfirmationClientHtml,
} from "@/lib/automation/templates/booking-confirmation";

// ─── Calendly Webhook Types ─────────────────────────────────

interface CalendlyEvent {
  event: string; // "invitee.created" for new bookings
  payload: {
    invitee: {
      name: string;
      email: string;
    };
    event: {
      start_time: string; // ISO 8601
      end_time: string;
      location?: {
        join_url?: string; // Zoom link
        type?: string;
      };
      name?: string; // Event type name
    };
    tracking?: {
      utm_source?: string;
      utm_campaign?: string; // We can pass client_id here
    };
    questions_and_answers?: Array<{
      question: string;
      answer: string;
    }>;
  };
}

// ─── Helpers ────────────────────────────────────────────────

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
}

function getSessionDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
}

// ─── Route Handler ──────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body: CalendlyEvent = await request.json();

    // Only process new booking events
    if (body.event !== "invitee.created") {
      return NextResponse.json({ status: "ignored", reason: "Not a booking event" });
    }

    const { invitee, event: eventData, tracking } = body.payload;

    // Try to find the lead and client by matching the invitee email
    // First check if we have a lead with this email
    const { data: leads } = await supabaseAdmin
      .from("leads")
      .select("*, clients(*)")
      .eq("email", invitee.email)
      .in("status", ["new", "qualified"])
      .order("created_at", { ascending: false })
      .limit(1);

    let lead = leads?.[0];
    let client = lead?.clients;

    // If no lead found, check if client_id was passed via UTM tracking
    if (!lead && tracking?.utm_campaign) {
      const clientId = tracking.utm_campaign;
      const { data: clientData } = await supabaseAdmin
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();

      if (clientData) {
        client = clientData;

        // Create a lead record for this booking
        const { data: newLead } = await supabaseAdmin
          .from("leads")
          .insert({
            client_id: clientId,
            name: invitee.name,
            email: invitee.email,
            source: "calendly_direct",
            status: "qualified",
            qualification_score: 75, // Direct booking = reasonably qualified
          })
          .select()
          .single();

        lead = newLead;
      }
    }

    // If we still can't match to a client, log and return
    if (!client || !lead) {
      console.warn(
        "[calendly-booking] Could not match booking to a client:",
        invitee.email
      );
      return NextResponse.json(
        { status: "unmatched", message: "Could not match booking to a client" },
        { status: 200 } // Don't fail — Calendly will retry on errors
      );
    }

    const meetingLink =
      eventData.location?.join_url || "Link will be provided separately";
    const sessionDuration = getSessionDuration(
      eventData.start_time,
      eventData.end_time
    );

    // Create session record
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("sessions")
      .insert({
        client_id: client.id,
        lead_id: lead.id,
        scheduled_time: eventData.start_time,
        end_time: eventData.end_time,
        status: "scheduled",
        meeting_link: meetingLink,
        payment_status: "pending",
        payment_amount: client.hourly_rate
          ? (client.hourly_rate * sessionDuration) / 60
          : null,
      })
      .select()
      .single();

    if (sessionError) {
      console.error("[calendly-booking] Session insert error:", sessionError);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    // Update lead status to "booked"
    await supabaseAdmin
      .from("leads")
      .update({
        status: "booked",
        updated_at: new Date().toISOString(),
      })
      .eq("id", lead.id);

    // Build template data
    const rescheduleLink = `${process.env.NEXT_PUBLIC_APP_URL || ""}/reschedule/${session.id}`;
    const templateData = {
      leadName: invitee.name || lead.name || "there",
      clientName: client.name,
      clientBusinessName: client.business_name || client.name,
      serviceType: client.service_type || "service",
      sessionDate: formatDate(eventData.start_time),
      sessionTime: formatTime(eventData.start_time),
      sessionDuration,
      meetingLink,
      rescheduleLink,
    };

    // Send confirmation to lead
    const leadEmailResult = await sendEmail({
      to: invitee.email,
      subject: bookingConfirmationLeadSubject(templateData),
      html: bookingConfirmationLeadHtml(templateData),
      tags: [
        { name: "workflow", value: "booking-confirmation" },
        { name: "recipient", value: "lead" },
        { name: "client_id", value: client.id },
      ],
    });

    // Send notification to client
    const clientEmailResult = await sendEmail({
      to: client.email,
      subject: bookingConfirmationClientSubject(templateData),
      html: bookingConfirmationClientHtml(templateData),
      tags: [
        { name: "workflow", value: "booking-confirmation" },
        { name: "recipient", value: "client" },
        { name: "client_id", value: client.id },
      ],
    });

    // Log automation events
    await supabaseAdmin.from("automations").insert([
      {
        client_id: client.id,
        automation_type: "booking-confirmation-lead",
        triggered_at: new Date().toISOString(),
        target_email: invitee.email,
        status: leadEmailResult.success ? "sent" : "failed",
        metadata: {
          session_id: session.id,
          lead_id: lead.id,
          email_id: leadEmailResult.id,
        },
      },
      {
        client_id: client.id,
        automation_type: "booking-confirmation-client",
        triggered_at: new Date().toISOString(),
        target_email: client.email,
        status: clientEmailResult.success ? "sent" : "failed",
        metadata: {
          session_id: session.id,
          lead_id: lead.id,
          email_id: clientEmailResult.id,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      session_id: session.id,
      lead_id: lead.id,
      emails: {
        lead: leadEmailResult.success,
        client: clientEmailResult.success,
      },
    });
  } catch (err) {
    console.error("[calendly-booking] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "calendly-booking",
    description: "Calendly webhook receiver for new booking events.",
  });
}
