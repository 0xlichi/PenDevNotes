'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { NoteCard } from '@/components/docs/note-card';
import type { NoteSummary } from '@/types/note';

const PAGE_SIZE = 9;

/** Displays notes in small batches so larger collections stay easy to scan. */
export function LoadMoreNotes({ notes }: { notes: NoteSummary[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleNotes = notes.slice(0, visibleCount);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {visibleNotes.map((note, i) => (
          <NoteCard key={note.slug} note={note} staggerIndex={i} />
        ))}
      </div>

      {visibleCount < notes.length && (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          className="mx-auto mt-8 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-terracotta hover:bg-[#f1e6d3] hover:shadow-md active:scale-[0.98]"
        >
          Load more notes
          <ChevronDown className="h-4 w-4 text-terracotta-ink" />
        </button>
      )}
    </>
  );
}
