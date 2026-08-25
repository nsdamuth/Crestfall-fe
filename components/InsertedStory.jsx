export default function InsertedStory({ eyebrow = "Field Note", title, children }) {
  return (
    <div className="inserted-story">
      <p className="font-display text-xs uppercase tracking-[0.4em] text-[var(--gold-ornament)]">
        {eyebrow}
      </p>

      <h2 className="mt-4 font-display text-4xl">{title}</h2>

      <div className="mt-6 max-w-3xl font-serif text-xl leading-9 text-[var(--ink-dim)]">
        {children}
      </div>
    </div>
  );
}