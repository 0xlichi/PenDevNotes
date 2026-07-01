import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A simple, composable card primitive (standard shadcn/ui pattern).
 * Pass `interactive` for cards that act like links/buttons - it adds a
 * consistent hover-lift + border-tint micro-interaction used across the site.
 */
function Card({
  className,
  interactive,
  ...props
}: React.ComponentProps<"div"> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface text-foreground shadow-sm",
        "transition-all duration-200 ease-out",
        interactive &&
          "hover:-translate-y-1 hover:border-terracotta hover:shadow-[0_8px_24px_-8px_rgba(230,184,162,0.55)]",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 p-5", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("font-semibold leading-snug tracking-tight text-foreground", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-[#7a6b56]", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex items-center p-5 pt-0", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
