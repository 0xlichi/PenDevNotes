import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCategories, getNotesByCategory, slugify } from "@/lib/markdown";
import { LoadMoreNotes } from "@/components/docs/load-more-notes";
import { Sidebar } from "@/components/docs/sidebar";

interface PageProps {
  params: Promise<{ category: string }>;
}

/** Pre-renders a page for every category found across all notes. */
export function generateStaticParams() {
  return getAllCategories().map((category) => ({ category: slugify(category.name) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const notes = getNotesByCategory(category);
  const label = notes[0]?.category ?? category;
  return { title: label };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const notes = getNotesByCategory(category);
  if (notes.length === 0) notFound();

  const label = notes[0]?.category ?? category;

  return (
    <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] xl:gap-16">
      <div className="hidden lg:block">
        <div className="sticky top-24 animate-fade-in">
          <Sidebar activeCategory={label} />
        </div>
      </div>

      <div>
        <div className="animate-fade-in-up">
          <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-ink">
            Category
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">{label}</h1>
          <p className="mt-3 text-base text-[#7a6b56]">
            {notes.length} note{notes.length !== 1 ? "s" : ""} in this category.
          </p>
        </div>

        <div className="mt-10">
          <LoadMoreNotes notes={notes} />
        </div>
      </div>
    </div>
  );
}
