import React from 'react';
import { getChannelMarginStatus } from '../utils/marginValidator';

interface MarginBadgeProps {
  marginPercent: number;
  minMarginPct?: number;
  criticalMarginPct?: number;
  compact?: boolean;
}

export const MarginBadge: React.FC<MarginBadgeProps> = ({
  marginPercent,
  minMarginPct = 8,
  criticalMarginPct = 3,
  compact = false,
}) => {
  const status = getChannelMarginStatus(marginPercent, minMarginPct, criticalMarginPct);

  if (status === 'critical') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-mono font-bold rounded border bg-rose-500/10 text-rose-600 dark:text-[#f85149] border-rose-500/30 ${
          compact ? 'text-[9px] px-1 py-0' : 'text-[10px] px-1.5 py-0.5'
        }`}
        title={`Margen crítico (< ${criticalMarginPct}%)`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-[#f85149]" />
        {marginPercent.toFixed(1)}%
      </span>
    );
  }

  if (status === 'warning') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-mono font-bold rounded border bg-amber-500/10 text-amber-600 dark:text-[#d29922] border-amber-500/30 ${
          compact ? 'text-[9px] px-1 py-0' : 'text-[10px] px-1.5 py-0.5'
        }`}
        title={`Margen debajo del mínimo (${minMarginPct}%)`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-[#d29922]" />
        {marginPercent.toFixed(1)}%
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono font-semibold rounded border bg-emerald-500/10 text-emerald-700 dark:text-[#39d353] border-emerald-500/30 ${
        compact ? 'text-[9px] px-1 py-0' : 'text-[10px] px-1.5 py-0.5'
      }`}
      title="Margen saludable"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#39d353]" />
      {marginPercent.toFixed(1)}%
    </span>
  );
};
