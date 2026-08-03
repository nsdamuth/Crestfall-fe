"use client";

import { useMemo, useState } from "react";
import { Activity, Search, X } from "lucide-react";

function MechanicsModuleCard({ item, onChooseModule }) {
  return (
    <button
      type="button"
      onClick={() => onChooseModule?.(item?.id)}
      className="group rounded-2xl border border-white/10 bg-black/35 p-5 text-left transition hover:border-[var(--muted-gold)]/55 hover:bg-[var(--muted-gold)]/10"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 p-3 text-[var(--muted-gold)]">
          <Activity size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            {item?.sourceLabel || "Mechanics Module"}
          </p>

          <h3 className="mt-2 font-display text-2xl text-[var(--foreground)]">
            {item?.title || "Untitled Mechanics Module"}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
            {item?.description || "Reusable runtime mechanics module."}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-xs leading-5 text-[var(--muted)]">
        <p>
          Module ID:{" "}
          <span className="text-[var(--foreground)]">
            {item?.moduleId || "core.trackers.v1"}
          </span>
        </p>

        <p>
          Trackers:{" "}
          <span className="text-[var(--foreground)]">
            {Number.isFinite(item?.trackerCount) ? item.trackerCount : 0}
          </span>
          {" · "}
          Guards:{" "}
          <span className="text-[var(--foreground)]">
            {Number.isFinite(item?.guardCount) ? item.guardCount : 0}
          </span>
          {" · "}
          Commands:{" "}
          <span className="text-[var(--foreground)]">
            {Number.isFinite(item?.commandCount) ? item.commandCount : 0}
          </span>
        </p>

        <p>
          Status:{" "}
          <span className="text-[var(--foreground)]">
            {item?.status || "DRAFT"}
          </span>
          {" · "}
          Visibility:{" "}
          <span className="text-[var(--foreground)]">
            {item?.visibility || "PRIVATE"}
          </span>
        </p>
      </div>

      {item?.tags?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.slice(0, 6).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[0.65rem] uppercase tracking-[0.15em] text-[var(--muted)]"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-[var(--muted-gold)]/25 bg-black shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
              {eyebrow}
            </p>

            <h2 className="mt-2 font-display text-4xl">{title}</h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              {description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-xl border border-white/10 bg-black/40 p-3 text-[var(--muted)] transition hover:border-[var(--muted-gold)]/40 hover:text-[var(--foreground)]"
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
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
                    active
                      ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                      : "border-white/10 bg-black/25 text-[var(--muted)] hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
                  }`}
                >
                  {source?.label || "Modules"}
                </button>
              );
            })}
          </div>

          <label className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--muted)]">
            <Search size={16} className="text-[var(--muted-gold)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
            />
          </label>
        </div>

        <div className="max-h-[54vh] overflow-y-auto p-6">
          {loadStatus === "loading" ? (
            <div className="rounded-xl border border-white/10 bg-black/20 p-5 text-sm text-[var(--muted)]">
              Loading mechanics modules...
            </div>
          ) : null}

          {loadStatus === "error" ? (
            <div className="rounded-xl border border-red-300/20 bg-red-500/10 p-5 text-sm text-red-100">
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
            <div className="rounded-xl border border-white/10 bg-black/20 p-5 text-sm leading-6 text-[var(--muted)]">
              {activeSource?.emptyMessage ||
                "No available mechanics modules found for this tab."}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
