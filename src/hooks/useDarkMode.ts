import { useState, useEffect, useCallback } from 'react';

const THEME_STORAGE_KEY = 'gc_pricing_theme';

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleDarkMode = useCallback(() => {
    const root = document.documentElement;
    // Activamos la clase de transición suave y sincronizada para todos los elementos
    root.classList.add('theme-transition');
    setIsDark((prev) => !prev);

    // Retiramos la clase tras completarse la animación para no ralentizar interacciones normales
    window.setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 350);
  }, []);

  return { isDark, setIsDark, toggleDarkMode };
}
