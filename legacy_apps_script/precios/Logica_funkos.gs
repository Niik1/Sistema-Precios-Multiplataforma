// logico_funkos.gs
// Lógica para la categoría FUNKOS

function calcularPrecioFunkos(datosSKU, comisiones) {
  var precioVenta = toNumber(datosSKU.precioVenta);
  var tc          = toNumber(datosSKU.tc);

  if (isNaN(precioVenta) || isNaN(tc)) {
    Logger.log("PRECIO VENTA o TC no numéricos para SKU FUNKOS: " + (datosSKU.sku || ""));
    return {};
  }

  // 1️⃣ PRECIO COSTO EN SOLES
  var precioCosto = precioVenta * tc;

  var preciosFinales = {};

  // 2️⃣ VALOR DE ENVÍO — LO DEFINES TÚ
  var valorEnvio = {
    questTime:     0,
    paginaWeb:     0,
    mercadoLibre:  0,
    sagaFalabella: 0,
    juntoz:        0,
    intercorp:     0,
    shopstar:      0,
    ripley:        0,
    rappi:         0,
    diners:        0,
    luxury:        0,
    coolbox:       0,
    calidda:       0,
    claro:         0,
    mesajil:       0,
    yape:          0
  };

  // 3️⃣ LISTA DE PLATAFORMAS
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

  plataformas.forEach(function (pl) {
    var porcentaje = toNumber(comisiones[pl]);

    if (isNaN(porcentaje) || porcentaje <= 0) {
      preciosFinales[pl] = null;
      return;
    }

    var factor = 1 - (porcentaje / 100);
    if (factor <= 0) {
      preciosFinales[pl] = null;
      return;
    }

    // 4️⃣ REGLA PRINCIPAL
    var bruto = (precioCosto / factor) + (valorEnvio[pl] || 0);

    // 5️⃣ REDONDEO
    var redondeado = Math.round(bruto);

    // 6️⃣ REGLA DEL ÚLTIMO DÍGITO
    preciosFinales[pl] = ajustarPrecioUltimoDigito(redondeado);
  });

  return preciosFinales;
}
