"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocHeading } from "@/types/note";

/**
 * Sticky "On this page" navigation. Highlights the heading currently in view
 * using IntersectionObserver (a lightweight scroll-spy - no scroll event
 * listeners needed).
 */
export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost heading that's currently intersecting the viewport.
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -70% 0px" } // trigger a bit below the sticky header
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="animate-fade-in text-sm">
      <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#a7967d]">
        On this page
      </p>
      <ul className="space-y-2 border-l border-border">
        {headings.map((heading) => (
          <li key={heading.id} style={{ paddingLeft: (heading.level - 2) * 12 + 12 }}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "-ml-px block border-l-2 pl-3 py-0.5 transition-all duration-200 ease-out hover:translate-x-0.5 hover:text-foreground",
                activeId === heading.id
                  ? "border-terracotta font-medium text-terracotta-ink"
                  : "border-transparent text-[#a7967d]"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
