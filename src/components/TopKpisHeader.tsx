import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Coins, CheckCircle2 } from 'lucide-react';
import { MarginValidationSummary } from '../utils/marginValidator';

interface TopKpisHeaderProps {
  calculatedCount: number;
  totalMarketplacesCount: number;
  avgMargin: number;
  summary: MarginValidationSummary;
  effectiveTC: number;
}

export const TopKpisHeader: React.FC<TopKpisHeaderProps> = ({
  calculatedCount,
  totalMarketplacesCount,
  avgMargin,
  summary,
  effectiveTC,
}) => {
  const isHealthy = avgMargin >= 8;
  const criticalCount = summary.counts.critical;
  const warningCount = summary.counts.warning;
  const totalCotizaciones = calculatedCount * totalMarketplacesCount;
  const healthyCount = Math.max(totalCotizaciones - criticalCount - warningCount, 0);

  return (
    <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-4 shadow-sm dark:shadow-xl flex flex-col justify-between h-full hover:border-slate-300 dark:hover:border-slate-700/80 transition-all">
      {/* 1. Header Unificado */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-[#1e293b]/70">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-wide">
              Rendimiento del Lote
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Consolidado multi-canal</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#0b0f19] px-2 py-0.5 rounded-full border border-slate-200 dark:border-[#1e293b]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
          <span>{totalMarketplacesCount} Canales</span>
        </div>
      </div>

      {/* 2. Grid 2x2 Interno Cohesivo */}
      <div className="grid grid-cols-2 gap-2 my-2">
        {/* KPI 1: SKUs Cotizados */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1e293b]/70 hover:border-slate-300 dark:hover:border-slate-700/60 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              SKUS COTIZADOS
            </span>
            <Coins className="w-3 h-3 text-sky-500 dark:text-sky-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black font-mono text-slate-900 dark:text-white leading-none">
              {calculatedCount}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">SKUs</span>
          </div>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-1">
            {totalCotizaciones} precios activos
          </span>
        </div>

        {/* KPI 2: Margen Promedio */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1e293b]/70 hover:border-slate-300 dark:hover:border-slate-700/60 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              MARGEN PROMEDIO
            </span>
            <TrendingUp className={`w-3 h-3 ${isHealthy ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-xl font-black font-mono leading-none ${
                isHealthy ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {avgMargin.toFixed(1)}%
            </span>
            <span
              className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                isHealthy
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
              }`}
            >
              {isHealthy ? 'Saludable' : 'Atención'}
            </span>
          </div>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-1">
            Meta: ≥ 8.0% neto
          </span>
        </div>

        {/* KPI 3: Canales en Riesgo */}
        <div className={`p-2.5 rounded-xl border transition-colors ${
          criticalCount > 0
            ? 'bg-rose-500/5 border-rose-300 dark:border-rose-500/30 hover:border-rose-400 dark:hover:border-rose-500/50'
            : 'bg-slate-50 dark:bg-[#0b0f19] border-slate-200 dark:border-[#1e293b]/70'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-[9px] uppercase font-bold tracking-wider ${
              criticalCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'
            }`}>
              EN RIESGO (&lt;3%)
            </span>
            <AlertTriangle className={`w-3 h-3 ${criticalCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-black font-mono leading-none ${
              criticalCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {criticalCount}
            </span>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">críticos</span>
          </div>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-1">
            {warningCount} ajustados (3%-8%)
          </span>
        </div>

        {/* KPI 4: TC Promedio del Lote */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1e293b]/70 hover:border-slate-300 dark:hover:border-slate-700/60 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              TC PROMEDIO
            </span>
            <span className="text-[9px] font-mono text-sky-600 dark:text-sky-400 font-bold">USD</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black font-mono text-slate-900 dark:text-white leading-none">
              S/ {effectiveTC.toFixed(2)}
            </span>
          </div>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-1">
            Base ponderada de compra
          </span>
        </div>
      </div>

      {/* 3. Footer: Barra de Proporción Rápida */}
      <div className="pt-2 border-t border-slate-100 dark:border-[#1e293b]/70">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
            <span>Salud del catálogo</span>
          </span>
          <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
            {healthyCount} / {totalCotizaciones} saludables
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 dark:bg-[#0b0f19] rounded-full overflow-hidden flex">
          <div
            style={{ width: `${(criticalCount / (totalCotizaciones || 1)) * 100}%` }}
            className="bg-rose-500"
            title="Críticos"
          />
          <div
            style={{ width: `${(warningCount / (totalCotizaciones || 1)) * 100}%` }}
            className="bg-amber-400"
            title="Bajo margen"
          />
          <div
            style={{ width: `${(healthyCount / (totalCotizaciones || 1)) * 100}%` }}
            className="bg-emerald-400"
            title="Saludables"
          />
        </div>
      </div>
    </div>
  );
};
