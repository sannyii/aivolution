'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('language');

  const switchLanguage = (newLocale: string) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">{t('switch')}:</span>
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => switchLanguage('zh')}
          className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
            locale === 'zh'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t('chinese')}
        </button>
        <button
          onClick={() => switchLanguage('en')}
          className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
            locale === 'en'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t('english')}
        </button>
      </div>
    </div>
  );
}
