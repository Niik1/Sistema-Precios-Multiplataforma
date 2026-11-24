function comisionShopstar(categoria, subcategoria, nombre) {
  const normalizeStr = (str) => (str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const cat = normalizeStr(categoria);

  if (/FUNKO|ZONA GEEK/.test(cat)) return 15;
  if (cat.includes('SILLA')) return 15;
  if (/VIDEOJUEGOS|ACCESORIOS|GIFCARDS/.test(cat)) return 9.5;
  if (cat.includes('CONSOLAS')) return 9;

  return '';
}