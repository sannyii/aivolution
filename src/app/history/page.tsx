'use client';

import { useEffect, useState } from 'react';
import { getAllAvailableDates, getNewsByDate } from '@/lib/news';
import { NewsItem } from '@/types/news';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<Array<{date: string; news: NewsItem[]}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistoryData = () => {
      const dates = getAllAvailableDates();
      const history = dates.map(date => {
        const dailyNews = getNewsByDate(date);
        if (dailyNews) {
          return {
            date: date,
            news: dailyNews.news.slice(0, 3) // 只显示每天的前3条新闻
          };
        }
        return null;
      }).filter((item): item is {date: string; news: NewsItem[]} => item !== null);

      setHistoryData(history);
      setLoading(false);
    };

    loadHistoryData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      '产品发布': '#3B82F6',
      '技术突破': '#10B981',
      'AI安全': '#F59E0B',
      '企业应用': '#8B5CF6',
      '自动驾驶': '#EF4444',
      '硬件技术': '#06B6D4',
      '开源技术': '#84CC16',
      '医疗AI': '#F97316',
      '环境AI': '#14B8A6',
      'AI政策': '#6366F1'
    };
    return colorMap[category] || '#6B7280';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (historyData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              历史新闻时间线
            </h1>
            <p className="text-gray-600">
              暂无历史新闻数据
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
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            历史新闻时间线
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            回顾AI领域的重要发展历程
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-8">
          {historyData.map((dayData, dayIndex) => (
            <div key={dayData.date} className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {dayIndex + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {formatDate(dayData.date)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {dayData.news.length} 条新闻
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {dayData.news.map((news: NewsItem) => (
                  <div key={news.id} className="border-l-4 pl-4 py-2" style={{ borderColor: getCategoryColor(news.category) }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {news.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {news.summary}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span 
                            className="text-xs px-2 py-1 rounded-full text-white"
                            style={{ backgroundColor: getCategoryColor(news.category) }}
                          >
                            {news.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {news.author}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={news.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        阅读 →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            时间线展示了AI领域的重要发展历程
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
