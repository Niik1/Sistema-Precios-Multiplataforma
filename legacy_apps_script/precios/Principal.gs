var _cacheCatalogo = null;
var _cacheComisiones = null;

function getCatalogoCache() {
  if (_cacheCatalogo) return _cacheCatalogo;
  var hojaCatalogo = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("BD_CATALOGO");
  _cacheCatalogo = hojaCatalogo.getDataRange().getValues();
  return _cacheCatalogo;
}

function getComisionesCache() {
  if (_cacheComisiones) return _cacheComisiones;
  var hojaComisiones = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CONSOLIDADO_COMISIONES");
  _cacheComisiones = hojaComisiones.getDataRange().getValues();
  return _cacheComisiones;
}

function getHojaErrores_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName("LOG_ERRORES");
  if (!hoja) {
    hoja = ss.insertSheet("LOG_ERRORES");
    hoja.appendRow(["Fecha/Hora", "SKU", "Fila PRECIOS", "Tipo error", "Detalle"]);
  }
  return hoja;
}

function registrarError_(sku, fila, tipo, detalle) {
  var hoja = getHojaErrores_();
  hoja.appendRow([new Date(), sku, fila, tipo, detalle]);
}

function marcarFilaError(hoja, fila, mensaje) {
  hoja.getRange(fila, 1, 1, 22).setBackground("#ffcccc");
  hoja.getRange(fila, 1).setNote(mensaje);
}

function limpiarMarcaErrorFila(hoja, fila) {
  hoja.getRange(fila, 1, 1, 22).setBackground(null);
  hoja.getRange(fila, 1).clearNote();
}

function marcarCeldaComisionError(hoja, fila, columna, mensaje) {
  var celda = hoja.getRange(fila, columna);
  celda.setBackground("#fff2cc");
  celda.setNote(mensaje);
}

function limpiarCeldaComision(hoja, fila, columna) {
  var celda = hoja.getRange(fila, columna);
  celda.setBackground(null);
  celda.clearNote();
}

function esNumero_(v) {
  return v !== "" && v != null && !isNaN(Number(v));
}

function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("PRECIOS")
    .addItem("Recalcular RANGO SELECCIONADO", "recalcularRangoSeleccionado")
    .addItem("Recalcular SOLO filas incompletas", "recalcularFilasIncompletas")
    .addToUi();
}

function recalcularRangoSeleccionado() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getActiveSheet();
  if (!hoja || hoja.getName() !== "PRECIOS") return;

  var rango = hoja.getActiveRange();
  if (!rango) return;

  var startRow = rango.getRow();
  var numRows = rango.getNumRows();

  _cacheCatalogo = null;
  _cacheComisiones = null;

  for (var i = 0; i < numRows; i++) {
    var fila = startRow + i;
    var bruto = hoja.getRange(fila, 2).getValue();
    var sku = bruto != null ? String(bruto).trim() : "";
    if (!sku) continue;

    try {
      calcularPreciosPorSKU(sku, hoja, fila);
    } catch (err) {
      Logger.log("Error fila " + fila + " SKU " + sku + ": " + err);
      registrarError_(sku, fila, "EXCEPCION", err);
    }
  }
}

function recalcularFilasIncompletas() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName("PRECIOS");
  if (!hoja) return;

  var lastRow = hoja.getLastRow();
  if (lastRow < 2) return;

  _cacheCatalogo = null;
  _cacheComisiones = null;

  var datos = hoja.getRange(2, 1, lastRow - 1, 22).getValues();

  for (var i = 0; i < datos.length; i++) {
    var fila = i + 2;
    var row = datos[i];

    var skuRaw = row[1];
    var sku = skuRaw != null ? String(skuRaw).trim() : "";
    if (!sku) continue;

    var nombre = row[0];
    var plataformas = row.slice(5);

    var incompleta =
      !nombre ||
      plataformas.some(function (v) {
        return v === "" || v == null;
      });

    if (!incompleta) continue;

    try {
      calcularPreciosPorSKU(sku, hoja, fila);
    } catch (err) {
      registrarError_(sku, fila, "EXCEPCION", err);
    }
  }
}

function calcularPreciosPorSKU(sku, hoja, fila) {
  sku = String(sku).trim();

  limpiarMarcaErrorFila(hoja, fila);
  for (var c = 6; c <= 22; c++) limpiarCeldaComision(hoja, fila, c);

  var datosSKU = obtenerDatosDeSKU(sku);
  var comisiones = obtenerComisionesDeSKU(sku);

  if (!datosSKU || !comisiones) {
    var msg = "Faltan datos en BD_CATALOGO o CONSOLIDADO_COMISIONES";
    marcarFilaError(hoja, fila, msg);
    registrarError_(sku, fila, "DATOS", msg);
    return;
  }

  var erroresCampos = [];
  if (!esNumero_(datosSKU.costo)) erroresCampos.push("COSTO");
  if (!esNumero_(datosSKU.margen)) erroresCampos.push("MARGEN");
  if (!esNumero_(datosSKU.tc)) erroresCampos.push("TC");

  if (erroresCampos.length) {
    marcarFilaError(hoja, fila, "Catálogo inválido: " + erroresCampos.join(", "));
    return;
  }

  var categoria = (datosSKU.categoria || "").toUpperCase();
  var subcat = (datosSKU.subcategoria || "").toUpperCase();

  var precios = {};

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
  var precioEFE = calcularPrecioEfe(datosSKU);

  if (precioEFE == null || isNaN(precioEFE)) {
    precioEFE = "";
    marcarCeldaComisionError(hoja, fila, 18, "Error cálculo EFE");
  }

  hoja.getRange(fila, 1).setValue(datosSKU.nombre);
  hoja.getRange(fila, 2).setValue(sku);
  hoja.getRange(fila, 3).setValue(datosSKU.precioVenta);
  hoja.getRange(fila, 4).setValue(datosSKU.tc);
  hoja.getRange(fila, 5).setValue(datosSKU.costo);

  var plataformas = [
    "questTime", "paginaWeb", "mercadoLibre", "sagaFalabella", "juntoz",
    "intercorp", "shopstar", "ripley", "rappi", "diners", "luxury",
    "coolbox","efe", "calidda", "claro", "mesajil", "yape"
  ];

  plataformas.forEach(function (plat, idx) {
    var col = 6 + idx;
    hoja.getRange(fila, col).setValue(precios[plat] || "");
  });
  hoja.getRange(fila, 18).setValue(precioEFE);
}

function obtenerDatosDeSKU(sku) {
  var valores = getCatalogoCache();

  for (var i = 1; i < valores.length; i++) {
    var f = valores[i];
    var skuH = f[3] != null ? String(f[3]).trim() : "";
    if (skuH === sku) {
      return {
        categoria:    f[0],
        subcategoria: f[1],
        nombre:       f[2],
        sku:          f[3],
        costo:        f[4],
        margen:       f[5],
        tc:           f[6],
        precioVenta:  f[7],
        tipo:         f[8],  
        cantAsc:      f[9],  
        skuAsociado:  f[10]  
      };
    }
  }
  return null;
}

function obtenerComisionesDeSKU(sku) {
  var valores = getComisionesCache();

  for (var i = 1; i < valores.length; i++) {
    var f = valores[i];
    var skuH = f[3] != null ? String(f[3]).trim() : "";
    if (skuH === sku) {
      return {
        questTime: f[4],
        paginaWeb: f[5],
        mercadoLibre: f[6], 
        sagaFalabella: f[7], 
        juntoz: f[8],
        intercorp: f[9], 
        shopstar: f[10], 
        ripley: f[11], 
        rappi: f[12], 
        diners: f[13],
        luxury: f[14], 
        coolbox: f[15],
        calidda: f[16], 
        claro: f[17], 
        mesajil: f[18], 
        yape: f[19],
        efe: null
      };
    }
  }
  return null;
}
