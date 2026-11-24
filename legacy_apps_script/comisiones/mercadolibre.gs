function comisionMercadoLibre(categoria, subcategoria, nombre) {
  const normalizeStr = (str) => (str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const cat = normalizeStr(categoria);
  const sub = normalizeStr(subcategoria);
  const nom = normalizeStr(nombre);

  const primera = nom.split(' ')[0] || '';
  
  // Reglas Directas
  if (/MOUSE/.test(primera) && nom.includes('MOUSE')) return 10;
  if (/MOUSE PAD|PAD MOUSE|MICROFONO/.test(nom)) return 10;
  if (/MONITOR|SMARTBAND|SMARTWATCH|PULSERA XIAOMI|REDMI WATCH|XIAOMI SMART BAND|RELOJ XIAOMI/.test(nom)) return 11;
  if (/IPAD|TELEVISOR|SMART TV/.test(nom)) return 8;
  if (sub.includes('CELULARES') || cat.includes('VIDEOJUEGOS')) return 8;
  if (cat.includes('FUNKOS')) return 14;
  if (sub.includes('MERCHANDISING')) return 0;
  if (/GIFCARD/.test(sub) || nom.includes('GIFT CARD')) return 15;
  if (/AUDIFONO|HEADSET|AURICULAR|PARLANTE|ALEXA|ECHO|HEY GOOGLE/.test(nom) || cat.includes('CONSOLAS')) return 8;
  if (/TECLADO|KEYCAPS/.test(nom)) return 10;
  if (cat.includes('SILLA')) return 15;
  if (nom.includes('CARGADOR')) return 12;
  if (nom.includes('MOCHILA')) return 18;

  // Lógica Mandos
  const esMando = /MANDO|CONTROL|CONTROLES|NACON|WIRED|FIREWALL|FIGHTING|HORI|HANGRID|POWERA|JOY CON|JOY-CON|GAMEPAD|PRO|JOYSTICK/.test(primera);
  if (esMando && /PS4|PLAYSTATION|SWITCH|XBOX|ENHANCED|PRO|CONTROLLER|DUALSHOCK|DUALSENSE|RAZER|INALAMBRICO|ALAMBRICO|REDRAGON|MACHENIKE|MSI|MINI|HORIPAD|CONTROL|STICK|ZERO|POWER|JOY-CON|JOY CON|REVOLUTION|THUNDEROBOT/.test(nom)) return 12;

  // Reglas con Regex Masivas
  if (/MEMORIA SSD|MEMORIA ADATA|UNIDAD DE ESTADO SOLIDO|SWITCH UGREEN|CABLE UGREEN|CABLE DE RED|CABLE ADAPTADOR|CABLE EXTENSOR|ADAPTADOR UGREEN|CARCASA|CABLE DE EXTENSION|CABLE MCDODO|HUB|CONECTOR PLUG|CONECTOR RJ45|CABLE HDMI|CABLE USB|CABLE|UGREEN/.test(nom)) return 10;
  if (/MICA|SILICONE|POWERBANK|POWER BANK|PROTECTOR NYKO|NYKO|MICROSD|MEMORIA|CABLE DE DATOS|LECTOR DE TARJETA/.test(nom)) return 12;

  // Reglas de Accesorios Compuestas
  if (cat.includes('ACCESORIOS')) {
    if (/ESTUCHE|CAMARA XIAOMI|TIMON/.test(nom)) return 12;
    if (/CAMARA|CÁMARA|WEBCAM|WED/.test(nom)) return 10;
    if (nom.includes('ADAPTADOR')) {
      if (/NINTENDO|PLAYSTATION|MICROSOFT/.test(sub)) return 12;
      if (/COMPUTO|ZONA GAMER/.test(sub)) return 10;
    }
    if (sub.includes('MICROSOFT') && nom.includes('BATERIA')) return 12;
    if (nom.includes('ADAPTADOR BLUETOOTH')) return sub.includes('COMPUTO') ? 12 : (sub.includes('ZONA GAMER') ? 10 : '');
    if (sub.includes('NINTENDO') && /AMIIBO|FIGURA/.test(nom)) return 14;
    if (sub.includes('COMPUTO') && /REPETIDOR DE WIFI|EXTENSOR WIFI|SOPORTE DE ESCRITORIO|SOPORTE PARA LAPTOP/.test(nom)) return 10;
    if (sub.includes('COMPUTO') && nom.includes('BASE DE ENFRIAMIENTO')) return 12;
    if (/SOPORTE PARA SMARTPHONE|SOPORTE DE CELULAR/.test(nom)) return 12;
  }

  return '';
}