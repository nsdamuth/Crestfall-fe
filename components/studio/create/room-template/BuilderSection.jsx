export default function BuilderSection({ eyebrow, title, body, children }) {
  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-6">
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
        {eyebrow}
      </p>

      <h2 className="mt-2 font-display text-4xl">{title}</h2>

      <p className="mt-3 max-w-4xl leading-7 text-[var(--muted)]">{body}</p>

      <div className="mt-6">{children}</div>
    </section>
  );
}