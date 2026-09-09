import { useState, useEffect } from 'react';

export default function HeaderControls() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const lang: 'es' | 'en' =
    typeof window !== 'undefined' ? (window.location.pathname.startsWith('/en') ? 'en' : 'es') : 'es';

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
    const path = window.location.pathname;
    let newPath: string;

    if (lang === 'es') {
      newPath = path.startsWith('/en') ? path : `/en${path === '/' ? '' : path}`;
    } else {
      newPath = path.replace(/^\/en/, '') || '/';
    }

    window.location.href = newPath;
  };

  const goHome = () => {
    window.location.href = lang === 'en' ? '/en' : '/';
  };

  return (
    // ✅ CAMBIO: Posición responsiva
    // Escritorio (md+): arriba a la derecha
    // Móvil (<md): abajo al centro
    <div
      className="fixed z-[9999] flex gap-3 
                    md:top-6 md:right-6 
                    bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:bottom-auto"
    >
      {/* Botón HOME */}
      <button
        type="button"
        onClick={goHome}
        className="w-12 h-12 rounded-full border-2 border-brand-red bg-beige text-text hover:bg-brand-red hover:text-beige transition-all duration-200 flex items-center justify-center shadow-md cursor-pointer active:scale-95"
        aria-label="Ir al inicio"
        title="Ir al inicio"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </button>

      {/* Botón de Idioma */}
      <button
        type="button"
        onClick={toggleLang}
        className="w-12 h-12 rounded-full border-2 border-brand-red bg-beige text-2xl hover:bg-brand-red hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-md cursor-pointer active:scale-95"
        aria-label="Cambiar idioma"
        title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      >
        {lang === 'es' ? '🇪🇸' : '🇺🇸'}
      </button>

      {/* Botón de Tema */}
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
            />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
