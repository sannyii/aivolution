'use client';

import { useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllAvailableDates, getNewsByDate } from '@/lib/news';
import { useTranslations } from 'next-intl';

declare global {
  interface Window {
    TL: unknown;
  }
}

export default function HistoryPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('history');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js';
    script.onload = () => {
      const events = getAllAvailableDates().map((date) => {
        const daily = getNewsByDate(date);
        const text = daily?.news
          .slice(0, 3)
          .map((n) => n.title)
          .join('<br/>');
        const [year, month, day] = date.split('-').map(Number);
        return {
          start_date: { year, month, day },
          text: { headline: date, text }
        };
      });
      const data = { events };
      if (containerRef.current) {
        // @ts-expect-error timelinejs is loaded globally
        new window.TL.Timeline(containerRef.current, data);
      }
    };
    document.body.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css';
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">{t('title')}</h1>
        <div ref={containerRef} id="timeline-embed" />
      </main>
      <Footer />
    </div>
  );
}
