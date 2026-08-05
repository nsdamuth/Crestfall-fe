import { Check, Loader2, Save, X } from "lucide-react";

export default function SaveIngredientPresetModalView({
  open = false,
  presetTypeLabel = "Ingredient Preset",
  introText = "",
  helperText = "",
  nameValue = "",
  descriptionValue = "",
  promptValue = "",
  tagsValue = "",
  isSaving = false,
  canSave = false,
  saveMessage = "",
  saveMessageTone = "info",
  onChangeName = null,
  onChangeDescription = null,
  onChangePrompt = null,
  onChangeTags = null,
  onSavePreset = null,
  onUseOnce = null,
  onClose = null,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--muted-gold)]/25 bg-[#080706] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
              Save Preset
            </p>

            <h2 className="mt-2 font-display text-4xl">{presetTypeLabel}</h2>

            {introText ? (
              <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
                {introText}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            disabled={isSaving}
            className="rounded-[var(--radius-full)] border border-white/10 p-2 text-[var(--muted)] transition hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close save preset modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 p-5">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Preset Name
            </span>
            <input
              value={nameValue}
              onChange={(event) => onChangeName?.(event.target.value)}
              placeholder="Name this preset..."
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Description
            </span>
            <textarea
              value={descriptionValue}
              onChange={(event) => onChangeDescription?.(event.target.value)}
              placeholder="Optional description for later browsing and editing..."
              rows={3}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Prompt / Guidance
            </span>
            <textarea
              value={promptValue}
              onChange={(event) => onChangePrompt?.(event.target.value)}
              placeholder="The reusable prompt fragment lives here..."
              rows={5}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Tags
            </span>
            <input
              value={tagsValue}
              onChange={(event) => onChangeTags?.(event.target.value)}
              placeholder="fantasy, formal, battle-ready..."
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
            />
          </label>

          {helperText ? (
            <div className="rounded-xl border border-white/10 bg-black/25 p-4 text-xs leading-5 text-[var(--muted)]">
              {helperText}
            </div>
          ) : null}

          {saveMessage ? (
            <p
              className={`rounded-xl border px-4 py-3 text-sm ${
                saveMessageTone === "error"
                  ? "border-red-500/30 bg-red-500/10 text-red-200"
                  : "border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 text-[var(--muted-gold)]"
              }`}
            >
              {saveMessage}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => onSavePreset?.()}
              disabled={isSaving || !canSave}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {isSaving ? "Saving..." : "Save as Preset"}
            </button>

            <button
              type="button"
              onClick={() => onUseOnce?.()}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/20 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--foreground)] transition hover:bg-[var(--muted-gold)]/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check size={14} />
              Use Once
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
