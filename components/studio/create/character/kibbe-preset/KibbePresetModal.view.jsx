import { X } from "lucide-react";

export default function KibbePresetModalView({
  open = false,
  label = "Kibbe-Inspired Body Identity",
  selectedPresetLabel = "Not chosen",
  identityOptions = [],
  pendingValue = "",
  pendingPreset = null,
  suggestionRows = [],
  onOpen = null,
  onClose = null,
  onSelectIdentity = null,
  onSaveIdentityOnly = null,
  onFillEmptyFields = null,
  onReplaceBodyTraits = null,
}) {
  const hasPendingPreset = Boolean(pendingPreset?.value);

  return (
    <div>
      <button
        type="button"
        onClick={() => onOpen?.()}
        className="w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-left text-sm transition hover:border-[var(--muted-gold)]/35"
      >
        <span className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
          {label}
        </span>
        <span className="mt-1 block text-[var(--foreground)]">
          {selectedPresetLabel}
        </span>
        <span className="mt-2 block text-xs leading-5 text-[var(--muted)]">
          Optional silhouette shorthand. Suggested body fields remain fully editable.
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[var(--radius-md)] border border-[var(--muted-gold)]/25 bg-[#080706] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
                  Optional Body Preset
                </p>
                <h2 className="mt-2 font-display text-3xl">{label}</h2>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--muted)]">
                  Choose a commonly used Kibbe-inspired image identity as a creator shortcut.
                  It is not a measurement, diagnosis, or hard body rule. Explicit body fields,
                  custom notes, and later edits always take priority.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onClose?.()}
                className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
              <div className="grid max-h-[58vh] gap-2 overflow-y-auto pr-1 md:grid-cols-2">
                {identityOptions.map((option) => {
                  const active = option?.value === pendingValue;

                  return (
                    <button
                      key={option?.value || "none"}
                      type="button"
                      onClick={() => onSelectIdentity?.(option?.value || "")}
                      className={`rounded-xl border px-4 py-3 text-left transition ${
                        active
                          ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                          : "border-white/10 bg-black/30 text-[var(--muted)] hover:border-[var(--muted-gold)]/30 hover:bg-[var(--muted-gold)]/10 hover:text-[var(--foreground)]"
                      }`}
                    >
                      <span className="block text-sm text-[var(--foreground)]">
                        {option?.label || "Not chosen"}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">
                        {option?.description || ""}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/30 p-4 lg:sticky lg:top-4 lg:self-start">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
                  Suggested Crestfall Traits
                </p>

                {hasPendingPreset ? (
                  <>
                    <h3 className="mt-3 font-display text-2xl">
                      {pendingPreset?.label || "Not chosen"}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {pendingPreset?.description || ""}
                    </p>

                    <div className="mt-4 grid gap-2">
                      {suggestionRows.map((row) => (
                        <div
                          key={row?.label || row?.value}
                          className="rounded-xl border border-white/10 bg-black/25 p-3"
                        >
                          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                            {row?.label || "Trait"}
                          </p>
                          <p className="mt-1 text-sm text-[var(--foreground)]">
                            {row?.value || "Not chosen"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    Clear the identity without changing body traits that were already applied or
                    edited manually.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() => onSaveIdentityOnly?.()}
                className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:text-[var(--foreground)]"
              >
                {hasPendingPreset ? "Save Identity Only" : "Clear Identity"}
              </button>

              {hasPendingPreset ? (
                <>
                  <button
                    type="button"
                    onClick={() => onFillEmptyFields?.()}
                    className="rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20"
                  >
                    Fill Empty Fields
                  </button>
                  <button
                    type="button"
                    onClick={() => onReplaceBodyTraits?.()}
                    className="rounded-xl border border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/20 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/30"
                  >
                    Replace Body Traits
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
