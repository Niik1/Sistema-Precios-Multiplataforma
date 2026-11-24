function comisionYape(categoria, subcategoria, nombre) {
  const normalizeStr = (str) => (str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const cat = normalizeStr(categoria);
  const sub = normalizeStr(subcategoria);
  const nom = normalizeStr(nombre);

  // 0. Merchandising (0%)
  if (sub.includes('MERCHANDISING')) return 0; 

  // 1. Mandos / Controles (10%)
  const primera = nom.split(' ')[0] || ''; 
  const esMando = /MANDO|CONTROL|CONTROLES|NACON|WIRED|FIREWALL|FIGHTING|HORI|HANGRID|POWERA|JOY CON|JOY-CON|GAMEPAD|PRO|JOYSTICK/.test(primera); 
  
  if (esMando && /PS4|PLAYSTATION|SWITCH|XBOX|ENHANCED|PRO|CONTROLLER|DUALSHOCK|DUALSENSE|RAZER|INALAMBRICO|ALAMBRICO|REDRAGON|MACHENIKE|MSI|MINI|HORIPAD|CONTROL|STICK|ZERO|POWER|JOY-CON|JOY CON|REVOLUTION|THUNDEROBOT/.test(nom)) {
    return 10; 
  }

  // 2. Laptops Específicas (9%)
  if (primera === 'LAPTOP' && /HP|LENOVO|GAMER|MSI|ACER|DELL|REFACCIONADO/.test(nom)) return 9; 

  // 3. Reglas Específicas Cruzadas
  if (sub.includes('NINTENDO') && /GAME TRAVELER DELUXE|ESTUCHE|STARTER KIT|ADAPTADOR|MICA|FUNDA|MULTICARGADOR|SKIN|PROTECTOR|CARGADOR|AMIIBO|HORI|SILICONE|MASTER PACK|CASE|STEALTH|BATERIA|CAMARA PLANTA|CAMARA|HANDGRIP|MALETIN/.test(nom)) return 9; 
  if (/COMPUTO|ZONA GAMER/.test(sub) && nom.includes('CAMARA')) return 12; 

  // 4. Bloque 15% (Se evalúa antes del 12% para evitar el conflicto MOUSE vs MOUSE PAD)
  if (/SILLA|FUNKO/.test(cat) || /SILLA|MOCHILA|FUNKO POP|PARLANTE|HUB|CABLE|SWITCH|TP-LINK|TP LINK|MOUSE PAD|PAD MOUSE|TRIPODE|REGLETA|SOPORTE|PULSERA XIAOMI|ADAPTADOR|TARJETA DE EXPANSION|SPLITTER|KIT|CONMUTADOR|PALO SELFIE|LENTES VR|INFLADOR|SMARTBAND|RASTREADOR|CONECTOR RJ45|KEYCAPS|TRANSMISOR|META QUEST|ROUTER|RECEPTOR|LECTOR|REPOSA MUÑECAS|RESPOSA MUÑECAS|CAPTURADOR DE VIDEO|ALTAVOCES/.test(nom)) {
    return 15; 
  }

  // 5. Bloque 12% (Periféricos, Almacenamiento, Audio y Streaming)
  if (cat.includes('GIFCARD') || nom.includes('TARJETA GIFTCARD')) return 12; 
  if (/TECLADO|MOUSE|MICROFONO|ESTABILIZADOR|AUDIFONO|HEADSET|AURICULAR/.test(nom)) return 12; 
  if (/DISCO DURO|MEMORIA|DISCO SOLIDO|POWERBANK|POWER BANK|DISCO SSD|UNIDAD DE ESTADO SOLIDO|SSD|ECHO|ALEXA/.test(nom)) 
  if (/TV BOX|TV STICK|GOOGLE TV|AMAZON FIRE|AMAZON-FIRE|CHROMECAST|XIAOMI MI TV/.test(nom)) return 12; 

  // 6. Bloque 9% (Consolas, Monitores y Televisores)
  if (cat.includes('CONSOLAS') || /MONITOR|COVER|TELEVISOR|SMART TV/.test(nom)) return 9; 

  // 7. Bloque 10% (Videojuegos y Volantes)
  if (cat.includes('VIDEOJUEGOS') || /VOLANTE|TIMON|PALANCA/.test(nom)) return 10; 

  // 8. Regla Final / General (Accesorios y Figuras)
  if (cat.includes('ACCESORIOS') || nom.includes('FIGURA')) return 15; 

  return '';
}