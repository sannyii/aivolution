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
    <div className="relative min-h-screen text-white">
      <Header />
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-24 pt-16 lg:px-6">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 px-8 py-10 text-center shadow-[0_55px_140px_-90px_rgba(82,109,255,0.75)] backdrop-blur-2xl">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">{t('title')}</h1>
          <p className="mt-4 text-base text-white/70 sm:text-lg">{t('subtitle')}</p>
        </section>

        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_60px_160px_-100px_rgba(88,110,255,0.78)] backdrop-blur-2xl sm:p-8">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-indigo-500/30 blur-[150px]" />
          <div className="pointer-events-none absolute -bottom-40 right-16 h-72 w-72 rounded-full bg-rose-500/25 blur-[160px]" />
          <div ref={containerRef} id="timeline-embed" className="relative min-h-[420px] w-full sm:min-h-[520px]" />
        </section>
      </main>
      <Footer />
    </div>
  );
}
