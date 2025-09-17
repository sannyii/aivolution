'use client';

import { useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = useCallback(
    (targetLocale: 'zh' | 'en') => {
      if (targetLocale === locale) return;
      const pathWithoutLocale = pathname.replace(/^\/(zh|en)/, '');
      const destination =
        pathWithoutLocale.length === 0
          ? `/${targetLocale}`
          : `/${targetLocale}${pathWithoutLocale}`;
      router.push(destination);
    },
    [locale, pathname, router]
  );

  const baseButtonClass =
    'px-1.5 text-sm font-medium transition-colors duration-200 focus:outline-none';
  const containerClass =
    'inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-semibold text-white/70 shadow-[0_18px_45px_-30px_rgba(129,140,248,0.8)] backdrop-blur-xl';

  const ariaLabel = locale === 'zh' ? '切换语言' : 'Switch language';

  return (
    <div className={containerClass} aria-label={ariaLabel}>
      <button
        type="button"
        className={`${baseButtonClass} ${
          locale === 'zh'
            ? 'text-white'
            : 'text-white/50 hover:text-white'
        }`}
        onClick={() => switchLanguage('zh')}
      >
        中
      </button>
      <span className="mx-1.5 text-xs text-white/40">/</span>
      <button
        type="button"
        className={`${baseButtonClass} ${
          locale === 'en'
            ? 'text-white'
            : 'text-white/50 hover:text-white'
        }`}
        onClick={() => switchLanguage('en')}
      >
        EN
      </button>
    </div>
  );
}
