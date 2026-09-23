import React from 'react';
import {
  Home,
  PartyPopper,
  Gem,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { PlanningModule } from '../types';

interface LandingHeroProps {
  onSelectModule: (mod: PlanningModule) => void;
  onStartPlanning: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onSelectModule, onStartPlanning }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50 pt-8 pb-12 border-b border-slate-200">
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-72 bg-gradient-to-r from-blue-400/10 via-indigo-400/10 to-teal-400/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>GenAI-Powered Budget & Purchase Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
            Pocket<span className="text-blue-600">Smart</span> AI
          </h1>

          <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
            Plan Smart. Spend Smart.
          </p>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            AI-powered recommendations designed around your budget. Get mathematically balanced spending allocations across Home Interior, Parties, and Jewelry with zero overspend.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onStartPlanning}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Planning Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Hard Budget Guarantee &bull; In INR (₹)</span>
            </div>
          </div>
        </div>

        {/* 3 Active Module Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Home Interior Planner */}
          <div
            onClick={() => {
              onSelectModule('home-interior');
              onStartPlanning();
            }}
            className="group relative bg-white rounded-2xl p-6 border-2 border-blue-500 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="absolute -top-3 right-4 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              Active Module
            </div>

            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Home Interior Planner
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Smartly divide your room furnishing budget across essential furniture, lighting, fans, storage, and styling without exceeding your limit.
              </p>

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Bedroom, Living Room, Kitchen & Office</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Modern, Minimalist, Scandinavian styles</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automatic 5-10% contingency buffer</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-blue-600 text-sm font-semibold pt-4 border-t border-slate-100">
              <span>Launch Interior Planner</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Party Planner */}
          <div
            onClick={() => {
              onSelectModule('party-planner');
              onStartPlanning();
            }}
            className="group relative bg-white rounded-2xl p-6 border-2 border-purple-400 hover:border-purple-600 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="absolute -top-3 right-4 bg-purple-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              Active Module
            </div>

            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <PartyPopper className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Party & Event Planner
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Budget birthdays, weddings, anniversaries, and gatherings with balanced venue rent, catering per-plate math, and decor.
              </p>

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Guests, venue, and multi-cuisine preferences</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Catering per-plate & decor allocation</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Zero-overspend emergency buffer</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-purple-600 text-sm font-semibold pt-4 border-t border-slate-100">
              <span>Launch Party Planner</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Jewelry Planner */}
          <div
            onClick={() => {
              onSelectModule('jewelry-planner');
              onStartPlanning();
            }}
            className="group relative bg-white rounded-2xl p-6 border-2 border-amber-400 hover:border-amber-600 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="absolute -top-3 right-4 bg-amber-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              Multimodal Vision
            </div>

            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Gem className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                Jewelry Styling Planner
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Plan gold, silver, or platinum jewelry investments with optional multimodal outfit photo compatibility analysis.
              </p>

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Wedding, Reception, Festive & Casual</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Optional outfit photo analysis</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>BIS Hallmark & 3% GST reserve buffer</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-amber-600 text-sm font-semibold pt-4 border-t border-slate-100">
              <span>Launch Jewelry Planner</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
