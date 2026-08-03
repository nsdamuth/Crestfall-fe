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
    <section className="rounded-2xl border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
            <BookOpen size={14} />
            Custom {ingredientLabel}
          </p>

          {introText ? (
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {introText}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => onClear?.()}
          className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
          aria-label={`Clear custom ${ingredientLabel}`}
        >
          <X size={15} />
        </button>
      </div>

      <label className="mt-4 block">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
          Custom Guidance
        </span>

        <textarea
          value={promptValue}
          onChange={(event) => onChangePrompt?.(event.target.value)}
          placeholder={promptPlaceholder}
          rows={4}
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
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
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
        >
          <Library size={14} />
          Back to Presets
        </button>

        {showSavePresetAction ? (
          <button
            type="button"
            onClick={() => onSavePreset?.()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
          >
            <Save size={14} />
            Save as Preset
          </button>
        ) : null}

        <button
          type="button"
          disabled
          aria-pressed="true"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/20 px-3 py-3 text-[10px] uppercase tracking-[0.14em] text-[var(--foreground)]"
        >
          <Check size={14} />
          Use Once
        </button>
      </div>
    </section>
  );
}
