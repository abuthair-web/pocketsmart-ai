import React, { useState } from 'react';
import {
  Gem,
  Sparkles,
  Wallet,
  ShieldCheck,
  RotateCcw,
  Share2,
  Download,
  BookmarkCheck,
  Lightbulb,
  CheckCircle2,
  Tag,
  Eye,
  Camera,
} from 'lucide-react';
import { JewelryPlan, JewelryPlannerInput } from '../types';
import { formatINR } from '../services/api';
import { BudgetVisualizer } from './BudgetVisualizer';

interface JewelryResultsDashboardProps {
  plan: JewelryPlan;
  userInput: JewelryPlannerInput;
  onReset: () => void;
  onSaveToHistory?: () => void;
}

export const JewelryResultsDashboard: React.FC<JewelryResultsDashboardProps> = ({
  plan,
  userInput,
  onReset,
  onSaveToHistory,
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopySummary = () => {
    const text = `PocketSmart AI Jewelry Recommendation for ${userInput.occasion} (${userInput.style} Style in ${userInput.metalPreference})
Total Budget: ${formatINR(plan.total_budget)}
Recommended Spending: ${formatINR(plan.recommended_budget)}
Remaining (Making Charges & GST buffer): ${formatINR(plan.remaining_budget)}

Style Advice: ${plan.style_analysis.recommended_style} (${plan.style_analysis.metal}) - ${plan.style_analysis.reason}

Allocations:
${plan.recommendations.map((i) => `• ${i.type}: ${formatINR(i.estimated_budget)} (${i.percentage || Math.round((i.estimated_budget / plan.total_budget) * 100)}%) [${i.priority} Priority] - ${i.design_description}`).join('\n')}

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
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  // Convert jewelry plan to format for BudgetVisualizer
  const budgetPlanForVisualizer = {
    total_budget: plan.total_budget,
    allocated_budget: plan.recommended_budget,
    remaining_budget: plan.remaining_budget,
    items: plan.recommendations.map((r) => ({
      category: r.type,
      recommended_budget: r.estimated_budget,
      priority: r.priority,
      reason: r.reason,
      percentage: r.percentage,
    })),
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
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              {userInput.occasion} &bull; {plan.style_analysis.recommended_style}
            </span>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Gem className="w-3 h-3 text-amber-600" />
              {plan.style_analysis.metal}
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Jewelry Styling & Budget Plan
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
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition"
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>{saved ? 'Saved!' : 'Save Recommendation'}</span>
          </button>
        </div>
      </div>

      {/* 1. Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Budget */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Budget</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {formatINR(plan.total_budget)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ceiling limit for {userInput.occasion}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-600"></div>
        </div>

        {/* Recommended Spending */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Recommended Spending</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-600">
            {formatINR(plan.recommended_budget)}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-semibold text-slate-600">
              {Math.round((plan.recommended_budget / plan.total_budget) * 100)}% allocated
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
              Within budget
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600"></div>
        </div>

        {/* Remaining Buffer */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Remaining Cushion</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600">
            {formatINR(plan.remaining_budget)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {plan.contingencyPercentage || Math.round((plan.remaining_budget / plan.total_budget) * 100)}% reserved for making charges & 3% GST
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>
        </div>
      </div>

      {/* 2. Style Recommendation Section (Section 10) */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 rounded-2xl p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Gem className="w-5 h-5 text-amber-200" />
          </div>
          <div className="space-y-1 flex-1">
            <h4 className="text-base font-extrabold text-slate-900">
              Style Recommendation
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-white/80 rounded-xl border border-amber-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Recommended Style</span>
                <p className="text-sm font-extrabold text-amber-900 mt-0.5">
                  {plan.style_analysis.recommended_style}
                </p>
              </div>

              <div className="p-3 bg-white/80 rounded-xl border border-amber-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Metal & Metallurgy</span>
                <p className="text-sm font-extrabold text-amber-900 mt-0.5">
                  {plan.style_analysis.metal}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-2">
              <strong className="text-slate-900">Reason:</strong> {plan.style_analysis.reason}
            </p>
          </div>
        </div>
      </div>

      {/* 3. AI Outfit Compatibility Analysis (Section 10) if image was analyzed */}
      {(userInput.outfitImage || plan.style_analysis.outfit_analysis) && (
        <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Camera className="w-5 h-5 text-amber-600" />
            <span>AI Outfit Compatibility Analysis</span>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full ml-auto">
              Multimodal Vision Grounded
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-4 pt-1">
            {userInput.outfitImage?.previewUrl && (
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100 shadow-xs">
                <img
                  src={userInput.outfitImage.previewUrl}
                  alt="Uploaded Outfit"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 space-y-1.5">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100/80">
                {plan.style_analysis.outfit_analysis ||
                  `The jewelry styling harmonizes with the garment's textile finish and neckline geometry, ensuring the ${plan.style_analysis.metal} ornaments accentuate the outfit without competing with the embroidery.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Visual Budget Breakdown */}
      <BudgetVisualizer plan={budgetPlanForVisualizer} />

      {/* 5. Detailed Jewelry Recommendation Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Jewelry Item Recommendations</h3>
            <p className="text-xs text-slate-500">
              Allocated budgets, design specifications, and rationales for each ornament piece
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {plan.recommendations.length} Pieces Planned
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.recommendations.map((item, idx) => {
            const percentage = item.percentage || Math.round((item.estimated_budget / plan.total_budget) * 100);
            return (
              <div
                key={`${item.type}-${idx}`}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">
                          {item.type}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getPriorityBadgeClass(
                            item.priority
                          )}`}
                        >
                          {item.priority} Priority
                        </span>
                      </div>
                      {item.style && (
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          {item.style} Silhouette
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-amber-700">
                        {formatINR(item.estimated_budget)}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        {percentage}% of budget
                      </span>
                    </div>
                  </div>

                  {/* Design Description */}
                  <div className="pt-3 pb-2">
                    <p className="text-xs font-bold text-slate-900 mb-1">Design Characteristics:</p>
                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                      {item.design_description}
                    </p>
                  </div>

                  {/* Rationale */}
                  <div className="py-2">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <span className="font-semibold text-slate-800">Styling Rationale:</span> {item.reason}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Estimated Market Price (BIS Hallmark Basis)</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Jewelry Buying & Hallmark Tips */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Jewelry Shopping & Hallmark Safeguards
            </h3>
            <p className="text-xs text-slate-500">
              Crucial standards to protect your purchase in Indian jewelry showrooms
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
      <div className="bg-gradient-to-r from-slate-900 to-amber-950 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-lg font-bold">Need another piece or event planned?</h4>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            You can configure another jewelry set or easily jump into our Home Interior and Party Planner modules.
          </p>
        </div>
        <button
          onClick={onReset}
          className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-600/30 transition shrink-0"
        >
          Start New Plan
        </button>
      </div>
    </div>
  );
};
