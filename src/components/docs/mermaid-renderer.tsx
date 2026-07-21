'use client';

import { useEffect, useRef } from 'react';

/**
 * Finds every ```mermaid fenced code block in the rendered note content
 * and replaces it with an actual rendered SVG diagram, using the mermaid
 * library client-side. rehype-pretty-code has no idea what Mermaid is, so
 * it just renders these blocks as plain highlighted text - this component
 * runs after mount and swaps them out for the real diagram.
 */
export function MermaidRenderer({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const rendered = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || rendered.current) return;

    // rehype-pretty-code wraps mermaid blocks like any other code block:
    // <pre data-language="mermaid"><code>...</code></pre>
    const blocks = container.querySelectorAll('pre[data-language="mermaid"]');
    if (blocks.length === 0) return;

    rendered.current = true;

    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          primaryColor: '#f2d6a2',
          primaryTextColor: '#33291f',
          primaryBorderColor: '#e6b8a2',
          lineColor: '#a6512f',
          secondaryColor: '#c7d3b0',
          tertiaryColor: '#f8f2e7',
          fontFamily: 'var(--font-mono)',
        },
      });

      blocks.forEach(async (pre, i) => {
        const code = pre.querySelector('code')?.textContent ?? '';
        if (!code.trim()) return;

        const id = `mermaid-diagram-${i}-${Date.now()}`;
        try {
          const { svg } = await mermaid.render(id, code);
          const wrapper = document.createElement('div');
          wrapper.className = 'mermaid-diagram';
          wrapper.innerHTML = svg;
          pre.replaceWith(wrapper);
        } catch (err) {
          console.error('Mermaid render failed:', err);
          // Leave the original code block visible as a fallback.
        }
      });
    });
  }, [containerRef]);

  return null;
}
