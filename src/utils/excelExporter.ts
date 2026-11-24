import ExcelJS from 'exceljs';
import { MarketplaceId, ProductPricingResult } from '../types';
import { MARKETPLACES } from '../config/marketplaces';

/**
 * Exporta el catálogo cotizado a un archivo Excel (.xlsx) profesional con formato empresarial:
 * - Hoja 1: Precios de Venta por Canal con monedas formateadas y paneles inmovilizados.
 * - Hoja 2: Matriz de Márgenes Netos con semáforo de colores (crítico, ajustado, saludable).
 * - Hoja 3: Resumen Ejecutivo con KPIs y fecha de emisión.
 */
export async function exportPricingToExcel(
  results: ProductPricingResult[],
  fileName: string = `cotizacion_marketplaces_${new Date().toISOString().slice(0, 10)}.xlsx`
): Promise<void> {
  if (!results.length) return;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Game Center - OmniChannel Pricing Engine';
  workbook.lastModifiedBy = 'OmniChannel Engine v2.0';
  workbook.created = new Date();
  workbook.modified = new Date();

  // ==========================================
  // HOJA 1: PRECIOS POR CANAL
  // ==========================================
  const wsPrices = workbook.addWorksheet('Precios por Canal', {
    views: [{ state: 'frozen', xSplit: 2, ySplit: 1 }], // Inmoviliza encabezado y columnas SKU/Nombre
  });

  wsPrices.columns = [
    { header: 'SKU', key: 'sku', width: 14 },
    { header: 'PRODUCTO', key: 'nombre', width: 38 },
    { header: 'CATEGORÍA', key: 'categoria', width: 18 },
    { header: 'SUBCATEGORÍA', key: 'subcategoria', width: 18 },
    { header: 'TC APLICADO', key: 'tc', width: 13 },
    { header: 'COSTO USD', key: 'costoUSD', width: 14 },
    { header: 'P. VENTA USD', key: 'precioVentaUSD', width: 15 },
    { header: 'COSTO PEN', key: 'costoSoles', width: 14 },
    ...MARKETPLACES.map((m) => ({
      header: m.displayName.toUpperCase(),
      key: m.id,
      width: 16,
    })),
  ];

  // Estilo para la fila de cabecera
  const headerRow = wsPrices.getRow(1);
  headerRow.height = 26;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' }, // Slate 800 corporativo
    };
    cell.font = {
      bold: true,
      color: { argb: 'FFFFFFFF' },
      size: 10,
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF334155' } },
      bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
      left: { style: 'thin', color: { argb: 'FF334155' } },
      right: { style: 'thin', color: { argb: 'FF334155' } },
    };
  });

  // Agregar filas de datos
  results.forEach((r, idx) => {
    const rowValues: Record<string, any> = {
      sku: r.product.sku,
      nombre: r.product.nombre,
      categoria: r.product.categoria,
      subcategoria: r.product.subcategoria,
      tc: Number(r.effectiveTC.toFixed(2)),
      costoUSD: Number(r.product.costoUSD.toFixed(2)),
      precioVentaUSD: Number((r.product.precioVentaUSD || 0).toFixed(2)),
      costoSoles: Number(r.costoSoles.toFixed(2)),
    };

    MARKETPLACES.forEach((m) => {
      const ch = r.channels[m.id as MarketplaceId];
      rowValues[m.id] = ch && ch.finalPrice > 0 ? Number(ch.finalPrice.toFixed(0)) : 0;
    });

    const row = wsPrices.addRow(rowValues);
    row.height = 20;

    // Fondo alternado cebra
    const isEven = idx % 2 === 0;
    const rowBg = isEven ? 'FFFFFFFF' : 'FFF8FAFC';

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: rowBg },
      };
      cell.font = { size: 9 };
      cell.alignment = { vertical: 'middle' };
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };

      // Formatos numéricos específicos
      if (colNumber === 1) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.font = { bold: true, size: 9, color: { argb: 'FF0284C7' } }; // Azul SKU
      } else if (colNumber === 5) {
        cell.numFmt = '0.00';
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else if (colNumber === 6 || colNumber === 7) {
        cell.numFmt = '"$"#,##0.00';
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
      } else if (colNumber >= 8) {
        cell.numFmt = '"S/"#,##0';
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        if (colNumber >= 9) {
          cell.font = { bold: true, size: 9 };
        }
      }
    });
  });

  // ==========================================
  // HOJA 2: AUDITORÍA DE MÁRGENES NETOS
  // ==========================================
  const wsMargins = workbook.addWorksheet('Auditoría de Márgenes', {
    views: [{ state: 'frozen', xSplit: 2, ySplit: 1 }],
  });

  wsMargins.columns = [
    { header: 'SKU', key: 'sku', width: 14 },
    { header: 'PRODUCTO', key: 'nombre', width: 38 },
    { header: 'COSTO USD', key: 'costoUSD', width: 14 },
    { header: 'TC', key: 'tc', width: 12 },
    ...MARKETPLACES.map((m) => ({
      header: `${m.displayName} (%)`,
      key: m.id,
      width: 16,
    })),
  ];

  const marginHeader = wsMargins.getRow(1);
  marginHeader.height = 26;
  marginHeader.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0F172A' },
    };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  results.forEach((r) => {
    const marginValues: Record<string, any> = {
      sku: r.product.sku,
      nombre: r.product.nombre,
      costoUSD: Number(r.product.costoUSD.toFixed(2)),
      tc: Number(r.effectiveTC.toFixed(2)),
    };

    MARKETPLACES.forEach((m) => {
      const ch = r.channels[m.id as MarketplaceId];
      marginValues[m.id] = ch ? Number((ch.profitMarginPercent / 100).toFixed(3)) : 0;
    });

    const row = wsMargins.addRow(marginValues);
    row.height = 20;

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };

      if (colNumber === 1) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.font = { bold: true, size: 9 };
      } else if (colNumber === 3) {
        cell.numFmt = '"$"#,##0.00';
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
      } else if (colNumber === 4) {
        cell.numFmt = '0.00';
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else if (colNumber >= 5) {
        cell.numFmt = '0.0%';
        cell.alignment = { vertical: 'middle', horizontal: 'center' };

        const marginVal = typeof cell.value === 'number' ? cell.value * 100 : 0;

        // Semáforo condicional de margen
        if (marginVal < 3) {
          // Crítico (<3%)
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFEE2E2' }, // Rojo suave
          };
          cell.font = { bold: true, color: { argb: 'FF991B1B' }, size: 9 };
        } else if (marginVal < 8) {
          // Bajo (3% - 8%)
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFEF3C7' }, // Amarillo suave
          };
          cell.font = { bold: true, color: { argb: 'FF92400E' }, size: 9 };
        } else {
          // Saludable (>=8%)
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD1FAE5' }, // Verde suave
          };
          cell.font = { bold: true, color: { argb: 'FF065F46' }, size: 9 };
        }
      }
    });
  });

  // ==========================================
  // HOJA 3: RESUMEN EJECUTIVO
  // ==========================================
  const wsSummary = workbook.addWorksheet('Resumen Ejecutivo');
  wsSummary.columns = [
    { header: 'MÉTRICA', key: 'metrica', width: 32 },
    { header: 'VALOR', key: 'valor', width: 28 },
  ];

  const sumHeader = wsSummary.getRow(1);
  sumHeader.height = 26;
  sumHeader.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' },
    };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
    cell.alignment = { vertical: 'middle', horizontal: 'left' };
  });

  let totalMargin = 0;
  let priceCount = 0;
  let criticalCount = 0;
  let lowCount = 0;
  let healthyCount = 0;
  let tcSum = 0;

  results.forEach((r) => {
    tcSum += r.effectiveTC;
    Object.values(r.channels).forEach((ch) => {
      if (ch && ch.finalPrice > 0) {
        totalMargin += ch.profitMarginPercent;
        priceCount++;
        if (ch.profitMarginPercent < 3) criticalCount++;
        else if (ch.profitMarginPercent < 8) lowCount++;
        else healthyCount++;
      }
    });
  });

  const avgMargin = priceCount > 0 ? (totalMargin / priceCount).toFixed(2) + '%' : '0.0%';
  const avgTC = (tcSum / (results.length || 1)).toFixed(3);

  const kpis = [
    ['Fecha de Generación', new Date().toLocaleString('es-PE')],
    ['Total SKUs Cotizados', results.length],
    ['Total Precios Generados (17 Marketplaces)', priceCount],
    ['Margen Neto Promedio Global', avgMargin],
    ['Tipo de Cambio Promedio Ponderado', `S/ ${avgTC}`],
    ['Precios Críticos (Margen < 3%)', `${criticalCount} (${((criticalCount / (priceCount || 1)) * 100).toFixed(1)}%)`],
    ['Precios con Margen Bajo (3% a 8%)', `${lowCount} (${((lowCount / (priceCount || 1)) * 100).toFixed(1)}%)`],
    ['Precios Saludables (Margen ≥ 8%)', `${healthyCount} (${((healthyCount / (priceCount || 1)) * 100).toFixed(1)}%)`],
    ['Motor de Cálculo', 'OmniChannel Pricing Engine v2.0 · Game Center'],
  ];

  kpis.forEach(([metrica, valor]) => {
    const row = wsSummary.addRow({ metrica, valor });
    row.height = 22;
    row.getCell(1).font = { bold: true, size: 9, color: { argb: 'FF334155' } };
    row.getCell(2).font = { size: 9 };
    row.getCell(1).border = { bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } } };
    row.getCell(2).border = { bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } } };
  });

  // Generar buffer y descargar archivo XLSX en el navegador
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
