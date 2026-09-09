import { useState, useEffect } from 'react';

interface HeaderControlsProps {
  currentLang: 'es' | 'en';
}

export default function HeaderControls({ currentLang }: HeaderControlsProps) {
  // Inicializar con el valor de localStorage si existe, sino con la prop
  const getInitialLang = () => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('lang') as 'es' | 'en') || currentLang;
    }
    return currentLang;
  };

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'es' | 'en'>(getInitialLang());

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleLang = () => {
    const newLang = lang === 'es' ? 'en' : 'es';

    // 1. Actualizar el estado INMEDIATAMENTE (la bandera cambia al instante)
    setLang(newLang);
    localStorage.setItem('lang', newLang);

    // 2. Forzar la recarga de la página para que Astro renderice el nuevo idioma
    // Usamos replace para que no se guarde en el historial del navegador como una página nueva
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLang);
    window.location.replace(url.toString());
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex gap-3">
      <button
        type="button"
        onClick={toggleLang}
        className="w-12 h-12 rounded-full border-2 border-brand-red bg-beige text-2xl hover:bg-brand-red hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-md cursor-pointer active:scale-95"
        aria-label="Cambiar idioma"
        title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      >
        {lang === 'es' ? '🇪🇸' : '🇺🇸'}
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        className="w-12 h-12 rounded-full border-2 border-brand-red bg-beige text-text hover:bg-brand-red hover:text-beige hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-md cursor-pointer active:scale-95"
        aria-label="Cambiar tema"
        title={theme === 'light' ? 'Switch to Dark Mode' : 'Cambiar a Modo Claro'}
      >
        {theme === 'light' ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            ></path>
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
        )}
      </button>
    </div>
  );
}
