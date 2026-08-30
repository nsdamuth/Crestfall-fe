import CrestfallSelect from "@/components/ui/CrestfallSelect";

function TextAreaField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <textarea
        value={value ?? ""}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="mt-2 w-full resize-none rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
    </label>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] p-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
        {label}
      </p>
      <p className="mt-2 text-sm text-[var(--ink)]">{value}</p>
    </div>
  );
}

export default function CharacterReviewStepView({
  selectFields = [],
  ageValue = "",
  advancedOpen = false,
  advancedFields = [],
  summaryItems = [],
  advancedPromptingContent = null,
  onSelectChange,
  onAgeChange,
  onNormalizeAge,
  onToggleAdvanced,
  onAdvancedFieldChange,
} = {}) {
  return (
    <div>
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
          Character Builder
        </p>
        <h2 className="mt-2 font-display text-4xl">Review</h2>
        <p className="mt-3 leading-7 text-[var(--ink-dim)]">
          Finalize publishing settings and optionally add advanced creator
          guidance for deeper AI control.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {selectFields.map((field) => (
          <CrestfallSelect
            key={field.key}
            label={field.label}
            value={field.value}
            onChange={(value) => onSelectChange?.(field.key, value)}
            options={field.options}
          />
        ))}

        <label className="block">
          <span className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
            Age
          </span>

          <input
            type="number"
            min="18"
            inputMode="numeric"
            value={ageValue ?? ""}
            onChange={(event) => onAgeChange?.(event.target.value)}
            onBlur={() => onNormalizeAge?.()}
            placeholder="18+"
            className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
          />

          <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
            Adult characters only. Used for narration and lore context, not
            visual aging.
          </p>
        </label>
      </div>

      <div className="mt-8 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)]">
        <button
          type="button"
          onClick={() => onToggleAdvanced?.()}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <div>
            <p className="text-sm font-medium text-[var(--ink)]">
              Advanced Creator Guidance
            </p>
            <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
              Optional advanced fields for creators who want deeper AI control.
            </p>
          </div>
          <span className="text-[var(--gold-ornament)]">
            {advancedOpen ? "−" : "+"}
          </span>
        </button>

        {advancedOpen ? (
          <div className="border-t border-[var(--line)] px-5 py-5">
            <div className="grid gap-5">
              {advancedFields.map((field) => (
                <TextAreaField
                  key={field.key}
                  label={field.label}
                  value={field.value}
                  onChange={(value) =>
                    onAdvancedFieldChange?.(field.key, value)
                  }
                  placeholder={field.placeholder}
                />
              ))}
              {advancedPromptingContent}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-8 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
          Draft Summary
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {summaryItems.map((item) => (
            <SummaryItem key={item.key} label={item.label} value={item.value} />
          ))}
        </div>
      </div>
    </div>
  );
}
