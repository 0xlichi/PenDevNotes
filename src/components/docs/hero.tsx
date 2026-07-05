import { GitBranch, FileText, GitPullRequest } from 'lucide-react';
import { RotatingWord } from '@/components/docs/rotating-word';

const REPO_URL = 'https://github.com/0xlichi/PenDevNotes';

/**
 * Homepage hero: explains what this project actually is (a community notes
 * repository, not a personal note-taking app) and how to contribute, with
 * an animated rotating word calling out who it's for.
 */
export function Hero() {
  return (
    <section className="relative mb-14 animate-fade-in-up overflow-hidden rounded-2xl border border-border bg-surface px-6 py-12 sm:px-12 sm:py-16">
      {/* Soft decorative glow in the palette, purely visual */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-terracotta/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sage/25 blur-3xl"
      />

      <div className="relative">
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          This notebook is for{' '}
          <span className="relative inline-block min-w-[8ch] text-left align-bottom">
            <RotatingWord />
          </span>
        </h1>

        <p className="mt-5 max-w-4xl text-base leading-loose text-[#6b5940]">
          <strong className="text-2xl text-red-400">PenDevNotes</strong> is a{' '}
          <strong className="text-foreground">community-driven</strong> knowledge base, not a
          personal notebook. Every note should be written for someone else to read clear, accurate,
          and complete. Avoid using it as a scratchpad, an unfinished draft, or a collection of
          commands without explanation. Whether you&apos;re documenting a challenging bug, sharing a
          pentesting methodology, or publishing a cheatsheet you&apos;ve relied on countless times,
          write it in a way that helps the next person learn, troubleshoot, and solve the same
          problem.{' '}
        </p>

        <p className="mt-4 max-w-4xl text-base leading-loose text-[#6b5940]">
          The goal is simple: create a growing collection of high-quality notes that anyone, from
          beginners taking their first steps to experienced professionals, can search, learn from,
          and trust. Reading is open to everyone, contributing is open to everyone, and the only
          thing required is a well-written Markdown note submitted through a pull request.{' '}
        </p>

        {/* How to contribute */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Step
            icon={<FileText className="h-4 w-4" />}
            step="1"
            text="Write a clean, well-structured note in Markdown — clear headings, working code blocks, and enough context that a stranger could follow it"
          />
          <Step
            icon={<GitPullRequest className="h-4 w-4" />}
            step="2"
            text="Open a pull request on GitHub with a clear, descriptive commit message explaining what the note covers"
          />
          <Step
            icon={<GitBranch className="h-4 w-4" />}
            step="3"
            text="Get reviewed for quality and accuracy, then merged into the shared notebook for everyone to use"
          />
        </div>

        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-terracotta px-4 py-2.5 text-sm font-medium text-[#33291f] shadow-sm transition-all duration-150 ease-out hover:-translate-y-0.5 hover:bg-terracotta-deep hover:shadow-md active:scale-[0.97]"
        >
          <GitBranch className="h-4 w-4" />
          Contribute on GitHub
        </a>
      </div>
    </section>
  );
}

function Step({ icon, step, text }: { icon: React.ReactNode; step: string; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-background/60 p-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sand/50 font-mono text-xs font-semibold text-sand-ink">
        {step}
      </span>
      <div className="flex flex-col gap-1">
        <span className="text-terracotta-ink">{icon}</span>
        <p className="text-sm leading-snug text-[#6b5940]">{text}</p>
      </div>
    </div>
  );
}
