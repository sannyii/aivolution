import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI新闻信息流</h1>
              <p className="text-sm text-gray-500">每日精选AI领域重大新闻</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                今日新闻
              </Link>
              <Link href="/history" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                历史新闻
              </Link>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                关于我们
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}