function comisionIntercorp(categoria, subcategoria, nombre) {
  const normalizeStr = (str) => (str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const cat = normalizeStr(categoria);
  const sub = normalizeStr(subcategoria);
  const nom = normalizeStr(nombre);

  // 1. Consolas y Celulares
  if (cat.includes('CONSOLAS') && sub.includes('NINTENDO')) return 9;
  if (nom.includes('CONSOL') && /PS5|PLAYSTATION 5|REMOTE|PS4|PLAYSTATION 4|XBOX/.test(nom)) return nom.includes('PS4') || nom.includes('XBOX') ? 10 : 9;
  if (nom.includes('REMOTE PLAYSTATION 5')) return 9;
  if (/LAPTOP/.test(nom)) return 10;
  if (sub.includes('CELULARES')) return 9;

  // 2. Mandos
  const primera = nom.split(' ')[0] || '';
  const esMando = /MANDO|CONTROL|CONTROLES|NACON|WIRED|FIREWALL|FIGHTING|HORI|HANGRID|POWERA|JOY CON|JOY-CON|GAMEPAD|PRO|JOYSTICK/.test(primera);
  if (esMando && /PS4|PLAYSTATION|SWITCH|XBOX|ENHANCED|PRO|CONTROLLER|DUALSHOCK|DUALSENSE|RAZER|INALAMBRICO|ALAMBRICO|REDRAGON|MACHENIKE|MSI|MINI|HORIPAD|CONTROL|STICK|ZERO|POWER|JOY-CON|JOY CON|REVOLUTION|THUNDEROBOT/.test(nom)) return 12;

  // 3. Reglas Generales Rápidas
  if (cat.includes('VIDEOJUEGOS')) return 10;
  if (/PARLANTE INTELIGENTE|ALEXA|ECHO DOT/.test(nom)) return 13;
  if (cat.includes('SILLA')) return 13;
  if (/FUNKO/.test(cat) || /POWERBANK|POWER BANK|SOPORTE DE CELULAR|SOPORTE DE TELEFONO|SOPORTE MAGNETICO|SOPORTE TELEFONO/.test(nom)) return 15;
  if (sub.includes('TELEVISORES')) return 10;
  if (sub.includes('MERCHANDISING')) return 0;
  if (/GIFCARD/.test(cat) || nom.includes('TARJETA GIFT')) return 12;
  if (nom.includes('ROUTER')) return 13;

  // 4. Agrupaciones Masivas (Regex)
  if (/DISCO DURO|MOUSE|PAD MOUSE|MOUSE PAD|TECLADO|AUDIFONO|SMARTWATCH|SMARTBAND|AMIIBO|AURICULAR|CABLE|ADAPTADOR|BASE DE CARGA|BASE CARGADOR|PROTECTOR|CASE|HUB|CARGADOR|REPOSA|MEMORIA|KIT|SOPORTE/.test(nom)) return 12;
  if (/MONITOR|PARLANTE|ALTAVOCES/.test(nom)) return 11;
  if (/TV STICK|TV BOX|CHROMECAST/.test(nom)) return 12;
  if (/MICROFONO|GAME TRAVELER|ESTUCHE|TIMON|VOLANTE|MOCHILA|BOLSO|BOLSA|MICA|RING FIT|HANDGRIP|LENTES|LENTE|KEYCAPS|RECEPTOR|ESTACION DE CARGA|SPLITTER|INFLADOR|CONMUTADOR|LECTOR|BUSCADOR SMART|SWITCH UGREEN|TARJETA DE EXPANSION|META QUEST|CAPTURADOR DE VIDEO/.test(nom)) return 12;

  // 5. Reglas Compuestas Especificas
  if (sub.includes('COMPUTO') && nom.includes('CABLE HDMI')) return 14;
  if (sub.includes('PLAYSTATION') && nom.includes('CABLE HDMI')) return 12;
  if (/PLAYSTATION|NINTENDO/.test(sub) && nom.includes('CAMARA')) return 12;
  if (/COMPUTO|ZONA GAMER/.test(sub) && nom.includes('CAMARA')) return 13;
  if (cat.includes('ACCESORIOS') && sub.includes('NINTENDO') && nom.includes('FIGURA')) return 15;

  return '';
}