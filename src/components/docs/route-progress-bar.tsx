/**
 * A thin animated bar pinned under the header, shown while a route segment
 * is loading (rendered automatically by Next.js via loading.tsx files).
 * Purely decorative/motion - the real content swap is handled by Suspense.
 */
export function RouteProgressBar() {
  return (
    <div className="fixed left-0 right-0 top-16 z-50 h-0.5 overflow-hidden bg-transparent">
      <div className="route-progress-bar h-full w-1/3 rounded-full bg-terracotta" />
    </div>
  );
}
