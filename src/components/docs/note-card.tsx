import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NoteSummary } from "@/types/note";

/** Formats an ISO date string like "2026-01-15" into "Jan 15, 2026". Falls back gracefully. */
function formatDate(date?: string) {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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
      href={`/notes/${note.slug}`}
      className="group block h-full stagger-item"
      style={staggerIndex !== undefined ? ({ "--stagger-index": staggerIndex } as React.CSSProperties) : undefined}
    >
      <Card interactive className="flex h-full flex-col">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="category">{note.category}</Badge>
            {formattedDate && (
              <span className="font-mono text-xs text-[#a7967d]">{formattedDate}</span>
            )}
          </div>
          <CardTitle className="flex items-start justify-between gap-2 text-lg group-hover:text-terracotta-ink">
            <span>{note.title}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0 translate-x-0 translate-y-0 text-terracotta-ink opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
          </CardTitle>
          {note.excerpt && <CardDescription>{note.excerpt}</CardDescription>}
        </CardHeader>
        {note.tags && note.tags.length > 0 && (
          <CardContent className="mt-auto flex flex-wrap gap-1.5 pt-0">
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
