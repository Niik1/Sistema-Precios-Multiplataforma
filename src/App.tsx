import React, { useMemo, useState, useEffect } from 'react';
import { Sparkles, BookOpen } from 'lucide-react';
import { SkuBatchCard } from './components/SkuBatchCard';
import { CurrencyAndSimulatorCard } from './components/CurrencyAndSimulatorCard';
import { TopKpisHeader } from './components/TopKpisHeader';
import { SelectedSkuDetailPanel } from './components/SelectedSkuDetailPanel';
import { FinancialStatusBar } from './components/FinancialStatusBar';
import { ModernPricingTable } from './components/ModernPricingTable';
import { MarginAuditModal } from './components/MarginAuditModal';
import { RulesInspectorModal } from './components/RulesInspectorModal';

import { useBCRPRate } from './hooks/useBCRPRate';
import { MOCK_CATALOG, MOCK_CATALOG_MAP } from './data/mockCatalog';
import { calculateBatchPrices } from './engine/pricingEngine';
import { validateBatchMargins } from './utils/marginValidator';
import { exportPricingToExcel } from './utils/excelExporter';
import { MARKETPLACES } from './config/marketplaces';
import {
  ChannelPricingBreakdown,
  Product,
  ProductPricingResult,
} from './types';

export const App: React.FC = () => {
  const { rate: bcrpRate } = useBCRPRate();

  const [skuInput, setSkuInput] = useState<string>('');
  const [customTC, setCustomTC] = useState<number | null>(null);
  const [results, setResults] = useState<ProductPricingResult[]>([]);
  const [selectedProductResult, setSelectedProductResult] = useState<ProductPricingResult | null>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Modales
  const [auditBreakdown, setAuditBreakdown] = useState<ChannelPricingBreakdown | null>(null);
  const [auditProduct, setAuditProduct] = useState<Product | null>(null);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);

  // Parsear SKUs del textarea
  const parseSkus = (raw: string): string[] => {
    const lines = raw.split('\n');
    const seen = new Set<string>();
    const list: string[] = [];

    for (const l of lines) {
      const s = l.trim().toUpperCase();
      if (s && !seen.has(s)) {
        seen.add(s);
        list.push(s);
      }
    }
    return list;
  };

  const currentSkus = parseSkus(skuInput);

  // Cargar demo inicial automáticamente al arrancar la app
  useEffect(() => {
    // Asegurar permanentemente el modo oscuro
    document.documentElement.classList.add('dark');
    localStorage.setItem('gc_pricing_theme', 'dark');

    const demoSkus = MOCK_CATALOG.map((p) => p.sku).join('\n');
    setSkuInput(demoSkus);

    const t0 = performance.now();
    const calculated = calculateBatchPrices(MOCK_CATALOG);
    const elapsed = performance.now() - t0;

    setResults(calculated);
    setSelectedProductResult(calculated[2] || calculated[0]);
    setExecutionTimeMs(elapsed);
  }, []);

  const marginSummary = useMemo(
    () =>
      validateBatchMargins(results, {
        bcrpSellRate: bcrpRate?.sellRate,
        minMarginPct: 8,
        criticalMarginPct: 3,
      }),
    [results, bcrpRate?.sellRate]
  );

  const { avgMargin, effectiveAverageTC, totalCalculatedPrices } = useMemo(() => {
    if (results.length === 0) {
      return { avgMargin: 0, effectiveAverageTC: customTC ?? 3.46, totalCalculatedPrices: 0 };
    }

    let marginSum = 0;
    let count = 0;
    let tcSum = 0;

    for (const r of results) {
      tcSum += r.effectiveTC;
      for (const ch of Object.values(r.channels)) {
        if (ch && ch.finalPrice > 0) {
          marginSum += ch.profitMarginPercent;
          count += 1;
        }
      }
    }

    return {
      avgMargin: count > 0 ? marginSum / count : 0,
      effectiveAverageTC: tcSum / results.length,
      totalCalculatedPrices: count,
    };
  }, [results, customTC]);

  const handleCalculate = () => {
    if (!currentSkus.length) return;
    setIsCalculating(true);

    const t0 = performance.now();
    const productsToCalc: Product[] = [];

    for (const sku of currentSkus) {
      const found = MOCK_CATALOG_MAP.get(sku);
      if (found) {
        productsToCalc.push(found);
      } else {
        productsToCalc.push({
          sku,
          nombre: `Producto ${sku} (Autogenerado)`,
          categoria: 'ACCESORIOS',
          subcategoria: 'ZONA GAMER',
          costoUSD: 35,
          margenUSD: 5,
          tc: customTC ?? 3.8,
          precioVentaUSD: 40,
        });
      }
    }

    const calculated = calculateBatchPrices(productsToCalc, customTC ?? undefined);
    const elapsed = performance.now() - t0;

    setResults(calculated);
    setSelectedProductResult(calculated[0] || null);
    setExecutionTimeMs(elapsed);
    setIsCalculating(false);
  };

  const handleCustomTCChange = (newTC: number | null) => {
    setCustomTC(newTC);
    if (results.length > 0) {
      const t0 = performance.now();
      const updated = calculateBatchPrices(
        results.map((r) => r.product),
        newTC ?? undefined
      );
      setResults(updated);
      if (selectedProductResult) {
        const found = updated.find((u) => u.product.sku === selectedProductResult.product.sku);
        if (found) setSelectedProductResult(found);
      }
      setExecutionTimeMs(performance.now() - t0);
    }
  };

  const handleLoadDemo = () => {
    const demoSkus = MOCK_CATALOG.map((p) => p.sku).join('\n');
    setSkuInput(demoSkus);

    const t0 = performance.now();
    const calculated = calculateBatchPrices(MOCK_CATALOG, customTC ?? undefined);
    const elapsed = performance.now() - t0;

    setResults(calculated);
    setSelectedProductResult(calculated[2] || calculated[0]);
    setExecutionTimeMs(elapsed);
  };

  const handleClear = () => {
    setSkuInput('');
    setResults([]);
    setSelectedProductResult(null);
  };

  const handleExportExcel = () => {
    exportPricingToExcel(results);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#e2e8f0] flex flex-col font-sans selection:bg-blue-600/30 selection:text-white">
      {/* 1. Header Minimalista Topbar */}
      <header className="border-b border-[#1e293b]/70 bg-[#0e1320] px-4 py-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white tracking-wide">
                  OmniChannel Pricing & Commission Engine
                </h1>
                <span className="text-[10px] font-bold font-mono text-blue-400 bg-blue-500/15 border border-blue-500/30 px-1.5 py-0.2 rounded-full">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Comisiones dinámicas, fletes escalonados y márgenes para 17 marketplaces
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Botón Matriz de Reglas */}
            <button
              onClick={() => setIsRulesModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#1e293b] hover:bg-[#283548] border border-slate-700/60 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>Matriz de reglas</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-xl font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Motor reactivo listo</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Contenido Principal */}
      <main className="flex-1 w-full p-3 sm:p-4 space-y-4">
        {/* BLOQUE SUPERIOR: Contenedor de 4 Columnas con la Misma Altura */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 items-stretch">
          {/* Columna 1: Lote de SKUs */}
          <div className="h-full">
            <SkuBatchCard
              inputVal={skuInput}
              onInputChange={setSkuInput}
              onCalculate={handleCalculate}
              onLoadDemo={handleLoadDemo}
              onClear={handleClear}
              isCalculating={isCalculating}
              uniqueCount={currentSkus.length}
              calculatedCount={results.length}
              executionTimeMs={executionTimeMs}
            />
          </div>

          {/* Columna 2: Tipo de Cambio + Simulador de TC */}
          <div className="h-full">
            <CurrencyAndSimulatorCard
              rate={bcrpRate}
              onApplyLiveTC={(sellRate) => handleCustomTCChange(sellRate)}
              customTC={customTC}
              onCustomTCChange={handleCustomTCChange}
            />
          </div>

          {/* Columna 3: 4 KPIs Principales */}
          <div className="h-full">
            <TopKpisHeader
              calculatedCount={results.length}
              totalMarketplacesCount={MARKETPLACES.length}
              avgMargin={avgMargin}
              summary={marginSummary}
              effectiveTC={effectiveAverageTC}
            />
          </div>

          {/* Columna 4: SKU Seleccionado (Detalle & Gráfico) */}
          <div className="h-full">
            <SelectedSkuDetailPanel selectedResult={selectedProductResult} />
          </div>
        </div>

        {/* BLOQUE MEDIO: Monitoreo Financiero de Extremo a Extremo */}
        <div className="w-full">
          <FinancialStatusBar
            summary={marginSummary}
            totalCalculatedPrices={totalCalculatedPrices}
          />
        </div>

        {/* BLOQUE INFERIOR: Tabla de Precios a Ancho Completo */}
        <div className="w-full">
          <ModernPricingTable
            results={results}
            selectedSku={selectedProductResult?.product.sku || null}
            onSelectProduct={(item) => setSelectedProductResult(item)}
            onInspectAudit={(breakdown, prod) => {
              setAuditBreakdown(breakdown);
              setAuditProduct(prod);
            }}
            onExportExcel={handleExportExcel}
          />
        </div>
      </main>

      {/* Modal de Auditoría Financiera */}
      <MarginAuditModal
        breakdown={auditBreakdown}
        product={auditProduct}
        onClose={() => {
          setAuditBreakdown(null);
          setAuditProduct(null);
        }}
      />

      {/* Modal de Inspección de Reglas */}
      <RulesInspectorModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
};

export default App;
