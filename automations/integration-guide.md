# Integration Guide — Campus BIB Automations

## Step-by-Step: From This Folder to Your Live System

---

## Step 1: Copy Files

Copy these two folders into your `campus-business-box` project:

```
FROM: automations/api/        →  TO: campus-business-box/app/api/
FROM: automations/lib/automation/  →  TO: campus-business-box/lib/automation/
```

Your project should look like this after copying:

```
campus-business-box/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/                    ← NEW (copied from automations/api/)
│   │   ├── webhooks/
│   │   │   ├── lead-capture/route.ts
│   │   │   └── calendly/route.ts
│   │   └── cron/
│   │       ├── reminders/route.ts
│   │       ├── no-show/route.ts
│   │       └── post-session/route.ts
│   ├── layout.tsx
│   └── ...
├── lib/
│   ├── automation/             ← NEW (copied from automations/lib/automation/)
│   │   ├── supabase-admin.ts
│   │   ├── email.ts
│   │   ├── cron-auth.ts
│   │   └── templates/
│   │       ├── lead-auto-response.ts
│   │       ├── booking-confirmation.ts
│   │       ├── reminders.ts
│   │       ├── post-session.ts
│   │       └── no-show-rebooking.ts
│   ├── supabase.ts             ← existing (client-side)
│   └── hooks/                  ← existing
└── ...
```

---

## Step 2: Install Packages

Run inside `campus-business-box/`:

```bash
npm install resend
```

That's it — `@supabase/supabase-js` is already installed.

---

## Step 3: Add Environment Variables

Add these to your `.env.local` file (and Vercel dashboard for production):

```env
# Already have these:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# NEW — add these:
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=re_xxxxxxxxxx
EMAIL_FROM=Campus BIB <onboarding@resend.dev>
CRON_SECRET=generate_a_random_secret_here
NEXT_PUBLIC_APP_URL=https://your-campus-bib-domain.vercel.app
```

**Where to find these:**

- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Dashboard → Settings → API → `service_role` (secret)
- `RESEND_API_KEY`: Resend Dashboard → API Keys
- `CRON_SECRET`: Generate with: `openssl rand -hex 32`
- `NEXT_PUBLIC_APP_URL`: Your Vercel deployment URL

---

## Step 4: Database Migration

Your existing schema is close but needs a few additions for the automation workflows.
Run this SQL in your Supabase SQL Editor:

```sql
-- Add booking_link to client_settings for each client
-- (This is where each client's Calendly URL is stored)
-- Example insert:
-- INSERT INTO client_settings (client_id, setting_key, setting_value)
-- VALUES ('uuid-here', 'booking_link', '{"url": "https://calendly.com/sarah-design"}');

-- Add service role access policy for automations (bypasses RLS)
-- The service role key already bypasses RLS, so no policy changes needed.

-- Optional: Add useful indexes for cron job queries
CREATE INDEX IF NOT EXISTS idx_sessions_status_time
  ON sessions(status, scheduled_time);
CREATE INDEX IF NOT EXISTS idx_sessions_status_end_time
  ON sessions(status, end_time);
CREATE INDEX IF NOT EXISTS idx_automations_type_metadata
  ON automations(automation_type);
```

---

## Step 5: Set Up Cron Jobs (Supabase pg_cron — Free Tier)

In your Supabase SQL Editor, enable pg_cron and add the scheduled jobs:

```sql
-- Enable the pg_cron extension (if not already enabled)
-- Go to: Supabase Dashboard → Database → Extensions → Search "pg_cron" → Enable

-- Add cron jobs that call your API endpoints
-- Replace YOUR_APP_URL and YOUR_CRON_SECRET with actual values

-- Session reminders — every hour
SELECT cron.schedule(
  'session-reminders',
  '0 * * * *',
  $$
  SELECT net.http_get(
    'https://YOUR_APP_URL/api/cron/reminders',
    headers := '{"x-cron-secret": "YOUR_CRON_SECRET"}'::jsonb
  );
  $$
);

-- No-show handler — every 15 minutes
SELECT cron.schedule(
  'no-show-handler',
  '*/15 * * * *',
  $$
  SELECT net.http_get(
    'https://YOUR_APP_URL/api/cron/no-show',
    headers := '{"x-cron-secret": "YOUR_CRON_SECRET"}'::jsonb
  );
  $$
);

-- Post-session follow-up — every hour
SELECT cron.schedule(
  'post-session-followup',
  '0 * * * *',
  $$
  SELECT net.http_get(
    'https://YOUR_APP_URL/api/cron/post-session',
    headers := '{"x-cron-secret": "YOUR_CRON_SECRET"}'::jsonb
  );
  $$
);
```

**Note:** You also need the `pg_net` extension enabled for HTTP calls from pg_cron.
Go to: Supabase Dashboard → Database → Extensions → Search "pg_net" → Enable.

---

## Step 6: Connect Webhooks

### Lead Capture Webhook

Your PomsConvert signup form (or any lead form) should POST to:

```
https://YOUR_APP_URL/api/webhooks/lead-capture
```

Payload format:

```json
{
  "client_id": "your-client-uuid",
  "name": "Jordan P.",
  "email": "jordan@example.com",
  "service_requested": "Logo Design",
  "budget_range": "$500",
  "timeline": "ASAP",
  "source": "website"
}
```

### Calendly Webhook

In your Calendly account:

1. Go to Integrations → Webhooks
2. Subscribe to `invitee.created` events
3. Webhook URL: `https://YOUR_APP_URL/api/webhooks/calendly`

---

## Step 7: Test

1. **Test lead capture**: Send a test POST to your lead-capture endpoint
2. **Check Supabase**: Verify the lead appeared in the `leads` table
3. **Check email**: Verify you received the auto-response
4. **Test cron**: Hit `/api/cron/reminders` directly in browser (works in dev mode)
5. **Deploy**: Push to main → Vercel auto-deploys → crons start running

---

## Upgrading to Vercel Pro (When You Have 3+ Clients)

If you switch from pg_cron to Vercel cron, add this to your `vercel.json`:

```json
{
  "crons": [
    { "path": "/api/cron/reminders", "schedule": "0 * * * *" },
    { "path": "/api/cron/no-show", "schedule": "*/15 * * * *" },
    { "path": "/api/cron/post-session", "schedule": "0 * * * *" }
  ]
}
```

Then remove the pg_cron jobs from Supabase (to avoid double-running):

```sql
SELECT cron.unschedule('session-reminders');
SELECT cron.unschedule('no-show-handler');
SELECT cron.unschedule('post-session-followup');
```
