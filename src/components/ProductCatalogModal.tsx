import React, { useState } from 'react';
import { X, ShoppingBag, ExternalLink, Filter, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import { CatalogProduct } from '../types';
import { formatINR } from '../services/api';

interface ProductCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: CatalogProduct[];
  filterCategory?: string;
}

export const ProductCatalogModal: React.FC<ProductCatalogModalProps> = ({
  isOpen,
  onClose,
  products,
  filterCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(filterCategory || 'All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const platforms = ['All', ...Array.from(new Set(products.map((p) => p.platform)))];

  const filteredProducts = products.filter((p) => {
    const matchCat =
      selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchPlat =
      selectedPlatform === 'All' || p.platform.toLowerCase() === selectedPlatform.toLowerCase();
    return matchCat && matchPlat;
  });

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
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Verified Product Catalog</h3>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  No AI Hallucinations
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Ground-truth catalog items used in our multi-stage recommendation pipeline
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

        {/* Pipeline Info Banner */}
        <div className="bg-blue-50/70 border-b border-blue-100 px-6 py-2.5 text-xs text-blue-900 flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Recommendation Architecture:</strong> User Requirements &rarr; Budget Filtering &rarr; Verified Product DB &rarr; Gemini Reasoning &rarr; Final Allocation.
          </span>
        </div>

        {/* Filter controls */}
        <div className="p-4 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Platform:</span>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-300 text-slate-700 bg-white"
            >
              {platforms.map((plat) => (
                <option key={plat} value={plat}>
                  {plat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-700 px-2 py-0.5 rounded shadow-xs">
                  {product.platform}
                </span>
                <span className="absolute top-2 right-2 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                  {product.availability}
                </span>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                    <span>{product.room}</span>
                    <span>&bull;</span>
                    <span>{product.style} Style</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1 line-clamp-2">
                    {product.name}
                  </h4>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Verified Price</span>
                    <span className="text-base font-extrabold text-blue-700">
                      {formatINR(product.price)}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500 font-medium">
                    ~{product.estimatedDeliveryDays} days delivery
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredProducts.length} verified products</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Close Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
