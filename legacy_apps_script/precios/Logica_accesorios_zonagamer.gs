// ===================================================================
//  LÓGICA DE PRECIOS – ACCESORIOS (SUBCATEGORÍA: ZONA GAMER)
// -------------------------------------------------------------------
//
//  Para cada plataforma se hace:
//
//    1) Pasar el precio de venta a soles:
//          costoSoles = PRECIO_VENTA_USD * TC
//
//    2) Cubrir la comisión de la plataforma:
//          R1 = costoSoles / (1 - comisión/100)
//
//    3) Sumar un "extra" (envío / ajuste), según la plataforma:
//
//          - Algunas plataformas solo tienen un EXTRAFIJO
//          - Otras dependen de un UMBRAL:
//                si R1 <= umbral → se suma extraMenorOIgual
//                si R1 >  umbral → se suma extraMayor
//
//    4) Redondear y aplicar la regla del último dígito.
//
//  PARA CAMBIAR COSTOS O ENVÍOS:
//  - Solo modifica los números en la tabla AJUSTES_ZONA_GAMER.
//  - No necesitas saber código, solo cambiar valores.
// ===================================================================

function calcularPrecioAccesoriosZonaGamer(datosSKU, comisiones) {

  // 0) Validar datos base
  var precioVentaUSD = toNumber(datosSKU.precioVenta);
  var tc             = toNumber(datosSKU.tc);

  if (isNaN(precioVentaUSD) || isNaN(tc)) {
    Logger.log("PRECIO VENTA o TC no numéricos para SKU ACC ZONA GAMER: " + (datosSKU.sku || ""));
    return {};
  }

  // 1) Precio base en soles
  var costoSoles = precioVentaUSD * tc;

  // Aquí se guardarán los precios finales por plataforma
  var preciosFinales = {};

  // ----------------------------------------------------------------
  // 2) CONFIGURACIÓN – AJUSTES POR PLATAFORMA
  // ----------------------------------------------------------------
  //  - extraFijo:
  //        se suma siempre a R1 si NO hay umbral definido.
  //
  //  - umbral + extraMenorOIgual + extraMayor:
  //        si R1 <= umbral → se suma extraMenorOIgual
  //        si R1 >  umbral → se suma extraMayor
  //
  //  Si una plataforma NO aparece aquí → extra = 0.
  // ----------------------------------------------------------------

  var AJUSTES_ZONA_GAMER = {
    // === SIN ENVÍO EXTRA (solo comisión) ===
    

    // Estas tienen regla por umbral (explicadas más abajo)
    // mercadoLibre, intercorp, shopstar, rappi, luxury, yape

    // === ENVÍO FIJO (no depende del valor de R1) ===
    ripley:        { extraFijo: 16 },
    calidda:       { extraFijo: 15 },
    claro:         { extraFijo: 12 },
    diners:        { extraFijo: 11 },
    mesajil:       { extraFijo: 5 },
    sagaFalabella: { extraFijo: 7 },
    coolbox:       { extraFijo: 2 },
    questTime:   { extraFijo: 4 },
    paginaWeb:   { extraFijo: 4 },
    mesajil: { extraFijo: 5 },

    // === RAPPI – depende de R1 y umbral 77 ===
    //  Si R1 <= 77 → +2
    //  Si R1 >  77 → +2.9
    rappi: {
      umbral:          77,
      extraMenorOIgual: 2,
      extraMayor:       2.9
    },

    // === SHOPSTAR – depende de R1 y umbral 49 ===
    //  Si R1 <= 49 → +11
    //  Si R1 >  49 → +12
    shopstar: {
      umbral:          49,
      extraMenorOIgual: 11,
      extraMayor:       12
    },

    // === INTERCORP – depende de R1 y umbral 49 ===
    //  Si R1 <= 49 → +12
    //  Si R1 >  49 → +13
    intercorp: {
      umbral:          49,
      extraMenorOIgual: 12,
      extraMayor:       13
    },

    // === MERCADO LIBRE – depende de R1 y umbral 49 ===
    //  Si R1 <= 49 → +9
    //  Si R1 >  49 → +9.5
    mercadoLibre: {
      umbral:          49,
      extraMenorOIgual: 9,
      extraMayor:       9.5
    },

    // === LUXURY – depende de R1 y umbral 39 ===
    //  Si R1 <= 39 → +3
    //  Si R1 >  39 → +6.9
    luxury: {
      umbral:          39,
      extraMenorOIgual: 3,
      extraMayor:       6.9
    },

    // === YAPE – depende de R1 y umbral 57 ===
    //  Si R1 <= 57 → +3
    //  Si R1 >  57 → +3.5
    yape: {
      umbral:          57,
      extraMenorOIgual: 3,
      extraMayor:       3.5
    },

    // === JUNTOZ – depende de si R1 pasa 39 ===
    // R1 > 39  → +8
    // R1 <= 39 → +4
    juntoz: {
      umbral:          39,
      extraMenorOIgual: 4,
      extraMayor:       8
    }
  };

  // Lista de plataformas manejadas (coincide con la hoja PRECIOS)
  var PLATAFORMAS_ZG = [
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

  // ----------------------------------------------------------------
  // 3) CÁLCULO GENERAL PARA CADA PLATAFORMA
  //
  //   R1 = costoSoles / (1 - comisión%)
  //   R2 = R1 + extra (según tabla AJUSTES_ZONA_GAMER)
  //   Precio final = redondear(R2) + regla último dígito
  // ----------------------------------------------------------------

  PLATAFORMAS_ZG.forEach(function (pl) {
    var porc = toNumber(comisiones[pl]);  // Porcentaje de comisión (%)

    if (isNaN(porc) || porc <= 0) {
      preciosFinales[pl] = null;
      return;
    }

    var factor = 1 - (porc / 100);
    if (factor <= 0) {
      preciosFinales[pl] = null;
      return;
    }

    // Paso 1: precio base que cubre la comisión
    var R1 = costoSoles / factor;

    // Paso 2: leer ajustes de la tabla
    var cfg   = AJUSTES_ZONA_GAMER[pl] || {};
    var extra = 0;

    // Si hay UMBRAL definido → usamos regla menor/mayor
    if (typeof cfg.umbral === "number") {
      if (R1 > cfg.umbral) {
        extra = cfg.extraMayor || 0;
      } else {
        extra = cfg.extraMenorOIgual || 0;
      }
    } else {
      // Si NO hay umbral → solo se usa extraFijo (o 0)
      extra = cfg.extraFijo || 0;
    }

    var R2 = R1 + extra;

    // Paso 3: redondeo + regla del último dígito
    var redondeado = Math.round(R2);
    preciosFinales[pl] = ajustarPrecioUltimoDigito(redondeado);
  });

  return preciosFinales;
}
