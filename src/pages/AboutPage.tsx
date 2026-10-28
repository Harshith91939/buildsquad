import React from 'react';
import { 
  FileText, 
  Target, 
  DollarSign, 
  Lock, 
  Layers, 
  CheckCircle, 
  AlertTriangle,
  Terminal
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" />
          <span>System & Strategy Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Campaign Blueprint & Architecture
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Full documentation covering business hypotheses, attribution models, unit economics, security posture, and instructions for running the application.
        </p>
      </div>

      {/* 1. Campaign Assumptions */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">1. Core Campaign Assumptions</h2>
            <p className="text-xs text-slate-400">Simulation parameters for the NxtWave Growth Intern assignment.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-sm text-white">Target Audience & Persona</h3>
            <p className="text-slate-400">
              Final-year and pre-final year engineering students in India (Graduation batches 2026, 2027, and 2028). Students are actively seeking tangible, deployed software projects for campus placement resumes.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-sm text-white">Sprint Window & Volume Goal</h3>
            <p className="text-slate-400">
              Strict 7-day campaign targeting <strong>500 unique student registrations</strong>. This requires an average velocity of ~71.4 registrations per day.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-sm text-white">Budget Cap (₹2,000 INR)</h3>
            <p className="text-slate-400">
              Total authorized budget is capped at ₹2,000. Assumed allocation: ₹1,500 for micro-targeted paid tests and ₹500 contingency reserve. Effective target CAC is ₹4.00 per student.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-sm text-white">Free Technical Workshop</h3>
            <p className="text-slate-400">
              The offer is a 100% free hands-on workshop: “Build Your First AI Project in 60 Minutes”. No credit cards or upfront fees, which lowers conversion friction to near zero.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Attribution Methodology */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">2. Referral Attribution Methodology</h2>
            <p className="text-xs text-slate-400">Hierarchical attribution resolution and first-touch session persistence.</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-300">
          <p className="text-slate-400 leading-relaxed">
            The application captures incoming URL parameters: <code className="text-blue-300">ref</code>, <code className="text-blue-300">src</code>, <code className="text-blue-300">utm_source</code>, <code className="text-blue-300">utm_medium</code>, <code className="text-blue-300">utm_campaign</code>, and <code className="text-blue-300">utm_content</code>. First-touch attribution is stored in <code className="text-blue-300">sessionStorage</code> to survive in-app navigation and page refreshes.
          </p>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="font-bold text-white block">Attribution Hierarchy:</span>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
              <li><strong>Ambassador Channel:</strong> If the referral code matches a known campus ambassador, the channel is attributed as <code className="text-amber-300">ambassador</code>.</li>
              <li><strong>Explicit Source Channel:</strong> Otherwise, if an explicit source parameter is present (<code className="text-blue-300">src</code> or <code className="text-blue-300">utm_source</code>), it maps to the specified channel (e.g. <code className="text-emerald-300">community</code>, <code className="text-purple-300">social_paid</code>).</li>
              <li><strong>Peer Referral Channel:</strong> Otherwise, if an unrecognized referral code is present, it is attributed as <code className="text-cyan-300">peer</code>.</li>
              <li><strong>Direct Channel:</strong> Otherwise, default attribution is <code className="text-slate-300">direct</code>.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* 3. Metric Definitions */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">3. Registration & Budget Metric Definitions</h2>
            <p className="text-xs text-slate-400">Formulas used across the dashboard and analytics views.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <strong className="text-white block">Unique Registrations</strong>
            <p className="text-slate-400">Eligible, deduplicated records verified by the registration RPC or demo engine.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <strong className="text-white block">Target Attainment (%)</strong>
            <p className="text-slate-400"><code className="text-blue-300">(unique registrations / 500) * 100</code></p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <strong className="text-white block">Remaining Registrations</strong>
            <p className="text-slate-400"><code className="text-blue-300">Math.max(500 - unique registrations, 0)</code></p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <strong className="text-white block">Cost Per Paid Registration</strong>
            <p className="text-slate-400">Strictly defined as <code className="text-blue-300">paidSpend / paidAttributedCount</code>, or <code className="text-amber-300">N/A</code> when paid registrations equal 0.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 md:col-span-2">
            <strong className="text-white block">Projected 7-Day Registrations</strong>
            <p className="text-slate-400">Prorated end-of-campaign estimate based on average daily pace over elapsed campaign days: <code className="text-blue-300">(unique registrations / elapsed days) * 7</code>.</p>
          </div>
        </div>
      </div>

      {/* 4. Backend Capabilities & Security Limitations */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">4. Backend Support & Known Limitations</h2>
            <p className="text-xs text-slate-400">Security boundaries respecting existing database tables and RPCs.</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <strong className="text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Existing RPC Integration
            </strong>
            <p className="text-slate-400">
              • <code className="text-blue-300">register_student(p_name, p_email, p_college, p_year, p_ref, p_channel)</code> executes atomic registration, checks for duplicate emails, and returns the student's unique referral code.
            </p>
            <p className="text-slate-400">
              • <code className="text-blue-300">get_registrations_public()</code> returns safe, anonymized aggregate telemetry (<code className="text-blue-300">created_at, referral_code, source_channel, is_demo</code>).
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <strong className="text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Architecture Limitations Respecting Security
            </strong>
            <p className="text-slate-400">
              • <strong>No Service-Role Key in Frontend:</strong> Only publishable anonymous keys are allowed in client bundles.
            </p>
            <p className="text-slate-400">
              • <strong>No Direct Table Modification:</strong> The browser cannot directly alter database schemas, modify spending records, or edit administrative tables. Budget updates and planner tasks are managed via <strong>local demo storage</strong> to avoid creating insecure, permissive public write policies.
            </p>
          </div>
        </div>
      </div>

      {/* 5. How to Run & Deploy */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">5. Running and Deploying BuildSquad</h2>
            <p className="text-xs text-slate-400">Quick start instructions for local development and production hosting.</p>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-3 font-mono">
          <div>
            <span className="text-slate-500 block"># 1. Install Dependencies</span>
            <span className="text-emerald-400">npm install</span>
          </div>
          <div>
            <span className="text-slate-500 block"># 2. Configure Environment (Optional for Live DB)</span>
            <span className="text-slate-400">cp .env.example .env</span>
            <span className="text-slate-500 block text-[11px] mt-0.5"># Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY</span>
          </div>
          <div>
            <span className="text-slate-500 block"># 3. Start Development Server</span>
            <span className="text-emerald-400">npm run dev</span>
          </div>
          <div>
            <span className="text-slate-500 block"># 4. Production Build Verification</span>
            <span className="text-emerald-400">npm run build</span>
          </div>
        </div>
      </div>

    </div>
  );
};
