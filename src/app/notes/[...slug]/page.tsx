import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllSlugs, getNoteBySlug, getAdjacentNotes, slugify } from '@/lib/markdown';
import { Badge } from '@/components/ui/badge';
import { TableOfContents } from '@/components/docs/table-of-contents';
import { NotePagination } from '@/components/docs/note-pagination';
import { CodeCopyButtons } from '@/components/docs/code-copy-buttons';

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
    <div className="grid gap-10 lg:grid-cols-[1fr_220px]">
      <article className="animate-fade-in-up">
        {/* Breadcrumb-ish header */}
        <div className="mb-6">
          <Link
            href={`/categories/${slugify(note.category ?? 'Uncategorized')}`}
            className="inline-flex transition-transform duration-150 hover:-translate-y-0.5"
          >
            <Badge variant="category">{note.category}</Badge>
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {note.title}
          </h1>
          {note.description && <p className="mt-2 text-lg text-[#7a6b56]">{note.description}</p>}
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
            with a permanent copy button injected into every code block */}
        <CodeCopyButtons html={note.contentHtml} />
        <NotePagination previous={previous} next={next} />
      </article>
      {/* Table of contents - sticky on large screens, hidden on mobile */}
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <TableOfContents headings={note.toc} />
        </div>
      </div>
    </div>
  );
}
