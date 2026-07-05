import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SiteHeader } from '@/components/docs/site-header';
import './globals.css';
// Note: we intentionally use system font stacks (defined in globals.css)
// instead of next/font/google. This avoids a build-time network fetch to
// Google Fonts, which keeps the project fully usable offline / behind
// restrictive firewalls, while still looking clean and modern.
export const metadata: Metadata = {
  title: {
    default: 'Notebook — Pentest & Dev Notes',
    template: '%s — Notebook',
  },
  description: 'A searchable notebook of pentesting and development notes.',
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
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">{children}</main>
        <footer className="border-t border-border py-8 text-center text-xs text-[#007282]">
          A notebook for PenTesters &amp; Developers
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
