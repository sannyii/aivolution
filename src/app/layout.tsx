import { redirect } from 'next/navigation';

export default function RootLayout() {
  // 重定向到默认语言
  redirect('/zh');
}
