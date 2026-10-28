import React, { useState } from 'react';
import { 
  FlaskConical, 
  Copy, 
  Check, 
  Plus, 
  Info, 
  FileText
} from 'lucide-react';
import { getStoredExperiments, saveStoredExperiments } from '../services/dataService';
import { CONTENT_TEMPLATES } from '../services/templates';
import type { GrowthExperiment } from '../types';

export const ExperimentPage: React.FC = () => {
  const [experiments, setExperiments] = useState<GrowthExperiment[]>(getStoredExperiments);
  const [activeTab, setActiveTab] = useState<'experiments' | 'content'>('experiments');

  // New experiment form state
  const [showNewExp, setShowNewExp] = useState(false);
  const [newHypothesis, setNewHypothesis] = useState('');
  const [newVariantA, setNewVariantA] = useState('');
  const [newVariantB, setNewVariantB] = useState('');
  const [newAudience, setNewAudience] = useState('');
  const [newChannel, setNewChannel] = useState('WhatsApp');
  const [newMetric, setNewMetric] = useState('Registrations');

  // Template generator customization
  const [selectedTemplateId, setSelectedTemplateId] = useState(CONTENT_TEMPLATES[0].id);
  const [templateInputs, setTemplateInputs] = useState<Record<string, string>>({
    LINK: `${window.location.origin}/?ref=AI-CLUB&src=whatsapp`,
    CODE: 'AI-CLUB',
    NAME: 'Aryan Sharma',
  });
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const handleCreateExperiment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHypothesis || !newVariantA || !newVariantB) return;

    const created: GrowthExperiment = {
      id: `exp-${Date.now()}`,
      hypothesis: newHypothesis,
      variantA: newVariantA,
      variantB: newVariantB,
      audience: newAudience || 'Engineering Students',
      channel: newChannel,
      primaryMetric: newMetric,
      dateRange: 'Active Test',
      variantAResults: 0,
      variantBResults: 0,
      interpretation: 'Test initiated. Awaiting sufficient sample size before declaring decision.',
      decision: 'Iterate',
    };

    const updated = [created, ...experiments];
    setExperiments(updated);
    saveStoredExperiments(updated);
    setShowNewExp(false);
    setNewHypothesis('');
    setNewVariantA('');
    setNewVariantB('');
  };

  const handleUpdateDecision = (id: string, decision: GrowthExperiment['decision']) => {
    const updated = experiments.map(exp => exp.id === id ? { ...exp, decision } : exp);
    setExperiments(updated);
    saveStoredExperiments(updated);
  };

  const activeTemplate = CONTENT_TEMPLATES.find(t => t.id === selectedTemplateId) || CONTENT_TEMPLATES[0];

  // Render populated template
  const generatedTemplateText = React.useMemo(() => {
    let text = activeTemplate.templateText;
    Object.entries(templateInputs).forEach(([key, val]) => {
      text = text.replaceAll(`{{${key}}}`, val || `[${key}]`);
    });
    return text;
  }, [activeTemplate, templateInputs]);

  const handleCopyGenerated = () => {
    navigator.clipboard.writeText(generatedTemplateText);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Growth Laboratory & Creative Assets</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Experiments & Content Workspace
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Conduct structured A/B message testing and customize template-based outreach for campus channels.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-900 border border-slate-800 p-1 rounded-2xl flex items-center gap-1">
          <button
            onClick={() => setActiveTab('experiments')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'experiments'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>A/B Growth Experiments</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'content'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Content & Broadcast Templates</span>
          </button>
        </div>
      </div>

      {/* 1. EXPERIMENTS VIEW */}
      {activeTab === 'experiments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Active Growth Experiments</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every hypothesis paired with verifiable metrics before scaling.
              </p>
            </div>

            <button
              onClick={() => setShowNewExp(!showNewExp)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>{showNewExp ? 'Cancel' : 'New Experiment'}</span>
            </button>
          </div>

          {/* New Experiment Form */}
          {showNewExp && (
            <form onSubmit={handleCreateExperiment} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in">
              <h3 className="text-sm font-bold text-white">Draft New Hypothesis Test</h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Hypothesis</label>
                <input
                  type="text"
                  required
                  value={newHypothesis}
                  onChange={(e) => setNewHypothesis(e.target.value)}
                  placeholder="e.g. Action-driven headlines will convert higher than skill-focused titles"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Variant A (Control)</label>
                  <input
                    type="text"
                    required
                    value={newVariantA}
                    onChange={(e) => setNewVariantA(e.target.value)}
                    placeholder="e.g. “Build Your First AI Project in 60 Minutes”"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Variant B (Challenger)</label>
                  <input
                    type="text"
                    required
                    value={newVariantB}
                    onChange={(e) => setNewVariantB(e.target.value)}
                    placeholder="e.g. “Build a Practical AI App in One Hour”"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Audience</label>
                  <input
                    type="text"
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value)}
                    placeholder="e.g. 2026 Batch CS Engineers"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Channel</label>
                  <input
                    type="text"
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                    placeholder="e.g. WhatsApp Groups"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Primary Metric</label>
                  <input
                    type="text"
                    value={newMetric}
                    onChange={(e) => setNewMetric(e.target.value)}
                    placeholder="e.g. Click-to-Registration Rate"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
              >
                Launch Experiment
              </button>
            </form>
          )}

          {/* Experiments List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiments.map((exp) => (
              <div 
                key={exp.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                      {exp.channel}
                    </span>
                    <span className="text-slate-400">{exp.dateRange}</span>
                  </div>

                  <h3 className="font-bold text-white text-sm leading-snug">
                    {exp.hypothesis}
                  </h3>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px] font-bold block uppercase">Variant A</span>
                      <p className="text-white font-medium text-xs line-clamp-2">{exp.variantA}</p>
                      <span className="text-emerald-400 font-bold font-mono text-xs">{exp.variantAResults} signups</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-slate-400 text-[10px] font-bold block uppercase">Variant B</span>
                      <p className="text-white font-medium text-xs line-clamp-2">{exp.variantB}</p>
                      <span className="text-slate-300 font-bold font-mono text-xs">{exp.variantBResults} signups</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <strong className="text-slate-300 block mb-0.5">Interpretation:</strong>
                    {exp.interpretation}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Decision:</span>
                  <select
                    value={exp.decision}
                    onChange={(e) => handleUpdateDecision(exp.id, e.target.value as GrowthExperiment['decision'])}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-white font-semibold text-xs focus:outline-none"
                  >
                    <option value="Scale Variant A">Scale Variant A</option>
                    <option value="Scale Variant B">Scale Variant B</option>
                    <option value="Iterate">Iterate</option>
                    <option value="Stop">Stop</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 2. CONTENT & TEMPLATES VIEW */}
      {activeTab === 'content' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Outreach Content Generator</h2>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  Template-Based
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pre-formatted, verified templates for campus WhatsApp groups, club leads, and social media.
              </p>
            </div>

            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Templates require manual sharing. Messages are never sent automatically.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Template Selector & Variables */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Select Channel Template
                </label>
                <div className="space-y-2">
                  {CONTENT_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => setSelectedTemplateId(tmpl.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                        selectedTemplateId === tmpl.id
                          ? 'bg-blue-600/15 border-blue-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{tmpl.title}</span>
                        <span className="text-[10px] uppercase font-mono text-slate-500">{tmpl.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Variable Inputs */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-white block">Template Parameters</span>
                {activeTemplate.variables.map((v) => (
                  <div key={v}>
                    <label className="block text-[11px] text-slate-400 mb-1">{`{{${v}}}`}</label>
                    <input
                      type="text"
                      value={templateInputs[v] || ''}
                      onChange={(e) => setTemplateInputs({ ...templateInputs, [v]: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Live Formatted Output & Copy */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Formatted Output
                </span>
                <button
                  onClick={handleCopyGenerated}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {copiedTemplate ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTemplate ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {generatedTemplateText}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Copy and paste into your campus channel.</span>
                <span className="text-emerald-400">No external AI API call required</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
