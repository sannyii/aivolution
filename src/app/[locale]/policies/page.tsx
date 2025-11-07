import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getTranslations } from 'next-intl/server';

const policySections = ['privacyPolicy', 'userAgreement', 'deletion'] as const;

export default async function PoliciesPage() {
  const t = await getTranslations('policies');

  return (
    <div className="relative min-h-screen text-white">
      <Header />
      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pb-24 pt-16 lg:px-6">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 px-8 py-10 text-center shadow-[0_55px_140px_-90px_rgba(82,109,255,0.75)] backdrop-blur-2xl">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">{t('title')}</h1>
          <p className="mt-4 text-base text-white/70 sm:text-lg">{t('subtitle')}</p>
        </section>

        <div className="grid gap-8">
          {policySections.map((key) => {
            const items = t.raw(`${key}.items`) as string[];
            return (
              <section
                key={key}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_60px_160px_-100px_rgba(59,130,246,0.6)] backdrop-blur-2xl"
              >
                <div className="flex flex-col gap-3">
                  <h2 className="text-2xl font-semibold text-white">{t(`${key}.title`)}</h2>
                  <p className="text-sm text-white/70 sm:text-base">{t(`${key}.intro`)}</p>
                  <ul className="mt-4 space-y-3 text-sm text-white/80">
                    {items.map((item, index) => (
                      <li
                        key={index}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 leading-relaxed shadow-[0_25px_80px_-60px_rgba(14,165,233,0.45)]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
