"use client";

import {
  getDefaultPriorityOrder,
  movePriorityItem,
  normalizePriorityOrder,
} from "./priorityTriadEditorContract";

export default function PriorityTriadEditor({
  title,
  description,
  authorityNote,
  options = [],
  value = null,
  onChange = null,
  setLabel = "Set priorities",
  clearLabel = "Clear priorities",
}) {
  const normalizedOrder = normalizePriorityOrder(value, options);
  const optionByValue = new Map(
    options.map((option) => [option.value, option])
  );

  function setPriorities() {
    onChange?.(getDefaultPriorityOrder(options));
  }

  function move(index, delta) {
    if (!normalizedOrder) return;
    onChange?.(movePriorityItem(normalizedOrder, index, delta));
  }

  return (
    <div className="rounded-2xl border border-[var(--line-whisper)] bg-black/10 p-4 md:p-5">
      <div>
        <h3 className="font-display text-xl text-[var(--ink)]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
          {description}
        </p>
      </div>

      {!normalizedOrder ? (
        <div className="mt-4 rounded-xl border border-dashed border-[var(--line-whisper)] p-4">
          <p className="text-sm leading-6 text-[var(--ink-dim)]">
            No priority ordering is set. Current runtime behavior remains unchanged.
          </p>
          <button
            type="button"
            onClick={setPriorities}
            className="mt-3 rounded-lg border border-[var(--gold-ornament)]/40 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/10"
          >
            {setLabel}
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {normalizedOrder.map((priority, index) => {
            const option = optionByValue.get(priority);
            return (
              <div
                key={priority}
                className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-[var(--line-whisper)] bg-black/15 p-3"
              >
                <div className="font-display text-xl text-[var(--gold-ornament)]">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[var(--ink)]">
                    {option?.label || priority}
                  </div>
                  <div className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
                    {option?.description || ""}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    aria-label={`Move ${priority} up`}
                    className="rounded-md border border-[var(--line-whisper)] px-2 py-1 text-sm text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={index === normalizedOrder.length - 1}
                    onClick={() => move(index, 1)}
                    aria-label={`Move ${priority} down`}
                    className="rounded-md border border-[var(--line-whisper)] px-2 py-1 text-sm text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ↓
                  </button>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => onChange?.(null)}
            className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink-dim)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
          >
            {clearLabel}
          </button>
        </div>
      )}

      {authorityNote ? (
        <p className="mt-4 border-t border-[var(--line-whisper)] pt-3 text-xs leading-5 text-[var(--ink-dim)]">
          {authorityNote}
        </p>
      ) : null}
    </div>
  );
}
