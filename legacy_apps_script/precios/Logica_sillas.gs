// logico_sillas.gs
// Lógica para la categoría SILLAS

function calcularPrecioSillas(datosSKU, comisiones) {
  var precioVenta = toNumber(datosSKU.precioVenta);
  var tc          = toNumber(datosSKU.tc);

  if (isNaN(precioVenta) || isNaN(tc)) {
    Logger.log("PRECIO VENTA o TC no numéricos para SKU SILLAS: " + (datosSKU.sku || ""));
    return {};
  }

  // 1️⃣ PRECIO COSTO EN SOLES
  var precioCosto = precioVenta * tc;

  var preciosFinales = {};

  // 2️⃣ VALORES DE ENVÍO — LOS PONES TÚ
  // AQUI SE RELLENAN LOS VALORES DE ENVIO PARA CADA PLATAFORMA
  var valorEnvio = {
    questTime:     0,
    paginaWeb:     0,
    mercadoLibre:  60,
    sagaFalabella: 40,
    juntoz:        40,
    intercorp:     50,
    shopstar:      50,
    ripley:        80,
    rappi:         30,
    diners:        40,
    luxury:        50,
    coolbox:       40,
    calidda:       80,
    claro:         60,
    mesajil:       40,
    yape:          60
  };

  // 3️⃣ PLATAFORMAS A PROCESAR (en el mismo orden de tu hoja PRECIOS)
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

    // 4️⃣ PRIMERA REGLA:
    // resultado1 = (precioCosto / comisión) + valorEnvio
    var bruto = (precioCosto / factor) + (valorEnvio[pl] || 0);

    // 5️⃣ REDONDEO
    var redondeado = Math.round(bruto);

    // 6️⃣ REGLA DEL ÚLTIMO DÍGITO
    preciosFinales[pl] = ajustarPrecioUltimoDigito(redondeado);
  });

  return preciosFinales;
}
