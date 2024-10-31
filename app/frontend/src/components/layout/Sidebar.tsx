'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCases } from '@/lib/hooks/useCases';
import { cn } from '@/lib/utils/helpers';

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname(); // Use the pathname
    const { data: cases } = useCases(); // Use the cases hook
  
    const toggleSidebar = () => {
      setIsOpen(prev => !prev);
    };

    return (
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        >
      <div className="p-4">
        <nav className="space-y-2">
          <Link
            href="/"
            className={cn(
              "flex items-center space-x-2 p-2 rounded-lg",
              pathname === "/" ? "bg-gray-100 dark:bg-gray-700" : "hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            <span>Dashboard</span>
          </Link>

          <div className="pt-4">
            <h3 className="px-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
              Cases
            </h3>
            <div className="mt-2 space-y-1">
              {cases?.map((case_) => (
                <Link
                  key={case_.id}
                  href={`/cases/${case_.id}`}
                  className={cn(
                    "block px-2 py-1 text-sm rounded-lg",
                    pathname === `/cases/${case_.id}` 
                      ? "bg-gray-100 dark:bg-gray-700" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                >
                  <button onClick={toggleSidebar} className="md:hidden">
        Toggle Sidebar
      </button>
                  {case_.title}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}