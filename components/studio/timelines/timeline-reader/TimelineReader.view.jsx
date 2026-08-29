"use client";

import { ArrowLeft, CalendarDays, Edit3, Globe2, LockKeyhole } from "lucide-react";

function TimelineEntryCard({ entry, side = "left" }) {
  return (
    <article
      className={`min-w-0 rounded-[var(--radius-md)] border p-5 sm:p-6 ${
        entry.isUnavailable
          ? "border-amber-300/20 bg-amber-300/5"
          : "border-[var(--gold-ornament)]/20 bg-black/35"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.17em] text-[var(--gold-ornament)]">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={12} aria-hidden="true" /> {entry.chronologyLabel}
        </span>
        {entry.era && entry.displayDate ? (
          <>
            <span className="text-[var(--ink-faint)]">•</span>
            <span>{entry.era}</span>
          </>
        ) : null}
      </div>

      <h3 className="mt-3 break-words font-display text-2xl text-[var(--ink)] sm:text-3xl">
        {entry.title}
      </h3>
      {entry.subtitle ? (
        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--ink-faint)]">
          {entry.subtitle}
        </p>
      ) : null}
      {entry.description ? (
        <p className="mt-3 line-clamp-4 text-sm leading-6 text-[var(--ink-dim)]">
          {entry.description}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
        {entry.visibility ? <span>{entry.visibility}</span> : null}
        {entry.status ? <span>• {entry.status}</span> : null}
        {entry.orderOverride !== null ? <span>• Timeline override {entry.orderOverride}</span> : null}
      </div>

      {entry.isUnavailable ? (
        <p className="mt-4 text-xs leading-5 text-amber-100/80">
          This referenced Lore asset is no longer available to this Timeline owner.
        </p>
      ) : null}
      <span className="sr-only">Timeline card positioned on the {side} side.</span>
    </article>
  );
}

function EraGroup({ group, startIndex = 0 }) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
          {group.label}
        </span>
        <span className="h-px min-w-8 flex-1 bg-[image:var(--grad-rule)] opacity-70" />
      </div>

      <div className="relative space-y-4 md:space-y-8">
        <div
          className="absolute bottom-0 left-[11px] top-0 w-px bg-[var(--gold-ornament)]/25 md:left-1/2"
          aria-hidden="true"
        />
        {group.entries.map((entry, localIndex) => {
          const index = startIndex + localIndex;
          const left = index % 2 === 0;
          return (
            <div
              key={entry.id}
              className="relative grid min-w-0 gap-4 pl-8 md:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] md:gap-5 md:pl-0"
            >
              <span
                className="absolute left-[5px] top-7 h-3.5 w-3.5 rounded-full border border-[var(--gold-ornament)]/70 bg-[var(--surface-0)] md:left-1/2 md:-translate-x-1/2"
                aria-hidden="true"
              />
              {left ? (
                <>
                  <TimelineEntryCard entry={entry} side="left" />
                  <div aria-hidden="true" />
                  <div aria-hidden="true" />
                </>
              ) : (
                <>
                  <div aria-hidden="true" />
                  <div aria-hidden="true" />
                  <TimelineEntryCard entry={entry} side="right" />
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function TimelineReaderView({
  loadStatus = "loading",
  loadMessage = "",
  title = "Untitled Timeline",
  description = "",
  publicEnabled = false,
  sortDirection = "ASC",
  entryCount = 0,
  groups = [],
  showEditAction = true,
  onBack = null,
  onEdit = null,
}) {
  if (loadStatus === "loading") {
    return (
      <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/35 p-8 text-sm text-[var(--ink-dim)]">
        Loading Timeline…
      </div>
    );
  }

  if (loadStatus === "error") {
    return (
      <div className="rounded-[var(--radius-md)] border border-red-300/20 bg-red-300/5 p-6">
        <p className="text-sm text-red-100">{loadMessage || "Timeline could not be loaded."}</p>
        <button type="button" onClick={() => onBack?.()} className="cf-btn mt-4">
          <ArrowLeft size={14} /> Back to Lore
        </button>
      </div>
    );
  }

  let offset = 0;

  return (
    <div className="mx-auto w-full max-w-[112rem] pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => onBack?.()} className="cf-btn">
          <ArrowLeft size={14} /> Back to Lore
        </button>
        {showEditAction ? (
          <button type="button" onClick={() => onEdit?.()} className="cf-btn cf-btn--primary">
            <Edit3 size={14} /> Edit Timeline
          </button>
        ) : null}
      </div>

      <header className="mt-6 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/40 px-6 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
          <span className="inline-flex items-center gap-1.5">
            {publicEnabled ? <Globe2 size={12} /> : <LockKeyhole size={12} />}
            {publicEnabled ? "Public Timeline" : "Internal Timeline"}
          </span>
          <span className="text-[var(--ink-faint)]">•</span>
          <span>{entryCount} Lore</span>
          <span className="text-[var(--ink-faint)]">•</span>
          <span>{sortDirection === "DESC" ? "Newest → oldest" : "Oldest → newest"}</span>
        </div>
        <h1 className="mt-4 break-words font-display text-4xl text-[var(--ink)] sm:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[var(--ink-dim)] sm:text-base">
            {description}
          </p>
        ) : null}
      </header>

      {groups.length ? (
        <div className="mt-8 space-y-10 sm:mt-10 sm:space-y-14">
          {groups.map((group) => {
            const groupOffset = offset;
            offset += group.entries.length;
            return <EraGroup key={group.id} group={group} startIndex={groupOffset} />;
          })}
        </div>
      ) : (
        <div className="mt-8 rounded-[var(--radius-md)] border border-dashed border-white/15 bg-black/20 px-6 py-14 text-center">
          <p className="font-display text-2xl text-[var(--ink)]">This Timeline has no Lore yet.</p>
          <p className="mt-2 text-sm text-[var(--ink-dim)]">Use Edit Timeline to add Lore assets and build its chronology.</p>
        </div>
      )}
    </div>
  );
}
