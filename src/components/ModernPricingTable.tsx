import React, { useState } from 'react';
import { Search, FileSpreadsheet } from 'lucide-react';
import {
  ChannelPricingBreakdown,
  MarketplaceId,
  Product,
  ProductPricingResult,
} from '../types';
import { MARKETPLACES } from '../config/marketplaces';
import { formatPEN } from '../utils/normalizer';

interface ModernPricingTableProps {
  results: ProductPricingResult[];
  selectedSku: string | null;
  onSelectProduct: (result: ProductPricingResult) => void;
  onInspectAudit: (breakdown: ChannelPricingBreakdown, product: Product) => void;
  onExportExcel: () => void;
}

export const ModernPricingTable: React.FC<ModernPricingTableProps> = ({
  results,
  selectedSku,
  onSelectProduct,
  onInspectAudit,
  onExportExcel,
}) => {
  const [filterText, setFilterText] = useState('');
  const [viewMode, setViewMode] = useState<'precio' | 'margen'>('precio');

  const filtered = results.filter((r) => {
    const q = filterText.toLowerCase().trim();
    if (!q) return true;
    return (
      r.product.sku.toLowerCase().includes(q) ||
      r.product.nombre.toLowerCase().includes(q) ||
      r.product.categoria.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-[#111726] border border-[#1e293b] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header de la Tabla: Toggle de vista + Search + Exportar Excel */}
      <div className="p-4 border-b border-[#1e293b] flex flex-wrap items-center justify-between gap-3 bg-[#111726]">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-white tracking-wide">
            Cotización por canal
          </h3>

          {/* Toggle Pills: [ Precio | Margen ] */}
          <div className="flex items-center p-0.5 rounded-lg bg-[#0b0f19] border border-[#1e293b]">
            <button
              onClick={() => setViewMode('precio')}
              className={`text-xs font-semibold px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'precio'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Precio
            </button>
            <button
              onClick={() => setViewMode('margen')}
              className={`text-xs font-semibold px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'margen'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Margen
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Input con lupa */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar por SKU o nombre..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="text-xs bg-[#0b0f19] border border-[#1e293b] focus:border-sky-500 rounded-xl pl-8 pr-3 py-1.5 text-white placeholder-slate-500 outline-none w-52 sm:w-64 transition-colors"
            />
          </div>

          {/* Botón Exportar Excel con ExcelJS */}
          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm"
            title="Exportar archivo Excel (.xlsx) con estilos y auditoría de márgenes"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Tabla con Scroll Horizontal */}
      <div className="overflow-x-auto max-h-[560px] overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
          <thead className="sticky top-0 z-20 bg-[#0e1422] border-b border-[#1e293b] text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
            <tr>
              <th className="p-3 pl-4 sticky left-0 z-30 bg-[#0e1422] border-r border-[#1e293b] min-w-[240px]">
                PRODUCTO
              </th>
              <th className="p-3 text-center min-w-[65px]">TC</th>
              <th className="p-3 text-right min-w-[75px]">COSTO</th>
              <th className="p-3 text-right border-r border-[#1e293b] min-w-[85px]">P. VENTA</th>

              {/* Columnas de los Marketplaces */}
              {MARKETPLACES.map((m) => (
                <th
                  key={m.id}
                  className="p-3 text-center min-w-[100px] border-r border-[#1e293b]/40 font-bold text-slate-300"
                >
                  {m.displayName}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#1e293b]/50">
            {filtered.map((item) => {
              const p = item.product;
              const isSelected = selectedSku === p.sku;
              const pVentaPEN = (p.precioVentaUSD || p.costoUSD + p.margenUSD) * item.effectiveTC;

              return (
                <tr
                  key={p.sku}
                  onClick={() => onSelectProduct(item)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#1e293b]/80 border-l-2 border-l-blue-500'
                      : 'hover:bg-[#161f33]/60'
                  }`}
                >
                  {/* Columna combinada: Nombre + SKU pill + Categoría pill */}
                  <td className="p-3 pl-4 sticky left-0 z-10 bg-[#111726] border-r border-[#1e293b] max-w-[260px]">
                    <div className="font-semibold text-white truncate mb-1" title={p.nombre}>
                      {p.nombre}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.2 rounded border border-sky-500/20">
                        {p.sku}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase bg-[#1e293b] px-1.5 py-0.2 rounded">
                        {p.categoria}
                      </span>
                    </div>
                  </td>

                  {/* TC */}
                  <td className="p-3 text-center font-mono text-slate-400">
                    {item.effectiveTC.toFixed(2)}
                  </td>

                  {/* Costo */}
                  <td className="p-3 text-right font-mono text-slate-400">
                    $ {p.costoUSD.toFixed(2)}
                  </td>

                  {/* Precio Venta */}
                  <td className="p-3 text-right font-mono font-bold text-white border-r border-[#1e293b]">
                    S/ {pVentaPEN.toFixed(1)}
                  </td>

                  {/* Celdas de Marketplaces: Precio arriba + Dot de Margen abajo */}
                  {MARKETPLACES.map((m) => {
                    const ch = item.channels[m.id as MarketplaceId];
                    if (!ch || !ch.finalPrice) {
                      return (
                        <td
                          key={m.id}
                          className="p-3 text-center text-slate-600 font-mono border-r border-[#1e293b]/30"
                        >
                          —
                        </td>
                      );
                    }

                    const isCritical = ch.profitMarginPercent < 3;
                    const isWarning = ch.profitMarginPercent >= 3 && ch.profitMarginPercent < 8;

                    const dotColor = isCritical
                      ? 'bg-rose-500'
                      : isWarning
                      ? 'bg-amber-400'
                      : 'bg-emerald-400';

                    const textColor = isCritical
                      ? 'text-rose-400'
                      : isWarning
                      ? 'text-amber-400'
                      : 'text-emerald-400';

                    return (
                      <td
                        key={m.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(item);
                          onInspectAudit(ch, p);
                        }}
                        className="p-2.5 text-center border-r border-[#1e293b]/30 hover:bg-blue-500/10 transition-colors"
                        title="Haz clic para auditar la cascada financiera"
                      >
                        {viewMode === 'precio' ? (
                          <div className="flex flex-col items-center justify-center">
                            <span className="font-mono font-bold text-white text-xs">
                              {formatPEN(ch.finalPrice)}
                            </span>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                              <span className={`font-mono text-[10px] font-semibold ${textColor}`}>
                                {ch.profitMarginPercent.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            <span className={`font-mono font-bold text-xs ${textColor}`}>
                              {ch.profitMarginPercent.toFixed(1)}%
                            </span>
                            <span className="font-mono text-[10px] text-slate-500">
                              {formatPEN(ch.finalPrice)}
                            </span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
