import React from 'react';
import { Package, Percent, AlertOctagon, DollarSign } from 'lucide-react';
import { ProductPricingResult } from '../types';
import { MarginValidationSummary } from '../utils/marginValidator';

interface DashboardMetricsBarProps {
  results: ProductPricingResult[];
  summary: MarginValidationSummary;
  effectiveTC: number;
  onFilterCritical: () => void;
}

export const DashboardMetricsBar: React.FC<DashboardMetricsBarProps> = ({
  results,
  summary,
  effectiveTC,
  onFilterCritical,
}) => {
  if (results.length === 0) return null;

  // Cálculos agregados
  let totalMarginSum = 0;
  let totalChannelsCount = 0;
  let totalNetRevenue = 0;

  for (const r of results) {
    for (const ch of Object.values(r.channels)) {
      if (ch && ch.finalPrice > 0) {
        totalMarginSum += ch.profitMarginPercent;
        totalChannelsCount += 1;
        totalNetRevenue += ch.netRevenuePEN;
      }
    }
  }

  const avgMargin = totalChannelsCount > 0 ? totalMarginSum / totalChannelsCount : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      {/* 1. SKUs Cotizados */}
      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl p-3.5 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-600">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#8b949e]">
            SKUs Cotizados
          </span>
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-600 dark:text-[#58a6ff] flex items-center justify-center">
            <Package className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {results.length}
          </span>
          <span className="text-xs text-slate-500 dark:text-[#8b949e]">
            en 17 canales ({results.length * 17} precios)
          </span>
        </div>
      </div>

      {/* 2. Margen Promedio */}
      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl p-3.5 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-600">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#8b949e]">
            Margen Promedio
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-[#39d353] flex items-center justify-center">
            <Percent className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span
            className={`text-2xl font-black font-mono ${
              avgMargin >= 8
                ? 'text-emerald-600 dark:text-[#39d353]'
                : avgMargin >= 3
                ? 'text-amber-600 dark:text-[#d29922]'
                : 'text-rose-600 dark:text-[#f85149]'
            }`}
          >
            {avgMargin.toFixed(1)}%
          </span>
          <span className="text-xs text-slate-500 dark:text-[#8b949e]">
            {avgMargin >= 8 ? 'Rentable' : 'Atención'}
          </span>
        </div>
      </div>

      {/* 3. Canales en Riesgo */}
      <div
        onClick={onFilterCritical}
        className={`border rounded-xl p-3.5 shadow-sm transition-all cursor-pointer ${
          summary.counts.critical > 0
            ? 'bg-rose-50/70 dark:bg-[#f85149]/10 border-rose-200 dark:border-[#f85149]/30 hover:bg-rose-100/70'
            : 'bg-white dark:bg-[#161b22] border-slate-200 dark:border-[#30363d] hover:border-slate-300'
        }`}
        title="Clic para ver alertas críticas"
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-[11px] font-bold uppercase tracking-wider ${
              summary.counts.critical > 0
                ? 'text-rose-700 dark:text-[#f85149]'
                : 'text-slate-500 dark:text-[#8b949e]'
            }`}
          >
            Canales en Riesgo
          </span>
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              summary.counts.critical > 0
                ? 'bg-rose-500 text-white'
                : 'bg-slate-100 dark:bg-[#21262d] text-slate-400'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span
            className={`text-2xl font-black font-mono ${
              summary.counts.critical > 0
                ? 'text-rose-700 dark:text-[#f85149]'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {summary.counts.critical}
          </span>
          <span className="text-xs text-slate-500 dark:text-[#8b949e]">
            {summary.counts.critical === 1 ? 'crítico (<3%)' : 'críticos (<3%)'}
          </span>
        </div>
      </div>

      {/* 4. TC Efectivo */}
      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl p-3.5 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-600">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#8b949e]">
            TC Promedio Lote
          </span>
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            S/ {effectiveTC.toFixed(2)}
          </span>
          <span className="text-xs text-slate-500 dark:text-[#8b949e]">
            por USD
          </span>
        </div>
      </div>
    </div>
  );
};
