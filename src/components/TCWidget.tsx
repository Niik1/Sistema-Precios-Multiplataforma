import React from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Minus, Landmark, ArrowRight } from 'lucide-react';
import { BCRPRateData } from '../services/bcrp.api';

interface TCWidgetProps {
  rate: BCRPRateData | null;
  isLoading: boolean;
  onRefresh: () => void;
  onApplyToSimulator: (sellRate: number) => void;
  activeCustomTC: number | null;
}

export const TCWidget: React.FC<TCWidgetProps> = ({
  rate,
  isLoading,
  onRefresh,
  onApplyToSimulator,
  activeCustomTC,
}) => {
  const sourceBadge = () => {
    if (!rate) return null;
    if (rate.source === 'BCRP_OFICIAL') {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-[#39d353] border border-emerald-500/30">
          BCRP Oficial
        </span>
      );
    }
    if (rate.source === 'FX_LIVE') {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-[#58a6ff] border border-sky-500/30">
          FX en Vivo
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-[#d29922] border border-amber-500/30">
        Referencia Caché
      </span>
    );
  };

  const isApplied =
    rate !== null &&
    activeCustomTC !== null &&
    Math.abs(activeCustomTC - Number(rate.sellRate.toFixed(2))) < 0.005;

  return (
    <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-lg p-3.5 mb-4 shadow-sm transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Info principal */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/25 text-sky-600 dark:text-[#58a6ff] shrink-0">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Tipo de Cambio del Día (USD → PEN)
              </h3>
              {sourceBadge()}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#8b949e] mt-0.5">
              {isLoading && !rate
                ? 'Consultando tipo de cambio en vivo...'
                : rate
                  ? `Referencia de mercado (${rate.dateLabel}) — El precio real conserva el TC de compra de cada SKU`
                  : 'Sin datos de tipo de cambio'}
            </p>
          </div>
        </div>

        {/* Valores y acciones */}
        <div className="flex flex-wrap items-center gap-3">
          {rate && (
            <>
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-md px-3 py-1.5">
                <div className="text-xs">
                  <span className="text-slate-500 dark:text-[#8b949e] mr-1.5">Compra:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    S/ {rate.buyRate.toFixed(3)}
                  </span>
                </div>
                <span className="text-slate-300 dark:text-[#30363d]">|</span>
                <div className="text-xs">
                  <span className="text-slate-500 dark:text-[#8b949e] mr-1.5">Venta:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-[#39d353]">
                    S/ {rate.sellRate.toFixed(3)}
                  </span>
                </div>
                {rate.delta !== 0 ? (
                  <span
                    className={`flex items-center gap-0.5 text-[11px] font-mono font-semibold ${
                      rate.delta > 0
                        ? 'text-rose-600 dark:text-[#f85149]'
                        : 'text-emerald-600 dark:text-[#39d353]'
                    }`}
                    title="Variación respecto a la lectura anterior"
                  >
                    {rate.delta > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {rate.delta > 0 ? '+' : ''}
                    {rate.delta.toFixed(3)}
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 text-[11px] font-mono text-slate-400 dark:text-[#8b949e]">
                    <Minus className="w-3 h-3" /> 0.000
                  </span>
                )}
              </div>

              <button
                onClick={() => onApplyToSimulator(Number(rate.sellRate.toFixed(2)))}
                disabled={isApplied}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors ${
                  isApplied
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-[#39d353] border-emerald-500/30 cursor-default'
                    : 'bg-sky-600 hover:bg-sky-700 text-white border-transparent shadow-sm'
                }`}
                title="Simular precios de todo el lote con el TC venta actual"
              >
                <span>{isApplied ? 'TC Aplicado' : 'Simular con TC Hoy'}</span>
                {!isApplied && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </>
          )}

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#0d1117] hover:bg-slate-200 dark:hover:bg-[#21262d] border border-slate-200 dark:border-[#30363d] px-2.5 py-1.5 rounded-md transition-colors disabled:opacity-50"
            title="Actualizar tipo de cambio en vivo"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
