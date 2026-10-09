import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const CONTENT_ROOT = path.resolve(process.cwd(), 'content');
const MIME_TYPES: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

/** Serves only raster images stored inside the content tree. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: assetSegments } = await params;
  const relativePath = assetSegments.join('/');
  const filePath = path.resolve(CONTENT_ROOT, relativePath);
  const extension = path.extname(filePath).toLowerCase();

  if (
    !filePath.startsWith(`${CONTENT_ROOT}${path.sep}`) ||
    !MIME_TYPES[extension]
  ) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const image = await readFile(filePath);
    return new NextResponse(image, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Type': MIME_TYPES[extension],
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
