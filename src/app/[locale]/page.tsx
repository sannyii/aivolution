import { getTodayNews } from '@/lib/news';
import Header from '@/components/Header';
import NewsList from '@/components/NewsList';
import Footer from '@/components/Footer';
import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const todayNews = getTodayNews();
  const t = await getTranslations('news');

  if (!todayNews) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t('noData')}
            </h1>
            <p className="text-gray-600">
              {t('noDataDesc')}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <NewsList dailyNews={todayNews} />
      </main>
      <Footer />
    </div>
  );
}
