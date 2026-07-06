'use client';

import { useRef } from 'react';
import { NoteSearch } from '@/components/docs/note-search';
import { TableOfContents } from '@/components/docs/table-of-contents';
import type { TocHeading } from '@/types/note';

export function NoteContent({ contentHtml, toc }: { contentHtml: string; toc: TocHeading[] }) {
  const articleRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={articleRef}
        className="prose-doc"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <NoteSearch articleRef={articleRef} />
          <TableOfContents headings={toc} />
        </div>
      </div>
    </>
  );
}
