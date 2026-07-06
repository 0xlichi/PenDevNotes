'use client';

import { useRef, useEffect } from 'react';
import { NoteSearch } from '@/components/docs/note-search';

/** Thin wrapper so <NoteSearch> can target the article by DOM id instead
 * of a shared React ref - avoids needing to lift state between <article>
 * and the sidebar, which are unrelated branches of the component tree. */
export function NoteSearchById({ targetId }: { targetId: string }) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    ref.current = document.getElementById(targetId);
  }, [targetId]);

  return <NoteSearch articleRef={ref} size="lg" />;
}
