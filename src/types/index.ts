export type ProductCategory = 
  | 'VIDEOJUEGOS' 
  | 'CONSOLAS' 
  | 'ACCESORIOS' 
  | 'SILLAS' 
  | 'FUNKOS' 
  | 'GIFTCARD' 
  | 'COMPUTO' 
  | 'OTROS';

export interface Product {
  sku: string;
  nombre: string;
  categoria: ProductCategory | string;
  subcategoria: string;
  costoUSD: number;
  margenUSD: number;
  tc: number;
  precioVentaUSD: number;
  tipo?: 'PURO' | 'COMBO';
  cantAsc?: number;
  skuAsociado?: string;
}

export type MarketplaceId = 
  | 'questTime'
  | 'paginaWeb'
  | 'mercadoLibre'
  | 'sagaFalabella'
  | 'juntoz'
  | 'intercorp'
  | 'shopstar'
  | 'ripley'
  | 'rappi'
  | 'diners'
  | 'luxury'
  | 'coolbox'
  | 'efe'
  | 'calidda'
  | 'claro'
  | 'mesajil'
  | 'yape';

export interface ShippingTier {
  minPrice?: number;
  maxPrice?: number;
  shippingFee: number;
}

export interface MarketplaceConfig {
  id: MarketplaceId;
  name: string;
  displayName: string;
  color: string;
  badgeBg: string;
  isFlatCommission: boolean;
  flatCommissionRate?: number;
  defaultShippingFee: number;
  heavyShippingFee?: number; // Para sillas y fletes pesados
  shippingTiers?: ShippingTier[];
}

export interface CommissionRule {
  id: string;
  priority: number;
  description: string;
  match: (product: { cat: string; sub: string; nom: string }) => boolean;
  commission: number;
}

export interface ChannelPricingBreakdown {
  channelId: MarketplaceId;
  channelName: string;
  costoSoles: number;
  commissionPercentage: number;
  grossResult1: number;
  shippingFee: number;
  finalPrice: number;
  commissionAmountPEN: number;
  netRevenuePEN: number;
  profitPEN: number;
  profitMarginPercent: number;
}

export interface ProductPricingResult {
  product: Product;
  effectiveTC: number;
  costoSoles: number;
  precioBaseSoles: number;
  channels: Record<MarketplaceId, ChannelPricingBreakdown>;
  hasError?: boolean;
  errorMessage?: string;
}
