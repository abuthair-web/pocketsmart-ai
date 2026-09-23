import React, { useState } from 'react';
import {
  Home,
  Sparkles,
  PartyPopper,
  Gem,
  History,
  ShoppingBag,
  Layers,
  Menu,
  X,
  Info,
} from 'lucide-react';
import { PlanningModule } from '../types';

interface NavbarProps {
  activeModule: PlanningModule;
  onSelectModule: (mod: PlanningModule) => void;
  onGoHome: () => void;
  savedPlansCount: number;
  onOpenHistory: () => void;
  onOpenCatalog: () => void;
  onOpenAbout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeModule,
  onSelectModule,
  onGoHome,
  savedPlansCount,
  onOpenHistory,
  onOpenCatalog,
  onOpenAbout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={onGoHome}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Pocket<span className="text-blue-600">Smart</span>
                  <span className="text-xs ml-1 px-1.5 py-0.5 rounded font-semibold bg-blue-100 text-blue-700 uppercase tracking-wider">
                    AI
                  </span>
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Plan Smart. Spend Smart.
              </p>
            </div>
          </div>

          {/* Main Navigation (Section 18) - Desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={onGoHome}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition"
            >
              Home
            </button>

            <button
              onClick={() => onSelectModule('home-interior')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeModule === 'home-interior'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-blue-600" />
              <span>Home Interior</span>
            </button>

            <button
              onClick={() => onSelectModule('party-planner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeModule === 'party-planner'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <PartyPopper className="w-3.5 h-3.5 text-purple-600" />
              <span>Party Planner</span>
            </button>

            <button
              onClick={() => onSelectModule('jewelry-planner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeModule === 'jewelry-planner'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Gem className="w-3.5 h-3.5 text-amber-600" />
              <span>Jewelry Planner</span>
            </button>

            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition"
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>My Plans</span>
              {savedPlansCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {savedPlansCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenAbout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition"
            >
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <span>About</span>
            </button>
          </nav>

          {/* Action buttons (Right side) */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCatalog}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              title="Verified Indian Furniture & Service Catalog"
            >
              <ShoppingBag className="w-4 h-4 text-slate-500" />
              <span>Catalog</span>
            </button>

            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition border border-blue-200/60"
            >
              <History className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">My Plans</span>
              {savedPlansCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                  {savedPlansCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-xl">
          <button
            onClick={() => {
              onGoHome();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Home
          </button>

          <button
            onClick={() => {
              onSelectModule('home-interior');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
              activeModule === 'home-interior'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <Home className="w-4 h-4 text-blue-600" />
              <span>Home Interior Planner</span>
            </span>
          </button>

          <button
            onClick={() => {
              onSelectModule('party-planner');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
              activeModule === 'party-planner'
                ? 'bg-purple-50 text-purple-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <PartyPopper className="w-4 h-4 text-purple-600" />
              <span>Party Planner</span>
            </span>
          </button>

          <button
            onClick={() => {
              onSelectModule('jewelry-planner');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
              activeModule === 'jewelry-planner'
                ? 'bg-amber-50 text-amber-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <Gem className="w-4 h-4 text-amber-600" />
              <span>Jewelry Planner</span>
            </span>
          </button>

          <div className="border-t border-slate-100 pt-2 flex flex-col gap-1">
            <button
              onClick={() => {
                onOpenHistory();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <span className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" />
                <span>My Saved Plans</span>
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                {savedPlansCount}
              </span>
            </button>

            <button
              onClick={() => {
                onOpenCatalog();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <ShoppingBag className="w-4 h-4 text-slate-500" />
              <span>Product Catalog</span>
            </button>

            <button
              onClick={() => {
                onOpenAbout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Info className="w-4 h-4 text-slate-500" />
              <span>About & System Architecture</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
