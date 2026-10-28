import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar, 
  Filter, 
  Sparkles, 
  Edit3, 
  Info, 
  Save, 
  Layers
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  fetchPublicRegistrations, 
  calculateCampaignMetrics, 
  getStoredBudget, 
  saveStoredBudget
} from '../services/dataService';
import { StatCard } from '../components/StatCard';
import type { RegistrationPublic, CampaignBudget, CampaignMetrics } from '../types';

export const DashboardPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<RegistrationPublic[]>([]);

  // Filters
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [includeSimulated, setIncludeSimulated] = useState<boolean>(true);

  // Editable local demo budget
  const [budget, setBudget] = useState<CampaignBudget>(getStoredBudget);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [editPaid, setEditPaid] = useState<number>(budget.paidSpend);
  const [editContingency, setEditContingency] = useState<number>(budget.contingencySpend);

  const loadData = async (simulated: boolean) => {
    const regRes = await fetchPublicRegistrations(simulated);
    setRegistrations(regRes.data);
  };

  useEffect(() => {
    loadData(includeSimulated);
  }, [includeSimulated]);

  // Handle budget update
  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPaid = Math.max(0, Number(editPaid) || 0);
    const cleanContingency = Math.max(0, Number(editContingency) || 0);
    const updated: CampaignBudget = {
      paidSpend: cleanPaid,
      contingencySpend: cleanContingency,
      totalBudget: cleanPaid + cleanContingency,
    };
    setBudget(updated);
    saveStoredBudget(updated);
    setIsEditingBudget(false);
  };

  // Filter registrations by selected channel if not 'all'
  const filteredRegistrations = useMemo(() => {
    if (channelFilter === 'all') return registrations;
    return registrations.filter(r => {
      const ch = (r.source_channel || '').toLowerCase();
      if (channelFilter === 'ambassador') return ch === 'ambassador';
      if (channelFilter === 'community') return ch === 'community';
      if (channelFilter === 'social_paid') return ch === 'social_paid';
      return ch === channelFilter;
    });
  }, [registrations, channelFilter]);

  // Compute metrics from the active filtered registrations and budget
  const metrics: CampaignMetrics = useMemo(() => {
    return calculateCampaignMetrics(filteredRegistrations, budget);
  }, [filteredRegistrations, budget]);

  // Top Referral Codes breakdown
  const referralCodeCounts = useMemo(() => {
    const map: Record<string, number> = {};
    registrations.forEach(r => {
      if (r.referral_code) {
        const c = r.referral_code.toUpperCase();
        map[c] = (map[c] || 0) + 1;
      }
    });
    return Object.entries(map)
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [registrations]);

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Campaign Analytics & Unit Economics</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            NxtWave Growth Sprint Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking 500-student milestone, ₹2,000 budget allocation, and channel velocity.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Channel Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All Channels</option>
              <option value="ambassador" className="bg-slate-900 text-white">Ambassadors (Target: 250)</option>
              <option value="community" className="bg-slate-900 text-white">Communities (Target: 150)</option>
              <option value="social_paid" className="bg-slate-900 text-white">Social & Paid (Target: 100)</option>
              <option value="direct" className="bg-slate-900 text-white">Direct & Peer</option>
            </select>
          </div>

          {/* Simulated Data Toggle */}
          <label className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-300 cursor-pointer hover:border-slate-700 transition">
            <input
              type="checkbox"
              checked={includeSimulated}
              onChange={(e) => setIncludeSimulated(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <span>Include Simulated Data</span>
          </label>

        </div>
      </div>

      {/* KPI Cards Row (Exact assignment fields) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <StatCard
          title="Unique Registrations"
          value={metrics.totalUniqueRegistrations}
          subtitle={`Target: ${metrics.targetRegistrations} (${metrics.progressPercentage}% achieved)`}
          icon={Users}
          badge={`${metrics.progressPercentage}%`}
          badgeColor="emerald"
        />

        <StatCard
          title="Registrations Today"
          value={metrics.registrationsToday}
          subtitle="New student signups recorded today"
          icon={Calendar}
          badge="Daily Pace"
          badgeColor="blue"
        />

        <StatCard
          title="Remaining Registrations"
          value={metrics.remainingRegistrations}
          subtitle="Registrations needed to reach 500"
          icon={TrendingUp}
          badge={metrics.remainingRegistrations === 0 ? 'Goal Reached' : 'Open'}
          badgeColor={metrics.remainingRegistrations === 0 ? 'emerald' : 'amber'}
        />

        <StatCard
          title="Actual Recorded Spend"
          value={`₹${metrics.actualRecordedSpend.toLocaleString('en-IN')}`}
          subtitle={`Planned Cap: ₹${metrics.plannedBudgetAllocation.toLocaleString('en-IN')} (Remaining: ₹${metrics.remainingBudget.toLocaleString('en-IN')})`}
          icon={DollarSign}
          badge="Incurred to Date"
          badgeColor="purple"
        />

      </div>

      {/* Second KPI Row: Cost Per Paid & Projections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Cost Per Paid Registration
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {typeof metrics.costPerPaidRegistration === 'number'
                  ? `₹${metrics.costPerPaidRegistration.toFixed(2)}`
                  : 'N/A'}
              </span>
              <span className="text-xs text-slate-400">
                ({metrics.paidAttributedCount} paid registrations)
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              Computed strictly from actual paid spend incurred (₹{metrics.actualRecordedSpend}) divided by paid-attributed student signups.
            </p>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Projected 7-Day Registrations
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                ~{metrics.projectedRegistrations} Students
              </span>
              <span className="text-xs text-emerald-400 font-semibold">
                (Estimate)
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              {metrics.paceExplanation}
            </p>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl text-blue-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Primary Chart: 7-Day Trend & Target Trajectory */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span>Seven-Day Registration Trend vs Target Pacing</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cumulative actual progress plotted against linear benchmark (~71.4 registrations/day to reach 500).
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-300">Cumulative Registrations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 border-t-2 border-dashed border-slate-500" />
              <span className="text-slate-400">Target Benchmark</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.dailyTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="dayLabel" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 500]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Area 
                type="monotone" 
                dataKey="cumulativeTotal" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#regGrad)" 
                name="Actual Registrations"
              />
              <Area 
                type="monotone" 
                dataKey="targetCumulative" 
                stroke="#64748b" 
                strokeDasharray="4 4" 
                strokeWidth={2} 
                fill="none" 
                name="Target Benchmark"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Planned vs Actual Channel Targets Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Planned vs Actual Channel Targets */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Planned vs Actual Channel Targets</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Target mix: Ambassadors (250), Communities (150), Social & Paid (100).
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                  <th className="pb-3">Source Channel</th>
                  <th className="pb-3 text-right">Target</th>
                  <th className="pb-3 text-right">Actual</th>
                  <th className="pb-3 text-right">Attainment</th>
                  <th className="pb-3 text-right">Channel CAC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {metrics.channels.map((ch) => (
                  <tr key={ch.channelKey} className="hover:bg-slate-800/30">
                    <td className="py-3 font-semibold text-white">
                      {ch.displayName}
                    </td>
                    <td className="py-3 text-right text-slate-400">
                      {ch.plannedTarget > 0 ? ch.plannedTarget : '—'}
                    </td>
                    <td className="py-3 text-right font-extrabold text-white text-sm">
                      {ch.actualCount}
                    </td>
                    <td className="py-3 text-right font-bold text-emerald-400">
                      {ch.achievementPercentage}%
                    </td>
                    <td className="py-3 text-right font-mono text-slate-300">
                      {typeof ch.costPerRegistration === 'number'
                        ? `₹${ch.costPerRegistration.toFixed(2)}`
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Channel Insights */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <span className="font-bold text-white block">Channel Performance Insights:</span>
            <p className="text-slate-400">
              • <strong>Ambassadors</strong> represent the primary acquisition engine with zero cash outlay per registration.
            </p>
            <p className="text-slate-400">
              • <strong>Communities & Clubs</strong> deliver high conversion when technical faculty or club heads circulate the announcement.
            </p>
            <p className="text-slate-400">
              • <strong>Social & Paid</strong> provides controlled incremental volume within the ₹1,500 test allocation.
            </p>
          </div>
        </div>

        {/* Right: Editable Budget & Security Limitation explanation */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Planned Budget Allocation vs Actual Spend</span>
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Planned Cap: ₹{metrics.plannedBudgetAllocation.toLocaleString('en-IN')} INR • Incurred: ₹{metrics.actualRecordedSpend.toLocaleString('en-IN')} INR
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-mono">
                Browser-Local State
              </span>
              <button
                onClick={() => setIsEditingBudget(!isEditingBudget)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title="Edit local demo budget"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isEditingBudget ? (
            <form onSubmit={handleSaveBudget} className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/20 text-[11px] text-blue-300">
                <strong>Local Simulation Editor:</strong> Modifications only affect this browser's session and do not mutate production database records.
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Planned Paid Test Budget (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editPaid}
                  onChange={(e) => setEditPaid(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Planned Contingency Reserve (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editContingency}
                  onChange={(e) => setEditContingency(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                />
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-400">Total Planned Cap: ₹{editPaid + editContingency}</span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Local Budget</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>1. Planned Paid Test Allocation:</span>
                  <strong className="text-white font-mono">₹{budget.paidSpend}</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>2. Planned Contingency Reserve:</span>
                  <strong className="text-white font-mono">₹{budget.contingencySpend}</strong>
                </div>
                <div className="flex justify-between border-t border-slate-800/80 pt-1 text-slate-300">
                  <span className="font-semibold">Total Authorized Budget Cap:</span>
                  <strong className="text-white font-mono font-bold">₹{metrics.plannedBudgetAllocation}</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1.5">
                <div className="flex justify-between text-purple-300">
                  <span className="font-semibold">Actual Recorded Spend to Date:</span>
                  <strong className="text-purple-400 font-mono font-black text-sm">₹{metrics.actualRecordedSpend}</strong>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Paid campaign spend disbursed:</span>
                  <span className="font-mono">₹{metrics.actualRecordedSpend}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Contingency reserve disbursed:</span>
                  <span className="font-mono">₹0</span>
                </div>
              </div>

              <div className="flex justify-between p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <span className="text-emerald-300 font-semibold">Unspent Remaining Balance:</span>
                <strong className="text-emerald-400 font-mono text-sm font-black">₹{metrics.remainingBudget}</strong>
              </div>
            </div>
          )}

          {/* Security Limitation Callout */}
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-slate-400 text-[11px] leading-relaxed space-y-1">
            <span className="font-bold text-blue-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Security Architecture Constraint
            </span>
            <p>
              In strict accordance with assignment constraints, frontend code cannot perform unrestricted database writes to alter backend financial records. Budget changes are safely persisted in <strong>local demo state</strong> rather than creating permissive public write policies.
            </p>
          </div>
        </div>

      </div>

      {/* Daily Registration Table & Top Referral Codes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Daily Breakdown Table */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Daily Registration Telemetry Table</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                  <th className="pb-2">Day</th>
                  <th className="pb-2 text-right">Ambassador</th>
                  <th className="pb-2 text-right">Community</th>
                  <th className="pb-2 text-right">Paid</th>
                  <th className="pb-2 text-right">Other</th>
                  <th className="pb-2 text-right font-bold text-white">Total Day</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {metrics.dailyTrend.map((d) => (
                  <tr key={d.dayNumber} className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-medium text-white">{d.dayLabel}</td>
                    <td className="py-2.5 text-right text-slate-300 font-mono">{d.ambassadorCount}</td>
                    <td className="py-2.5 text-right text-slate-300 font-mono">{d.communityCount}</td>
                    <td className="py-2.5 text-right text-slate-300 font-mono">{d.socialPaidCount}</td>
                    <td className="py-2.5 text-right text-slate-400 font-mono">{d.otherCount}</td>
                    <td className="py-2.5 text-right font-extrabold text-white text-sm">{d.totalDay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Referral Codes */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Top Active Referral Codes</span>
          </h3>

          <div className="space-y-2">
            {referralCodeCounts.map((ref, idx) => (
              <div 
                key={ref.code}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-500 text-[10px]">#{idx + 1}</span>
                  <strong className="text-amber-400">{ref.code}</strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white">{ref.count}</span>
                  <span className="text-slate-500 text-[11px]">students</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
