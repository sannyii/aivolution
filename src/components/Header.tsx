'use client';

import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next-intl/link';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

const baseNavItems = [
  { href: '/', labelKey: 'nav.feed' },
  { href: '/history', labelKey: 'nav.history' },
  { href: '/governance', labelKey: 'nav.governance' },
  { href: '/policies', labelKey: 'nav.policies' },
  { href: '/privacy-control', labelKey: 'nav.privacyControl' }
];

export default function Header() {
  const t = useTranslations('header');
  const locale = useLocale();
  const pathname = usePathname();

  const activePath = useMemo(() => {
    if (!pathname) return '/';
    const localePrefix = `/${locale}`;
    if (pathname === localePrefix) {
      return '/';
    }
    if (pathname.startsWith(`${localePrefix}/`)) {
      const trimmed = pathname.slice(localePrefix.length);
      return trimmed || '/';
    }
    return pathname;
  }, [pathname, locale]);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-5">
        <div className="flex items-center gap-6">
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

          <nav className="hidden items-center gap-4 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/80 shadow-[0_20px_60px_-40px_rgba(79,70,229,0.65)] backdrop-blur-xl lg:flex">
            {baseNavItems.map(({ href, labelKey }) => {
              const isActive = activePath === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-full px-3 py-1 transition-colors ${
                    isActive
                      ? 'bg-white text-slate-900'
                      : 'hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {t(labelKey)}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-2 text-sm text-white/80 lg:hidden">
            {baseNavItems.map(({ href, labelKey }) => {
              const isActive = activePath === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-full px-3 py-1 transition-colors ${
                    isActive
                      ? 'bg-white text-slate-900'
                      : 'border border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {t(labelKey)}
                </Link>
              );
            })}
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}