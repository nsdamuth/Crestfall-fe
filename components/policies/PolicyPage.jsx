import Link from "next/link";
import { AlertTriangle, ArrowLeft, ShieldCheck } from "lucide-react";

export default function PolicyPage({ policy }) {
  return (
    <article className="mt-12 space-y-8">
      <Link
        href="/terms"
        className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-white/10 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
      >
        <ArrowLeft size={14} />
        Terms & Policies
      </Link>

      <header className="rounded-[var(--radius-lg)] border border-[var(--gold-ornament)]/20 bg-black/40 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--gold-ornament)]">
          {policy.category}
        </p>

        <h1 className="mt-3 font-display text-5xl text-[var(--ink)]">
          {policy.title}
        </h1>

        <p className="mt-4 max-w-4xl leading-8 text-[var(--ink-dim)]">
          {policy.summary}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div className="rounded-[var(--radius-md)] border border-amber-300/20 bg-amber-300/10 p-4">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-amber-200">
              <AlertTriangle size={15} />
              Draft Placeholder
            </p>

            <p className="mt-2 text-sm leading-7 text-amber-100/80">
              This policy is not final legal language. It is a product and UI
              placeholder pending legal review.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
            <ShieldCheck size={14} />
            {policy.status}
          </span>
        </div>
      </header>

      <div className="grid gap-5">
        {policy.sections.map((section) => (
          <section
            key={section.heading}
            className="rounded-[var(--radius-md)] border border-white/10 bg-black/30 p-5 md:p-6"
          >
            <h2 className="font-display text-3xl text-[var(--ink)]">
              {section.heading}
            </h2>

            <p className="mt-3 leading-8 text-[var(--ink-dim)]">
              {section.body}
            </p>
          </section>
        ))}
      </div>

      <footer className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5 text-sm leading-7 text-[var(--ink-dim)]">
        Future versions of this page should include effective date, last updated
        date, contact method, jurisdiction-specific notices where applicable,
        and any required legal language after review.
      </footer>
    </article>
  );
}