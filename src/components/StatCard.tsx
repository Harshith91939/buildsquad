import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: 'emerald' | 'blue' | 'amber' | 'rose' | 'purple';
  trend?: string;
  trendPositive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = 'blue',
  trend,
  trendPositive = true,
}) => {
  const badgeStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700/80 transition-all duration-200 shadow-sm relative overflow-hidden group">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium text-slate-400 tracking-wide uppercase">{title}</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</span>
            {badge && (
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badgeStyles[badgeColor]}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400 leading-normal">{subtitle}</p>
          )}
          {trend && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs">
              <span className={trendPositive ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                {trend}
              </span>
              <span className="text-slate-500">vs target pace</span>
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-800/70 border border-slate-700/50 rounded-xl text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-600/10 group-hover:border-blue-500/30 transition">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

