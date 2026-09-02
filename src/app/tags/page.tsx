import { getAllTags, getAllNoteSummaries } from "@/lib/markdown";
import { TagFilter } from "@/components/docs/tag-filter";

export const metadata = { title: "Tags" };

/**
 * Tags page: shows every tag used across all notes and lets the user filter
 * the note grid by clicking one (handled client-side in <TagFilter>).
 */
export default function TagsPage() {
  const tags = getAllTags();
  const notes = getAllNoteSummaries();

  return (
    <div>
      <div className="animate-fade-in-up">
        <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-ink">
          Browse the notebook
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Tags</h1>
        <p className="mt-3 text-base text-[#7a6b56]">
          Click a tag to filter notes. {tags.length} tag{tags.length !== 1 ? "s" : ""} in total.
        </p>
      </div>

      <div className="mt-8">
        <TagFilter tags={tags} notes={notes} />
      </div>
    </div>
  );
}
