import React, { useState } from 'react';
import {
  X,
  Layers,
  Database,
  PartyPopper,
  Gem,
  Lock,
  Camera,
  Server,
  Code2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: 'architecture' | 'party' | 'jewelry' | 'database';
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
  activeTab: initialTab = 'architecture',
}) => {
  const [tab, setTab] = useState<'architecture' | 'party' | 'jewelry' | 'database'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl z-10 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                PocketSmart AI &mdash; System Architecture & Future Roadmap
              </h3>
              <p className="text-xs text-slate-500">
                Modular design specifications for Phase 1 (Home Interior), Phase 2 (DB/Auth), and Phase 3 (Multimodal)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="border-b border-slate-200 px-6 flex space-x-6 text-xs font-bold text-slate-500 bg-white">
          <button
            onClick={() => setTab('architecture')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition ${
              tab === 'architecture'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Fullstack Architecture</span>
          </button>

          <button
            onClick={() => setTab('party')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition ${
              tab === 'party'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <PartyPopper className="w-4 h-4 text-purple-600" />
            <span>Party Planner (Module 2)</span>
          </button>

          <button
            onClick={() => setTab('jewelry')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition ${
              tab === 'jewelry'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <Gem className="w-4 h-4 text-amber-600" />
            <span>Jewelry Planner & Multimodal (Module 3)</span>
          </button>

          <button
            onClick={() => setTab('database')}
            className={`py-3.5 border-b-2 flex items-center gap-2 transition ${
              tab === 'database'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Database & Auth Schema</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {tab === 'architecture' && (
            <div className="space-y-6 text-xs sm:text-sm text-slate-700">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Clean API Separation (Backend & Frontend)
                </h4>
                <p className="text-blue-950 text-xs leading-relaxed">
                  PocketSmart AI follows strict modular decoupling: frontend UI components handle presentation and user interactions; backend proxy endpoints (`/api/recommendations/generate`) securely handle Gemini API calls, schema validation, and hard budget compliance.
                </p>
              </div>

              {/* Pipeline Diagram */}
              <div>
                <h5 className="font-bold text-slate-800 mb-3 text-xs uppercase tracking-wider">
                  The End-to-End Recommendation Pipeline
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-blue-600">STEP 1</span>
                    <h6 className="font-bold text-slate-900 text-xs">User Inputs</h6>
                    <p className="text-[11px] text-slate-500">
                      Room, style, requirements, preferences, and hard budget ceiling in INR.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-indigo-600">STEP 2</span>
                    <h6 className="font-bold text-slate-900 text-xs">Gemini Reasoning</h6>
                    <p className="text-[11px] text-slate-500">
                      Evaluates room ergonomics, priority weighting, and market estimates.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600">STEP 3</span>
                    <h6 className="font-bold text-slate-900 text-xs">Hard Budget Guard</h6>
                    <p className="text-[11px] text-slate-500">
                      Enforces sum &le; budget, auto-allocates 5-10% contingency buffer.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-amber-600">STEP 4</span>
                    <h6 className="font-bold text-slate-900 text-xs">Dashboard & Catalog</h6>
                    <p className="text-[11px] text-slate-500">
                      SVG Donut breakdown, itemized spec cards, and verified matching catalog.
                    </p>
                  </div>
                </div>
              </div>

              {/* Codebase Organization */}
              <div>
                <h5 className="font-bold text-slate-800 mb-2 text-xs uppercase tracking-wider">
                  Modular Folder Layout
                </h5>
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto">
{`├── server.ts                       # Express + Vite SSR entry point
├── server/
│   ├── geminiService.ts            # Secure Gemini 3.8 SDK & budget sanitizer
│   └── historyStore.ts             # Session persistence & Supabase bridge
├── src/
│   ├── components/                 # Isolated UI components (Landing, Form, Dashboard)
│   ├── data/mockProducts.ts        # Verified non-hallucinated product database
│   ├── services/api.ts             # API client & localStorage fail-safe
│   └── types/index.ts              # Strongly typed contracts`}
                </pre>
              </div>
            </div>
          )}

          {tab === 'party' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                <div className="flex items-center gap-2 font-bold text-purple-900 mb-1">
                  <PartyPopper className="w-5 h-5 text-purple-600" />
                  <span>Module 2: Party Planner (Architecture Ready)</span>
                </div>
                <p className="text-purple-950 text-xs leading-relaxed">
                  The application architecture has been specifically designed to accommodate the Party Planner module without altering core infrastructure.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                  <h5 className="font-bold text-slate-900 text-xs">Input Parameters</h5>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                    <li><strong>Event Type:</strong> Birthday, Wedding Anniversary, Housewarming, Reunion</li>
                    <li><strong>Guest Sizing:</strong> Number of adults and children (e.g. 50, 100, 200)</li>
                    <li><strong>Location:</strong> City / Indoor Banquet vs Outdoor Lawn</li>
                    <li><strong>Total Budget:</strong> Overall spending limit in INR</li>
                    <li><strong>Food Preferences:</strong> Veg, Non-Veg, Multi-cuisine, Buffet vs Plated</li>
                    <li><strong>Preferences:</strong> Live music, DJ, thematic balloon decor</li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                  <h5 className="font-bold text-slate-900 text-xs">AI Recommended Allocation</h5>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                    <li><strong>Venue Hire:</strong> 25-35% of total budget</li>
                    <li><strong>Catering:</strong> 35-45% (Calculated per-plate cost)</li>
                    <li><strong>Decoration:</strong> 10-15% (Stage, backdrop, table centerpieces)</li>
                    <li><strong>Cake & Desserts:</strong> 3-5%</li>
                    <li><strong>Entertainment & Sound:</strong> 5-10%</li>
                    <li><strong>Transportation & Logistics:</strong> 3-5%</li>
                    <li><strong>Buffer:</strong> 5-10% emergency overrun reserve</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === 'jewelry' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
                  <Gem className="w-5 h-5 text-amber-600" />
                  <span>Module 3: Jewelry Planner & Multimodal Analysis</span>
                </div>
                <p className="text-amber-950 text-xs leading-relaxed">
                  Support for multimodal Gemini vision analysis to evaluate an uploaded outfit image and recommend harmonized jewelry styles within a hard budget.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                  <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-600" />
                    <span>Multimodal Vision Pipeline</span>
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    User uploads an outfit photo (e.g. Saree, Lehenga, Evening Gown). Gemini extracts:
                  </p>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                    <li>Dominant fabric colors (e.g. Maroon, Emerald green, Gold zardozi)</li>
                    <li>Neckline geometry (Sweetheart, V-neck, High-neck)</li>
                    <li>Recommended metal pairing (Yellow Gold, Antique Rose, White Gold, Kundan)</li>
                    <li>Ethical constraint: Never makes assumptions about personal identity or biometric physical characteristics.</li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                  <h5 className="font-bold text-slate-900 text-xs">Budget Partitioning Logic</h5>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                    <li><strong>Necklace / Choker:</strong> 40-50%</li>
                    <li><strong>Earrings (Jhumkas/Studs):</strong> 20-25%</li>
                    <li><strong>Bangles / Bracelet:</strong> 15-20%</li>
                    <li><strong>Rings & Accessories:</strong> 5-10%</li>
                    <li><strong>Making Charges & GST buffer:</strong> 8-12%</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {tab === 'database' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <span>Phase 2 Database Schema (Supabase / PostgreSQL)</span>
                </div>
                <p className="text-emerald-950 text-xs leading-relaxed">
                  Ready-to-deploy SQL schema definitions for user authentication, plan persistence, and product catalogs.
                </p>
              </div>

              <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto">
{`-- 1. Users Table (Supabase Auth Link)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Budget Plans Table
CREATE TABLE budget_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  module_type TEXT NOT NULL, -- 'home-interior', 'party-planner', 'jewelry-planner'
  room_or_event TEXT,
  style_or_theme TEXT,
  total_budget NUMERIC(12, 2) NOT NULL,
  allocated_budget NUMERIC(12, 2) NOT NULL,
  remaining_budget NUMERIC(12, 2) NOT NULL,
  items_json JSONB NOT NULL,
  tips_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Verified Products Catalog Table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  platform TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  product_url TEXT,
  style TEXT,
  availability TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>PocketSmart AI Architecture &bull; Clean Modular Standard</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
