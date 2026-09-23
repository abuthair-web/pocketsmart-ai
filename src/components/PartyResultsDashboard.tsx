import React, { useState } from 'react';
import {
  PartyPopper,
  Users,
  MapPin,
  Wallet,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Share2,
  Download,
  BookmarkCheck,
  Lightbulb,
  CheckCircle2,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { PartyPlan, PartyPlannerInput } from '../types';
import { formatINR } from '../services/api';
import { BudgetVisualizer } from './BudgetVisualizer';

interface PartyResultsDashboardProps {
  plan: PartyPlan;
  userInput: PartyPlannerInput;
  onReset: () => void;
  onSaveToHistory?: () => void;
}

export const PartyResultsDashboard: React.FC<PartyResultsDashboardProps> = ({
  plan,
  userInput,
  onReset,
  onSaveToHistory,
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopySummary = () => {
    const text = `PocketSmart AI Event Budget Plan for ${plan.event_type} (${plan.guests} Guests in ${plan.location || userInput.location})
Total Budget: ${formatINR(plan.total_budget)}
Allocated Spending: ${formatINR(plan.allocated_budget)}
Emergency/Buffer: ${formatINR(plan.remaining_budget)}

Allocations:
${plan.items.map((i) => `• ${i.category}: ${formatINR(i.recommended_budget)} (${i.percentage || Math.round((i.recommended_budget / plan.total_budget) * 100)}%) [${i.priority} Priority] - ${i.reason}`).join('\n')}

Tips:
${plan.tips.map((t) => `• ${t}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = () => {
    if (onSaveToHistory) {
      onSaveToHistory();
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  // Convert party plan into standard budget plan format for BudgetVisualizer
  const budgetPlanForVisualizer = {
    total_budget: plan.total_budget,
    allocated_budget: plan.allocated_budget,
    remaining_budget: plan.remaining_budget,
    items: plan.items,
    tips: plan.tips,
    summary: plan.summary,
    contingencyPercentage: plan.contingencyPercentage,
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
              {plan.event_type} &bull; {plan.guests} Guests
            </span>
            {plan.location && (
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {plan.location}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Event Budget Allocation Plan
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onReset}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Start New Plan</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Share2 className="w-4 h-4 text-slate-500" />
            <span>{copied ? 'Copied!' : 'Share / Copy'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export / Print</span>
          </button>

          <button
            onClick={handleSave}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition"
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>{saved ? 'Saved!' : 'Save Recommendation'}</span>
          </button>
        </div>
      </div>

      {/* 1. Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Event Budget */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Event Budget</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {formatINR(plan.total_budget)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {plan.event_type} &bull; {plan.guests} Attendees
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600"></div>
        </div>

        {/* Recommended Spending */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Allocated Spending</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-600">
            {formatINR(plan.allocated_budget)}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-semibold text-slate-600">
              {Math.round((plan.allocated_budget / plan.total_budget) * 100)}% of total
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
              Within budget
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600"></div>
        </div>

        {/* Remaining Emergency Buffer */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Emergency Reserve</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600">
            {formatINR(plan.remaining_budget)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {plan.contingencyPercentage || Math.round((plan.remaining_budget / plan.total_budget) * 100)}% cushion for extra plates & transport
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>
        </div>
      </div>

      {/* Plan Strategy Summary */}
      <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <PartyPopper className="w-5 h-5 text-amber-300" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-purple-900">Event Budget Strategy</h4>
          <p className="text-xs sm:text-sm text-purple-950 leading-relaxed">
            {plan.summary}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-purple-800 font-medium">
            <span>
              <strong>Per-Guest Allocation:</strong> ~{formatINR(Math.round(plan.allocated_budget / plan.guests))}
            </span>
            <span>&bull;</span>
            <span>
              <strong>Venue Preference:</strong> {userInput.venuePreference}
            </span>
            <span>&bull;</span>
            <span>
              <strong>Food Types:</strong> {userInput.foodPreferences.join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Visual Budget Breakdown */}
      <BudgetVisualizer plan={budgetPlanForVisualizer} />

      {/* 3. Detailed Category Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Itemized Category Allocations</h3>
            <p className="text-xs text-slate-500">
              Allocated budgets, priorities, and rationales for each party expense
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {plan.items.length} Expense Categories
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.items.map((item, idx) => {
            const percentage = item.percentage || Math.round((item.recommended_budget / plan.total_budget) * 100);
            return (
              <div
                key={`${item.category}-${idx}`}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">
                          {item.category}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getPriorityBadgeClass(
                            item.priority
                          )}`}
                        >
                          {item.priority} Priority
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-purple-700">
                        {formatINR(item.recommended_budget)}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        {percentage}% of budget
                      </span>
                    </div>
                  </div>

                  <div className="py-3">
                    <p className="text-xs text-slate-700 leading-relaxed">
                      &ldquo;{item.reason}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Estimated Indian Event Vendor Pricing</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Practical Event Tips */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Event Planning & Cost-Saving Tips
            </h3>
            <p className="text-xs text-slate-500">
              Curated tips to avoid hidden vendor markups and keep guests happy
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {plan.tips.map((tip, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-slate-900 to-purple-950 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-lg font-bold">Have another event or room to plan?</h4>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            You can customize your event parameters or switch to our Home Interior and Jewelry Planners anytime.
          </p>
        </div>
        <button
          onClick={onReset}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition shrink-0"
        >
          Start New Plan
        </button>
      </div>
    </div>
  );
};
