function comisionCoolbox(categoria, subcategoria, nombre) {
  // Normalizamos textos: mayúsculas, sin espacios extra y quitamos tildes
  const normalizeStr = (str) => {
    if (!str) return '';
    return str.toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const cat = normalizeStr(categoria);
  const sub = normalizeStr(subcategoria);
  const nom = normalizeStr(nombre);

  // ==========================================
  // 1. REGLAS GENERALES Y DIRECTAS (REGEX)
  // ==========================================
  
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
  if (/NYKO|BACKLBONE|POWER KIT|COVER|SILICONE COVER|MICA DE VIDRIO|POWER STAND|CABLE HDMI HORI|USB CONVERTER|UNIDAD DE ESTADO SOLIDO|BASE DE ENFRIAMIENTO/.test(nom)) return 17;
  if (/TECLADO|MOUSE|RATON|KEYCAPS|WEB CAM|KIT SWITCHES|PARLANTE|HUB|ESTABILIZADOR|PILA|POWER BANK|POWERBANK|CABLE|SOPORTE/.test(nom)) return 19;

  // ==========================================
  // 2. REGLAS ESPECÍFICAS (Cat + Subcat + Nom)
  // ==========================================
  
  const reglas = [
    // Accesorios Nintendo
    { c: 'ACCESORIOS', s: 'NINTENDO', n: 'AMIIBO', valor: 17 },
    { c: 'ACCESORIOS', s: 'NINTENDO', n: 'FIGURA', valor: 19 },
    
    // Cargadores
    { c: 'ACCESORIOS', s: 'NINTENDO', n: 'CARGADOR', valor: 17 },
    { c: 'ACCESORIOS', s: 'MICROSOFT', n: 'CARGADOR', valor: 17 },
    { c: 'ACCESORIOS', s: 'PLAYSTATION', n: 'CARGADOR', valor: 17 },
    { c: 'ACCESORIOS', s: 'ZONA GAMER', n: 'CARGADOR', valor: 17 },
    { c: 'ACCESORIOS', s: 'COMPUTO', n: 'CARGADOR', valor: 19 },
    
    // Adaptadores
    { c: 'ACCESORIOS', s: 'NINTENDO', n: 'ADAPTADOR', valor: 17 },
    { c: 'ACCESORIOS', s: 'MICROSOFT', n: 'ADAPTADOR', valor: 17 },
    { c: 'ACCESORIOS', s: 'PLAYSTATION', n: 'ADAPTADOR', valor: 17 },
    { c: 'ACCESORIOS', s: 'ZONA GAMER', n: 'ADAPTADOR', valor: 17 },
    { c: 'ACCESORIOS', s: 'COMPUTO', n: 'ADAPTADOR', valor: 17 },
    
    // Micrófonos y Lentes VR
    { c: 'ACCESORIOS', s: 'ZONA GAMER', n: 'MICROFONO', valor: 19 },
    { c: 'ACCESORIOS', s: 'ZONA GAMER', n: 'META QUEST', valor: 12 },
    
    // Cámaras
    { c: 'ACCESORIOS', s: 'PLAYSTATION', n: 'CAMARA', valor: 17 },
    { c: 'ACCESORIOS', s: 'COMPUTO', n: 'CAMARA', valor: 19 },
    { c: 'ACCESORIOS', s: 'NINTENDO', n: 'CAMARA', valor: 17 },
    { c: 'ACCESORIOS', s: 'ZONA GAMER', n: 'CAMARA', valor: 19 },
    
    // Mochilas
    { c: 'ACCESORIOS', s: 'ZONA GAMER', n: 'MOCHILA', valor: 17 },
    { c: 'ACCESORIOS', s: 'COMPUTO', n: 'MOCHILA', valor: 17 },
    { c: 'ACCESORIOS', s: 'NINTENDO', n: 'MOCHILA', valor: 17 },
    
    // Memorias
    { c: 'ACCESORIOS', s: 'PLAYSTATION', n: 'MEMORIA', valor: 17 },
    { c: 'ACCESORIOS', s: 'NINTENDO', n: 'MEMORIA', valor: 22 },
    { c: 'ACCESORIOS', s: 'COMPUTO', n: 'MEMORIA', valor: 22 },
    
    // Smartbands, Smartwatches, Localizadores, Baterías y Redes
    { c: 'ACCESORIOS', s: 'COMPUTO', n: 'SMARTBAND', valor: 15 },
    { c: 'ACCESORIOS', s: 'COMPUTO', n: 'SMART BAND', valor: 15 },
    { c: 'ACCESORIOS', s: 'COMPUTO', n: 'SMARTWATCH', valor: 15 },
    { c: 'ACCESORIOS', s: 'COMPUTO', n: 'LOCALIZADOR', valor: 19 },
    { c: 'ACCESORIOS', s: 'MICROSOFT', n: 'BATERIA', valor: 17 },
    { c: 'ACCESORIOS', s: 'COMPUTO', n: 'REPETIDOR DE WIFI', valor: 17 },
    { c: 'ACCESORIOS', s: 'COMPUTO', n: 'EXTENSOR WIFI', valor: 17 }
  ];

  // Motor evaluador de reglas compuestas
  for (let regla of reglas) {
    const cumpleCat = regla.c ? cat.includes(regla.c) : true;
    const cumpleSub = regla.s ? sub.includes(regla.s) : true;
    const cumpleNom = regla.n ? nom.includes(regla.n) : true;

    if (cumpleCat && cumpleSub && cumpleNom) {
      return regla.valor;
    }
  }

  // ==========================================
  // 3. REGLAS DE MANDOS / CONTROLES
  // ==========================================
  
  const palabras = nom.split(' ').filter(p => p);
  const primera = palabras[0] || '';
  
  const esMando = /MANDO|CONTROL|CONTROLES|NACON|WIRED|FIREWALL|FIGHTING|HORI|HANGRID|POWERA|JOY CON|JOY-CON|GAMEPAD|PRO|JOYSTICK/.test(primera);
  
  if (esMando) {
    if (/PS4|PLAYSTATION|PS5|SWITCH|XBOX|ENHANCED|PRO|CONTROLLER|DUALSHOCK|DUALSENSE|RAZER|INALAMBRICO|ALAMBRICO|REDRAGON|MACHENIKE|MSI|MINI|HORIPAD|CONTROL|STICK|ZERO|POWERA|POWER|JOY-CON|JOY CON|REVOLUTION|THUNDEROBOT/.test(nom)) {
      return 17;
    }
  }

  // Retorno por defecto si ningún escenario coincide
  return '';
}