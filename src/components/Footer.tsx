'use client';

import { useTranslations } from 'next-intl';
import Link from 'next-intl/link';

const footerLinks = [
  { href: '/', labelKey: 'links.feed' },
  { href: '/governance', labelKey: 'links.governance' },
  { href: '/policies', labelKey: 'links.policies' },
  { href: '/privacy-control', labelKey: 'links.privacyControl' }
];

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="relative z-20 mt-20 border-t border-white/10 bg-slate-950/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-10 text-center text-sm text-white/70 sm:py-12">
        <nav className="flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.18em] text-white/50">
          {footerLinks.map(({ href, labelKey }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 transition hover:bg-white/15 hover:text-white"
            >
              {t(labelKey)}
            </Link>
          ))}
        </nav>
        <p className="text-base font-semibold text-white/80">{t('crafted')}</p>
        <p>{t('rights')}</p>
        <p className="text-xs text-white/50">{t('disclaimer')}</p>
      </div>
    </footer>
  );
}