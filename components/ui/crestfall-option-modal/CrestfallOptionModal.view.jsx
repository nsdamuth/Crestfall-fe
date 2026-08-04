"use client";

import { Search, X } from "lucide-react";

function getColumnClass(columns) {
  if (columns === 4) return "md:grid-cols-4";
  if (columns === 2) return "md:grid-cols-2";
  return "md:grid-cols-3";
}

export default function CrestfallOptionModalView({
  open = false,
  title = "Select Option",
  triggerLabel = "Option",
  selectedLabel = "Not chosen",
  searchQuery = "",
  searchPlaceholder = "Search options...",
  groups = [],
  activeGroup = null,
  customMode = false,
  customEyebrow = "Custom Role Archetype",
  customValue = "",
  customPlaceholder = "Type a custom role...",
  options = [],
  columns = 3,
  onOpen = null,
  onClose = null,
  onSearchQueryChange = null,
  onChooseGroup = null,
  onChooseOption = null,
  onCustomValueChange = null,
  onBackFromCustom = null,
  onUseCustom = null,
}) {
  const safeGroups = Array.isArray(groups) ? groups : [];
  const safeOptions = Array.isArray(options) ? options : [];
  const columnClass = getColumnClass(columns);

  return (
    <div>
      <button
        type="button"
        onClick={() => onOpen?.()}
        className="w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-3)] text-left transition hover:border-[var(--line)] focus:border-[var(--gold-action)]"
      >
        <span className="block text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
          {triggerLabel}
        </span>
        <span className="mt-1 block text-[length:var(--text-ui)] text-[var(--ink)]">
          {selectedLabel}
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--scrim-strong)] backdrop-blur-[2px] md:items-center md:p-4">
          <div className="w-full max-w-4xl rounded-t-[var(--radius-lg)] border border-b-0 border-[var(--line)] bg-[var(--surface-4)] p-5 shadow-[var(--shadow-modal)] md:rounded-[var(--radius-lg)] md:border-b">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-[length:var(--text-title)] leading-[var(--lh-title)] tabular-nums">
                {title}
              </h2>

              <button
                type="button"
                onClick={() => onClose?.()}
                className="flex h-[var(--control-md)] w-[var(--control-md)] flex-shrink-0 items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--gold-action)]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 flex min-h-[var(--control-md)] items-center gap-3 rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)]">
              <Search size={16} className="text-[var(--gold-ornament)]" />
              <input
                value={searchQuery}
                onChange={(event) => onSearchQueryChange?.(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-[length:var(--text-body)] text-[var(--ink)] outline-none placeholder:text-[var(--ink-faint)]"
              />
            </div>

            {safeGroups.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {safeGroups.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => onChooseGroup?.(group)}
                    className={`min-h-[var(--control-sm)] rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition ${
                      activeGroup === group
                        ? "border-[var(--gold-action)] text-[var(--gold-bright)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                        : "border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            ) : null}

            {customMode ? (
              <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-4)]">
                <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
                  {customEyebrow}
                </p>

                <input
                  value={customValue}
                  onChange={(event) => onCustomValueChange?.(event.target.value)}
                  placeholder={customPlaceholder}
                  className="mt-3 w-full min-h-[var(--control-md)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] text-[length:var(--text-ui)] text-[var(--ink)] outline-none focus:border-[var(--gold-action)]"
                />

                <div className="mt-4 flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onBackFromCustom?.()}
                    className="inline-flex h-[var(--control-md)] items-center justify-center rounded-[var(--radius-md)] border border-[var(--line-strong)] px-[var(--space-6)] text-[length:var(--text-cta)] leading-[var(--lh-cta)] font-bold text-[var(--gold-action)] transition hover:shadow-[var(--glow-hover)]"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={() => onUseCustom?.()}
                    className="inline-flex h-[var(--control-md)] items-center justify-center rounded-[var(--radius-md)] bg-[var(--gold-action)] bg-[image:var(--grad-gold)] px-[var(--space-6)] text-[length:var(--text-cta)] leading-[var(--lh-cta)] font-bold text-[var(--tag-fill-ink)] transition hover:shadow-[var(--glow-hover)]"
                  >
                    Use Custom
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`mt-5 grid max-h-[60vh] gap-2 overflow-y-auto pr-1 ${columnClass}`}
              >
                {safeOptions.map((option) => (
                  <button
                    key={option?.key || option?.id || option?.label}
                    type="button"
                    onClick={() => onChooseOption?.(option?.id ?? "")}
                    className={`rounded-[var(--radius-md)] border px-[var(--space-4)] py-[var(--space-3)] text-left text-[length:var(--text-ui)] transition ${
                      option?.selected
                        ? "border-[var(--gold-action)] bg-[var(--surface-1)] text-[var(--gold-bright)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                        : "border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {option?.icon ? (
                      <svg
                        className="mr-2 inline-block h-[var(--icon-sm)] w-[var(--icon-sm)] align-[-3px]"
                        aria-hidden="true"
                      >
                        <use href={`/assets/icons/icons-v7.svg#${option.icon}`} />
                      </svg>
                    ) : null}
                    {option?.label || "Untitled Option"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
