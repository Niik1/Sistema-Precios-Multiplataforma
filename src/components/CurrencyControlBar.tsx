import React from 'react';
import {
  RefreshCw,
  Landmark,
  SlidersHorizontal,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { BCRPRateData } from '../services/bcrp.api';

interface CurrencyControlBarProps {
  rate: BCRPRateData | null;
  isLoadingTC: boolean;
  onRefreshTC: () => void;
  customTC: number | null;
  onCustomTCChange: (tc: number | null) => void;
}

export const CurrencyControlBar: React.FC<CurrencyControlBarProps> = ({
  rate,
  isLoadingTC,
  onRefreshTC,
  customTC,
  onCustomTCChange,
}) => {
  const isSimulating = customTC !== null;
  const currentTC = customTC ?? (rate ? Number(rate.sellRate.toFixed(2)) : 3.8);

  const isBcrpApplied =
    rate !== null &&
    customTC !== null &&
    Math.abs(customTC - Number(rate.sellRate.toFixed(2))) < 0.005;

  return (
    <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl p-4 mb-5 shadow-sm transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Lado Izquierdo: TC de Mercado BCRP / FX (5 cols) */}
        <div className="lg:col-span-5 flex items-center justify-between gap-3 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-[#30363d] pb-3 lg:pb-0 lg:pr-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/25 text-sky-600 dark:text-[#58a6ff] shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  TC Mercado
                </span>
                {rate && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-[#58a6ff] border border-sky-500/25">
                    {rate.source === 'BCRP_OFICIAL' ? 'BCRP' : 'FX Live'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {isLoadingTC && !rate ? (
                  <span className="text-xs text-slate-400">Consultando...</span>
                ) : rate ? (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 dark:text-[#8b949e]">
                      C: <strong className="font-mono text-slate-800 dark:text-white">S/ {rate.buyRate.toFixed(3)}</strong>
                    </span>
                    <span className="text-slate-300 dark:text-[#30363d]">|</span>
                    <span className="text-slate-500 dark:text-[#8b949e]">
                      V: <strong className="font-mono text-emerald-600 dark:text-[#39d353]">S/ {rate.sellRate.toFixed(3)}</strong>
                    </span>
                    {rate.delta !== 0 ? (
                      <span
                        className={`inline-flex items-center text-[11px] font-mono font-bold ${
                          rate.delta > 0
                            ? 'text-rose-600 dark:text-[#f85149]'
                            : 'text-emerald-600 dark:text-[#39d353]'
                        }`}
                      >
                        {rate.delta > 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                        {rate.delta > 0 ? '+' : ''}{rate.delta.toFixed(3)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-mono text-slate-400">
                        <Minus className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">Sin datos de TC</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {rate && (
              <button
                onClick={() => onCustomTCChange(Number(rate.sellRate.toFixed(2)))}
                disabled={isBcrpApplied}
                className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
                  isBcrpApplied
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-[#39d353] border-emerald-500/30'
                    : 'bg-sky-600 hover:bg-sky-700 text-white border-transparent shadow-sm'
                }`}
                title="Aplicar TC de venta del mercado a todo el simulador"
              >
                <span>{isBcrpApplied ? 'Aplicado' : 'Usar TC Hoy'}</span>
                {!isBcrpApplied && <ArrowRight className="w-3 h-3" />}
              </button>
            )}
            <button
              onClick={onRefreshTC}
              disabled={isLoadingTC}
              className="p-1.5 rounded-lg text-slate-500 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#21262d] border border-slate-200 dark:border-[#30363d] transition-colors"
              title="Refrescar tipo de cambio"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingTC ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Lado Derecho: Simulador y Slider Global (7 cols) */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-[#39d353] shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Simulador de TC
                </span>
                {isSimulating ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-[#d29922] border border-amber-500/30 animate-pulse">
                    Global Activo
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#21262d] text-slate-500 dark:text-[#8b949e] border border-slate-200 dark:border-[#30363d]">
                    TC Individual por SKU
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#8b949e]">
                {isSimulating
                  ? 'Sobrescribiendo TC de compra de cada producto'
                  : 'Calculando con el TC histórico de compra registrado'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center">
            <input
              type="range"
              min="3.20"
              max="4.30"
              step="0.05"
              value={currentTC}
              onChange={(e) => onCustomTCChange(parseFloat(e.target.value))}
              className="w-28 sm:w-36 accent-emerald-600 dark:accent-[#39d353] cursor-pointer"
            />
            <span className="font-mono text-xs font-bold text-emerald-700 dark:text-[#39d353] bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] px-2 py-1 rounded-md">
              S/ {currentTC.toFixed(2)}
            </span>

            {isSimulating && (
              <button
                onClick={() => onCustomTCChange(null)}
                className="text-[11px] font-semibold text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#0d1117] hover:bg-slate-200 dark:hover:bg-[#21262d] border border-slate-200 dark:border-[#30363d] px-2 py-1 rounded-md transition-colors"
                title="Restablecer al TC individual de compra"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
