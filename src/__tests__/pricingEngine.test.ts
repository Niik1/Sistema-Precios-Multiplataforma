import { describe, it, expect } from 'vitest';
import { ajustarPrecioUltimoDigito } from '../engine/ajusteUltimoDigito';
import { calculateProductPrices } from '../engine/pricingEngine';
import { MOCK_CATALOG } from '../data/mockCatalog';

describe('Regla de Oro Game Center: Terminación en 5 o 9', () => {
  it('aplica los redondeos exactos exigidos por el negocio', () => {
    expect(ajustarPrecioUltimoDigito(177)).toBe(179);
    expect(ajustarPrecioUltimoDigito(193)).toBe(195);
    expect(ajustarPrecioUltimoDigito(171)).toBe(169);
    expect(ajustarPrecioUltimoDigito(170)).toBe(169);
    expect(ajustarPrecioUltimoDigito(172)).toBe(175);
    expect(ajustarPrecioUltimoDigito(175)).toBe(175);
    expect(ajustarPrecioUltimoDigito(176)).toBe(175);
    expect(ajustarPrecioUltimoDigito(178)).toBe(179);
    expect(ajustarPrecioUltimoDigito(179)).toBe(179);
  });
});

describe('Validación Exacta contra Screenshot del Sistema Original (GC00001 - Zelda)', () => {
  const zelda = MOCK_CATALOG.find((p) => p.sku === 'GC00001')!;

  it('calcula los precios exactos de Zelda en todos los canales', () => {
    const res = calculateProductPrices(zelda);

    // Verificaciones exactas contra la captura de pantalla del usuario:
    expect(res.channels.sagaFalabella.finalPrice).toBe(179);
    expect(res.channels.mercadoLibre.finalPrice).toBe(175);
    expect(res.channels.ripley.finalPrice).toBe(189);
    expect(res.channels.paginaWeb.finalPrice).toBe(169);
    expect(res.channels.questTime.finalPrice).toBe(169);
    expect(res.channels.diners.finalPrice).toBe(185);
    expect(res.channels.luxury.finalPrice).toBe(189);
    expect(res.channels.coolbox.finalPrice).toBe(185);
    expect(res.channels.efe.finalPrice).toBe(156.49);
  });
});

describe('Validación Exacta contra Screenshot del Sistema Original (GC00002 - Paper Mario)', () => {
  const mario = MOCK_CATALOG.find((p) => p.sku === 'GC00002')!;

  it('calcula los precios exactos de Paper Mario en todos los canales', () => {
    const res = calculateProductPrices(mario);

    // Verificaciones exactas contra la captura de pantalla:
    expect(res.channels.sagaFalabella.finalPrice).toBe(175);
    expect(res.channels.rappi.finalPrice).toBe(169);
    expect(res.channels.efe.finalPrice).toBe(152.78);
  });
});
