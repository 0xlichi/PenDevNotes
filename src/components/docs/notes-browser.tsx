'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  FileText,
  Folder,
  LayoutGrid,
  ListTree,
  Search,
  X,
} from 'lucide-react';
import { LoadMoreNotes } from '@/components/docs/load-more-notes';
import type { NoteSummary } from '@/types/note';

type ViewMode = 'grid' | 'directory';

interface FolderNode {
  name: string;
  path: string;
  folders: FolderNode[];
  notes: NoteSummary[];
}

function createFolder(name: string, path: string): FolderNode {
  return { name, path, folders: [], notes: [] };
}

function buildDirectory(notes: NoteSummary[], basePath = ''): FolderNode {
  const root = createFolder('Notes', basePath);

  for (const note of notes) {
    const relativeSlug = basePath && note.slug.startsWith(`${basePath}/`)
      ? note.slug.slice(basePath.length + 1)
      : note.slug;
    const parts = relativeSlug.split('/');
    const fileName = parts.pop() ?? note.slug;
    let current = root;

    for (const part of parts) {
      const folderPath = current.path ? `${current.path}/${part}` : part;
      let folder = current.folders.find((item) => item.name === part);
      if (!folder) {
        folder = createFolder(part, folderPath);
        current.folders.push(folder);
      }
      current = folder;
    }

    current.notes.push({ ...note, slug: note.slug, title: note.title || fileName });
  }

  function sortFolder(folder: FolderNode) {
    folder.folders.sort((a, b) => a.name.localeCompare(b.name));
    folder.notes.sort((a, b) => a.title.localeCompare(b.title));
    folder.folders.forEach(sortFolder);
  }
  sortFolder(root);
  return root;
}

function matches(note: NoteSummary, query: string) {
  const haystack = [note.title, note.slug, note.category, ...(note.tags ?? [])]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

function DirectoryContents({
  folder,
  onOpenFolder,
  onOpenNote,
}: {
  folder: FolderNode;
  onOpenFolder: (path: string) => void;
  onOpenNote: (slug: string) => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {folder.folders.map((child) => {
          return (
            <button
              key={child.path}
              type="button"
              onClick={() => onOpenFolder(child.path)}
              aria-label={`Open ${child.name} folder`}
              className="group flex min-w-0 w-full flex-col items-center rounded-xl px-2 py-3 text-center transition-colors hover:bg-[#f1e6d3]"
            >
              <span className="relative mb-2 block">
                <Folder className="h-14 w-14 stroke-[1.5] text-blue-400 transition-transform group-hover:scale-105" />
                <ChevronRight
                  className="absolute -right-2 bottom-0 h-4 w-4 rounded-full bg-surface p-0.5 text-[#a7967d]"
                />
              </span>
              <span className="max-w-full break-words text-sm font-medium leading-tight text-foreground">
                {child.name}
              </span>
              <span className="mt-1 font-mono text-[10px] text-[#a7967d]">
                {countItems(child)} {countItems(child) === 1 ? 'item' : 'items'}
              </span>
            </button>
          );
        })}

        {folder.notes.map((note) => (
          <button
            key={note.slug}
            type="button"
            onClick={() => onOpenNote(note.slug)}
            aria-label={`Open ${note.title}`}
            className="group flex min-w-0 w-full flex-col items-center rounded-xl px-2 py-3 text-center transition-colors hover:bg-[#f1e6d3]"
          >
            <FileText className="mb-2 h-14 w-14 stroke-[1.5] text-[#a7967d] group-hover:text-terracotta-ink" />
            <span className="min-w-0 max-w-full">
              <span className="block truncate text-sm text-foreground group-hover:text-terracotta-ink">
                {note.slug.split('/').pop()}.md
              </span>
              <span className="mt-1 block truncate text-[10px] text-[#a7967d]">{note.title}</span>
            </span>
          </button>
        ))}
      </div>

    </div>
  );
}

function countItems(folder: FolderNode): number {
  return folder.notes.length + folder.folders.reduce((total, child) => total + countItems(child), 0);
}

export function NotesBrowser({
  notes,
  initialView = 'grid',
  basePath = '',
}: {
  notes: NoteSummary[];
  initialView?: ViewMode;
  basePath?: string;
}) {
  const router = useRouter();
  const [view, setView] = useState<ViewMode>(initialView);
  const [query, setQuery] = useState('');

  function changeView(nextView: ViewMode) {
    setView(nextView);
    router.push(nextView === 'directory' ? '/directory' : '/');
  }

  const filteredNotes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized ? notes.filter((note) => matches(note, normalized)) : notes;
  }, [notes, query]);
  const directory = useMemo(() => buildDirectory(filteredNotes, basePath), [filteredNotes, basePath]);

  function openNote(slug: string) {
    router.push(`/${slug}`);
  }

  function openFolder(path: string) {
    router.push(`/directory/${path}`);
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-border/80 bg-surface/70 p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {view === 'directory' ? (
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-[#7a6b56] focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/20">
            <Search className="h-4 w-4 shrink-0 text-[#a7967d]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter files and folders..."
              className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-[#a7967d]"
              aria-label="Filter files and folders"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear file filter">
                <X className="h-4 w-4 text-[#a7967d] hover:text-foreground" />
              </button>
            )}
          </label>
        ) : (
          <span className="px-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#a7967d]">
            Browse view
          </span>
        )}

        <div className="flex shrink-0 items-center gap-1 rounded-xl border border-border bg-background p-1" role="group" aria-label="Notes view">
          <button
            type="button"
            onClick={() => changeView('grid')}
            aria-pressed={view === 'grid'}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${view === 'grid' ? 'bg-terracotta text-[#33291f] shadow-sm' : 'text-[#7a6b56] hover:bg-[#f1e6d3]'}`}
          >
            <LayoutGrid className="h-4 w-4" />
            Cards
          </button>
          <button
            type="button"
            onClick={() => changeView('directory')}
            aria-pressed={view === 'directory'}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${view === 'directory' ? 'bg-terracotta text-[#33291f] shadow-sm' : 'text-[#7a6b56] hover:bg-[#f1e6d3]'}`}
          >
            <ListTree className="h-4 w-4" />
            Directory
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        <LoadMoreNotes notes={notes} />
      ) : filteredNotes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-sm text-[#7a6b56]">
          No files match “{query}”.
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-3 shadow-sm sm:p-5">
          <DirectoryContents
            folder={directory}
            onOpenFolder={openFolder}
            onOpenNote={openNote}
          />
        </div>
      )}
    </div>
  );
}
