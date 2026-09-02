import { getAllCategories } from "@/lib/markdown";
import { LoadMoreCategories } from "@/components/docs/load-more-categories";

export const metadata = { title: "Categories" };

/** Lists every category automatically detected from note front matter. */
export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div>
      <div className="animate-fade-in-up">
        <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-ink">
          Browse the notebook
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Categories</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#7a6b56]">
          Notes are grouped automatically based on each file&apos;s{" "}
          <code className="rounded bg-[#f1e6d3] px-1.5 py-0.5 font-mono text-xs">category</code>{" "}
          front matter.
        </p>
      </div>

      <div className="mt-10">
        <LoadMoreCategories categories={categories} />
      </div>
    </div>
  );
}
