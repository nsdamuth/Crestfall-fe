"use client";

import { Check, MapPin } from "lucide-react";

export default function StoryStartOpeningLocationPickerView({
  open = false,
  eyebrow = "Choose Starting Location",
  description = "",
  options = [],
  selectedLocationId = "",
  emptyState = null,
  errorMessage = "",
  actions = {},
  callbacks = {},
} = {}) {
  if (!open) return null;

  const {
    cancelLabel = "Cancel",
    confirmLabel = "Start Here",
    cancelDisabled = false,
    confirmDisabled = true,
  } = actions || {};

  const {
    onSelect = null,
    onCancel = null,
    onConfirm = null,
  } = callbacks || {};

  return (
    <section
      className="rounded-[var(--radius-lg)] border border-[var(--line-soft)] bg-[var(--surface-2)] p-4"
      aria-labelledby="story-start-opening-location-title"
    >
      <div className="flex items-center gap-2 text-[var(--gold-ornament)]">
        <MapPin size={15} aria-hidden="true" />
        <p
          id="story-start-opening-location-title"
          className="text-[var(--text-label)] uppercase leading-[var(--lh-label)] tracking-[var(--track-label)]"
        >
          {eyebrow}
        </p>
      </div>

      {description ? (
        <p className="mt-2 max-w-2xl text-[var(--text-ui)] leading-6 text-[var(--ink-dim)]">
          {description}
        </p>
      ) : null}

      {options.length ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {options.map((location) => {
            const selected =
              location.selected === true ||
              location.id === selectedLocationId;

            return (
              <button
                key={location.id}
                type="button"
                onClick={() => onSelect?.(location.id)}
                disabled={location.disabled === true}
                aria-pressed={location.ariaPressed ?? selected}
                className={`relative rounded-[var(--radius-md)] border px-4 py-3 text-left transition ${
                  selected
                    ? "border-[var(--gold-action)] bg-[var(--gold-action)]/10"
                    : "border-[var(--line-whisper)] bg-[var(--surface-1)] hover:border-[var(--line)]"
                } disabled:cursor-wait disabled:opacity-60`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--ink)]">
                      {location.title}
                    </p>

                    {location.subtitle ? (
                      <p className="mt-1 line-clamp-2 text-[var(--text-ui)] leading-5 text-[var(--ink-dim)]">
                        {location.subtitle}
                      </p>
                    ) : null}
                  </div>

                  {selected ? (
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--gold-action)]/45 bg-[var(--gold-action)]/10 text-[var(--gold-bright)]"
                      aria-hidden="true"
                    >
                      <Check size={13} />
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      ) : emptyState ? (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-4 py-3">
          <p className="font-medium text-[var(--ink)]">
            {emptyState.title}
          </p>
          <p className="mt-1 text-[var(--text-ui)] leading-5 text-[var(--ink-dim)]">
            {emptyState.message}
          </p>
        </div>
      ) : null}

      {errorMessage ? (
        <p
          className="mt-3 rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-3 py-2 text-xs text-[var(--status-danger)]"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={() => onCancel?.()}
          disabled={cancelDisabled}
          className="cf-btn cf-btn--secondary"
        >
          {cancelLabel}
        </button>

        <button
          type="button"
          onClick={() => onConfirm?.()}
          disabled={confirmDisabled}
          className="cf-btn cf-btn--primary"
        >
          {confirmLabel}
        </button>
      </div>
    </section>
  );
}
