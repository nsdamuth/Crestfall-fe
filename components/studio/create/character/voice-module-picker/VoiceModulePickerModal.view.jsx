"use client";

import { Check, X } from "lucide-react";

export default function VoiceModulePickerModalView({
  open = false,
  triggerLabel = "Voice Modules",
  triggerDescription = "",
  triggerActionLabel = "Choose Modules",
  selectedItems = [],
  emptySelectionMessage = "No voice modules selected.",
  modalAriaLabel = "Choose voice modules",
  modalTitle = "Choose Voice Modules",
  modalDescription = "",
  optionGroups = [],
  selectedIds = [],
  clearActionLabel = "Clear All",
  doneActionLabel = "Done",
  canClear = false,
  onOpen = null,
  onClose = null,
  onToggleModule = null,
  onClearAll = null,
  onDone = null,
}) {
  const selectedSet = new Set(Array.isArray(selectedIds) ? selectedIds : []);
  const safeSelectedItems = Array.isArray(selectedItems) ? selectedItems : [];
  const safeOptionGroups = Array.isArray(optionGroups) ? optionGroups : [];

  return (
    <div className="rounded-xl border border-white/10 bg-black/35 p-4 md:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            {triggerLabel}
          </p>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {triggerDescription}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpen?.()}
          className="shrink-0 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
        >
          {triggerActionLabel}
        </button>
      </div>

      {safeSelectedItems.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {safeSelectedItems.map((item, index) => (
            <span
              key={`${item?.id || item?.label || "voice-module"}-${index}`}
              className="rounded-full border border-[var(--muted-gold)]/30 bg-[var(--muted-gold)]/10 px-3 py-1 text-xs text-[var(--muted-gold)]"
            >
              {item?.label || "Voice Module"}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-[var(--muted)]">
          {emptySelectionMessage}
        </p>
      )}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={modalAriaLabel}
            className="flex max-h-[88vh] w-full max-w-5xl flex-col rounded-2xl border border-[var(--muted-gold)]/25 bg-[#080706] p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl">{modalTitle}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                  {modalDescription}
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

            <div className="mt-5 min-h-0 overflow-y-auto pr-1">
              {safeOptionGroups.length ? (
                <div className="space-y-6">
                  {safeOptionGroups.map((group) => {
                    const options = Array.isArray(group?.options)
                      ? group.options
                      : [];

                    if (!options.length) return null;

                    return (
                      <section key={group?.id || group?.label}>
                        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
                          {group?.label || "Voice Modules"}
                        </p>

                        <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                          {options.map((option) => {
                            const optionId = option?.id || "";
                            const active = selectedSet.has(optionId);

                            return (
                              <button
                                key={optionId || option?.label}
                                type="button"
                                onClick={() => onToggleModule?.(optionId)}
                                className={`rounded-xl border px-4 py-3 text-left transition ${
                                  active
                                    ? "border-[var(--muted-gold)]/60 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                                    : "border-white/10 bg-black/30 text-[var(--muted)] hover:border-[var(--muted-gold)]/30 hover:bg-[var(--muted-gold)]/10 hover:text-[var(--foreground)]"
                                }`}
                              >
                                <span className="flex items-start justify-between gap-3">
                                  <span className="min-w-0">
                                    <span className="block text-sm text-[var(--foreground)]">
                                      {option?.label || "Voice Module"}
                                    </span>

                                    <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">
                                      {option?.description || ""}
                                    </span>
                                  </span>

                                  {active ? (
                                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/15 text-[var(--muted-gold)]">
                                      <Check size={14} />
                                    </span>
                                  ) : null}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-black/25 p-6 text-sm leading-6 text-[var(--muted)]">
                  No voice modules are available.
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => onClearAll?.()}
                disabled={!canClear}
                className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] transition hover:border-red-400/30 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {clearActionLabel}
              </button>

              <button
                type="button"
                onClick={() => onDone?.()}
                className="rounded-xl border border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/15 px-5 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]"
              >
                {doneActionLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
