import ScrollControls from "@/components/ScrollControls";
import Link from "next/link";

export default function SiteShell({ eyebrow, title, children }) {
  return (
    <main className="relative min-h-screen overflow-hidden px-[var(--space-6)] py-[var(--space-20)] text-[var(--foreground)] sm:px-[var(--space-10)] lg:px-[var(--space-16)]">
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat opacity-30"
        style={{
          backgroundImage: "url('/assets/covers/crestfall-camellia-cover.png')",
        }}
      />

      <div className="absolute inset-0 bg-[var(--scrim-strong)]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        {eyebrow && (
          <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
            {eyebrow}
          </p>
        )}

        <h1 className="mt-4 font-display text-5xl">{title}</h1>

        <div className="mt-6">{children}</div>

        <Link className="sourcebook-button mt-10" href="/">
          Return Home
        </Link>
      </div>
      <ScrollControls />
    </main>
  );
}