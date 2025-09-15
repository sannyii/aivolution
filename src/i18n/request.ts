import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'zh', 'ja', 'ko'];

export default getRequestConfig(async ({ locale }) => {
  // 验证传入的 locale 参数
  if (!locale || !locales.includes(locale)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
