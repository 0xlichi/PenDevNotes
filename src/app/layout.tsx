import type { Metadata } from 'next';
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
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
        <footer className="border-t border-border py-8 font-bold text-center text-xs text-[#014B43]">
          A notebook for PenTesters & Developers
        </footer>
      </body>
    </html>
  );
}
