import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'sportfutsal-theme-v3';
const THEME_EVENT = 'sportfutsal-theme-change';

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
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
  }, [theme]);

  useEffect(() => {
    const syncTheme = (event: Event) => {
      const next = (event as CustomEvent<Theme>).detail;
      if (next === 'light' || next === 'dark') setTheme(next);
    };
    const syncStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setTheme(event.newValue === 'dark' ? 'dark' : 'light');
    };
    window.addEventListener(THEME_EVENT, syncTheme);
    window.addEventListener('storage', syncStorage);
    return () => { window.removeEventListener(THEME_EVENT, syncTheme); window.removeEventListener('storage', syncStorage); };
  }, []);

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
