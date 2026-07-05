'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { TocHeading } from '@/types/note';

/**
 * Sticky "On this page" navigation.
 * Highlights the heading currently in view using IntersectionObserver.
 */
export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-96px 0px -70% 0px',
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="animate-fade-in text-sm">
      <p className="mb-3 font-mono  text-sm font-bold  uppercase text-center tracking-wider text-[#3A7A82]">
        On this page!
      </p>

      <ul className="toc-scroll max-h-[70vh] space-y-2 overflow-y-auto border-l border-border pr-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{
              paddingLeft: (heading.level - 2) * 12 + 12,
            }}
          >
            <a
              href={`#${heading.id}`}
              className={cn(
                '-ml-px block border-l-2 py-0.5 pl-3 transition-all duration-200 ease-out hover:translate-x-0.5 hover:text-foreground',
                activeId === heading.id
                  ? 'border-terracotta font-medium text-terracotta-ink'
                  : 'border-transparent text-[#a7967d]'
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
