import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="relative z-20 mt-20 border-t border-white/10 bg-slate-950/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 py-10 text-center text-sm text-white/70 sm:py-12">
        <p className="text-base font-semibold text-white/80">{t('crafted')}</p>
        <p>{t('rights')}</p>
        <p className="text-xs text-white/50">{t('disclaimer')}</p>
      </div>
    </footer>
  );
}