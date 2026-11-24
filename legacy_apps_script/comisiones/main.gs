/************************************************************
 * CONFIGURACIÓN GENERAL Y COLUMNAS
 ************************************************************/
const SHEET_CONS     = 'CONSOLIDADO_COMISIONES';

// Columnas de Entrada (1 = A, 2 = B, ...)
const COL_CATEG         = 1;  // A
const COL_SUBCAT        = 2;  // B
const COL_NOMBRE        = 3;  // C
const COL_SKU           = 4;  // D

// Columnas de Salida (Comisiones)
const COL_QUESTTIME     = 5;  // E
const COL_PAGINAWEB     = 6;  // F
const COL_MERCADOLIBRE  = 7;  // G
const COL_SAGAFALABELLA = 8;  // H
const COL_JUNTOZ        = 9;  // I
const COL_INTERCORP     = 10; // J
const COL_SHOPSTAR      = 11; // K
const COL_RIPLEY        = 12; // L
const COL_RAPPI         = 13; // M
const COL_DINERS        = 14; // N
const COL_LUXURY        = 15; // O
const COL_COOLBOX       = 16; // P
const COL_CALIDDA       = 17; // Q
const COL_CLARO         = 18; // R
const COL_MESAJIL       = 19; // S
const COL_YAPE          = 20; // T
const COL_EFE           = 21; // U

/**
 * Configuración de Plataformas Dinámicas
 * Permite gestionar todas las tiendas en un solo lugar.
 */
const PLATAFORMAS_DINAMICAS = [
  { col: COL_LUXURY,        func: typeof comisionLuxury !== 'undefined' ? comisionLuxury : null },
  { col: COL_COOLBOX,       func: typeof comisionCoolbox !== 'undefined' ? comisionCoolbox : null },
  { col: COL_SAGAFALABELLA, func: typeof comisionSagaFalabella !== 'undefined' ? comisionSagaFalabella : null },
  { col: COL_INTERCORP,     func: typeof comisionIntercorp !== 'undefined' ? comisionIntercorp : null },
  { col: COL_SHOPSTAR,      func: typeof comisionShopstar !== 'undefined' ? comisionShopstar : null },
  { col: COL_MERCADOLIBRE,  func: typeof comisionMercadoLibre !== 'undefined' ? comisionMercadoLibre : null },
  { col: COL_YAPE,          func: typeof comisionYape !== 'undefined' ? comisionYape : null },
  { col: COL_EFE,           func: typeof comisionEfe !== 'undefined' ? comisionEfe : null },
  { col: COL_PAGINAWEB,     func: typeof comisionPaginaWeb !== 'undefined' ? comisionPaginaWeb : null },
  { col: COL_QUESTTIME,     func: typeof comisionQuestTime !== 'undefined' ? comisionQuestTime : null },
  { col: COL_JUNTOZ,        func: typeof comisionJuntoz !== 'undefined' ? comisionJuntoz : null }
];

/************************************************************
 * MENÚ
 *************************************************************/
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🧾 Comisiones')
    .addItem('1️⃣ Actualizar SOLO vacías', 'actualizarComisionesSoloVacias')
    .addItem('2️⃣ Recalcular TODO', 'actualizarComisionesTodo')
    .addToUi();
}

/************************************************************
 * PROCESO PRINCIPAL
 *************************************************************/

/**
 * Opción 1: Actualiza comisiones solo en celdas donde no hay valor.
 */
function actualizarComisionesSoloVacias() {
  procesarComisiones(true);
}

/**
 * Opción 2: Recalcula y sobrescribe todas las comisiones.
 */
function actualizarComisionesTodo() {
  procesarComisiones(false);
}

/**
 * Motor de procesamiento compartido para optimizar el código.
 * @param {boolean} soloVacias - Si es true, respeta valores existentes.
 */
function procesarComisiones(soloVacias) {
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEET_CONS);
  const lastRow = sh.getLastRow();
  
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert('⚠️ No hay filas de productos.');
    return;
  }

  // LEER DATOS: Se lee hasta COL_EFE para evitar errores de índice
  const data = sh.getRange(2, 1, lastRow - 1, COL_EFE).getValues();

  for (let r = 0; r < data.length; r++) {
    const categoria    = data[r][COL_CATEG  - 1];
    const subcategoria = data[r][COL_SUBCAT - 1];
    const nombre       = data[r][COL_NOMBRE - 1];
    const sku          = data[r][COL_SKU    - 1];

    if (!sku && !nombre) continue;

    // --- 1. Lógica Dinámica (Tiendas con funciones) ---
    PLATAFORMAS_DINAMICAS.forEach(plat => {
      if (plat.func) {
        const celdaActual = data[r][plat.col - 1];
        if (!soloVacias || isEmpty_(celdaActual)) {
          const v = plat.func(categoria, subcategoria, nombre);
          if (v !== '') data[r][plat.col - 1] = v;
        }
      }
    });

    // --- 2. Lógica Fija (Tiendas con porcentajes estáticos) ---
    const fijas = [
      { col: COL_RIPLEY, func: comisionRipley },
      { col: COL_RAPPI,  func: comisionRappi },
      { col: COL_DINERS, func: comisionDinersclub },
      { col: COL_CALIDDA,func: comisionCalidda },
      { col: COL_CLARO,  func: comisionClaro },
      { col: COL_MESAJIL,func: comisionMesajil }
    ];

    fijas.forEach(plat => {
      if (!soloVacias || isEmpty_(data[r][plat.col - 1])) {
        data[r][plat.col - 1] = plat.func();
      }
    });
  }

  // ESCRIBIR DATOS: Solo el bloque de comisiones (Columnas E a U)
  const onlyCommissions = data.map(row => row.slice(COL_QUESTTIME - 1, COL_EFE));
  sh.getRange(2, COL_QUESTTIME, data.length, COL_EFE - (COL_QUESTTIME - 1)).setValues(onlyCommissions);

  const msg = soloVacias ? '✅ Comisiones actualizadas (solo vacías).' : '✅ Comisiones recalculadas en TODAS las filas.';
  SpreadsheetApp.getUi().alert(msg);
}

/************************************************************
 * HELPERS
 *************************************************************/
function isEmpty_(v) {
  return v === '' || v === null || v === undefined;
}