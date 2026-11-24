function calcularPrecioConsolas(datosSKU, comisiones) {
  var precioVentaUSD = toNumber(datosSKU.precioVenta); 
  var tc = toNumber(datosSKU.tc);                      

  if (isNaN(precioVentaUSD) || isNaN(tc)) {
    Logger.log("PRECIO VENTA o TC no numéricos para SKU CONSOLA: " + datosSKU.sku);
    return {}; 
  }

  var precioBaseSoles = precioVentaUSD * tc;
  var preciosFinales = {};

  var valoresGrupo1 = {
    mercadoLibre: 10 
  };

  var valoresGrupo2 = {
    intercorp: 22, 
    shopstar: 25, 
    ripley: 15, 
    juntoz: 10, 
    luxury: 11, 
    calidda: 30, 
    claro: 10, 
    sagaFalabella: 10, 
    diners: 10, 
    yape: 0, 
    rappi: 5, 
    mesajil: 5 
  };

  var plataformasGrupo1 = [
    "mercadoLibre"
  ];

  plataformasGrupo1.forEach(function (plataforma) {
    var porcentaje = toNumber(obtenerPorcentajeConsolas(plataforma, comisiones));
    if (isNaN(porcentaje)) {
      preciosFinales[plataforma] = null;
      return;
    }

    var factor = 1 - (porcentaje / 100);
    if (factor <= 0) {
      preciosFinales[plataforma] = null;
      return;
    }

    var base = precioBaseSoles + (valoresGrupo1[plataforma] || 0);
    var precioBruto = base / factor;

    var precioRed = Math.round(precioBruto);
    preciosFinales[plataforma] = ajustarPrecioUltimoDigito(precioRed);
  });

  // 2️⃣ GRUPO 2: (PRECIO_BASE_SOLES / (1 - comisión%)) + VALOR ENVIO
  var plataformasGrupo2 = [
    "intercorp",
    "shopstar",
    "ripley",
    "luxury",
    "calidda",
    "claro",
    "juntoz",
    "sagaFalabella",
    "diners",
    "yape",
    "mesajil",
  ];

  plataformasGrupo2.forEach(function (plataforma) {
    var porcentaje = toNumber(obtenerPorcentajeConsolas(plataforma, comisiones));
    if (isNaN(porcentaje)) {
      preciosFinales[plataforma] = null;
      return;
    }

    var factor = 1 - (porcentaje / 100);
    if (factor <= 0) {
      preciosFinales[plataforma] = null;
      return;
    }

    var base = precioBaseSoles / factor;
    base += (valoresGrupo2[plataforma] || 0);

    var precioRed = Math.round(base);
    preciosFinales[plataforma] = ajustarPrecioUltimoDigito(precioRed);
  });

  // 3️⃣ GRUPO 3: PRECIO_BASE_SOLES / (1 - comisión%) sin valor extra
  var plataformasGrupo3 = [
    "rappi", //LO ASUME EL CLIENTE EL ENVIO
    "paginaWeb",//LO ASUME EL CLIENTE EL ENVIO
    "questTime", //LO ASUME EL CLIENTE EL ENVIO
    "coolbox", //NO COBRA EL ENVIO

  ];

  plataformasGrupo3.forEach(function (plataforma) {
    var porcentaje = toNumber(obtenerPorcentajeConsolas(plataforma, comisiones));
    if (isNaN(porcentaje)) {
      preciosFinales[plataforma] = null;
      return;
    }

    var factor = 1 - (porcentaje / 100);
    if (factor <= 0) {
      preciosFinales[plataforma] = null;
      return;
    }

    var precioBruto = precioBaseSoles / factor;
    var precioRed = Math.round(precioBruto);
    preciosFinales[plataforma] = ajustarPrecioUltimoDigito(precioRed);
  });

  return preciosFinales;
}

function obtenerPorcentajeConsolas(plataforma, comisiones) {
  switch (plataforma) {
    case "questTime":     return comisiones.questTime;
    case "paginaWeb":     return comisiones.paginaWeb;
    case "mercadoLibre":  return comisiones.mercadoLibre;
    case "sagaFalabella": return comisiones.sagaFalabella;
    case "juntoz":        return comisiones.juntoz;
    case "intercorp":     return comisiones.intercorp;
    case "shopstar":      return comisiones.shopstar;
    case "ripley":        return comisiones.ripley;
    case "rappi":         return comisiones.rappi;
    case "diners":        return comisiones.diners;
    case "luxury":        return comisiones.luxury;
    case "coolbox":       return comisiones.coolbox;
    case "calidda":       return comisiones.calidda;
    case "claro":         return comisiones.claro;
    case "mesajil":       return comisiones.mesajil;
    case "yape":          return comisiones.yape;
    default:              return null;
  }
}

function ajustarPrecioUltimoDigito(precio) {
  var d = precio % 10;
  switch (d) {
    case 0: precio -= 1; break;
    case 1: precio -= 2; break;
    case 2: precio += 3; break;
    case 3: precio += 2; break;
    case 4: precio += 1; break;
    case 5: break;
    case 6: precio -= 1; break;
    case 7: precio += 2; break;
    case 8: precio += 1; break;
    case 9: break;
  }
  return precio;
}

function toNumber(value) {
  if (typeof value === "number") return value;
  if (value == null) return NaN;
  var str = String(value).trim().replace(",", ".");
  var n = parseFloat(str);
  return isNaN(n) ? NaN : n;
}
