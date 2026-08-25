export default function SourcebookPanel({ eyebrow, title, children }) {
  return (
    <aside className="sourcebook-panel">
      {eyebrow && (
        <p className="font-display text-xs uppercase tracking-[0.35em] text-[var(--gold-ornament)]">
          {eyebrow}
        </p>
      )}

      <h3 className="mt-4 font-display text-3xl">{title}</h3>

      <div className="mt-5 font-serif text-lg leading-8 text-[var(--ink-dim)]">
        {children}
      </div>
    </aside>
  );
}