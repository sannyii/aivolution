import { DailyNews } from '@/types/news';
import NewsCard from './NewsCard';

interface NewsListProps {
  dailyNews: DailyNews;
}

export default function NewsList({ dailyNews }: NewsListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
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
          AI新闻信息流
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          {formatDate(dailyNews.date)} - 每日精选10条AI领域重大新闻
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
          每日更新 • 精选AI领域最重要的10条新闻
        </p>
      </div>
    </div>
  );
}