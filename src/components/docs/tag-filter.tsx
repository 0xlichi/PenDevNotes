"use client";

import { useMemo, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { NoteCard } from "@/components/docs/note-card";
import { cn } from "@/lib/utils";
import type { NoteSummary } from "@/types/note";

/**
 * Interactive tag browser: click a tag to filter the note grid below it.
 * Click the same tag again (or "All") to clear the filter.
 *
 * `useTransition` marks the filtering itself as a low-priority update, so
 * the tag button's own pressed state responds instantly even while the
 * (very fast, but non-zero) grid re-render happens - the `isPending` flag
 * drives a brief fade on the results grid so the change reads as intentional
 * rather than jumpy.
 */
export function TagFilter({
  tags,
  notes,
}: {
  tags: { name: string; count: number }[];
  notes: NoteSummary[];
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    if (!selected) return notes;
    return notes.filter((note) => (note.tags ?? []).includes(selected));
  }, [selected, notes]);

  function select(tag: string | null) {
    startTransition(() => setSelected(tag));
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => select(null)} className="transition-transform active:scale-95">
          <Badge variant={selected === null ? "accent" : "outline"}>All notes</Badge>
        </button>
        {tags.map((tag) => (
          <button
            key={tag.name}
            onClick={() => select(tag.name)}
            className="transition-transform active:scale-95"
          >
            <Badge variant={selected === tag.name ? "accent" : "outline"}>
              #{tag.name} <span className="ml-1 opacity-70">{tag.count}</span>
            </Badge>
          </button>
        ))}
      </div>

      <div
        className={cn(
          "transition-opacity duration-150",
          isPending ? "opacity-40" : "opacity-100 animate-fade-in-up"
        )}
      >
        {filtered.length === 0 ? (
          <p className="text-sm text-[#7a6b56]">No notes tagged &ldquo;{selected}&rdquo; yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((note, i) => (
              <NoteCard key={note.slug} note={note} staggerIndex={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
