"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Search, FileText, CornerDownLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { SearchIndexItem } from "@/lib/search-index";

/**
 * The small "Search..." button in the header that opens the dialog.
 * Also listens for Cmd/Ctrl+K anywhere on the page.
 */
export function SearchTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-[#7a6b56] shadow-sm",
          "transition-all duration-150 ease-out active:scale-[0.97]",
          "hover:border-terracotta hover:text-foreground hover:shadow-md"
        )}
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search notes...</span>
        <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-[#a7967d] sm:inline">
          ⌘K
        </kbd>
      </button>
      {open && <SearchDialog onClose={() => setOpen(false)} />}
    </>
  );
}

/** The actual modal: fetches the search index once, then filters client-side via Fuse.js. */
function SearchDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [indexLoading, setIndexLoading] = useState(true);
  const [results, setResults] = useState<SearchIndexItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const fuseRef = useRef<Fuse<SearchIndexItem> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fetch the pre-built search index once when the dialog opens.
  // `indexLoading` drives the skeleton rows below while this is in flight.
  useEffect(() => {
    fetch("/search-index.json")
      .then((res) => res.json())
      .then((data: SearchIndexItem[]) => {
        fuseRef.current = new Fuse(data, {
          // Search across all the fields the requirements call out:
          // title, content (excerpt), tags, and category.
          keys: [
            { name: "title", weight: 0.4 },
            { name: "tags", weight: 0.25 },
            { name: "category", weight: 0.15 },
            { name: "excerpt", weight: 0.15 },
            { name: "description", weight: 0.05 },
          ],
          threshold: 0.35, // fuzzy but not too loose
          ignoreLocation: true,
        });
      })
      .finally(() => setIndexLoading(false));
    inputRef.current?.focus();
  }, []);

  // Close on Escape - scoped to this component instance so it doesn't
  // fight with other listeners once the dialog is unmounted.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (event.key === "Enter" && results[activeIndex]) {
        goToNote(results[activeIndex].slug);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, activeIndex]);

  const runSearch = useCallback((value: string) => {
    setQuery(value);
    setActiveIndex(0);
    if (!fuseRef.current || value.trim() === "") {
      setResults([]);
      return;
    }
    setResults(fuseRef.current.search(value).slice(0, 8).map((r) => r.item));
  }, []);

  function goToNote(slug: string) {
    onClose();
    router.push(`/notes/${slug}`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#33291f]/40 px-4 pt-24 backdrop-blur-sm animate-fade-in">
      {/* Click the backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="animate-scale-in relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
        <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-[#a7967d]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => runSearch(e.target.value)}
            placeholder={indexLoading ? "Loading index..." : "Search titles, tags, categories..."}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-[#a7967d]"
          />
          <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-[#a7967d]">
            Esc
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {/* Loading state: shimmering skeleton rows while the index fetches */}
          {indexLoading && (
            <div className="space-y-1 p-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2 rounded-lg px-3 py-2.5">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              ))}
            </div>
          )}

          {!indexLoading && query.trim() !== "" && results.length === 0 && (
            <p className="animate-fade-in px-3 py-6 text-center text-sm text-[#a7967d]">
              No notes found for &ldquo;{query}&rdquo;.
            </p>
          )}

          {!indexLoading &&
            results.map((item, i) => (
              <button
                key={item.slug}
                onClick={() => goToNote(item.slug)}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(
                  "flex w-full flex-col gap-1 rounded-lg px-3 py-2.5 text-left",
                  "transition-colors duration-100",
                  i === activeIndex ? "bg-[#f1e6d3]" : "hover:bg-[#f1e6d3]/60"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 shrink-0 text-terracotta-ink" />
                    <span className="text-sm font-medium text-foreground">{item.title}</span>
                  </div>
                  {i === activeIndex && (
                    <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-[#a7967d]" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 pl-5">
                  <Badge variant="category" className="text-[10px]">
                    {item.category}
                  </Badge>
                  {item.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px]">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
