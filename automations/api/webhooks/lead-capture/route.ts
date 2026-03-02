/**
 * L1-W1 + L2-W1 — Lead Capture & Qualification
 *
 * Webhook endpoint that receives lead submissions from any source
 * (website forms, Tally, direct API calls).
 *
 * Flow:
 * 1. Receive lead data via POST
 * 2. Validate required fields
 * 3. Insert into `leads` table with correct `client_id`
 * 4. Run qualification logic against client's criteria
 * 5. If qualified → send booking link email
 * 6. If not qualified → send polite holding email
 * 7. Log automation event
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/automation/supabase-admin";
import { sendEmail } from "@/lib/automation/email";
import {
  leadAutoResponseSubject,
  leadAutoResponseHtml,
} from "@/lib/automation/templates/lead-auto-response";

// ─── Types ───────────────────────────────────────────────────

interface LeadCapturePayload {
  /** The client this lead belongs to. Required for multi-tenancy. */
  client_id: string;
  name: string;
  email: string;
  phone?: string;
  service_requested?: string;
  budget_range?: string;
  timeline?: string;
  source?: string; // 'website', 'tally', 'referral', 'instagram', etc.
  notes?: string;
}

interface ClientConfig {
  id: string;
  name: string;
  business_name: string;
  service_type: string;
  hourly_rate: number | null;
  exam_mode_enabled: boolean;
  // Calendly link stored in client_settings or as a field
}

// ─── Qualification Logic ─────────────────────────────────────

function calculateQualificationScore(
  lead: LeadCapturePayload,
  client: ClientConfig
): { score: number; qualified: boolean } {
  let score = 0;

  // Budget check (30 points)
  if (lead.budget_range) {
    const budgetNum = parseBudgetRange(lead.budget_range);
    if (client.hourly_rate && budgetNum >= client.hourly_rate) {
      score += 30;
    } else if (budgetNum > 0) {
      score += 15; // Partial match
    }
  } else {
    score += 15; // No budget specified = neutral
  }

  // Service type match (30 points)
  if (lead.service_requested) {
    const serviceMatch =
      client.service_type &&
      lead.service_requested
        .toLowerCase()
        .includes(client.service_type.toLowerCase());
    score += serviceMatch ? 30 : 10;
  } else {
    score += 15; // No service specified = neutral
  }

  // Timeline feasibility (20 points)
  if (lead.timeline) {
    const urgentTimelines = ["asap", "this week", "urgent", "immediately"];
    const isUrgent = urgentTimelines.some((t) =>
      lead.timeline!.toLowerCase().includes(t)
    );
    score += isUrgent ? 20 : 15;
  } else {
    score += 10;
  }

  // Has contact info (20 points)
  score += lead.email ? 10 : 0;
  score += lead.phone ? 5 : 0;
  score += lead.name ? 5 : 0;

  return {
    score,
    qualified: score >= 50, // 50+ out of 100 = qualified
  };
}

function parseBudgetRange(budget: string): number {
  // Extract the first number from budget strings like "$500", "$200-500", "200"
  const match = budget.replace(/[,$]/g, "").match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

// ─── Route Handler ───────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body: LeadCapturePayload = await request.json();

    // Validate required fields
    if (!body.client_id || !body.email || !body.name) {
      return NextResponse.json(
        { error: "Missing required fields: client_id, name, email" },
        { status: 400 }
      );
    }

    // Fetch client configuration
    const { data: client, error: clientError } = await supabaseAdmin
      .from("clients")
      .select("id, name, business_name, service_type, hourly_rate, exam_mode_enabled")
      .eq("id", body.client_id)
      .single();

    if (clientError || !client) {
      return NextResponse.json(
        { error: `Client not found: ${body.client_id}` },
        { status: 404 }
      );
    }

    // Check exam mode — if enabled, we still capture but respond differently
    // (Waitlist logic will be added in L2-W6, for now just capture)

    // Run qualification
    const { score, qualified } = calculateQualificationScore(body, client);

    // Insert lead into database
    const { data: lead, error: insertError } = await supabaseAdmin
      .from("leads")
      .insert({
        client_id: body.client_id,
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        service_requested: body.service_requested || null,
        budget_range: body.budget_range || null,
        timeline: body.timeline || null,
        source: body.source || "website",
        status: qualified ? "qualified" : "new",
        qualification_score: score,
        notes: body.notes || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("[lead-capture] DB insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save lead" },
        { status: 500 }
      );
    }

    // Get booking link from client settings (Calendly link)
    let bookingLink = "";
    if (qualified) {
      const { data: settings } = await supabaseAdmin
        .from("client_settings")
        .select("setting_value")
        .eq("client_id", body.client_id)
        .eq("setting_key", "booking_link")
        .single();

      bookingLink = (settings?.setting_value as { url?: string })?.url || "";
    }

    // Send auto-response email
    const emailResult = await sendEmail({
      to: body.email,
      subject: leadAutoResponseSubject({
        leadName: body.name,
        clientBusinessName: client.business_name || client.name,
        clientServiceType: client.service_type || "service",
        isQualified: qualified,
        bookingLink,
      }),
      html: leadAutoResponseHtml({
        leadName: body.name,
        clientBusinessName: client.business_name || client.name,
        clientServiceType: client.service_type || "service",
        isQualified: qualified,
        bookingLink,
      }),
      tags: [
        { name: "workflow", value: "lead-capture" },
        { name: "client_id", value: body.client_id },
        { name: "qualified", value: String(qualified) },
      ],
    });

    // Log automation event
    await supabaseAdmin.from("automations").insert({
      client_id: body.client_id,
      automation_type: "lead-auto-response",
      triggered_at: new Date().toISOString(),
      target_email: body.email,
      status: emailResult.success ? "sent" : "failed",
      metadata: {
        lead_id: lead.id,
        qualification_score: score,
        qualified,
        email_id: emailResult.id,
        error: emailResult.error,
      },
    });

    return NextResponse.json({
      success: true,
      lead_id: lead.id,
      qualified,
      qualification_score: score,
      email_sent: emailResult.success,
    });
  } catch (err) {
    console.error("[lead-capture] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Also support GET for simple health check / Tally form redirects
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "lead-capture",
    description: "POST lead data to this endpoint to capture and qualify leads.",
  });
}
