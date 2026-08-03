import CrestfallSelect from "@/components/ui/CrestfallSelect";

function TextAreaField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </span>
      <textarea
        value={value ?? ""}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
      />
    </label>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
        {label}
      </p>
      <p className="mt-2 text-sm text-[var(--foreground)]">{value}</p>
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
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
          Character Builder
        </p>
        <h2 className="mt-2 font-display text-4xl">Review</h2>
        <p className="mt-3 leading-7 text-[var(--muted)]">
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
          <span className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
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
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
          />

          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            Adult characters only. Used for narration and lore context, not
            visual aging.
          </p>
        </label>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-black/25">
        <button
          type="button"
          onClick={() => onToggleAdvanced?.()}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">
              Advanced Creator Guidance
            </p>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
              Optional advanced fields for creators who want deeper AI control.
            </p>
          </div>
          <span className="text-[var(--muted-gold)]">
            {advancedOpen ? "−" : "+"}
          </span>
        </button>

        {advancedOpen ? (
          <div className="border-t border-white/10 px-5 py-5">
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

      <div className="mt-8 rounded-2xl border border-[var(--muted-gold)]/20 bg-black/25 p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
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
