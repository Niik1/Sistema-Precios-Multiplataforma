import {
  ChannelPricingBreakdown,
  MarketplaceId,
  Product,
  ProductPricingResult,
} from '../types';
import { MARKETPLACES } from '../config/marketplaces';
import { resolveMarketplaceCommission } from './commissionResolver';
import { ajustarPrecioUltimoDigito } from './ajusteUltimoDigito';
import { normalizeText, parseNumber } from '../utils/normalizer';

// ==========================================
// 1. VIDEOJUEGOS (Logica_videojuegos.gs)
// ==========================================
function calcVideojuegos(
  costoSoles: number,
  comisiones: Record<MarketplaceId, number>
): Record<MarketplaceId, { finalPrice: number; shippingFee: number; grossR1: number }> {
  const extrasGrupo1: Partial<Record<MarketplaceId, number>> = {
    diners: 11.5,
    claro: 12,
    ripley: 15,
    calidda: 15,
    rappi: 2,
    sagaFalabella: 7,
    paginaWeb: 4,
    questTime: 4,
    mesajil: 5,
  };

  const results: Partial<Record<MarketplaceId, { finalPrice: number; shippingFee: number; grossR1: number }>> = {};

  for (const m of MARKETPLACES) {
    if (m.id === 'efe') continue;
    const porc = comisiones[m.id];
    const factor = 1 - porc / 100;
    if (factor <= 0) continue;

    let r1 = costoSoles / factor;
    let shipping = 0;

    if (extrasGrupo1[m.id] !== undefined) {
      shipping = extrasGrupo1[m.id]!;
      r1 += shipping;
    } else if (m.id === 'luxury' || m.id === 'shopstar') {
      shipping = r1 > 63 ? 12 : m.id === 'luxury' ? 10 : 11;
      r1 += shipping;
    } else if (m.id === 'yape') {
      shipping = r1 > 49 ? 3.5 : 3.0;
      r1 += shipping;
    } else if (m.id === 'intercorp') {
      shipping = r1 > 49 ? 9.5 : 9.0;
      r1 += shipping;
    } else if (m.id === 'mercadoLibre') {
      shipping = r1 > 45 ? 6.9 : 0;
      r1 += shipping;
    } else if (m.id === 'juntoz') {
      shipping = r1 > 39 ? 8 : 4;
      r1 += shipping;
    }

    const redondeado = Math.round(r1);
    const finalPrice = ajustarPrecioUltimoDigito(redondeado);
    results[m.id] = { finalPrice, shippingFee: shipping, grossR1: r1 - shipping };
  }

  return results as Record<MarketplaceId, { finalPrice: number; shippingFee: number; grossR1: number }>;
}

// ==========================================
// 2. ACCESORIOS (Logica_accesorios.gs)
// ==========================================
function calcAccesorios(
  costoSoles: number,
  comisiones: Record<MarketplaceId, number>,
  isZonaGamer: boolean
): Record<MarketplaceId, { finalPrice: number; shippingFee: number; grossR1: number }> {
  const results: Partial<Record<MarketplaceId, { finalPrice: number; shippingFee: number; grossR1: number }>> = {};

  for (const m of MARKETPLACES) {
    if (m.id === 'efe') continue;
    const porc = comisiones[m.id];
    const factor = 1 - porc / 100;
    if (factor <= 0) continue;

    const r1 = costoSoles / factor;
    let extra = 0;

    if (isZonaGamer) {
      // AJUSTES_ZONA_GAMER
      if (m.id === 'ripley') extra = 16;
      else if (m.id === 'calidda') extra = 15;
      else if (m.id === 'claro') extra = 12;
      else if (m.id === 'diners') extra = 11;
      else if (m.id === 'mesajil') extra = 5;
      else if (m.id === 'sagaFalabella') extra = 7;
      else if (m.id === 'coolbox') extra = 2;
      else if (m.id === 'questTime' || m.id === 'paginaWeb') extra = 4;
      else if (m.id === 'rappi') extra = r1 > 77 ? 2.9 : 2.0;
      else if (m.id === 'shopstar') extra = r1 > 49 ? 12 : 11;
      else if (m.id === 'intercorp') extra = r1 > 49 ? 13 : 12;
      else if (m.id === 'mercadoLibre') extra = r1 > 49 ? 9.5 : 9.0;
      else if (m.id === 'luxury') extra = r1 > 39 ? 6.9 : 3.0;
      else if (m.id === 'yape') extra = r1 > 57 ? 3.5 : 3.0;
      else if (m.id === 'juntoz') extra = r1 > 39 ? 8 : 4;
    } else {
      // AJUSTES_ACCESORIOS estándar
      if (m.id === 'questTime' || m.id === 'paginaWeb') extra = 4;
      else if (m.id === 'sagaFalabella') extra = 7;
      else if (m.id === 'shopstar') extra = 12;
      else if (m.id === 'luxury') extra = 10;
      else if (m.id === 'ripley') extra = 15;
      else if (m.id === 'coolbox') extra = 0;
      else if (m.id === 'calidda') extra = 15;
      else if (m.id === 'claro') extra = 12;
      else if (m.id === 'mesajil') extra = 5;
      else if (m.id === 'rappi') extra = 2;
      else if (m.id === 'diners') extra = 11.5;
      else if (m.id === 'yape') extra = r1 > 49 ? 3.5 : 3.0;
      else if (m.id === 'intercorp') extra = r1 > 49 ? 13 : 12;
      else if (m.id === 'mercadoLibre') extra = r1 > 39 ? 6.9 : 3.0;
      else if (m.id === 'juntoz') extra = r1 > 39 ? 8 : 4;
    }

    const r2 = r1 + extra;
    const finalPrice = ajustarPrecioUltimoDigito(Math.round(r2));
    results[m.id] = { finalPrice, shippingFee: extra, grossR1: r1 };
  }

  return results as Record<MarketplaceId, { finalPrice: number; shippingFee: number; grossR1: number }>;
}

// ==========================================
// 3. CONSOLAS (Logica_consolas.gs)
// ==========================================
function calcConsolas(
  precioBaseSoles: number,
  comisiones: Record<MarketplaceId, number>
): Record<MarketplaceId, { finalPrice: number; shippingFee: number; grossR1: number }> {
  const valoresGrupo2: Partial<Record<MarketplaceId, number>> = {
    intercorp: 22,
    shopstar: 25,
    ripley: 15,
    juntoz: 10,
    luxury: 11,
    calidda: 30,
    claro: 10,
    sagaFalabella: 10,
    diners: 10,
    yape: 0,
    mesajil: 5,
  };

  const results: Partial<Record<MarketplaceId, { finalPrice: number; shippingFee: number; grossR1: number }>> = {};

  for (const m of MARKETPLACES) {
    if (m.id === 'efe') continue;
    const porc = comisiones[m.id];
    const factor = 1 - porc / 100;
    if (factor <= 0) continue;

    if (m.id === 'mercadoLibre') {
      // Grupo 1: base = precioBaseSoles + 10; luego base / factor
      const base = precioBaseSoles + 10;
      const bruto = base / factor;
      const finalPrice = ajustarPrecioUltimoDigito(Math.round(bruto));
      results[m.id] = { finalPrice, shippingFee: 10, grossR1: bruto - 10 };
    } else if (valoresGrupo2[m.id] !== undefined) {
      // Grupo 2: (precioBaseSoles / factor) + extra
      const r1 = precioBaseSoles / factor;
      const shipping = valoresGrupo2[m.id]!;
      const finalPrice = ajustarPrecioUltimoDigito(Math.round(r1 + shipping));
      results[m.id] = { finalPrice, shippingFee: shipping, grossR1: r1 };
    } else {
      // Grupo 3: rappi, paginaWeb, questTime, coolbox (sin extra)
      const bruto = precioBaseSoles / factor;
      const finalPrice = ajustarPrecioUltimoDigito(Math.round(bruto));
      results[m.id] = { finalPrice, shippingFee: 0, grossR1: bruto };
    }
  }

  return results as Record<MarketplaceId, { finalPrice: number; shippingFee: number; grossR1: number }>;
}

// ==========================================
// 4. SILLAS (Logica_sillas.gs)
// ==========================================
function calcSillas(
  precioCosto: number,
  comisiones: Record<MarketplaceId, number>
): Record<MarketplaceId, { finalPrice: number; shippingFee: number; grossR1: number }> {
  const valorEnvio: Record<MarketplaceId, number> = {
    questTime: 0,
    paginaWeb: 0,
    mercadoLibre: 60,
    sagaFalabella: 40,
    juntoz: 40,
    intercorp: 50,
    shopstar: 50,
    ripley: 80,
    rappi: 30,
    diners: 40,
    luxury: 50,
    coolbox: 40,
    calidda: 80,
    claro: 60,
    mesajil: 40,
    yape: 60,
    efe: 0,
  };

  const results: Partial<Record<MarketplaceId, { finalPrice: number; shippingFee: number; grossR1: number }>> = {};

  for (const m of MARKETPLACES) {
    if (m.id === 'efe') continue;
    const porc = comisiones[m.id];
    const factor = 1 - porc / 100;
    if (factor <= 0) continue;

    const r1 = precioCosto / factor;
    const shipping = valorEnvio[m.id] || 0;
    const finalPrice = ajustarPrecioUltimoDigito(Math.round(r1 + shipping));
    results[m.id] = { finalPrice, shippingFee: shipping, grossR1: r1 };
  }

  return results as Record<MarketplaceId, { finalPrice: number; shippingFee: number; grossR1: number }>;
}

// ==========================================
// 5. FUNKOS Y GIFTCARDS (Envío 0)
// ==========================================
function calcSinEnvio(
  precioCosto: number,
  comisiones: Record<MarketplaceId, number>
): Record<MarketplaceId, { finalPrice: number; shippingFee: number; grossR1: number }> {
  const results: Partial<Record<MarketplaceId, { finalPrice: number; shippingFee: number; grossR1: number }>> = {};

  for (const m of MARKETPLACES) {
    if (m.id === 'efe') continue;
    const porc = comisiones[m.id];
    const factor = 1 - porc / 100;
    if (factor <= 0) continue;

    const r1 = precioCosto / factor;
    const finalPrice = ajustarPrecioUltimoDigito(Math.round(r1));
    results[m.id] = { finalPrice, shippingFee: 0, grossR1: r1 };
  }

  return results as Record<MarketplaceId, { finalPrice: number; shippingFee: number; grossR1: number }>;
}

// ==========================================
// 6. EFE (Logica_efe.gs)
// ==========================================
function calcEfe(product: Product, tc: number): { finalPrice: number; netPEN: number } {
  const costoUSD = parseNumber(product.costoUSD);
  const margenUSD = parseNumber(product.margenUSD);
  const cat = normalizeText(product.categoria);

  let precioBase = (costoUSD + margenUSD) * tc;

  if (product.tipo === 'COMBO' && product.cantAsc) {
    precioBase *= product.cantAsc;
  }

  let finalPrice: number;
  if (cat === 'VIDEOJUEGAMES' || cat === 'VIDEOJUEGOS') {
    // Videojuegos: No se quita IGV, solo detracción 3% (/ 0.97)
    finalPrice = Number((precioBase / 0.97).toFixed(2));
  } else {
    // Todo lo demás: sin IGV (/ 1.18) y luego / 0.97
    finalPrice = Number(((precioBase / 1.18) / 0.97).toFixed(2));
  }

  return { finalPrice, netPEN: finalPrice };
}

// ==========================================
// ORQUESTADOR PRINCIPAL
// ==========================================
export function calculateProductPrices(
  product: Product,
  customTC?: number
): ProductPricingResult {
  const tc = customTC ?? product.tc ?? 3.8;
  const precioVentaUSD = parseNumber(product.precioVentaUSD || product.costoUSD + product.margenUSD);
  const costoSoles = precioVentaUSD * tc;
  const precioBaseSoles = (parseNumber(product.costoUSD) + parseNumber(product.margenUSD)) * tc;

  const cat = normalizeText(product.categoria);
  const sub = normalizeText(product.subcategoria);

  // 1. Resuelve las comisiones
  const comisiones: Partial<Record<MarketplaceId, number>> = {};
  for (const m of MARKETPLACES) {
    comisiones[m.id] = resolveMarketplaceCommission(m.id, product);
  }

  // 2. Ejecuta la lógica exacta según la categoría
  let calculatedMap: Record<MarketplaceId, { finalPrice: number; shippingFee: number; grossR1: number }>;

  if (cat.includes('ACCESORIO') && sub.includes('ZONA GAMER')) {
    calculatedMap = calcAccesorios(costoSoles, comisiones as Record<MarketplaceId, number>, true);
  } else if (cat.includes('ACCESORIO')) {
    calculatedMap = calcAccesorios(costoSoles, comisiones as Record<MarketplaceId, number>, false);
  } else if (cat.includes('CONSOLA')) {
    calculatedMap = calcConsolas(costoSoles, comisiones as Record<MarketplaceId, number>);
  } else if (cat.includes('VIDEOJUEGO')) {
    calculatedMap = calcVideojuegos(costoSoles, comisiones as Record<MarketplaceId, number>);
  } else if (cat.includes('SILLA')) {
    calculatedMap = calcSillas(costoSoles, comisiones as Record<MarketplaceId, number>);
  } else if (cat.includes('FUNKO') || cat.includes('GIFCARD')) {
    calculatedMap = calcSinEnvio(costoSoles, comisiones as Record<MarketplaceId, number>);
  } else {
    calculatedMap = calcAccesorios(costoSoles, comisiones as Record<MarketplaceId, number>, false);
  }

  // 3. EFE se calcula aparte
  const efeCalc = calcEfe(product, tc);
  const realCostPEN =
    parseNumber(product.costoUSD) *
    tc *
    (product.tipo === 'COMBO' && product.cantAsc ? product.cantAsc : 1);

  const channels: Partial<Record<MarketplaceId, ChannelPricingBreakdown>> = {};

  for (const m of MARKETPLACES) {
    if (m.id === 'efe') {
      const profitPEN = efeCalc.finalPrice - realCostPEN;
      channels.efe = {
        channelId: 'efe',
        channelName: m.displayName,
        costoSoles: realCostPEN,
        commissionPercentage: 0,
        grossResult1: efeCalc.finalPrice,
        shippingFee: 0,
        finalPrice: efeCalc.finalPrice,
        commissionAmountPEN: 0,
        netRevenuePEN: efeCalc.finalPrice,
        profitPEN,
        profitMarginPercent: efeCalc.finalPrice > 0 ? (profitPEN / efeCalc.finalPrice) * 100 : 0,
      };
      continue;
    }

    const res = calculatedMap[m.id];
    const commPct = comisiones[m.id] ?? 12;
    const finalPrice = res ? res.finalPrice : 0;
    const shippingFee = res ? res.shippingFee : 0;
    const grossR1 = res ? res.grossR1 : 0;

    const commissionAmountPEN = finalPrice * (commPct / 100);
    const netRevenuePEN = finalPrice - commissionAmountPEN - shippingFee;
    const profitPEN = netRevenuePEN - realCostPEN;
    const profitMarginPercent = finalPrice > 0 ? (profitPEN / finalPrice) * 100 : 0;

    channels[m.id] = {
      channelId: m.id,
      channelName: m.displayName,
      costoSoles: realCostPEN,
      commissionPercentage: commPct,
      grossResult1: grossR1,
      shippingFee,
      finalPrice,
      commissionAmountPEN,
      netRevenuePEN,
      profitPEN,
      profitMarginPercent,
    };
  }

  return {
    product,
    effectiveTC: tc,
    costoSoles,
    precioBaseSoles,
    channels: channels as Record<MarketplaceId, ChannelPricingBreakdown>,
  };
}

export function calculateBatchPrices(
  products: Product[],
  customTC?: number
): ProductPricingResult[] {
  return products.map((p) => calculateProductPrices(p, customTC));
}
