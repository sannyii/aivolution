'use client';

import { type FormEvent, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLocale, useTranslations } from 'next-intl';

const datasetKeys = ['identity', 'activity', 'contributions'] as const;
const consentKeys = ['analytics', 'personalisation', 'thirdParty'] as const;

type ConsentState = Record<(typeof consentKeys)[number], boolean>;

const defaultConsent: ConsentState = {
  analytics: true,
  personalisation: true,
  thirdParty: false
};

export default function PrivacyControlPage() {
  const t = useTranslations('privacyControl');
  const locale = useLocale();
  const [consent, setConsent] = useState<ConsentState>(defaultConsent);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const lastSynced = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    return formatter.format(new Date());
  }, [locale]);

  const handleView = () => {
    setStatusMessage(t('status.viewReady'));
  };

  const handleExport = () => {
    setStatusMessage(t('status.exportQueued'));
  };

  const handleRevoke = () => {
    setConsent({ analytics: false, personalisation: false, thirdParty: false });
    setStatusMessage(t('status.consentRevoked'));
  };

  const handleToggle = (key: (typeof consentKeys)[number]) => {
    setConsent((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(t('status.preferencesSaved'));
  };

  return (
    <div className="relative min-h-screen text-white">
      <Header />
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-24 pt-16 lg:px-6">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 px-8 py-10 text-center shadow-[0_55px_140px_-90px_rgba(82,109,255,0.75)] backdrop-blur-2xl">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">{t('title')}</h1>
          <p className="mt-4 text-base text-white/70 sm:text-lg">{t('subtitle')}</p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_50px_150px_-95px_rgba(14,165,233,0.6)] backdrop-blur-2xl">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-white">{t('dataSummary.title')}</h2>
              <p className="text-sm text-white/70 sm:text-base">{t('dataSummary.description')}</p>
              <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
                {t('dataSummary.lastUpdated')}: {lastSynced}
              </span>
            </div>
            <div className="mt-6 grid gap-4">
              {datasetKeys.map((key) => (
                <div key={key} className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-white">{t(`dataSummary.entries.${key}.name`)}</h3>
                    <p className="text-sm text-white/70">{t(`dataSummary.entries.${key}.details`)}</p>
                    <span className="text-xs uppercase tracking-[0.25em] text-emerald-300/80">
                      {t(`dataSummary.entries.${key}.retention`)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_45px_120px_-90px_rgba(99,102,241,0.6)] backdrop-blur-2xl">
              <h2 className="text-lg font-semibold text-white">{t('actions.view.title')}</h2>
              <p className="mt-2 text-sm text-white/70">{t('actions.view.description')}</p>
              <button
                type="button"
                onClick={handleView}
                className="mt-4 w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:opacity-90"
              >
                {t('actions.view.button')}
              </button>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_45px_120px_-90px_rgba(56,189,248,0.6)] backdrop-blur-2xl">
              <h2 className="text-lg font-semibold text-white">{t('actions.export.title')}</h2>
              <p className="mt-2 text-sm text-white/70">{t('actions.export.description')}</p>
              <button
                type="button"
                onClick={handleExport}
                className="mt-4 w-full rounded-full bg-sky-400/90 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                {t('actions.export.button')}
              </button>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_45px_120px_-90px_rgba(248,113,113,0.6)] backdrop-blur-2xl">
              <h2 className="text-lg font-semibold text-white">{t('actions.revoke.title')}</h2>
              <p className="mt-2 text-sm text-white/70">{t('actions.revoke.description')}</p>
              <button
                type="button"
                onClick={handleRevoke}
                className="mt-4 w-full rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
              >
                {t('actions.revoke.button')}
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_60px_160px_-100px_rgba(15,118,110,0.6)] backdrop-blur-2xl">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold text-white">{t('consent.title')}</h2>
            <p className="text-sm text-white/70 sm:text-base">{t('consent.description')}</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {consentKeys.map((key) => (
              <label key={key} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-white/40 bg-transparent text-emerald-300 focus:ring-emerald-400"
                  checked={consent[key]}
                  onChange={() => handleToggle(key)}
                />
                <span className="text-sm text-white/75">{t(`consent.${key}`)}</span>
              </label>
            ))}
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-300"
              >
                {t('consent.submit')}
              </button>
            </div>
          </form>
          <div aria-live="polite" className="mt-4 min-h-[1.5rem] text-sm text-emerald-200">
            {statusMessage}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
