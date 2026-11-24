function comisionEfe(categoria, subcategoria, nombre) {
  const normalizeStr = (str) => (str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const cat = normalizeStr(categoria);

  if (/VIDEOJUEGOS|GIFCARD/.test(cat)) return 15;
  if (cat.includes('SILLA')) return 25;

  return '';
}