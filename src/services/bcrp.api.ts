export interface BCRPRateData {
  buyRate: number;
  sellRate: number;
  previousSellRate?: number;
  delta: number;
  dateLabel: string;
  fetchedAt: string;
  source: 'BCRP_OFICIAL' | 'FX_LIVE' | 'CACHE_FALLBACK';
}

const CACHE_KEY = 'gc_bcrp_rate_cache_v1';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hora

function readCache(): BCRPRateData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { timestamp: number; data: BCRPRateData };
    if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
      return parsed.data;
    }
    return null;
  } catch {
    return null;
  }
}

function readAnyCache(): BCRPRateData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { timestamp: number; data: BCRPRateData };
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache(data: BCRPRateData): void {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch {
    // Ignore storage quota errors
  }
}

async function fetchWithTimeout(url: string, timeoutMs = 4000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

/**
 * Obtiene el tipo de cambio en vivo intentando primero la API oficial del BCRP
 * (PD04637PD = Compra, PD04638PD = Venta) y haciendo fallback a open.er-api.com
 * en caso de restricciones CORS en navegador.
 */
export async function fetchLiveBCRPRate(forceRefresh = false): Promise<BCRPRateData> {
  if (!forceRefresh) {
    const cached = readCache();
    if (cached) return cached;
  }

  // 1. Intento directo a la API oficial del BCRP
  try {
    const bcrpUrl =
      'https://estadisticas.bcrp.gob.pe/estadisticas/series/api/PD04637PD-PD04638PD/json';
    const res = await fetchWithTimeout(bcrpUrl, 3500);
    if (res.ok) {
      const json = await res.json();
      const periods = json?.periods;
      if (Array.isArray(periods) && periods.length > 0) {
        const latest = periods[periods.length - 1];
        const prev = periods.length > 1 ? periods[periods.length - 2] : null;

        const buy = parseFloat(latest.values?.[0]);
        const sell = parseFloat(latest.values?.[1]);
        const prevSell = prev ? parseFloat(prev.values?.[1]) : sell;

        if (!isNaN(sell) && sell > 0) {
          const data: BCRPRateData = {
            buyRate: !isNaN(buy) && buy > 0 ? buy : Number((sell - 0.03).toFixed(3)),
            sellRate: Number(sell.toFixed(3)),
            previousSellRate: !isNaN(prevSell) ? Number(prevSell.toFixed(3)) : undefined,
            delta: !isNaN(prevSell) ? Number((sell - prevSell).toFixed(3)) : 0,
            dateLabel: latest.name || new Date().toLocaleDateString('es-PE'),
            fetchedAt: new Date().toISOString(),
            source: 'BCRP_OFICIAL',
          };
          writeCache(data);
          return data;
        }
      }
    }
  } catch {
    // CORS o timeout de BCRP: continuamos al fallback en vivo
  }

  // 2. Fallback a ExchangeRate-API pública (sin API key, con CORS habilitado)
  try {
    const fxRes = await fetchWithTimeout('https://open.er-api.com/v6/latest/USD', 4000);
    if (fxRes.ok) {
      const fxJson = await fxRes.json();
      const pen = Number(fxJson?.rates?.PEN);
      if (!isNaN(pen) && pen > 0) {
        const sellRate = Number(pen.toFixed(3));
        const buyRate = Number((pen - 0.025).toFixed(3));
        const prevCache = readAnyCache();
        const prevSell = prevCache?.sellRate ?? sellRate;

        const data: BCRPRateData = {
          buyRate,
          sellRate,
          previousSellRate: prevSell,
          delta: Number((sellRate - prevSell).toFixed(3)),
          dateLabel: new Date().toLocaleDateString('es-PE'),
          fetchedAt: new Date().toISOString(),
          source: 'FX_LIVE',
        };
        writeCache(data);
        return data;
      }
    }
  } catch {
    // Sin conexión
  }

  // 3. Fallback a último caché o valor de referencia
  const stale = readAnyCache();
  if (stale) {
    return { ...stale, source: 'CACHE_FALLBACK' };
  }

  return {
    buyRate: 3.76,
    sellRate: 3.79,
    delta: 0,
    dateLabel: new Date().toLocaleDateString('es-PE'),
    fetchedAt: new Date().toISOString(),
    source: 'CACHE_FALLBACK',
  };
}
