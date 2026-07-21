'use client';
import { useRef } from 'react';
import { CodeCopyButtons } from '@/components/docs/code-copy-buttons';
import { MermaidRenderer } from '@/components/docs/mermaid-renderer';

export function NoteArticle({ contentHtml }: { contentHtml: string }) {
  const articleRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={articleRef}>
        <CodeCopyButtons html={contentHtml} />
      </div>
      <MermaidRenderer containerRef={articleRef} />
    </>
  );
}
