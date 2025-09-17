'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { ChronologicalNewsItem } from '@/types/news';

interface NewsCardProps {
  item: ChronologicalNewsItem;
  accent: string;
  size: 'sm' | 'md' | 'lg';
  sequence: number;
}

const sizeClassMap: Record<NewsCardProps['size'], string> = {
  sm: 'min-h-[280px] px-6 py-7',
  md: 'min-h-[330px] px-7 py-8',
  lg: 'min-h-[400px] px-8 py-10'
};

const categoryMapping: Record<string, string> = {
  '产品发布': 'productRelease',
  '技术突破': 'techBreakthrough',
  'AI安全': 'aiSafety',
  '企业应用': 'enterpriseApp',
  '自动驾驶': 'autonomousDriving',
  '硬件技术': 'hardwareTech',
  '开源技术': 'openSource',
  '医疗AI': 'medicalAI',
  '环境AI': 'environmentAI',
  'AI政策': 'aiPolicy'
};

export default function NewsCard({ item, accent, size, sequence }: NewsCardProps) {
  const locale = useLocale();
  const t = useTranslations('news');
  const catT = useTranslations('news.categories');

  const publishedAt = useMemo(() => new Date(item.publishDate), [item.publishDate]);
  const formattedPublishTime = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(publishedAt),
    [locale, publishedAt]
  );

  const dayDescriptor = useMemo(() => {
    const base = new Date(`${item.day}T00:00:00`);
    return new Intl.DateTimeFormat(locale, {
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    }).format(base);
  }, [item.day, locale]);

  const categoryLabel = useMemo(() => {
    const normalized = categoryMapping[item.category];
    if (normalized) {
      return catT(normalized);
    }
    return item.category;
  }, [catT, item.category]);

  const accentSurface = `${accent}1f`;
  const accentBorder = `${accent}55`;
  const accentGlow = `${accent}a0`;

  const sizeClass = sizeClassMap[size];

  return (
    <article
      className={`group relative mb-6 break-inside-avoid rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_40px_110px_-60px_rgba(129,140,248,0.75)] ${sizeClass}`}
      style={{
        borderColor: accentBorder,
        boxShadow: `0 26px 70px -45px ${accentGlow}`
      }}
    >
      <div
        className="pointer-events-none absolute -top-28 right-[-90px] h-52 w-52 rounded-full opacity-60 blur-3xl transition duration-500 group-hover:opacity-80"
        style={{ background: accentGlow }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-[-80px] h-60 w-60 rounded-full opacity-40 blur-3xl"
        style={{ background: accentSurface }}
      />
      <div className="pointer-events-none absolute inset-px rounded-[calc(1.5rem-4px)] border border-white/10" />

      <div className="relative flex h-full flex-col gap-6">
        <header className="flex flex-wrap items-start justify-between gap-4 text-xs text-white/60">
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white/70">
              {dayDescriptor}
            </span>
            <time className="text-[0.7rem] text-white/50">{formattedPublishTime}</time>
          </div>
          <span className="inline-flex items-center whitespace-nowrap rounded-full border border-white/15 bg-slate-900/30 px-3 py-1 text-[0.7rem] font-medium text-white/80">
            {categoryLabel}
          </span>
        </header>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold leading-snug text-white sm:text-2xl">
            {item.title}
          </h2>
          <p className="text-sm leading-relaxed text-white/70 sm:text-base">
            {item.summary}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag, index) => (
            <span
              key={`${item.id}-tag-${index}-${sequence}`}
              className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/70 transition-colors duration-300 group-hover:border-white/20 group-hover:text-white/80"
              style={{
                borderColor: accentBorder,
                background: accentSurface
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <footer className="mt-auto flex flex-wrap items-center justify-between gap-3 text-xs text-white/60 sm:text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span>
              {t('author')}: <span className="text-white/80">{item.author}</span>
            </span>
            <span className="hidden text-white/40 sm:inline">•</span>
            <span>
              {t('source')}: <span className="text-white/80">{item.source}</span>
            </span>
          </div>
          <Link
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 transition-all duration-300 hover:border-white/30 hover:bg-white/20 hover:text-white"
          >
            {t('readMore')}
            <span aria-hidden className="text-base leading-none">
              →
            </span>
          </Link>
        </footer>
      </div>
    </article>
  );
}