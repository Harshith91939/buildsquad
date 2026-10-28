import React from 'react';
import { Sparkles, Database, RotateCcw } from 'lucide-react';
import { resetDemoData } from '../services/dataService';

interface DemoBannerProps {
  isLiveConnected: boolean;
  includeSimulated: boolean;
  onToggleSimulated: (val: boolean) => void;
  onDataReset: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  isLiveConnected,
  includeSimulated,
  onToggleSimulated,
  onDataReset,
}) => {
  const handleReset = () => {
    if (window.confirm('Reset local demo registrations and budget back to default baseline?')) {
      resetDemoData();
      onDataReset();
    }
  };

  if (isLiveConnected && !includeSimulated) {
    return (
      <div className="bg-emerald-950/80 border-b border-emerald-800/80 px-4 py-2 text-xs text-emerald-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">LIVE DATABASE ACTIVE:</span>
            <span>Displaying live production records only. Simulated data excluded.</span>
          </div>
          <button
            onClick={() => onToggleSimulated(true)}
            className="text-xs text-emerald-400 hover:text-white underline font-semibold"
          >
            Show Simulated Baseline
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-950/90 border-b border-amber-600/40 px-4 py-2 text-xs text-amber-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="font-extrabold uppercase tracking-wide bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded text-[10px]">
            SIMULATED DEMO DATA
          </span>
          <span className="text-amber-100">
            {isLiveConnected
              ? 'Displaying merged dataset (Live records + 7-Day Demo Simulation).'
              : 'Supabase credentials not configured. Running offline demo engine with stable 7-day data.'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isLiveConnected && (
            <button
              onClick={() => onToggleSimulated(!includeSimulated)}
              className="text-xs text-amber-300 hover:text-white underline font-semibold"
            >
              Exclude Simulated Data
            </button>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-700/50 text-[11px] font-semibold transition"
            title="Reset demo registrations and budget back to original baseline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
