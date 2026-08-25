"use client";

import { ChevronRight } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

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
  const hasValue =
    Boolean(selectedPresetLabel) && selectedPresetLabel !== "Not chosen";

  return (
    <div>
      <span className="block text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        {label}
      </span>
      <button
        type="button"
        onClick={() => onOpen?.()}
        className="mt-[var(--space-1)] flex min-h-[var(--control-md)] w-full items-center justify-between gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-left transition-colors hover:border-[var(--state-hover-line)]"
      >
        <span
          className={`truncate text-[length:var(--text-body)] leading-[var(--lh-body)] ${hasValue ? "text-[var(--ink)]" : "text-[var(--ink-faint)]"}`}
        >
          {selectedPresetLabel}
        </span>
        <ChevronRight
          size={16}
          className="shrink-0 text-[var(--ink-faint)]"
          aria-hidden="true"
        />
      </button>
      <span className="mt-[var(--space-2)] block text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
        Optional silhouette shorthand. Suggested body fields remain fully editable.
      </span>

      {open ? (
        <KitModalFrame
          variant="modal"
          panelClassName="w-full max-w-4xl"
          onClose={onClose}
          ariaLabel={label}
        >
          <div className="flex max-h-[92dvh] flex-col p-[var(--space-6)] pt-[var(--space-8)]">
            <div>
              <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                Optional Body Preset
              </p>
              <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
                {label}
              </h2>
              <p className="mt-[var(--space-2)] max-w-[var(--measure)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                Choose a commonly used Kibbe-inspired image identity as a creator shortcut.
                It is not a measurement, diagnosis, or hard body rule. Explicit body fields,
                custom notes, and later edits always take priority.
              </p>
            </div>

            <div
              aria-hidden="true"
              className="h-px bg-[image:var(--line-fade)] my-[var(--space-5)]"
            />

            <div className="grid min-h-0 flex-1 gap-[var(--space-5)] overflow-y-auto pb-[var(--space-2)] pr-1 lg:grid-cols-[0.7fr_1.3fr]">
              <div className="grid gap-[var(--space-2)] self-start md:grid-cols-2 lg:grid-cols-1">
                {identityOptions.map((option) => {
                  const active = option?.value === pendingValue;

                  return (
                    <button
                      key={option?.value || "none"}
                      type="button"
                      onClick={() => onSelectIdentity?.(option?.value || "")}
                      className={`rounded-[var(--radius-md)] border px-[var(--space-4)] py-[var(--space-3)] text-left transition-colors ${
                        active
                          ? "border-[var(--gold-ornament)]/55 bg-[var(--fill-whisper)] text-[var(--ink)]"
                          : "border-[var(--line-whisper)] bg-[var(--fill-option-rest)] text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/30 hover:bg-[var(--gold-ornament)]/10 hover:text-[var(--ink)]"
                      }`}
                    >
                      <span className="block text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
                        {option?.label || "Not chosen"}
                      </span>
                      <span className="mt-[var(--space-1)] block text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
                        {option?.description || ""}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-4)] lg:sticky lg:top-0 lg:self-start">
                <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                  Suggested Crestfall Traits
                </p>

                {hasPendingPreset ? (
                  <>
                    <h3 className="mt-[var(--space-3)] font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)] text-[var(--ink)]">
                      {pendingPreset?.label || "Not chosen"}
                    </h3>
                    <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                      {pendingPreset?.description || ""}
                    </p>

                    <div className="mt-[var(--space-4)] grid gap-[var(--space-2)]">
                      {suggestionRows.map((row) => (
                        <div
                          key={row?.label || row?.value}
                          className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-3)]"
                        >
                          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                            {row?.label || "Trait"}
                          </p>
                          <p className="mt-[var(--space-1)] text-[length:var(--text-body)] text-[var(--ink)]">
                            {row?.value || "Not chosen"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="mt-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                    Clear the identity without changing body traits that were already applied or
                    edited manually.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-[var(--space-5)] flex flex-wrap justify-end gap-[var(--space-3)] border-t border-[var(--line-whisper)] pt-[var(--space-5)]">
              <button
                type="button"
                onClick={() => onSaveIdentityOnly?.()}
                className="cf-btn cf-btn--secondary"
              >
                {hasPendingPreset ? "Save identity only" : "Clear identity"}
              </button>

              {hasPendingPreset ? (
                <>
                  <button
                    type="button"
                    onClick={() => onFillEmptyFields?.()}
                    className="cf-btn cf-btn--secondary"
                  >
                    Fill empty fields
                  </button>
                  <button
                    type="button"
                    onClick={() => onReplaceBodyTraits?.()}
                    className="cf-btn cf-btn--primary"
                  >
                    Replace body traits
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </KitModalFrame>
      ) : null}
    </div>
  );
}
