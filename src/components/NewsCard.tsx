import { NewsItem } from '@/types/news';
import Link from 'next/link';

interface NewsCardProps {
  news: NewsItem;
  index: number;
}

export default function NewsCard({ news, index }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryTranslation = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      '产品发布': '产品发布',
      '技术突破': '技术突破',
      'AI安全': 'AI安全',
      '企业应用': '企业应用',
      '自动驾驶': '自动驾驶',
      '硬件技术': '硬件技术',
      '开源技术': '开源技术',
      '医疗AI': '医疗AI',
      '环境AI': '环境AI',
      'AI政策': 'AI政策'
    };
    return categoryMap[category] || category;
  };

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              #{index + 1}
            </span>
            <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {getCategoryTranslation(news.category)}
            </span>
          </div>
          <time className="text-sm text-gray-500">
            {formatDate(news.publishDate)}
          </time>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {news.title}
        </h2>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {news.summary}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {news.tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>作者: {news.author}</span>
            <span>•</span>
            <span>来源: {news.source}</span>
          </div>
          
          <Link
            href={news.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
          >
            阅读原文
          </Link>
        </div>
      </div>
    </article>
  );
}