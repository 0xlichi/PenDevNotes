'use client';

import Link from 'next/link';
import { ArrowUpRight, ChevronDown, Folder } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const PAGE_SIZE = 9;

type Category = { name: string; count: number };

function categorySlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Displays the category directory in batches for repositories with many sections. */
export function LoadMoreCategories({ categories }: { categories: Category[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleCategories = categories.slice(0, visibleCount);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCategories.map((category, i) => (
          <Link
            key={category.name}
            href={`/categories/${categorySlug(category.name)}`}
            className="group stagger-item"
            style={{ '--stagger-index': i } as React.CSSProperties}
          >
            <Card interactive>
              <CardContent className="flex items-center justify-between p-5">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <Folder className="h-4 w-4 text-terracotta-ink transition-transform duration-200 group-hover:scale-110" />
                  {category.name}
                  <ArrowUpRight className="h-3.5 w-3.5 text-terracotta-ink opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </span>
                <span className="font-mono text-xs text-[#a7967d]">
                  {category.count} note{category.count !== 1 ? 's' : ''}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {visibleCount < categories.length && (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          className="mx-auto mt-8 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-terracotta hover:bg-[#f1e6d3] hover:shadow-md active:scale-[0.98]"
        >
          Load more categories
          <ChevronDown className="h-4 w-4 text-terracotta-ink" />
        </button>
      )}
    </>
  );
}
