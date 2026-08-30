function SummaryItem({ label, value }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-1)] p-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
        {label}
      </p>

      <p className="mt-2 text-sm text-[var(--ink)]">
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

      <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] p-6 text-sm leading-7 text-[var(--ink-dim)]">
        Coming soon: optional fields, advanced controls, and draft persistence.
      </div>
    </div>
  );
}

function StepTitle({ title, body }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
        Character Builder
      </p>
      <h2 className="mt-2 font-display text-4xl">{title}</h2>
      <p className="mt-3 leading-7 text-[var(--ink-dim)]">{body}</p>
    </div>
  );
}

function TextField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-[var(--line)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="mt-2 w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--surface-1)] px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
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