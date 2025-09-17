import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';

export default function Header() {
  const t = useTranslations('header');

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-[0_25px_60px_-35px_rgba(99,102,241,0.9)]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/60 via-sky-300/40 to-transparent opacity-80" />
            <span className="relative text-lg font-bold tracking-wider text-white">AI</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-[0.38em] text-white/60">
              {t('subtitle')}
            </span>
            <h1 className="text-xl font-semibold text-white sm:text-2xl">
              {t('title')}
            </h1>
          </div>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}