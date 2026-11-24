import React from 'react';
import { RefreshCw, SlidersHorizontal } from 'lucide-react';

interface SimulatorBarProps {
  customTC: number | null;
  onCustomTCChange: (tc: number | null) => void;
}

export const SimulatorBar: React.FC<SimulatorBarProps> = ({
  customTC,
  onCustomTCChange,
}) => {
  const isSimulating = customTC !== null;
  const currentTC = customTC ?? 3.8;

  return (
    <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-lg p-3.5 mb-5 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-sky-600 dark:text-[#58a6ff]" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                Simulador de Tipo de Cambio (TC)
              </h3>
              {isSimulating && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-[#d29922] border border-amber-500/30">
                  Simulación Activa
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#8b949e]">
              {isSimulating
                ? 'Modo simulación activo: sobrescribe temporalmente el TC individual de cada producto'
                : 'Ajusta el slider para simular un TC global o mantén el TC de compra de cada SKU'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <input
              type="range"
              min="3.20"
              max="4.30"
              step="0.05"
              value={currentTC}
              onChange={(e) => onCustomTCChange(parseFloat(e.target.value))}
              className="w-32 sm:w-40 accent-emerald-600 dark:accent-[#39d353] cursor-pointer"
            />
            <span className="font-mono text-sm font-bold text-emerald-700 dark:text-[#39d353] bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] px-2.5 py-1 rounded">
              S/ {currentTC.toFixed(2)}
            </span>
          </div>

          {isSimulating && (
            <button
              onClick={() => onCustomTCChange(null)}
              className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#0d1117] hover:bg-slate-200 dark:hover:bg-[#21262d] border border-slate-200 dark:border-[#30363d] px-2.5 py-1 rounded transition-colors"
              title="Restablecer al TC individual de cada producto"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset TC</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
