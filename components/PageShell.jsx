import Link from "next/link";

export default function PageShell({ eyebrow, title, children }) {
  return (
    <main className="min-h-screen bg-[var(--background)] px-[var(--space-6)] py-[var(--space-20)] text-[var(--foreground)] sm:px-[var(--space-10)] lg:px-[var(--space-16)]">
      <div className="mx-auto max-w-5xl">
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
    </main>
  );
}