// logico_videojuegos.gs

function calcularPrecioVideojuegos(datosSKU, comisiones) {
  // 1) Convertimos a número de forma segura
  var precioVenta = toNumber(datosSKU.precioVenta); // PREC VENTA (USD)
  var tc          = toNumber(datosSKU.tc);          // TC

  if (isNaN(precioVenta) || isNaN(tc)) {
    Logger.log("PRECIO VENTA o TC no numéricos para SKU VIDEOJUEGOS: " + (datosSKU.sku || ""));
    return {};
  }

  // 2) Trabajamos en SOLES:
  // costoSoles = PRECIO VENTA * TC
  var costoSoles = precioVenta * tc;

  var preciosFinales = {};

  // ---------------------------
  // EXTRAS POR GRUPOS
  // ---------------------------

  // GRUPO 1: siempre suman este extra 
  var extrasGrupo1 = {
    diners: 11.5, // ENVIO ACTUALIZADO
    claro: 12, // ENVIO ACTUALIZADO
    ripley: 15, // ENVIO ACTUALIZADO
    calidda: 15, // ENVIO MANTENIDO
    rappi: 2, // ENVIO ACTUALIZADO
    sagaFalabella: 7, // ENVIO ACTUALIZADO
    paginaWeb: 4, // ENVIO ACTUALIZADO
    questTime: 4, // ENVIO ACTUALIZADO
    mesajil: 5 // ENVIO ACTUALIZADO
  };

  // GRUPO 2: suman extra SOLO si resultado1 > 63
  var extrasGrupo2 = {
    luxury: 12, // ENVIO ACTUALIZADO
    shopstar: 12 // ENVIO ACTUALIZADO
  };

  // GRUPO 3: suman extra SOLO si resultado1 <= 63
  var extrasGrupo3 = {
    shopstar: 11, // ENVIO ACTUALIZADO
    luxury: 10 // ENVIO ACTUALIZADO
  };

  // GRUPO 4: suman extra SOLO si resultado1 > 49
  var extrasGrupo4 = {
    yape: 3.5, // ENVIO ACTUALIZADO
    intercorp: 9.5, // ENVIO ACTUALIZADO
  };

  // GRUPO 5: suman extra SOLO si resultado1 <= 49
  var extrasGrupo5 = {
    yape: 3, // ENVIO ACTUALIZADO
    intercorp: 9, // ENVIO ACTUALIZADO
  };

  // GRUPO 6: suman extra SOLO si resultado1 > 45
  var extrasGrupo6 = {
    mercadoLibre: 6.9 // ENVIO MANTENIDO
  };

  // GRUPO 7: suman extra SOLO si resultado1 <= 45
  var extrasGrupo7 = {
    mercadoLibre: 0 // ENVIO ACTUALIZADO
  };

  // GRUPO 8: suman extra SOLO si resultado1 > 39
  var extrasGrupo8 = {
    juntoz: 8 // ENVIO ACTUALIZADO
  };

  // GRUPO 9: suman extra SOLO si resultado1 <= 39
  var extrasGrupo9 = {
    juntoz: 4 // ENVIO ACTUALIZADO
  };


  // Plataformas que calculamos (coinciden con principal.gs / hoja PRECIOS)
  var plataformas = [
    "questTime",
    "paginaWeb",
    "mercadoLibre",
    "sagaFalabella",
    "juntoz",
    "intercorp",
    "shopstar",
    "ripley",
    "rappi",
    "diners",
    "luxury",
    "coolbox",
    "calidda",
    "claro",
    "mesajil",
    "yape"
  ];

  plataformas.forEach(function (plataforma) {
    var porcentaje = toNumber(comisiones[plataforma]); // ej: 8, 10, 12…

    if (isNaN(porcentaje) || porcentaje <= 0) {
      preciosFinales[plataforma] = null;
      return;
    }

    // 3) resultado1 base = costo / comisión (usando factor 1 - %)
    var factor = 1 - (porcentaje / 100); // 8% → 0.92
    if (factor <= 0) {
      preciosFinales[plataforma] = null;
      return;
    }

    var resultado1 = costoSoles / factor; // aquí ya está "costo / comisión"

    // 4) Aplicar EXTRAS según grupos

    // GRUPO 1: siempre suma extra fijo
    if (extrasGrupo1[plataforma] != null) {
      resultado1 += extrasGrupo1[plataforma];

    } else {
      // GRUPO 2: solo si resultado1 > 63
      if (extrasGrupo2[plataforma] != null && resultado1 > 63) {
        resultado1 += extrasGrupo2[plataforma];
      }

      // GRUPO 3: solo si resultado1 <= 63
      if (extrasGrupo3[plataforma] != null && resultado1 <= 63) {
        resultado1 += extrasGrupo3[plataforma];
      }

      // GRUPO 4: solo si resultado1 > 49
      if (extrasGrupo4[plataforma] != null && resultado1 > 49) {
        resultado1 += extrasGrupo4[plataforma];
      }
      // GRUPO 5: solo si resultado1 <= 49
      if (extrasGrupo5[plataforma] != null && resultado1 <= 49) {
        resultado1 += extrasGrupo5[plataforma];
      }
      // GRUPO 6: solo si resultado1 > 45
      if (extrasGrupo6[plataforma] != null && resultado1 > 45) {
        resultado1 += extrasGrupo6[plataforma];
      }
      // GRUPO 7: solo si resultado1 <= 45
      if (extrasGrupo7[plataforma] != null && resultado1 <= 45) {
        resultado1 += extrasGrupo7[plataforma];
      }
      // GRUPO 8: solo si resultado1 > 39
      if (extrasGrupo8[plataforma] != null && resultado1 > 39) {
        resultado1 += extrasGrupo8[plataforma];
      }
      // GRUPO 9: solo si resultado1 <= 39
      if (extrasGrupo9[plataforma] != null && resultado1 <= 39) {
        resultado1 += extrasGrupo9[plataforma];
      }

      // GRUPO 10 ( Coolbox) no aparecen en ningún objeto de extras,
      // así que simplemente no se les suma nada.
    }



    // 5) Redondeo
    var precioRedondeado = Math.round(resultado1);

    // 6) Regla del último dígito
    preciosFinales[plataforma] = ajustarPrecioUltimoDigito(precioRedondeado);
  });

  return preciosFinales;
}
