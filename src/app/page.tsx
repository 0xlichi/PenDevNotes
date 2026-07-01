import { getAllNoteSummaries, getAllCategories } from "@/lib/markdown";
import { NoteCard } from "@/components/docs/note-card";
import { Sidebar } from "@/components/docs/sidebar";

/**
 * Homepage: automatically lists every Markdown file found in /content,
 * newest first, alongside a category rail for quick filtering by section.
 */
export default function HomePage() {
  const notes = getAllNoteSummaries();
  const categories = getAllCategories();

  return (
    <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
      <div className="hidden lg:block">
        <div className="sticky top-24 animate-fade-in">
          <Sidebar />
        </div>
      </div>

      <div>
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Pentest &amp; Dev Notebook
          </h1>
          <p className="mt-2 max-w-2xl text-[#7a6b56]">
            {notes.length} note{notes.length !== 1 ? "s" : ""} across {categories.length}{" "}
            categor{categories.length !== 1 ? "ies" : "y"}. Press{" "}
            <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-xs">
              ⌘K
            </kbd>{" "}
            to search.
          </p>
        </div>

        {notes.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {notes.map((note, i) => (
              <NoteCard key={note.slug} note={note} staggerIndex={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Shown when /content has no Markdown files yet. */
function EmptyState() {
  return (
    <div className="animate-fade-in-up rounded-xl border border-dashed border-border bg-surface p-10 text-center">
      <p className="font-medium text-foreground">No notes yet</p>
      <p className="mt-1 text-sm text-[#7a6b56]">
        Add a <code className="rounded bg-[#f1e6d3] px-1.5 py-0.5 font-mono">.md</code> file to
        the <code className="rounded bg-[#f1e6d3] px-1.5 py-0.5 font-mono">/content</code> folder
        to see it appear here.
      </p>
    </div>
  );
}
