import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NoteNotFound() {
  return (
    <div className="animate-fade-in-up mx-auto max-w-md py-20 text-center">
      <FileQuestion className="mx-auto mb-3 h-10 w-10 text-terracotta-ink" strokeWidth={1.5} />
      <p className="font-mono text-sm text-[#a7967d]">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-foreground">Note not found</h1>
      <p className="mt-2 text-[#7a6b56]">
        This note may have been renamed or removed from{" "}
        <code className="rounded bg-[#f1e6d3] px-1.5 py-0.5 font-mono text-xs">/content</code>.
      </p>
      <Link
        href="/"
        className={[
          "mt-6 inline-block rounded-lg bg-terracotta px-4 py-2 text-sm font-medium text-[#33291f]",
          "transition-all duration-150 ease-out active:scale-95",
          "hover:bg-terracotta-deep hover:shadow-md",
        ].join(" ")}
      >
        Back to all notes
      </Link>
    </div>
  );
}
