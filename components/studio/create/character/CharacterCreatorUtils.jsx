function SummaryItem({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
        {label}
      </p>

      <p className="mt-2 text-sm text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}


function PlaceholderStep({ step }) {
  return (
    <div>
      <StepTitle
        title={step.label}
        body="This section is stubbed for now. The flow is being shaped before database persistence and AI generation are added."
      />

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-6 text-sm leading-7 text-[var(--muted)]">
        Coming soon: optional fields, advanced controls, and draft persistence.
      </div>
    </div>
  );
}

function StepTitle({ title, body }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
        Character Builder
      </p>
      <h2 className="mt-2 font-display text-4xl">{title}</h2>
      <p className="mt-3 leading-7 text-[var(--muted)]">{body}</p>
    </div>
  );
}

function TextField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
      />
    </label>
  );
}

export {
    SummaryItem,
    PlaceholderStep,
    StepTitle,
    TextField,
    TextAreaField
}