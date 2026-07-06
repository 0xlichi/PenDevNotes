'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * In-note search: highlights matches inside the article content and lets
 * the user step between them. Scoped to this note only - separate from
 * the global site-wide search.
 */
export function NoteSearch({
  articleRef,
  size = 'sm',
}: {
  articleRef: React.RefObject<HTMLElement | null>;
  size?: 'sm' | 'lg';
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [activeMatch, setActiveMatch] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const marksRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    clearHighlights(article);
    marksRef.current = [];

    if (!query.trim()) {
      setMatchCount(0);
      setActiveMatch(0);
      return;
    }

    const marks = highlightMatches(article, query);
    marksRef.current = marks;
    setMatchCount(marks.length);
    setActiveMatch(0);
  }, [query, articleRef]);

  useEffect(() => {
    marksRef.current.forEach((mark, i) => {
      mark.classList.toggle('note-search-active', i === activeMatch);
    });
    const current = marksRef.current[activeMatch];
    if (current) {
      current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeMatch]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      const article = articleRef.current;
      if (article) clearHighlights(article);
      setQuery('');
    }
  }, [open, articleRef]);

  function goToMatch(direction: 1 | -1) {
    if (matchCount === 0) return;
    setActiveMatch((prev) => (prev + direction + matchCount) % matchCount);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') setOpen(false);
    if (event.key === 'Enter') goToMatch(event.shiftKey ? -1 : 1);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={
          size === 'lg'
            ? 'mb-4 flex w-full items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-[#7a6b56] transition-colors hover:border-terracotta hover:text-terracotta-ink'
            : 'flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1 text-xs text-[#7a6b56] transition-colors hover:border-terracotta hover:text-terracotta-ink'
        }
      >
        <Search className={size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
        Search this note
      </button>
    );
  }

  return (
    <div
      className={cn(
        size === 'lg'
          ? 'mb-4 flex items-center gap-1 rounded-lg border bg-surface px-2 py-2'
          : 'flex items-center gap-1 rounded-md border bg-surface px-2 py-1.5',
        query && matchCount === 0 ? 'border-terracotta' : 'border-border'
      )}
    >
      <Search className="h-3.5 w-3.5 shrink-0 text-[#a7967d]" />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Find in note..."
        className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-[#a7967d]"
      />

      {query && (
        <span
          className={
            matchCount > 0
              ? 'shrink-0 whitespace-nowrap font-mono text-[10px] text-[#a7967d]'
              : 'shrink-0 whitespace-nowrap font-mono text-[10px] font-medium text-terracotta-ink'
          }
        >
          {matchCount > 0 ? `${activeMatch + 1}/${matchCount}` : 'Not found'}
        </span>
      )}

      <button
        onClick={() => goToMatch(-1)}
        className="shrink-0 rounded p-0.5 text-[#7a6b56] hover:bg-[#f1e6d3] hover:text-foreground"
        aria-label="Previous match"
      >
        <ChevronUp className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => goToMatch(1)}
        className="shrink-0 rounded p-0.5 text-[#7a6b56] hover:bg-[#f1e6d3] hover:text-foreground"
        aria-label="Next match"
      >
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => setOpen(false)}
        className="shrink-0 rounded p-0.5 text-[#7a6b56] hover:bg-[#f1e6d3] hover:text-foreground"
        aria-label="Close search"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function clearHighlights(root: HTMLElement) {
  root.querySelectorAll('mark.note-search-mark').forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    parent.replaceChild(document.createTextNode(mark.textContent ?? ''), mark);
    parent.normalize();
  });
}

function highlightMatches(root: HTMLElement, query: string): HTMLElement[] {
  const marks: HTMLElement[] = [];
  const lowerQuery = query.toLowerCase();

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const parentTag = node.parentElement?.tagName;
      if (parentTag === 'SCRIPT' || parentTag === 'STYLE') return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes: Text[] = [];
  let current: Node | null;
  while ((current = walker.nextNode())) {
    textNodes.push(current as Text);
  }

  for (const textNode of textNodes) {
    const text = textNode.textContent ?? '';
    const lowerText = text.toLowerCase();
    if (!lowerText.includes(lowerQuery)) continue;

    const fragment = document.createDocumentFragment();
    let cursor = 0;
    let index = lowerText.indexOf(lowerQuery, cursor);

    while (index !== -1) {
      if (index > cursor) {
        fragment.appendChild(document.createTextNode(text.slice(cursor, index)));
      }
      const mark = document.createElement('mark');
      mark.className = 'note-search-mark';
      mark.textContent = text.slice(index, index + query.length);
      fragment.appendChild(mark);
      marks.push(mark);

      cursor = index + query.length;
      index = lowerText.indexOf(lowerQuery, cursor);
    }
    if (cursor < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(cursor)));
    }

    textNode.parentNode?.replaceChild(fragment, textNode);
  }

  return marks;
}
