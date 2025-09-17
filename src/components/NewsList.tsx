'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { ChronologicalNewsItem } from '@/types/news';
import NewsCard from './NewsCard';

interface NewsListProps {
  items: ChronologicalNewsItem[];
}

interface FeedEntry {
  item: ChronologicalNewsItem;
  accent: string;
  size: 'sm' | 'md' | 'lg';
  sequence: number;
}

const BATCH_SIZE = 6;
const accentPalette = ['#6366f1', '#22d3ee', '#f97316', '#a855f7', '#14b8a6', '#f472b6', '#38bdf8'];
const sizeCycle: Array<FeedEntry['size']> = ['lg', 'md', 'sm', 'md', 'lg', 'sm'];

const createEntry = (item: ChronologicalNewsItem, index: number): FeedEntry => ({
  item,
  accent: accentPalette[index % accentPalette.length],
  size: sizeCycle[index % sizeCycle.length],
  sequence: index
});

export default function NewsList({ items }: NewsListProps) {
  const t = useTranslations('news');
  const locale = useLocale();

  const cursorRef = useRef(0);
  const counterRef = useRef(0);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const initialFeed = useMemo(() => {
    if (items.length === 0) {
      cursorRef.current = 0;
      counterRef.current = 0;
      return [] as FeedEntry[];
    }

    const initialCount = Math.min(items.length, BATCH_SIZE * 2);
    const produced: FeedEntry[] = [];
    let cursor = 0;

    for (let index = 0; index < initialCount; index += 1) {
      const baseItem = items[cursor];
      produced.push(createEntry(baseItem, index));
      cursor += 1;
      if (cursor >= items.length) {
        cursor = 0;
      }
    }

    cursorRef.current = cursor;
    counterRef.current = produced.length;
    return produced;
  }, [items]);

  const [feed, setFeed] = useState<FeedEntry[]>(initialFeed);

  useEffect(() => {
    setFeed(initialFeed);
    loadingRef.current = false;
  }, [initialFeed]);

  const loadMore = useCallback(() => {
    if (loadingRef.current || items.length === 0) {
      return;
    }
    loadingRef.current = true;

    setFeed((previous) => {
      const appended: FeedEntry[] = [];
      let cursor = cursorRef.current;
      const counter = counterRef.current;

      for (let offset = 0; offset < BATCH_SIZE; offset += 1) {
        const item = items[cursor];
        appended.push(createEntry(item, counter + offset));
        cursor += 1;
        if (cursor >= items.length) {
          cursor = 0;
        }
      }

      cursorRef.current = cursor;
      counterRef.current = counter + appended.length;
      loadingRef.current = false;

      return [...previous, ...appended];
    });
  }, [items]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadMore();
          }
        });
      },
      { rootMargin: '600px', threshold: 0 }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [loadMore]);

  const formattedLastUpdated = useMemo(() => {
    if (!items.length) return null;
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'long',
      timeStyle: 'short'
    }).format(new Date(items[0].publishDate));
  }, [items, locale]);

  if (!items.length) {
    return (
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-6 py-16 text-center text-white/70 shadow-[0_40px_120px_-80px_rgba(91,112,255,0.7)] backdrop-blur-2xl">
        <p className="text-lg font-medium">{t('noData')}</p>
        <p className="mt-3 text-sm text-white/50">{t('noDataDesc')}</p>
      </div>
    );
  }

  return (
    <section className="relative w-full">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 px-6 py-10 shadow-[0_60px_160px_-100px_rgba(88,110,255,0.78)] backdrop-blur-2xl sm:px-10">
        <div className="pointer-events-none absolute -top-36 right-16 h-64 w-64 rounded-full bg-indigo-500/30 blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-44 left-10 h-72 w-72 rounded-full bg-rose-500/25 blur-[160px]" />

        <div className="relative">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 text-white/70">
            <div className="max-w-xl space-y-2">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-white/60">
                {t('scrollHint')}
              </p>
              <p className="text-sm text-white/55">{t('infiniteHint')}</p>
            </div>
            {formattedLastUpdated && (
              <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white/75 backdrop-blur">
                <span>{t('lastUpdated')}</span>
                <span className="ml-2 text-white/90">{formattedLastUpdated}</span>
              </div>
            )}
          </div>

          <div className="columns-1 gap-6 sm:columns-2 2xl:columns-3 [column-fill:_balance]">
            {feed.map((entry) => (
              <NewsCard
                key={`${entry.item.id}-${entry.sequence}`}
                item={entry.item}
                accent={entry.accent}
                size={entry.size}
                sequence={entry.sequence}
              />
            ))}
          </div>

          <div ref={sentinelRef} className="h-2 w-full" aria-hidden />
        </div>
      </div>
    </section>
  );
}