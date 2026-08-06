export default function SectionHeader({ eyebrow, title, text }) {
  return (
    <div className="mb-8 border-b border-[var(--line-strong)] pb-5">
      {eyebrow && (
        <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-3 font-display text-4xl">{title}</h2>

      {text && (
        <p className="mt-4 max-w-3xl font-serif text-xl leading-8 text-[var(--ink-dim)]">
          {text}
        </p>
      )}
    </div>
  );
}