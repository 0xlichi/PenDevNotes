'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const ROLES = ['Pentesters', 'Programmers', 'Researchers', 'Developers', 'Hackers', 'Learners'];
const DISPLAY_MS = 2400;
const TRANSITION_MS = 500;

export function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      const swapTimeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % ROLES.length);
        setVisible(true);
      }, TRANSITION_MS);
      return () => clearTimeout(swapTimeout);
    }, DISPLAY_MS + TRANSITION_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={cn(
        'inline-block text-terracotta-ink transition-all ease-[cubic-bezier(0.22,1,0.36,1)]',
        visible
          ? 'translate-y-0 scale-100 opacity-100 blur-none'
          : 'translate-y-3 scale-[0.97] opacity-0 blur-[3px]'
      )}
      style={{ transitionDuration: `${TRANSITION_MS}ms` }}
    >
      {ROLES[index]}
    </span>
  );
}
