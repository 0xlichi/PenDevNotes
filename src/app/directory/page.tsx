import { getAllNoteSummaries } from '@/lib/markdown';
import { NotesBrowser } from '@/components/docs/notes-browser';

export const metadata = { title: 'Notes Directory' };

export default function DirectoryPage() {
  const notes = getAllNoteSummaries();

  return (
    <div>
      <div className="animate-fade-in-up">
        <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-terracotta-ink">
          Browse the notebook
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">Notes Directory</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#7a6b56]">
          Explore your notes as a file manager. Click a folder to expand it, or double-click a note
          to open it.
        </p>
      </div>

      <div className="mt-10">
        <NotesBrowser notes={notes} initialView="directory" />
      </div>
    </div>
  );
}
