import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllSlugs, getNoteBySlug, getAdjacentNotes, slugify } from '@/lib/markdown';
import { Badge } from '@/components/ui/badge';
import { TableOfContents } from '@/components/docs/table-of-contents';
import { NotePagination } from '@/components/docs/note-pagination';
import { NoteArticle } from '@/components/docs/note-article';
import { NoteSearchById } from '@/components/docs/note-search-by-id';

interface PageProps {
  // Catch-all route: /notes/pentest/sql-injection -> ["pentest", "sql-injection"]
  params: Promise<{ slug: string[] }>;
}

/** Pre-renders every note at build time (static generation) for fast page loads. */
export function generateStaticParams() {
  // Each slug (which may contain "/") becomes an array of segments,
  // e.g. "pentest/sql-injection" -> ["pentest", "sql-injection"]
  return getAllSlugs().map((slug) => ({ slug: slug.split('/') }));
}

/** Per-page <title> / meta description, generated from the note's front matter. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNoteBySlug(slug.join('/'));
  if (!note) return {};
  return { title: note.title, description: note.description };
}

function formatDate(date?: string) {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default async function NotePage({ params }: PageProps) {
  const { slug: slugParts } = await params;
  const slug = slugParts.join('/');
  const note = await getNoteBySlug(slug);
  if (!note) notFound();
  const { previous, next } = getAdjacentNotes(slug);
  const formattedDate = formatDate(note.date);
  return (
    <div className="note-page-layout grid gap-16 lg:grid-cols-[minmax(0,1fr)_280px]">
      <article className="animate-fade-in-up">
        {/* Breadcrumb-ish header */}
        <div className="mb-10 border-b border-border/80 pb-8">
          <Link
            href={`/categories/${slugify(note.category ?? 'Uncategorized')}`}
            className="inline-flex transition-transform duration-150 hover:-translate-y-0.5"
          >
            <Badge variant="category">{note.category}</Badge>
          </Link>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.025em] text-foreground sm:text-5xl">
            {note.title}
          </h1>
          {note.description && <p className="mt-4 max-w-3xl text-lg leading-8 text-[#7a6b56]">{note.description}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {formattedDate && (
              <span className="font-mono text-xs text-[#a7967d]">{formattedDate}</span>
            )}
            <div className="flex flex-wrap gap-1.5">
              {(note.tags ?? []).map((tag) => (
                <Link
                  key={tag}
                  href={`/tags#${slugify(tag)}`}
                  className="inline-block transition-transform duration-150 hover:-translate-y-0.5"
                >
                  <Badge variant="outline">#{tag}</Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
        {/* Rendered Markdown content (already syntax-highlighted server-side),
            with a permanent copy button injected into every code block.
            Wrapped in a div with a stable id so the search bar in the
            sidebar (rendered separately below) can locate and search it. */}
        <div id="note-article-content">
          <NoteArticle contentHtml={note.contentHtml} />
        </div>
        <NotePagination previous={previous} next={next} />
      </article>
      {/* Table of contents + in-note search - sticky on large screens, hidden on mobile */}
      <div className="hidden lg:block lg:translate-x-2 lg:pl-3">
        <div className="sticky top-24">
          <NoteSearchById targetId="note-article-content" />
          <TableOfContents headings={note.toc} />
        </div>
      </div>
    </div>
  );
}
