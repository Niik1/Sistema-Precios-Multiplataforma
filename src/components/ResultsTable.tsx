import React, { useState } from 'react';
import { Search, Download, HelpCircle, Eye } from 'lucide-react';
import {
  ChannelPricingBreakdown,
  MarketplaceId,
  Product,
  ProductPricingResult,
} from '../types';
import { MARKETPLACES } from '../config/marketplaces';
import { formatPEN } from '../utils/normalizer';
import { MarginBadge } from './MarginBadge';
import { getChannelMarginStatus } from '../utils/marginValidator';

interface ResultsTableProps {
  results: ProductPricingResult[];
  onSelectAudit: (breakdown: ChannelPricingBreakdown, product: Product) => void;
  onExportCSV: () => void;
  executionTimeMs: number;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  onSelectAudit,
  onExportCSV,
  executionTimeMs,
}) => {
  const [filterText, setFilterText] = useState('');

  const filtered = results.filter((r) => {
    const q = filterText.toLowerCase().trim();
    if (!q) return true;
    return (
      r.product.sku.toLowerCase().includes(q) ||
      r.product.nombre.toLowerCase().includes(q) ||
      r.product.categoria.toLowerCase().includes(q)
    );
  });

  const getCategoryBadge = (cat: string) => {
    const c = (cat || '').toUpperCase();
    if (c.includes('VIDEOJUEGO')) {
      return (
        <span className="text-[10px] font-bold text-sky-700 dark:text-[#58a6ff] bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded">
          VIDEOJUEGOS
        </span>
      );
    }
    if (c.includes('CONSOLA')) {
      return (
        <span className="text-[10px] font-bold text-amber-700 dark:text-[#d29922] bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
          CONSOLAS
        </span>
      );
    }
    if (c.includes('ACCESORIO')) {
      return (
        <span className="text-[10px] font-bold text-purple-700 dark:text-[#a371f7] bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded">
          ACCESORIOS
        </span>
      );
    }
    if (c.includes('SILLA')) {
      return (
        <span className="text-[10px] font-bold text-emerald-700 dark:text-[#39d353] bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
          SILLAS
        </span>
      );
    }
    if (c.includes('FUNKO')) {
      return (
        <span className="text-[10px] font-bold text-pink-700 dark:text-[#f778ba] bg-pink-500/10 border border-pink-500/30 px-2 py-0.5 rounded">
          FUNKOS
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold text-slate-600 dark:text-[#8b949e] bg-slate-100 dark:bg-[#21262d] border border-slate-200 dark:border-[#30363d] px-2 py-0.5 rounded">
        {c || '—'}
      </span>
    );
  };

  if (!results.length) return null;

  return (
    <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-lg overflow-hidden shadow-xl mb-12 transition-colors">
      {/* Barra de Controles y Métricas de la Tabla */}
      <div className="p-4 border-b border-slate-200 dark:border-[#30363d] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50 dark:bg-[#1c2330]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-[#39d353] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#39d353] animate-pulse"></span>
            <span>{results.length} SKU(s) Calculados</span>
          </div>

          <span className="text-slate-300 dark:text-[#30363d]">|</span>

          <span className="text-xs text-slate-500 dark:text-[#8b949e] font-mono">
            ⏱️ {executionTimeMs.toFixed(1)} ms
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Input de Búsqueda Rápida */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-[#8b949e] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar por SKU o nombre..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="text-xs bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] focus:border-sky-500 dark:focus:border-[#58a6ff] rounded pl-8 pr-3 py-1.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#8b949e] outline-none w-48 sm:w-60 transition-colors"
            />
          </div>

          {/* Botón de Exportar CSV */}
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-[#238636] dark:hover:bg-[#2ea043] px-3 py-1.5 rounded transition-colors"
            title="Exportar a CSV consolidado con BOM UTF-8"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Contenedor con Scroll Horizontal */}
      <div className="overflow-x-auto max-h-[620px] overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
          <thead className="sticky top-0 z-20 bg-slate-50 dark:bg-[#161b22] border-b border-slate-200 dark:border-[#30363d]">
            <tr>
              <th className="p-3 font-bold text-slate-500 dark:text-[#8b949e] bg-slate-50 dark:bg-[#161b22] sticky left-0 z-30 border-r border-slate-200 dark:border-[#30363d] min-w-[260px]">
                NOMBRE
              </th>
              <th className="p-3 font-bold text-slate-500 dark:text-[#8b949e] min-w-[90px]">SKU</th>
              <th className="p-3 font-bold text-slate-500 dark:text-[#8b949e] min-w-[110px]">CATEGORÍA</th>
              <th className="p-3 font-bold text-slate-500 dark:text-[#8b949e] text-center min-w-[65px]">TC</th>
              <th className="p-3 font-bold text-slate-500 dark:text-[#8b949e] text-right min-w-[90px]">COSTO USD</th>
              <th className="p-3 font-bold text-slate-900 dark:text-[#e6edf3] text-right border-r border-slate-200 dark:border-[#30363d] min-w-[100px] bg-slate-100 dark:bg-[#1c2330]">
                PREC. VENTA
              </th>

              {/* Columnas Dinámicas de los 17 Marketplaces */}
              {MARKETPLACES.map((m) => (
                <th
                  key={m.id}
                  className="p-3 font-extrabold text-center min-w-[110px] border-r border-slate-200/70 dark:border-[#30363d]/50"
                  style={{
                    backgroundColor: m.badgeBg,
                    color: m.color,
                  }}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{m.displayName}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200/70 dark:divide-[#30363d]/50">
            {filtered.map((item, idx) => {
              const p = item.product;
              return (
                <tr
                  key={p.sku + idx}
                  className="hover:bg-slate-50 dark:hover:bg-[#1c2330]/60 transition-colors group"
                >
                  {/* Nombre con Sticky Left para que no se pierda al hacer scroll */}
                  <td
                    className="p-3 font-medium text-slate-900 dark:text-white sticky left-0 z-10 bg-white dark:bg-[#161b22] group-hover:bg-slate-50 dark:group-hover:bg-[#1c2330] border-r border-slate-200 dark:border-[#30363d] max-w-[280px] truncate"
                    title={p.nombre}
                  >
                    {p.nombre}
                  </td>
                  <td className="p-3 font-mono font-semibold text-sky-600 dark:text-[#58a6ff]">
                    {p.sku}
                  </td>
                  <td className="p-3">{getCategoryBadge(p.categoria)}</td>
                  <td className="p-3 font-mono text-center text-slate-500 dark:text-[#8b949e]">
                    {item.effectiveTC.toFixed(2)}
                  </td>
                  <td className="p-3 font-mono text-right text-slate-500 dark:text-[#8b949e]">
                    $ {p.costoUSD.toFixed(2)}
                  </td>
                  <td className="p-3 font-mono font-bold text-right text-slate-900 dark:text-white border-r border-slate-200 dark:border-[#30363d] bg-slate-50 dark:bg-[#1c2330]/40">
                    {formatPEN(p.precioVentaUSD * item.effectiveTC)}
                  </td>

                  {/* Precios por Marketplace con disparador de auditoría y badge de margen */}
                  {MARKETPLACES.map((m) => {
                    const ch = item.channels[m.id as MarketplaceId];
                    if (!ch || !ch.finalPrice) {
                      return (
                        <td
                          key={m.id}
                          className="p-3 font-mono text-center text-slate-300 dark:text-[#484f58] border-r border-slate-200/50 dark:border-[#30363d]/30"
                        >
                          —
                        </td>
                      );
                    }

                    const marginStatus = getChannelMarginStatus(ch.profitMarginPercent);

                    return (
                      <td
                        key={m.id}
                        onClick={() => onSelectAudit(ch, p)}
                        className={`p-2.5 font-mono font-bold text-center border-r border-slate-200/50 dark:border-[#30363d]/30 cursor-pointer transition-all relative group/cell ${
                          marginStatus === 'critical'
                            ? 'bg-rose-50/60 dark:bg-[#f85149]/5 text-rose-700 dark:text-[#f85149] hover:bg-rose-100/80 dark:hover:bg-[#f85149]/15'
                            : marginStatus === 'warning'
                              ? 'bg-amber-50/50 dark:bg-[#d29922]/5 text-amber-800 dark:text-[#d29922] hover:bg-amber-100/70 dark:hover:bg-[#d29922]/15'
                              : 'text-slate-900 dark:text-white hover:text-emerald-700 dark:hover:text-[#39d353] hover:bg-emerald-500/10 dark:hover:bg-[#39d353]/10'
                        }`}
                        title="Haz clic para ver el desglose financiero de margen y comisión"
                      >
                        <div className="flex flex-col items-center justify-center gap-0.5">
                          <div className="flex items-center justify-center gap-1">
                            <span>{formatPEN(ch.finalPrice)}</span>
                            <Eye className="w-3 h-3 opacity-0 group-hover/cell:opacity-100 text-emerald-600 dark:text-[#39d353] transition-opacity" />
                          </div>
                          {marginStatus !== 'ok' && (
                            <MarginBadge marginPercent={ch.profitMarginPercent} compact />
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50 dark:bg-[#161b22] border-t border-slate-200 dark:border-[#30363d] flex items-center justify-between text-xs text-slate-500 dark:text-[#8b949e]">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-sky-600 dark:text-[#58a6ff]" />
          <span>
            Haz clic en cualquier celda de precio para auditar la cascada financiera exacta de comisión, flete y margen neto.
          </span>
        </div>
        <span className="font-mono text-[11px]">
          Mostrando {filtered.length} de {results.length} productos
        </span>
      </div>
    </div>
  );
};
