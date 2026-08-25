function TextInput({ label, value, onChange, placeholder = "" }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 5, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
    </label>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold-ornament)]/50"
      >
        {options.map((option) => (
          <option key={option.value || "none"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxGroup({ title, entries, selectedIds, onToggle }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {title}
      </p>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {entries.length ? (
          entries.map((entry) => {
            const active = selectedIds.includes(entry.id);

            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => onToggle(entry.id)}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                  active
                    ? "border-[var(--gold-ornament)]/60 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                    : "border-white/10 bg-black/30 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/35"
                }`}
              >
                {entry.name}
              </button>
            );
          })
        ) : (
          <p className="text-sm text-[var(--ink-dim)]">
            Add NPC entries before assigning knowledge.
          </p>
        )}
      </div>
    </div>
  );
}

export {
    CheckboxGroup,
    TextInput,
    TextArea,
    SelectInput
}