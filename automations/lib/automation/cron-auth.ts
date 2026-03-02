/**
 * Cron endpoint security.
 *
 * Vercel cron jobs send a secret in the Authorization header.
 * This module verifies that the request is from a legitimate cron trigger
 * and not a random external call.
 *
 * For Supabase pg_cron (our free-tier strategy), the cron job calls
 * these endpoints via HTTP — we verify with the same shared secret.
 */

import { NextRequest } from "next/server";

/**
 * Verify that a cron request is authorized.
 *
 * Checks the `Authorization` header for Vercel cron secret,
 * or falls back to a custom `x-cron-secret` header for pg_cron.
 *
 * In development, all cron requests are allowed (no secret required).
 */
export function verifyCronRequest(request: NextRequest): boolean {
  // Allow all cron requests in development
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  const cronSecret = process.env.CRON_SECRET;

  // If no secret is configured, deny all requests in production
  if (!cronSecret) {
    console.error("[cron-auth] CRON_SECRET not configured — denying request");
    return false;
  }

  // Check Vercel's Authorization header (format: "Bearer <secret>")
  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  // Check custom header for pg_cron or manual triggers
  const customHeader = request.headers.get("x-cron-secret");
  if (customHeader === cronSecret) {
    return true;
  }

  console.warn("[cron-auth] Unauthorized cron request denied");
  return false;
}

/**
 * Standard unauthorized response for denied cron requests.
 */
export function unauthorizedResponse() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
