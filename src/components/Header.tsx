import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useLocale, useTranslations } from 'next-intl';

export default function Header() {
  const t = useTranslations('header');
  const locale = useLocale();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
              <p className="text-sm text-gray-500">{t('subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-8">
              <Link href={`/${locale}`} className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                {t('nav.today')}
              </Link>
              <Link href={`/${locale}/history`} className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                {t('nav.history')}
              </Link>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                {t('nav.about')}
              </a>
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}