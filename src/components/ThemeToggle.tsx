import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    return window.localStorage.getItem('sportfutsal-theme') === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('sportfutsal-theme', theme);
  }, [theme]);

  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={() => setTheme(current => current === 'dark' ? 'light' : 'dark')}
      aria-label={isLight ? 'Aktifkan mode gelap' : 'Aktifkan mode terang'}
      title={isLight ? 'Mode terang — klik untuk mode gelap' : 'Mode gelap — klik untuk mode terang'}
      className="theme-toggle inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span className="hidden sm:inline">{isLight ? 'Gelap' : 'Terang'}</span>
    </button>
  );
}
