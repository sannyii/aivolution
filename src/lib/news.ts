import { DailyNews } from '@/types/news';
import type { ChronologicalNewsItem } from '@/types/news';
import newsData from '@/data/news.json';

export function getTodayNews(): DailyNews | null {
  const today = new Date().toISOString().split('T')[0];
  
  // 如果今天有数据，返回今天的新闻
  if (newsData[today as keyof typeof newsData]) {
    return newsData[today as keyof typeof newsData] as DailyNews;
  }
  
  // 否则返回最新的可用数据
  const dates = Object.keys(newsData).sort().reverse();
  if (dates.length > 0) {
    const latestDate = dates[0];
    return newsData[latestDate as keyof typeof newsData] as DailyNews;
  }
  
  return null;
}

export function getNewsByDate(date: string): DailyNews | null {
  if (newsData[date as keyof typeof newsData]) {
    return newsData[date as keyof typeof newsData] as DailyNews;
  }
  return null;
}

export function getAllAvailableDates(): string[] {
  return Object.keys(newsData).sort().reverse();
}

export function getNewsByCategory(category: string): DailyNews[] {
  const allDates = getAllAvailableDates();
  const result: DailyNews[] = [];
  
  allDates.forEach(date => {
    const dailyNews = newsData[date as keyof typeof newsData] as DailyNews;
    const filteredNews = dailyNews.news.filter(news => 
      news.category === category || news.tags.includes(category)
    );
    
    if (filteredNews.length > 0) {
      result.push({
        date: dailyNews.date,
        news: filteredNews
      });
    }
  });
  
  return result;
}

export function getChronologicalNews(): ChronologicalNewsItem[] {
  const entries: ChronologicalNewsItem[] = [];

  Object.entries(newsData).forEach(([date, daily]) => {
    const dailyNews = daily as DailyNews;
    dailyNews.news.forEach((item) => {
      entries.push({
        ...item,
        day: date
      });
    });
  });

  return entries.sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}
