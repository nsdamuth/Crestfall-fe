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
        className="w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-left text-sm transition hover:border-[var(--muted-gold)]/35 focus:border-[var(--muted-gold)]/50"
      >
        <span className="block text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
          {triggerLabel}
        </span>
        <span className="mt-1 block text-[var(--foreground)]">
          {selectedLabel}
        </span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-4xl rounded-2xl border border-[var(--muted-gold)]/25 bg-[#080706] p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-3xl">{title}</h2>

              <button
                type="button"
                onClick={() => onClose?.()}
                className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-black/45 px-4 py-3">
              <Search size={16} className="text-[var(--muted-gold)]" />
              <input
                value={searchQuery}
                onChange={(event) => onSearchQueryChange?.(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
              />
            </div>

            {safeGroups.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {safeGroups.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => onChooseGroup?.(group)}
                    className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
                      activeGroup === group
                        ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                        : "border-white/10 bg-black/30 text-[var(--muted)] hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            ) : null}

            {customMode ? (
              <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
                  {customEyebrow}
                </p>

                <input
                  value={customValue}
                  onChange={(event) => onCustomValueChange?.(event.target.value)}
                  placeholder={customPlaceholder}
                  className="mt-3 w-full rounded-xl border border-white/10 bg-black/45 px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--muted-gold)]/50"
                />

                <div className="mt-4 flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onBackFromCustom?.()}
                    className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={() => onUseCustom?.()}
                    className="rounded-xl border border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/15 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-gold)]"
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
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                      option?.selected
                        ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                        : "border-white/10 bg-black/30 text-[var(--muted)] hover:border-[var(--muted-gold)]/30 hover:bg-[var(--muted-gold)]/10 hover:text-[var(--foreground)]"
                    }`}
                  >
                    {option?.icon ? (
                      <span className="mr-2">{option.icon}</span>
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
