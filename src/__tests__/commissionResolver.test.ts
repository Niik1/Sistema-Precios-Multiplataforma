import { describe, it, expect } from 'vitest';
import { resolveMarketplaceCommission } from '../engine/commissionResolver';
import { Product } from '../types';

describe('Commission Rules Engine Tests', () => {
  it('resuelve correctamente la comisión de un mando en Saga Falabella (15%)', () => {
    const product: Product = {
      sku: 'GC-001',
      nombre: 'MANDO INALAMBRICO DUALSENSE PS5 BLANCO',
      categoria: 'ACCESORIOS',
      subcategoria: 'PLAYSTATION',
      costoUSD: 50,
      margenUSD: 5,
      tc: 3.8,
      precioVentaUSD: 55,
    };
    const comision = resolveMarketplaceCommission('sagaFalabella', product);
    expect(comision).toBe(15);
  });

  it('resuelve correctamente la comisión de videojuegos en Mercado Libre (8%)', () => {
    const product: Product = {
      sku: 'GC-002',
      nombre: 'THE LEGEND OF ZELDA BREATH OF THE WILD SWITCH',
      categoria: 'VIDEOJUEGOS',
      subcategoria: 'NINTENDO',
      costoUSD: 40,
      margenUSD: 4,
      tc: 3.8,
      precioVentaUSD: 44,
    };
    const comision = resolveMarketplaceCommission('mercadoLibre', product);
    expect(comision).toBe(8);
  });

  it('resuelve correctamente la comisión de funkos en Mercado Libre (14%)', () => {
    const product: Product = {
      sku: 'GC-003',
      nombre: 'FUNKO POP ANIMATION DRAGON BALL Z GOKU',
      categoria: 'FUNKOS',
      subcategoria: 'ANIMATION',
      costoUSD: 10,
      margenUSD: 2,
      tc: 3.8,
      precioVentaUSD: 12,
    };
    const comision = resolveMarketplaceCommission('mercadoLibre', product);
    expect(comision).toBe(14);
  });

  it('aplica comisiones planas a canales fijos (Ripley 12%, Rappi 11%, Diners 13%)', () => {
    const product: Product = {
      sku: 'GC-004',
      nombre: 'SILLA GAMER CORSAIR T3 RUSH',
      categoria: 'SILLAS',
      subcategoria: 'GAMER',
      costoUSD: 200,
      margenUSD: 20,
      tc: 3.8,
      precioVentaUSD: 220,
    };
    expect(resolveMarketplaceCommission('ripley', product)).toBe(12);
    expect(resolveMarketplaceCommission('rappi', product)).toBe(11);
    expect(resolveMarketplaceCommission('diners', product)).toBe(13);
    expect(resolveMarketplaceCommission('calidda', product)).toBe(15);
  });

  it('resuelve correctamente comisiones de consolas en Falabella (8%)', () => {
    const product: Product = {
      sku: 'GC-005',
      nombre: 'CONSOLA PLAYSTATION 5 SLIM STANDARD 1TB',
      categoria: 'CONSOLAS',
      subcategoria: 'PLAYSTATION',
      costoUSD: 450,
      margenUSD: 30,
      tc: 3.8,
      precioVentaUSD: 480,
    };
    expect(resolveMarketplaceCommission('sagaFalabella', product)).toBe(8);
  });
});
