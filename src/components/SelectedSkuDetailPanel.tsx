import React from 'react';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';
import { ProductPricingResult } from '../types';
import { formatPEN } from '../utils/normalizer';
import { MARKETPLACES } from '../config/marketplaces';

interface SelectedSkuDetailPanelProps {
  selectedResult: ProductPricingResult | null;
}

export const SelectedSkuDetailPanel: React.FC<SelectedSkuDetailPanelProps> = ({
  selectedResult,
}) => {
  if (!selectedResult) {
    return (
      <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-4 text-slate-500 dark:text-slate-400 text-xs flex flex-col items-center justify-center h-full text-center hover:border-slate-300 dark:hover:border-slate-700/80 transition-all">
        <Target className="w-8 h-8 text-slate-400 dark:text-slate-600 mb-2" />
        <p className="font-semibold text-slate-700 dark:text-slate-300">Ningún SKU seleccionado</p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-[200px]">
          Haz clic en cualquier fila de la tabla para inspeccionar sus márgenes.
        </p>
      </div>
    );
  }

  const { product, effectiveTC, channels } = selectedResult;
  const precioVentaSoles = (product.precioVentaUSD || product.costoUSD + product.margenUSD) * effectiveTC;

  // Filtrar canales activos ordenados de mayor a menor margen
  const validChannels = MARKETPLACES.map((m) => {
    const ch = channels[m.id];
    return {
      id: m.id,
      displayName: m.displayName,
      margin: ch ? ch.profitMarginPercent : 0,
      price: ch ? ch.finalPrice : 0,
      hasData: ch && ch.finalPrice > 0,
    };
  }).filter((c) => c.hasData);

  const sortedByMargin = [...validChannels].sort((a, b) => b.margin - a.margin);
  const bestChannel = sortedByMargin[0];
  const worstChannel = sortedByMargin[sortedByMargin.length - 1];

  // Mostramos los 4 canales principales para mantener la altura compacta
  const displayChannels = validChannels.slice(0, 4);

  return (
    <div className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-4 shadow-sm dark:shadow-xl flex flex-col justify-between h-full hover:border-slate-300 dark:hover:border-slate-700/80 transition-all">
      {/* 1. Header con Badge */}
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1e293b]/70">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Target className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              SKU SELECCIONADO
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/25 px-1.5 py-0.2 rounded">
              {product.sku}
            </span>
            <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1e293b] px-1.5 py-0.2 rounded uppercase">
              {product.categoria}
            </span>
          </div>
        </div>

        <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 leading-snug line-clamp-1" title={product.nombre}>
          {product.nombre}
        </h3>

        {/* Mini Grid de 3 métricas */}
        <div className="grid grid-cols-3 gap-1.5 mt-2 p-1.5 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1e293b]/70 text-center">
          <div>
            <span className="text-[8px] uppercase font-bold text-slate-500 block">COSTO</span>
            <span className="font-mono text-[11px] font-bold text-slate-900 dark:text-white mt-0.5 block">
              $ {product.costoUSD.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-[8px] uppercase font-bold text-slate-500 block">TC APLICADO</span>
            <span className="font-mono text-[11px] font-bold text-sky-600 dark:text-sky-400 mt-0.5 block">
              {effectiveTC.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-[8px] uppercase font-bold text-slate-500 block">P. VENTA</span>
            <span className="font-mono text-[11px] font-bold text-slate-900 dark:text-white mt-0.5 block">
              S/ {precioVentaSoles.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Sección: Barras de Margen por Canal */}
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase">
            <span>Canal</span>
            <span>Precio · Margen</span>
          </div>

          {displayChannels.map((c) => {
            const barWidthPercent = Math.min(Math.max((c.margin / 12) * 100, 3), 100);
            const isCritical = c.margin < 3;
            const isWarning = c.margin >= 3 && c.margin < 8;

            const barColor = isCritical
              ? 'bg-rose-500'
              : isWarning
              ? 'bg-amber-400'
              : 'bg-emerald-500 dark:bg-emerald-400';

            return (
              <div key={c.id} className="space-y-0.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[110px]">
                    {c.displayName}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-slate-500 dark:text-slate-400 text-[9px]">{formatPEN(c.price)}</span>
                    <span
                      className={`text-[9px] font-bold ${
                        isCritical
                          ? 'text-rose-600 dark:text-rose-400'
                          : isWarning
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {c.margin.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-[#0b0f19] h-1 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${barWidthPercent}%` }}
                    className={`h-full ${barColor} transition-all duration-300`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer: Mayor Margen vs Más Ajustado */}
      {bestChannel && worstChannel && (
        <div className="pt-2 border-t border-slate-100 dark:border-[#1e293b]/70 grid grid-cols-2 gap-2 text-[9px]">
          <div className="flex items-center gap-1.5 truncate">
            <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 dark:text-slate-500 block text-[8px] uppercase">Mayor margen</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 truncate block">
                {bestChannel.displayName} ({bestChannel.margin.toFixed(1)}%)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 truncate border-l border-slate-200 dark:border-[#1e293b] pl-2">
            <TrendingDown className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 dark:text-slate-500 block text-[8px] uppercase">Más ajustado</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400 truncate block">
                {worstChannel.displayName} ({worstChannel.margin.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
