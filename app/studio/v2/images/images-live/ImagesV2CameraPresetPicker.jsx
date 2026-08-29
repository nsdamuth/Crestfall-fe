"use client";

import { useMemo, useState } from "react";
import { Camera, Check, Search } from "lucide-react";

import KitModalFrame from "@/components/kit/KitModalFrame";

function CameraOption({ option, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(option.value)}
      aria-pressed={option.selected}
      className={`group flex min-h-[var(--control-lg)] w-full items-start justify-between gap-[var(--space-3)] rounded-[var(--radius-md)] border px-[var(--space-4)] py-[var(--space-3)] text-left transition-colors duration-[var(--dur-hover)] ${
        option.selected
          ? "border-[var(--gold-ornament)]/55 bg-[var(--fill)]"
          : "border-[var(--line-whisper)] bg-[var(--surface-1)] hover:border-[var(--line)] hover:bg-[var(--state-hover-fill)] active:bg-[var(--state-pressed-fill)]"
      }`}
    >
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-[length:var(--text-ui)] leading-[var(--lh-ui)] ${option.selected ? "text-[var(--gold-bright)]" : "text-[var(--ink)]"}`}>
          {option.label}
        </span>
        <span className="mt-[var(--space-1)] block line-clamp-2 text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
          {option.description}
        </span>
      </span>
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-[var(--control-sm)] w-[var(--control-sm)] flex-none items-center justify-center rounded-[var(--radius-full)] border ${
          option.selected
            ? "border-[var(--gold-ornament)] bg-[var(--gold-ornament)] text-[var(--surface-1)]"
            : "border-[var(--line-whisper)] text-transparent group-hover:border-[var(--line)]"
        }`}
      >
        <Check size={14} />
      </span>
    </button>
  );
}

export default function ImagesV2CameraPresetPicker({
  autoOption = null,
  groups = [],
  onSelect = null,
  onClose = null,
}) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const visibleAutoOption = useMemo(() => {
    if (!autoOption) return null;
    if (!normalizedQuery) return autoOption;
    const haystack = `${autoOption.label} ${autoOption.description}`.toLowerCase();
    return haystack.includes(normalizedQuery) ? autoOption : null;
  }, [autoOption, normalizedQuery]);

  const visibleGroups = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          options: group.options.filter((option) => {
            if (!normalizedQuery) return true;
            return `${option.label} ${option.description} ${group.label}`
              .toLowerCase()
              .includes(normalizedQuery);
          }),
        }))
        .filter((group) => group.options.length > 0),
    [groups, normalizedQuery]
  );

  const hasResults = Boolean(visibleAutoOption || visibleGroups.length);

  function select(value) {
    onSelect?.(value);
    onClose?.();
  }

  return (
    <KitModalFrame
      variant="modal"
      panelClassName="min-[700px]:w-[min(58rem,calc(100vw-2rem))]"
      onClose={onClose}
      ariaLabel="Choose camera treatment"
    >
      <div className="p-[var(--space-5)] pt-[var(--space-8)] min-[700px]:p-[var(--space-6)]">
        <div className="pr-[var(--space-10)]">
          <p className="inline-flex items-center gap-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            <Camera size={15} aria-hidden="true" /> Camera / Framing
          </p>
          <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] text-[var(--ink)]">
            Choose camera treatment
          </h2>
          <p className="mt-[var(--space-2)] max-w-3xl text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            Pick one framing, angle, movement, lens, focus, lighting, or specialized treatment. Auto leaves camera direction to the image model.
          </p>
        </div>

        <label className="relative mt-[var(--space-5)] block">
          <span className="sr-only">Search camera presets</span>
          <Search
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-[var(--space-4)] top-1/2 -translate-y-1/2 text-[var(--ink-faint)]"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search camera presets..."
            className="min-h-[var(--control-md)] w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] pl-11 pr-[var(--space-4)] text-[length:var(--text-ui)] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-faint)] focus:border-[var(--line)]"
          />
        </label>

        <div className="mt-[var(--space-5)] max-h-[min(64dvh,46rem)] overflow-y-auto pr-[var(--space-1)]">
          {visibleAutoOption ? (
            <section>
              <h3 className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                Automatic
              </h3>
              <div className="mt-[var(--space-3)]">
                <CameraOption option={visibleAutoOption} onSelect={select} />
              </div>
            </section>
          ) : null}

          {visibleGroups.length ? (
            <div className={`${visibleAutoOption ? "mt-[var(--space-6)]" : ""} space-y-[var(--space-6)]`}>
              {visibleGroups.map((group) => (
                <section key={group.id}>
                  <h3 className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                    {group.label}
                  </h3>
                  <div className="mt-[var(--space-3)] grid gap-[var(--space-2)] min-[760px]:grid-cols-2">
                    {group.options.map((option) => (
                      <CameraOption key={option.value} option={option} onSelect={select} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : null}

          {!hasResults ? (
            <p className="rounded-[var(--radius-md)] border border-dashed border-[var(--line-whisper)] px-[var(--space-4)] py-[var(--space-8)] text-center text-[length:var(--text-body)] text-[var(--ink-dim)]">
              No camera presets match this search.
            </p>
          ) : null}
        </div>
      </div>
    </KitModalFrame>
  );
}
