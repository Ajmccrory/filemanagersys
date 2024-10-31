'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/Button';
import { usePathname } from 'next/navigation';

export function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    if (pathname.startsWith('/cases/')) {
      return 'Case Details';
    }
    return 'CaseMap Lite';
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-semibold">
            {getPageTitle()}
          </h1>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}