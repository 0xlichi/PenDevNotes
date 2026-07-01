/**
 * lib/search-index.ts
 * --------------------
 * Defines the shape of the search index and builds it from note summaries.
 *
 * The index is generated at build time (see src/app/search-index.json/route.ts)
 * and fetched once by the client-side <SearchDialog>, which feeds it into
 * Fuse.js for fast fuzzy search across title, content, tags, and category.
 */

import { getAllNoteSummaries } from "@/lib/markdown";

export interface SearchIndexItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  excerpt: string;
}

/** Builds the full search index from every note's metadata + excerpt. */
export function buildSearchIndex(): SearchIndexItem[] {
  return getAllNoteSummaries().map((note) => ({
    slug: note.slug,
    title: note.title,
    description: note.description ?? "",
    category: note.category ?? "Uncategorized",
    tags: note.tags ?? [],
    excerpt: note.excerpt,
  }));
}
