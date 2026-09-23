import React, { useState, useRef } from 'react';
import {
  Gem,
  Sparkles,
  IndianRupee,
  Upload,
  X,
  Image as ImageIcon,
  Palette,
  AlertCircle,
  FileText,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  JewelryPlannerInput,
  JewelryOccasion,
  JewelryType,
  JewelryStyle,
  MetalPreference,
  OutfitImagePayload,
} from '../types';
import { formatINR } from '../services/api';

interface JewelryPlannerFormProps {
  onSubmit: (input: JewelryPlannerInput) => void;
  isLoading: boolean;
  initialValues?: Partial<JewelryPlannerInput>;
}

const OCCASIONS: JewelryOccasion[] = [
  'Wedding',
  'Engagement',
  'Reception',
  'Festival',
  'Party',
  'Casual',
  'Traditional Function',
  'Gift',
];

const JEWELRY_TYPES: JewelryType[] = [
  'Necklace',
  'Earrings',
  'Bracelet',
  'Ring',
  'Bangles',
  'Pendant',
  'Complete Set',
  'Other',
];

const JEWELRY_STYLES: JewelryStyle[] = [
  'Traditional',
  'Modern',
  'Minimalist',
  'Bridal',
  'Elegant',
  'Statement',
  'Indo-Western',
];

const METAL_PREFERENCES: MetalPreference[] = [
  'Gold',
  'Silver',
  'Platinum',
  'Rose Gold',
  'No Preference',
];

const BUDGET_PRESETS = [10000, 25000, 50000, 100000, 200000, 500000];

export const JewelryPlannerForm: React.FC<JewelryPlannerFormProps> = ({
  onSubmit,
  isLoading,
  initialValues,
}) => {
  const [occasion, setOccasion] = useState<string>(initialValues?.occasion || 'Wedding');
  const [jewelryType, setJewelryType] = useState<string>(initialValues?.jewelryType || 'Necklace');
  const [budget, setBudget] = useState<number>(initialValues?.budget || 25000);
  const [style, setStyle] = useState<string>(initialValues?.style || 'Traditional');
  const [metalPreference, setMetalPreference] = useState<string>(
    initialValues?.metalPreference || 'Gold'
  );
  const [additionalPreferences, setAdditionalPreferences] = useState<string>(
    initialValues?.additionalPreferences || 'I want something elegant and not too heavy.'
  );

  // Outfit Image state
  const [outfitImage, setOutfitImage] = useState<OutfitImagePayload | undefined>(
    initialValues?.outfitImage
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type: JPG, JPEG, PNG
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setImageError('Please upload a JPG, JPEG, or PNG image.');
      return;
    }

    // Limit to 6MB
    if (file.size > 6 * 1024 * 1024) {
      setImageError('Image must be under 6MB in size.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setOutfitImage({
        data: base64Data,
        mimeType: file.type,
        previewUrl: result,
      });
    };
    reader.onerror = () => {
      setImageError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setOutfitImage(undefined);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!budget || budget <= 0) {
      setValidationError('Please enter a budget greater than ₹0.');
      return;
    }

    if (!occasion) {
      setValidationError('Please select an occasion.');
      return;
    }

    if (!jewelryType) {
      setValidationError('Please select a jewelry type.');
      return;
    }

    onSubmit({
      occasion,
      jewelryType,
      budget,
      style,
      metalPreference,
      additionalPreferences,
      outfitImage,
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 p-6 sm:p-8 text-white relative">
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs tracking-wider uppercase">
                Multimodal AI &bull; Active Module
              </span>
              <span className="text-xs text-amber-100">Hallmark & GST Protected</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2.5">
              <Gem className="w-8 h-8 text-amber-200" />
              <span>Jewelry Styling & Budget Planner</span>
            </h2>
            <p className="text-amber-50 text-xs sm:text-sm max-w-2xl">
              Plan gold, silver, diamond, or traditional jewelry investments with optional multimodal outfit image analysis.
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

        {/* 1. Occasion & Jewelry Type */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <span>1. Selection Fundamentals</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Occasion */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Occasion</span>
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium transition"
              >
                {OCCASIONS.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            {/* Jewelry Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Gem className="w-4 h-4 text-amber-600" />
                <span>Jewelry Type</span>
              </label>
              <select
                value={jewelryType}
                onChange={(e) => setJewelryType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium transition"
              >
                {JEWELRY_TYPES.map((jt) => (
                  <option key={jt} value={jt}>
                    {jt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. Total Budget */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-amber-600" />
              <span>2. Total Budget (INR)</span>
            </label>
            <span className="text-lg font-black text-amber-700">{formatINR(budget)}</span>
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
              className="w-full pl-9 pr-4 py-3 text-lg font-extrabold text-slate-900 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              placeholder="e.g. 25000"
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
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {formatINR(amt)}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Style & Metal Preference */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <span>3. Aesthetic & Metallurgy</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Preferred Style */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-amber-600" />
                <span>Preferred Style</span>
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium transition"
              >
                {JEWELRY_STYLES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Metal Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Gem className="w-4 h-4 text-amber-600" />
                <span>Metal Preference</span>
              </label>
              <select
                value={metalPreference}
                onChange={(e) => setMetalPreference(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium transition"
              >
                {METAL_PREFERENCES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 4. Optional Outfit Image Upload (Section 7) */}
        <div className="space-y-3 p-5 rounded-2xl bg-amber-50/40 border border-amber-200">
          <div className="flex items-start justify-between">
            <div>
              <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <span>Upload Outfit Image (Optional)</span>
              </label>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Uploading an image is completely optional. If provided, Gemini will analyze fabric colors, neckline, and attire to recommend compatible jewelry.
              </p>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase">
              Multimodal Vision
            </span>
          </div>

          {imageError && (
            <p className="text-xs font-semibold text-rose-600">{imageError}</p>
          )}

          {!outfitImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-white rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-700">
                Click to browse or drop outfit photo here
              </p>
              <p className="text-[10px] text-slate-400">
                Supports JPG, JPEG, PNG (max 6MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative bg-white rounded-xl border border-amber-200 p-3 flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <img
                  src={outfitImage.previewUrl}
                  alt="Outfit Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Outfit image attached</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Gemini will analyze textile palette, neckline geometry, and formality for jewelry pairing.
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Remove image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* 5. Additional Preferences */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Additional Preferences (Optional)</span>
          </label>
          <textarea
            rows={3}
            value={additionalPreferences}
            onChange={(e) => setAdditionalPreferences(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition leading-relaxed"
            placeholder="e.g. I want something elegant and not too heavy."
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-extrabold text-base shadow-xl shadow-amber-600/30 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:cursor-not-allowed"
          >
            <Sparkles className="w-5 h-5 text-yellow-200" />
            <span>{isLoading ? 'Creating Jewelry Plan...' : 'Generate Jewelry Plan'}</span>
          </button>
          <p className="text-center text-[11px] text-slate-400 mt-2.5">
            Calculates BIS hallmarking buffer, making charges, and zero budget overruns.
          </p>
        </div>
      </form>
    </div>
  );
};
