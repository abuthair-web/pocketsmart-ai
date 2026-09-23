import React, { useState } from 'react';
import { BudgetPlan, BudgetItem } from '../types';
import { formatINR } from '../services/api';

interface BudgetVisualizerProps {
  plan: BudgetPlan;
}

const PALETTE = [
  '#2563eb', // Blue 600
  '#4f46e5', // Indigo 600
  '#0d9488', // Teal 600
  '#0284c7', // Sky 600
  '#7c3aed', // Violet 600
  '#d97706', // Amber 600
  '#db2777', // Pink 600
  '#ea580c', // Orange 600
  '#16a34a', // Green 600
  '#475569', // Slate 600
];

const BUFFER_COLOR = '#10b981'; // Emerald 500 for contingency buffer

interface Segment {
  label: string;
  amount: number;
  percentage: number;
  color: string;
  isBuffer?: boolean;
}

export const BudgetVisualizer: React.FC<BudgetVisualizerProps> = ({ plan }) => {
  const [activeSegment, setActiveSegment] = useState<Segment | null>(null);

  const total = plan.total_budget || 1;
  const segments: Segment[] = [];

  plan.items.forEach((item, index) => {
    const pct = Math.round((item.recommended_budget / total) * 100);
    segments.push({
      label: item.category,
      amount: item.recommended_budget,
      percentage: pct,
      color: PALETTE[index % PALETTE.length],
      isBuffer: false,
    });
  });

  if (plan.remaining_budget > 0) {
    const bufferPct = Math.round((plan.remaining_budget / total) * 100);
    segments.push({
      label: 'Contingency / Buffer',
      amount: plan.remaining_budget,
      percentage: bufferPct,
      color: BUFFER_COLOR,
      isBuffer: true,
    });
  }

  // Calculate SVG Donut arcs
  const radius = 80;
  const strokeWidth = 26;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Budget Allocation Breakdown</h3>
          <p className="text-xs text-slate-500">
            Interactive visual proportion of expenditures and contingency reserve
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
          Total: {formatINR(plan.total_budget)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* SVG Donut Chart */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-52 h-52 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth={strokeWidth}
              />
              {/* Data Segments */}
              {segments.map((seg, idx) => {
                const strokeDasharray = (seg.amount / total) * circumference;
                const strokeDashoffset = -accumulatedOffset;
                accumulatedOffset += strokeDasharray;

                return (
                  <circle
                    key={seg.label}
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${strokeDasharray} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 cursor-pointer hover:opacity-85"
                    onMouseEnter={() => setActiveSegment(seg)}
                    onMouseLeave={() => setActiveSegment(null)}
                  />
                );
              })}
            </svg>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {activeSegment ? activeSegment.label : 'Allocated'}
              </span>
              <span className="text-lg font-extrabold text-slate-900">
                {activeSegment ? formatINR(activeSegment.amount) : formatINR(plan.allocated_budget)}
              </span>
              <span className="text-xs font-bold text-blue-600">
                {activeSegment
                  ? `${activeSegment.percentage}% of budget`
                  : `${Math.round((plan.allocated_budget / total) * 100)}% Used`}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Hover over arcs for item details</p>
        </div>

        {/* Stacked Progress Bar & Legend Pills */}
        <div className="md:col-span-7 space-y-5">
          {/* Stacked Percentage Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
              <span>Overall Distribution</span>
              <span>100% Accounted For</span>
            </div>
            <div className="w-full h-4 rounded-xl overflow-hidden flex bg-slate-100 shadow-inner">
              {segments.map((seg) => (
                <div
                  key={seg.label}
                  style={{
                    width: `${Math.max(1, (seg.amount / total) * 100)}%`,
                    backgroundColor: seg.color,
                  }}
                  className="h-full transition-all hover:brightness-110 cursor-pointer"
                  title={`${seg.label}: ${formatINR(seg.amount)} (${seg.percentage}%)`}
                  onMouseEnter={() => setActiveSegment(seg)}
                  onMouseLeave={() => setActiveSegment(null)}
                />
              ))}
            </div>
          </div>

          {/* Segment List Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {segments.map((seg) => {
              const isHovered = activeSegment?.label === seg.label;
              return (
                <div
                  key={seg.label}
                  onMouseEnter={() => setActiveSegment(seg)}
                  onMouseLeave={() => setActiveSegment(null)}
                  className={`flex items-center justify-between p-2 rounded-xl border text-xs transition cursor-pointer ${
                    isHovered
                      ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-400/30'
                      : 'border-slate-100 hover:border-slate-200 bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: seg.color }}
                    ></span>
                    <span className="font-semibold text-slate-800 truncate">{seg.label}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-slate-900">{formatINR(seg.amount)}</div>
                    <div className="text-[10px] text-slate-500">{seg.percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Note */}
          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 flex items-center justify-between">
            <span>🛡️ Contingency Reserve:</span>
            <span className="font-bold text-emerald-700">
              {formatINR(plan.remaining_budget)} ({plan.contingencyPercentage || Math.round((plan.remaining_budget / total) * 100)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
