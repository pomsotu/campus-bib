/**
 * Resend email service wrapper.
 * All outbound emails go through this module.
 *
 * Emails are personalized per client — the client's business name, service type,
 * and branding are pulled from the database and injected into templates.
 */

import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY environment variable");
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender — update this to your verified domain
const DEFAULT_FROM =
  process.env.EMAIL_FROM || "Campus BIB <onboarding@resend.dev>";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  /** Tags for tracking in Resend dashboard */
  tags?: Array<{ name: string; value: string }>;
}

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Send a single email via Resend.
 * Returns a result object — never throws, so callers can handle errors gracefully.
 */
export async function sendEmail(options: SendEmailOptions): Promise<EmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: options.from || DEFAULT_FROM,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
      tags: options.tags,
    });

    if (error) {
      console.error("[email] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error";
    console.error("[email] Exception:", message);
    return { success: false, error: message };
  }
}

/**
 * Send multiple emails in batch (up to 100 per call on Resend).
 * Useful for cron jobs that process many sessions/leads at once.
 */
export async function sendBatchEmails(
  emails: SendEmailOptions[]
): Promise<EmailResult[]> {
  const results: EmailResult[] = [];

  // Process in chunks of 10 to avoid rate limits on free tier
  const chunks = [];
  for (let i = 0; i < emails.length; i += 10) {
    chunks.push(emails.slice(i, i + 10));
  }

  for (const chunk of chunks) {
    const chunkResults = await Promise.allSettled(
      chunk.map((email) => sendEmail(email))
    );

    for (const result of chunkResults) {
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        results.push({ success: false, error: result.reason?.message });
      }
    }

    // Small delay between chunks to respect rate limits
    if (chunks.length > 1) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  return results;
}
