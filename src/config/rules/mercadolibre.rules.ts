import { CommissionRule } from '../../types';

export const MERCADOLIBRE_RULES: CommissionRule[] = [
  {
    id: 'ml_mouses_keyboards',
    priority: 9,
    description: 'Mouses, teclados, mousepads y micrófonos',
    match: ({ nom }) => /MOUSE|PAD MOUSE|MOUSE PAD|MICROFONO|TECLADO|KEYCAPS/.test(nom),
    commission: 10,
  },
  {
    id: 'ml_smartwatch_monitors',
    priority: 8,
    description: 'Monitores y Smartwatches/Smartbands',
    match: ({ nom }) => /MONITOR|SMARTBAND|SMARTWATCH|XIAOMI SMART BAND|REDMI WATCH/.test(nom),
    commission: 11,
  },
  {
    id: 'ml_tv_ipad_consolas_videojuegos',
    priority: 8,
    description: 'Consolas, Videojuegos, Televisores, Celulares, Audífonos y Parlantes',
    match: ({ cat, sub, nom }) =>
      cat.includes('VIDEOJUEGOS') ||
      cat.includes('CONSOLAS') ||
      sub.includes('CELULARES') ||
      /IPAD|TELEVISOR|SMART TV|AUDIFONO|HEADSET|AURICULAR|PARLANTE|ALEXA|ECHO/.test(nom),
    commission: 8,
  },
  {
    id: 'ml_funkos',
    priority: 8,
    description: 'Figuras Funko Pop',
    match: ({ cat, nom }) => cat.includes('FUNKOS') || nom.includes('FUNKO'),
    commission: 14,
  },
  {
    id: 'ml_sillas_giftcards',
    priority: 8,
    description: 'Sillas Gamer y Giftcards',
    match: ({ cat, sub, nom }) =>
      cat.includes('SILLA') || sub.includes('GIFCARD') || nom.includes('GIFT CARD'),
    commission: 15,
  },
  {
    id: 'ml_mandos',
    priority: 8,
    description: 'Mandos y controles para consolas',
    match: ({ nom }) =>
      /MANDO|CONTROL|CONTROLES|GAMEPAD|DUALSHOCK|DUALSENSE|JOY-CON|JOY CON/.test(nom),
    commission: 12,
  },
  {
    id: 'ml_cables_memorias_10',
    priority: 7,
    description: 'Cables, memorias SSD, adaptadores y hubs Ugreen',
    match: ({ nom }) =>
      /MEMORIA SSD|CABLE|HUB|ADAPTADOR|CONECTOR|ESTADO SOLIDO|UGREEN/.test(nom),
    commission: 10,
  },
  {
    id: 'ml_protectores_micas_12',
    priority: 6,
    description: 'Micas, protectores, cargadores, estuches',
    match: ({ nom }) => /MICA|SILICONE|CARGADOR|ESTUCHE|PROTECTOR|TIMON|POWERBANK/.test(nom),
    commission: 12,
  },
];
