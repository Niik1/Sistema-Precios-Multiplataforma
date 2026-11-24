function comisionQuestTime(categoria, subcategoria, nombre) {
  const normalizeStr = (str) => (str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const cat = normalizeStr(categoria);
  const sub = normalizeStr(subcategoria);
  const nom = normalizeStr(nombre);

  if (cat.includes('CONSOLAS')) return 8;
  if (cat.includes('FUNKOS')) return 10;
  if (cat.includes('GIFCARD')) return 10;
  if (cat.includes('SILLA')) return 12;
  if (cat.includes('VIDEOJUEGOS')) return 8;

  if (cat.includes('ACCESORIOS') && sub.includes('CELULARES')) return 8;
  if (cat.includes('ACCESORIOS') && /ALTAVOZ|ALTAVOCES|PARLANTE/.test(nom)) return 8;
  if (/AUDIFONO|HEADSET|AURICULAR/.test(nom)) return 8;
  if (/TV BOX|TV STICK|GOOGLE TV|AMAZON FIRE|AMAZON-FIRE|CHROMECAST|XIAOMI MI TV/.test(nom)) return 8;

  // Lógica de Mandos
  const primera = nom.split(' ')[0] || '';
  const esMando = /MANDO|CONTROL|CONTROLES|NACON|WIRED|FIREWALL|FIGHTING|HORI|HANGRID|POWERA|JOY CON|JOY-CON|GAMEPAD|PRO|JOYSTICK/.test(primera);
  if (esMando && /PS4|PLAYSTATION|SWITCH|XBOX|ENHANCED|PRO|CONTROLLER|DUALSHOCK|DUALSENSE|RAZER|INALAMBRICO|ALAMBRICO|REDRAGON|MACHENIKE|MSI|MINI|HORIPAD|CONTROL|STICK|ZERO|POWER|JOY-CON|JOY CON|REVOLUTION|THUNDEROBOT/.test(nom)) {
    return 10;
  }

  return 10;
}