import { CommissionRule } from '../../types';

// Reglas para Shopstar
export const SHOPSTAR_RULES: CommissionRule[] = [
  { id: 'shop_video', priority: 8, description: 'Videojuegos', match: ({ cat }) => cat.includes('VIDEOJUEGOS'), commission: 10 },
  { id: 'shop_cons', priority: 8, description: 'Consolas', match: ({ cat }) => cat.includes('CONSOLAS'), commission: 10 },
  { id: 'shop_silla', priority: 8, description: 'Sillas', match: ({ cat }) => cat.includes('SILLA'), commission: 12 },
  { id: 'shop_funko', priority: 8, description: 'Funkos', match: ({ cat }) => cat.includes('FUNKO'), commission: 15 },
  { id: 'shop_mando', priority: 8, description: 'Mandos', match: ({ nom }) => /MANDO|CONTROL|GAMEPAD/.test(nom), commission: 12 },
];

// Reglas para Luxury
export const LUXURY_RULES: CommissionRule[] = [
  { id: 'lux_video', priority: 8, description: 'Videojuegos', match: ({ cat }) => cat.includes('VIDEOJUEGOS'), commission: 10 },
  { id: 'lux_cons', priority: 8, description: 'Consolas', match: ({ cat }) => cat.includes('CONSOLAS'), commission: 10 },
  { id: 'lux_silla', priority: 8, description: 'Sillas', match: ({ cat }) => cat.includes('SILLA'), commission: 13 },
  { id: 'lux_funko', priority: 8, description: 'Funkos', match: ({ cat }) => cat.includes('FUNKO'), commission: 15 },
  { id: 'lux_mando', priority: 8, description: 'Mandos', match: ({ nom }) => /MANDO|CONTROL|GAMEPAD/.test(nom), commission: 12 },
];

// Reglas para Juntoz
export const JUNTOZ_RULES: CommissionRule[] = [
  { id: 'junt_cons', priority: 8, description: 'Consolas', match: ({ cat }) => cat.includes('CONSOLAS'), commission: 8 },
  { id: 'junt_video', priority: 8, description: 'Videojuegos', match: ({ cat }) => cat.includes('VIDEOJUEGOS'), commission: 10 },
  { id: 'junt_silla', priority: 8, description: 'Sillas', match: ({ cat }) => cat.includes('SILLA'), commission: 13 },
  { id: 'junt_funko', priority: 8, description: 'Funkos', match: ({ cat }) => cat.includes('FUNKO'), commission: 15 },
  { id: 'junt_mando', priority: 8, description: 'Mandos', match: ({ nom }) => /MANDO|CONTROL|GAMEPAD/.test(nom), commission: 12 },
];

// Reglas para Yape
export const YAPE_RULES: CommissionRule[] = [
  { id: 'yape_cons', priority: 8, description: 'Consolas', match: ({ cat }) => cat.includes('CONSOLAS'), commission: 8 },
  { id: 'yape_video', priority: 8, description: 'Videojuegos', match: ({ cat }) => cat.includes('VIDEOJUEGOS'), commission: 10 },
  { id: 'yape_silla', priority: 8, description: 'Sillas', match: ({ cat }) => cat.includes('SILLA'), commission: 13 },
  { id: 'yape_funko', priority: 8, description: 'Funkos', match: ({ cat }) => cat.includes('FUNKO'), commission: 15 },
  { id: 'yape_mando', priority: 8, description: 'Mandos', match: ({ nom }) => /MANDO|CONTROL|GAMEPAD/.test(nom), commission: 12 },
];

// Reglas para Canales Propios (Página Web y QuestTime)
export const DIRECT_CHANNELS_RULES: CommissionRule[] = [
  { id: 'dir_default', priority: 1, description: 'Comisión base pasarela web/questtime', match: () => true, commission: 4 },
];
