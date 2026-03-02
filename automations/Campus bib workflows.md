# **Campus Service Business-in-a-Box**

## **Complete Two-Layer Workflow Architecture — v3.0**

**Owner:** Mario Onyido / PomsConvert  
**Updated:** February 18, 2026

---

## **ARCHITECTURE OVERVIEW**

This system operates on two distinct layers. They share the same n8n instance and Supabase database but serve completely different purposes.

┌─────────────────────────────────────────────────────────────┐  
│                    LAYER 1: POMSCONVERT                     │  
│              Mario's business — acquiring and               │  
│              managing clients who pay him                   │  
└─────────────────────────────────────────────────────────────┘  
                              │  
              Onboarding deploys Layer 2 per client  
                              │  
                              ▼  
┌─────────────────────────────────────────────────────────────┐  
│                     LAYER 2: CLIENT                         │  
│         One instance per client, parameterized by           │  
│         client\_id — runs their entire business ops          │  
│                                                             │  
│   Client A (Sarah \- Design)    Client B (Jake \- Tutoring)  │  
│   client\_id: abc123            client\_id: def456           │  
│   Their leads, their sessions, Their leads, their sessions │  
│   their customers, their data  their customers, their data │  
└─────────────────────────────────────────────────────────────┘

**The key principle:** One set of n8n workflows serves all clients because every query, every email, every action is parameterized by `client_id`. Adding a new client means creating a new row in the `clients` table — not building new workflows.

---

# **LAYER 1: POMSCONVERT OPERATIONS**

*Mario's system for running PomsConvert as a business*

---

## **L1 — PHASE A: ACQUISITION**

*Capturing and converting student entrepreneurs into paying PomsConvert clients*

### **L1-W1 — PomsConvert Lead Capture & Qualification**

**Trigger:** Tally form submission (PomsConvert beta signup form)  
**Status:** 🔨 In Progress  
**Purpose:** Capture interest from student entrepreneurs and route qualified leads to a call

**Flow:**

1. Tally webhook → n8n receives submission  
2. Structure data: name, email, service\_type, monthly\_revenue, pain\_point, open\_to\_call  
3. Insert into `pomsconvert_leads` table (separate from client leads)  
4. Run qualification logic:  
   * Revenue: $1,000+ per month?  
   * Service: Digital deliverable?  
   * Open to call: Yes, definitely?  
5. **Qualified:** Send warm personal email with Calendly link → status: `qualified`  
6. **Not qualified:** Send holding email → status: `nurture`  
7. Log to `automations` table

---

### **L1-W2 — PomsConvert Lead Re-engagement**

**Trigger:** Cron (every 6 hours)  
 **Status:** 📋 Planned — Beta Launch  
 **Purpose:** Recover qualified leads who haven't booked a call yet

**Flow:**

1. Query qualified PomsConvert leads with no call booked after 48 hours  
2. Email \#1 (Day 2): Social proof angle — "Here's what Sarah saved last week"  
3. Email \#2 (Day 3): Urgency — "2 beta spots left at $149/month"  
4. Email \#3 (Day 4): Final close — soft, direct  
5. No response after all 3 → status: `cold`  
6. Log each email sent

---

## **L1 — PHASE B: ONBOARDING**

*Deploying a client's operational system in under 2 hours*

### **L1-W3 — New Client Deployment**

**Trigger:** Manual trigger by Mario (post payment confirmation)  
 **Status:** 📋 Planned — Beta Launch  
 **Purpose:** Set up a new client's Layer 2 system and make them feel the value immediately

**Flow:**

1. Mario triggers with: client name, email, service type, hourly rate, availability, calendar access  
2. Create client record in Supabase `clients` table with `client_id`  
3. Create default `client_settings` entries  
4. Send welcome email:  
   * Dashboard login credentials  
   * "Here's exactly what's now running for you" breakdown  
   * Kickoff call booking link  
5. Alert Mario: "Client \[name\] deployed — verify calendar integration"  
6. Log deployment

---

### **L1-W4 — Kickoff Call Scheduler**

**Trigger:** New row inserted into `clients` table  
 **Status:** 📋 Planned — Beta Launch  
 **Purpose:** Get client on a setup call within 24 hours of signing up

**Flow:**

1. New client created → webhook fires  
2. Send automated email within 5 minutes with Calendly link  
3. No booking after 48 hours → send one reminder  
4. Log to `automations`

---

### **L1-W5 — Go-Live Confirmation**

**Trigger:** Manual trigger by Mario (after kickoff call)  
 **Status:** 📋 Planned — Beta Launch  
 **Purpose:** Give clients confidence that their system is live and working

**Flow:**

1. Mario triggers post-kickoff call  
2. Pull client's configured settings  
3. Send "You're live" email:  
   * Every workflow now running on their behalf (by name)  
   * What their leads will experience from first contact  
   * Dashboard walkthrough link  
   * Mario's direct line for questions  
4. Update client record: `onboarding_complete: true`  
5. Log

---

## **L1 — PHASE C: CLIENT RELATIONSHIP MANAGEMENT**

*Keeping clients successful, retained, and growing*

### **L1-W6 — Client Health Monitoring**

**Trigger:** Cron (every Sunday)  
 **Status:** 📋 Planned — Post-Beta  
 **Purpose:** Proactively catch clients who are struggling before they churn

**Flow:**

1. For each active client, calculate weekly health score:  
   * Sessions delivered (30%)  
   * Payment collection rate (25%)  
   * Lead conversion rate (25%)  
   * No-show rate (20%)  
2. Write score to `client_settings`  
3. Score below 60 → alert Mario \+ trigger L1-W7  
4. Score above 90 for 3 consecutive weeks → trigger L2-W17 (testimonial)

---

### **L1-W7 — Churn Risk Intervention**

**Trigger:** Health score drops below 60 OR zero leads in 10 days  
 **Status:** 📋 Planned — Post-Beta  
 **Purpose:** Intervene before a client decides to cancel

**Flow:**

1. Alert Mario with full client context (metrics, history, issues)  
2. Send client check-in: "How's everything going? Anything we can improve?"  
3. Log response and Mario's follow-up action  
4. If no response in 48 hours → escalate to Mario for direct call

---

### **L1-W8 — Upsell Detection**

**Trigger:** Cron (weekly)  
 **Status:** 📋 Planned — Scale Phase  
 **Purpose:** Identify clients ready for a higher tier or expanded service

**Flow:**

1. Identify clients at 90%+ session capacity for 2+ consecutive weeks  
2. Alert Mario with upsell context  
3. Send client message: "You've been maxing out — here's how we scale you further"  
4. Mario follows up with upgrade conversation  
5. Log outcome

---

### **L1-W9 — Monthly Client ROI Report**

**Trigger:** Cron (1st of each month)  
 **Status:** 📋 Planned — Beta Launch  
 **Purpose:** Remind clients why they're paying — make the value undeniable

**Flow:**

1. Pull each client's month metrics from Supabase:  
   * Sessions delivered  
   * Leads processed  
   * Estimated hours saved (sessions × avg coordination time)  
   * Payment collection rate  
   * No-show rate vs baseline  
2. Send personalized ROI summary email  
3. Include one insight \+ one recommended action for next month  
4. Log delivery

---

### **L1-W10 — Referral Program**

**Trigger:** Client completes 3rd successful session  
 **Status:** 📋 Planned — Beta Launch  
 **Purpose:** Turn happy clients into PomsConvert's acquisition channel

**Flow:**

1. Query clients who hit 3 completed sessions this week  
2. Send referral ask with unique tracking link:  
   * "Know another student entrepreneur who'd benefit?"  
   * Incentive: They get first month at $99, you get a free month  
3. Referral link clicked → track source, new lead enters L1-W1  
4. Referral converts → apply credit, send thank you to both parties  
5. Log all referral events

---

---

# **LAYER 2: CLIENT OPERATIONS SYSTEM**

*Runs autonomously for each client, parameterized by client\_id* *This is what clients pay for. This is the product.*

---

## **L2 — PHASE 1: LEAD CAPTURE & QUALIFICATION**

*Turning strangers into qualified, booked leads automatically*

### **L2-W1 — Client Lead Intake & Auto-Response**

**Trigger:** Client's Tally form submission  
 **Status:** 📋 Planned — Beta Launch  
 **Purpose:** Capture every lead instantly and respond before a competitor does

**Flow:**

1. Lead submits client's Tally form → webhook fires with `client_id`  
2. Insert lead into `leads` table linked to correct `client_id`  
3. Send instant auto-response (within 60 seconds):  
   * Branded with client's business name  
   * "Thanks for reaching out — here's what happens next"  
   * Sets expectation for booking link incoming  
4. Run qualification check against client's configured criteria:  
   * Budget in range?  
   * Service type match?  
   * Timeline feasible?  
5. **Qualified:** Send booking link email → status: `qualified`  
6. **Not qualified:** Send polite response → status: `unqualified`  
7. Dashboard updates in real-time  
8. Log to `automations`

---

### **L2-W2 — Lead Follow-up Sequence**

**Trigger:** Cron (every 6 hours)  
 **Status:** 📋 Planned — Beta Launch  
 **Purpose:** Recover qualified leads who go cold before booking

**Flow:**

1. Query qualified leads with no booking after 48 hours  
2. Email \#1 (Day 2): Soft nudge — "Still interested? Here are available times"  
3. Email \#2 (Day 3): Light urgency — "Spots filling up this week"  
4. Email \#3 (Day 4): Final touch — "Last chance to grab a slot this week"  
5. No response → status: `cold`, visible in client dashboard  
6. Client can manually re-engage cold leads from dashboard  
7. Log each touchpoint

---

### **L2-W3 — Lead Source Tracking & Insight**

**Trigger:** Cron (1st of each month)  
 **Status:** 📋 Planned — Scale Phase  
 **Purpose:** Tell clients where their best leads come from so they double down

**Flow:**

1. Pull all leads from past 30 days grouped by `source`  
2. Calculate conversion rate per source  
3. Send client actionable insight:  
   * "Your top lead source last month was referrals (73% conversion)"  
   * Recommended action specific to their top source  
4. Log insight delivery

---

## **L2 — PHASE 2: BOOKING & SCHEDULING**

*Zero back-and-forth. Lead picks a time, everything else is handled.*

### **L2-W4 — Booking Confirmation & Setup**

**Trigger:** Calendly webhook (new booking)  
 **Status:** 📋 Planned — Showcase  
 **Purpose:** Confirm the booking and set both parties up for a smooth session

**Flow:**

1. Calendly webhook → match booking to lead via email  
2. Create session in `sessions` table (status: `scheduled`)  
3. Create Google Calendar event with auto-generated Zoom link  
4. Send confirmation to lead:  
   * Date, time, Zoom link  
   * What to prepare / bring  
   * Reschedule link if needed  
5. Send notification to client:  
   * "New session booked: \[Lead Name\] — \[Date/Time\]"  
   * Session added to their Google Calendar  
6. Update lead status: `booked`  
7. Dashboard updates immediately  
8. Log

---

### **L2-W5 — Rescheduling Handler**

**Trigger:** Lead clicks reschedule link in any email  
 **Status:** 📋 Planned — Beta Launch  
 **Purpose:** Handle rescheduling without any manual work from client

**Flow:**

1. Lead clicks reschedule → webhook fires  
2. Cancel original Google Calendar event  
3. Update session status: `rescheduled`  
4. Send lead new availability link (client's Calendly)  
5. Notify client: "\[Lead\] rescheduled — new booking link sent automatically"  
6. When lead rebooks → L2-W4 handles the new booking  
7. Log

---

### **L2-W6 — Waitlist Manager (Exam Mode)**

**Trigger:** Client toggles Exam Mode in dashboard  
 **Status:** 📋 Planned — Beta Launch  
 **Purpose:** Pause new bookings during exam periods without losing leads

**Flow:**

1. Client enables Exam Mode → `exam_mode_enabled: true` in Supabase  
2. Pause all new booking link sends  
3. New leads get auto-reply: "Currently at capacity — back \[date\]. Join the waitlist."  
4. Collect waitlist entries in `leads` table with status: `waitlisted`  
5. Client disables Exam Mode → automatically notify all waitlisted leads with booking link  
6. Alert Mario when client enters/exits exam mode  
7. Log all state changes

---

## **L2 — PHASE 3: SESSION MANAGEMENT**

*Reducing no-shows, protecting client revenue, running sessions smoothly*

### **L2-W7 — Session Reminders**

**Trigger:** Cron (every hour)  
 **Status:** 📋 Planned — Showcase  
 **Purpose:** Eliminate no-shows with timely, automatic reminders

**Flow:**

1. Query sessions starting in next 24 hours with `reminder_24hr_sent: false`  
2. Send 24-hour reminder to both client and lead:  
   * Session details, Zoom link, prep notes  
   * Reschedule link  
   * Mark `reminder_24hr_sent: true`  
3. Query sessions starting in next 1 hour with `reminder_1hr_sent: false`  
4. Send 1-hour reminder:  
   * "Starting in 1 hour"  
   * Direct Zoom link — one click to join  
   * Mark `reminder_1hr_sent: true`  
5. Log all reminders

---

### **L2-W8 — No-Show Handler**

**Trigger:** Cron (every 15 minutes)  
 **Status:** 📋 Planned — Showcase  
 **Purpose:** Handle no-shows immediately and attempt recovery automatically

**Flow:**

1. Query sessions where end\_time passed AND status still `scheduled`  
2. Send check-in to client: "Did this session happen?"  
   * Mark Completed / No-show / Still happening  
3. Client marks no-show:  
   * Update session status: `no-show`  
   * Automatically send rebooking offer to lead within 15 minutes  
4. No client response in 2 hours → auto-mark no-show, alert Mario  
5. Track no-show rate per client in dashboard  
6. Log

---

### **L2-W9 — Post-Session Follow-up**

**Trigger:** Cron (every hour — checks sessions that ended 1 hour ago)  
 **Status:** 📋 Planned — Showcase  
 **Purpose:** Close the loop, collect feedback, drive rebooking automatically

**Flow:**

1. Query sessions ended 1 hour ago with status still `scheduled`  
2. Update status: `completed`  
3. Send to lead (branded as client's business):  
   * Personalized thank you with session type context  
   * Feedback/review request link  
   * "Book your next session" CTA  
   * Payment reminder if `payment_status: pending`  
4. Send summary to client:  
   * Session marked complete  
   * Payment status  
   * "Add session notes" link in dashboard  
5. Update dashboard metrics  
6. Log

---

## **L2 — PHASE 4: PAYMENT MANAGEMENT**

*Protecting client revenue without awkward conversations*

### **L2-W10 — Invoice & Payment Tracking**

**Trigger:** Session booking confirmed (L2-W4)  
 **Status:** 📋 Planned — Beta Launch  
 **Purpose:** Send invoice automatically so payment expectation is set from day one

**Flow:**

1. Session booked → generate invoice record in `sessions` table  
2. If client prefers payment before session → send invoice immediately with booking confirmation  
3. If client prefers payment after → send invoice in post-session follow-up (L2-W9 handles this)  
4. Mark `invoice_sent_at` timestamp  
5. Log

---

### **L2-W11 — Payment Nudge Sequence**

**Trigger:** Cron (daily at 9am)  
 **Status:** 📋 Planned — Beta Launch  
 **Purpose:** Recover unpaid invoices without the client having to chase manually

**Flow:**

1. Query sessions where `payment_status: pending` AND `invoice_sent_at` \> 24 hours ago  
2. Day 1: Gentle reminder to lead — "Friendly reminder about your session on \[date\]"  
3. Day 3: Second nudge — slightly more direct  
4. Day 7: Notify client — "\[Lead\] hasn't paid — you may want to follow up directly"  
5. Day 7+: Update `payment_status: overdue`, flag in dashboard  
6. Client can mark as paid manually from dashboard  
7. Log every touchpoint

---

## **L2 — PHASE 5: CLIENT GROWTH ENGINE**

*Turning satisfied customers into more revenue automatically*

### **L2-W12 — Rebooking Campaign**

**Trigger:** Cron (checks weekly)  
 **Status:** 📋 Planned — Beta Launch  
 **Purpose:** Recover leads who completed a session but haven't rebooked

**Flow:**

1. Query leads with status `completed` and no new session in past 14 days  
2. Send "We miss you" rebooking email with booking link  
3. No response in 7 days → one final nudge  
4. Reactivated leads enter normal booking flow (L2-W4)  
5. Log rebooking attempts and conversions

---

### **L2-W13 — Referral Automation**

**Trigger:** Lead completes 2nd session with client  
 **Status:** 📋 Planned — Beta Launch  
 **Purpose:** Turn happy customers into lead sources for the client

**Flow:**

1. Lead completes 2nd session → trigger referral ask  
2. Send to lead (from client's brand):  
   * "Enjoying our sessions? Know someone who could use \[service type\]?"  
   * Client's unique referral link  
   * Incentive defined by client (e.g. 10% off next session for referrer)  
3. Referral link clicked → new lead enters L2-W1 with `source: referral`  
4. Conversion tracked in dashboard  
5. Log all referral activity

---

### **L2-W14 — Review & Testimonial Request**

**Trigger:** Lead completes 3rd session with client  
 **Status:** 📋 Planned — Scale Phase  
 **Purpose:** Build the client's social proof automatically

**Flow:**

1. 3rd session completed → send review request to lead  
2. Options: Google review / short written testimonial form  
3. Response received → notify client via dashboard notification  
4. Client approves → testimonial stored in their profile for future use  
5. No response → one follow-up after 5 days  
6. Log

---

### **L2-W15 — Capacity Alert & Slot Management**

**Trigger:** Cron (weekly Monday)  
 **Status:** 📋 Planned — Scale Phase  
 **Purpose:** Help clients scale their session volume proactively

**Flow:**

1. Calculate client's bookings vs stated weekly capacity  
2. At 80% capacity → notify client:  
   * "You're nearly full — open more slots or enable waitlist?"  
3. Client response updates availability in real-time  
4. At 100% capacity → automatically enable basic waitlist for new leads  
5. Log capacity events

---

## **L2 — PHASE 6: UPSELL & EXPANSION**

*(Future — unlocked as client grows)*

### **L2-W16 — Performance Digest (Weekly)**

**Trigger:** Cron (every Monday morning)  
 **Status:** 📋 Planned — Scale Phase  
 **Purpose:** Give clients visibility into their business performance at a glance

**Flow:**

1. Pull last 7 days metrics per client  
2. Send digest:  
   * Sessions completed  
   * New leads  
   * Conversion rate  
   * Revenue collected  
   * Time saved estimate  
   * One actionable insight  
3. Log delivery

---

### **L2-W17 — Package Upsell Trigger**

**Trigger:** Client running at capacity for 3+ consecutive weeks  
 **Status:** 📋 Planned — Scale Phase  
 **Purpose:** Identify when a client is ready for expanded services

**Flow:**

1. Detect capacity ceiling pattern  
2. Alert Mario with client context  
3. Send client message (from Mario):  
   * "You've been maxing out consistently — let's talk about expanding your setup"  
4. Mario follows up to discuss upsell options:  
   * More lead sources integrated  
   * SMS reminders added  
   * Payment processing added (Stripe)  
   * Priority support tier  
5. Log outcome

---

---

# **COMPLETE SYSTEM SUMMARY**

## **Layer 1: PomsConvert (Mario's Operations)**

| \# | Workflow | Phase | Priority |
| ----- | ----- | ----- | ----- |
| L1-W1 | PomsConvert Lead Capture & Qualification | Acquisition | CRITICAL |
| L1-W2 | PomsConvert Lead Re-engagement | Acquisition | HIGH |
| L1-W3 | New Client Deployment | Onboarding | HIGH |
| L1-W4 | Kickoff Call Scheduler | Onboarding | HIGH |
| L1-W5 | Go-Live Confirmation | Onboarding | HIGH |
| L1-W6 | Client Health Monitoring | CRM | MEDIUM |
| L1-W7 | Churn Risk Intervention | CRM | MEDIUM |
| L1-W8 | Upsell Detection | CRM | LOW |
| L1-W9 | Monthly Client ROI Report | CRM | MEDIUM |
| L1-W10 | Referral Program | Growth | MEDIUM |
| **Total** |  |  | **10 workflows** |

## **Layer 2: Client Operations (Per Client)**

| \# | Workflow | Phase | Priority |
| ----- | ----- | ----- | ----- |
| L2-W1 | Lead Intake & Auto-Response | Lead Capture | HIGH |
| L2-W2 | Lead Follow-up Sequence | Lead Capture | HIGH |
| L2-W3 | Lead Source Tracking | Lead Capture | LOW |
| L2-W4 | Booking Confirmation & Setup | Booking | CRITICAL |
| L2-W5 | Rescheduling Handler | Booking | HIGH |
| L2-W6 | Waitlist Manager (Exam Mode) | Booking | HIGH |
| L2-W7 | Session Reminders | Session Mgmt | CRITICAL |
| L2-W8 | No-Show Handler | Session Mgmt | HIGH |
| L2-W9 | Post-Session Follow-up | Session Mgmt | CRITICAL |
| L2-W10 | Invoice & Payment Tracking | Payments | HIGH |
| L2-W11 | Payment Nudge Sequence | Payments | HIGH |
| L2-W12 | Rebooking Campaign | Growth | MEDIUM |
| L2-W13 | Referral Automation | Growth | MEDIUM |
| L2-W14 | Review & Testimonial Request | Growth | LOW |
| L2-W15 | Capacity Alert & Slot Management | Growth | MEDIUM |
| L2-W16 | Performance Digest | Upsell | LOW |
| L2-W17 | Package Upsell Trigger | Upsell | LOW |
| **Total** |  |  | **17 workflows** |

**Grand Total: 27 workflows across both layers**

---

## **BUILD ROADMAP**

### **Feb 25 Showcase (build now)**

* L1-W1: Your own lead capture (proves the concept to judges)  
* L2-W4: Booking confirmation  
* L2-W7: Session reminders  
* L2-W8: No-show handler  
* L2-W9: Post-session follow-up

### **Beta Launch — First 5 Clients (Feb 26 – Mar 25\)**

* L1-W2 through L1-W5: Your onboarding machine  
* L2-W1 through L2-W11: Full client ops layer

### **Scale Phase (Apr 2026+)**

* L1-W6 through L1-W10: Your retention and growth machine  
* L2-W12 through L2-W17: Client growth and upsell engine

---

*Version 3.0 — Two-layer architecture, explicit separation of PomsConvert ops vs client ops*

