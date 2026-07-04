'use client';

import { useEffect, useRef } from 'react';

/**
 * Wraps rendered Markdown HTML and injects a permanent "Copy" button into
 * every code block (<pre>) after mount, since the content itself is static
 * server-rendered HTML from rehype-pretty-code.
 */
export function CodeCopyButtons({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const blocks = container.querySelectorAll('pre');

    blocks.forEach((pre) => {
      if (pre.querySelector('.copy-btn')) return; // avoid duplicates on re-render

      pre.style.position = 'relative';

      const button = document.createElement('button');
      button.className =
        'copy-btn absolute top-2 right-2 rounded-md border border-border bg-surface px-2 py-1 text-xs text-[#1f372d] shadow-sm transition-colors hover:border-terracotta hover:text-terracotta-ink';
      button.textContent = '';
      button.type = 'button';

      button.addEventListener('click', () => {
        const code = pre.querySelector('code')?.innerText ?? '';
        navigator.clipboard.writeText(code).then(() => {
          button.textContent = 'Copied!';
          setTimeout(() => (button.textContent = ''), 1500);
        });
      });

      pre.appendChild(button);
    });
  }, [html]);

  return (
    <div ref={containerRef} className="prose-doc" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
