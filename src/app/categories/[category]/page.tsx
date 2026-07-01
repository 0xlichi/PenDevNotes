import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCategories, getNotesByCategory, slugify } from "@/lib/markdown";
import { NoteCard } from "@/components/docs/note-card";
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
    <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
      <div className="hidden lg:block">
        <div className="sticky top-24 animate-fade-in">
          <Sidebar activeCategory={label} />
        </div>
      </div>

      <div>
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{label}</h1>
          <p className="mt-2 text-[#7a6b56]">
            {notes.length} note{notes.length !== 1 ? "s" : ""} in this category.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          {notes.map((note, i) => (
            <NoteCard key={note.slug} note={note} staggerIndex={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
