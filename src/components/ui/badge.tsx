import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Badge - used for tags and category pills throughout the site.
 * `variant="outline"` is the default look (quiet, sits well on cards).
 * `variant="accent"` is the active/selected state (e.g. selected tag filter).
 * `variant="category"` is the warm sand color reserved for category pills.
 */
const badgeVariants = cva(
  [
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
    "transition-all duration-150 ease-out",
  ].join(" "),
  {
    variants: {
      variant: {
        outline:
          "border-border bg-[#f1e6d3]/60 text-[#6b5940] hover:border-terracotta hover:bg-[#f1e6d3] hover:text-terracotta-ink",
        accent: "border-terracotta bg-terracotta text-[#33291f] shadow-sm",
        category: "border-sand bg-sand/50 text-sand-ink",
        sage: "border-sage bg-sage/40 text-sage-ink",
      },
    },
    defaultVariants: { variant: "outline" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
