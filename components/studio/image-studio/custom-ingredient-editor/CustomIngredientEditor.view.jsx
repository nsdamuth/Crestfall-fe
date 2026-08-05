import { BookOpen, Check, Library, Save, X } from "lucide-react";

export default function CustomIngredientEditorView({
  open = false,
  ingredientLabel = "Ingredient",
  introText = "",
  promptValue = "",
  promptPlaceholder = "Describe the custom ingredient guidance...",
  showSavePresetAction = false,
  onChangePrompt = null,
  onBackToPresets = null,
  onClear = null,
  onSavePreset = null,
}) {
  if (!open) return null;

  return (
    <section className="rounded-2xl border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
            <BookOpen size={14} />
            Custom {ingredientLabel}
          </p>

          {introText ? (
            <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
              {introText}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => onClear?.()}
          className="rounded-lg border border-white/10 p-2 text-[var(--ink-dim)] transition hover:text-[var(--ink)]"
          aria-label={`Clear custom ${ingredientLabel}`}
        >
          <X size={15} />
        </button>
      </div>

      <label className="mt-4 block">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
          Custom Guidance
        </span>

        <textarea
          value={promptValue}
          onChange={(event) => onChangePrompt?.(event.target.value)}
          placeholder={promptPlaceholder}
          rows={4}
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
        />
      </label>

      <div
        className={`mt-4 grid gap-2 ${
          showSavePresetAction ? "sm:grid-cols-3" : "sm:grid-cols-2"
        }`}
      >
        <button
          type="button"
          onClick={() => onBackToPresets?.()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
        >
          <Library size={14} />
          Back to Presets
        </button>

        {showSavePresetAction ? (
          <button
            type="button"
            onClick={() => onSavePreset?.()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
          >
            <Save size={14} />
            Save as Preset
          </button>
        ) : null}

        <button
          type="button"
          disabled
          aria-pressed="true"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--gold-ornament)]/45 bg-[var(--gold-ornament)]/20 px-3 py-3 text-[10px] uppercase tracking-[0.14em] text-[var(--ink)]"
        >
          <Check size={14} />
          Use Once
        </button>
      </div>
    </section>
  );
}
