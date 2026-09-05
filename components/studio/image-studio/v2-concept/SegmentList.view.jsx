"use client";

import { Check, Scan } from "lucide-react";

export default function SegmentListView({
  title = "Detected segments",
  helpText = "",
  segments = [],
  selectedSegmentId = "",
  emptyTitle = "No segments yet",
  emptyText = "Generate or open an image to detect editable regions.",
  onSelectSegment = null,
  onRedetect = null,
  redetectLabel = "Detect again",
}) {
  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
            Edit
          </p>
          <h3 className="mt-1 font-display text-xl text-[var(--ink)]">{title}</h3>
          {helpText ? (
            <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">{helpText}</p>
          ) : null}
        </div>
        {onRedetect ? (
          <button
            type="button"
            onClick={() => onRedetect?.()}
            className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
          >
            <Scan size={13} aria-hidden="true" />
            {redetectLabel}
          </button>
        ) : null}
      </div>

      {segments.length ? (
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {segments.map((segment) => {
            const isSelected = segment.id === selectedSegmentId;
            return (
              <li key={segment.id}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelectSegment?.(segment.id)}
                  className={`group flex w-full flex-col overflow-hidden rounded-[var(--radius-sm)] border text-left transition ${
                    isSelected
                      ? "border-[var(--gold-action)] bg-[var(--gold-ornament)]/10"
                      : "border-[var(--line)] bg-[var(--surface-1)] hover:border-[var(--gold-ornament)]/35"
                  }`}
                >
                  <span
                    className="relative block aspect-[4/3] w-full"
                    style={{ background: segment.thumbnailTone }}
                    aria-hidden="true"
                  >
                    <span
                      className="absolute inset-3 rounded-[var(--radius-xs)] border border-dashed border-[var(--ink)]/50"
                      style={segment.regionInset ? { inset: segment.regionInset } : undefined}
                    />
                    {isSelected ? (
                      <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--gold-action)] text-[var(--surface-1)]">
                        <Check size={12} />
                      </span>
                    ) : null}
                  </span>
                  <span className="block px-2.5 py-2">
                    <span className="block text-sm leading-5 text-[var(--ink)]">
                      {segment.label}
                    </span>
                    {segment.detail ? (
                      <span className="block text-[11px] leading-4 text-[var(--ink-dim)]">
                        {segment.detail}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-4 rounded-[var(--radius-sm)] border border-dashed border-[var(--line)] p-5 text-center">
          <p className="text-sm text-[var(--ink)]">{emptyTitle}</p>
          <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">{emptyText}</p>
        </div>
      )}
    </section>
  );
}
