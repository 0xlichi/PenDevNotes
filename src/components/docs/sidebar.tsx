import Link from "next/link";
import { getAllCategories } from "@/lib/markdown";
import { slugify } from "@/lib/markdown";
import { cn } from "@/lib/utils";
import { Folder } from "lucide-react";

/**
 * Left-hand category rail. This is real navigation grounded in the content's
 * own taxonomy (not decorative) - every note has a category, so this always
 * reflects the actual structure of the notebook.
 */
export function Sidebar({ activeCategory }: { activeCategory?: string }) {
  const categories = getAllCategories();

  return (
    <aside className="text-sm">
      <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-[#a7967d]">
        Categories
      </p>
      <ul className="space-y-1">
        {categories.map((category) => {
          const isActive = activeCategory && slugify(activeCategory) === slugify(category.name);
          return (
            <li key={category.name}>
              <Link
                href={`/categories/${slugify(category.name)}`}
                className={cn(
                  "group flex items-center justify-between gap-2 rounded-lg px-3 py-2",
                  "transition-all duration-150 ease-out",
                  isActive
                    ? "bg-sand/40 font-medium text-sand-ink"
                    : "text-[#6b5940] hover:translate-x-0.5 hover:bg-[#f1e6d3] hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-2">
                  <Folder
                    className={cn(
                      "h-3.5 w-3.5 transition-colors",
                      isActive ? "text-sand-ink" : "text-[#a7967d] group-hover:text-terracotta-ink"
                    )}
                    strokeWidth={2}
                  />
                  {category.name}
                </span>
                <span className="font-mono text-xs text-[#a7967d]">{category.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
