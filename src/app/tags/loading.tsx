import { Skeleton } from "@/components/ui/skeleton";
import { RouteProgressBar } from "@/components/docs/route-progress-bar";

export default function TagsLoading() {
  return (
    <>
      <RouteProgressBar />
      <Skeleton className="h-8 w-32 mb-3" />
      <Skeleton className="h-4 w-72 mb-8" />
      <div className="flex flex-wrap gap-2 mb-8">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    </>
  );
}
