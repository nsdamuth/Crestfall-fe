"use client";

import { useMemo, useState } from "react";
import { Activity, Search, X } from "lucide-react";

function MechanicsModuleCard({ item, onChooseModule }) {
  return (
    <button
      type="button"
      onClick={() => onChooseModule?.(item?.id)}
      className="group rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-3)] text-left transition hover:border-[var(--gold-ornament)]/55 hover:bg-[var(--gold-ornament)]/10"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 p-3 text-[var(--gold-ornament)]">
          <Activity size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            {item?.sourceLabel || "Mechanics Module"}
          </p>

          <h3 className="mt-2 font-display text-2xl text-[var(--ink)]">
            {item?.title || "Untitled Mechanics Module"}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--ink-dim)]">
            {item?.description || "Reusable runtime mechanics module."}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-xs leading-5 text-[var(--ink-dim)]">
        <p>
          Module ID:{" "}
          <span className="text-[var(--ink)]">
            {item?.moduleId || "core.trackers.v1"}
          </span>
        </p>

        <p>
          Trackers:{" "}
          <span className="text-[var(--ink)]">
            {Number.isFinite(item?.trackerCount) ? item.trackerCount : 0}
          </span>
          {" · "}
          Guards:{" "}
          <span className="text-[var(--ink)]">
            {Number.isFinite(item?.guardCount) ? item.guardCount : 0}
          </span>
          {" · "}
          Commands:{" "}
          <span className="text-[var(--ink)]">
            {Number.isFinite(item?.commandCount) ? item.commandCount : 0}
          </span>
        </p>

        <p>
          Status:{" "}
          <span className="text-[var(--ink)]">
            {item?.status || "DRAFT"}
          </span>
          {" · "}
          Visibility:{" "}
          <span className="text-[var(--ink)]">
            {item?.visibility || "PRIVATE"}
          </span>
        </p>
      </div>

      {item?.tags?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.slice(0, 6).map((tag) => (
            <span
              key={tag}
              className="inline-flex h-[var(--space-6)] items-center rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] font-medium uppercase tracking-[var(--track-label)] text-[var(--gold-bright)]"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  );
}

export default function MechanicsModulePickerModalView({
  eyebrow = "Mechanics Modules",
  title = "Attach Runtime Mechanics",
  description = "Choose a reusable Mechanics Module to attach.",
  sources = [],
  initialSourceId = "mine",
  loadStatus = "loaded",
  loadMessage = "",
  searchPlaceholder = "Search mechanics modules...",
  onClose = null,
  onChooseModule = null,
}) {
  const normalizedInitialSourceId = sources.some(
    (source) => source?.id === initialSourceId
  )
    ? initialSourceId
    : sources[0]?.id || "";
  const [activeSourceId, setActiveSourceId] = useState(
    normalizedInitialSourceId
  );
  const [query, setQuery] = useState("");

  const activeSource =
    sources.find((source) => source?.id === activeSourceId) || sources[0] || null;

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const items = Array.isArray(activeSource?.items) ? activeSource.items : [];

    if (!normalizedQuery) return items;

    return items.filter((item) =>
      [
        item?.title,
        item?.description,
        item?.moduleId,
        item?.status,
        item?.visibility,
        ...(Array.isArray(item?.tags) ? item.tags : []),
        ...(Array.isArray(item?.searchTerms) ? item.searchTerms : []),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery))
    );
  }, [activeSource, query]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim-strong)] p-4 backdrop-blur-[2px]">
      <div className="max-h-[88vh] w-full max-w-6xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-4)] shadow-[var(--shadow-modal)]">
        <div className="flex items-start justify-between gap-[var(--space-3)] border-b border-[var(--line-whisper)] px-[var(--space-4)] py-[var(--space-3)]">
          <div>
            <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
              {eyebrow}
            </p>

            <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] font-medium tracking-[var(--track-tight)]">{title}</h2>

            <p className="mt-[var(--space-2)] max-w-[44rem] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="flex h-[var(--control-md)] w-[var(--control-md)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/40 hover:text-[var(--ink)]"
            title="Close"
            aria-label="Close mechanics module picker"
          >
            <X size={18} />
          </button>
        </div>

        <div className="border-b border-white/10 p-6">
          <div className="flex flex-wrap gap-2">
            {sources.map((source) => {
              const active = source?.id === activeSource?.id;

              return (
                <button
                  key={source?.id}
                  type="button"
                  onClick={() => {
                    setActiveSourceId(source?.id || "");
                    setQuery("");
                  }}
                  className={`inline-flex min-h-[var(--control-sm)] items-center rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] transition ${
                    active
                      ? "border-[var(--gold-action)] bg-[var(--surface-1)] text-[var(--gold-bright)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                      : "border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
                  }`}
                >
                  {source?.label || "Modules"}
                </button>
              );
            })}
          </div>

          <label className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink-dim)]">
            <Search size={16} className="text-[var(--gold-ornament)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)]"
            />
          </label>
        </div>

        <div className="max-h-[54vh] overflow-y-auto p-6">
          {loadStatus === "loading" ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-5 text-sm text-[var(--ink-dim)]">
              Loading mechanics modules...
            </div>
          ) : null}

          {loadStatus === "error" ? (
            <div className="rounded-xl border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] p-5 text-sm text-[var(--status-danger)]">
              {loadMessage || "Mechanics modules could not be loaded."}
            </div>
          ) : null}

          {loadStatus === "loaded" && visibleItems.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleItems.map((item) => (
                <MechanicsModuleCard
                  key={item?.id}
                  item={item}
                  onChooseModule={onChooseModule}
                />
              ))}
            </div>
          ) : null}

          {loadStatus === "loaded" && !visibleItems.length ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-5 text-sm leading-6 text-[var(--ink-dim)]">
              {activeSource?.emptyMessage ||
                "No available mechanics modules found for this tab."}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
