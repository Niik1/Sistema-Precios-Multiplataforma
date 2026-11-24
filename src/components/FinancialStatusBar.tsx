import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { MarginValidationSummary } from '../utils/marginValidator';

interface FinancialStatusBarProps {
  summary: MarginValidationSummary;
  totalCalculatedPrices: number;
}

export const FinancialStatusBar: React.FC<FinancialStatusBarProps> = ({
  summary,
  totalCalculatedPrices,
}) => {
  const { counts } = summary;
  const critical = counts.critical;
  const warning = counts.warning;
  const healthy = Math.max(totalCalculatedPrices - critical - warning, 0);
  const total = Math.max(totalCalculatedPrices, 1);

  const pctCritical = ((critical / total) * 100).toFixed(1);
  const pctWarning = ((warning / total) * 100).toFixed(1);
  const pctHealthy = ((healthy / total) * 100).toFixed(1);

  return (
    <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-3 px-4 shadow-sm dark:shadow-xl hover:border-slate-300 dark:hover:border-slate-700/80 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wide">
            Monitoreo Financiero & Rentabilidad
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            ({totalCalculatedPrices} precios auditados)
          </span>
        </div>

        {/* Leyenda interactiva de colores con porcentajes */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0b0f19] px-2 py-0.5 rounded-lg border border-slate-200 dark:border-[#1e293b]">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-slate-600 dark:text-slate-300">
              <strong className="text-rose-600 dark:text-rose-400 font-mono">{critical}</strong> críticas &lt;3% ({pctCritical}%)
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0b0f19] px-2 py-0.5 rounded-lg border border-slate-200 dark:border-[#1e293b]">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-slate-600 dark:text-slate-300">
              <strong className="text-amber-600 dark:text-amber-400 font-mono">{warning}</strong> ajustado 3%–8% ({pctWarning}%)
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0b0f19] px-2 py-0.5 rounded-lg border border-slate-200 dark:border-[#1e293b]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            <span className="text-slate-600 dark:text-slate-300">
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{healthy}</strong> saludable &ge;8% ({pctHealthy}%)
            </span>
          </div>
        </div>
      </div>

      {/* Barra de progreso segmentada continua */}
      <div className="w-full h-2 bg-slate-100 dark:bg-[#0b0f19] rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-slate-200 dark:border-[#1e293b]/70">
        {critical > 0 && (
          <div
            className="h-full bg-rose-500 rounded-l-full transition-all duration-500"
            style={{ width: `${Math.max(Number(pctCritical), 1.5)}%` }}
            title={`${critical} canales en riesgo crítico (<3%)`}
          />
        )}
        {warning > 0 && (
          <div
            className="h-full bg-amber-400 transition-all duration-500"
            style={{ width: `${Math.max(Number(pctWarning), 1.5)}%` }}
            title={`${warning} canales con margen ajustado (3%-8%)`}
          />
        )}
        {healthy > 0 && (
          <div
            className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-r-full transition-all duration-500"
            style={{ width: `${Number(pctHealthy)}%` }}
            title={`${healthy} canales con margen saludable (>=8%)`}
          />
        )}
      </div>
    </div>
  );
};
