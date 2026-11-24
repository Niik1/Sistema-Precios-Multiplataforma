import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import {
  MarginAlert,
  MarginValidationSummary,
} from '../utils/marginValidator';
import { ChannelPricingBreakdown, MarketplaceId, Product, ProductPricingResult } from '../types';

interface AlertsPanelProps {
  summary: MarginValidationSummary;
  results: ProductPricingResult[];
  onInspectChannel: (breakdown: ChannelPricingBreakdown, product: Product) => void;
}

interface GroupedAlertItem {
  sku: string;
  productName: string;
  criticalChannels: MarginAlert[];
  warningChannels: MarginAlert[];
  infoAlerts: MarginAlert[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  summary,
  results,
  onInspectChannel,
}) => {
  // Por defecto COLAPSADO para no abrumar la pantalla
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'critical' | 'all'>('critical');

  const { alerts, counts } = summary;

  // Agrupamiento inteligente por SKU (debe ejecutarse SIEMPRE antes de cualquier return condicional)
  const groupedBySku = useMemo(() => {
    if (results.length === 0) return [];
    const map = new Map<string, GroupedAlertItem>();

    for (const a of alerts) {
      if (!map.has(a.sku)) {
        map.set(a.sku, {
          sku: a.sku,
          productName: a.productName,
          criticalChannels: [],
          warningChannels: [],
          infoAlerts: [],
        });
      }
      const item = map.get(a.sku)!;
      if (a.level === 'critical') item.criticalChannels.push(a);
      else if (a.level === 'warning') item.warningChannels.push(a);
      else item.infoAlerts.push(a);
    }

    return Array.from(map.values());
  }, [alerts, results.length]);

  const itemsToDisplay = useMemo(() => {
    if (activeTab === 'critical') {
      return groupedBySku.filter((g) => g.criticalChannels.length > 0);
    }
    return groupedBySku;
  }, [groupedBySku, activeTab]);

  if (results.length === 0) return null;

  if (counts.total === 0) {
    return (
      <div className="bg-emerald-50 dark:bg-[#39d353]/10 border border-emerald-200 dark:border-[#39d353]/30 rounded-xl px-4 py-3 mb-5 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-[#39d353]">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span className="font-semibold">
          Todos los canales calculados cumplen el margen mínimo empresarial (≥ 8%) y sin desfases de TC.
        </span>
      </div>
    );
  }

  const handleOpenChannel = (sku: string, channelId?: MarketplaceId) => {
    if (!channelId) return;
    const found = results.find((r) => r.product.sku === sku);
    if (!found) return;
    const ch = found.channels[channelId];
    if (ch) onInspectChannel(ch, found.product);
  };

  return (
    <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-xl mb-5 overflow-hidden shadow-sm transition-all">
      {/* Barra de Resumen Compacta */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 dark:bg-[#1c2330]/70">
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-2 text-left"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-500/10 text-amber-600 dark:text-[#d29922]">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-white">
            Monitoreo Financiero:
          </span>

          <div className="flex items-center gap-1.5">
            {counts.critical > 0 ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-[#f85149] border border-rose-500/30">
                {counts.critical} Crítica{counts.critical > 1 ? 's' : ''} (&lt;3%)
              </span>
            ) : null}

            {counts.warning > 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-[#d29922] border border-amber-500/30">
                {counts.warning} Margen bajo (3%-8%)
              </span>
            )}
          </div>
        </button>

        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <span>{isExpanded ? 'Ocultar panel' : 'Ver detalle agrupado'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Contenido Desplegable: Agrupado por Producto */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-200 dark:border-[#30363d] space-y-3 bg-slate-50/40 dark:bg-[#0d1117]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('critical')}
                className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === 'critical'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 dark:bg-[#21262d] text-slate-600 dark:text-[#8b949e] hover:text-slate-900'
                }`}
              >
                Solo Críticos ({groupedBySku.filter((g) => g.criticalChannels.length > 0).length} SKUs)
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === 'all'
                    ? 'bg-slate-800 text-white dark:bg-[#58a6ff] dark:text-[#0d1117]'
                    : 'bg-slate-100 dark:bg-[#21262d] text-slate-600 dark:text-[#8b949e] hover:text-slate-900'
                }`}
              >
                Todos los afectados ({groupedBySku.length} SKUs)
              </button>
            </div>
            <span className="text-[11px] text-slate-400">
              Clic en cualquier canal para auditar
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {itemsToDisplay.map((item) => (
              <div
                key={item.sku}
                className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#30363d] rounded-lg p-3 text-xs shadow-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono font-bold text-sky-600 dark:text-[#58a6ff]">
                      {item.sku}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]" title={item.productName}>
                      {item.productName}
                    </span>
                  </div>
                </div>

                {/* Chips de Canales Críticos */}
                {item.criticalChannels.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="text-[10px] font-bold text-rose-600 dark:text-[#f85149] uppercase">
                      Crítico:
                    </span>
                    {item.criticalChannels.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleOpenChannel(item.sku, c.channelId)}
                        className="inline-flex items-center gap-1 font-mono text-[10px] font-bold bg-rose-50 dark:bg-[#f85149]/15 text-rose-700 dark:text-[#f85149] border border-rose-300 dark:border-[#f85149]/30 px-1.5 py-0.5 rounded hover:bg-rose-100 transition-colors"
                      >
                        <span>{c.channelName}</span>
                        <span>{c.profitMarginPercent?.toFixed(1)}%</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Chips de Canales con Margen Bajo */}
                {activeTab === 'all' && item.warningChannels.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-[#d29922] uppercase">
                      Bajo:
                    </span>
                    {item.warningChannels.slice(0, 5).map((w) => (
                      <button
                        key={w.id}
                        onClick={() => handleOpenChannel(item.sku, w.channelId)}
                        className="inline-flex items-center gap-1 font-mono text-[10px] font-medium bg-amber-50 dark:bg-[#d29922]/15 text-amber-800 dark:text-[#d29922] border border-amber-300 dark:border-[#d29922]/30 px-1.5 py-0.5 rounded hover:bg-amber-100 transition-colors"
                      >
                        <span>{w.channelName}</span>
                        <span>{w.profitMarginPercent?.toFixed(1)}%</span>
                      </button>
                    ))}
                    {item.warningChannels.length > 5 && (
                      <span className="text-[10px] text-slate-400">
                        +{item.warningChannels.length - 5} más
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
