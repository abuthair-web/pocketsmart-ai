import React, { useState } from 'react';
import {
  Bed,
  Sofa,
  Archive,
  Layers,
  Sparkles,
  IndianRupee,
  HelpCircle,
  Plus,
  X,
  Lamp,
  Fan,
  Table,
  Armchair,
  Check,
  Building,
} from 'lucide-react';
import { HomeInteriorInput, InteriorStyle, RoomType } from '../types';
import { formatINR } from '../services/api';

interface InteriorPlannerFormProps {
  onSubmit: (input: HomeInteriorInput) => void;
  isLoading: boolean;
  initialValues?: Partial<HomeInteriorInput>;
}

const ROOM_OPTIONS: { value: RoomType; label: string; icon: string }[] = [
  { value: 'Bedroom', label: 'Bedroom', icon: '🛏️' },
  { value: 'Living Room', label: 'Living Room', icon: '🛋️' },
  { value: 'Kitchen', label: 'Kitchen', icon: '🍳' },
  { value: 'Dining Room', label: 'Dining Room', icon: '🍽️' },
  { value: 'Home Office', label: 'Home Office', icon: '💻' },
  { value: 'Other', label: 'Other Space', icon: '🚪' },
];

const STYLE_OPTIONS: { value: InteriorStyle; label: string; desc: string }[] = [
  { value: 'Modern', label: 'Modern', desc: 'Sleek lines, functional forms, neutral colors with bold accents' },
  { value: 'Minimalist', label: 'Minimalist', desc: 'Less is more, decluttered spaces, essential multi-functional furniture' },
  { value: 'Traditional', label: 'Traditional', desc: 'Rich solid woods (Sheesham/Teak), warm tones, timeless craftsmanship' },
  { value: 'Luxury', label: 'Luxury', desc: 'Plush velvet fabrics, brass highlights, premium designer statement pieces' },
  { value: 'Scandinavian', label: 'Scandinavian', desc: 'Light birch woods, airy white spaces, cozy natural warmth and hygge' },
  { value: 'Industrial', label: 'Industrial', desc: 'Raw iron framing, exposed rustic finishes, urban utilitarian look' },
];

const PRESET_ITEMS = [
  { name: 'Bed', icon: Bed },
  { name: 'Sofa', icon: Sofa },
  { name: 'Wardrobe', icon: Archive },
  { name: 'Table', icon: Table },
  { name: 'Chair', icon: Armchair },
  { name: 'Lighting', icon: Lamp },
  { name: 'Fan', icon: Fan },
  { name: 'Storage', icon: Layers },
  { name: 'Curtains', icon: Building },
  { name: 'Decoration', icon: Sparkles },
  { name: 'Other', icon: HelpCircle },
];

const QUICK_BUDGETS = [25000, 50000, 100000, 250000, 500000];

export const InteriorPlannerForm: React.FC<InteriorPlannerFormProps> = ({
  onSubmit,
  isLoading,
  initialValues,
}) => {
  const [room, setRoom] = useState<RoomType>(initialValues?.room || 'Bedroom');
  const [budget, setBudget] = useState<number>(initialValues?.budget || 50000);
  const [style, setStyle] = useState<InteriorStyle>(initialValues?.style || 'Modern');
  const [requirements, setRequirements] = useState<string[]>(
    initialValues?.requirements || ['Bed', 'Wardrobe', 'Lighting', 'Fan']
  );
  const [customItem, setCustomItem] = useState('');
  const [additionalPreferences, setAdditionalPreferences] = useState(
    initialValues?.additionalPreferences ||
      'I want a modern bedroom suitable for two people and I prefer neutral colors.'
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleRequirement = (item: string) => {
    if (requirements.includes(item)) {
      if (requirements.length === 1) {
        setErrorMsg('Please select at least one requirement item.');
        return;
      }
      setRequirements(requirements.filter((r) => r !== item));
    } else {
      setErrorMsg(null);
      setRequirements([...requirements, item]);
    }
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customItem.trim();
    if (!trimmed) return;
    if (requirements.includes(trimmed)) {
      setErrorMsg(`"${trimmed}" is already included.`);
      return;
    }
    setRequirements([...requirements, trimmed]);
    setCustomItem('');
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget || budget <= 0) {
      setErrorMsg('Please enter a budget greater than ₹0.');
      return;
    }
    if (requirements.length === 0) {
      setErrorMsg('Please select at least one requirement item.');
      return;
    }

    setErrorMsg(null);
    onSubmit({
      room,
      budget: Number(budget),
      style,
      requirements,
      additionalPreferences,
    });
  };

  return (
    <div id="planner-form-section" className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 px-6 py-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Home Interior Budget Planner</h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
              Specify your room parameters to generate an intelligent, non-overrun budget allocation
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
            <span className="font-semibold">Notice:</span> {errorMsg}
          </div>
        )}

        {/* 1. Room Type & Total Budget Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Room Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">
              1. Room Type <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500">Select the space you are planning to furnish.</p>
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value as RoomType)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-hidden cursor-pointer"
            >
              {ROOM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-slate-800">
                2. Total Budget (INR) <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                Formatted: {formatINR(budget || 0)}
              </span>
            </div>
            <p className="text-xs text-slate-500">The total ceiling amount you want to spend.</p>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                <IndianRupee className="w-5 h-5 text-blue-600" />
              </div>
              <input
                type="number"
                min="1000"
                step="500"
                value={budget || ''}
                onChange={(e) => setBudget(Math.max(0, parseInt(e.target.value) || 0))}
                placeholder="50000"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-base font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-hidden"
              />
            </div>

            {/* Quick Budget Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Presets:</span>
              {QUICK_BUDGETS.map((qb) => (
                <button
                  type="button"
                  key={qb}
                  onClick={() => setBudget(qb)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition ${
                    budget === qb
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  ₹{(qb / 1000).toLocaleString('en-IN')}k
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Interior Style */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-bold text-slate-800">
              3. Preferred Interior Style <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500">
              The AI will calibrate materials, finishes, and realistic vendor price points to match this aesthetic.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {STYLE_OPTIONS.map((st) => {
              const isSelected = style === st.value;
              return (
                <button
                  type="button"
                  key={st.value}
                  onClick={() => setStyle(st.value)}
                  className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                      {st.label}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-tight">
                    {st.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Requirements (Multi-Select) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-bold text-slate-800">
                4. Essential Requirements & Items <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-slate-500">
                Select all pieces you need. The engine will distribute your budget proportionately.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {requirements.length} selected
            </span>
          </div>

          {/* Preset Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {PRESET_ITEMS.map((item) => {
              const isChecked = requirements.includes(item.name);
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => toggleRequirement(item.name)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition ${
                    isChecked
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center ${
                      isChecked ? 'bg-white/20 text-white' : 'bg-white text-slate-500 border border-slate-200'
                    }`}
                  >
                    {isChecked ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <span className="truncate">{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Items Added */}
          {requirements.some((r) => !PRESET_ITEMS.map((p) => p.name).includes(r)) && (
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs text-slate-400 font-medium py-1">Custom added:</span>
              {requirements
                .filter((r) => !PRESET_ITEMS.map((p) => p.name).includes(r))
                .map((custom) => (
                  <span
                    key={custom}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold"
                  >
                    <span>{custom}</span>
                    <button
                      type="button"
                      onClick={() => toggleRequirement(custom)}
                      className="hover:text-indigo-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
            </div>
          )}

          {/* Add custom item form */}
          <div className="flex items-center gap-2 pt-1 max-w-sm">
            <input
              type="text"
              value={customItem}
              onChange={(e) => setCustomItem(e.target.value)}
              placeholder="Add other custom requirement (e.g. Bookshelf, Rug)"
              className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-blue-500 outline-hidden grow"
            />
            <button
              type="button"
              onClick={handleAddCustomItem}
              disabled={!customItem.trim()}
              className="px-3 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition disabled:opacity-50 flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* 4. Additional Preferences (Textarea) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-800">
              5. Additional Preferences & Room Constraints
            </label>
            <span className="text-[11px] text-slate-400">Optional</span>
          </div>
          <p className="text-xs text-slate-500">
            Tell the AI about occupants, color schemes, durability needs, room size, or special desires.
          </p>
          <textarea
            rows={3}
            value={additionalPreferences}
            onChange={(e) => setAdditionalPreferences(e.target.value)}
            placeholder="e.g. I want a modern bedroom suitable for two people and I prefer neutral colors with durable finishes."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-hidden"
          />

          {/* Quick prompt helper pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400">Quick ideas:</span>
            {[
              'Neutral colors & warm lighting',
              'Space-saving hydraulic bed storage',
              'Scratch-resistant laminate',
              'Energy-saving BLDC fixtures',
            ].map((snippet) => (
              <button
                type="button"
                key={snippet}
                onClick={() =>
                  setAdditionalPreferences(
                    additionalPreferences ? `${additionalPreferences}. ${snippet}` : snippet
                  )
                }
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              >
                + {snippet}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button & Hard Budget Rule Note */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span>Budget guarantee: recommendations will strictly remain ≤ {formatINR(budget || 0)}.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-200" />
            <span>{isLoading ? 'Analyzing Budget...' : 'Generate My Plan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
