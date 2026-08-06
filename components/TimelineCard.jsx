import Link from "next/link";

export default function TimelineCard({ entry }) {
  const isRight = entry.side === "right";

  const alignment = isRight
    ? "md:col-start-2 md:pl-12"
    : "md:col-start-1 md:pr-12";

  const markerPosition = isRight
    ? "md:-left-[0.62rem]"
    : "md:-right-[0.62rem]";

  return (
    <article className={`relative ${alignment}`}>
      <div
        className={`absolute top-8 hidden h-5 w-5 rounded-full border border-[var(--muted-gold)] bg-[var(--background)] shadow-[0_0_18px_rgba(185,144,74,0.35)] md:block ${markerPosition}`}
      />

      <Link
        href={entry.slug}
        className="group block border border-[var(--border)] bg-[rgba(12,10,8,0.82)] p-6 transition hover:-translate-y-1 hover:border-[var(--muted-gold)] hover:bg-[rgba(20,16,12,0.9)]"
      >
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted-gold)]">
          {entry.era}
        </p>

        <h3 className="mt-4 font-display text-2xl transition group-hover:text-[var(--muted-gold)]">
          {entry.title}
        </h3>

        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
          {entry.realm}
        </p>

        <p className="mt-4 font-serif text-lg leading-7 text-[var(--muted)]">
          {entry.cardText}
        </p>
      </Link>
    </article>
  );
}