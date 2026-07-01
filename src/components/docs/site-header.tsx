import Link from 'next/link';
import { TerminalSquare } from 'lucide-react';
import { SearchTrigger } from '@/components/docs/search-dialog';

/**
 * Sticky top header shown on every page.
 * Keeps navigation minimal on purpose: logo/home link + search.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2 font-semibold text-foreground">
          <TerminalSquare
            className="h-5 w-5 text-terracotta-ink transition-transform duration-300 ease-out group-hover:rotate-6 group-hover:scale-110"
            strokeWidth={2}
          />
          <span className="tracking-tight">Notebook</span>
          <span className="hidden font-mono text-xs font-normal text-[#a7967d] sm:inline">
            /PenTest&Development
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-6 text-sm font-medium text-[#6b5940] sm:flex">
            <NavLink href="/categories">Categories</NavLink>
            <NavLink href="/tags">Tags</NavLink>
          </nav>
          <SearchTrigger />
        </div>
      </div>
    </header>
  );
}

/** Nav link with an animated underline that grows from the center on hover. */
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group relative py-1 transition-colors hover:text-foreground">
      {children}
      <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-terracotta-ink transition-transform duration-200 ease-out group-hover:scale-x-100" />
    </Link>
  );
}
