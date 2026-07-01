import { Skeleton } from "@/components/ui/skeleton";
import { RouteProgressBar } from "@/components/docs/route-progress-bar";

/**
 * Shown automatically by Next.js while page.tsx's data (reading /content
 * from disk) is being prepared. On a static/prebuilt site this appears only
 * for a flash, but it keeps navigation feeling responsive during dev/ISR.
 */
export default function HomeLoading() {
  return (
    <>
      <RouteProgressBar />
      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <div className="hidden lg:block space-y-2">
          <Skeleton className="h-3 w-20 mb-3" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </div>
        <div>
          <Skeleton className="h-8 w-72 mb-3" />
          <Skeleton className="h-4 w-96 mb-8" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-surface p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-1.5 pt-1">
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
