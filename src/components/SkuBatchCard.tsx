import React from 'react';
import { Play, Sparkles, Trash2, Layers } from 'lucide-react';

interface SkuBatchCardProps {
  inputVal: string;
  onInputChange: (val: string) => void;
  onCalculate: () => void;
  onLoadDemo: () => void;
  onClear: () => void;
  isCalculating: boolean;
  uniqueCount: number;
  calculatedCount: number;
  executionTimeMs: number;
}

export const SkuBatchCard: React.FC<SkuBatchCardProps> = ({
  inputVal,
  onInputChange,
  onCalculate,
  onLoadDemo,
  onClear,
  isCalculating,
  uniqueCount,
  calculatedCount,
  executionTimeMs,
}) => {
  return (
    <div className="bg-[#111726] border border-[#1e293b] rounded-2xl p-4 shadow-xl flex flex-col justify-between h-full hover:border-slate-700/80 transition-all">
      {/* 1. Header con Badge */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#1e293b]/70">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white tracking-wide">
              Lote de SKUs
            </h2>
            <p className="text-[10px] text-slate-400">1 SKU por línea</p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/25">
          {uniqueCount} detectados
        </span>
      </div>

      {/* 2. Textarea flexible que ocupa el espacio disponible */}
      <div className="my-2 flex-1 flex flex-col min-h-0">
        <textarea
          value={inputVal}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="GC00001&#10;GC00002&#10;GC00004"
          className="w-full flex-1 min-h-[90px] font-mono text-xs bg-[#0b0f19] border border-[#1e293b] focus:border-sky-500 rounded-xl p-2.5 text-white placeholder-slate-600 outline-none transition-colors resize-none leading-relaxed"
        />

        {/* Botones secundarios inmediatamente debajo del textarea */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button
            onClick={onLoadDemo}
            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#0b0f19] hover:bg-[#1e293b] py-1.5 px-2 rounded-xl transition-colors border border-[#1e293b] hover:border-slate-700 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>Cargar demo</span>
          </button>
          <button
            onClick={onClear}
            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-[#0b0f19] hover:bg-rose-500/10 py-1.5 px-2 rounded-xl transition-colors border border-[#1e293b] hover:border-rose-500/30 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Limpiar</span>
          </button>
        </div>
      </div>

      {/* 3. Footer: Botón de Cálculo SÓLIDO (sin degradado) & Métricas de Ejecución */}
      <div className="pt-2 border-t border-[#1e293b]/70 space-y-1">
        <button
          onClick={onCalculate}
          disabled={uniqueCount === 0 || isCalculating}
          className="w-full flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] disabled:bg-[#1e293b] text-white disabled:text-slate-500 font-bold text-xs py-2.5 rounded-xl transition-colors shadow-md shadow-blue-600/25 disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isCalculating ? 'Calculando matriz…' : 'Calcular precios'}</span>
        </button>

        <div className="flex items-center justify-between text-[10px] pt-0.5">
          {calculatedCount > 0 ? (
            <>
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{calculatedCount} SKUs procesados</span>
              </div>
              <span className="text-slate-500 font-mono">{executionTimeMs.toFixed(1)} ms</span>
            </>
          ) : (
            <span className="text-slate-500">Listo para procesar</span>
          )}
        </div>
      </div>
    </div>
  );
};
