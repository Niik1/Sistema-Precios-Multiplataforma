import { CommissionRule } from '../../types';

export const COOLBOX_RULES: CommissionRule[] = [
  {
    id: 'cbx_videojuegos',
    priority: 8,
    description: 'Videojuegos en general',
    match: ({ cat }) => cat.includes('VIDEOJUEGOS'),
    commission: 17,
  },
  {
    id: 'cbx_audifonos',
    priority: 8,
    description: 'Audífonos y headsets',
    match: ({ nom }) => /AUDIFONO|HEADSET|AURICULAR/.test(nom),
    commission: 19,
  },
  {
    id: 'cbx_consolas_monitores',
    priority: 8,
    description: 'Consolas y Monitores',
    match: ({ cat, nom }) => cat.includes('CONSOLAS') || nom.includes('MONITOR'),
    commission: 12,
  },
  {
    id: 'cbx_funkos',
    priority: 8,
    description: 'Funkos',
    match: ({ cat, nom }) => cat.includes('FUNKOS') || nom.includes('FUNKO'),
    commission: 19,
  },
  {
    id: 'cbx_sillas',
    priority: 8,
    description: 'Sillas Gamer',
    match: ({ cat, nom }) => cat.includes('SILLA') || /SILLA GAMER/.test(nom),
    commission: 15,
  },
  {
    id: 'cbx_disco_duro',
    priority: 9,
    description: 'Discos Duros',
    match: ({ nom }) => nom.includes('DISCO DURO'),
    commission: 22,
  },
  {
    id: 'cbx_timon_volante',
    priority: 8,
    description: 'Timones y Volantes',
    match: ({ nom }) => /TIMON|RACING WHEEL|VOLANTE/.test(nom),
    commission: 12,
  },
  {
    id: 'cbx_perifericos_19',
    priority: 7,
    description: 'Teclados, mouses, cables, hubs, parlantes, soportes',
    match: ({ nom }) =>
      /TECLADO|MOUSE|RATON|KEYCAPS|WEB CAM|PARLANTE|HUB|CABLE|SOPORTE|POWER BANK|POWERBANK/.test(
        nom
      ),
    commission: 19,
  },
  {
    id: 'cbx_estuches_protectores_17',
    priority: 6,
    description: 'Estuches, protectores, mandos y cargadores',
    match: ({ nom }) =>
      /GAMEPAD|ESTUCHE|PROTECTOR|COVER|MICA|CARGADOR|ADAPTADOR|AMIIBO/.test(nom),
    commission: 17,
  },
];
