/**
 * Regla de Oro Game Center:
 * El precio de publicación siempre termina en 5 o en 9.
 * 
 * Ejemplos:
 * 170 -> 169
 * 171 -> 169
 * 172 -> 175
 * 173 -> 175
 * 174 -> 175
 * 175 -> 175
 * 176 -> 175
 * 177 -> 179
 * 178 -> 179
 * 179 -> 179
 */
export function ajustarPrecioUltimoDigito(precio: number): number {
  const d = Math.abs(precio) % 10;
  switch (d) {
    case 0: return precio - 1; // 170 -> 169
    case 1: return precio - 2; // 171 -> 169
    case 2: return precio + 3; // 172 -> 175
    case 3: return precio + 2; // 173 -> 175
    case 4: return precio + 1; // 174 -> 175
    case 5: return precio;     // 175 -> 175
    case 6: return precio - 1; // 176 -> 175
    case 7: return precio + 2; // 177 -> 179
    case 8: return precio + 1; // 178 -> 179
    case 9: return precio;     // 179 -> 179
    default: return precio;
  }
}
