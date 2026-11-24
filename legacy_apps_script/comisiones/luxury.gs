function comisionLuxury(categoria, subcategoria, nombre) {
  const normalizeStr = (str) => (str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const cat = normalizeStr(categoria);
  const sub = normalizeStr(subcategoria);
  const nom = normalizeStr(nombre);

  if (cat.includes('CONSOLAS')) return 10;
  if (/CELULAR/.test(sub)) return 10;

  // Lógica de Mandos
  const primera = nom.split(' ')[0] || '';
  const esMando = /MANDO|CONTROL|CONTROLES|NACON|WIRED|FIREWALL|FIGHTING|HORI|HANGRID|POWERA|JOY CON|JOY-CON|GAMEPAD|PRO|JOYSTICK/.test(primera);
  
  if (esMando && /PS4|PLAYSTATION|SWITCH|XBOX|ENHANCED|PRO|CONTROLLER|DUALSHOCK|DUALSENSE|RAZER|INALAMBRICO|ALAMBRICO|REDRAGON|MACHENIKE|MSI|MINI|HORIPAD|CONTROL|STICK|ZERO|POWER|JOY-CON|JOY CON|REVOLUTION|THUNDEROBOT/.test(nom)) {
    return 15;
  }

  if (/VIDEOJUEGOS|ACCESORIOS|SILLA|FUNKO|ZONA GEEK|GIFCARD|GIFT CARD|GAMER/.test(cat)) return 15;
  if (/GAMER/.test(sub)) return 15;

  return 15;
}