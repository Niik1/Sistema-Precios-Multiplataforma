function comisionSagaFalabella(categoria, subcategoria, nombre) {
  const normalizeStr = (str) => (str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const cat = normalizeStr(categoria);
  const sub = normalizeStr(subcategoria);
  const nom = normalizeStr(nombre);

  if (cat.includes('CONSOLAS') && /TELEVISORES|PLAYSTATION|CELULARES/.test(sub)) return 8;

  // Reglas de Audífonos
  if (cat.includes("ACCESORIOS") && /AUDIFONO|HEADSET|AURICULAR/.test(nom)) {
    if (/COMPUTO|ZONA GAMER/.test(sub)) return 10;
    if (/PLAYSTATION|NINTENDO|MICROSOFT/.test(sub)) return 15;
  }

  if (cat.includes('VIDEOJUEGOS')) return 12;

  // Bloque del 10%
  if (cat.includes('ACCESORIOS') && sub.includes('COMPUTO') && nom.includes('DISCO DURO SSD')) return 10;
  if (/PARLANTE UE WONDERBOOM|PARLANTE CREATIVE|PARLANTE INTELIGENTE|MONITOR|MICROFONO|CAMARA|IPAD|ALEXA|ECHO|SMARTWATCH|PULSERA XIAOMI|REDMI WATCH|XIAOMI SMART BAND|RELOJ XIAOMI|SMARTBAND/.test(nom)) return 10;
  if (cat.includes('ACCESORIOS') && sub.includes('ZONA GAMER') && /MICROFONO|BRAZO/.test(nom)) return 10;
  if (nom.includes('DISCO DURO') && /EXTERNO|SEAGATE/.test(nom)) return 10;

  // Lógica Mandos (15%)
  const primera = nom.split(' ')[0] || '';
  const esMando = /MANDO|CONTROL|CONTROLES|NACON|WIRED|FIREWALL|FIGHTING|HORI|HANGRID|POWERA|JOY CON|JOY-CON|GAMEPAD|PRO|JOYSTICK/.test(primera);
  if (esMando && /PS4|PLAYSTATION|SWITCH|XBOX|ENHANCED|PRO|CONTROLLER|DUALSHOCK|DUALSENSE|RAZER|INALAMBRICO|ALAMBRICO|REDRAGON|MACHENIKE|MSI|MINI|HORIPAD|CONTROL|STICK|ZERO|POWER|JOY-CON|JOY CON|REVOLUTION|THUNDEROBOT/.test(nom)) return 15;

  // Bloque Masivo del 15%
  if (cat.includes('ACCESORIOS')) {
    if (sub.includes('NINTENDO') && nom.includes('FIGURA')) return 15;
    if (sub.includes('COMPUTO') && /EXTENSOR WIFI|REPETIDOR DE WIFI/.test(nom)) return 15;
    if (sub.includes('PLAYSTATION') && nom.includes('SSD')) return 15;
    if (/MICA|CARGADOR|ESTUCHE|HUB|TIMON|VOLANTE|RACING WHEEL|PARLANTE|KIT/.test(nom)) return 15;
  }

  if (/MEMORIA|UGREEN|SOPORTE|TRIPODE|COOLER|TARJETA GIFT|TECLADO|MOUSE|MUÑECAS|ALTAVOCES|MOCHILA|KEYCAPS|GAME TRAVELER|MALETIN|AMIIBO|CABLE|ADAPTADOR|BASE DE CARGA|POWERBANK|POWER BANK|CARGADOR|PROTECTOR|HANDGRIP|ESTABILIZADOR|REGLETA|SUPRESOR|RECEPTOR|ESTACION DE CARGA|CASE|SILICONE|SILICONA|BOLSO|TP-LINK|BACKBONE|UPS|META QUEST|BATERIA|BASE DE ENFRIAMIENTO|LENTES VR|LENTES DE REALIDAD VIRTUAL|TV STICK|TV BOX|CHROMECAST|STREAMING|MICROSD/.test(nom) || /GIFCARD|SILLA|FUNKO/.test(cat)) {
    return 15;
  }

  return '';
}