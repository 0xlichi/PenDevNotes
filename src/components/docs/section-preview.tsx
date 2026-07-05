'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface SectionPreviewProps {
  /** The id of the heading whose section should be shown, or null to stay closed. */
  headingId: string | null;
  onClose: () => void;
  onMouseEnter?: () => void;
}

/**
 * Finds the heading element by id in the live article DOM, then walks
 * forward collecting every sibling until the next heading of equal or
 * higher rank. Returns the combined innerHTML - i.e. exactly what's
 * already rendered on the page for that section, formatting included.
 */
function extractSectionHtml(headingId: string): string | null {
  const heading = document.getElementById(headingId);
  if (!heading) return null;
  const headingLevel = Number(heading.tagName[1]); // h2 -> 2, h3 -> 3, etc.
  const parts: string[] = [heading.outerHTML];
  let node = heading.nextElementSibling;
  while (node) {
    const tagMatch = node.tagName.match(/^H([1-6])$/);
    if (tagMatch && Number(tagMatch[1]) <= headingLevel) break; // stop at the next same/higher-level heading
    parts.push(node.outerHTML);
    node = node.nextElementSibling;
  }
  return parts.join('\n');
}

/**
 * A large centered overlay that previews a single section's real,
 * already-rendered content - so formatting, code blocks, and links
 * all look exactly like they do on the page itself.
 *
 * Rendered via a portal so it sits above everything else regardless of
 * where <TableOfContents> lives in the layout. Hovering the modal itself
 * (onMouseEnter) cancels the pending close timer started by the ToC link,
 * so moving toward the modal doesn't close it prematurely.
 */
export function SectionPreview({ headingId, onClose, onMouseEnter }: SectionPreviewProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!headingId) {
      setHtml(null);
      return;
    }
    setHtml(extractSectionHtml(headingId));
  }, [headingId]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!mounted || !headingId || !html) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#33291f]/40 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onClose}
        className="animate-scale-in relative flex h-[84vh] w-[74vw] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3">
          <span className="font-mono text-xs uppercase tracking-wider text-[#a7967d]">
            Section preview
          </span>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[#7a6b56] transition-colors hover:bg-[#f1e6d3] hover:text-foreground"
            aria-label="Close preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="preview-scroll flex-1 overflow-y-auto">
          <div
            className="prose-doc preview-content px-8 py-6"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
