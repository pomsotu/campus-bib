# **Product Requirements Document**

## **Campus Service Business-in-a-Box**

**Version:** 1.0  
**Date:** February 10, 2026  
**Owner:** Mario Onyido, PomsConvert  
**Status:** Draft \- Pre-Development  
**Target Launch:** February 25, 2026 (Showcase Demo)

---

## **1\. Executive Summary**

**What We're Building:**  
Campus Service Business-in-a-Box is a done-for-you operational management service that enables student entrepreneurs to run professional service businesses without drowning in administrative work. Unlike traditional SaaS tools that require self-service setup and daily management, we deliver a complete operational backend that runs autonomously—clients wake up to results, not another tool to use.

**Why It Matters:**  
Student entrepreneurs running campus-based services (tutoring, design, coding help) currently spend 60-70% of their time on operational busywork—following up with leads, scheduling sessions, chasing payments, sending reminders. This operational overhead creates a hard ceiling at 3-5 clients per week, forcing them to choose between their business and their grades. Many quit entirely during exam periods when the admin burden becomes unsustainable.

**The Opportunity:**  
We're building a Results-as-a-Service model priced at $149-199/month that saves clients 8-10 hours per week while enabling them to scale from 5 to 15+ sessions without additional overhead. This is a productized service offering from PomsConvert, positioned as a solution for a specific market rather than a DIY software tool.

**Success Criteria:**

* First 5 paying clients within 30 days of showcase (Feb 25\)  
* Each client saves minimum 8 hours/week on operational tasks  
* System handles 15+ sessions per client per week with \<2 hours of manual intervention  
* Portfolio piece demonstrating systems thinking and execution capability  
* Foundation for scaling to 20+ clients with standardized infrastructure

---

## **2\. Problem Statement**

### **2.1 Target User Profile**

**Primary Persona: The Overwhelmed Student Entrepreneur**

* **Demographics:** Undergraduate or graduate student, ages 18-25  
* **Service Type:** Freelance services with tangible deliverables (tutoring, design, coding help, consulting)  
* **Current Revenue:** $1,000-$3,000/month  
* **Current Capacity:** 3-5 clients per week maximum (without system support)  
* **Lead Sources:** Word of mouth, Instagram DMs, campus referrals, personal network  
* **Current "System":** Pure chaos—Instagram DMs, Google Calendar, Notes app, e-transfers, manual follow-ups

**Key Characteristics:**

* Skilled at their core service but drowning in operations  
* Spending 10-15 hours/week on admin vs. 5-10 hours on actual delivery  
* Missing leads due to slow response times (2+ days)  
* Losing revenue from no-shows, unpaid sessions, forgotten follow-ups  
* Unable to scale because coordination overhead grows exponentially  
* Forced to pause client intake during exam periods to avoid burnout  
* Interested in growing their business but hitting hard operational limits

### **2.2 Problem Breakdown**

**Pain Point \#1: Lead Management Chaos**

* Leads come through multiple channels (DMs, texts, emails, referrals)  
* No centralized tracking system  
* Slow response times lead to lost opportunities  
* Manual qualification and back-and-forth scheduling  
* No automated follow-up for non-responders  
* **Impact:** 40-50% of leads never convert due to friction and delays

**Pain Point \#2: Scheduling & Coordination Overhead**

* Manual back-and-forth to find mutual availability  
* Forgetting to send calendar invites or Zoom links  
* No integration between school schedule and client bookings  
* Double-booking or overbooking during busy periods  
* Rescheduling requires hours of manual coordination  
* **Impact:** 3-5 hours/week wasted on scheduling logistics

**Pain Point \#3: Payment Collection Friction**

* Manual invoice/e-transfer requests  
* Awkward payment chasing when clients don't pay upfront  
* Sessions delivered before payment received  
* Lost revenue from forgotten payments  
* No systematic payment tracking  
* **Impact:** 20-30% of sessions have payment delays or go unpaid

**Pain Point \#4: Client Management Burden**

* No organized system for tracking client history  
* Forgetting to send session reminders (leads to no-shows)  
* Missing follow-up opportunities for rebooking  
* No referral request automation  
* Manual note-taking and prep for each session  
* **Impact:** 20% no-show rate, minimal repeat bookings, zero referrals

**Pain Point \#5: Exam Period Crisis**

* System completely breaks down when school demands spike  
* Must pause new clients or ghost existing ones  
* Lost revenue and damaged reputation  
* Considered quitting business entirely due to stress  
* **Impact:** 50-70% revenue drop during exam periods, potential business closure

### **2.3 Why Current Solutions Don't Work**

**Existing Tool Ecosystem:** Students already know about Calendly, Notion, Stripe, etc. But they don't use them effectively because:

1. **Too Many Disconnected Tools:** Managing 5-7 different tools (Calendly, Notion, Stripe, Google Calendar, ChatGPT, Spreadsheets, etc.) creates more overhead than it saves  
2. **High Setup Complexity:** Each tool requires 2-5 hours of initial configuration and learning curve  
3. **No Automation Between Tools:** Data doesn't flow automatically—every step requires manual intervention  
4. **Daily Maintenance Required:** Tools need constant updates, checking, and management  
5. **Not Built for Student Workflow:** Generic tools don't account for class schedules, exam periods, campus-specific needs  
6. **Cost Adds Up:** Multiple subscriptions at $10-30/month each \= $50-150+/month just for tools, before any revenue  
7. **Still Requires Operational Thinking:** They have to design and maintain the system themselves

**What Students Actually Need:** Someone to just run their operations for them using whatever tools are necessary, packaged as a single service with guaranteed results.

---

## **3\. Solution Overview**

### **3.1 Product Vision**

**The North Star:**  
 "Student entrepreneurs should wake up to results, not wake up to another tool to use."

**What We're Actually Building:**  
 A **Results-as-a-Service operational management system** that acts as an invisible operations team. We deploy standardized infrastructure for each client and manage it on their behalf. They get a simple dashboard to monitor what's happening, but we handle all the complexity in the background.

**The Promise:**  
 "We run your business operations for you. You focus on delivery and school. Everything else happens automatically."

### **3.2 Core Value Proposition**

**For the Student Entrepreneur:**

* **Time Saved:** Recover 8-10 hours per week previously spent on admin work  
* **Stress Reduced:** No more decision fatigue about which tool to use or how to follow up  
* **Capacity Increased:** Scale from 5 to 15+ sessions/week without additional operational overhead  
* **Revenue Protected:** Minimize no-shows, maximize payment collection, enable consistent delivery during exam periods  
* **Professional Experience:** Run a professional operation without needing to build it themselves

**For PomsConvert (Our Business):**

* **Productized Service:** Standardized delivery model instead of custom builds per client  
* **Recurring Revenue:** $149-199/month per client with high retention (operational dependency)  
* **Scalable Infrastructure:** Reusable system enables serving 20+ clients simultaneously  
* **Portfolio Showcase:** Demonstrates systems thinking and full-stack execution capability  
* **Market Positioning:** Unique offering in student entrepreneur market (Results vs. Tools)

### **3.3 How It Works (Client Experience)**

**Phase 1: Onboarding (One-Time, \<45 minutes for client)**

1. **Client fills out interactive intake form** (Tally)

   * Service details, pricing, availability patterns  
   * Existing tools they use (Calendly, Stripe, etc.) or request setup  
   * Lead sources to integrate (Instagram, forms, referrals)  
   * Communication preferences (email, SMS, Slack)  
   * Optional: Book kickoff call for complex setups  
2. **We deploy their infrastructure** (\<2 hours on our end)

   * Create their client account in our system (Supabase)  
   * Deploy customized n8n workflows for their business  
   * Integrate with their calendar, payment tools, lead sources  
   * Set up their personalized dashboard access  
   * Configure automated sequences based on their service model  
3. **Client goes live**

   * Receives dashboard login and access credentials  
   * Gets simple guide: "Here's what happens automatically now"  
   * We handle first few leads with them to validate everything works  
   * They're off and running

**Phase 2: Day-to-Day Operations (Fully Automated)**

**From the Client's Perspective:**

* They continue getting leads through their normal channels (DMs, referrals, etc.)  
* Leads automatically flow into the system  
* Booking, payment, reminders all happen automatically  
* They check their dashboard for today's schedule and new leads  
* They deliver their sessions  
* Everything else is handled

**What's Happening Behind the Scenes:**

1. Lead comes in → Captured automatically via integration  
2. Chatbot handles FAQ \+ info collection → Lead qualified and stored  
3. Booking link sent with available times → Session auto-scheduled  
4. Payment request sent → Tracked automatically  
5. Calendar events created → Both parties notified  
6. Reminders sent (24hr, 1hr before) → No-show rate drops  
7. Session happens → Client delivers, we track completion  
8. Post-session follow-up → Feedback request \+ rebooking offer  
9. Dashboard updated → Client sees everything in one place

**From Our Perspective:**

* Weekly check-in on each client's metrics  
* Fix any workflow issues or edge cases  
* Optimize automations based on patterns  
* Scale infrastructure as clients grow  
* Provide support when needed (\<30 min/week per client)

**Phase 3: Ongoing Value (Continuous)**

* Client focuses 90% of time on delivery and client acquisition  
* We handle 90% of operational coordination  
* They check dashboard to adjust availability or review metrics  
* System adapts to exam periods, schedule changes, growth

### **3.4 Key Differentiators**

**vs. DIY SaaS Tools (Calendly, Notion, etc.):**

* **We do the work for them** vs. they configure and manage tools themselves  
* **Single point of contact** vs. managing 5-7 disconnected tools  
* **Guaranteed results** vs. "here's software, good luck"  
* **Included support** vs. self-service documentation  
* **Adaptive to their needs** vs. generic one-size-fits-all

**vs. Virtual Assistants:**

* **Automated infrastructure** vs. human bottleneck for every task  
* **24/7 operation** vs. limited hours  
* **Standardized cost** ($149/mo) vs. variable hourly rates ($15-30/hr \= $300-600/mo for 20hrs)  
* **Instant response times** vs. human delays  
* **Scalable instantly** vs. hiring and training new VAs

**vs. Agency/Done-for-You Services:**

* **Student-specific** vs. generic small business solutions  
* **Affordable** ($149/mo) vs. $500-2000/mo enterprise pricing  
* **Fast deployment** (\<2 hours) vs. weeks of onboarding  
* **Focused on operations** vs. full marketing/sales/delivery scope

---

## **4\. Stakeholder Alignment**

### **4.1 Stakeholder Goals**

**Primary Stakeholder: Poms (Founder/Builder)**

* **Personal Goal:** Portfolio piece demonstrating systems thinking and full-stack capability  
* **Business Goal:** Revenue generation through productized service model  
* **Learning Goal:** Scale from custom builds to standardized infrastructure  
* **Impact Goal:** Help student entrepreneurs succeed without burning out  
* **ROI Goal:** Return on investment for father's financial backing (multiply capital deployed)

**End Users (Student Entrepreneurs)**

* **Primary Goal:** Time saved (8-10 hours/week minimum)  
* **Secondary Goal:** Stress reduction so they can focus on delivery and school  
* **Business Goal:** Scale from 5 to 15+ sessions/week without operational ceiling  
* **Financial Goal:** Increase revenue by taking on more clients during same time period  
* **Academic Goal:** Maintain grades without sacrificing business during exam periods

**Investor (Father)**

* **Financial Goal:** Return on investment through profitable business  
* **Success Metric:** Revenue growth and customer acquisition demonstrating viable business model  
* **Timeline:** Reasonable path to profitability within 6-12 months

### **4.2 Success Definition**

**For This to Be Considered Successful:**

**MVP Success (Feb 25 Showcase):**

* Working demo showing complete lead → booking → dashboard flow  
* Professional presentation that clearly articulates the value proposition  
* At least 5 interested prospects signing up for beta/waitlist  
* Positive feedback from judges/advisors on business model viability

**Beta Success (30 days post-showcase):**

* 3-5 paying clients onboarded and actively using the system  
* Each client saving documented 8+ hours/week  
* System handling 10+ sessions/week per client with minimal manual intervention  
* Portfolio piece published on PomsConvert website  
* Testimonials from satisfied beta clients

**6-Month Success:**

* 15-20 active paying clients at $149-199/month ($2,235-$3,980 MRR)  
* Infrastructure scaled to support 20+ clients with \<5 hours/week total management time  
* Positive ROI demonstrated (revenue \> costs \+ initial investment)  
* Clear path to 50+ clients without major infrastructure rebuild  
* Recognized as the go-to solution for student entrepreneur operations

---

## **5\. Market Analysis**

### **5.1 Target Market Sizing**

**Immediate Addressable Market (Ontario Tech):**

* Total students: \~11,000  
* Estimated student entrepreneurs: \~5-10% \= 550-1,100  
* Freelance service providers: \~40% of entrepreneurs \= 220-440  
* Making $1k+/month (our ICP): \~25% \= 55-110 potential clients  
* **Initial target:** 20 clients from Ontario Tech \= 18-36% market capture

**Expanded Market (Ontario Universities):**

* Major universities: UofT, York, Ryerson, McMaster, Western, Queen's, Waterloo, etc.  
* Combined student population: \~300,000+  
* Estimated student entrepreneurs: \~15,000-30,000  
* Service providers making $1k+/month: \~1,500-3,000  
* **Medium-term target:** 100-200 clients \= 3-13% regional market share

**Long-term Market (North America):**

* College/university students in US \+ Canada: \~20 million  
* Student entrepreneurs: \~2-4 million  
* Service providers at target revenue: \~200,000-400,000  
* **Long-term opportunity:** 1,000+ clients \= 0.25-0.5% market share represents significant business

### **5.2 Market Validation Status**

**Current Validation:**

* 1 direct conversation with student entrepreneur confirming pain points  
* Personal experience as target market member  
* Observation of peers struggling with operational management  
* Validated problem exists through PomsConvert client work

**Validation Gaps:**

* Only 1 in-depth user interview conducted  
* No price sensitivity testing yet  
* No competitive analysis of alternative solutions students might choose  
* Unknown willingness to pay at $149/month price point

**Post-Showcase Validation Plan:**

* Conduct 10 user interviews with interested prospects  
* Test pricing with beta cohort ($99 vs $149 vs $199)  
* Document time saved and ROI for first 5 clients  
* Gather testimonials and case studies  
* Iterate on features based on actual usage patterns

### **5.3 Competitive Landscape**

**Direct Competitors:**  
 None identified. No one is offering done-for-you operational management specifically for student service businesses.

**Indirect Competitors (Tools Students Could Use Instead):**

**1\. DIY SaaS Stack:**

* Calendly ($10-15/mo) \+ Notion ($8-10/mo) \+ Stripe (2.9% \+ 30¢) \+ Various others  
* **Strength:** Flexible, customizable, well-known brands  
* **Weakness:** Requires 10+ hours of setup, ongoing management, no integration, student must design system themselves  
* **Our Advantage:** We do all setup and management for them

**2\. Virtual Assistants:**

* Platforms: Upwork, Fiverr, local campus VAs  
* **Strength:** Human flexibility, can handle non-routine tasks  
* **Weakness:** Expensive ($15-30/hr \= $300-600/mo for 20hrs), inconsistent, requires training and management, not 24/7, scaling requires hiring more people  
* **Our Advantage:** Automated \= cheaper, faster, 24/7, instantly scalable

**3\. Full-Service Agencies:**

* Business operations agencies, automation consultancies  
* **Strength:** Comprehensive service, experienced teams  
* **Weakness:** Expensive ($500-2000/mo), not student-focused, slow onboarding, over-featured for student needs  
* **Our Advantage:** Student-specific, affordable ($149/mo), fast deployment

**4\. Do Nothing (Status Quo):**

* Continue with manual chaos  
* **Strength:** Zero upfront cost, familiar workflow  
* **Weakness:** Massive time waste, revenue ceiling, burnout risk, unprofessional  
* **Our Advantage:** ROI is obvious—8-10 hours saved/week at $18-25/hr effective rate

### **5.4 Positioning Strategy**

**Market Position:**  
 "The operational backbone for serious student entrepreneurs"

**Key Messaging:**

* **Headline:** "Run your campus service business in 30 minutes per week instead of 10 hours"  
* **Subhead:** "We handle everything between lead and payment. You focus on delivery and school."  
* **Proof:** "Our clients save 8-10 hours/week and scale to 15+ sessions without burnout"

**Positioning Against Competitors:**

* **vs. DIY Tools:** "We do the work for you, not give you more work to do"  
* **vs. VAs:** "Automated infrastructure, not human bottleneck"  
* **vs. Agencies:** "Student-focused, affordable, fast"  
* **vs. Status Quo:** "Professional operations without the professional workload"

**Target Customer Statement:** "For student entrepreneurs making $1-3k/month who are hitting operational limits and spending more time on admin than delivery, Campus Service Business-in-a-Box is a done-for-you operational system that saves 8-10 hours per week and enables scaling to 15+ clients. Unlike DIY tools that require setup and daily management, we run your operations for you so you can focus on what you do best."

---

## **6\. Feature Requirements**

### **6.1 MVP Scope (V1 \- Feb 25 Showcase)**

**MUST HAVE (Deal Breakers):**

**Core Operational Flow:**

1. **Lead Capture & Qualification**

   * Automated lead intake from test form (Tally)  
   * Basic qualification logic (service match, budget confirmation)  
   * Chatbot handles FAQs and collects necessary info  
   * All lead data automatically stored in database  
   * Status tracking (new, qualified, booked, completed)  
2. **Automated Booking System**

   * Available time slot management based on client's schedule  
   * Automatic calendar event creation (Google Calendar integration)  
   * Booking confirmation sent to both parties  
   * Zoom/meeting link generation included in event  
   * Conflict detection and prevention  
3. **Reminder & Communication**

   * Automated 24-hour before session reminder  
   * Automated 1-hour before session reminder  
   * Email-based notifications (expandable to SMS later)  
   * Rescheduling request handling (automated rebooking flow)  
4. **Client Dashboard**

   * Login authentication (Supabase Auth)  
   * Upcoming sessions view (next 7 days)  
   * New leads pipeline (new, qualified, pending)  
   * Basic metrics (total sessions this week, leads converted)  
   * Availability management (can mark times unavailable)  
5. **Post-Session Automation**

   * Session completion tracking  
   * Automated thank you \+ feedback request  
   * Rebooking offer sent automatically  
   * Update client history in database

**SHOULD HAVE (Important but Not Blocking):**

6. **Invoicing Support**

   * Automated invoice generation (not payment processing yet)  
   * Invoice sent after booking confirmation  
   * Payment status tracking (manual update for now)  
   * Reminder for unpaid invoices  
7. **Onboarding Process**

   * Interactive client intake form (Tally)  
   * Conditional logic for tool setup options  
   * Privacy agreement / NDA acceptance  
   * Setup completion checklist for us  
   * Onboarding guide sent to new clients  
8. **Lead Follow-up Sequences**

   * Automated follow-up if lead doesn't respond within 24 hours  
   * Secondary follow-up after 48 hours  
   * Final follow-up before marking lead cold  
   * Customizable follow-up messaging per client

**NICE TO HAVE (Future Versions):**

9. **Advanced Capacity Planning**

   * "Exam mode" toggle that pauses new bookings  
   * Automatic waitlist when fully booked  
   * Session load balancing across weeks  
   * Predictive scheduling based on patterns  
10. **Financial Reporting**

    * Revenue tracking dashboard  
    * Payment analytics (on-time rate, average session value)  
    * Monthly/weekly reports  
    * Tax document preparation support  
11. **Referral Automation**

    * Automated referral request after 3 successful sessions  
    * Referral tracking (who referred whom)  
    * Referral reward management  
    * Social proof / testimonial requests  
12. **Client CRM Features**

    * Detailed client history and notes  
    * Session prep templates  
    * Material sharing automation  
    * Custom fields per client type  
13. **Multi-Channel Lead Integration**

    * Instagram DM integration  
    * WhatsApp integration  
    * SMS-based lead capture  
    * Webhook endpoints for any source

### **6.2 Feature Prioritization Framework**

**Decision Criteria:**

1. **Does it directly save client time?** (Primary success metric)  
2. **Is it required for Feb 25 demo?** (Hard deadline)  
3. **Does it differentiate us from DIY tools?** (Competitive advantage)  
4. **Can we build it in 2 weeks?** (Scope feasibility)  
5. **Does it generate data to prove ROI?** (Portfolio/showcase value)

**V1 (Feb 25 MVP):**

* Lead capture \+ qualification  
* Booking automation  
* Reminders \+ communication  
* Basic dashboard  
* Post-session follow-up  
* Simple invoice support

**V2 (Post-Launch \- March):**

* Advanced onboarding flow  
* Multi-lead source integration  
* Enhanced dashboard analytics  
* Payment status tracking improvements  
* Automated follow-up sequences refinement

**V3 (Scale Phase \- April+):**

* Payment processing integration (Stripe rev share)  
* Capacity planning features  
* Financial reporting  
* Referral automation  
* CRM enhancements

---

## **7\. User Workflows**

### **7.1 Core User Journey Map**

**Persona: Sarah, Design Freelancer at Ontario Tech**

* Makes \~$2k/month doing logos and brand design for campus clubs/startups  
* Currently managing 4-5 clients manually through Instagram DMs  
* Spending 12 hours/week on admin, 8 hours/week on actual design work  
* Stressed during midterms, considering pausing all client work

**Current State (Before Our System):**

Lead comes in via Instagram DM  
↓  
Sarah sees DM 6-18 hours later (in class)  
↓  
Manual back-and-forth: "What do you need?" "What's your budget?" "Here's my rate"  
↓  
If qualified: "When are you free?" "I'm free Mon/Wed/Fri" "I have classes those days..."  
↓  
Finally agree on time (2-3 days later)  
↓  
Sarah manually: Creates Google Calendar event, forgets Zoom link, sends it separately  
↓  
Sarah manually: Sends e-transfer request, client says "I'll pay after the session"  
↓  
Day of session: Sarah realizes she forgot to prep, scrambles to review client needs  
↓  
Client no-shows (no reminder was sent)  
↓  
Sarah manually follows up: "Hey did you forget?" Reschedule takes another 2 days  
↓  
Session finally happens  
↓  
Client forgets to send payment  
↓  
Sarah awkwardly follows up 3 days later  
↓  
Gets paid eventually, never follows up for rebooking  
↓  
Total time for 1 client from lead to payment: 8-12 hours of coordination

**Future State (With Our System):**

Lead comes in via Instagram DM  
↓  
\[AUTOMATED\] Lead sees instant auto-reply: "Hi\! I'm Sarah's assistant. Let me help you get started."  
↓  
\[AUTOMATED\] Chatbot asks qualification questions:  
  \- "What type of design work do you need? (Logo / Branding / Web / Other)"  
  \- "What's your budget range? (Options provided)"  
  \- "What's your timeline?"  
↓  
\[AUTOMATED\] If qualified: "Great\! Sarah's rate is $X. Here's her available times this week: \[Calendar link\]"  
↓  
\[AUTOMATED\] Lead clicks time slot → Booking confirmed instantly  
↓  
\[AUTOMATED\] Both parties receive:  
  \- Google Calendar invite with Zoom link  
  \- Confirmation email with session details  
  \- Invoice for payment (optional: required before session or after)  
↓  
\[AUTOMATED\] 24 hours before: Reminder sent to both  
↓  
\[AUTOMATED\] 1 hour before: Final reminder sent  
↓  
Session happens (Sarah just shows up and delivers)  
↓  
\[AUTOMATED\] Post-session: Thank you email \+ feedback request \+ rebooking offer sent  
↓  
\[AUTOMATED\] If payment not received: Gentle reminder after 24 hours  
↓  
\[AUTOMATED\] Dashboard updated: Session marked complete, payment tracked  
↓  
Sarah's total time investment: 0 hours coordination, 1-2 hours actual session delivery

**Time Saved: 8-12 hours → 0 hours of manual coordination**

### **7.2 Detailed Workflow Diagrams**

**Workflow \#1: Lead Capture to Booking**

┌─────────────────────────────────────────────────────────────────┐  
│ LEAD SOURCE (Instagram DM, Form, Referral, etc.)                │  
└────────────────────────┬────────────────────────────────────────┘  
                         │  
                         ▼  
                 ┌───────────────┐  
                 │  Lead Arrives │  
                 └───────┬───────┘  
                         │  
                         ▼  
        ┌────────────────────────────────┐  
        │ n8n Webhook Receives Lead Data │  
        └────────┬───────────────────────┘  
                 │  
                 ▼  
        ┌────────────────────────┐  
        │ Store in Supabase DB   │  
        │ Status: "new"          │  
        │ client\_id attached     │  
        └────────┬───────────────┘  
                 │  
                 ▼  
        ┌─────────────────────────────────┐  
        │ Qualification Logic Check       │  
        │ \- Service type match?           │  
        │ \- Budget in range?              │  
        │ \- Timeline feasible?            │  
        └────────┬───────────────┬────────┘  
                 │               │  
         ✓ Qualified         ✗ Not Qualified  
                 │               │  
                 ▼               ▼  
    ┌──────────────────┐  ┌──────────────────┐  
    │ Status: qualified│  │ Polite decline   │  
    │ Send booking link│  │ message sent     │  
    └────────┬─────────┘  └──────────────────┘  
             │  
             ▼  
    ┌─────────────────────────────┐  
    │ Chatbot Interaction         │  
    │ \- Send available time slots │  
    │ \- Answer FAQs               │  
    │ \- Collect booking details   │  
    └────────┬────────────────────┘  
             │  
             ▼  
    ┌─────────────────────────────┐  
    │ Lead Selects Time Slot      │  
    └────────┬────────────────────┘  
             │  
             ▼  
    ┌─────────────────────────────────────┐  
    │ n8n Booking Workflow Triggered      │  
    │ 1\. Check calendar for conflicts     │  
    │ 2\. Create Google Calendar event     │  
    │ 3\. Generate Zoom link               │  
    │ 4\. Create database session record   │  
    │ 5\. Generate invoice (if applicable) │  
    └────────┬────────────────────────────┘  
             │  
             ▼  
    ┌──────────────────────────────────────┐  
    │ Confirmation Sent to Both Parties    │  
    │ \- Calendar invite                    │  
    │ \- Session details email              │  
    │ \- Invoice (if payment required)      │  
    │ Status: "booked"                     │  
    └────────┬─────────────────────────────┘  
             │  
             ▼  
    ┌──────────────────────────────────────┐  
    │ Dashboard Updated                    │  
    │ Client sees: New session scheduled   │  
    │ Lead sees: Upcoming session details  │  
    └──────────────────────────────────────┘

**Workflow \#2: Session Reminders & Delivery**

Session Scheduled (Status: "booked")  
         │  
         ▼  
┌──────────────────────┐  
│ 24 Hours Before      │  
│ n8n Cron Job Checks  │  
└────────┬─────────────┘  
         │  
         ▼  
┌────────────────────────────────┐  
│ Send Reminder Email            │  
│ To: Client & Lead              │  
│ Content:                       │  
│ \- Session details              │  
│ \- Zoom link                    │  
│ \- Prep instructions (if any)   │  
│ \- Reschedule option link       │  
└────────┬───────────────────────┘  
         │  
         ▼  
┌──────────────────────┐  
│ 1 Hour Before        │  
│ n8n Cron Job Checks  │  
└────────┬─────────────┘  
         │  
         ▼  
┌────────────────────────────────┐  
│ Send Final Reminder            │  
│ To: Client & Lead              │  
│ Content:                       │  
│ \- "Starting in 1 hour"         │  
│ \- Direct Zoom link             │  
│ \- "Looking forward to it\!"     │  
└────────┬───────────────────────┘  
         │  
         ▼  
┌──────────────────────┐  
│ Session Happens      │  
│ (Client delivers)    │  
└────────┬─────────────┘  
         │  
         ▼  
┌──────────────────────────────────┐  
│ Post-Session Automation          │  
│ Triggered: 1 hour after end time │  
└────────┬─────────────────────────┘  
         │  
         ▼  
┌────────────────────────────────────────┐  
│ Send Post-Session Email                │  
│ To: Lead                               │  
│ Content:                               │  
│ \- Thank you message                    │  
│ \- Feedback/review request              │  
│ \- "Book your next session: \[link\]"     │  
│ \- Payment reminder (if not paid)       │  
└────────┬───────────────────────────────┘  
         │  
         ▼  
┌────────────────────────────────┐  
│ Update Database                │  
│ Status: "completed"            │  
│ Timestamp recorded             │  
│ Dashboard metrics updated      │  
└────────────────────────────────┘

**Workflow \#3: Dashboard Monitoring (Client View)**

Client Logs In (dashboard.campusservice.com)  
         │  
         ▼  
┌──────────────────────────────────────┐  
│ Authentication (Supabase Auth)       │  
│ client\_id retrieved from session     │  
└────────┬─────────────────────────────┘  
         │  
         ▼  
┌──────────────────────────────────────┐  
│ Dashboard Loads (Next.js)            │  
│ RLS ensures only client's data shown │  
└────────┬─────────────────────────────┘  
         │  
         ▼  
┌────────────────────────────────────────────────────┐  
│ DASHBOARD VIEW                                     │  
│                                                    │  
│ ┌────────────────────────────────────────────┐   │  
│ │ TODAY'S OVERVIEW                           │   │  
│ │ • 3 sessions scheduled today               │   │  
│ │ • 2 new leads waiting for response         │   │  
│ │ • 1 payment pending                        │   │  
│ └────────────────────────────────────────────┘   │  
│                                                    │  
│ ┌────────────────────────────────────────────┐   │  
│ │ UPCOMING SESSIONS (Next 7 Days)            │   │  
│ │ ┌─────────────────────────────────────┐    │   │  
│ │ │ Mon, Feb 12 \- 3:00 PM               │    │   │  
│ │ │ Client: Alex M. \- Logo Design       │    │   │  
│ │ │ Status: ✓ Paid | 📅 Calendar synced │    │   │  
│ │ └─────────────────────────────────────┘    │   │  
│ │ ┌─────────────────────────────────────┐    │   │  
│ │ │ Wed, Feb 14 \- 10:00 AM              │    │   │  
│ │ │ Client: Taylor K. \- Brand Package   │    │   │  
│ │ │ Status: ⏳ Payment pending           │    │   │  
│ │ └─────────────────────────────────────┘    │   │  
│ └────────────────────────────────────────────┘   │  
│                                                    │  
│ ┌────────────────────────────────────────────┐   │  
│ │ NEW LEADS (Needs Attention)                │   │  
│ │ ┌─────────────────────────────────────┐    │   │  
│ │ │ Jordan P. \- Web Design              │    │   │  
│ │ │ Budget: $800 | Timeline: ASAP       │    │   │  
│ │ │ Status: ✓ Qualified                 │    │   │  
│ │ │ \[Booking link sent 2 hours ago\]     │    │   │  
│ │ └─────────────────────────────────────┘    │   │  
│ └────────────────────────────────────────────┘   │  
│                                                    │  
│ ┌────────────────────────────────────────────┐   │  
│ │ QUICK STATS (This Week)                    │   │  
│ │ • Sessions completed: 7                    │   │  
│ │ • New leads: 5                             │   │  
│ │ • Conversion rate: 60%                     │   │  
│ │ • Time saved: \~9 hours                     │   │  
│ └────────────────────────────────────────────┘   │  
│                                                    │  
│ ┌────────────────────────────────────────────┐   │  
│ │ AVAILABILITY MANAGEMENT                    │   │  
│ │ \[Edit Schedule\] \[Set Exam Mode\]            │   │  
│ └────────────────────────────────────────────┘   │  
└────────────────────────────────────────────────────┘

### **7.3 Edge Cases & Handling**

**Edge Case \#1: No-Show**

* Session time passes, neither party joins  
* System waits 15 minutes past start time  
* Sends automated check-in: "Hey, did this session happen?"  
* Client can mark: "Completed" / "No-show" / "Rescheduled"  
* If no-show: Automated rebooking offer sent to lead  
* Dashboard updated with no-show tracking

**Edge Case \#2: Rescheduling Request**

* Lead clicks "Need to reschedule" link in reminder  
* Automated message: "No problem\! Here are Sarah's next available times"  
* New time selected → Original session cancelled, new one created  
* Both parties notified automatically  
* No manual intervention required

**Edge Case \#3: Payment Delay**

* Invoice sent after booking (or before, depending on client preference)  
* If unpaid 24 hours before session: Gentle reminder sent  
* If still unpaid 6 hours before: Client gets notification to follow up manually  
* If unpaid at session time: Client can choose to deliver or cancel  
* Post-session: Automated payment reminder every 48 hours until paid

**Edge Case \#4: Client Unavailable (Exam Period)**

* Client toggles "Exam Mode" in dashboard  
* System automatically:  
  * Pauses new booking links (returns "Currently not accepting new clients")  
  * Keeps existing sessions active  
  * Sends auto-reply to new leads: "Back \[date\]—you can waitlist here"  
  * Notifies us to review client's schedule

**Edge Case \#5: Lead Doesn't Respond to Booking Link**

* Booking link sent after qualification  
* If no booking within 24 hours: Automated follow-up \#1  
* If no booking within 48 hours: Automated follow-up \#2 (slight urgency)  
* If no booking within 72 hours: Final follow-up, then mark "cold"  
* Client can see cold leads in dashboard and manually re-engage if desired

---

## **8\. Technical Architecture**

### **8.1 System Overview**

**Architecture Philosophy:**

* **Single source of truth:** Supabase database holds all state  
* **n8n orchestrates everything:** All automation logic lives in workflows  
* **Dashboard is read-mostly:** Clients view data, make minimal updates  
* **Multi-tenant with data isolation:** Each client's data is separate via RLS  
* **Scalable foundation:** Built to serve 1 client or 100 without major refactor

**Tech Stack (Locked In):**

* **Frontend:** Next.js 14 \+ Tailwind CSS (hosted on Vercel)  
* **Backend/Database:** Supabase (PostgreSQL \+ Auth \+ Storage \+ Real-time)  
* **Automation Engine:** n8n (self-hosted on Railway or n8n Cloud)  
* **Forms:** Tally (lead capture, client intake)  
* **Calendar:** Google Calendar API  
* **Payments:** Invoicing only for MVP (Stripe integration in V2)  
* **Email:** SendGrid or Resend for transactional emails  
* **Monitoring:** Supabase logs \+ n8n execution logs

### **8.2 Database Schema (Supabase)**

\-- Core Tables

CREATE TABLE clients (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  user\_id UUID REFERENCES auth.users(id), \-- Supabase Auth  
  name TEXT NOT NULL,  
  email TEXT UNIQUE NOT NULL,  
  business\_name TEXT,  
  service\_type TEXT, \-- e.g., "tutoring", "design", "coding"  
  hourly\_rate NUMERIC,  
  default\_session\_duration INTEGER, \-- in minutes  
  calendar\_integration JSONB, \-- { provider: 'google', token: '...', calendar\_id: '...' }  
  availability\_schedule JSONB, \-- { monday: \['9:00-12:00', '14:00-17:00'\], ... }  
  exam\_mode\_enabled BOOLEAN DEFAULT FALSE,  
  created\_at TIMESTAMP DEFAULT NOW(),  
  updated\_at TIMESTAMP DEFAULT NOW()  
);

CREATE TABLE leads (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  client\_id UUID REFERENCES clients(id) ON DELETE CASCADE,  
  name TEXT,  
  email TEXT,  
  phone TEXT,  
  service\_requested TEXT,  
  budget\_range TEXT,  
  timeline TEXT,  
  source TEXT, \-- e.g., "instagram", "referral", "form"  
  status TEXT DEFAULT 'new', \-- 'new', 'qualified', 'booked', 'completed', 'cold'  
  qualification\_score INTEGER, \-- 0-100 based on match criteria  
  notes TEXT,  
  created\_at TIMESTAMP DEFAULT NOW(),  
  updated\_at TIMESTAMP DEFAULT NOW()  
);

CREATE TABLE sessions (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  client\_id UUID REFERENCES clients(id) ON DELETE CASCADE,  
  lead\_id UUID REFERENCES leads(id) ON DELETE SET NULL,  
  scheduled\_time TIMESTAMP NOT NULL,  
  end\_time TIMESTAMP NOT NULL,  
  status TEXT DEFAULT 'scheduled', \-- 'scheduled', 'completed', 'cancelled', 'no-show', 'rescheduled'  
  calendar\_event\_id TEXT, \-- Google Calendar event ID  
  meeting\_link TEXT, \-- Zoom/Google Meet link  
  session\_notes TEXT,  
  payment\_status TEXT DEFAULT 'pending', \-- 'pending', 'paid', 'overdue'  
  payment\_amount NUMERIC,  
  invoice\_sent\_at TIMESTAMP,  
  created\_at TIMESTAMP DEFAULT NOW(),  
  updated\_at TIMESTAMP DEFAULT NOW()  
);

CREATE TABLE automations (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  client\_id UUID REFERENCES clients(id) ON DELETE CASCADE,  
  automation\_type TEXT, \-- e.g., "reminder", "follow-up", "booking-confirmation"  
  triggered\_at TIMESTAMP,  
  target\_email TEXT,  
  status TEXT, \-- 'sent', 'failed', 'scheduled'  
  metadata JSONB, \-- Additional context about the automation  
  created\_at TIMESTAMP DEFAULT NOW()  
);

CREATE TABLE client\_settings (  
  id UUID PRIMARY KEY DEFAULT uuid\_generate\_v4(),  
  client\_id UUID REFERENCES clients(id) ON DELETE CASCADE,  
  setting\_key TEXT NOT NULL,  
  setting\_value JSONB,  
  created\_at TIMESTAMP DEFAULT NOW(),  
  updated\_at TIMESTAMP DEFAULT NOW(),  
  UNIQUE(client\_id, setting\_key)  
);

\-- Row Level Security Policies

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;  
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;  
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;  
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;  
ALTER TABLE client\_settings ENABLE ROW LEVEL SECURITY;

\-- Clients can only access their own data  
CREATE POLICY "Clients see own data"  
  ON clients FOR SELECT  
  USING (auth.uid() \= user\_id);

CREATE POLICY "Clients see own leads"  
  ON leads FOR SELECT  
  USING (client\_id IN (SELECT id FROM clients WHERE user\_id \= auth.uid()));

CREATE POLICY "Clients see own sessions"  
  ON sessions FOR SELECT  
  USING (client\_id IN (SELECT id FROM clients WHERE user\_id \= auth.uid()));

CREATE POLICY "Clients see own automations"  
  ON automations FOR SELECT  
  USING (client\_id IN (SELECT id FROM clients WHERE user\_id \= auth.uid()));

CREATE POLICY "Clients see own settings"  
  ON client\_settings FOR SELECT  
  USING (client\_id IN (SELECT id FROM clients WHERE user\_id \= auth.uid()));

\-- Indexes for Performance  
CREATE INDEX idx\_leads\_client\_id ON leads(client\_id);  
CREATE INDEX idx\_leads\_status ON leads(status);  
CREATE INDEX idx\_sessions\_client\_id ON sessions(client\_id);  
CREATE INDEX idx\_sessions\_scheduled\_time ON sessions(scheduled\_time);  
CREATE INDEX idx\_sessions\_status ON sessions(status);

### **8.3 n8n Workflow Architecture**

**Workflow Design Principles:**

* Each client gets their own set of workflows initially (easy to customize)  
* Workflows are triggered by webhooks, cron jobs, or database changes  
* All state changes are written back to Supabase  
* Error handling sends alerts to us (Slack/email) for manual intervention

**Core Workflows (MVP):**

**1\. Lead Capture & Qualification Workflow**

Trigger: Webhook receives lead data (from Tally form or DM integration)  
↓  
Step 1: Parse incoming data  
Step 2: Insert lead into Supabase (client\_id attached)  
Step 3: Run qualification logic  
  \- Check service type match  
  \- Check budget against client's rate  
  \- Check timeline feasibility  
  \- Calculate qualification\_score  
↓  
Step 4: Update lead status in database  
↓  
If qualified:  
  Step 5A: Send booking link via email/SMS  
  Step 5B: Trigger chatbot interaction (FAQ sequence)  
If not qualified:  
  Step 5C: Send polite decline message  
↓  
End

**2\. Booking Confirmation Workflow**

Trigger: Webhook from booking link (lead selects time slot)  
↓  
Step 1: Validate time slot availability (check Google Calendar)  
Step 2: Create Google Calendar event  
  \- Generate Zoom link (or use client's preferred tool)  
  \- Add both parties as attendees  
  \- Set reminder defaults  
↓  
Step 3: Create session record in Supabase  
  \- Link to lead\_id and client\_id  
  \- Store calendar\_event\_id for future updates  
  \- Set status: "scheduled"  
↓  
Step 4: Generate invoice (if payment required before session)  
  \- Create invoice in database  
  \- Generate PDF or payment link  
↓  
Step 5: Send confirmation emails to both parties  
  \- Client: "New session booked with \[Lead Name\] on \[Date/Time\]"  
  \- Lead: "Session confirmed\! Here are the details..."  
  \- Include calendar invite, Zoom link, invoice (if applicable)  
↓  
Step 6: Update lead status to "booked" in database  
↓  
End

**3\. Reminder Workflow (Cron-based)**

Trigger: Cron job runs every hour  
↓  
Step 1: Query Supabase for sessions starting in next 24 hours  
  \- Filter: status \= 'scheduled' AND reminder\_24hr\_sent \= FALSE  
↓  
For each session found:  
  Step 2: Send 24-hour reminder email  
    \- To: Client & Lead  
    \- Content: Session details, Zoom link, reschedule option  
  Step 3: Mark reminder\_24hr\_sent \= TRUE in database  
↓  
Step 4: Query for sessions starting in next 1 hour  
  \- Filter: status \= 'scheduled' AND reminder\_1hr\_sent \= FALSE  
↓  
For each session found:  
  Step 5: Send 1-hour reminder email/SMS  
    \- To: Client & Lead  
    \- Content: "Starting in 1 hour\! \[Direct Zoom link\]"  
  Step 6: Mark reminder\_1hr\_sent \= TRUE in database  
↓  
End

**4\. Post-Session Follow-up Workflow**

Trigger: Cron job runs every hour  
↓  
Step 1: Query for sessions that ended 1 hour ago  
  \- Filter: status \= 'scheduled' AND end\_time \< NOW() \- 1 hour  
↓  
For each session found:  
  Step 2: Update status to 'completed' in database  
↓  
  Step 3: Send post-session email to lead  
    \- Thank you message  
    \- Feedback/review request link  
    \- Rebooking offer with booking link  
    \- Payment reminder (if payment\_status \= 'pending')  
↓  
  Step 4: Send summary to client  
    \- "Session with \[Lead\] completed"  
    \- Link to add notes  
    \- Payment status update  
↓  
  Step 5: Log automation in database  
↓  
End

**5\. Payment Reminder Workflow**

Trigger: Cron job runs daily  
↓  
Step 1: Query for unpaid invoices  
  \- Filter: payment\_status \= 'pending' AND invoice\_sent\_at \< NOW() \- 24 hours  
↓  
For each unpaid invoice:  
  Step 2: Check if reminder already sent today (avoid spam)  
  Step 3: Send gentle payment reminder email  
    \- "Friendly reminder: Invoice for session on \[Date\]"  
    \- Payment link/instructions  
    \- "Let me know if you have any questions"  
↓  
  Step 4: If invoice \> 7 days overdue:  
    \- Send notification to client to follow up manually  
    \- Mark as requiring attention in dashboard  
↓  
End

### **8.4 Dashboard (Next.js Frontend)**

**App Structure:**

/app  
  /login  
    \- page.tsx (Supabase Auth login)  
  /dashboard  
    \- page.tsx (Main dashboard view)  
    \- layout.tsx (Authenticated layout)  
  /sessions  
    \- page.tsx (Detailed sessions list)  
  /leads  
    \- page.tsx (Lead pipeline view)  
  /settings  
    \- page.tsx (Availability, preferences)  
  /api  
    \- /auth (Supabase Auth routes)  
    \- /sessions (API routes for session updates)  
    \- /leads (API routes for lead updates)

**Key Components:**

* **StatsOverview:** Today's summary (sessions, leads, payments)  
* **UpcomingSessionsCard:** Next 7 days of scheduled sessions  
* **LeadPipelineCard:** New leads waiting for action  
* **QuickStatsWidget:** Weekly metrics (time saved, conversion rate)  
* **AvailabilityManager:** Edit schedule, toggle exam mode

**Data Flow:**

1. User logs in via Supabase Auth  
2. Next.js retrieves `user_id`, looks up `client_id`  
3. All queries include `client_id` filter (RLS enforces this server-side)  
4. Real-time subscriptions for live dashboard updates (Supabase Real-time)  
5. Dashboard refreshes automatically when new leads/sessions arrive

**Styling:**

* Tailwind CSS for all styling (utility-first)  
* Clean, minimal interface (not overwhelming)  
* Mobile-responsive (students check on phone often)  
* Dark mode optional (nice-to-have)

### **8.5 Integration Points**

**Google Calendar API:**

* OAuth 2.0 authentication during client onboarding  
* Store refresh token in `clients.calendar_integration` JSONB field  
* n8n uses refresh token to create/update/delete events  
* Sync is one-way: n8n → Google Calendar (we don't read back events)

**Email Service (SendGrid/Resend):**

* Transactional email templates for all automations  
* Templates: booking confirmation, reminders, follow-ups, payment reminders  
* Track open/click rates for optimization  
* Fallback: If email fails, log error and alert us

**Tally Forms:**

* Lead capture forms post to n8n webhook  
* Client intake form posts to onboarding webhook  
* Form data structure matches our database schema  
* Conditional logic for different service types

**Future Integrations (V2+):**

* Stripe for payment processing  
* Twilio for SMS reminders  
* Instagram DM API for direct lead capture  
* Slack for client notifications (optional)

### **8.6 Deployment Architecture**

**Production Environment:**

**Frontend (Vercel):**

* Repo: GitHub (private repo)  
* Auto-deploy on push to `main` branch  
* Environment variables: Supabase URL, Supabase anon key  
* Domain: dashboard.campusservice.com (or client subdomain)

**Backend (Supabase):**

* Hosted: Supabase Cloud (free tier → pro as needed)  
* Database: PostgreSQL with RLS enabled  
* Auth: Supabase Auth (email/password for clients)  
* Storage: For client uploads (session materials, etc.) \- optional for MVP

**Automation Engine (n8n):**

* Hosted: Railway or n8n Cloud  
* Persistent workflows (don't lose state on restart)  
* Webhook URLs: Exposed for Tally forms and other triggers  
* Executions: Log all workflow runs for debugging

**Monitoring & Alerts:**

* Supabase Dashboard: Database performance, query logs  
* n8n Dashboard: Workflow execution history, error logs  
* Vercel Analytics: Frontend performance  
* Slack/Email: Automated alerts for critical failures

### **8.7 Security & Privacy**

**Data Protection:**

* All client data encrypted at rest (Supabase default)  
* All API requests use HTTPS  
* Row Level Security prevents data leakage between clients  
* No client can see another client's data (enforced by RLS)

**Authentication:**

* Supabase Auth with email/password  
* JWTs for session management  
* Automatic token refresh  
* Optional: 2FA for high-value clients

**Privacy Compliance:**

* GDPR-ready: Clients can request data export/deletion  
* Privacy policy clearly states data usage  
* NDA/terms acceptance during onboarding  
* No data sold or shared with third parties

**Access Control:**

* Admin access (us): Full database access for support  
* Client access: Only their own data via RLS  
* Lead access: No login (receive emails only)

---

## **9\. Success Metrics & KPIs**

### **9.1 Primary Success Metric**

**North Star Metric: Hours Saved Per Client Per Week**

**Target:** Minimum 8 hours saved per client per week

**Measurement:**

* Baseline: Survey client during onboarding about current time spent  
* Ongoing: Track all automated actions (follow-ups, bookings, reminders) and assign time value  
* Quarterly: Re-survey clients to validate time savings

**Calculation Example:**

Before System:  
\- Manual lead follow-up: 2 hrs/week  
\- Scheduling coordination: 3 hrs/week  
\- Payment tracking: 1 hr/week  
\- Reminder sending: 0.5 hrs/week  
\- Post-session follow-ups: 1.5 hrs/week  
\- Administrative overhead: 2 hrs/week  
Total: 10 hours/week

After System:  
\- All of above automated: 0 hrs/week  
\- Dashboard check-in: 0.5 hrs/week  
\- Occasional manual intervention: 1 hr/week  
Total: 1.5 hours/week

TIME SAVED: 8.5 hours/week

### **9.2 Key Performance Indicators (KPIs)**

**Product KPIs:**

**Lead Conversion Metrics:**

* Lead-to-booking conversion rate: Target 40-60%  
* Average time from lead to booking: Target \<24 hours  
* Qualification accuracy: Target 80%+ (qualified leads that actually book)

**Session Delivery Metrics:**

* No-show rate: Target \<20% (vs. 30-40% baseline without reminders)  
* On-time payment rate: Target 90%+ (payment before or immediately after session)  
* Rescheduling rate: Target \<15% (measure of booking quality)

**Client Satisfaction Metrics:**

* Time saved per client: Target 8+ hours/week  
* Dashboard engagement: Target 3+ logins per week  
* Feature utilization: Target 70%+ of clients using all core features  
* Retention rate: Target 90%+ month-over-month (operational dependency)

**Business KPIs:**

**Revenue Metrics:**

* Monthly Recurring Revenue (MRR): Target $745+ with 5 clients at $149/mo  
* Client Acquisition Cost (CAC): Target \<$50 (organic/referral-based initially)  
* Lifetime Value (LTV): Target $1,788+ (12 months × $149/mo, assumes 90% retention)  
* LTV:CAC Ratio: Target 35:1 or better

**Operational Metrics:**

* Client onboarding time: Target \<2 hours per client initially, \<30 min at scale  
* Support time per client: Target \<30 min/week average  
* System uptime: Target 99.5%+ (critical workflows must run reliably)  
* Workflow success rate: Target 95%+ (automations execute without errors)

**Growth Metrics:**

* New client signups per month: Target 5 in Month 1, 10 in Month 2, 15+ in Month 3  
* Referral rate: Target 20% of clients refer at least 1 other student  
* Market penetration (Ontario Tech): Target 20 clients \= 18-36% of addressable market

### **9.3 Release Criteria (Feb 25 MVP)**

**Must Pass Before Showcase:**

**Technical Criteria:**

* ✅ Lead can submit form and receive automated response  
* ✅ Lead data appears in Supabase with correct client\_id  
* ✅ Booking link is sent automatically after qualification  
* ✅ Booking creates Google Calendar event with Zoom link  
* ✅ Both parties receive confirmation emails  
* ✅ 24-hour and 1-hour reminders send automatically  
* ✅ Post-session follow-up email sends automatically  
* ✅ Dashboard loads and displays correct data  
* ✅ Client can log in and see their upcoming sessions  
* ✅ No critical errors in n8n workflow executions  
* ✅ All components pass basic testing (5+ end-to-end test runs)

**User Experience Criteria:**

* ✅ Lead receives first automated response within 5 minutes  
* ✅ Entire flow from lead to booking takes \<10 minutes (for qualified lead)  
* ✅ Dashboard is visually polished and easy to understand  
* ✅ Mobile-responsive (works on phone)  
* ✅ No confusing error messages or broken links

**Showcase Criteria:**

* ✅ Live demo works reliably (practice 5+ times)  
* ✅ Backup demo video ready in case of technical issues  
* ✅ Clear slide deck explaining problem → solution → results  
* ✅ Can articulate business model and pricing confidently  
* ✅ Landing page is live and shareable (for post-showcase signups)

### **9.4 Post-Launch Metrics Dashboard**

**We'll Track (Weekly):**

* Total active clients  
* MRR and revenue growth rate  
* Average time saved per client (survey data)  
* Lead volume per client  
* Conversion rates by client  
* No-show rates by client  
* Payment collection rates  
* System uptime and error rates  
* Support tickets and resolution time  
* Client satisfaction scores (NPS)

**Reporting:**

* Weekly internal review of all metrics  
* Monthly client reports showing their specific ROI  
* Quarterly business review for investors/advisors

---

## **10\. Release Plan**

### **10.1 Two-Week Sprint Breakdown (Feb 10 \- Feb 25\)**

**Week 1: Core Infrastructure (Feb 10-16)**

**Day 1-2 (Feb 10-11): Database & Foundation**

* Set up Supabase project  
* Create database schema with RLS policies  
* Test basic CRUD operations  
* Set up Next.js project with Tailwind  
* Deploy hello world to Vercel  
* Set up n8n instance (Railway or Cloud)  
* **Deliverable:** Database ready, basic frontend deployed

**Day 3-4 (Feb 12-13): Lead Capture Workflow**

* Create Tally lead capture form  
* Build n8n webhook endpoint  
* Implement lead qualification logic  
* Test lead → database flow end-to-end  
* Build basic chatbot response sequence  
* **Deliverable:** Lead can submit form and see automated response

**Day 5-7 (Feb 14-16): Booking & Calendar Integration**

* Set up Google Calendar OAuth  
* Build booking workflow in n8n  
* Implement calendar event creation  
* Test time slot availability checking  
* Create Zoom link generation  
* Send booking confirmation emails  
* **Deliverable:** Booking creates calendar event and sends confirmations

**Week 2: Dashboard & Polish (Feb 17-24)**

**Day 1-2 (Feb 17-18): Reminder & Follow-up Workflows**

* Build cron-based reminder workflow  
* Test 24hr and 1hr reminder sending  
* Build post-session follow-up workflow  
* Implement payment reminder logic  
* Test all automated sequences end-to-end  
* **Deliverable:** All automated communications working

**Day 3-4 (Feb 19-20): Dashboard Development**

* Build authentication flow  
* Create main dashboard page  
* Build stats overview component  
* Build upcoming sessions component  
* Build leads pipeline component  
* Connect all components to Supabase  
* **Deliverable:** Functional dashboard showing real data

**Day 5-6 (Feb 21-22): Landing Page & Polish**

* Build landing page (matching Silent Roofer style)  
* Write copy for all sections  
* Create visual flow diagram  
* Set up waitlist/beta signup form  
* Deploy landing page to PomsConvert website  
* **Deliverable:** Professional landing page live

**Day 7 (Feb 23): Testing & Refinement**

* Run 10+ end-to-end tests  
* Fix any bugs or edge cases  
* Polish dashboard UI/UX  
* Test on mobile devices  
* Record backup demo video  
* **Deliverable:** System is reliable and demo-ready

**Day 8 (Feb 24): Showcase Preparation**

* Create presentation deck  
* Practice demo 5+ times  
* Prepare talking points  
* Print QR code for waitlist signup  
* Set up feedback collection  
* Rest and prepare mentally  
* **Deliverable:** Ready to crush Feb 25 showcase

**Feb 25: SHOWCASE DAY** 🚀

### **10.2 Post-Launch Roadmap (March-April)**

**Week 1-2 Post-Launch (Feb 26 \- Mar 8):**

* Conduct user interviews with interested prospects  
* Onboard first 3-5 beta clients  
* Collect detailed feedback on onboarding experience  
* Monitor system performance with real users  
* Quick fixes for any critical issues  
* **Goal:** 3-5 paying beta clients live

**Week 3-4 (Mar 9-22):**

* Build advanced onboarding flow based on feedback  
* Add invoicing enhancements  
* Improve dashboard based on user requests  
* Create case study / testimonial content  
* Publish portfolio piece on website  
* **Goal:** Validate product-market fit with beta cohort

**Month 2 (Mar 23 \- Apr 22):**

* Refine pricing based on willingness-to-pay data  
* Add multi-lead source integrations  
* Build financial reporting features  
* Implement capacity planning tools  
* Scale to 10-15 clients  
* **Goal:** 10-15 clients, proven ROI, standardized processes

**Month 3+ (April onwards):**

* Refactor n8n workflows for multi-tenancy at scale  
* Add Stripe payment processing (rev share model)  
* Build referral automation  
* Expand to other universities  
* Hire first operations assistant (if needed)  
* **Goal:** 20+ clients, sustainable operations, clear path to 50+

### **10.3 Resource Allocation**

**Time Commitment (First 2 Weeks):**

* Poms: 15 hours/week focused build time  
* Breakdown: 3 hours/day Mon-Fri, plus flexibility for debugging

**Budget (MVP Phase):**

* Supabase: Free tier (sufficient for MVP)  
* Vercel: Free tier (sufficient for MVP)  
* n8n Cloud: $20/month (or Railway at $5-10/month)  
* Tally: Free tier (sufficient for MVP)  
* Domain: $12/year (.com)  
* Google Workspace: Free tier (personal Gmail works)  
* SendGrid: Free tier (100 emails/day)  
* **Total MVP Cost: \~$20-30/month**

**Post-Launch Budget (Scaling):**

* Supabase Pro: $25/month (when we hit limits)  
* n8n Cloud Pro: $50/month (more workflows)  
* SendGrid Pay-as-you-go: \~$15-30/month  
* Support tools (if needed): $20/month  
* **Total Operating Cost: \~$100-150/month**

**Break-even with 1 client at $149/month.**

---

## **11\. Go-to-Market Strategy**

### **11.1 Landing Page (campusservice.pomsconvert.ca)**

**Page Structure (Mirror Silent Roofer Admin):**

**Hero Section:**

* Headline: "Run your campus service business in 30 minutes per week instead of 10 hours"  
* Subheadline: "We handle everything between lead and payment. You focus on delivery and school."  
* CTA: \[Join Waitlist\] \[See How It Works\]  
* Visual: Clean dashboard mockup or workflow illustration

**Problem Section:**

* "You're spending more time on admin than delivery"  
* Statistics: 60-70% time on busywork, 3-5 client ceiling, exam period crisis  
* Emotional hook: "You didn't start a business to drown in scheduling emails"

**Solution Section (How It Works):**

1\. We Set Up Your Operational Backend  
   → Interactive intake form, we deploy your infrastructure (\<2 hours)  
     
2\. Everything Runs Automatically  
   → Lead capture → Qualification → Booking → Reminders → Follow-ups  
     
3\. You Check Your Dashboard & Deliver  
   → See today's schedule, new leads, and metrics. Focus on your work.  
     
4\. We Manage Everything In The Background  
   → Weekly check-ins, system optimization, support when needed

**Features Section:**

* Lead capture & qualification  
* Automated booking & scheduling  
* Payment tracking & invoicing  
* Smart reminders (no more no-shows)  
* Post-session follow-up & rebooking  
* Clean dashboard to monitor everything  
* Exam mode for busy periods

**Results Section:**

* "What Our Clients Experience"  
* 8-10 hours saved per week  
* 40-60% higher lead conversion  
* \<20% no-show rate (vs. 30-40% baseline)  
* Scale to 15+ sessions without burnout  
* Professional operations without the overhead

**Pricing Section:**

* Launch Tier: $149/month (first 10 clients)  
* Standard: $199/month  
* What's included: Full system setup, automated operations, weekly monitoring, support  
* Comparison: "Less than hiring a VA, more powerful than DIY tools"

**Social Proof Section:**

* Beta testimonials (after launch)  
* Use cases: Tutoring, Design, Coding, Consulting  
* Before/after: Chaos → Calm

**FAQ Section:**

* "How long does setup take?" → \<45 minutes for you, \<2 hours on our end  
* "What if I don't have Calendly/Stripe?" → We can set it up for you  
* "What if I need to pause during exams?" → Exam mode built in  
* "How is this different from tools like Notion?" → We do the work, you get results  
* "What if something breaks?" → We monitor and fix it

**CTA Section:**

* "Ready to reclaim your time?"  
* \[Join Beta Waitlist\] or \[Book Strategy Call\]  
* Social proof: "Join 50+ student entrepreneurs already saving 8+ hours/week"

### **11.2 Feb 25 Showcase Strategy**

**Presentation Structure (10 minutes):**

**Minute 1-2: The Problem (Make Them Feel It)**

* "Raise your hand if you've ever run a side business during school"  
* "Now keep it up if you've felt completely overwhelmed by the admin work"  
* Story: Student entrepreneur spending 10 hours/week on emails, losing leads, burning out  
* Result: They quit during exams, money left on the table

**Minute 3-4: The Solution (Show the Magic)**

* "What if someone just... ran your operations for you?"  
* Live demo: "Watch what happens when a lead comes in..."  
* Lead submits form → Instant response → Booking confirmed → Calendar updated → Reminders sent  
* "All of that happened in 30 seconds. Zero manual work."

**Minute 5-6: How It Works (The System)**

* Behind the scenes: n8n workflows, Supabase, Next.js  
* But from client perspective: "You fill out one form, we handle the rest"  
* Dashboard demo: "This is what you see. Simple. Clean. Everything you need."

**Minute 7-8: The Business Model**

* "This is a Results-as-a-Service model, not software"  
* Pricing: $149/month, saves 8-10 hours/week \= $18-25/hr effective rate  
* Market: Thousands of student entrepreneurs, starting with Ontario Tech  
* Traction: \[X\] people already on waitlist (from pre-showcase outreach)

**Minute 9-10: The Vision & Ask**

* Vision: "Scale from 5 clients to 50, then to 500 across Ontario universities"  
* Impact: "Enable student entrepreneurs to build businesses without sacrificing grades"  
* Ask: "If you know any student entrepreneurs, send them to our waitlist \[QR code\]"  
* Close: "We're building the operations team every student entrepreneur needs"

**Visual Aids:**

* Clean slide deck (5-7 slides max)  
* Live dashboard demo  
* Workflow animation or video  
* QR code for waitlist signup

**Backup Plan:**

* Pre-recorded demo video if live demo fails  
* Screenshots of each step if video fails  
* Printed handouts with QR code and key stats

### **11.3 Client Acquisition Strategy (First 30 Days)**

**Channel 1: LinkedIn Network**

* Post showcase recap with demo video  
* Share client testimonials as they come in  
* Target: Reach 500+ connections, convert 2-3% to conversations

**Channel 2: Ontario Tech Campus**

* Partner with entrepreneurship club for guest presentation  
* Posters/flyers in high-traffic areas (library, student center)  
* Offer first 5 students $99/month beta pricing  
* Target: 5-10 conversations, convert 2-3 clients

**Channel 3: Reddit**

* r/Entrepreneur, r/sidehustle, r/freelance  
* Share case study format: "How I saved 10 hrs/week running my design business"  
* Link to landing page in comments  
* Target: 100+ upvotes, 10-20 signups

**Channel 4: Direct Outreach**

* Identify 20 student entrepreneurs through Instagram, LinkedIn  
* Personalized DM: "Hey, saw you offer \[service\]. Do you struggle with operations?"  
* Offer free 30-day trial for detailed feedback  
* Target: 20 outreach, 5 responses, 2 conversions

**Channel 5: Referrals**

* Every beta client gets: "Refer a friend, get 1 month free"  
* Make it easy: Pre-written message they can send  
* Track referrals in database  
* Target: 20% of clients refer at least 1

### **11.4 Beta Program Structure**

**Beta Cohort Size:** 5-10 clients

**Beta Pricing:**

* First 5 clients: $99/month (33% discount)  
* Next 5 clients: $129/month (13% discount)  
* Commitment: Minimum 2 months, cancel anytime after

**Beta Expectations:**

* Weekly feedback sessions (15-30 min)  
* Willingness to test new features  
* Provide testimonial if satisfied  
* Participate in case study/portfolio content

**Beta Benefits:**

* Lock in discounted rate forever (even after we raise prices)  
* Priority support and feature requests  
* Direct line to founder (us)  
* Shape the product roadmap

**Beta Success Criteria:**

* All 5 clients save documented 8+ hours/week  
* 90%+ satisfaction score  
* 80%+ retention after month 2  
* At least 3 provide testimonials  
* Generate 1+ case study for portfolio

---

## **12\. Risks & Mitigations**

### **12.1 Technical Risks**

**Risk \#1: n8n Workflow Failures**

* **Probability:** Medium (automation tools can have bugs/downtime)  
* **Impact:** High (broken workflows \= no automations \= broken promise)  
* **Mitigation:**  
  * Build comprehensive error handling in every workflow  
  * Set up Slack/email alerts for all workflow failures  
  * Test each workflow 10+ times before deploying  
  * Build fallback manual processes for critical paths  
  * Monitor execution logs daily during beta  
  * Have redundant workflows for critical functions

**Risk \#2: Supabase RLS Misconfiguration**

* **Probability:** Low (but catastrophic if it happens)  
* **Impact:** Critical (data leak between clients)  
* **Mitigation:**  
  * Test RLS policies extensively with multiple test accounts  
  * Never bypass RLS in production code  
  * Regular security audits of database policies  
  * Limited admin access (only when necessary)  
  * Automated tests that verify data isolation

**Risk \#3: Calendar Integration Breaking**

* **Probability:** Medium (OAuth tokens expire, API changes)  
* **Impact:** High (booking system stops working)  
* **Mitigation:**  
  * Implement robust token refresh logic  
  * Monitor API response codes for failures  
  * Alert us immediately if calendar creation fails  
  * Have manual calendar creation as fallback  
  * Test token refresh process regularly

**Risk \#4: Email Deliverability Issues**

* **Probability:** Medium (emails marked as spam, bounces)  
* **Impact:** Medium-High (clients don't receive critical communications)  
* **Mitigation:**  
  * Use reputable email service (SendGrid/Resend)  
  * Set up proper SPF/DKIM/DMARC records  
  * Monitor bounce and spam rates  
  * Test emails with multiple providers (Gmail, Outlook, etc.)  
  * Have SMS backup for critical reminders (future)

### **12.2 Product Risks**

**Risk \#5: Clients Don't Save As Much Time As Expected**

* **Probability:** Medium (depends on their current workflow)  
* **Impact:** High (core value prop not delivered)  
* **Mitigation:**  
  * Set realistic expectations during onboarding  
  * Document current time spent in detail before setup  
  * Measure and report time saved weekly  
  * Iterate on workflows based on what actually takes time  
  * Be transparent if we can't deliver expected results

**Risk \#6: Dashboard Not Engaging Enough**

* **Probability:** Medium (clients might not check it regularly)  
* **Impact:** Medium (reduced perceived value)  
* **Mitigation:**  
  * Make dashboard genuinely useful (not just pretty)  
  * Send weekly email summaries to drive logins  
  * Add push notifications for important events  
  * Gather feedback on what clients want to see  
  * Iterate based on actual usage patterns

**Risk \#7: Edge Cases Break The System**

* **Probability:** High (every client has unique edge cases)  
* **Impact:** Medium (frustration, support burden)  
* **Mitigation:**  
  * Document all edge cases as they arise  
  * Build flexible workflows that handle variations  
  * Quick turnaround on edge case fixes (\<24 hours)  
  * Set expectation that system evolves with usage  
  * Have manual override options for weird situations

### **12.3 Market Risks**

**Risk \#8: Students Won't Pay $149/Month**

* **Probability:** Medium (price sensitivity in student market)  
* **Impact:** High (no revenue \= no business)  
* **Mitigation:**  
  * Test pricing with beta cohort before committing  
  * Offer flexible payment options (monthly, quarterly, annual)  
  * Make ROI calculation crystal clear ($149/mo \= $37/week for 10 hrs saved)  
  * Consider revenue share model for high earners  
  * Be willing to adjust pricing based on data

**Risk \#9: Can't Find Enough Target Customers**

* **Probability:** Low-Medium (market exists but need to reach them)  
* **Impact:** High (can't scale without customers)  
* **Mitigation:**  
  * Start with personal network and referrals  
  * Validate demand before heavy marketing spend  
  * Build in public (content marketing, case studies)  
  * Partner with university entrepreneurship programs  
  * Expand target market if needed (not just students)

**Risk \#10: Competitor Emerges With Better Solution**

* **Probability:** Low (no one doing this exact thing yet)  
* **Impact:** Medium-High (could lose market share)  
* **Mitigation:**  
  * Move fast to capture early market  
  * Build strong client relationships (high switching cost)  
  * Continuous product improvement based on feedback  
  * Focus on execution quality over features  
  * Differentiate on service, not just technology

### **12.4 Operational Risks**

**Risk \#11: Can't Scale Beyond 10 Clients**

* **Probability:** Medium (manual work per client adds up)  
* **Impact:** High (revenue ceiling, burnout)  
* **Mitigation:**  
  * Standardize everything from day one  
  * Document all processes for future delegation  
  * Build toward shared workflows, not individual  
  * Hire operations assistant at 15-20 clients  
  * Automate client onboarding progressively

**Risk \#12: Poms Gets Overwhelmed (School \+ Clients)**

* **Probability:** Medium (running business while in school is hard)  
* **Impact:** Critical (single point of failure)  
* **Mitigation:**  
  * Set clear boundaries on work hours (15 hrs/week max)  
  * Automate as much as possible (practice what we preach)  
  * Build in buffer time for unexpected issues  
  * Don't over-promise on delivery timelines  
  * Have backup plan (co-founder, assistant, pause signups)

**Risk \#13: Clients Churn After 2-3 Months**

* **Probability:** Medium (depends on value delivery)  
* **Impact:** High (no recurring revenue \= business fails)  
* **Mitigation:**  
  * Deliver measurable value from day one  
  * Regular check-ins to address issues proactively  
  * Continuous improvement based on feedback  
  * Build operational dependency (hard to leave)  
  * Offer annual pricing discount for commitment

### **12.5 Contingency Plans**

**If Feb 25 Demo Fails:**

* Show pre-recorded video instead  
* Explain the vision even if tech doesn't cooperate  
* Focus on problem statement and market opportunity  
* Collect feedback on concept, iterate and re-present

**If We Don't Get 5 Beta Clients in 30 Days:**

* Reassess pricing (maybe too high)  
* Reassess market (maybe wrong target audience)  
* Offer free trials to get users and feedback  
* Pivot to different market segment if needed

**If Technical Debt Becomes Unmanageable:**

* Pause new client onboarding temporarily  
* Spend 1-2 weeks refactoring core systems  
* Document everything properly  
* Bring in technical advisor/contractor if needed

**If Poms Needs to Step Back:**

* Document everything thoroughly  
* Identify potential co-founder or operations lead  
* Set up clients with manual fallbacks  
* Communicate transparently with clients  
* Graceful pause rather than abrupt shutdown

---

## **13\. Appendices**

### **13.1 Glossary**

* **RLS (Row Level Security):** Database security feature that restricts data access based on user identity  
* **n8n:** Open-source automation platform, alternative to Zapier  
* **Supabase:** Open-source Firebase alternative (database \+ auth \+ storage)  
* **MRR (Monthly Recurring Revenue):** Predictable revenue from subscriptions  
* **CAC (Customer Acquisition Cost):** Total cost to acquire one customer  
* **LTV (Lifetime Value):** Total revenue from one customer over their lifetime  
* **RaaS (Results-as-a-Service):** Service model focused on outcomes, not tools

### **13.2 Reference Links**

* **Product:**  
  * Silent Roofer Admin: https://www.pomsconvert.ca/solutions/roofing-lead-intelligence  
  * PomsConvert: https://www.pomsconvert.ca  
* **Technical Documentation:**  
  * Supabase Docs: https://supabase.com/docs  
  * n8n Docs: https://docs.n8n.io  
  * Next.js Docs: https://nextjs.org/docs  
  * Google Calendar API: https://developers.google.com/calendar  
* **Tools:**  
  * Tally Forms: https://tally.so  
  * Vercel Hosting: https://vercel.com  
  * Railway Hosting: https://railway.app

### **13.3 Open Questions (To Resolve)**

1. **Multi-lead source priority:** Which integrations after Tally forms? (Instagram DM vs. WhatsApp vs. SMS)  
2. **Payment flow specifics:** Invoice before or after session? Hard requirement or optional?  
3. **Exam mode implementation:** Fully automated or requires client to toggle manually?  
4. **Support SLA:** What's our response time guarantee? (24 hours? 48 hours?)  
5. **Onboarding call:** Always required or only for complex cases?  
6. **Beta program timeline:** 2 months minimum commitment, or flexible?  
7. **Pricing tiers:** Single price or multiple tiers (basic/pro/premium)?  
8. **Geographic expansion:** Ontario universities first, or open to all of Canada?

### **13.4 Version History**

* **V1.0 (Feb 10, 2026):** Initial PRD created  
* **Future versions will be tracked here as we iterate**

---

## **14\. Sign-Off & Next Steps**

**Document Owner:** Poms Musa, Founder @ PomsConvert  
 **Review Date:** February 10, 2026  
 **Next Review:** Post-Showcase (February 26, 2026\)

**Immediate Next Steps:**

1. Review and approve this PRD  
2. Set up development environment (Supabase, n8n, Next.js)  
3. Begin Week 1 sprint (database schema and lead capture workflow)  
4. Schedule daily check-ins to track progress  
5. Adjust timeline if needed based on complexity

**Success Looks Like (Feb 25):**

* Working demo that wows the audience  
* 10+ interested prospects sign up for beta  
* Clear validation that this solves a real problem  
* Portfolio piece we're proud to showcase  
* Confidence that we can execute on this vision

**Let's build something that matters. 🚀**

---

*End of Product Requirements Document*

