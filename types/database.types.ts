/* ------------------------------------------------------------------ */
/*  Database types matching the Supabase schema from the PRD           */
/* ------------------------------------------------------------------ */

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string;
  business_name: string | null;
  service_type: string | null;
  hourly_rate: number | null;
  default_session_duration: number | null;
  calendar_integration: Record<string, unknown> | null;
  availability_schedule: Record<string, string[]> | null;
  exam_mode_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export type LeadStatus = "new" | "qualified" | "booked" | "completed" | "cold";

export interface Lead {
  id: string;
  client_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  service_requested: string | null;
  budget_range: string | null;
  timeline: string | null;
  source: string | null;
  status: LeadStatus;
  qualification_score: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type SessionStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no-show"
  | "rescheduled";

export type PaymentStatus = "pending" | "paid" | "overdue";

export interface Session {
  id: string;
  client_id: string;
  lead_id: string | null;
  scheduled_time: string;
  end_time: string;
  status: SessionStatus;
  calendar_event_id: string | null;
  meeting_link: string | null;
  session_notes: string | null;
  payment_status: PaymentStatus;
  payment_amount: number | null;
  invoice_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Automation {
  id: string;
  client_id: string;
  automation_type: string | null;
  triggered_at: string | null;
  target_email: string | null;
  status: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface ClientSetting {
  id: string;
  client_id: string;
  setting_key: string;
  setting_value: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}
