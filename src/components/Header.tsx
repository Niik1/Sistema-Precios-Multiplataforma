import React from 'react';
import { Sparkles, ShieldCheck, BookOpen, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onOpenRules: () => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRules,
  isDark,
  onToggleDark,
}) => {
  return (
    <header className="border-b border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] px-6 py-4 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 dark:bg-[#39d353]/10 border border-emerald-500/30 dark:border-[#39d353]/30 text-emerald-600 dark:text-[#39d353]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-[#39d353] bg-emerald-500/10 dark:bg-[#39d353]/10 border border-emerald-500/30 dark:border-[#39d353]/40 px-2 py-0.5 rounded">
                Precios v2.0
              </span>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                OmniChannel Pricing & Commission Engine
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#8b949e] mt-0.5">
              Cálculo dinámico de comisiones, fletes escalonados y márgenes para 17 marketplaces
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onToggleDark}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#1c2330] hover:bg-slate-200 dark:hover:bg-[#21262d] border border-slate-200 dark:border-[#30363d] px-2.5 py-1.5 rounded-md transition-colors"
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden sm:inline">Oscuro</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenRules}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-[#8b949e] hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#1c2330] hover:bg-slate-200 dark:hover:bg-[#21262d] border border-slate-200 dark:border-[#30363d] px-3 py-1.5 rounded-md transition-colors"
            title="Inspeccionar matriz de reglas y comisiones"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-[#58a6ff]" />
            <span>Matriz de Reglas</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-[#39d353] bg-emerald-500/10 dark:bg-[#39d353]/10 border border-emerald-500/30 dark:border-[#39d353]/30 px-3 py-1.5 rounded-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium">Motor Reactivo Listo</span>
          </div>
        </div>
      </div>
    </header>
  );
};
