/**
 * lib/markdown.ts
 * ----------------
 * Everything related to reading Markdown files from `/content` and turning
 * them into data our React components can render.
 *
 * This file only runs on the server (it uses Node's `fs` module), which is
 * fine because we only ever call it from Server Components or from
 * `generateStaticParams` / route handlers.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';
import type { Note, NoteSummary, TocHeading } from '@/types/note';

/** Absolute path to the /content directory at the project root. */
const CONTENT_DIR = path.join(process.cwd(), 'content');

/**
 * Returns the list of every `.md` filename (without extension) in /content.
 * The filename becomes the note's URL slug, e.g. `sql-injection.md` -> `/notes/sql-injection`.
 */
function walkMarkdownFiles(dir: string, baseDir = dir): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const slugs: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      slugs.push(...walkMarkdownFiles(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const relative = path.relative(baseDir, fullPath);
      slugs.push(relative.replace(/\\/g, '/').replace(/\.md$/, ''));
    }
  }
  return slugs;
}

export function getAllSlugs(): string[] {
  return walkMarkdownFiles(CONTENT_DIR);
}

/** Reads the raw Markdown + front matter for a single slug, without rendering HTML. */
function readNoteFile(slug: string): { data: Partial<Note>; content: string } {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return { data, content };
}

/** Builds a short plain-text excerpt from raw Markdown (used for cards + search). */
function makeExcerpt(content: string, length = 160): string {
  const plain = content
    .replace(/```[\s\S]*?```/g, ' ') // strip code blocks
    .replace(/`[^`]*`/g, ' ') // strip inline code
    .replace(/[#>*_[\]()!-]/g, ' ') // strip common markdown syntax characters
    .replace(/\s+/g, ' ') // collapse whitespace
    .trim();
  return plain.length > length ? plain.slice(0, length).trimEnd() + '…' : plain;
}

/**
 * Returns lightweight metadata (no rendered HTML) for every note.
 * This is what powers the homepage list, category pages, and the search index -
 * none of those need full HTML rendering, so we keep this fast and cheap.
 */
export function getAllNoteSummaries(): NoteSummary[] {
  return (
    getAllSlugs()
      .map((slug) => {
        const { data, content } = readNoteFile(slug);
        return {
          slug,
          title: data.title ?? slug,
          description: data.description ?? '',
          category: data.category ?? 'Uncategorized',
          tags: data.tags ?? [],
          date: data.date ?? '',
          excerpt: data.description || makeExcerpt(content),
        };
      })
      // Newest first when a date is present; undated notes sink to the bottom.
      .sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
  );
}

/**
 * A small rehype plugin that walks the rendered HTML tree and collects every
 * heading (h2/h3/h4) into a flat list. We attach it as a side-effect during
 * the render pipeline and read the results back out afterwards.
 */
function collectHeadings(headings: TocHeading[]) {
  return () => (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (['h2', 'h3', 'h4'].includes(node.tagName)) {
        const id = (node.properties?.id as string) ?? '';
        const text = extractText(node);
        if (id && text) {
          headings.push({ id, text, level: Number(node.tagName[1]) });
        }
      }
    });
  };
}

/** Recursively pulls plain text out of a hast node (headings can contain nested nodes). */
function extractText(
  node: Element | { type: string; value?: string; children?: unknown[] }
): string {
  if ('value' in node && typeof node.value === 'string') return node.value;
  if ('children' in node && Array.isArray(node.children)) {
    return node.children.map((child) => extractText(child as Element)).join('');
  }
  return '';
}

/**
 * Reads one note by slug, renders its Markdown body to HTML (with syntax
 * highlighting + heading ids + a generated Table of Contents), and returns
 * everything a doc page needs to render. Returns null if the file doesn't exist.
 */
export async function getNoteBySlug(slug: string): Promise<Note | null> {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const { data, content } = readNoteFile(slug);
  const toc: TocHeading[] = [];

  const file = await unified()
    .use(remarkParse) // Markdown text -> mdast (Markdown AST)
    .use(remarkRehype) // mdast -> hast (HTML AST)
    .use(rehypeSlug) // add id="..." to every heading
    .use(rehypePrettyCode, {
      // Shiki-powered syntax highlighting, rendered at build time (no client JS needed)
      theme: 'github-light',
      keepBackground: true,
    })
    .use(rehypeAutolinkHeadings, {
      // wrap headings in a link so users can copy a direct URL to a section
      behavior: 'wrap',
      properties: { className: ['heading-anchor'] },
    })
    .use(collectHeadings(toc)) // side-effect: fill the `toc` array as we walk the tree
    .use(rehypeStringify) // hast -> final HTML string
    .process(content);

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? '',
    category: data.category ?? 'Uncategorized',
    tags: data.tags ?? [],
    date: data.date ?? '',
    excerpt: data.description || makeExcerpt(content),
    contentHtml: String(file),
    toc,
  };
}

/** Returns every unique category, along with how many notes belong to it. */
export function getAllCategories(): { name: string; count: number }[] {
  const notes = getAllNoteSummaries();
  const counts = new Map<string, number>();
  for (const note of notes) {
    const cat = note.category ?? 'Uncategorized';
    counts.set(cat, (counts.get(cat) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Returns every unique tag, along with how many notes use it. */
export function getAllTags(): { name: string; count: number }[] {
  const notes = getAllNoteSummaries();
  const counts = new Map<string, number>();
  for (const note of notes) {
    for (const tag of note.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Returns all notes belonging to a given category (case-insensitive slug match). */
export function getNotesByCategory(category: string): NoteSummary[] {
  return getAllNoteSummaries().filter(
    (note) => slugify(note.category ?? 'Uncategorized') === slugify(category)
  );
}

/** Returns all notes that contain the given tag. */
export function getNotesByTag(tag: string): NoteSummary[] {
  return getAllNoteSummaries().filter((note) =>
    (note.tags ?? []).some((t) => slugify(t) === slugify(tag))
  );
}

/** Turns a label like "Web Pentest" into a URL-safe slug like "web-pentest". */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Given the current slug, finds the previous and next note in the full
 * (date-sorted) list, so doc pages can render "Previous / Next" navigation.
 */
export function getAdjacentNotes(slug: string): {
  previous: NoteSummary | null;
  next: NoteSummary | null;
} {
  const all = getAllNoteSummaries();
  const index = all.findIndex((note) => note.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  };
}
