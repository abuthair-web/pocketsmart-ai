import React from 'react';
import { PartyPopper, Gem, ArrowLeft, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { PlanningModule } from '../types';

interface ComingSoonModuleProps {
  module: 'party-planner' | 'jewelry-planner';
  onBackToHomeInterior: () => void;
  onOpenArchitecture: () => void;
}

export const ComingSoonModule: React.FC<ComingSoonModuleProps> = ({
  module,
  onBackToHomeInterior,
  onOpenArchitecture,
}) => {
  const isParty = module === 'party-planner';

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none ${
            isParty ? 'bg-purple-500' : 'bg-amber-500'
          }`}
        />

        <div className="relative">
          <div
            className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl mb-4 ${
              isParty
                ? 'bg-gradient-to-tr from-purple-700 to-indigo-600 shadow-purple-500/30'
                : 'bg-gradient-to-tr from-amber-600 to-yellow-500 shadow-amber-500/30'
            }`}
          >
            {isParty ? <PartyPopper className="w-10 h-10" /> : <Gem className="w-10 h-10" />}
          </div>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              isParty
                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                : 'bg-amber-100 text-amber-900 border border-amber-200'
            }`}
          >
            Coming in Phase 3
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            {isParty ? 'Party & Event Budget Planner' : 'Jewelry & Outfit Styling Planner'}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mt-2 leading-relaxed">
            {isParty
              ? 'Effortlessly plan birthdays, anniversaries, and social gatherings within a strict budget ceiling. Allocate catering, venue, cake, and decor without surprise costs.'
              : 'Smart jewelry budget planning with multimodal Gemini outfit analysis. Upload your dress photo to receive complementary metal, gemstone, and ornament allocations.'}
          </p>
        </div>

        {/* Feature Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto pt-4">
          {isParty ? (
            <>
              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
                <h4 className="font-bold text-xs text-purple-900 mb-1">Guest Sizing</h4>
                <p className="text-[11px] text-purple-700">Per-plate catering math & capacity bounds</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
                <h4 className="font-bold text-xs text-purple-900 mb-1">Venue & Decor</h4>
                <p className="text-[11px] text-purple-700">Balanced venue rent vs stage decoration</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
                <h4 className="font-bold text-xs text-purple-900 mb-1">Entertainment & Buffer</h4>
                <p className="text-[11px] text-purple-700">DJ sound, cake, and 8% emergency cushion</p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
                <h4 className="font-bold text-xs text-amber-900 mb-1">Multimodal Vision</h4>
                <p className="text-[11px] text-amber-800">Gemini vision extracts dominant fabric hues</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
                <h4 className="font-bold text-xs text-amber-900 mb-1">Metal Matching</h4>
                <p className="text-[11px] text-amber-800">Gold, Rose Gold, Kundan, and Silver splits</p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
                <h4 className="font-bold text-xs text-amber-900 mb-1">Making Charges</h4>
                <p className="text-[11px] text-amber-800">Transparent GST & wastage calculations</p>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onBackToHomeInterior}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Use Home Interior Planner</span>
          </button>

          <button
            onClick={onOpenArchitecture}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition flex items-center justify-center gap-2"
          >
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>View Architecture Specs</span>
          </button>
        </div>
      </div>
    </div>
  );
};
