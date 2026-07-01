import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { NoteSummary } from "@/types/note";

/** Renders "Previous" / "Next" note links at the bottom of a doc page. */
export function NotePagination({
  previous,
  next,
}: {
  previous: NoteSummary | null;
  next: NoteSummary | null;
}) {
  if (!previous && !next) return null;

  return (
    <div className="mt-12 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
      {previous ? (
        <Link
          href={`/notes/${previous.slug}`}
          className={[
            "group flex flex-col gap-1 rounded-xl border border-border bg-surface p-4 shadow-sm",
            "transition-all duration-200 ease-out",
            "hover:-translate-y-0.5 hover:border-terracotta hover:shadow-[0_8px_24px_-8px_rgba(230,184,162,0.5)]",
          ].join(" ")}
        >
          <span className="flex items-center gap-1.5 font-mono text-xs text-[#a7967d]">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:-translate-x-1" />{" "}
            Previous
          </span>
          <span className="font-medium text-foreground group-hover:text-terracotta-ink">
            {previous.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/notes/${next.slug}`}
          className={[
            "group flex flex-col items-end gap-1 rounded-xl border border-border bg-surface p-4 text-right shadow-sm",
            "transition-all duration-200 ease-out",
            "hover:-translate-y-0.5 hover:border-terracotta hover:shadow-[0_8px_24px_-8px_rgba(230,184,162,0.5)]",
          ].join(" ")}
        >
          <span className="flex items-center gap-1.5 font-mono text-xs text-[#a7967d]">
            Next{" "}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
          </span>
          <span className="font-medium text-foreground group-hover:text-terracotta-ink">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
