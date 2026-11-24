// ===============================================================
//  LÓGICA DE PRECIOS – CATEGORÍA: ACCESORIOS (NO ZONA GAMER)
// ---------------------------------------------------------------
//  RESUMEN:
//
//  1) costoSoles = PRECIO VENTA USD * TC
//  2) R1 = costoSoles / (1 - comisión%)
//  3) Para cada plataforma se suma un "extra":
//       - Puede ser fijo (extraFijo)
//       - O puede depender de si R1 es MAYOR o MENOR/IGUAL que un UMBRAL
//  4) Se redondea y se aplica la regla del último dígito.
//
//  CÓMO CAMBIAR LOS VALORES SIN SABER PROGRAMAR:
//
//  - Abajo verás un objeto llamado AJUSTES_ACCESORIOS.
//  - Cada plataforma tiene:
//        extraFijo       → valor que siempre se suma a R1 (si no hay umbral)
//        umbral          → número de referencia (opcional)
//        extraMenorOIgual→ se suma si R1 <= umbral
//        extraMayor      → se suma si R1  > umbral
//
//  - Si una plataforma solo tiene extraFijo, NO hace falta umbral.
//  - Si no aparece en AJUSTES_ACCESORIOS, se asume extra = 0.
// ===============================================================

function calcularPrecioAccesorios(datosSKU, comisiones) {
  // 0) Validación básica
  var precioVentaUSD = toNumber(datosSKU.precioVenta); // PRECIO VENTA (USD)
  var tc             = toNumber(datosSKU.tc);          // TIPO DE CAMBIO

  if (isNaN(precioVentaUSD) || isNaN(tc)) {
    Logger.log("PRECIO VENTA o TC no numéricos para SKU ACCESORIOS: " + (datosSKU.sku || ""));
    return {};
  }

  // 1) Convertir a soles
  var costoSoles = precioVentaUSD * tc;

  // Aquí guardaremos el precio final por plataforma
  var preciosFinales = {};

  // ===========================================================
  // CONFIGURACIÓN – AJUSTES POR PLATAFORMA
  // -----------------------------------------------------------
  // NOTA:
  // - extraFijo se suma siempre, si NO se define umbral.
  // - Si se define umbral:
  //      R1 <= umbral → suma extraMenorOIgual
  //      R1 >  umbral → suma extraMayor
  // ===========================================================

  var AJUSTES_ACCESORIOS = {
    // === SIN ENVÍO EXTRA (solo comisión) ===
    mesajil:     { extraFijo: 0 },

    // === ENVÍO FIJO (no depende de R1) ===
    ripley:        { extraFijo: 16 },
    calidda:       { extraFijo: 20 },
    claro:         { extraFijo: 13 },
    diners:        { extraFijo: 11 },
    coolbox:       { extraFijo: 2 },
    sagaFalabella: { extraFijo: 7.5 },
    paginaWeb: { extraFijo: 4 },
    questTime: { extraFijo: 4 },
    mesajil: { extraFijo: 5 },

    // === SHOPSTAR – depende de si R1 pasa 43 ===
    // R1 > 43  → +12
    // R1 <= 43 → +11
    shopstar: {
      umbral:          43,
      extraMenorOIgual: 11,
      extraMayor:       12
    },

    // === LUXURY – depende de si R1 pasa 63 ===
    // R1 > 63  → +12
    // R1 <= 63 → +10
    luxury: {
      umbral:          63,
      extraMenorOIgual: 10,
      extraMayor:       12
    },

    // === RAPPI – depende de si R1 pasa 97 ===
    // R1 > 97  → +2.9
    // R1 <= 97 → +0
    rappi: {
      umbral:          97,
      extraMenorOIgual: 0,
      extraMayor:       2.9
    },

    // === YAPE – depende de si R1 pasa 57 ===
    // R1 > 57  → +3.5
    // R1 <= 57 → +3
    yape: {
      umbral:          57,
      extraMenorOIgual: 3,
      extraMayor:       3.5
    },

    // === INTERCORP – depende de si R1 pasa 49 ===
    // R1 > 49  → +13
    // R1 <= 49 → +12
    intercorp: {
      umbral:          49,
      extraMenorOIgual: 12,
      extraMayor:       13
    },

    // === MERCADO LIBRE – depende de si R1 pasa 39 ===
    // R1 > 39  → +6.9
    // R1 <= 39 → +3
    mercadoLibre: {
      umbral:          39,
      extraMenorOIgual: 3,
      extraMayor:       6.9
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

  // Lista de plataformas (coincide con la hoja PRECIOS)
  var PLATAFORMAS = [
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

  // ===========================================================
  // CÁLCULO GENERAL:
  //   R1 = costoSoles / (1 - comisión%)
  //   R2 = R1 + extra (según configuración)
  // ===========================================================

  PLATAFORMAS.forEach(function (pl) {
    var porc = toNumber(comisiones[pl]); // % comisión

    if (isNaN(porc) || porc <= 0) {
      preciosFinales[pl] = null;
      return;
    }

    var factor = 1 - (porc / 100);
    if (factor <= 0) {
      preciosFinales[pl] = null;
      return;
    }

    // Paso 1: cubrir comisión
    var R1 = costoSoles / factor;

    // Paso 2: sumar extra según reglas de la plataforma
    var cfg   = AJUSTES_ACCESORIOS[pl] || {};
    var extra = 0;

    // Si hay umbral definido se usa regla mayor/menor
    if (typeof cfg.umbral === "number") {
      if (R1 > cfg.umbral) {
        extra = cfg.extraMayor || 0;
      } else {
        extra = cfg.extraMenorOIgual || 0;
      }
    } else {
      // Si NO hay umbral, usamos extraFijo (o 0 por defecto)
      extra = cfg.extraFijo || 0;
    }

    var R2 = R1 + extra;

    // Paso 3: redondear y aplicar regla del último dígito
    var redondeado = Math.round(R2);
    preciosFinales[pl] = ajustarPrecioUltimoDigito(redondeado);
  });

  return preciosFinales;
}
