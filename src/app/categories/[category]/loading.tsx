import { Skeleton } from "@/components/ui/skeleton";
import { RouteProgressBar } from "@/components/docs/route-progress-bar";

export default function CategoryDetailLoading() {
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
          <Skeleton className="h-8 w-56 mb-3" />
          <Skeleton className="h-4 w-64 mb-8" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
