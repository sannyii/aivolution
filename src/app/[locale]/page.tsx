import { getChronologicalNews } from '@/lib/news';
import Header from '@/components/Header';
import NewsList from '@/components/NewsList';
import Footer from '@/components/Footer';
import { getLocale, getTranslations } from 'next-intl/server';

export default async function Home() {
  const newsItems = getChronologicalNews();
  const [headerTranslations, newsTranslations, locale] = await Promise.all([
    getTranslations('header'),
    getTranslations('news'),
    getLocale()
  ]);

  if (!newsItems.length) {
    return (
      <div className="relative min-h-screen text-white">
        <Header />
        <main className="mx-auto flex min-h-[70vh] max-w-4xl flex-1 items-center justify-center px-6 py-24 text-center">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 px-10 py-14 shadow-[0_60px_150px_-100px_rgba(88,110,255,0.8)] backdrop-blur-2xl">
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">{newsTranslations('noData')}</h1>
            <p className="mt-4 text-base text-white/60">{newsTranslations('noDataDesc')}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const latestItem = newsItems[0];
  const formattedAnchorDate = latestItem
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: 'long',
        timeStyle: 'short'
      }).format(new Date(latestItem.publishDate))
    : null;

  const headlineDay = latestItem
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: 'full'
      }).format(new Date(`${latestItem.day}T00:00:00`))
    : null;

  return (
    <div className="relative min-h-screen text-white">
      <Header />
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col gap-12 px-4 pb-24 pt-16 lg:flex-row lg:items-start lg:gap-16 lg:px-6">
        <section className="w-full lg:max-w-sm xl:max-w-md">
          <div className="sticky top-32 flex flex-col gap-6 rounded-[2.5rem] border border-white/10 bg-white/5 px-8 py-10 shadow-[0_55px_140px_-90px_rgba(82,109,255,0.75)] backdrop-blur-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/55">
              {headerTranslations('subtitle')}
            </p>
            <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {newsTranslations('heroTitle')}
            </h1>
            <p className="text-base text-white/70 sm:text-lg">
              {newsTranslations('heroSubtitle')}
            </p>
            <p className="text-sm leading-relaxed text-white/60">
              {newsTranslations('heroDescription')}
            </p>
            {headlineDay && (
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/75">
                {headlineDay}
              </div>
            )}
            {formattedAnchorDate && (
              <div className="inline-flex flex-col gap-1 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-medium text-white/80">
                <span className="uppercase tracking-[0.3em] text-white/60">
                  {newsTranslations('lastUpdated')}
                </span>
                <span className="text-sm text-white/90">{formattedAnchorDate}</span>
              </div>
            )}
          </div>
        </section>

        <section className="w-full flex-1 lg:pl-4">
          <NewsList items={newsItems} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
