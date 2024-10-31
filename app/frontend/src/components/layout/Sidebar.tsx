'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCases } from '@/lib/hooks/useCases';
import { cn } from '@/lib/utils/helpers';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const { data: cases } = useCases();

  return (
    <aside
      className={cn(
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700",
        "w-64 transition-all duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full"
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