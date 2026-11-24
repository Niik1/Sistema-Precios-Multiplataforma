import { MarketplaceId, Product } from '../types';
import { normalizeText } from '../utils/normalizer';

export function comisionSagaFalabella(cat: string, sub: string, nom: string): number {
  if (cat.includes('CONSOLAS') && /TELEVISORES|PLAYSTATION|CELULARES/.test(sub)) return 8;

  // Reglas de Audífonos
  if (cat.includes('ACCESORIOS') && /AUDIFONO|HEADSET|AURICULAR/.test(nom)) {
    if (/COMPUTO|ZONA GAMER/.test(sub)) return 10;
    if (/PLAYSTATION|NINTENDO|MICROSOFT/.test(sub)) return 15;
  }

  if (cat.includes('VIDEOJUEGOS')) return 12;

  // Bloque del 10%
  if (cat.includes('ACCESORIOS') && sub.includes('COMPUTO') && nom.includes('DISCO DURO SSD')) return 10;
  if (
    /PARLANTE UE WONDERBOOM|PARLANTE CREATIVE|PARLANTE INTELIGENTE|MONITOR|MICROFONO|CAMARA|IPAD|ALEXA|ECHO|SMARTWATCH|PULSERA XIAOMI|REDMI WATCH|XIAOMI SMART BAND|RELOJ XIAOMI|SMARTBAND/.test(
      nom
    )
  )
    return 10;
  if (cat.includes('ACCESORIOS') && sub.includes('ZONA GAMER') && /MICROFONO|BRAZO/.test(nom)) return 10;
  if (nom.includes('DISCO DURO') && /EXTERNO|SEAGATE/.test(nom)) return 10;

  // Lógica Mandos (15%)
  const primera = nom.split(' ')[0] || '';
  const esMando =
    /MANDO|CONTROL|CONTROLES|NACON|WIRED|FIREWALL|FIGHTING|HORI|HANGRID|POWERA|JOY CON|JOY-CON|GAMEPAD|PRO|JOYSTICK/.test(
      primera
    );
  if (
    esMando &&
    /PS4|PLAYSTATION|SWITCH|XBOX|ENHANCED|PRO|CONTROLLER|DUALSHOCK|DUALSENSE|RAZER|INALAMBRICO|ALAMBRICO|REDRAGON|MACHENIKE|MSI|MINI|HORIPAD|CONTROL|STICK|ZERO|POWER|JOY-CON|JOY CON|REVOLUTION|THUNDEROBOT/.test(
      nom
    )
  )
    return 15;

  // Bloque Masivo del 15%
  if (cat.includes('ACCESORIOS')) {
    if (sub.includes('NINTENDO') && nom.includes('FIGURA')) return 15;
    if (sub.includes('COMPUTO') && /EXTENSOR WIFI|REPETIDOR DE WIFI/.test(nom)) return 15;
    if (sub.includes('PLAYSTATION') && nom.includes('SSD')) return 15;
    if (/MICA|CARGADOR|ESTUCHE|HUB|TIMON|VOLANTE|RACING WHEEL|PARLANTE|KIT/.test(nom)) return 15;
  }

  if (
    /MEMORIA|UGREEN|SOPORTE|TRIPODE|COOLER|TARJETA GIFT|TECLADO|MOUSE|MUÑECAS|ALTAVOCES|MOCHILA|KEYCAPS|GAME TRAVELER|MALETIN|AMIIBO|CABLE|ADAPTADOR|BASE DE CARGA|POWERBANK|POWER BANK|CARGADOR|PROTECTOR|HANDGRIP|ESTABILIZADOR|REGLETA|SUPRESOR|RECEPTOR|ESTACION DE CARGA|CASE|SILICONE|SILICONA|BOLSO|TP-LINK|BACKBONE|UPS|META QUEST|BATERIA|BASE DE ENFRIAMIENTO|LENTES VR|LENTES DE REALIDAD VIRTUAL|TV STICK|TV BOX|CHROMECAST|STREAMING|MICROSD/.test(
      nom
    ) ||
    /GIFCARD|SILLA|FUNKO/.test(cat)
  ) {
    return 15;
  }

  return 15;
}

export function comisionMercadoLibre(cat: string, sub: string, nom: string): number {
  const primera = nom.split(' ')[0] || '';

  if (/MOUSE/.test(primera) && nom.includes('MOUSE')) return 10;
  if (/MOUSE PAD|PAD MOUSE|MICROFONO/.test(nom)) return 10;
  if (
    /MONITOR|SMARTBAND|SMARTWATCH|PULSERA XIAOMI|REDMI WATCH|XIAOMI SMART BAND|RELOJ XIAOMI/.test(
      nom
    )
  )
    return 11;
  if (/IPAD|TELEVISOR|SMART TV/.test(nom)) return 8;
  if (sub.includes('CELULARES') || cat.includes('VIDEOJUEGOS')) return 8;
  if (cat.includes('FUNKOS')) return 14;
  if (sub.includes('MERCHANDISING')) return 0;
  if (/GIFCARD/.test(sub) || nom.includes('GIFT CARD')) return 15;
  if (/AUDIFONO|HEADSET|AURICULAR|PARLANTE|ALEXA|ECHO|HEY GOOGLE/.test(nom) || cat.includes('CONSOLAS'))
    return 8;
  if (/TECLADO|KEYCAPS/.test(nom)) return 10;
  if (cat.includes('SILLA')) return 15;
  if (nom.includes('CARGADOR')) return 12;
  if (nom.includes('MOCHILA')) return 18;

  // Lógica Mandos
  const esMando =
    /MANDO|CONTROL|CONTROLES|NACON|WIRED|FIREWALL|FIGHTING|HORI|HANGRID|POWERA|JOY CON|JOY-CON|GAMEPAD|PRO|JOYSTICK/.test(
      primera
    );
  if (
    esMando &&
    /PS4|PLAYSTATION|SWITCH|XBOX|ENHANCED|PRO|CONTROLLER|DUALSHOCK|DUALSENSE|RAZER|INALAMBRICO|ALAMBRICO|REDRAGON|MACHENIKE|MSI|MINI|HORIPAD|CONTROL|STICK|ZERO|POWER|JOY-CON|JOY CON|REVOLUTION|THUNDEROBOT/.test(
      nom
    )
  )
    return 12;

  // Reglas con Regex Masivas
  if (
    /MEMORIA SSD|MEMORIA ADATA|UNIDAD DE ESTADO SOLIDO|SWITCH UGREEN|CABLE UGREEN|CABLE DE RED|CABLE ADAPTADOR|CABLE EXTENSOR|ADAPTADOR UGREEN|CARCASA|CABLE DE EXTENSION|CABLE MCDODO|HUB|CONECTOR PLUG|CONECTOR RJ45|CABLE HDMI|CABLE USB|CABLE|UGREEN/.test(
      nom
    )
  )
    return 10;
  if (
    /MICA|SILICONE|POWERBANK|POWER BANK|PROTECTOR NYKO|NYKO|MICROSD|MEMORIA|CABLE DE DATOS|LECTOR DE TARJETA/.test(
      nom
    )
  )
    return 12;

  // Reglas de Accesorios Compuestas
  if (cat.includes('ACCESORIOS')) {
    if (/ESTUCHE|CAMARA XIAOMI|TIMON/.test(nom)) return 12;
    if (/CAMARA|CÁMARA|WEBCAM|WED/.test(nom)) return 10;
    if (nom.includes('ADAPTADOR')) {
      if (/NINTENDO|PLAYSTATION|MICROSOFT/.test(sub)) return 12;
      if (/COMPUTO|ZONA GAMER/.test(sub)) return 10;
    }
    if (sub.includes('MICROSOFT') && nom.includes('BATERIA')) return 12;
    if (nom.includes('ADAPTADOR BLUETOOTH'))
      return sub.includes('COMPUTO') ? 12 : sub.includes('ZONA GAMER') ? 10 : 12;
    if (sub.includes('NINTENDO') && /AMIIBO|FIGURA/.test(nom)) return 14;
    if (
      sub.includes('COMPUTO') &&
      /REPETIDOR DE WIFI|EXTENSOR WIFI|SOPORTE DE ESCRITORIO|SOPORTE PARA LAPTOP/.test(nom)
    )
      return 10;
    if (sub.includes('COMPUTO') && nom.includes('BASE DE ENFRIAMIENTO')) return 12;
    if (/SOPORTE PARA SMARTPHONE|SOPORTE DE CELULAR/.test(nom)) return 12;
  }

  return 12;
}

export function comisionCoolbox(cat: string, sub: string, nom: string): number {
  if (cat.includes('VIDEOJUEGOS')) return 17;
  if (/AUDIFONO|HEADSET|AURICULAR/.test(nom)) return 19;
  if (cat.includes('CONSOLAS') || nom.includes('MONITOR')) return 12;
  if (cat.includes('FUNKOS')) return 19;
  if (cat.includes('SILLA') || /SILLA GAMER/.test(nom)) return 15;
  if (nom.includes('DISCO DURO')) return 22;
  if (/TIMON|RACING WHEEL|VOLANTE/.test(nom)) return 12;
  if (nom.includes('GAMEPAD')) return 17;
  if (/LECTOR DE TARJETAS/.test(nom)) return 19;
  if (cat.includes('GIFCARDS') || /GIFT CARD|GIFTCARD|TARGETA|PLAYSTATION PLUS/.test(nom)) return 17;
  if (/GAME TRAVELER|ESTUCHE|PROTECTOR/.test(nom)) return 17;
  if (
    /NYKO|BACKLBONE|POWER KIT|COVER|SILICONE COVER|MICA DE VIDRIO|POWER STAND|CABLE HDMI HORI|USB CONVERTER|UNIDAD DE ESTADO SOLIDO|BASE DE ENFRIAMIENTO/.test(
      nom
    )
  )
    return 17;
  if (
    /TECLADO|MOUSE|RATON|KEYCAPS|WEB CAM|KIT SWITCHES|PARLANTE|HUB|ESTABILIZADOR|PILA|POWER BANK|POWERBANK|CABLE|SOPORTE/.test(
      nom
    )
  )
    return 19;

  // Reglas específicas
  if (cat.includes('ACCESORIOS')) {
    if (sub.includes('NINTENDO') && nom.includes('AMIIBO')) return 17;
    if (sub.includes('NINTENDO') && nom.includes('FIGURA')) return 19;
    if (nom.includes('CARGADOR')) return sub.includes('COMPUTO') ? 19 : 17;
    if (nom.includes('ADAPTADOR')) return 17;
    if (sub.includes('ZONA GAMER') && nom.includes('MICROFONO')) return 19;
    if (sub.includes('ZONA GAMER') && nom.includes('META QUEST')) return 12;
    if (nom.includes('CAMARA')) return sub.includes('COMPUTO') ? 19 : 17;
  }

  return 17;
}

export function comisionIntercorp(cat: string, sub: string, nom: string): number {
  if (cat.includes('CONSOLAS') && sub.includes('NINTENDO')) return 9;
  if (nom.includes('CONSOL') && /PS5|PLAYSTATION 5|REMOTE|PS4|PLAYSTATION 4|XBOX/.test(nom))
    return nom.includes('PS4') || nom.includes('XBOX') ? 10 : 9;
  if (nom.includes('REMOTE PLAYSTATION 5')) return 9;
  if (/LAPTOP/.test(nom)) return 10;
  if (sub.includes('CELULARES')) return 9;

  // Mandos
  const primera = nom.split(' ')[0] || '';
  const esMando =
    /MANDO|CONTROL|CONTROLES|NACON|WIRED|FIREWALL|FIGHTING|HORI|HANGRID|POWERA|JOY CON|JOY-CON|GAMEPAD|PRO|JOYSTICK/.test(
      primera
    );
  if (
    esMando &&
    /PS4|PLAYSTATION|SWITCH|XBOX|ENHANCED|PRO|CONTROLLER|DUALSHOCK|DUALSENSE|RAZER|INALAMBRICO|ALAMBRICO|REDRAGON|MACHENIKE|MSI|MINI|HORIPAD|CONTROL|STICK|ZERO|POWER|JOY-CON|JOY CON|REVOLUTION|THUNDEROBOT/.test(
      nom
    )
  )
    return 12;

  if (cat.includes('VIDEOJUEGOS')) return 10;
  if (/PARLANTE INTELIGENTE|ALEXA|ECHO DOT/.test(nom)) return 13;
  if (cat.includes('SILLA')) return 13;
  if (
    /FUNKO/.test(cat) ||
    /POWERBANK|POWER BANK|SOPORTE DE CELULAR|SOPORTE DE TELEFONO|SOPORTE MAGNETICO|SOPORTE TELEFONO/.test(
      nom
    )
  )
    return 15;
  if (sub.includes('TELEVISORES')) return 10;
  if (sub.includes('MERCHANDISING')) return 0;
  if (/GIFCARD/.test(cat) || nom.includes('TARJETA GIFT')) return 12;
  if (nom.includes('ROUTER')) return 13;

  if (
    /DISCO DURO|MOUSE|PAD MOUSE|MOUSE PAD|TECLADO|AUDIFONO|SMARTWATCH|SMARTBAND|AMIIBO|AURICULAR|CABLE|ADAPTADOR|BASE DE CARGA|BASE CARGADOR|PROTECTOR|CASE|HUB|CARGADOR|REPOSA|MEMORIA|KIT|SOPORTE/.test(
      nom
    )
  )
    return 12;
  if (/MONITOR|PARLANTE|ALTAVOCES/.test(nom)) return 11;
  if (/TV STICK|TV BOX|CHROMECAST/.test(nom)) return 12;
  if (
    /MICROFONO|GAME TRAVELER|ESTUCHE|TIMON|VOLANTE|MOCHILA|BOLSO|BOLSA|MICA|RING FIT|HANDGRIP|LENTES|LENTE|KEYCAPS|RECEPTOR|ESTACION DE CARGA|SPLITTER|INFLADOR|CONMUTADOR|LECTOR|BUSCADOR SMART|SWITCH UGREEN|TARJETA DE EXPANSION|META QUEST|CAPTURADOR DE VIDEO/.test(
      nom
    )
  )
    return 12;

  return 12;
}

export function comisionShopstar(cat: string): number {
  if (/FUNKO|ZONA GEEK/.test(cat)) return 15;
  if (cat.includes('SILLA')) return 15;
  if (/VIDEOJUEGOS|ACCESORIOS|GIFCARDS/.test(cat)) return 9.5;
  if (cat.includes('CONSOLAS')) return 9;
  return 10;
}

export function comisionLuxury(cat: string, sub: string, nom: string): number {
  if (cat.includes('CONSOLAS')) return 10;
  if (/CELULAR/.test(sub)) return 10;

  const primera = nom.split(' ')[0] || '';
  const esMando =
    /MANDO|CONTROL|CONTROLES|NACON|WIRED|FIREWALL|FIGHTING|HORI|HANGRID|POWERA|JOY CON|JOY-CON|GAMEPAD|PRO|JOYSTICK/.test(
      primera
    );
  if (
    esMando &&
    /PS4|PLAYSTATION|SWITCH|XBOX|ENHANCED|PRO|CONTROLLER|DUALSHOCK|DUALSENSE|RAZER|INALAMBRICO|ALAMBRICO|REDRAGON|MACHENIKE|MSI|MINI|HORIPAD|CONTROL|STICK|ZERO|POWER|JOY-CON|JOY CON|REVOLUTION|THUNDEROBOT/.test(
      nom
    )
  )
    return 15;

  if (/VIDEOJUEGOS|ACCESORIOS|SILLA|FUNKO|ZONA GEEK|GIFCARD|GIFT CARD|GAMER/.test(cat)) return 15;
  if (/GAMER/.test(sub)) return 15;

  return 15;
}

export function comisionJuntoz(cat: string): number {
  if (cat.includes('CONSOLAS')) return 9.5;
  return 10;
}

export function comisionYape(cat: string, sub: string, nom: string): number {
  if (sub.includes('MERCHANDISING')) return 0;

  const primera = nom.split(' ')[0] || '';
  const esMando =
    /MANDO|CONTROL|CONTROLES|NACON|WIRED|FIREWALL|FIGHTING|HORI|HANGRID|POWERA|JOY CON|JOY-CON|GAMEPAD|PRO|JOYSTICK/.test(
      primera
    );
  if (
    esMando &&
    /PS4|PLAYSTATION|SWITCH|XBOX|ENHANCED|PRO|CONTROLLER|DUALSHOCK|DUALSENSE|RAZER|INALAMBRICO|ALAMBRICO|REDRAGON|MACHENIKE|MSI|MINI|HORIPAD|CONTROL|STICK|ZERO|POWER|JOY-CON|JOY CON|REVOLUTION|THUNDEROBOT/.test(
      nom
    )
  )
    return 10;

  if (primera === 'LAPTOP' && /HP|LENOVO|GAMER|MSI|ACER|DELL|REFACCIONADO/.test(nom)) return 9;

  if (
    sub.includes('NINTENDO') &&
    /GAME TRAVELER DELUXE|ESTUCHE|STARTER KIT|ADAPTADOR|MICA|FUNDA|MULTICARGADOR|SKIN|PROTECTOR|CARGADOR|AMIIBO|HORI|SILICONE|MASTER PACK|CASE|STEALTH|BATERIA|CAMARA PLANTA|CAMARA|HANDGRIP|MALETIN/.test(
      nom
    )
  )
    return 9;

  if (/SILLA|FUNKO/.test(cat) || /SILLA|MOCHILA|FUNKO POP|PARLANTE|HUB|CABLE/.test(nom)) return 15;
  if (cat.includes('GIFCARD') || nom.includes('TARJETA GIFTCARD')) return 12;
  if (/TECLADO|MOUSE|MICROFONO|ESTABILIZADOR|AUDIFONO|HEADSET|AURICULAR/.test(nom)) return 12;
  if (/DISCO DURO|MEMORIA|DISCO SOLIDO|POWERBANK|POWER BANK|SSD|ECHO|ALEXA/.test(nom)) return 12;
  if (cat.includes('CONSOLAS') || /MONITOR|COVER|TELEVISOR|SMART TV/.test(nom)) return 9;
  if (cat.includes('VIDEOJUEGOS') || /VOLANTE|TIMON|PALANCA/.test(nom)) return 10;
  if (cat.includes('ACCESORIOS') || nom.includes('FIGURA')) return 15;

  return 12;
}

export function comisionPaginaWebYQuest(cat: string, nom: string): number {
  if (cat.includes('CONSOLAS')) return 8;
  if (cat.includes('FUNKOS')) return 10;
  if (cat.includes('GIFCARD')) return 10;
  if (cat.includes('SILLA')) return 12;
  if (cat.includes('VIDEOJUEGOS')) return 8;
  if (/AUDIFONO|HEADSET|AURICULAR|ALTAVOZ|PARLANTE/.test(nom)) return 8;

  const primera = nom.split(' ')[0] || '';
  const esMando =
    /MANDO|CONTROL|CONTROLES|NACON|WIRED|FIREWALL|FIGHTING|HORI|HANGRID|POWERA|JOY CON|JOY-CON|GAMEPAD|PRO|JOYSTICK/.test(
      primera
    );
  if (esMando) return 10;

  return 10;
}

export function resolveMarketplaceCommission(
  marketplaceId: MarketplaceId,
  product: Product
): number {
  // Canales planos fijos
  if (marketplaceId === 'ripley') return 12;
  if (marketplaceId === 'rappi') return 11;
  if (marketplaceId === 'diners') return 13;
  if (marketplaceId === 'calidda') return 15;
  if (marketplaceId === 'claro') return 11;
  if (marketplaceId === 'mesajil') return 13;
  if (marketplaceId === 'efe') return 0; // Manejado por lógica tributaria especial

  const cat = normalizeText(product.categoria);
  const sub = normalizeText(product.subcategoria);
  const nom = normalizeText(product.nombre);

  switch (marketplaceId) {
    case 'sagaFalabella':
      return comisionSagaFalabella(cat, sub, nom);
    case 'mercadoLibre':
      return comisionMercadoLibre(cat, sub, nom);
    case 'coolbox':
      return comisionCoolbox(cat, sub, nom);
    case 'intercorp':
      return comisionIntercorp(cat, sub, nom);
    case 'shopstar':
      return comisionShopstar(cat);
    case 'luxury':
      return comisionLuxury(cat, sub, nom);
    case 'juntoz':
      return comisionJuntoz(cat);
    case 'yape':
      return comisionYape(cat, sub, nom);
    case 'paginaWeb':
    case 'questTime':
      return comisionPaginaWebYQuest(cat, nom);
    default:
      return 12;
  }
}
