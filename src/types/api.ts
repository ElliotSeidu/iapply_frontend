// Types mirror the Django REST Framework serializers exactly (accounts + tracker apps).
// Keeping these 1:1 with the backend avoids the frontend inventing fields that are
// silently discarded (or worse, faked) — a common source of confusing "data loss" bugs.

export type ApplicationChannel =
  | 'linkedin'
  | 'referral'
  | 'company_site'
  | 'email'
  | 'job_fair'
  | 'recruiter'
  | 'other';

export const CHANNEL_LABELS: Record<ApplicationChannel, string> = {
  linkedin: 'LinkedIn',
  referral: 'Referral',
  company_site: 'Company Site',
  email: 'Email',
  job_fair: 'Job Fair',
  recruiter: 'Recruiter Outreach',
  other: 'Other',
};

export type ApplicationStatus =
  | 'applied'
  | 'oa'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  oa: 'Online Assessment',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

// Board/analytics ordering — matches the natural funnel progression.
export const STATUS_ORDER: ApplicationStatus[] = [
  'applied',
  'oa',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
];

export interface StatusEvent {
  id: string;
  status: ApplicationStatus;
  occurred_at: string; // ISO datetime
  notes: string;
}

export interface Reminder {
  id: string;
  application: string; // Application UUID
  remind_at: string; // ISO datetime
  message: string;
  is_done: boolean;
  is_auto_generated: boolean;
}

export interface Application {
  id: string;
  company_name: string;
  role_title: string;
  channel: ApplicationChannel;
  source_detail: string;
  date_applied: string; // ISO date (YYYY-MM-DD)
  current_status: ApplicationStatus;
  resume_version: string;
  notes: string;
  created_at: string;
  updated_at: string;
  status_events: StatusEvent[];
  reminders: Reminder[];
  days_since_applied: number;
  is_stale: boolean;
}

// Payload for creating/editing an application. current_status/id/timestamps are
// server-controlled — the API rejects (ignores) them if sent, so we never send them.
export interface ApplicationInput {
  company_name: string;
  role_title: string;
  channel: ApplicationChannel;
  source_detail: string;
  date_applied: string;
  resume_version: string;
  notes: string;
}

export interface ReminderInput {
  application: string;
  remind_at: string;
  message: string;
  is_done?: boolean;
}

export interface ChannelPerformance {
  channel: ApplicationChannel;
  label: string;
  total_applications: number;
  response_rate: number;
}

export interface AnalyticsData {
  total_applications: number;
  status_breakdown: Partial<Record<ApplicationStatus, number>>;
  channel_performance: ChannelPerformance[];
  avg_days_to_first_response: number | null;
  stale_count: number;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
