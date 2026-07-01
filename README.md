# Notebook — Markdown Documentation Site

A modern, searchable documentation site built with **Next.js 15 (App Router)**,
**TypeScript**, **Tailwind CSS v4**, and hand-built **shadcn/ui-style**
components. It reads plain Markdown files from a local `/content` folder and
turns them into a browsable, searchable knowledge base — no database or CMS
required.

## Features

- 📄 Reads `.md` files straight from `/content` — just drop a file in and it appears
- 🏷️ Front matter support: `title`, `description`, `category`, `tags`, `date`
- 🗂️ Automatic category pages (`/categories/:category`)
- 🔎 Fast client-side fuzzy search (title, content, tags, category) via Fuse.js — press <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd>
- 🌈 Syntax-highlighted code blocks (Shiki, via `rehype-pretty-code`) — highlighted at build time, no client-side JS needed for it
- 🧭 Auto-generated Table of Contents with scroll-spy highlighting
- ⏮️⏭️ Previous / Next note navigation
- 🏷️ Tag browsing with click-to-filter
- 📱 Fully responsive, light-only theme with a soft off-white background
- 🎨 Warm terracotta / sand / sage / cream color palette throughout
- ✨ Micro-interactions on nearly every interactive element (hover lifts, tap-scale, animated underlines, sliding arrows)
- ⏳ Real loading states: route-level skeletons (`loading.tsx`) that match each page's layout, plus a shimmering skeleton and progress bar in the search dialog while its index fetches

## Color Palette

| Swatch | Hex | Role |
| --- | --- | --- |
| 🟧 | `#E6B8A2` (terracotta) | Primary accent — links, buttons, active states |
| 🟨 | `#F2D6A2` (sand) | Category pills |
| 🟩 | `#C7D3B0` (sage) | Secondary accent — code-line highlights, blockquotes |
| ⬜ | `#F8F2E7` (cream) | Page background |

All four colors (plus derived "-ink"/"-deep" shades for accessible text/hover
contrast) are defined once as CSS variables at the top of
`src/app/globals.css`, then exposed to Tailwind via `@theme inline` so they're
usable as ordinary utility classes (`bg-terracotta`, `text-sage-ink`, etc.).

## Micro-interactions & Motion

A small, consistent vocabulary of animations lives in `globals.css` (keyframes
+ utility classes: `.animate-fade-in-up`, `.animate-scale-in`, `.stagger-item`,
`.skeleton`, `.spinner`, `.route-progress-bar`) and is reused across
components rather than one-off animations per file:

- **Card grids** (homepage, categories, tags, search results) fade/slide in
  with a staggered delay per item via the `stagger-item` class and a
  `--stagger-index` CSS variable.
- **Hover states**: cards lift and gain a soft terracotta-tinted shadow;
  arrows nudge in the direction of travel; nav links get an animated
  underline that grows from the center.
- **Tap/click feedback**: buttons and badges scale down slightly on
  `:active` for tactile feedback.
- **Search dialog**: scales in on open, shows shimmering skeleton rows while
  the search index is fetching, supports arrow-key navigation with a visible
  active-row indicator, and fades in a "no results" message.
- **Route loading**: every route has a matching `loading.tsx` with a skeleton
  that mirrors its real layout, plus a thin animated progress bar under the
  header — both respect `prefers-reduced-motion`.
- **Tag filtering**: uses React's `useTransition` so the clicked tag responds
  instantly while the grid below cross-fades to its new contents.

## Tech Stack

| Purpose              | Library                                  |
| --------------------- | ----------------------------------------- |
| Framework              | Next.js 15 (App Router, Server Components) |
| Language               | TypeScript                                 |
| Styling                | Tailwind CSS v4                            |
| UI primitives          | Hand-built shadcn/ui-style components      |
| Front matter parsing   | `gray-matter`                              |
| Markdown → HTML        | `remark` + `rehype` (unified pipeline)     |
| Syntax highlighting    | `rehype-pretty-code` (Shiki under the hood)|
| Search                 | `fuse.js`                                  |
| Icons                  | `lucide-react`                             |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3. Build for production

```bash
npm run build
npm run start
```

## Where to put your Markdown notes

Add `.md` files directly to the **`/content`** folder at the project root.
The filename becomes the URL slug automatically:

```
content/sql-injection-basics.md   →   /notes/sql-injection-basics
```

Each file needs a front matter block at the top:

```markdown
---
title: "SQL Injection Basics"
description: "Core concepts of SQL injection, from detection to extraction."
category: "Web Pentest"
tags: ["sql-injection", "web", "burp-suite"]
date: "2026-01-15"
---

## Your content starts here

Regular Markdown, including fenced code blocks:

\`\`\`bash
sqlmap -u "https://target.com/product?id=1" --batch --dbs
\`\`\`
```

Front matter fields:

| Field         | Required | Notes                                                       |
| ------------- | -------- | ------------------------------------------------------------ |
| `title`       | No       | Falls back to the filename if omitted                        |
| `description` | No       | Used for card previews, page meta, and search                |
| `category`    | No       | Defaults to "Uncategorized"; powers `/categories/*` pages    |
| `tags`        | No       | Array of strings; powers the `/tags` page and tag badges     |
| `date`        | No       | ISO format (`YYYY-MM-DD`); notes without a date sort last    |

No build step or registration is needed — the homepage, category pages, and
search index are all generated automatically from whatever is in `/content`.

## Example notes included

Five example notes ship in `/content` to demonstrate every feature:

- **`sql-injection-basics.md`** — SQL, bash, and text code blocks, a blockquote, an internal link
- **`portswigger-sqli-labs.md`** — a second note in the same category, for testing category grouping
- **`nmap-cheatsheet.md`** — a different category ("Recon"), bash code blocks
- **`http-request-smuggling.md`** — HTTP-format code blocks, shared tags with the SQLi notes (try filtering by `#web` or `#burp-suite`)
- **`go-cli-tools-with-cobra.md`** — a third category ("Go Programming"), Go code blocks, directory-tree code block

Try:
- Visiting `/` to see all five listed and sorted by date
- Visiting `/categories` to see three auto-generated categories
- Visiting `/tags` and clicking `#sql-injection` to filter to two notes
- Pressing `⌘K` / `Ctrl+K` and searching "smuggling" or "cobra"

## Project Structure

```
docs-site/
├── content/                       # ← Your Markdown notes go here
│   ├── sql-injection-basics.md
│   └── ...
├── src/
│   ├── app/
│   │   ├── page.tsx                # Homepage (lists all notes)
│   │   ├── layout.tsx               # Root layout, header, fonts
│   │   ├── globals.css              # Design tokens + Markdown "prose" styling
│   │   ├── notes/[slug]/page.tsx    # Individual note page
│   │   ├── categories/page.tsx      # Categories index
│   │   ├── categories/[category]/  # Notes within one category
│   │   ├── tags/page.tsx            # Tag browser (client-filtered)
│   │   └── search-index.json/      # API route serving the search index
│   ├── components/
│   │   ├── ui/                      # shadcn/ui-style primitives (Button, Card, Badge, Input)
│   │   └── docs/                    # App-specific components (SearchDialog, Sidebar, TOC, NoteCard...)
│   ├── lib/
│   │   ├── markdown.ts              # Reads /content, parses front matter, renders HTML
│   │   ├── search-index.ts          # Builds the search index
│   │   └── utils.ts                 # `cn()` className helper
│   └── types/
│       └── note.ts                  # Shared TypeScript types
└── package.json
```

## How it works (short version)

1. **Reading**: `src/lib/markdown.ts` uses `gray-matter` to split each `.md`
   file into front matter (metadata) and body content.
2. **Rendering**: The Markdown body is run through a `unified` pipeline
   (`remark-parse` → `remark-rehype` → `rehype-pretty-code` for syntax
   highlighting → `rehype-slug` for heading ids → `rehype-stringify`) to
   produce final HTML, entirely on the server at build time.
3. **Table of Contents**: while walking the rendered HTML tree, a small
   custom plugin collects every `h2`/`h3`/`h4` into a flat list, which becomes
   the sticky "On this page" navigation.
4. **Search**: `src/app/search-index.json/route.ts` exposes a JSON summary of
   every note. The client fetches it once and hands it to `Fuse.js` for
   fuzzy, instant search — no server round-trip per keystroke.
5. **Pages**: Category and note pages use `generateStaticParams` so the whole
   site is statically generated at build time — fast, and deployable anywhere
   that serves static + minimal server functions (e.g. Vercel).

## Notes on customization

- **Colors / theme**: all design tokens live at the top of `src/app/globals.css`.
- **Code block theme**: change `theme: "github-light"` in `src/lib/markdown.ts` to any [Shiki theme name](https://shiki.style/themes).
- **Adding more front matter fields**: extend `NoteFrontMatter` in `src/types/note.ts`, then read the field in `src/lib/markdown.ts`.
