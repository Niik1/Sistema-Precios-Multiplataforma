import { CommissionRule } from '../../types';

export const INTERCORP_RULES: CommissionRule[] = [
  {
    id: 'int_consolas_nintendo',
    priority: 9,
    description: 'Consolas Nintendo y PS5',
    match: ({ cat, sub, nom }) =>
      cat.includes('CONSOLAS') && (sub.includes('NINTENDO') || nom.includes('PS5') || nom.includes('PLAYSTATION 5')),
    commission: 9,
  },
  {
    id: 'int_consolas_ps4_xbox',
    priority: 9,
    description: 'Consolas PS4 y Xbox',
    match: ({ cat, nom }) =>
      cat.includes('CONSOLAS') && (nom.includes('PS4') || nom.includes('XBOX')),
    commission: 10,
  },
  {
    id: 'int_mandos',
    priority: 8,
    description: 'Mandos y Controles',
    match: ({ nom }) => /MANDO|CONTROL|CONTROLES|GAMEPAD|DUALSHOCK|DUALSENSE|JOY-CON/.test(nom),
    commission: 12,
  },
  {
    id: 'int_videojuegos',
    priority: 8,
    description: 'Videojuegos en general',
    match: ({ cat }) => cat.includes('VIDEOJUEGOS'),
    commission: 10,
  },
  {
    id: 'int_sillas',
    priority: 8,
    description: 'Sillas Gamer',
    match: ({ cat, nom }) => cat.includes('SILLA') || nom.includes('SILLA'),
    commission: 13,
  },
  {
    id: 'int_funkos',
    priority: 8,
    description: 'Funkos y Powerbanks',
    match: ({ cat, nom }) => cat.includes('FUNKO') || /POWERBANK|POWER BANK/.test(nom),
    commission: 15,
  },
  {
    id: 'int_perifericos_12',
    priority: 7,
    description: 'Periféricos, cables, discos duros, mouses, audífonos',
    match: ({ nom }) =>
      /DISCO DURO|MOUSE|PAD MOUSE|TECLADO|AUDIFONO|SMARTWATCH|CABLE|ADAPTADOR|HUB|CARGADOR/.test(
        nom
      ),
    commission: 12,
  },
];
