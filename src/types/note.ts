/**
 * Shared TypeScript types used across the app.
 *
 * Keeping these in one place means every file that reads or displays
 * a note agrees on the exact same shape of data.
 */

/** A single heading extracted from a note, used to build the Table of Contents. */
export interface TocHeading {
  /** The URL-safe id (matches the `id` attribute on the rendered <h2>/<h3>/etc.) */
  id: string;
  /** The visible heading text */
  text: string;
  /** Heading level: 2 for "##", 3 for "###" (we skip h1 since that's the page title) */
  level: number;
}

/**
 * Front matter fields we support in every Markdown file.
 * All fields are optional except `title` - if something is missing we fall
 * back to a sensible default (see lib/markdown.ts).
 */
export interface NoteFrontMatter {
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  date?: string;
}

/** Lightweight summary of a note - used for lists, search, and navigation. */
export interface NoteSummary extends NoteFrontMatter {
  /** The URL slug, derived from the filename (e.g. "sql-injection-basics") */
  slug: string;
  /** Plain-text excerpt used for search + card previews */
  excerpt: string;
}

/** A full note, including rendered HTML and table of contents. */
export interface Note extends NoteSummary {
  /** Rendered HTML (already syntax-highlighted) safe to inject into the page */
  contentHtml: string;
  toc: TocHeading[];
}
