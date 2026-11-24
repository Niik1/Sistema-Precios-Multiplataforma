import { MarketplaceId, ProductPricingResult } from '../types';
import { MARKETPLACES } from '../config/marketplaces';

export function exportPricingToCSV(
  results: ProductPricingResult[],
  fileName: string = 'precios_marketplaces.csv'
): void {
  if (!results.length) return;

  const header = [
    'SKU',
    'NOMBRE',
    'CATEGORIA',
    'SUBCATEGORIA',
    'TC',
    'COSTO_USD',
    'PRECIO_VENTA_USD',
    'COSTO_SOLES',
    ...MARKETPLACES.map((m) => m.displayName),
  ];

  const rows = results.map((r) => {
    return [
      r.product.sku,
      r.product.nombre,
      r.product.categoria,
      r.product.subcategoria,
      r.effectiveTC.toFixed(2),
      r.product.costoUSD.toFixed(2),
      r.product.precioVentaUSD.toFixed(2),
      r.costoSoles.toFixed(2),
      ...MARKETPLACES.map((m) => {
        const ch = r.channels[m.id as MarketplaceId];
        return ch ? ch.finalPrice.toFixed(0) : '0';
      }),
    ];
  });

  const csvContent = [header, ...rows]
    .map((row) =>
      row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')
    )
    .join('\n');

  // \uFEFF añade BOM UTF-8 para que Excel abra acentos y eñes correctamente sin corromperse
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
