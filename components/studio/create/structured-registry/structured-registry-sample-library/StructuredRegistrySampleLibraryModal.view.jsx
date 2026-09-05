"use client";

import { BookOpen, Check, LibraryBig, Search } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";
import CrestfallSelect from "@/components/ui/CrestfallSelect";

const EYEBROW_CLASS =
  "flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]";

export default function StructuredRegistrySampleLibraryModalView({
  title,
  description,
  query = "",
  category = "ALL",
  categoryOptions = [],
  samples = [],
  selectedSampleId = "",
  selectedSample = null,
  statusMessage = "",
  canApply = false,
  onClose = null,
  onChangeQuery = null,
  onChooseCategory = null,
  onChooseSample = null,
  onApplySample = null,
}) {
  return (
    <KitModalFrame
      variant="modal"
      onClose={onClose}
      ariaLabel={title}
      panelClassName="w-full max-w-4xl"
    >
      <div className="sticky top-0 z-[1] border-b border-[var(--line-whisper)] bg-[image:var(--grad-panel-lift)] px-[var(--space-4)] py-[var(--space-3)]">
        <p className={EYEBROW_CLASS}>
          <LibraryBig size={15} />
          Loom Sample Workflow
        </p>
        <h2 className="mt-2 font-display text-[length:var(--text-heading)] leading-[var(--lh-heading)]">
          {title}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
          {description}
        </p>
      </div>

      <div className="grid gap-4 p-5 xl:grid-cols-[21rem_minmax(0,1fr)]">
        <aside className="grid content-start gap-3">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
              Search samples
            </span>
            <span className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/35 px-3 py-2.5">
              <Search size={14} className="shrink-0 text-[var(--gold-ornament)]" />
              <input
                value={query}
                onChange={(event) => onChangeQuery?.(event.target.value)}
                placeholder="Search by task or pattern..."
                className="min-w-0 flex-1 bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)]"
              />
            </span>
          </label>

          <CrestfallSelect
            label="Sample type"
            value={category}
            options={categoryOptions}
            onChange={onChooseCategory}
          />

          <div className="grid gap-2 pt-1">
            {samples.length ? (
              samples.map((sample) => {
                const selected = sample.id === selectedSampleId;
                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => onChooseSample?.(sample.id)}
                    className={`rounded-[var(--radius-sm)] border px-3 py-3 text-left transition ${
                      selected
                        ? "border-[var(--gold-action)] bg-[var(--surface-1)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                        : "border-[var(--line-whisper)] bg-[var(--surface-1)] hover:border-[var(--line)]"
                    }`}
                  >
                    <p className="text-sm text-[var(--ink)]">{sample.label}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[var(--gold-ornament)]">
                      {sample.category}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[var(--ink-dim)]">
                      {sample.summary}
                    </p>
                  </button>
                );
              })
            ) : (
              <div className="rounded-xl border border-white/10 bg-black/25 p-4 text-xs leading-5 text-[var(--ink-dim)]">
                No samples match the current search.
              </div>
            )}
          </div>
        </aside>

        <section className="min-w-0 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-5">
          {selectedSample ? (
            <>
              <p className={EYEBROW_CLASS}>
                <BookOpen size={14} />
                Educational Sample
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <h3 className="font-display text-3xl text-[var(--ink)]">
                  {selectedSample.label}
                </h3>
                <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
                  {selectedSample.category}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--ink-dim)]">
                {selectedSample.summary}
              </p>

              <div className="mt-5 rounded-xl border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                  What this sample demonstrates
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(selectedSample.demonstrates || []).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-[var(--ink-dim)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                  Entry preview
                </p>
                <pre className="mt-3 max-h-[42vh] overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/55 p-4 font-mono text-xs leading-6 text-[var(--ink-dim)]">
                  {JSON.stringify(selectedSample.entry, null, 2)}
                </pre>
              </div>
            </>
          ) : (
            <div className="grid min-h-[28rem] place-items-center text-center">
              <div className="max-w-md">
                <LibraryBig size={28} className="mx-auto text-[var(--gold-ornament)]" />
                <h3 className="mt-4 font-display text-2xl">Choose a sample</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
                  Samples are intentionally generic and incomplete. Load one to inspect a useful registry-entry shape, then replace it with your own world content.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line-whisper)] bg-[image:var(--grad-panel-lift)] p-5">
        <p className="text-xs leading-5 text-[var(--ink-dim)]">
          Loading adds a fresh copy to the open builder only. It does not save, link shared assets, or create runtime authority.
          {statusMessage ? ` ${statusMessage}` : ""}
        </p>
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" onClick={() => onClose?.()} className="cf-btn cf-btn--secondary">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onApplySample?.()}
            disabled={!canApply}
            className="cf-btn cf-btn--primary"
          >
            <Check size={14} />
            Load sample
          </button>
        </div>
      </div>
    </KitModalFrame>
  );
}
