import React from 'react';
import {
  X,
  History,
  Trash2,
  ArrowRight,
  Calendar,
  Layers,
  Home,
  PartyPopper,
  Gem,
} from 'lucide-react';
import { HistoryRecord } from '../types';
import { formatINR } from '../services/api';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  records: HistoryRecord[];
  onSelectRecord: (record: HistoryRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  records,
  onSelectRecord,
  onDeleteRecord,
}) => {
  if (!isOpen) return null;

  const renderModuleBadge = (rec: HistoryRecord) => {
    if (rec.module === 'party-planner') {
      const pInput = rec.input as any;
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded flex items-center gap-1">
          <PartyPopper className="w-3 h-3 text-purple-600" />
          <span>{pInput.eventType || 'Party'} &bull; {pInput.guests} Guests</span>
        </span>
      );
    }
    if (rec.module === 'jewelry-planner') {
      const jInput = rec.input as any;
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
          <Gem className="w-3 h-3 text-amber-600" />
          <span>{jInput.occasion || 'Jewelry'} &bull; {jInput.jewelryType}</span>
        </span>
      );
    }
    // Default: home-interior
    const hInput = rec.input as any;
    return (
      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1">
        <Home className="w-3 h-3 text-blue-600" />
        <span>{hInput.room || 'Room'} &bull; {hInput.style}</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">My Saved Plans</h3>
              <p className="text-xs text-slate-500">History across Home, Party & Jewelry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {records.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">No saved plans yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Your generated plans will automatically be recorded here so you can revisit and compare allocations anytime.
              </p>
            </div>
          ) : (
            records.map((rec) => {
              const dateStr = new Date(rec.timestamp).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={rec.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-400 hover:shadow-md transition group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {renderModuleBadge(rec)}
                      <div className="text-base font-extrabold text-slate-900 mt-1">
                        {formatINR(rec.plan.total_budget)}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteRecord(rec.id)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {rec.plan.summary}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                    <button
                      onClick={() => {
                        onSelectRecord(rec);
                        onClose();
                      }}
                      className="font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1 text-xs cursor-pointer"
                    >
                      <span>Load Plan</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 text-center">
          Persisted locally & server session &bull; Architected for Supabase Auth & DB sync
        </div>
      </div>
    </div>
  );
};
