import React from 'react';
import { X, TrendingUp, DollarSign, Truck, ArrowRight, Percent } from 'lucide-react';
import { ChannelPricingBreakdown, Product } from '../types';
import { formatPEN } from '../utils/normalizer';
import { MarginBadge } from './MarginBadge';

interface MarginAuditModalProps {
  breakdown: ChannelPricingBreakdown | null;
  product: Product | null;
  onClose: () => void;
}

export const MarginAuditModal: React.FC<MarginAuditModalProps> = ({
  breakdown,
  product,
  onClose,
}) => {
  if (!breakdown || !product) return null;

  const isProfitPositive = breakdown.profitPEN > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Header del Modal */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#30363d] px-6 py-4 bg-slate-50 dark:bg-[#1c2330]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-[#39d353] bg-emerald-500/10 dark:bg-[#39d353]/10 border border-emerald-500/30 dark:border-[#39d353]/30 px-2 py-0.5 rounded">
                Auditoría Financiera
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {breakdown.channelName}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#8b949e] mt-1 truncate max-w-sm" title={product.nombre}>
              {product.sku} – {product.nombre}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#30363d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Desglose */}
        <div className="p-6 space-y-4">
          {/* Tarjeta de Resumen Final */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-lg bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d]">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-[#8b949e] uppercase font-semibold">
                Precio de Venta Final
              </span>
              <div className="text-2xl font-black text-emerald-600 dark:text-[#39d353]">
                {formatPEN(breakdown.finalPrice)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 dark:text-[#8b949e] uppercase font-semibold">
                Margen Neto Empresa
              </span>
              <div
                className={`text-xl font-black flex items-center justify-end gap-1.5 ${
                  isProfitPositive
                    ? 'text-emerald-600 dark:text-[#39d353]'
                    : 'text-rose-600 dark:text-[#f85149]'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>{formatPEN(breakdown.profitPEN)}</span>
                <MarginBadge marginPercent={breakdown.profitMarginPercent} />
              </div>
            </div>
          </div>

          {/* Cascada Financiera (Waterfall) */}
          <div className="space-y-2 text-xs">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#8b949e] mb-2">
              Cascada de Costos y Deducciones
            </h4>

            <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-[#1c2330]/50 border border-slate-200 dark:border-[#30363d]">
              <span className="flex items-center gap-2 text-slate-800 dark:text-white">
                <DollarSign className="w-4 h-4 text-sky-600 dark:text-[#58a6ff]" />
                Costo Real Producto (Costo USD × TC)
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {formatPEN(breakdown.costoSoles)}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-[#1c2330]/50 border border-slate-200 dark:border-[#30363d]">
              <span className="flex items-center gap-2 text-slate-700 dark:text-[#e6edf3]">
                <Percent className="w-4 h-4 text-amber-600 dark:text-[#d97706]" />
                Comisión del Marketplace ({breakdown.commissionPercentage}%)
              </span>
              <span className="font-mono text-rose-600 dark:text-[#f85149]">
                - {formatPEN(breakdown.commissionAmountPEN)}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-slate-50 dark:bg-[#1c2330]/50 border border-slate-200 dark:border-[#30363d]">
              <span className="flex items-center gap-2 text-slate-700 dark:text-[#e6edf3]">
                <Truck className="w-4 h-4 text-slate-400 dark:text-[#8b949e]" />
                Flete / Retención Logística
              </span>
              <span className="font-mono text-rose-600 dark:text-[#f85149]">
                - {formatPEN(breakdown.shippingFee)}
              </span>
            </div>

            <div className="border-t border-slate-200 dark:border-[#30363d] pt-2 flex items-center justify-between font-semibold text-sm">
              <span className="flex items-center gap-2 text-emerald-700 dark:text-[#39d353]">
                <ArrowRight className="w-4 h-4" />
                Ingreso Neto Líquido Recibido
              </span>
              <span className="font-mono font-bold text-emerald-700 dark:text-[#39d353]">
                {formatPEN(breakdown.netRevenuePEN)}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-[#8b949e] italic pt-2">
            * El cálculo garantiza que la retención del marketplace no diluya tu costo ni el margen neto proyectado para el producto.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-[#1c2330] border-t border-slate-200 dark:border-[#30363d] px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="text-xs font-semibold px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-[#30363d] dark:hover:bg-[#484f58] text-slate-900 dark:text-white rounded transition-colors"
          >
            Cerrar Auditoría
          </button>
        </div>
      </div>
    </div>
  );
};
