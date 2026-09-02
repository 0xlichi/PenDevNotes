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
        <main className="mx-auto max-w-[90rem] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">{children}</main>
        <footer className="mt-8 border-t border-border/80 py-10 text-center text-xs tracking-wide text-[#7a6b56]">
          A notebook for pentesters &amp; developers
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
