import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NoteSummary } from "@/types/note";

/** Displays dates written as YYYY-MM-DD or DD-MM-YYYY without changing the input format. */
function formatDate(date?: string) {
  if (!date) return null;
  return date;
}

/**
 * A single note preview card - used on the homepage and category/tag listing pages.
 * `staggerIndex` (optional) drives a small entrance-animation delay so grids
 * of cards fade in one after another instead of all at once.
 */
export function NoteCard({ note, staggerIndex }: { note: NoteSummary; staggerIndex?: number }) {
  const formattedDate = formatDate(note.date);

  return (
    <Link
      href={`/${note.slug}`}
      className="group block h-full stagger-item"
      style={staggerIndex !== undefined ? ({ "--stagger-index": staggerIndex } as React.CSSProperties) : undefined}
    >
      <Card interactive className="flex h-full flex-col">
        <CardHeader className="gap-3 p-6">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="category">{note.category}</Badge>
            {formattedDate && (
              <span className="font-mono text-xs text-[#a7967d]">{formattedDate}</span>
            )}
          </div>
          <CardTitle className="flex items-start justify-between gap-2 text-lg leading-snug group-hover:text-terracotta-ink">
            <span>{note.title}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0 translate-x-0 translate-y-0 text-terracotta-ink opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
          </CardTitle>
          {note.excerpt && <CardDescription>{note.excerpt}</CardDescription>}
        </CardHeader>
        {note.tags && note.tags.length > 0 && (
          <CardContent className="mt-auto flex flex-wrap gap-1.5 px-6 pb-6 pt-0">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
