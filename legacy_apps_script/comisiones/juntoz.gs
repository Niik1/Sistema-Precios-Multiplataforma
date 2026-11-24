function comisionJuntoz(categoria, subcategoria, nombre) {
  const normalizeStr = (str) => (str || '').toUpperCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const cat = normalizeStr(categoria);

  if (cat.includes('CONSOLAS')) return 9.5;
  
  // Comisión plana para el resto
  return 10;
}