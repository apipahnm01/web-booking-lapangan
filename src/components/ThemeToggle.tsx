import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'sportfutsal-theme-v2';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={() => setTheme(current => current === 'dark' ? 'light' : 'dark')}
      aria-label={isLight ? 'Aktifkan mode gelap' : 'Aktifkan mode terang'}
      title={isLight ? 'Mode terang — klik untuk mode gelap' : 'Mode gelap — klik untuk mode terang'}
      className="theme-toggle inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition-colors shadow-sm"
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span>{isLight ? 'Mode gelap' : 'Mode terang'}</span>
    </button>
  );
}
