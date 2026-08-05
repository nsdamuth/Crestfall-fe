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
          <p className="font-display text-xs uppercase tracking-[0.4em] text-[var(--muted-gold)]">
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