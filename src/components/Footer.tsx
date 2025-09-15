import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('header.nav');
  const headerT = useTranslations('header');
  const locale = useLocale();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <h3 className="text-xl font-bold">{headerT('title')}</h3>
            </div>
            <p className="text-gray-400 text-sm">
              {t('description')}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={`/${locale}`} className="text-gray-400 hover:text-white transition-colors duration-200">
                  {nav('today')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/history`} className="text-gray-400 hover:text-white transition-colors duration-200">
                  {nav('history')}
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {nav('about')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t('contact')}</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>{t('email')}: contact@ainews.com</p>
              <p>{t('phone')}: +86 400-123-4567</p>
              <p>{t('address')}: Beijing</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 AI News Feed. {t('copyright')}.</p>
        </div>
      </div>
    </footer>
  );
}