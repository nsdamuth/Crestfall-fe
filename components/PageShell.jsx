import Link from "next/link";

export default function PageShell({ eyebrow, title, children }) {
  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-20 text-[var(--foreground)] sm:px-10 lg:px-16">
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