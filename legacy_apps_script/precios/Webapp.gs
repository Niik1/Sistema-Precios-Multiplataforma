// ════════════════════════════════════════════════════════════
//  WEBAPP – agrega esto a tu principal.gs (o en un archivo
//  separado dentro del mismo proyecto de Apps Script)
// ════════════════════════════════════════════════════════════

/**
 * Sirve el archivo Index.html como aplicación web.
 * Deploy → New deployment → Tipo: Web app
 * Execute as: Me | Who has access: Anyone (o tu organización)
 */
function doGet(e) {
  return HtmlService
    .createHtmlOutputFromFile("Index")
    .setTitle("Calculadora de Precios – GameCenter")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Función llamada desde el HTML vía google.script.run.
 * Recibe un array de SKUs y devuelve los resultados calculados.
 *
 * @param {string[]} skus  Array de SKUs a procesar
 * @returns {Object[]}     Array de objetos con nombre, sku, categoria, tc,
 *                         costo, precioVenta, precios (por plataforma) | error
 */
function calcularPreciosBatch(skus) {
  // Limpiamos caché para forzar lectura fresca
  _cacheCatalogo   = null;
  _cacheComisiones = null;

  var resultados = [];

  skus.forEach(function (sku) {
    sku = String(sku).trim();
    if (!sku) return;

    try {
      var datosSKU   = obtenerDatosDeSKU(sku);
      var comisiones = obtenerComisionesDeSKU(sku);

      if (!datosSKU || !comisiones) {
        resultados.push({
          sku:   sku,
          error: "SKU no encontrado en BD_CATALOGO o CONSOLIDADO_COMISIONES"
        });
        return;
      }

      // Validaciones numéricas
      if (!esNumero_(datosSKU.costo) || !esNumero_(datosSKU.margen) || !esNumero_(datosSKU.tc)) {
        resultados.push({
          sku:   sku,
          error: "Catálogo inválido: campos numéricos faltantes (COSTO / MARGEN / TC)"
        });
        return;
      }

      var categoria = (datosSKU.categoria || "").toUpperCase();
      var subcat    = (datosSKU.subcategoria || "").toUpperCase();
      var precios   = {};

      if (categoria === "ACCESORIOS" && subcat === "ZONA GAMER") {
        precios = calcularPrecioAccesoriosZonaGamer(datosSKU, comisiones);
      } else if (categoria === "ACCESORIOS") {
        precios = calcularPrecioAccesorios(datosSKU, comisiones);
      } else if (categoria === "CONSOLAS") {
        precios = calcularPrecioConsolas(datosSKU, comisiones);
      } else if (categoria === "VIDEOJUEGOS") {
        precios = calcularPrecioVideojuegos(datosSKU, comisiones);
      } else if (categoria === "SILLA" || categoria === "SILLAS") {
        precios = calcularPrecioSillas(datosSKU, comisiones);
      } else if (categoria.includes("GIFCARD")) {
        precios = calcularPrecioGifcard(datosSKU, comisiones);
      } else if (categoria.includes("FUNKOS")) {
        precios = calcularPrecioFunkos(datosSKU, comisiones);
      }

      // Precio EFE calculado aparte
      var precioEFE = calcularPrecioEfe(datosSKU);
      precios.efe   = (precioEFE != null && !isNaN(precioEFE)) ? precioEFE : "";

      resultados.push({
        nombre:      datosSKU.nombre,
        sku:         sku,
        categoria:   datosSKU.categoria,
        subcategoria: datosSKU.subcategoria,
        tc:          datosSKU.tc,
        costo:       datosSKU.costo,
        precioVenta: datosSKU.precioVenta,
        precios:     precios
      });

    } catch (err) {
      Logger.log("Error batch SKU " + sku + ": " + err);
      resultados.push({ sku: sku, error: String(err) });
    }
  });

  return resultados;
}