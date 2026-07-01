import { cn } from "@/lib/utils";

/**
 * A shimmering placeholder block, used while content is loading
 * (e.g. the search dialog's index fetch, or route-level Suspense fallbacks).
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("skeleton rounded-md", className)} {...props} />;
}

export { Skeleton };
