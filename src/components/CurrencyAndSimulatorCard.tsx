import React from 'react';
import { DollarSign, SlidersHorizontal, RefreshCw, Zap } from 'lucide-react';
import { BCRPRateData } from '../services/bcrp.api';

interface CurrencyAndSimulatorCardProps {
  rate: BCRPRateData | null;
  onApplyLiveTC: (sellRate: number) => void;
  customTC: number | null;
  onCustomTCChange: (tc: number | null) => void;
}

export const CurrencyAndSimulatorCard: React.FC<CurrencyAndSimulatorCardProps> = ({
  rate,
  onApplyLiveTC,
  customTC,
  onCustomTCChange,
}) => {
  const liveSellRate = rate ? Number(rate.sellRate.toFixed(2)) : 3.46;
  const isSimulating = customTC !== null;
  const currentTC = customTC ?? liveSellRate;

  // Escenarios rápidos de tipo de cambio
  const presets = [
    { label: '3.50', val: 3.50 },
    { label: '3.65', val: 3.65 },
    { label: '3.80', val: 3.80 },
    { label: '3.95', val: 3.95 },
  ];

  return (
    <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-4 shadow-sm dark:shadow-xl flex flex-col justify-between h-full hover:border-slate-300 dark:hover:border-slate-700/80 transition-all">
      {/* 1. Header con Badge de Estado */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-[#1e293b]/70">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-wide">
              Control Cambiario
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Referencia & Simulación</p>
          </div>
        </div>

        <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full">
          {rate?.source === 'BCRP_OFICIAL' ? 'BCRP OFICIAL' : 'FX EN VIVO'}
        </span>
      </div>

      {/* 2. Grid de Compra y Venta Oficial + Botón Aplicar */}
      <div className="my-2 space-y-1.5">
        <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1e293b]/70">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 block">COMPRA</span>
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
              S/ {rate ? rate.buyRate.toFixed(3) : '3.431'}
            </span>
          </div>
          <div className="border-l border-slate-200 dark:border-[#1e293b] pl-2">
            <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 block">VENTA MERCADO</span>
            <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              S/ {rate ? rate.sellRate.toFixed(3) : '3.456'}
            </span>
          </div>
        </div>

        <button
          onClick={() => rate && onApplyLiveTC(liveSellRate)}
          className="w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:text-white bg-sky-500/10 hover:bg-sky-500 dark:hover:bg-sky-500/20 border border-sky-500/30 py-1.5 rounded-xl transition-all cursor-pointer"
        >
          <Zap className="w-3 h-3" />
          <span>Aplicar TC mercado actual ({liveSellRate.toFixed(2)})</span>
        </button>
      </div>

      {/* 3. Escenarios Rápidos (Presets) */}
      <div className="space-y-1">
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
          Escenarios Rápidos:
        </span>
        <div className="grid grid-cols-4 gap-1.5">
          {presets.map((p) => {
            const isSelected = isSimulating && Math.abs(currentTC - p.val) < 0.005;
            return (
              <button
                key={p.label}
                onClick={() => onCustomTCChange(p.val)}
                className={`text-[10px] font-mono font-bold py-1 px-1 rounded-lg border transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-100 dark:bg-[#0b0f19] hover:bg-slate-200 dark:hover:bg-[#1e293b] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#1e293b]'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Panel de Simulación Integrado */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-[#1e293b]/70 mt-2 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">Simulador Global</span>
          </div>

          <button
            onClick={() => onCustomTCChange(null)}
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 transition-all cursor-pointer ${
              isSimulating
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
                : 'bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <RefreshCw className="w-2.5 h-2.5" />
            <span>{isSimulating ? 'Resetear TC' : 'TC Lote'}</span>
          </button>
        </div>

        {/* Slider + Input Numérico Compacto */}
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="3.20"
            max="4.30"
            step="0.01"
            value={currentTC}
            onChange={(e) => onCustomTCChange(parseFloat(e.target.value))}
            className="flex-1 accent-blue-600 dark:accent-blue-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-[#0b0f19] rounded-lg"
          />
          <div className="flex items-center bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1e293b] rounded-lg px-2 py-0.5">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mr-1">S/</span>
            <input
              type="number"
              step="0.01"
              min="2.00"
              max="6.00"
              value={currentTC}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) onCustomTCChange(val);
              }}
              className="w-12 text-xs font-mono font-bold text-sky-600 dark:text-sky-400 bg-transparent outline-none text-right"
            />
          </div>
        </div>

        <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight">
          {isSimulating
            ? `Simulando todo el catálogo a S/ ${currentTC.toFixed(2)}.`
            : 'Cotizando con el TC individual de compra registrado por SKU.'}
        </p>
      </div>
    </div>
  );
};
