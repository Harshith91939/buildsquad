import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  Copy, 
  Check, 
  MessageCircle, 
  Share2, 
  Search, 
  ArrowUpDown, 
  Target
} from 'lucide-react';
import { fetchAmbassadorsList, fetchPublicRegistrations } from '../services/dataService';
import type { Ambassador, RegistrationPublic } from '../types';

export const AmbassadorPage: React.FC = () => {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationPublic[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambassador Selector state
  const [selectedAmbassadorId, setSelectedAmbassadorId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'count' | 'name' | 'rank'>('count');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Copied state
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [ambList, regRes] = await Promise.all([
        fetchAmbassadorsList(),
        fetchPublicRegistrations(true),
      ]);
      setAmbassadors(ambList);
      setRegistrations(regRes.data);
      if (ambList.length > 0) {
        setSelectedAmbassadorId(ambList[0].id);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Compute attributed registration counts by referral code from the exact same dataset
  const countMap = useMemo(() => {
    const map: Record<string, number> = {};
    registrations.forEach(r => {
      if (r.referral_code) {
        const code = r.referral_code.trim().toUpperCase();
        map[code] = (map[code] || 0) + 1;
      }
    });
    return map;
  }, [registrations]);

  // Selected ambassador object
  const selectedAmbassador = useMemo(() => {
    return ambassadors.find(a => a.id === selectedAmbassadorId) || ambassadors[0] || null;
  }, [ambassadors, selectedAmbassadorId]);

  // Selected ambassador's referral details
  const selectedCode = selectedAmbassador?.referral_code || 'AMB-ROHIT';
  const selectedAttributedCount = countMap[selectedCode.toUpperCase()] || 0;
  const targetThreshold = selectedAmbassador?.target || 10;
  const progressToTarget = Math.min(100, Math.round((selectedAttributedCount / targetThreshold) * 100));

  const originUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const referralUrl = `${originUrl}/?ref=${encodeURIComponent(selectedCode)}&src=ambassador`;
  const shareMessageText = `🚀 Hey everyone! Join NxtWave's free hands-on workshop: "Build Your First AI Project in 60 Minutes".\n\nUse my ambassador referral code ${selectedCode} to get confirmed entry:\n${referralUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(shareMessageText);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessageText)}`, '_blank');
  };

  // Build Leaderboard
  const leaderboardData = useMemo(() => {
    const list = ambassadors.map(amb => {
      const count = countMap[amb.referral_code.toUpperCase()] || 0;
      return {
        ...amb,
        attributedCount: count,
        target: amb.target || 10,
      };
    });

    // Filter search
    const filtered = list.filter(item => {
      const q = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.referral_code.toLowerCase().includes(q) ||
        item.college.toLowerCase().includes(q)
      );
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortField === 'count') {
        return sortOrder === 'desc' 
          ? b.attributedCount - a.attributedCount 
          : a.attributedCount - b.attributedCount;
      }
      if (sortField === 'name') {
        return sortOrder === 'desc'
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      }
      return 0;
    });

    return filtered.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [ambassadors, countMap, searchTerm, sortField, sortOrder]);

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Trophy className="w-3.5 h-3.5" />
          <span>Campus Ambassador Central</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Ambassador Links & Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Track referral attribution, copy pre-crafted outreach links, and inspect peer captain performance across colleges.
        </p>
      </div>

      {/* Ambassador Hub: Selector & Share Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Selector & Details */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-4">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Campus Ambassador Profile
            </label>
            <select
              value={selectedAmbassadorId}
              onChange={(e) => setSelectedAmbassadorId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              {ambassadors.map(amb => (
                <option key={amb.id} value={amb.id}>
                  {amb.name} ({amb.referral_code}) — {amb.college}
                </option>
              ))}
            </select>
          </div>

          {selectedAmbassador && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Assigned College</span>
                  <strong className="text-white text-sm">{selectedAmbassador.college}</strong>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Referral Code</span>
                  <strong className="font-mono text-amber-400 text-sm font-black">{selectedAmbassador.referral_code}</strong>
                </div>
              </div>

              {/* Progress towards default target of 10 */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-emerald-400" />
                    Target Progress ({selectedAttributedCount} / {targetThreshold} Registrations)
                  </span>
                  <span className="font-bold text-emerald-400">{progressToTarget}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressToTarget}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500">
                  Default target: 10 student registrations per campus ambassador.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Quick Share Links & WhatsApp actions */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-blue-400" />
            <span>Ambassador Share Kit</span>
          </h3>

          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">
              Direct Referral Link
            </label>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2 pl-3">
              <span className="text-xs text-slate-300 font-mono truncate flex-1">
                {referralUrl}
              </span>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition flex-shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Copied' : 'Copy Link'}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">
              Formatted Share Message
            </label>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
              {shareMessageText}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleCopyMessage}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              {copiedMsg ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedMsg ? 'Copied Message' : 'Copy Message'}</span>
            </button>
            
            <button
              onClick={handleWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>

      </div>

      {/* Ambassador Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Official Ambassador Leaderboard</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Attributed registrations calculated from the public registration dataset.
            </p>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, code, college..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            {/* Sort Toggle */}
            <button
              onClick={() => {
                setSortField('count');
                setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
              }}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
              title="Toggle Sort Order"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                <th className="pb-3 px-3">Rank</th>
                <th className="pb-3 px-3">Ambassador Name</th>
                <th className="pb-3 px-3">College</th>
                <th className="pb-3 px-3">Referral Code</th>
                <th className="pb-3 px-3 text-right">Attributed Signups</th>
                <th className="pb-3 px-3 text-right">Target (10)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading ambassador records...
                  </td>
                </tr>
              ) : leaderboardData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No matching ambassador found.
                  </td>
                </tr>
              ) : (
                leaderboardData.map((item) => {
                  const targetPct = Math.min(100, Math.round((item.attributedCount / item.target) * 100));
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-slate-800/40 transition-colors ${
                        item.id === selectedAmbassadorId ? 'bg-blue-600/10' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        {item.rank === 1 ? '🥇 #1' : item.rank === 2 ? '🥈 #2' : item.rank === 3 ? '🥉 #3' : `#${item.rank}`}
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">
                        {item.name}
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {item.college}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-amber-400">
                        {item.referral_code}
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-white text-sm">
                        {item.attributedCount}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className={`font-semibold ${targetPct >= 100 ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {targetPct}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
