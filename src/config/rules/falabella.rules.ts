import { CommissionRule } from '../../types';

export const FALABELLA_RULES: CommissionRule[] = [
  {
    id: 'fala_consolas_tv_cel',
    priority: 10,
    description: 'Consolas, Televisores o Celulares',
    match: ({ cat, sub }) => cat.includes('CONSOLAS') && /TELEVISORES|PLAYSTATION|CELULARES/.test(sub),
    commission: 8,
  },
  {
    id: 'fala_audifonos_computo',
    priority: 9,
    description: 'Audífonos en Cómputo o Zona Gamer',
    match: ({ cat, sub, nom }) =>
      cat.includes('ACCESORIOS') &&
      /AUDIFONO|HEADSET|AURICULAR/.test(nom) &&
      /COMPUTO|ZONA GAMER/.test(sub),
    commission: 10,
  },
  {
    id: 'fala_audifonos_consolas',
    priority: 9,
    description: 'Audífonos para Consolas (Playstation, Nintendo, Microsoft)',
    match: ({ cat, sub, nom }) =>
      cat.includes('ACCESORIOS') &&
      /AUDIFONO|HEADSET|AURICULAR/.test(nom) &&
      /PLAYSTATION|NINTENDO|MICROSOFT/.test(sub),
    commission: 15,
  },
  {
    id: 'fala_videojuegos',
    priority: 8,
    description: 'Videojuegos en general',
    match: ({ cat }) => cat.includes('VIDEOJUEGOS'),
    commission: 12,
  },
  {
    id: 'fala_gadgets_10',
    priority: 7,
    description: 'Dispositivos inteligentes, monitores, cámaras, micrófonos, smartbands',
    match: ({ nom }) =>
      /PARLANTE UE WONDERBOOM|PARLANTE CREATIVE|PARLANTE INTELIGENTE|MONITOR|MICROFONO|CAMARA|IPAD|ALEXA|ECHO|SMARTWATCH|PULSERA XIAOMI|REDMI WATCH|XIAOMI SMART BAND|RELOJ XIAOMI|SMARTBAND/.test(
        nom
      ) ||
      (nom.includes('DISCO DURO') && /EXTERNO|SEAGATE|SSD/.test(nom)),
    commission: 10,
  },
  {
    id: 'fala_mandos',
    priority: 8,
    description: 'Mandos y Controles de consolas',
    match: ({ nom }) =>
      /MANDO|CONTROL|CONTROLES|NACON|GAMEPAD|JOY-CON|JOY CON|DUALSHOCK|DUALSENSE|ARCADE/.test(
        nom
      ),
    commission: 15,
  },
  {
    id: 'fala_accesorios_general',
    priority: 5,
    description: 'Accesorios generales, sillas, funkos, cables, memorias',
    match: ({ cat, nom }) =>
      cat.includes('ACCESORIOS') ||
      /MEMORIA|TECLADO|MOUSE|SILLA|FUNKO|GIFCARD|CABLE|CARGADOR|ADAPTADOR|SOPORTE|POWERBANK/.test(
        nom
      ),
    commission: 15,
  },
];
