import { Skeleton } from "@/components/ui/skeleton";
import { RouteProgressBar } from "@/components/docs/route-progress-bar";

export default function NoteLoading() {
  return (
    <>
      <RouteProgressBar />
      <div className="grid gap-10 lg:grid-cols-[1fr_220px]">
        <article>
          <Skeleton className="h-5 w-28 rounded-full mb-3" />
          <Skeleton className="h-9 w-3/4 mb-3" />
          <Skeleton className="h-5 w-full mb-1" />
          <Skeleton className="h-5 w-2/3 mb-6" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-32 w-full rounded-lg mt-4" />
            <Skeleton className="h-4 w-full mt-4" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </article>
        <div className="hidden lg:block space-y-2">
          <Skeleton className="h-3 w-24 mb-3" />
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </>
  );
}
