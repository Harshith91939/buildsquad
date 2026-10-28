import React, { useState } from 'react';
import { 
  Calendar, 
  Save, 
  Info, 
  TrendingDown, 
  RotateCcw
} from 'lucide-react';
import { getStoredPlaybook, saveStoredPlaybook, getInitialPlaybookTasks } from '../services/dataService';
import type { PlaybookTask } from '../types';

export const PlaybookPage: React.FC = () => {
  const [tasks, setTasks] = useState<PlaybookTask[]>(getStoredPlaybook);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState(false);

  const handleUpdateField = (id: string, field: keyof PlaybookTask, value: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleSave = () => {
    saveStoredPlaybook(tasks);
    setSaveNotice(true);
    setEditingId(null);
    setTimeout(() => setSaveNotice(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('Reset 7-Day Playbook back to default strategy planner?')) {
      const init = getInitialPlaybookTasks();
      setTasks(init);
      saveStoredPlaybook(init);
    }
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Growth Strategy Execution</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Seven-Day Campaign Playbook
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Editable day-by-day operational roadmap for reaching 500 verified student registrations within budget.
        </p>
      </div>

      {/* Downside Scenario Contingency Plan Callout (Section 5 requirement) */}
      <div className="bg-amber-950/30 border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-amber-300 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-amber-400" />
            <span>Downside Scenario Simulation & Contingency Response</span>
          </h2>
          <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-semibold">
            Pace Risk Mitigation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Ambassador Shortfall</span>
            <strong className="text-white">150 / 250</strong>
            <span className="text-rose-400 text-[11px] block">-100 gap</span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Community Shortfall</span>
            <strong className="text-white">100 / 150</strong>
            <span className="text-rose-400 text-[11px] block">-50 gap</span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Social / Paid Shortfall</span>
            <strong className="text-white">50 / 100</strong>
            <span className="text-rose-400 text-[11px] block">-50 gap</span>
          </div>
          <div className="bg-amber-950/50 p-3 rounded-xl border border-amber-500/40">
            <span className="text-amber-200 block font-semibold">Total Downside Volume</span>
            <strong className="text-amber-300 text-base">300 Registrations</strong>
            <span className="text-amber-400 text-[11px] block">-200 gap from 500 target</span>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
          <span className="font-bold text-white block">Prescribed Strategic Contingencies:</span>
          <ul className="space-y-1.5 text-slate-400">
            <li>• <strong>Recruit 15 Emergency Secondary Ambassadors:</strong> Offer priority placement interview vouchers and ₹200 micro-bounties to rapidly activate 15 additional campus captains across 2nd tier engineering colleges.</li>
            <li>• <strong>Expand Partner Distribution:</strong> Directly contact regional tech Discord hubs, Telegram university placement channels, and student coding societies with an exclusive group registration link.</li>
            <li>• <strong>Reallocate Remaining Budget:</strong> Shift the ₹500 contingency budget towards verified high-converting campus WhatsApp groups and Instagram micro-influencers.</li>
          </ul>
        </div>
      </div>

      {/* Editable Planner Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span>7-Day Campaign Execution Tasks</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Editable in local demo state. Changes persist in your browser.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {saveNotice && (
              <span className="text-xs text-emerald-400 font-semibold animate-in fade-in">
                ✓ Playbook Saved
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
              title="Reset Tasks"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task Cards List */}
        <div className="space-y-4">
          {tasks.map((task) => {
            const isEditing = editingId === task.id;
            return (
              <div 
                key={task.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-slate-700 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Day {task.day}
                    </span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) => handleUpdateField(task.id, 'title', e.target.value)}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs font-bold flex-1"
                      />
                    ) : (
                      <h3 className="font-bold text-white text-sm">{task.title}</h3>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status selector */}
                    <select
                      value={task.status}
                      onChange={(e) => handleUpdateField(task.id, 'status', e.target.value)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${
                        task.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : task.status === 'In Progress'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      <option value="Completed" className="bg-slate-900 text-white">Completed</option>
                      <option value="In Progress" className="bg-slate-900 text-white">In Progress</option>
                      <option value="Upcoming" className="bg-slate-900 text-white">Upcoming</option>
                    </select>

                    <button
                      onClick={() => setEditingId(isEditing ? null : task.id)}
                      className="text-xs text-slate-400 hover:text-blue-400 px-2 py-1 underline"
                    >
                      {isEditing ? 'Done' : 'Edit'}
                    </button>
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Primary Channel:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={task.channel}
                        onChange={(e) => handleUpdateField(task.id, 'channel', e.target.value)}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs w-full"
                      />
                    ) : (
                      <span className="text-slate-300 font-medium">{task.channel}</span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Task Owner:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={task.taskOwner}
                        onChange={(e) => handleUpdateField(task.id, 'taskOwner', e.target.value)}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs w-full"
                      />
                    ) : (
                      <span className="text-slate-300 font-medium">{task.taskOwner}</span>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Milestone Target:</span>
                    <span className="text-slate-300 font-medium">Day {task.day} Execution Window</span>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <span className="text-slate-500 block text-[11px] mb-1">Operational Notes:</span>
                  {isEditing ? (
                    <textarea
                      rows={2}
                      value={task.notes}
                      onChange={(e) => handleUpdateField(task.id, 'notes', e.target.value)}
                      className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  ) : (
                    <p className="text-xs text-slate-400 leading-relaxed">{task.notes}</p>
                  )}
                </div>

                {task.contingencyAction && (
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                    <strong>Contingency Action:</strong> {task.contingencyAction}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Security & Persistence Notice */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-500 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Architecture Note:</strong> The existing Supabase schema does not contain an administrative task-tracking table. To adhere strictly to the assignment's rule of never modifying the database schema or introducing insecure write policies, task changes are managed via browser local demo storage.
          </div>
        </div>

      </div>

    </div>
  );
};
