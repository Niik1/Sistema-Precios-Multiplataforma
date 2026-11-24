/**
 * Normaliza cadenas de texto eliminando tildes, espacios redundantes y convirtiendo a mayúsculas.
 */
export function normalizeText(str?: string | null): string {
  if (!str) return '';
  return String(str)
    .toUpperCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Convierte cualquier valor a un número seguro, soportando formatos con coma o punto decimal.
 */
export function parseNumber(val: unknown, fallback: number = 0): number {
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  if (val === null || val === undefined || val === '') return fallback;
  const str = String(val).trim().replace(',', '.');
  const n = parseFloat(str);
  return isNaN(n) ? fallback : n;
}

/**
 * Redondeo monetario estándar a 2 decimales o entero según regla de e-commerce.
 */
export function roundCurrency(val: number): number {
  return Math.round(val);
}

/**
 * Formatea un número como soles peruanos (S/).
 */
export function formatPEN(val?: number | null): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return `S/ ${val.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
