"use client";

import { Check, Coins, Send, X } from "lucide-react";

export default function AssignPublishDrawerView({
  open = false,
  title = "Assign and Publish",
  resultTone = "",
  resultLabel = "Result image",
  targetTypes = [],
  selectedTargetTypeId = "",
  targets = [],
  selectedTargetId = "",
  visibilityOptions = [],
  selectedVisibilityId = "",
  keyImageLabel = "Set as key reference image",
  coinsLine = "",
  coinBalanceLabel = "0",
  canPublish = false,
  helpText = "",
  publishLabel = "Assign and publish",
  onClose = null,
  onChangeTargetType = null,
  onSelectTarget = null,
  onChangeVisibility = null,
  onPublish = null,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-stretch sm:justify-end">
      <button
        type="button"
        aria-label="Close drawer"
        onClick={() => onClose?.()}
        className="absolute inset-0 bg-[var(--scrim-strong)]"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="assign-publish-title"
        className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[var(--radius-lg)] border border-[var(--line-strong)] bg-[var(--surface-4)] shadow-[var(--shadow-modal)] sm:h-full sm:max-h-none sm:w-[440px] sm:rounded-none sm:border-y-0 sm:border-r-0"
      >
        <header className="flex items-start justify-between gap-3 border-b border-[var(--line)] p-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
              Assign and Publish
            </p>
            <h2 id="assign-publish-title" className="mt-1 font-display text-2xl text-[var(--ink)]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onClose?.()}
            aria-label="Close"
            className="rounded-full border border-[var(--line)] p-1.5 text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
          >
            <X size={14} />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          <div className="flex items-center gap-3">
            <span
              className="block h-16 w-16 shrink-0 rounded-[var(--radius-sm)] border border-[var(--line)]"
              style={{ background: resultTone }}
              role="img"
              aria-label={resultLabel}
            />
            <div className="text-sm">
              <p className="text-[var(--ink)]">{resultLabel}</p>
              <p className="text-xs text-[var(--ink-dim)]">{keyImageLabel}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-[var(--ink-dim)]">Assign to</p>
            <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Target type">
              {targetTypes.map((type) => {
                const Icon = type.Icon;
                const isActive = type.id === selectedTargetTypeId;
                return (
                  <button
                    key={type.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => onChangeTargetType?.(type.id)}
                    className={`flex items-center gap-1.5 rounded-[var(--radius-full)] border px-3 py-1.5 text-xs transition ${
                      isActive
                        ? "border-[var(--gold-ornament)]/45 bg-[var(--gold-ornament)]/10 text-[var(--ink)]"
                        : "border-[var(--line)] text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
                    }`}
                  >
                    {Icon ? <Icon size={13} aria-hidden="true" /> : null}
                    {type.label}
                  </button>
                );
              })}
            </div>

            {targets.length ? (
              <ul className="mt-3 space-y-2">
                {targets.map((target) => {
                  const isSelected = target.id === selectedTargetId;
                  return (
                    <li key={target.id}>
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => onSelectTarget?.(target.id)}
                        className={`flex w-full items-center justify-between gap-3 rounded-[var(--radius-sm)] border px-3 py-2 text-left transition ${
                          isSelected
                            ? "border-[var(--gold-action)] bg-[var(--gold-ornament)]/10"
                            : "border-[var(--line)] bg-[var(--surface-2)] hover:border-[var(--gold-ornament)]/35"
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm text-[var(--ink)]">{target.title}</span>
                          <span className="block text-xs text-[var(--ink-dim)]">{target.subtitle}</span>
                        </span>
                        {isSelected ? (
                          <Check size={14} className="shrink-0 text-[var(--gold-action)]" aria-hidden="true" />
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-3 rounded-[var(--radius-sm)] border border-dashed border-[var(--line)] p-3 text-xs text-[var(--ink-dim)]">
                No assets of this type yet.
              </p>
            )}
          </div>

          <div>
            <p className="text-xs text-[var(--ink-dim)]">Visibility</p>
            <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Visibility">
              {visibilityOptions.map((option) => {
                const isActive = option.id === selectedVisibilityId;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => onChangeVisibility?.(option.id)}
                    className={`rounded-[var(--radius-sm)] border p-3 text-left transition ${
                      isActive
                        ? "border-[var(--gold-ornament)]/45 bg-[var(--gold-ornament)]/10"
                        : "border-[var(--line)] bg-[var(--surface-2)] hover:border-[var(--gold-ornament)]/35"
                    }`}
                  >
                    <span className="block text-sm text-[var(--ink)]">{option.label}</span>
                    <span className="mt-0.5 block text-[11px] leading-4 text-[var(--ink-dim)]">
                      {option.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {helpText ? (
            <p className="text-xs leading-5 text-[var(--status-warning-text)]">{helpText}</p>
          ) : null}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] p-4">
          <p className="flex items-center gap-1.5 text-xs text-[var(--ink-dim)]">
            <Coins size={13} aria-hidden="true" />
            <span>{coinsLine || `Balance ${coinBalanceLabel}.`}</span>
          </p>
          <button
            type="button"
            disabled={!canPublish}
            onClick={() => onPublish?.()}
            className="cf-btn cf-btn--primary"
          >
            <Send size={14} aria-hidden="true" />
            {publishLabel}
          </button>
        </footer>
      </aside>
    </div>
  );
}
