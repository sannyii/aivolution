export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  tags: string[];
  source: string;
  sourceUrl: string;
  imageUrl?: string;
  priority: number; // 1-10, 数字越小优先级越高
}

export interface DailyNews {
  date: string; // YYYY-MM-DD format
  news: NewsItem[];
}

export type ChronologicalNewsItem = NewsItem & {
  day: string;
};
