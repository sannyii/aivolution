import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getTranslations } from 'next-intl/server';

const classificationOrder = ['accountData', 'usageAnalytics', 'contentIntelligence', 'supportTickets'] as const;
const levelOrder = ['public', 'medium', 'high', 'restricted'] as const;

export default async function GovernancePage() {
  const t = await getTranslations('governance');

  return (
    <div className="relative min-h-screen text-white">
      <Header />
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-24 pt-16 lg:px-6">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 px-8 py-10 text-center shadow-[0_55px_140px_-90px_rgba(82,109,255,0.75)] backdrop-blur-2xl">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">{t('title')}</h1>
          <p className="mt-4 text-base text-white/70 sm:text-lg">{t('subtitle')}</p>
        </section>

        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_60px_160px_-100px_rgba(88,110,255,0.78)] backdrop-blur-2xl">
          <div className="mb-6 flex flex-col gap-3">
            <h2 className="text-2xl font-semibold text-white">{t('classification.title')}</h2>
            <p className="text-sm text-white/70 sm:text-base">{t('classification.description')}</p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <div className="grid grid-cols-1 divide-y divide-white/5 text-sm text-white/80 md:grid-cols-[1.2fr_2fr_1.5fr_1fr] md:divide-y-0 md:divide-x">
              <div className="bg-white/10 p-4 font-semibold uppercase tracking-[0.2em] text-white/70 md:text-center">
                {t('classification.headers.category')}
              </div>
              <div className="bg-white/10 p-4 font-semibold uppercase tracking-[0.2em] text-white/70 md:text-center">
                {t('classification.headers.description')}
              </div>
              <div className="bg-white/10 p-4 font-semibold uppercase tracking-[0.2em] text-white/70 md:text-center">
                {t('classification.headers.sources')}
              </div>
              <div className="bg-white/10 p-4 font-semibold uppercase tracking-[0.2em] text-white/70 md:text-center">
                {t('classification.headers.security')}
              </div>
              {classificationOrder.map((key) => (
                <div key={key} className="contents">
                  <div className="p-4 text-base font-semibold text-white/90">
                    {t(`classification.rows.${key}.name`)}
                  </div>
                  <div className="p-4 text-sm text-white/70">
                    {t(`classification.rows.${key}.description`)}
                  </div>
                  <div className="p-4 text-sm text-white/70">
                    {t(`classification.rows.${key}.sources`)}
                  </div>
                  <div className="p-4 text-sm font-semibold text-white">
                    {t(`classification.rows.${key}.security`)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          {levelOrder.map((level) => (
            <div key={level} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_-80px_rgba(99,102,241,0.7)] backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {t(`securityLevels.levels.${level}.name`)}
                </h3>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/60">
                  {level.toUpperCase()}
                </span>
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/75">
                {t.raw(`securityLevels.levels.${level}.controls`).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_60px_160px_-100px_rgba(14,165,233,0.6)] backdrop-blur-2xl">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold text-white">{t('encryption.title')}</h2>
            <div className="grid gap-6 pt-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
                <h3 className="text-lg font-semibold text-white">{t('encryption.rest.title')}</h3>
                <ul className="mt-3 space-y-2 text-sm text-white/70">
                  {t.raw('encryption.rest.items').map((item: string, index: number) => (
                    <li key={index} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
                <h3 className="text-lg font-semibold text-white">{t('encryption.transit.title')}</h3>
                <ul className="mt-3 space-y-2 text-sm text-white/70">
                  {t.raw('encryption.transit.items').map((item: string, index: number) => (
                    <li key={index} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
                <h3 className="text-lg font-semibold text-white">{t('encryption.dynamicTitle')}</h3>
                <p className="mt-3 text-sm text-white/70">{t('encryption.dynamic')}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
