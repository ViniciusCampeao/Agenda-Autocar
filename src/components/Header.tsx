import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = useMemo(
    () => {
      const items: Array<{ to: string; label: string; icon: React.ReactNode; adminOnly?: boolean }> = [
        {
          to: '/',
          label: 'Agenda',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          ),
        },
        {
          to: '/dashboard',
          label: 'Dashboard',
          adminOnly: true,
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          ),
        },
        {
          to: '/employees',
          label: 'Usuários',
          adminOnly: true,
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          ),
        },
      ];

      return items.filter((i) => !i.adminOnly || currentUser?.isAdmin);
    },
    [currentUser?.isAdmin]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const prevPath = React.useRef(location.pathname);
  React.useEffect(() => {
    if (prevPath.current !== location.pathname) {
      prevPath.current = location.pathname;
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
  }, [location.pathname, mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 text-slate-100 shadow-2xl backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8" key={location.pathname}>
        <div className="flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-3 shadow-lg transition-all duration-300 group-hover:bg-white/10">
              <img 
                src="/images/logo.png" 
                alt="AUTOCAR Logo" 
                className="h-9 w-auto object-contain sm:h-10"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="surface-title text-xl font-black leading-none tracking-tight sm:text-2xl">AUTOCAR</h1>
              <p className="text-[11px] font-semibold tracking-[0.25em] text-slate-300">VIDROS AUTOMOTIVOS</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  isActive(item.to)
                    ? 'border-cyan-300/70 bg-cyan-400/15 text-cyan-200 shadow-lg shadow-cyan-500/20'
                    : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            <div className="ml-2 flex items-center gap-3 border-l border-white/15 pl-4">
              <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2">
                <div className="rounded-lg bg-cyan-400/20 p-1.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="max-w-36 truncate text-sm font-semibold">{currentUser?.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-lg border border-red-400/40 bg-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-100 transition hover:bg-red-500/35"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                    clipRule="evenodd"
                  />
                </svg>
                Sair
              </button>
            </div>
          </nav>

          {/* Mobile actions */}
          <div className="md:hidden flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
              className="rounded-lg border border-white/15 bg-white/5 p-3 transition-all duration-300 hover:bg-white/10"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm1 4a1 1 0 100 2h12a1 1 0 100-2H4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="mt-4 md:hidden">
            <div className="rounded-2xl border border-white/15 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                      isActive(item.to)
                        ? 'border-cyan-300/70 bg-cyan-400/15 text-cyan-200'
                        : 'border-white/15 bg-white/5 text-slate-100 hover:bg-white/10'
                    }`}
                  >
                    <span className={isActive(item.to) ? 'text-cyan-300' : 'text-slate-300'}>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}

                <div className="my-2 h-px bg-white/15" />

                <div className="flex items-center justify-between gap-3 px-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-cyan-400/20 p-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="leading-tight">
                      <p className="max-w-40 truncate text-sm font-semibold">{currentUser?.name}</p>
                      {currentUser?.isAdmin && <p className="text-xs text-cyan-200/90">Admin</p>}
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 rounded-lg border border-red-400/40 bg-red-500/25 px-3 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/35"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
