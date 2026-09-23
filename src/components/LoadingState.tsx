import React, { useEffect, useState } from 'react';
import { Sparkles, PieChart, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PlanningModule } from '../types';

interface LoadingStateProps {
  module?: PlanningModule;
}

const STEPS_BY_MODULE: Record<PlanningModule, string[]> = {
  'home-interior': [
    'Parsing room type, budget ceiling & selected requirements...',
    'Calibrating interior style materials & standard Indian vendor price points...',
    'Calculating balanced item-by-item allocations and 5-10% contingency buffer...',
    'Running mathematical validation to enforce zero-overspend rule...',
    'Structuring actionable recommendations & cost-saving tips...',
  ],
  'party-planner': [
    'Analyzing event type, guest count & venue parameters...',
    'Calculating per-plate catering estimates and food preference tiers...',
    'Balancing decor, entertainment & photography allocations...',
    'Validating zero budget overrun and setting emergency buffer...',
    'Finalizing comprehensive event expenditure plan & tips...',
  ],
  'jewelry-planner': [
    'Evaluating occasion, jewelry type, and metal preferences...',
    'Analyzing uploaded outfit textile hues, necklines & textures...',
    'Allocating centerpiece vs accent pieces within budget ceiling...',
    'Factoring in BIS hallmarking, making charges & GST cushion...',
    'Structuring styling synergy and purchase recommendations...',
  ],
};

export const LoadingState: React.FC<LoadingStateProps> = ({ module = 'home-interior' }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const steps = STEPS_BY_MODULE[module] || STEPS_BY_MODULE['home-interior'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1100);
    return () => clearInterval(interval);
  }, [steps]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 sm:p-12 text-center max-w-2xl mx-auto my-8 space-y-6">
      {/* Animated Orb / Loader */}
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
          <Sparkles className="w-10 h-10 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
          PocketSmart AI is creating your personalized plan...
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Our GenAI budget planning engine is formulating a realistic, non-overrun allocation tailored to your exact inputs.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden max-w-md mx-auto">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
        ></div>
      </div>

      {/* Stepper Checklist */}
      <div className="max-w-md mx-auto text-left space-y-2.5 pt-2">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          return (
            <div
              key={step}
              className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                isCurrent
                  ? 'text-blue-700 font-bold opacity-100'
                  : isDone
                  ? 'text-slate-600 font-medium opacity-80'
                  : 'text-slate-400 opacity-40'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0"></div>
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0"></div>
              )}
              <span className="truncate">{step}</span>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-xs font-semibold text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Strict Budget Cap Guard
        </span>
        <span className="flex items-center gap-1.5">
          <PieChart className="w-4 h-4 text-blue-600" />
          Proportionate Distribution
        </span>
      </div>
    </div>
  );
};
