import React, { useState } from 'react';
import {
  PartyPopper,
  Users,
  MapPin,
  IndianRupee,
  Utensils,
  Building2,
  Sparkles,
  Palette,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  PartyPlannerInput,
  PartyEventType,
  FoodPreference,
  VenuePreference,
  DecorationPreference,
} from '../types';
import { formatINR } from '../services/api';

interface PartyPlannerFormProps {
  onSubmit: (input: PartyPlannerInput) => void;
  isLoading: boolean;
  initialValues?: Partial<PartyPlannerInput>;
}

const EVENT_TYPES: PartyEventType[] = [
  'Birthday',
  'Wedding',
  'Engagement',
  'Anniversary',
  'Baby Shower',
  'Corporate Event',
  'College/Student Event',
  'Family Function',
  'Other',
];

const FOOD_OPTIONS: FoodPreference[] = [
  'Vegetarian',
  'Non-Vegetarian',
  'Vegan',
  'Jain',
  'Mixed',
];

const VENUE_OPTIONS: VenuePreference[] = [
  'Banquet Hall',
  'Restaurant',
  'Hotel',
  'Outdoor',
  'Home',
  'Community Hall',
  'Any',
];

const DECORATION_OPTIONS: DecorationPreference[] = [
  'Simple',
  'Modern',
  'Traditional',
  'Luxury',
  'Minimal',
];

const BUDGET_PRESETS = [15000, 30000, 50000, 100000, 250000, 500000];

export const PartyPlannerForm: React.FC<PartyPlannerFormProps> = ({
  onSubmit,
  isLoading,
  initialValues,
}) => {
  const [eventType, setEventType] = useState<string>(initialValues?.eventType || 'Birthday');
  const [guests, setGuests] = useState<number>(initialValues?.guests || 50);
  const [location, setLocation] = useState<string>(initialValues?.location || 'Chennai');
  const [budget, setBudget] = useState<number>(initialValues?.budget || 30000);
  const [foodPreferences, setFoodPreferences] = useState<string[]>(
    initialValues?.foodPreferences || ['Vegetarian']
  );
  const [venuePreference, setVenuePreference] = useState<string>(
    initialValues?.venuePreference || 'Restaurant'
  );
  const [decorationPreference, setDecorationPreference] = useState<string>(
    initialValues?.decorationPreference || 'Modern'
  );
  const [additionalRequirements, setAdditionalRequirements] = useState<string>(
    initialValues?.additionalRequirements ||
      'I want a simple birthday party for 50 people with good vegetarian food and modern decoration.'
  );

  const [validationError, setValidationError] = useState<string | null>(null);

  const toggleFoodPreference = (option: string) => {
    setFoodPreferences((prev) => {
      if (prev.includes(option)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((p) => p !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!guests || guests <= 0) {
      setValidationError('Please enter a valid guest count greater than 0.');
      return;
    }

    if (!budget || budget <= 0) {
      setValidationError('Please enter a budget greater than ₹0.');
      return;
    }

    if (foodPreferences.length === 0) {
      setValidationError('Please select at least one food preference.');
      return;
    }

    onSubmit({
      eventType,
      guests,
      location,
      budget,
      foodPreferences,
      venuePreference,
      decorationPreference,
      additionalRequirements,
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 p-6 sm:p-8 text-white relative">
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs tracking-wider uppercase">
                Phase 1 &bull; Active Module
              </span>
              <span className="text-xs text-purple-200">Zero Overrun Guarantee</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2.5">
              <PartyPopper className="w-8 h-8 text-amber-300" />
              <span>Party & Event Budget Planner</span>
            </h2>
            <p className="text-purple-100 text-xs sm:text-sm max-w-2xl">
              Plan celebrations, catering, venue rent, cake, and decor within a hard budget ceiling.
            </p>
          </div>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        {validationError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Please check your inputs:</p>
              <p>{validationError}</p>
            </div>
          </div>
        )}

        {/* 1. Event Type, Guests, and Location */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <span>1. Event Fundamentals</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Event Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <PartyPopper className="w-4 h-4 text-purple-600" />
                <span>Event Type</span>
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium transition"
              >
                {EVENT_TYPES.map((ev) => (
                  <option key={ev} value={ev}>
                    {ev}
                  </option>
                ))}
              </select>
            </div>

            {/* Number of Guests */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-600" />
                <span>Number of Guests</span>
              </label>
              <input
                type="number"
                min={1}
                max={5000}
                value={guests}
                onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium transition"
                placeholder="e.g. 50"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span>Location (City / Area)</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium transition"
                placeholder="e.g. Chennai"
              />
            </div>
          </div>
        </div>

        {/* 2. Total Budget */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-purple-600" />
              <span>2. Total Budget Ceiling</span>
            </label>
            <span className="text-lg font-black text-purple-700">{formatINR(budget)}</span>
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold">
              ₹
            </span>
            <input
              type="number"
              min={1000}
              step={1000}
              value={budget}
              onChange={(e) => setBudget(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full pl-9 pr-4 py-3 text-lg font-extrabold text-slate-900 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              placeholder="e.g. 30000"
            />
          </div>

          {/* Budget Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400 font-semibold mr-1">Quick Select:</span>
            {BUDGET_PRESETS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setBudget(amt)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  budget === amt
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {formatINR(amt)}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Preferences (Food, Venue, Decoration) */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <span>3. Event Preferences</span>
          </h3>

          {/* Food Preference (Multiple Selection) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-purple-600" />
              <span>Food Preference (Select one or more)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {FOOD_OPTIONS.map((opt) => {
                const isSelected = foodPreferences.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleFoodPreference(opt)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 text-purple-800 shadow-xs ring-1 ring-purple-400'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Venue & Decoration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Venue Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-purple-600" />
                <span>Venue Preference</span>
              </label>
              <select
                value={venuePreference}
                onChange={(e) => setVenuePreference(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium transition"
              >
                {VENUE_OPTIONS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {/* Decoration Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-purple-600" />
                <span>Decoration Preference</span>
              </label>
              <select
                value={decorationPreference}
                onChange={(e) => setDecorationPreference(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium transition"
              >
                {DECORATION_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 4. Additional Requirements */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-purple-600" />
            <span>Additional Requirements (Optional)</span>
          </label>
          <textarea
            rows={3}
            value={additionalRequirements}
            onChange={(e) => setAdditionalRequirements(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition leading-relaxed"
            placeholder="e.g. I want a simple birthday party for 50 people with good vegetarian food and modern decoration."
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-extrabold text-base shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:cursor-not-allowed"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>{isLoading ? 'Creating Event Budget Plan...' : 'Generate Party Plan'}</span>
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-2.5">
            PocketSmart AI calculates per-plate catering math & enforces zero budget overruns.
          </p>
        </div>
      </form>
    </div>
  );
};
