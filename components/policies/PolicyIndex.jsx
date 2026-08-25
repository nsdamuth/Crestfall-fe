import Link from "next/link";
import { FileText, ShieldCheck } from "lucide-react";
import { policies } from "@/data/policies";

export default function PolicyIndex() {
  return (
    <section className="mt-10 space-y-8">
      <div className="rounded-[var(--radius-md)] border border-amber-300/20 bg-amber-300/10 p-5">
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-amber-200">
          <ShieldCheck size={15} />
          Draft Legal Placeholder
        </p>

        <p className="mt-2 text-sm leading-7 text-amber-100/80">
          The current copy is intentionally generic. It exists so the product,
          navigation, and compliance surfaces can be tested before final legal
          review.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {policies.map((policy) => (
          <Link
            key={policy.slug}
            href={`/terms/${policy.slug}`}
            className="group rounded-[var(--radius-md)] border border-white/10 bg-black/30 p-5 transition hover:-translate-y-1 hover:border-[var(--gold-ornament)]/40 hover:bg-[var(--gold-ornament)]/10"
          >
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
              <FileText size={14} />
              {policy.category}
            </p>

            <h2 className="mt-3 font-display text-3xl text-[var(--ink)]">
              {policy.title}
            </h2>

            <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--ink-dim)]">
              {policy.summary}
            </p>

            <p className="mt-5 text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)] transition group-hover:text-[var(--ink)]">
              Read Policy →
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}