import { MarketplaceId, ProductPricingResult } from '../types';

export type AlertLevel = 'critical' | 'warning' | 'info';

export type AlertCode =
  | 'MARGIN_CRITICAL'
  | 'MARGIN_LOW'
  | 'TC_DRIFT';

export interface MarginAlert {
  id: string;
  sku: string;
  productName: string;
  channelId?: MarketplaceId;
  channelName?: string;
  level: AlertLevel;
  code: AlertCode;
  message: string;
  profitMarginPercent?: number;
  profitPEN?: number;
}

export interface MarginValidationSummary {
  alerts: MarginAlert[];
  counts: {
    critical: number;
    warning: number;
    info: number;
    total: number;
  };
}

export function getChannelMarginStatus(
  profitMarginPercent: number,
  minMarginPct = 8,
  criticalMarginPct = 3
): 'critical' | 'warning' | 'ok' {
  if (profitMarginPercent < criticalMarginPct) return 'critical';
  if (profitMarginPercent < minMarginPct) return 'warning';
  return 'ok';
}

export function validateBatchMargins(
  results: ProductPricingResult[],
  options: {
    bcrpSellRate?: number;
    minMarginPct?: number;
    criticalMarginPct?: number;
  } = {}
): MarginValidationSummary {
  const minMargin = options.minMarginPct ?? 8;
  const criticalMargin = options.criticalMarginPct ?? 3;
  const alerts: MarginAlert[] = [];

  for (const res of results) {
    const { product, effectiveTC, channels } = res;

    // 1. Verificar desfase de TC respecto al BCRP (> 2%)
    if (options.bcrpSellRate && effectiveTC > 0) {
      const diffPct = ((options.bcrpSellRate - effectiveTC) / effectiveTC) * 100;
      if (diffPct > 2) {
        alerts.push({
          id: `${product.sku}-tc-drift`,
          sku: product.sku,
          productName: product.nombre,
          level: 'info',
          code: 'TC_DRIFT',
          message: `TC del producto (S/ ${effectiveTC.toFixed(2)}) está ${diffPct.toFixed(1)}% debajo del TC mercado hoy (S/ ${options.bcrpSellRate.toFixed(2)})`,
        });
      }
    }

    // 2. Verificar margen por cada canal
    for (const ch of Object.values(channels)) {
      if (!ch || ch.finalPrice <= 0) continue;

      const status = getChannelMarginStatus(
        ch.profitMarginPercent,
        minMargin,
        criticalMargin
      );

      if (status === 'critical') {
        alerts.push({
          id: `${product.sku}-${ch.channelId}-critical`,
          sku: product.sku,
          productName: product.nombre,
          channelId: ch.channelId,
          channelName: ch.channelName,
          level: 'critical',
          code: 'MARGIN_CRITICAL',
          message: `${ch.channelName}: Margen ${ch.profitMarginPercent.toFixed(1)}% (< ${criticalMargin}%) — Precio no rentable`,
          profitMarginPercent: ch.profitMarginPercent,
          profitPEN: ch.profitPEN,
        });
      } else if (status === 'warning') {
        alerts.push({
          id: `${product.sku}-${ch.channelId}-warning`,
          sku: product.sku,
          productName: product.nombre,
          channelId: ch.channelId,
          channelName: ch.channelName,
          level: 'warning',
          code: 'MARGIN_LOW',
          message: `${ch.channelName}: Margen ${ch.profitMarginPercent.toFixed(1)}% — Debajo del mínimo (${minMargin}%)`,
          profitMarginPercent: ch.profitMarginPercent,
          profitPEN: ch.profitPEN,
        });
      }
    }
  }

  // Ordenar: críticos primero, luego warnings, luego info
  const priority: Record<AlertLevel, number> = { critical: 0, warning: 1, info: 2 };
  alerts.sort((a, b) => priority[a.level] - priority[b.level]);

  const counts = {
    critical: alerts.filter((a) => a.level === 'critical').length,
    warning: alerts.filter((a) => a.level === 'warning').length,
    info: alerts.filter((a) => a.level === 'info').length,
    total: alerts.length,
  };

  return { alerts, counts };
}
