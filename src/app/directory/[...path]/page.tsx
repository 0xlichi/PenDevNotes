import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllNoteSummaries } from '@/lib/markdown';
import { NotesBrowser } from '@/components/docs/notes-browser';

interface PageProps {
  params: Promise<{ path: string[] }>;
}

function getDirectoryPaths() {
  const paths = new Set<string>();
  for (const note of getAllNoteSummaries()) {
    const segments = note.slug.split('/');
    segments.pop();
    for (let index = 1; index <= segments.length; index += 1) {
      paths.add(segments.slice(0, index).join('/'));
    }
  }
  return [...paths].map((path) => ({ path: path.split('/') }));
}

export function generateStaticParams() {
  return getDirectoryPaths();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { path } = await params;
  return { title: `${path.at(-1) ?? 'Directory'} Directory` };
}

export default async function DirectoryFolderPage({ params }: PageProps) {
  const { path } = await params;
  const basePath = path.join('/');
  const allNotes = getAllNoteSummaries();
  const notes = allNotes.filter(
    (note) => note.slug.startsWith(`${basePath}/`) || note.slug === basePath,
  );

  if (notes.length === 0) notFound();

  return (
    <div>
      <div className="animate-fade-in-up">
        <Link
          href="/directory"
          className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-ink hover:underline"
        >
          Notes Directory
        </Link>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">{path.at(-1)}</h1>
        <p className="mt-3 text-base leading-7 text-[#7a6b56]">
          {notes.length} note{notes.length !== 1 ? 's' : ''} in this folder. Click another folder to
          open it.
        </p>
      </div>

      <div className="mt-10">
        <NotesBrowser notes={notes} initialView="directory" basePath={basePath} />
      </div>
    </div>
  );
}
