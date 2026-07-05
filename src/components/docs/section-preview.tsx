'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface SectionPreviewProps {
  headingId: string | null;
  onClose: () => void;
  onMouseEnter?: () => void;
}

function extractSectionHtml(headingId: string): string | null {
  const heading = document.getElementById(headingId);
  if (!heading) return null;
  const headingLevel = Number(heading.tagName[1]);
  const parts: string[] = [heading.outerHTML];
  let node = heading.nextElementSibling;
  while (node) {
    const tagMatch = node.tagName.match(/^H([1-6])$/);
    if (tagMatch && Number(tagMatch[1]) <= headingLevel) break;
    parts.push(node.outerHTML);
    node = node.nextElementSibling;
  }
  return parts.join('\n');
}

export function SectionPreview({ headingId, onClose, onMouseEnter }: SectionPreviewProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

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

  // Wire up copy buttons for code blocks inside this preview - the cloned
  // HTML brings the button markup along, but not its click listener, so
  // we need to re-attach it here, same as CodeCopyButtons does on the
  // real note page.
  useEffect(() => {
    const container = contentRef.current;
    if (!container || !html) return;

    const blocks = container.querySelectorAll('pre');
    blocks.forEach((pre) => {
      const button = pre.querySelector('.copy-btn') as HTMLButtonElement | null;
      if (!button || button.dataset.wired) return;

      button.dataset.wired = 'true';
      button.addEventListener('click', () => {
        const code = pre.querySelector('code')?.innerText ?? '';
        navigator.clipboard.writeText(code).then(() => {
          button.textContent = 'Copied!';
          setTimeout(() => (button.textContent = 'Copy'), 1500);
        });
      });
    });
  }, [html]);

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
            ref={contentRef}
            className="prose-doc preview-content px-8 py-6"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
