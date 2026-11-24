import { describe, it, expect } from 'vitest';
import { getChannelMarginStatus, validateBatchMargins } from '../utils/marginValidator';
import { calculateProductPrices } from '../engine/pricingEngine';
import { MOCK_CATALOG } from '../data/mockCatalog';

describe('marginValidator', () => {
  it('clasifica correctamente critical, warning y ok', () => {
    expect(getChannelMarginStatus(2.5)).toBe('critical');
    expect(getChannelMarginStatus(3.0)).toBe('warning');
    expect(getChannelMarginStatus(7.9)).toBe('warning');
    expect(getChannelMarginStatus(8.0)).toBe('ok');
    expect(getChannelMarginStatus(15.2)).toBe('ok');
  });

  it('detecta desfase de TC cuando BCRP supera en más de 2% al TC del producto', () => {
    const zelda = MOCK_CATALOG[0]; // tc = 3.45
    const result = calculateProductPrices(zelda);
    const summary = validateBatchMargins([result], { bcrpSellRate: 3.78 });

    const tcAlerts = summary.alerts.filter((a) => a.code === 'TC_DRIFT');
    expect(tcAlerts.length).toBe(1);
    expect(tcAlerts[0].level).toBe('info');
    expect(tcAlerts[0].sku).toBe('GC00001');
  });

  it('no genera alerta de desfase de TC cuando la diferencia es menor al 2%', () => {
    const paperMario = MOCK_CATALOG[1]; // tc = 3.80
    const result = calculateProductPrices(paperMario);
    const summary = validateBatchMargins([result], { bcrpSellRate: 3.82 });

    const tcAlerts = summary.alerts.filter((a) => a.code === 'TC_DRIFT');
    expect(tcAlerts.length).toBe(0);
  });
});
