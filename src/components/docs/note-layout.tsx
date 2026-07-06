'use client';

import { useRef } from 'react';
import { NoteSearch } from '@/components/docs/note-search';
import { CodeCopyButtons } from '@/components/docs/code-copy-buttons';
import { TableOfContents } from '@/components/docs/table-of-contents';
import type { TocHeading } from '@/types/note';

/**
 * Wraps the note's rendered content and the ToC/search sidebar in one
 * client component, so both can share a single ref to the article's DOM
 * node (needed for in-note search to find and highlight text).
 */
export function NoteLayout({ contentHtml, toc }: { contentHtml: string; toc: TocHeading[] }) {
  const articleRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={articleRef}>
        <CodeCopyButtons html={contentHtml} />
      </div>

      {/* Table of contents column - sticky, hidden on mobile */}
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <NoteSearch articleRef={articleRef} size="lg" />
          <TableOfContents headings={toc} />
        </div>
      </div>
    </>
  );
}
