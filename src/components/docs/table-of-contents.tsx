'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { SectionPreview } from '@/components/docs/section-preview';
import type { TocHeading } from '@/types/note';

const HOVER_DELAY_MS = 2000;
const CLOSE_DELAY_MS = 250;

/**
 * Sticky "On this page" navigation.
 * Highlights the heading currently in view using IntersectionObserver.
 * Hovering an item for 500ms opens a large preview of that section's
 * real, already-rendered content without navigating away.
 */
export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState('');
  const [previewId, setPreviewId] = useState<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function handleMouseEnter(id: string) {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setPreviewId(id), HOVER_DELAY_MS);
  }

  function handleMouseLeave() {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    closeTimer.current = setTimeout(() => setPreviewId(null), CLOSE_DELAY_MS);
  }

  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  if (headings.length === 0) {
    return null;
  }

  return (
    <>
      <nav className="animate-fade-in text-sm">
        <p className="mb-3 text-center font-mono text-sm font-bold uppercase tracking-wider text-[#3A7A82]">
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
                onMouseEnter={() => handleMouseEnter(heading.id)}
                onMouseLeave={handleMouseLeave}
                onClick={handleMouseLeave}
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
      <SectionPreview
        headingId={previewId}
        onClose={() => setPreviewId(null)}
        onMouseEnter={cancelClose}
      />{' '}
    </>
  );
}
