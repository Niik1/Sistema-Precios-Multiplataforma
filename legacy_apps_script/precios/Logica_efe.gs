/************************************************************
 * LÓGICA EFE — precio especial sin IGV + detracción 3%
 * Soporta PURO y COMBO
 ************************************************************/


/**
 * Calcula el precio EFE final de un SKU
 * Entrada: datosSKU obtenido desde principal (incluye TIPO, COSTO, MARGEN, TC)
 * Retorna: precio con 2 decimales
 */
function calcularPrecioEfe(datosSKU) {
  var tipo = (datosSKU.tipo || "").toString().trim().toUpperCase();

  // ======================================================
  // CASO 1: SKU PURO
  // ======================================================
  if (tipo === "PURO" || tipo === "") {
    return calcularEfePuro(datosSKU);
  }

  // ======================================================
  // CASO 2: SKU COMBO
  // ======================================================
  if (tipo === "COMBO") {
    return calcularEfeCombo(datosSKU);
  }

  return null;
}



/************************************************************
 * 1️⃣ LÓGICA PARA SKU PURO
 ************************************************************/
function calcularEfePuro(datos) {
  var categoria = (datos.categoria || "").toUpperCase().trim();

  // Precio base en soles (costo + margen) * TC
  var precioBase = (Number(datos.costo) + Number(datos.margen)) * Number(datos.tc);

  // VIDEOJUEGOS: NO se le quita IGV
  if (categoria === "VIDEOJUEGOS") {
    var res = precioBase / 0.97; // aplicar detracción 3%
    return Number(res.toFixed(2));
  }

  // Todo lo demás SI se le quita IGV
  var sinIgv = precioBase / 1.18;
  var final = sinIgv / 0.97; // detracción
  return Number(final.toFixed(2));
}



/************************************************************
 * 2️⃣ LÓGICA PARA SKU COMBO
 ************************************************************/
function calcularEfeCombo(datosSKU) {
  var asociadosRaw = (datosSKU.skuAsociado || "").trim();
  if (!asociadosRaw) return null;

  var listaSKUs = asociadosRaw.split("/").map(function (s) {
    return s.trim();
  });

  var catalogo = getCatalogoCache(); // del principal.gs

  var sumaComponentes = 0;

  // Recorremos los SKUs asociados
  for (var i = 0; i < listaSKUs.length; i++) {
    var skuA = listaSKUs[i];
    var datosA = buscarSKUEnCatalogo_(catalogo, skuA);

    if (!datosA) {
      Logger.log("⚠ SKU asociado no encontrado en BD_CATALOGO: " + skuA);
      continue;
    }

    // Precio base del asociado
    var precioBaseA = (Number(datosA.costo) + Number(datosA.margen)) * Number(datosA.tc);

    var categoriaA = (datosA.categoria || "").toUpperCase().trim();

    // VIDEOJUEGOS → NO quitar IGV
    if (categoriaA === "VIDEOJUEGAMES" || categoriaA === "VIDEOJUEGOS") {
      sumaComponentes += precioBaseA;
    } else {
      // Todos los demás → quitar IGV
      sumaComponentes += (precioBaseA / 1.18);
    }
  }

  // A la suma total se aplica la detracción del 3%
  var finalCombo = sumaComponentes / 0.97;

  return Number(finalCombo.toFixed(2));
}



/************************************************************
 * Helper: buscar datos de un SKU en BD_CATALOGO (con caché)
 ************************************************************/
function buscarSKUEnCatalogo_(catalogo, sku) {
  for (var i = 1; i < catalogo.length; i++) {
    var fila = catalogo[i];
    var skuHoja = fila[3] != null ? String(fila[3]).trim() : ""; // columna D

    if (skuHoja === sku) {
      return {
        categoria:    fila[0],
        subcategoria: fila[1],
        nombre:       fila[2],
        sku:          skuHoja,
        costo:        fila[4],
        margen:       fila[5],
        tc:           fila[6],
        precioVenta:  fila[7],
        tipo:         fila[8],  // nueva columna TIPO
        cantAsc:      fila[9],  // nueva columna CANT SKU ASC
        skuAsociado:  fila[10]  // nueva columna SKU ASOCIADO
      };
    }
  }
  return null;
}
