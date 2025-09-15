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
        {['zh', 'en', 'ja', 'ko'].map((loc) => (
          <button
            key={loc}
            onClick={() => switchLanguage(loc)}
            className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
              locale === loc
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t(
              loc === 'zh'
                ? 'chinese'
                : loc === 'en'
                ? 'english'
                : loc === 'ja'
                ? 'japanese'
                : 'korean'
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
