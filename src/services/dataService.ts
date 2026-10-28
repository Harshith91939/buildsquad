import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { normalizeEmail } from './attribution';
import type { 
  RegistrationPublic, 
  Ambassador, 
  RegisterStudentParams, 
  RegisterStudentResponse, 
  CampaignBudget, 
  CampaignMetrics, 
  PlaybookTask, 
  GrowthExperiment,
  DailyRegistrationEntry,
  ChannelBenchmark 
} from '../types';

// Storage keys for demo state persistence
const DEMO_STORAGE_KEYS = {
  LOCAL_REGISTRATIONS: 'buildsquad_demo_local_registrations_v2',
  BUDGET: 'buildsquad_demo_budget_v2',
  PLAYBOOK: 'buildsquad_demo_playbook_v2',
  EXPERIMENTS: 'buildsquad_demo_experiments_v2',
};

// Stable Baseline Ambassadors (Match existing schema assumptions)
export const STABLE_AMBASSADORS: Ambassador[] = [
  { id: 'amb-1', name: 'Rohit Sharma', referral_code: 'AMB-ROHIT', college: 'IIT Madras', target: 10, is_active: true },
  { id: 'amb-2', name: 'Sneha Patil', referral_code: 'AMB-SNEHA', college: 'COEP Pune', target: 10, is_active: true },
  { id: 'amb-3', name: 'Priya Nair', referral_code: 'AMB-PRIYA', college: 'NIT Trichy', target: 10, is_active: true },
  { id: 'amb-4', name: 'Amit Verma', referral_code: 'AMB-AMIT', college: 'DTU Delhi', target: 10, is_active: true },
  { id: 'amb-5', name: 'Varun Reddy', referral_code: 'AMB-VARUN', college: 'BITS Pilani', target: 10, is_active: true },
  { id: 'amb-6', name: 'Ananya Sen', referral_code: 'AMB-ANANYA', college: 'Jadavpur Univ', target: 10, is_active: true },
  { id: 'amb-7', name: 'Kavya Iyer', referral_code: 'AMB-KAVYA', college: 'RVCE Bangalore', target: 10, is_active: true },
  { id: 'amb-8', name: 'Vikram Singh', referral_code: 'AMB-VIKRAM', college: 'Thapar Patiala', target: 10, is_active: true },
  { id: 'amb-9', name: 'Rithik Mehta', referral_code: 'AMB-RITHIK', college: 'VJTI Mumbai', target: 10, is_active: true },
  { id: 'amb-10', name: 'Meera Joshi', referral_code: 'AMB-MEERA', college: 'PSG Tech Coimbatore', target: 10, is_active: true },
];

/**
 * Generates a deterministic, stable 7-day demo dataset (Total: 370 records).
 * Does NOT generate random numbers on every refresh.
 */
export function getStableDemoRegistrations(): RegistrationPublic[] {
  const records: RegistrationPublic[] = [];
  
  // Base anchor date: fixed 7-day sprint window
  const baseDate = new Date('2026-10-23T09:00:00Z');

  // Daily distributions: [Ambassador, Community, Social/Paid, Direct/Peer]
  const dayDistributions = [
    { day: 0, amb: 15, comm: 10, paid: 5, direct: 2 },  // Day 1: 32
    { day: 1, amb: 24, comm: 14, paid: 8, direct: 2 },  // Day 2: 48
    { day: 2, amb: 34, comm: 18, paid: 10, direct: 3 }, // Day 3: 65
    { day: 3, amb: 40, comm: 22, paid: 12, direct: 4 }, // Day 4: 78
    { day: 4, amb: 46, comm: 26, paid: 15, direct: 5 }, // Day 5: 92
    { day: 5, amb: 28, comm: 16, paid: 8, direct: 3 },  // Day 6: 55 (ongoing)
    { day: 6, amb: 0,  comm: 0,  paid: 0,  direct: 0 },  // Day 7: 0 (upcoming)
  ];

  const ambCodes = STABLE_AMBASSADORS.map(a => a.referral_code);

  let ambIndex = 0;
  dayDistributions.forEach(({ day, amb, comm, paid, direct }) => {
    const dayDate = new Date(baseDate);
    dayDate.setDate(dayDate.getDate() + day);

    // 1. Ambassador records
    for (let i = 0; i < amb; i++) {
      const time = new Date(dayDate);
      time.setMinutes(time.getMinutes() + (i * 23) % 720);
      const code = ambCodes[ambIndex % ambCodes.length];
      ambIndex++;
      records.push({
        created_at: time.toISOString(),
        referral_code: code,
        source_channel: 'ambassador',
        is_demo: true,
      });
    }

    // 2. Community records
    for (let i = 0; i < comm; i++) {
      const time = new Date(dayDate);
      time.setMinutes(time.getMinutes() + (i * 37) % 720);
      records.push({
        created_at: time.toISOString(),
        referral_code: null,
        source_channel: 'community',
        is_demo: true,
      });
    }

    // 3. Social / Paid distribution records
    for (let i = 0; i < paid; i++) {
      const time = new Date(dayDate);
      time.setMinutes(time.getMinutes() + (i * 41) % 720);
      records.push({
        created_at: time.toISOString(),
        referral_code: null,
        source_channel: 'social_paid',
        is_demo: true,
      });
    }

    // 4. Direct / Peer records
    for (let i = 0; i < direct; i++) {
      const time = new Date(dayDate);
      time.setMinutes(time.getMinutes() + (i * 59) % 720);
      records.push({
        created_at: time.toISOString(),
        referral_code: i % 2 === 0 ? 'PEER-77' : null,
        source_channel: i % 2 === 0 ? 'peer' : 'direct',
        is_demo: true,
      });
    }
  });

  return records;
}

/**
 * Retrieves registered emails stored locally during demo mode to enforce duplicate-email detection.
 */
function getDemoLocalRegistrations(): { email: string; reg: RegistrationPublic }[] {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEYS.LOCAL_REGISTRATIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDemoLocalRegistration(email: string, reg: RegistrationPublic) {
  try {
    const existing = getDemoLocalRegistrations();
    existing.push({ email: normalizeEmail(email), reg });
    localStorage.setItem(DEMO_STORAGE_KEYS.LOCAL_REGISTRATIONS, JSON.stringify(existing));
  } catch (e) {
    console.warn('Failed saving local demo registration:', e);
  }
}

/**
 * Resets local demo state back to predictable baseline.
 */
export function resetDemoData() {
  localStorage.removeItem(DEMO_STORAGE_KEYS.LOCAL_REGISTRATIONS);
  localStorage.removeItem(DEMO_STORAGE_KEYS.BUDGET);
  localStorage.removeItem(DEMO_STORAGE_KEYS.PLAYBOOK);
  localStorage.removeItem(DEMO_STORAGE_KEYS.EXPERIMENTS);
}

/**
 * Register student using the existing RPC:
 * register_student(p_name text, p_email text, p_college text, p_year int, p_ref text, p_channel text)
 * In demo mode, performs exact validation and duplicate checking locally.
 */
export async function executeStudentRegistration(
  params: RegisterStudentParams,
  forceDemoMode = false
): Promise<RegisterStudentResponse> {
  const normEmail = normalizeEmail(params.p_email);

  // Validate graduation year strictly against 2026, 2027, 2028
  if (![2026, 2027, 2028].includes(params.p_year)) {
    return {
      ok: false,
      error: 'invalid_year',
      message: 'Graduation year must be 2026, 2027, or 2028.',
    };
  }

  // If Supabase is configured and not in forced demo mode, use the live RPC
  if (isSupabaseConfigured && !forceDemoMode && supabase) {
    try {
      const { data, error } = await supabase.rpc('register_student', {
        p_name: params.p_name.trim(),
        p_email: normEmail,
        p_college: params.p_college.trim(),
        p_year: params.p_year,
        p_ref: params.p_ref ? params.p_ref.trim().toUpperCase() : null,
        p_channel: params.p_channel ? params.p_channel.trim().toLowerCase() : 'direct',
      });

      if (error) {
        console.error('register_student RPC error:', error);
        return {
          ok: false,
          error: error.message.includes('duplicate') ? 'duplicate' : error.message,
          message: error.message.includes('duplicate')
            ? 'This email is already registered for the workshop.'
            : error.message,
        };
      }

      const res = data as RegisterStudentResponse;
      return res;
    } catch (e: unknown) {
      const err = e as Error;
      return {
        ok: false,
        error: 'network_error',
        message: err.message || 'Unable to connect to database.',
      };
    }
  }

  // --- LOCAL DEMO ENGINE ---
  await new Promise((res) => setTimeout(res, 500)); // natural simulation delay

  const localSaved = getDemoLocalRegistrations();
  // Check duplicates against demo store
  const isDuplicate = localSaved.some(item => item.email === normEmail);
  if (isDuplicate) {
    return {
      ok: false,
      error: 'duplicate',
      message: 'This email is already registered for the workshop.',
    };
  }

  // Generate reproducible student referral code:
  const sanitizedName = params.p_name.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase() || 'STU';
  const ownCode = `AI-${sanitizedName}${100 + localSaved.length}`;

  const newPublicRecord: RegistrationPublic = {
    created_at: new Date().toISOString(),
    referral_code: params.p_ref ? params.p_ref.trim().toUpperCase() : null,
    source_channel: params.p_channel || 'direct',
    is_demo: true,
  };

  saveDemoLocalRegistration(normEmail, newPublicRecord);

  return {
    ok: true,
    own_code: ownCode,
  };
}

/**
 * Fetches all public registrations:
 * Merges live get_registrations_public() RPC data and/or demo records based on filter.
 */
export async function fetchPublicRegistrations(includeSimulated = true): Promise<{
  data: RegistrationPublic[];
  isLiveConnected: boolean;
  error: string | null;
}> {
  let liveData: RegistrationPublic[] = [];
  let isLive = false;
  let fetchError: string | null = null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.rpc('get_registrations_public');
      if (error) {
        fetchError = error.message;
      } else if (data) {
        liveData = data as RegistrationPublic[];
        isLive = true;
      }
    } catch (e: unknown) {
      fetchError = (e as Error).message;
    }
  }

  // Retrieve stable demo records + locally submitted demo registrations
  const stableDemo = getStableDemoRegistrations();
  const localSubmittedDemo = getDemoLocalRegistrations().map(item => item.reg);
  const allDemo = [...stableDemo, ...localSubmittedDemo];

  let result: RegistrationPublic[] = [];

  if (isLive) {
    if (includeSimulated) {
      result = [...liveData, ...allDemo];
    } else {
      result = liveData.filter(r => !r.is_demo);
    }
  } else {
    // Supabase not configured -> strictly demo data
    result = includeSimulated ? allDemo : [];
  }

  return {
    data: result,
    isLiveConnected: isLive,
    error: fetchError,
  };
}

/**
 * Fetches ambassadors list from Supabase or fallback stable list.
 */
export async function fetchAmbassadorsList(): Promise<Ambassador[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('ambassadors').select('*');
      if (!error && data && data.length > 0) {
        return data as Ambassador[];
      }
    } catch (e) {
      console.warn('Falling back to stable ambassadors list:', e);
    }
  }
  return STABLE_AMBASSADORS;
}

/**
 * Budget Management (Editable local demo state)
 */
export function getStoredBudget(): CampaignBudget {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEYS.BUDGET);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return {
    paidSpend: 1500,
    contingencySpend: 500,
    totalBudget: 2000,
  };
}

export function saveStoredBudget(budget: CampaignBudget) {
  try {
    localStorage.setItem(DEMO_STORAGE_KEYS.BUDGET, JSON.stringify(budget));
  } catch (e) {
    console.warn('Failed saving budget:', e);
  }
}

/**
 * Calculates all verified campaign metrics using the strict assignment formulas.
 */
export function calculateCampaignMetrics(
  registrations: RegistrationPublic[],
  budget: CampaignBudget = getStoredBudget()
): CampaignMetrics {
  const targetRegistrations = 500;
  const totalUnique = registrations.length;
  const progressPct = parseFloat(((totalUnique / targetRegistrations) * 100).toFixed(1));
  const remaining = Math.max(targetRegistrations - totalUnique, 0);

  // Registrations today (UTC day match)
  const todayStr = new Date().toISOString().split('T')[0];
  const registrationsToday = registrations.filter(r => {
    try {
      return new Date(r.created_at).toISOString().split('T')[0] === todayStr;
    } catch {
      return false;
    }
  }).length;

  // Channel classification and counts
  let ambCount = 0;
  let commCount = 0;
  let paidCount = 0;
  let directPeerCount = 0;

  const ambCodes = new Set(STABLE_AMBASSADORS.map(a => a.referral_code.toUpperCase()));

  registrations.forEach(r => {
    const ch = (r.source_channel || '').toLowerCase();
    const ref = (r.referral_code || '').toUpperCase();

    if (ch === 'ambassador' || (ref && ambCodes.has(ref))) {
      ambCount++;
    } else if (ch === 'community' || ch.includes('whatsapp') || ch.includes('discord')) {
      commCount++;
    } else if (ch === 'social_paid' || ch.includes('paid') || ch.includes('ad')) {
      paidCount++;
    } else {
      directPeerCount++;
    }
  });

  // Planned Budget Allocation vs Actual Recorded Expenditure
  const plannedBudgetAllocation = typeof budget.totalBudget === 'number' && !isNaN(budget.totalBudget)
    ? Math.max(0, budget.totalBudget)
    : 2000;
  const plannedPaidSpend = typeof budget.paidSpend === 'number' && !isNaN(budget.paidSpend)
    ? Math.max(0, budget.paidSpend)
    : 1500;

  // Actual recorded spend incurred to date: paid spend disbursed so far, contingency untouched
  const paidTarget = 100;
  const actualPaidSpend = paidCount > 0 
    ? Math.min(plannedPaidSpend, Math.round((paidCount / paidTarget) * plannedPaidSpend))
    : 0;
  const actualContingencySpend = 0; // Contingency reserve remains uncommitted
  const actualRecordedSpend = actualPaidSpend + actualContingencySpend;
  const remainingBudget = Math.max(0, plannedBudgetAllocation - actualRecordedSpend);

  // Cost per paid registration: clearly defined as actualPaidSpend / paidAttributedCount
  const costPerPaidRegistration: number | 'N/A' = paidCount > 0 
    ? parseFloat((actualPaidSpend / paidCount).toFixed(2)) 
    : 'N/A';

  // 7-Day Velocity & Projection calculation
  // Assume 5 elapsed days out of 7
  const elapsedDays = 5;
  const averageDailyPace = elapsedDays > 0 ? totalUnique / elapsedDays : 0;
  // Project end-of-campaign total (7 days total)
  const projectedRegistrations = Math.round(averageDailyPace * 7);
  const paceExplanation = `Based on an average pace of ${averageDailyPace.toFixed(1)} registrations/day across ${elapsedDays} campaign days.`;

  // Channel Benchmarks
  const channels: ChannelBenchmark[] = [
    {
      channelKey: 'ambassador',
      displayName: 'Campus Ambassadors',
      plannedTarget: 250,
      actualCount: ambCount,
      achievementPercentage: Math.round((ambCount / 250) * 100),
      estimatedSpend: 0, // Volunteer peer referral incentives
      costPerRegistration: 'N/A',
    },
    {
      channelKey: 'community',
      displayName: 'College Communities & Clubs',
      plannedTarget: 150,
      actualCount: commCount,
      achievementPercentage: Math.round((commCount / 150) * 100),
      estimatedSpend: 0, // Organic outreach
      costPerRegistration: 'N/A',
    },
    {
      channelKey: 'social_paid',
      displayName: 'Social & Paid Distribution',
      plannedTarget: 100,
      actualCount: paidCount,
      achievementPercentage: Math.round((paidCount / 100) * 100),
      estimatedSpend: actualPaidSpend,
      costPerRegistration: costPerPaidRegistration,
    },
    {
      channelKey: 'direct',
      displayName: 'Direct & Peer Links',
      plannedTarget: 0,
      actualCount: directPeerCount,
      achievementPercentage: 100,
      estimatedSpend: 0,
      costPerRegistration: 'N/A',
    },
  ];

  // Daily Trend calculation across 7 days
  const baseDate = new Date('2026-10-23');
  const dailyTrend: DailyRegistrationEntry[] = [];
  let runningCumulative = 0;

  for (let i = 0; i < 7; i++) {
    const curDate = new Date(baseDate);
    curDate.setDate(curDate.getDate() + i);
    const dateStr = curDate.toISOString().split('T')[0];

    const dayMatches = registrations.filter(r => {
      try {
        return new Date(r.created_at).toISOString().split('T')[0] === dateStr;
      } catch {
        return false;
      }
    });

    let dayAmb = 0;
    let dayComm = 0;
    let dayPaid = 0;
    let dayOther = 0;

    dayMatches.forEach(r => {
      const ch = (r.source_channel || '').toLowerCase();
      const ref = (r.referral_code || '').toUpperCase();
      if (ch === 'ambassador' || (ref && ambCodes.has(ref))) dayAmb++;
      else if (ch === 'community') dayComm++;
      else if (ch === 'social_paid') dayPaid++;
      else dayOther++;
    });

    const dayTotal = dayMatches.length;
    runningCumulative += dayTotal;
    const targetDailyPace = 500 / 7; // ~71.4/day
    const targetCumulative = Math.round(targetDailyPace * (i + 1));

    dailyTrend.push({
      dayNumber: i + 1,
      dateStr,
      dayLabel: `Day ${i + 1} (${curDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`,
      ambassadorCount: dayAmb,
      communityCount: dayComm,
      socialPaidCount: dayPaid,
      otherCount: dayOther,
      totalDay: dayTotal,
      cumulativeTotal: runningCumulative,
      targetCumulative,
    });
  }

  return {
    totalUniqueRegistrations: totalUnique,
    targetRegistrations,
    progressPercentage: progressPct,
    registrationsToday,
    remainingRegistrations: remaining,
    plannedBudgetAllocation,
    actualRecordedSpend,
    remainingBudget,
    totalRecordedSpend: actualRecordedSpend,
    paidAttributedCount: paidCount,
    costPerPaidRegistration,
    projectedRegistrations,
    paceExplanation,
    channels,
    dailyTrend,
  };
}

/**
 * 7-Day Campaign Planner Initial State & Persistence
 */
export function getInitialPlaybookTasks(): PlaybookTask[] {
  return [
    {
      id: 'task-1',
      day: 1,
      title: 'Set up & recruit initial 10 Campus Ambassadors',
      status: 'Completed',
      date: 'Day 1',
      channel: 'Campus & WhatsApp',
      taskOwner: 'Growth Lead',
      notes: 'Onboarded 10 engineering campus captains across tier-1 & tier-2 colleges.',
    },
    {
      id: 'task-2',
      day: 2,
      title: 'Launch Wave 1: College Club WhatsApp Broadcasts',
      status: 'Completed',
      date: 'Day 2',
      channel: 'WhatsApp Communities',
      taskOwner: 'Community Associate',
      notes: 'Distributed free workshop creative with learning agenda to 25 coding club channels.',
    },
    {
      id: 'task-3',
      day: 3,
      title: 'Measure early results & identify winning ambassadors',
      status: 'Completed',
      date: 'Day 3',
      channel: 'Analytics Dashboard',
      taskOwner: 'Growth Analyst',
      notes: 'Identified top referrers in IIT Madras and COEP. K-factor tracking at 1.4.',
    },
    {
      id: 'task-4',
      day: 4,
      title: 'Improve conversion: Launch targeted student peer reminders',
      status: 'Completed',
      date: 'Day 4',
      channel: 'Peer Referral Links',
      taskOwner: 'Campus Lead',
      notes: 'Encouraged registered attendees to invite lab partners for group certificate unlocks.',
    },
    {
      id: 'task-5',
      day: 5,
      title: 'Scale winning channels: Initiate ₹1,500 targeted paid test',
      status: 'Completed',
      date: 'Day 5',
      channel: 'Social & Paid Distribution',
      taskOwner: 'Performance Marketer',
      notes: 'Ran micro-budget Instagram & LinkedIn student test focused on final-year engineers.',
    },
    {
      id: 'task-6',
      day: 6,
      title: 'Close registration gap: Contingency playbook activation',
      status: 'In Progress',
      date: 'Day 6',
      channel: 'All Channels',
      taskOwner: 'Growth Lead',
      notes: 'Mobilizing secondary ambassador cohort to close remaining ~130 registrations.',
      contingencyAction: 'Downside Scenario: If pace dips, reallocate ₹500 contingency budget into highest converting campus groups.',
    },
    {
      id: 'task-7',
      day: 7,
      title: 'Final countdown reminder & post-sprint analytics report',
      status: 'Upcoming',
      date: 'Day 7',
      channel: 'Email & WhatsApp',
      taskOwner: 'Operations Team',
      notes: 'Last call 3 hours prior to workshop. Export anonymized attribution telemetry.',
    },
  ];
}

export function getStoredPlaybook(): PlaybookTask[] {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEYS.PLAYBOOK);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return getInitialPlaybookTasks();
}

export function saveStoredPlaybook(tasks: PlaybookTask[]) {
  try {
    localStorage.setItem(DEMO_STORAGE_KEYS.PLAYBOOK, JSON.stringify(tasks));
  } catch (e) {
    console.warn('Failed saving playbook:', e);
  }
}

/**
 * Growth Experiments Workspace Initial State & Persistence
 */
export function getInitialExperiments(): GrowthExperiment[] {
  return [
    {
      id: 'exp-1',
      hypothesis: 'Focusing on "in 60 Minutes" urgency drives higher CTR than generic skill titles.',
      variantA: '“Build Your First AI Project in 60 Minutes”',
      variantB: '“Build a Practical AI App in One Hour”',
      audience: 'Final-year CS/IT students',
      channel: 'WhatsApp College Groups',
      primaryMetric: 'Registration Click-to-Submit Rate',
      dateRange: 'Oct 24 - Oct 26',
      variantAResults: 142,
      variantBResults: 108,
      interpretation: 'Variant A generated +31.4% higher submissions due to direct action-oriented wording.',
      decision: 'Scale Variant A',
    },
    {
      id: 'exp-2',
      hypothesis: 'Highlighting portfolio project ready for resume outperforms certificate mentions.',
      variantA: 'Headline: “Ship a Resume-Ready AI Mini-Project Before Graduation”',
      variantB: 'Headline: “Get a Verified NxtWave Certificate in AI Fundamentals”',
      audience: '2026 Batch Engineering Students',
      channel: 'LinkedIn Student Posts',
      primaryMetric: 'Referral Code Multiplier',
      dateRange: 'Oct 25 - Oct 27',
      variantAResults: 89,
      variantBResults: 74,
      interpretation: 'Variant A resonated strongly with placement-seeking students.',
      decision: 'Scale Variant A',
    },
  ];
}

export function getStoredExperiments(): GrowthExperiment[] {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEYS.EXPERIMENTS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return getInitialExperiments();
}

export function saveStoredExperiments(experiments: GrowthExperiment[]) {
  try {
    localStorage.setItem(DEMO_STORAGE_KEYS.EXPERIMENTS, JSON.stringify(experiments));
  } catch (e) {
    console.warn('Failed saving experiments:', e);
  }
}
