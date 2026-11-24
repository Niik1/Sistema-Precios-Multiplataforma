import React from 'react';
import { Play, Sparkles, Trash2, Layers } from 'lucide-react';

interface SkuInputSectionProps {
  inputVal: string;
  onInputChange: (val: string) => void;
  onCalculate: () => void;
  onLoadDemo: () => void;
  onClear: () => void;
  isCalculating: boolean;
  uniqueCount: number;
}

export const SkuInputSection: React.FC<SkuInputSectionProps> = ({
  inputVal,
  onInputChange,
  onCalculate,
  onLoadDemo,
  onClear,
  isCalculating,
  uniqueCount,
}) => {
  return (
    <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-lg p-5 mb-5 shadow-sm transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600 dark:text-[#39d353]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#e6edf3]">
              Lote de SKUs a Cotizar
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#8b949e] mt-0.5">
            Pega tu lista de SKUs (uno por línea). Se detectan y descartan líneas vacías y duplicados automáticamente.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 text-xs font-medium text-sky-700 dark:text-[#58a6ff] hover:text-sky-900 dark:hover:text-white bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 px-3 py-1.5 rounded transition-all"
            title="Cargar 13 SKUs reales de prueba con consolas, juegos, mandos y sillas"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cargar Catálogo Demo</span>
          </button>

          {inputVal.trim() && (
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-[#f85149] hover:text-rose-800 dark:hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded transition-all"
              title="Limpiar campo"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <textarea
            value={inputVal}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Pega aquí tus SKUs...&#10;Ejemplo:&#10;GC00001&#10;GC00002&#10;GC00020"
            rows={4}
            className="w-full font-mono text-xs bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] focus:border-sky-500 dark:focus:border-[#58a6ff] rounded-md p-3 text-slate-900 dark:text-[#e6edf3] placeholder-slate-400 dark:placeholder-[#484f58] outline-none transition-colors"
          />
          {uniqueCount > 0 && (
            <span className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-600 dark:text-[#8b949e] bg-white dark:bg-[#161b22] px-2 py-0.5 rounded border border-slate-200 dark:border-[#30363d]">
              {uniqueCount} SKU{uniqueCount > 1 ? 's' : ''} detectado{uniqueCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex sm:flex-col justify-end">
          <button
            onClick={onCalculate}
            disabled={uniqueCount === 0 || isCalculating}
            className="w-full sm:w-44 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-[#39d353] dark:hover:bg-[#2ea043] disabled:bg-slate-200 dark:disabled:bg-[#21262d] text-white dark:text-[#0d1117] disabled:text-slate-400 dark:disabled:text-[#484f58] font-bold text-sm px-4 py-3 sm:py-0 sm:h-full rounded-md shadow-lg shadow-emerald-600/10 dark:shadow-[#39d353]/10 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isCalculating ? 'Calculando…' : 'Calcular Precios'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
