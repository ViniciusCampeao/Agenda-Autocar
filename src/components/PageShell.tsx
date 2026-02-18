import React from 'react';
import Header from './Header';

interface PageShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerless?: boolean;
}

const PageShell: React.FC<PageShellProps> = ({
  children,
  title,
  subtitle,
  headerless = false,
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-56 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-violet-500/20 blur-[130px]" />
        <div className="absolute left-0 top-1/3 h-[24rem] w-[24rem] rounded-full bg-blue-600/20 blur-[130px]" />
      </div>

      {!headerless && <Header />}

      <main className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {(title || subtitle) && (
          <div className="surface-card mb-10 rounded-3xl border border-white/10 bg-slate-900/50 p-7 text-center shadow-2xl backdrop-blur-xl sm:mb-12 sm:p-9">
            {title && (
              <h1 className="surface-title text-3xl font-black sm:text-4xl lg:text-5xl">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 sm:mt-5 sm:text-base">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {children}
      </main>
    </div>
  );
};

export default PageShell;
