import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { MARKETPLACES } from '../config/marketplaces';

interface RulesInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesInspectorModal: React.FC<RulesInspectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#30363d] px-6 py-4 bg-slate-50 dark:bg-[#1c2330]">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Matriz Declarativa de Reglas por Canal</span>
              <span className="text-[10px] font-mono text-emerald-700 dark:text-[#39d353] bg-emerald-500/10 dark:bg-[#39d353]/10 border border-emerald-500/30 dark:border-[#39d353]/30 px-2 py-0.5 rounded">
                17 Canales Configurados
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#8b949e] mt-0.5">
              Inspección de comisiones base, comisiones planas y políticas de fletes escalonados.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#30363d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {MARKETPLACES.map((m) => (
              <div
                key={m.id}
                className="bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] rounded-lg p-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded border"
                      style={{
                        color: m.color,
                        borderColor: `${m.color}60`,
                        backgroundColor: m.badgeBg,
                      }}
                    >
                      {m.displayName}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-[#8b949e]">
                      {m.isFlatCommission ? 'Comisión Plana' : 'Dinámica'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 dark:text-[#e6edf3] space-y-1.5 mt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-[#8b949e]">Tasa Base:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {m.isFlatCommission ? `${m.flatCommissionRate}%` : 'Por Reglas (8%-19%)'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-[#8b949e]">Flete Estándar:</span>
                      <span className="font-mono text-slate-900 dark:text-white">S/ {m.defaultShippingFee.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-[#8b949e]">Flete Pesado (Sillas):</span>
                      <span className="font-mono text-amber-600 dark:text-[#d97706]">
                        S/ {(m.heavyShippingFee ?? 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {m.shippingTiers && m.shippingTiers.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-[#30363d] text-[10px] text-slate-500 dark:text-[#8b949e]">
                    <span className="font-semibold text-slate-900 dark:text-white block mb-1">Escalonamiento:</span>
                    {m.shippingTiers.map((tier, idx) => (
                      <div key={idx} className="flex justify-between font-mono">
                        <span>
                          {tier.minPrice ? `> S/ ${tier.minPrice}` : `<= S/ ${tier.maxPrice}`}:
                        </span>
                        <span className="text-slate-900 dark:text-white">+ S/ {tier.shippingFee.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-[#1c2330] border border-slate-200 dark:border-[#30363d] rounded-lg p-4 text-xs text-slate-600 dark:text-[#8b949e] flex items-start gap-3 mt-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-[#39d353] flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-slate-900 dark:text-white">Mantenimiento Cero Código</h5>
              <p className="mt-0.5">
                Al separar las reglas en archivos de configuración declarativos (`src/config/rules/`), cualquier actualización de tasas de comisión por parte de Falabella, Mercado Libre o Coolbox se aplica de manera instantánea sin riesgo de alterar el motor de cálculo.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-[#1c2330] border-t border-slate-200 dark:border-[#30363d] px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="text-xs font-semibold px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-[#30363d] dark:hover:bg-[#484f58] text-slate-900 dark:text-white rounded transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
