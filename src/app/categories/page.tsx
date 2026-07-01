import Link from "next/link";
import { Folder, ArrowUpRight } from "lucide-react";
import { getAllCategories } from "@/lib/markdown";
import { slugify } from "@/lib/markdown";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Categories" };

/** Lists every category automatically detected from note front matter. */
export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div>
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Categories</h1>
        <p className="mt-2 text-[#7a6b56]">
          Notes are grouped automatically based on each file&apos;s{" "}
          <code className="rounded bg-[#f1e6d3] px-1.5 py-0.5 font-mono text-xs">category</code>{" "}
          front matter.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, i) => (
          <Link
            key={category.name}
            href={`/categories/${slugify(category.name)}`}
            className="group stagger-item"
            style={{ "--stagger-index": i } as React.CSSProperties}
          >
            <Card interactive>
              <CardContent className="flex items-center justify-between p-5">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <Folder className="h-4 w-4 text-terracotta-ink transition-transform duration-200 ease-out group-hover:scale-110" />
                  {category.name}
                  <ArrowUpRight className="h-3.5 w-3.5 text-terracotta-ink opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </span>
                <span className="font-mono text-xs text-[#a7967d]">
                  {category.count} note{category.count !== 1 ? "s" : ""}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
