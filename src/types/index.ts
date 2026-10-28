export interface RegistrationPublic {
  created_at: string;
  referral_code: string | null;
  source_channel: string | null;
  is_demo?: boolean;
}

export interface Ambassador {
  id: string;
  name: string;
  referral_code: string;
  college: string;
  target: number; // default 10
  is_active: boolean;
}

export interface RegisterStudentParams {
  p_name: string;
  p_email: string;
  p_college: string;
  p_year: number; // 2026, 2027, or 2028
  p_ref?: string | null;
  p_channel?: string | null;
}

export interface RegisterStudentResponse {
  ok: boolean;
  own_code?: string;
  error?: string | 'duplicate' | null;
  message?: string;
}

export interface CampaignBudget {
  paidSpend: number;      // default ₹1,500
  contingencySpend: number; // default ₹500
  totalBudget: number;    // ₹2,000
}

export interface ChannelBenchmark {
  channelKey: 'ambassador' | 'community' | 'social_paid' | 'direct' | 'peer';
  displayName: string;
  plannedTarget: number;
  actualCount: number;
  achievementPercentage: number;
  estimatedSpend: number;
  costPerRegistration: number | 'N/A';
}

export interface DailyRegistrationEntry {
  dayNumber: number;
  dateStr: string; // YYYY-MM-DD
  dayLabel: string;
  ambassadorCount: number;
  communityCount: number;
  socialPaidCount: number;
  otherCount: number;
  totalDay: number;
  cumulativeTotal: number;
  targetCumulative: number;
}

export interface CampaignMetrics {
  totalUniqueRegistrations: number;
  targetRegistrations: number; // 500
  progressPercentage: number;
  registrationsToday: number;
  remainingRegistrations: number;
  plannedBudgetAllocation: number; // ₹2,000 planned ceiling
  actualRecordedSpend: number;     // Actual incurred expenditure to date
  remainingBudget: number;         // plannedBudgetAllocation - actualRecordedSpend
  totalRecordedSpend: number;      // Actual recorded spend
  paidAttributedCount: number;
  costPerPaidRegistration: number | 'N/A';
  projectedRegistrations: number;
  paceExplanation: string;
  channels: ChannelBenchmark[];
  dailyTrend: DailyRegistrationEntry[];
}

export interface PlaybookTask {
  id: string;
  day: number;
  title: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  date: string;
  channel: string;
  taskOwner: string;
  notes: string;
  contingencyAction?: string;
}

export interface GrowthExperiment {
  id: string;
  hypothesis: string;
  variantA: string;
  variantB: string;
  audience: string;
  channel: string;
  primaryMetric: string;
  dateRange: string;
  variantAResults: number;
  variantBResults: number;
  interpretation: string;
  decision: 'Scale Variant A' | 'Scale Variant B' | 'Iterate' | 'Stop';
}

export interface ContentTemplate {
  id: string;
  title: string;
  category: 'whatsapp' | 'club_outreach' | 'social_post' | 'headline' | 'reminder';
  templateText: string;
  variables: string[];
}
