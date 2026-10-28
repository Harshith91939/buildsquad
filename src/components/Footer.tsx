import React from 'react';
import { ShieldCheck, Heart, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/70 text-slate-400 py-10 mt-16 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base">BuildSquad</span>
              <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                NxtWave Growth Sprint
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A high-velocity viral campaign architecture built to acquire 500 motivated engineering & college students within 7 days on an ultra-lean ₹2,000 budget (Target CAC ₹4.00). Powered by organic referral loops and peer incentives.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Zero-exposure architecture: Read-isolated RPCs & client anon authentication only</span>
            </div>
          </div>

          {/* Campaign Parameters */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Target Metrics</h4>
            <ul className="text-xs space-y-1.5 text-slate-400">
              <li>• Target Registrations: <strong className="text-white">500 Students</strong></li>
              <li>• Campaign Runway: <strong className="text-white">7 Days</strong></li>
              <li>• Total Budget Cap: <strong className="text-white">₹2,000 INR</strong></li>
              <li>• Allowable CAC: <strong className="text-emerald-400">₹4.00 / student</strong></li>
              <li>• Primary Loop: <strong className="text-blue-400">Ambassador K-Factor &gt; 1.0</strong></li>
            </ul>
          </div>

          {/* Quick Routes */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Navigation</h4>
            <ul className="text-xs space-y-1.5">
              <li>
                <a href="/" className="hover:text-blue-400 transition-colors">Landing Page & Registration</a>
              </li>
              <li>
                <a href="/ambassador" className="hover:text-blue-400 transition-colors">Campus Ambassador Hub</a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-blue-400 transition-colors">Growth Analytics & Burn Rate</a>
              </li>
              <li>
                <a href="/about" className="hover:text-blue-400 transition-colors">Attribution & Strategic Assumptions</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-1">
            <span>Crafted for NxtWave Growth Intern Assignment with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
            <span>and data-driven growth principles.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulated Sprint Engine</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
