import React from 'react';
import { Play } from 'lucide-react';
import { BCRPRateData } from '../services/bcrp.api';

interface LeftSidebarControlProps {
  // Input SKUs
  inputVal: string;
  onInputChange: (val: string) => void;
  onCalculate: () => void;
  onLoadDemo: () => void;
  onClear: () => void;
  isCalculating: boolean;
  uniqueCount: number;
  calculatedCount: number;
  executionTimeMs: number;

  // TC BCRP / Live
  rate: BCRPRateData | null;
  onApplyLiveTC: (sellRate: number) => void;

  // Simulador
  customTC: number | null;
  onCustomTCChange: (tc: number | null) => void;
}

export const LeftSidebarControl: React.FC<LeftSidebarControlProps> = ({
  inputVal,
  onInputChange,
  onCalculate,
  onLoadDemo,
  onClear,
  isCalculating,
  uniqueCount,
  calculatedCount,
  executionTimeMs,
  rate,
  onApplyLiveTC,
  customTC,
  onCustomTCChange,
}) => {
  const isSimulating = customTC !== null;
  const currentTC = customTC ?? (rate ? Number(rate.sellRate.toFixed(2)) : 3.46);

  return (
    <div className="space-y-4">
      {/* 1. Card: Lote de SKUs */}
      <div className="bg-[#111726] border border-[#1e293b] rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-white tracking-wide">
            Lote de SKUs
          </h2>
          <span className="text-[11px] font-mono text-slate-400 bg-[#1e293b] px-2 py-0.5 rounded-full border border-slate-700/50">
            {uniqueCount} detectados
          </span>
        </div>

        <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
          Pega tu lista, un SKU por línea. Se descartan líneas vacías y duplicados.
        </p>

        {/* Textarea moderno estilo terminal */}
        <textarea
          value={inputVal}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="GC00001&#10;GC00002&#10;GC00004"
          rows={7}
          className="w-full font-mono text-xs bg-[#0b0f19] border border-[#1e293b] focus:border-sky-500 rounded-xl p-3 text-white placeholder-slate-600 outline-none transition-colors resize-none mb-3"
        />

        {/* Botones secundarios: Demo y Limpiar */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={onLoadDemo}
            className="text-xs font-semibold text-slate-300 hover:text-white bg-[#1e293b] hover:bg-[#283548] py-2 px-3 rounded-xl transition-colors text-center border border-slate-700/50"
          >
            Cargar catálogo demo
          </button>
          <button
            onClick={onClear}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 bg-[#1e293b] hover:bg-[#283548] py-2 px-3 rounded-xl transition-colors text-center border border-slate-700/50"
          >
            Limpiar
          </button>
        </div>

        {/* Botón Principal Azul: Calcular precios */}
        <button
          onClick={onCalculate}
          disabled={uniqueCount === 0 || isCalculating}
          className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] disabled:bg-[#1e293b] text-white disabled:text-slate-500 font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed mb-2.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isCalculating ? 'Calculando…' : 'Calcular precios'}</span>
        </button>

        {/* Indicador de cálculo inferior */}
        {calculatedCount > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{calculatedCount} SKU(s) calculados</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 font-mono">{executionTimeMs.toFixed(1)} ms</span>
          </div>
        )}
      </div>

      {/* 2. Card: Tipo de Cambio */}
      <div className="bg-[#111726] border border-[#1e293b] rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white tracking-wide">
            Tipo de cambio
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded">
            {rate?.source === 'BCRP_OFICIAL' ? 'BCRP LIVE' : 'FX LIVE'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">COMPRA</span>
            <span className="font-mono text-base font-bold text-white mt-0.5 block">
              S/ {rate ? rate.buyRate.toFixed(3) : '3.431'}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">VENTA</span>
            <span className="font-mono text-base font-bold text-emerald-400 mt-0.5 block">
              S/ {rate ? rate.sellRate.toFixed(3) : '3.456'}
            </span>
          </div>
        </div>

        <button
          onClick={() => rate && onApplyLiveTC(Number(rate.sellRate.toFixed(2)))}
          className="w-full text-xs font-semibold text-sky-400 hover:text-white bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 py-2 rounded-xl transition-all text-center"
        >
          Usar TC de hoy
        </button>
      </div>

      {/* 3. Card: Simulador de TC */}
      <div className="bg-[#111726] border border-[#1e293b] rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white tracking-wide">
            Simulador de TC
          </h3>
          <button
            onClick={() => onCustomTCChange(null)}
            className="text-[10px] font-medium text-slate-400 hover:text-slate-200 bg-[#1e293b] px-2 py-0.5 rounded-full border border-slate-700/50"
          >
            {isSimulating ? 'Reset TC' : 'TC Individual por SKU'}
          </button>
        </div>

        <div className="flex items-center gap-2.5 my-3">
          <input
            type="range"
            min="3.20"
            max="4.30"
            step="0.01"
            value={currentTC}
            onChange={(e) => onCustomTCChange(parseFloat(e.target.value))}
            className="flex-1 accent-blue-500 cursor-pointer"
          />
          <span className="font-mono text-xs font-bold text-white bg-[#0b0f19] border border-[#1e293b] px-2.5 py-1 rounded-lg">
            S/ {currentTC.toFixed(2)}
          </span>
        </div>

        <p className="text-[10px] text-slate-500 leading-relaxed">
          {rate && isSimulating
            ? `${(currentTC - rate.sellRate >= 0 ? '+' : '')}${(currentTC - rate.sellRate).toFixed(3)} frente al TC de venta. Calculando con TC simulado.`
            : 'Calculando con el TC histórico de compra registrado en cada producto.'}
        </p>
      </div>
    </div>
  );
};
