import type { Metadata } from "next";
import { SiteHeader } from "@/components/docs/site-header";
import "./globals.css";

// Note: we intentionally use system font stacks (defined in globals.css)
// instead of next/font/google. This avoids a build-time network fetch to
// Google Fonts, which keeps the project fully usable offline / behind
// restrictive firewalls, while still looking clean and modern.

export const metadata: Metadata = {
  title: {
    default: "Notebook — Pentest & Dev Notes",
    template: "%s — Notebook",
  },
  description: "A searchable notebook of pentesting and development notes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
        <footer className="border-t border-border py-8 text-center text-xs text-[#a7967d]">
          Built with Next.js, Tailwind CSS, and shadcn/ui — Markdown notes live in{" "}
          <code className="rounded bg-[#f1e6d3] px-1.5 py-0.5 font-mono">/content</code>
        </footer>
      </body>
    </html>
  );
}
