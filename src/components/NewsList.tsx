import { DailyNews } from '@/types/news';
import NewsCard from './NewsCard';
import { useLocale, useTranslations } from 'next-intl';

interface NewsListProps {
  dailyNews: DailyNews;
}

export default function NewsList({ dailyNews }: NewsListProps) {
  const t = useTranslations('news');
  const locale = useLocale();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {formatDate(dailyNews.date)} - {t('subtitle')}
        </p>
        <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {dailyNews.news.map((news, index) => (
          <NewsCard key={news.id} news={news} index={index} />
        ))}
      </div>

      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">
          {t('dailyUpdate')}
        </p>
      </div>
    </div>
  );
}