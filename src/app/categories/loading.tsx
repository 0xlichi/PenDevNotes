import { Skeleton } from "@/components/ui/skeleton";
import { RouteProgressBar } from "@/components/docs/route-progress-bar";

export default function CategoriesLoading() {
  return (
    <>
      <RouteProgressBar />
      <Skeleton className="h-8 w-48 mb-3" />
      <Skeleton className="h-4 w-96 mb-8" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </>
  );
}
