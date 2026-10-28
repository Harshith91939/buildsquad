import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Check, 
  Copy, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Users, 
  Clock, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { executeStudentRegistration } from '../services/dataService';
import { captureAndGetAttribution, normalizeEmail } from '../services/attribution';
import type { RegisterStudentResponse } from '../types';

export const LandingPage: React.FC = () => {
  const [attribution, setAttribution] = useState(() => captureAndGetAttribution());
  
  // Registration form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [year, setYear] = useState<number>(2026);
  const [referralCode, setReferralCode] = useState(attribution.ref || '');

  // UI status
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [response, setResponse] = useState<RegisterStudentResponse | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const attr = captureAndGetAttribution();
    setAttribution(attr);
    if (attr.ref) {
      setReferralCode(attr.ref);
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const trimmedName = name.trim();
    const cleanEmail = normalizeEmail(email);
    const trimmedCollege = college.trim();

    if (!trimmedName) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid student email address.');
      return;
    }
    if (!trimmedCollege) {
      setErrorMessage('Please specify your college or university name.');
      return;
    }
    if (![2026, 2027, 2028].includes(Number(year))) {
      setErrorMessage('Graduation year must be 2026, 2027, or 2028.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await executeStudentRegistration({
        p_name: trimmedName,
        p_email: cleanEmail,
        p_college: trimmedCollege,
        p_year: Number(year),
        p_ref: referralCode ? referralCode.trim().toUpperCase() : null,
        p_channel: attribution.resolvedChannel || 'direct',
      });

      setSubmitting(false);

      if (res.ok) {
        setResponse(res);
      } else {
        setResponse(null);
        setErrorMessage(res.message || 'Registration failed. Please check inputs and try again.');
      }
    } catch (err: unknown) {
      setSubmitting(false);
      setResponse(null);
      setErrorMessage((err as Error).message || 'Network error occurred during registration.');
    }
  };

  const getShareUrl = (code: string) => {
    const base = window.location.origin;
    return `${base}/?ref=${encodeURIComponent(code)}&utm_source=whatsapp`;
  };

  const handleCopyLink = (code: string) => {
    const url = getShareUrl(code);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleWhatsAppShare = (code: string) => {
    const url = getShareUrl(code);
    const msg = `🚀 Join me for NxtWave's free hands-on workshop: "Build Your First AI Project in 60 Minutes"! Use my referral code ${code} to secure priority entry: ${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const faqs = [
    {
      q: 'Is prior Artificial Intelligence or Machine Learning experience required?',
      a: 'No prior AI/ML experience is required. The session is structured for engineering students with basic programming familiarity. All core LLM integration concepts and scaffolding will be introduced during the hands-on code-along.',
    },
    {
      q: 'Is there any fee or hidden cost for attending this workshop?',
      a: 'No. The workshop is 100% free for eligible 2026, 2027, and 2028 graduation engineering students as part of the BuildSquad student initiative.',
    },
    {
      q: 'What software or tools will I need to have installed?',
      a: 'A modern web browser and a free GitHub account. Detailed workspace instructions and code starter repositories are accessed directly online during the session.',
    },
    {
      q: 'Will the workshop session be recorded?',
      a: 'Yes, registered participants with verified attendance will receive access to the workshop code repository, deployment checklist, and session recap materials.',
    },
  ];

  return (
    <div className="space-y-16 py-8">
      
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        
        {/* Attribution / Referral Pill if present */}
        {attribution.ref && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Referral Applied: <strong className="font-mono text-white">{attribution.ref}</strong> (Channel: {attribution.resolvedChannel})</span>
          </div>
        )}

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>100% Free Hands-on Technical Workshop</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
          Build Your First AI Project <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
            in 60 Minutes.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Move from passive theory to shipping code. Learn how modern AI applications connect frontends to large language models and deploy your functional project in an intensive live sprint.
        </p>

        {/* Value badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-2">
          <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-blue-400" /> 60-Minute Intensive
          </span>
          <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <Users className="w-3.5 h-3.5 text-emerald-400" /> Limited to 500 Students
          </span>
          <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <Layers className="w-3.5 h-3.5 text-purple-400" /> Free Open-Source Starter Kit
          </span>
        </div>

      </section>

      {/* Main Registration Card / Confirmation Section */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6">
        
        {response && response.ok ? (
          /* CONFIRMATION STATE */
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">Registration Confirmed!</h2>
              <p className="text-xs text-slate-300">
                You have successfully claimed your spot for <strong className="text-white">“Build Your First AI Project in 60 Minutes”</strong>.
              </p>
            </div>

            {/* Own Referral Link Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-left space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Your Unique Referral Code
                </span>
                <button
                  onClick={() => response.own_code && handleCopyCode(response.own_code)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied' : 'Copy Code'}
                </button>
              </div>

              <div className="text-2xl font-mono font-black text-amber-400 tracking-wider">
                {response.own_code}
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">
                  Your Shareable Referral Link:
                </label>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2 pl-3">
                  <span className="text-xs text-slate-300 font-mono truncate flex-1">
                    {response.own_code ? getShareUrl(response.own_code) : ''}
                  </span>
                  <button
                    onClick={() => response.own_code && handleCopyLink(response.own_code)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition flex-shrink-0"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedLink ? 'Copied Link' : 'Copy Link'}
                  </button>
                </div>
              </div>

              {/* WhatsApp Share Button */}
              <button
                onClick={() => response.own_code && handleWhatsAppShare(response.own_code)}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Share on WhatsApp with Classmates</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-500">
              Note: Keep your referral link saved. You can use it to refer peers and track your standing on the Ambassador Leaderboard.
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-bold text-white">Reserve Your Free Spot</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your details to register. Open strictly for 2026, 2027, and 2028 batch engineering students.
              </p>
            </div>

            {/* Error / Duplicate Alert */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-400 block mb-0.5">Registration Error</span>
                  {errorMessage}
                </div>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aditya Verma"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Student Email <span className="text-blue-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aditya@college.edu or name@gmail.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm transition"
                />
              </div>

              {/* College & Year Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    College / University <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. IIT Madras, BITS, VIT"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Graduation Year <span className="text-blue-400">*</span>
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-sm transition"
                  >
                    <option value={2026}>2026 (Final Year)</option>
                    <option value={2027}>2027 (Pre-Final Year)</option>
                    <option value={2028}>2028 (Sophomore)</option>
                  </select>
                </div>
              </div>

              {/* Referral Code (read-only or editable if present) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Referral Code (Optional)
                  </label>
                  {attribution.ref && (
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      ✓ Pre-filled from invite link
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="e.g. AMB-ROHIT or AI-REF123"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-mono text-sm placeholder-slate-500 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 disabled:opacity-50 transition flex items-center justify-center gap-2 group"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Confirming Registration...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Free Registration</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-slate-500 pt-1">
                Channel Attribution: <strong className="text-slate-400">{attribution.resolvedChannel}</strong> • No payment or credit card required
              </div>

            </form>
          </div>
        )}

      </section>

      {/* Learning Outcomes Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">What You Will Build & Learn</h2>
          <p className="text-xs text-slate-400">Concrete technical capabilities acquired during the 60-minute sprint.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
              1
            </div>
            <h3 className="font-bold text-sm text-white">LLM API Architecture</h3>
            <p className="text-slate-400 leading-relaxed">
              Understand how frontends communicate with modern AI endpoints. Master prompt structuring, token streaming, and handling asynchronous inference errors safely.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              2
            </div>
            <h3 className="font-bold text-sm text-white">Hands-on Code-Along</h3>
            <p className="text-slate-400 leading-relaxed">
              Build a functional full-stack mini-project from scratch in under 45 minutes using real-world reactive patterns and clean component architecture.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
              3
            </div>
            <h3 className="font-bold text-sm text-white">Live Web Deployment</h3>
            <p className="text-slate-400 leading-relaxed">
              Ship your working project to a live public URL. Add a tangible, verifiable artifact to your resume and GitHub profile before graduation.
            </p>
          </div>
        </div>
      </section>

      {/* Simple 3-Step Agenda */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">60-Minute Workshop Agenda</h2>
          <p className="text-xs text-slate-400">Structured minute-by-minute hands-on flow.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex-shrink-0">
              00 – 15m
            </span>
            <div>
              <h4 className="text-sm font-bold text-white">Part 1: AI Integration Fundamentals & Architecture</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Overview of LLM system mechanics, secure API client configuration, and boilerplate inspection.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex-shrink-0">
              15 – 45m
            </span>
            <div>
              <h4 className="text-sm font-bold text-white">Part 2: Hands-on Code-Along & Core Prompt Logic</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Live building of the AI mini-application, connecting interactive state to backend prompts and output rendering.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
              45 – 60m
            </span>
            <div>
              <h4 className="text-sm font-bold text-white">Part 3: Deployment, Live Demo & Career Roadmap Q&A</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Publishing projects to a public URL, troubleshooting edge cases, and actionable next steps for software placement prep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Should Attend */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>Who Should Attend</span>
          </h2>
          <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Final-Year & Pre-Final Year Engineers (2026, 2027, 2028 Batches):</strong> Students seeking practical project implementations to distinguish their resumes in campus recruitment drives.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Aspiring Full-Stack & Software Developers:</strong> Engineers with foundational JavaScript/Python or web knowledge who want to build applied AI products.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Campus Tech Leads & Club Organizers:</strong> Student leaders aiming to introduce hands-on software development methodologies to their college communities.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="text-center space-y-1 mb-6">
          <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about the workshop.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={faq.q}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-blue-400 transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Campaign Disclaimer Footer Notice */}
      <section className="max-w-3xl mx-auto px-4 text-center">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-500 flex items-start gap-3 text-left">
          <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Campaign Simulation Notice:</strong> This web application is a growth engine simulation created for the NxtWave Growth Intern assignment. It models acquisition velocity, referral mechanics, and budget constraints targeting 500 student registrations across 7 campaign days on a ₹2,000 budget cap.
          </div>
        </div>
      </section>

    </div>
  );
};
