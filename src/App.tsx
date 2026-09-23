import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { InteriorPlannerForm } from './components/InteriorPlannerForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { PartyPlannerForm } from './components/PartyPlannerForm';
import { PartyResultsDashboard } from './components/PartyResultsDashboard';
import { JewelryPlannerForm } from './components/JewelryPlannerForm';
import { JewelryResultsDashboard } from './components/JewelryResultsDashboard';
import { LoadingState } from './components/LoadingState';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ProductCatalogModal } from './components/ProductCatalogModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import {
  generateInteriorPlan,
  generatePartyPlan,
  generateJewelryPlan,
  fetchHistory,
  deleteHistoryRecord,
  fetchProducts,
} from './services/api';
import {
  BudgetPlan,
  PartyPlan,
  JewelryPlan,
  CatalogProduct,
  HistoryRecord,
  HomeInteriorInput,
  PartyPlannerInput,
  JewelryPlannerInput,
  PlanningModule,
} from './types';
import { mockCatalogProducts } from './data/mockProducts';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [activeModule, setActiveModule] = useState<PlanningModule>('home-interior');

  // Home Interior State
  const [homeInput, setHomeInput] = useState<HomeInteriorInput>({
    room: 'Bedroom',
    budget: 50000,
    style: 'Modern',
    requirements: ['Bed', 'Wardrobe', 'Lighting', 'Fan'],
    additionalPreferences:
      'I want a modern bedroom suitable for two people and I prefer neutral colors.',
  });
  const [homePlan, setHomePlan] = useState<BudgetPlan | null>(null);

  // Party Planner State
  const [partyInput, setPartyInput] = useState<PartyPlannerInput>({
    eventType: 'Birthday',
    guests: 50,
    location: 'Chennai',
    budget: 30000,
    foodPreferences: ['Vegetarian'],
    venuePreference: 'Restaurant',
    decorationPreference: 'Modern',
    additionalRequirements:
      'I want a simple birthday party for 50 people with good vegetarian food and modern decoration.',
  });
  const [partyPlan, setPartyPlan] = useState<PartyPlan | null>(null);

  // Jewelry Planner State
  const [jewelryInput, setJewelryInput] = useState<JewelryPlannerInput>({
    occasion: 'Wedding',
    jewelryType: 'Necklace',
    budget: 25000,
    style: 'Traditional',
    metalPreference: 'Gold',
    additionalPreferences: 'I want something elegant and not too heavy.',
  });
  const [jewelryPlan, setJewelryPlan] = useState<JewelryPlan | null>(null);

  // Shared UI states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // History & Products
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [catalogFilterCategory, setCatalogFilterCategory] = useState<string | undefined>(undefined);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [products, setProducts] = useState<CatalogProduct[]>(mockCatalogProducts);

  useEffect(() => {
    loadHistory();
    loadProducts();
  }, []);

  const loadHistory = async () => {
    try {
      const records = await fetchHistory();
      setHistoryRecords(records);
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  };

  const loadProducts = async () => {
    try {
      const prods = await fetchProducts();
      if (prods && prods.length > 0) {
        setProducts(prods);
      }
    } catch (e) {
      setProducts(mockCatalogProducts);
    }
  };

  const scrollToPlanner = () => {
    const el = document.getElementById('planner-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGoHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Handlers
  const handleGenerateHomePlan = async (input: HomeInteriorInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    setHomeInput(input);

    try {
      const plan = await generateInteriorPlan(input);
      setHomePlan(plan);
      await loadHistory();
      setTimeout(() => {
        window.scrollTo({ top: 380, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Unable to generate budget plan. Please check your inputs and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePartyPlan = async (input: PartyPlannerInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    setPartyInput(input);

    try {
      const plan = await generatePartyPlan(input);
      setPartyPlan(plan);
      await loadHistory();
      setTimeout(() => {
        window.scrollTo({ top: 380, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Unable to generate party plan. Please check your inputs and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateJewelryPlan = async (input: JewelryPlannerInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    setJewelryInput(input);

    try {
      const plan = await generateJewelryPlan(input);
      setJewelryPlan(plan);
      await loadHistory();
      setTimeout(() => {
        window.scrollTo({ top: 380, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Unable to generate jewelry plan. Please check your inputs and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // History Load Handler
  const handleSelectHistoryRecord = (record: HistoryRecord) => {
    setActiveModule(record.module);

    if (record.module === 'home-interior') {
      setHomeInput(record.input as HomeInteriorInput);
      setHomePlan(record.plan as BudgetPlan);
    } else if (record.module === 'party-planner') {
      setPartyInput(record.input as PartyPlannerInput);
      setPartyPlan(record.plan as PartyPlan);
    } else if (record.module === 'jewelry-planner') {
      setJewelryInput(record.input as JewelryPlannerInput);
      setJewelryPlan(record.plan as JewelryPlan);
    }

    setTimeout(() => {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteHistory = async (id: string) => {
    await deleteHistoryRecord(id);
    setHistoryRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleOpenCatalogForCategory = (category: string) => {
    setCatalogFilterCategory(category);
    setIsCatalogOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar with full main navigation (Section 18) */}
      <Navbar
        activeModule={activeModule}
        onSelectModule={(mod) => {
          setActiveModule(mod);
          scrollToPlanner();
        }}
        onGoHome={handleGoHome}
        savedPlansCount={historyRecords.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenCatalog={() => {
          setCatalogFilterCategory(undefined);
          setIsCatalogOpen(true);
        }}
        onOpenAbout={() => setIsArchitectureOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Landing Hero */}
        <LandingHero
          onSelectModule={(mod) => {
            setActiveModule(mod);
            scrollToPlanner();
          }}
          onStartPlanning={() => {
            scrollToPlanner();
          }}
        />

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 shadow-xs">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Error:</span> {errorMessage}
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Module Workspace */}
        <div id="planner-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {isLoading ? (
            <LoadingState module={activeModule} />
          ) : (
            <>
              {/* 1. HOME INTERIOR PLANNER */}
              {activeModule === 'home-interior' && (
                <div className="space-y-10">
                  {homePlan ? (
                    <ResultsDashboard
                      plan={homePlan}
                      userInput={homeInput}
                      onReset={() => {
                        setHomePlan(null);
                        scrollToPlanner();
                      }}
                      onOpenCatalogForCategory={handleOpenCatalogForCategory}
                      onSaveToHistory={() => loadHistory()}
                    />
                  ) : (
                    <InteriorPlannerForm
                      onSubmit={handleGenerateHomePlan}
                      isLoading={isLoading}
                      initialValues={homeInput}
                    />
                  )}
                </div>
              )}

              {/* 2. PARTY PLANNER */}
              {activeModule === 'party-planner' && (
                <div className="space-y-10">
                  {partyPlan ? (
                    <PartyResultsDashboard
                      plan={partyPlan}
                      userInput={partyInput}
                      onReset={() => {
                        setPartyPlan(null);
                        scrollToPlanner();
                      }}
                      onSaveToHistory={() => loadHistory()}
                    />
                  ) : (
                    <PartyPlannerForm
                      onSubmit={handleGeneratePartyPlan}
                      isLoading={isLoading}
                      initialValues={partyInput}
                    />
                  )}
                </div>
              )}

              {/* 3. JEWELRY PLANNER */}
              {activeModule === 'jewelry-planner' && (
                <div className="space-y-10">
                  {jewelryPlan ? (
                    <JewelryResultsDashboard
                      plan={jewelryPlan}
                      userInput={jewelryInput}
                      onReset={() => {
                        setJewelryPlan(null);
                        scrollToPlanner();
                      }}
                      onSaveToHistory={() => loadHistory()}
                    />
                  ) : (
                    <JewelryPlannerForm
                      onSubmit={handleGenerateJewelryPlan}
                      isLoading={isLoading}
                      initialValues={jewelryInput}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modals & Drawers */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        records={historyRecords}
        onSelectRecord={handleSelectHistoryRecord}
        onDeleteRecord={handleDeleteHistory}
      />

      <ProductCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        products={products}
        filterCategory={catalogFilterCategory}
      />

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">PocketSmart AI</span>
            <span>&bull;</span>
            <span>Plan Smart. Spend Smart.</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsArchitectureOpen(true)}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              System Roadmap & Architecture
            </button>
            <button
              onClick={() => {
                setCatalogFilterCategory(undefined);
                setIsCatalogOpen(true);
              }}
              className="hover:text-blue-600 transition cursor-pointer"
            >
              Verified Catalog
            </button>
            <span className="flex items-center gap-1 text-slate-400">
              Hard Budget Guarantee
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
