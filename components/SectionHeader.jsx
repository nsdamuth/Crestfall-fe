export default function SectionHeader({ eyebrow, title, text }) {
  return (
    <div className="mb-8 border-b border-[var(--border)] pb-5">
      {eyebrow && (
        <p className="font-display text-xs uppercase tracking-[0.4em] text-[var(--muted-gold)]">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-3 font-display text-4xl">{title}</h2>

      {text && (
        <p className="mt-4 max-w-3xl font-serif text-xl leading-8 text-[var(--muted)]">
          {text}
        </p>
      )}
    </div>
  );
}