import { NextResponse } from "next/server";
import { buildSearchIndex } from "@/lib/search-index";

/**
 * GET /search-index.json
 *
 * Serves the full search index as JSON. The client-side search dialog fetches
 * this once (and caches it in memory) so search stays instant after the first
 * keystroke - no server round-trip per query.
 */
export async function GET() {
  return NextResponse.json(buildSearchIndex());
}
