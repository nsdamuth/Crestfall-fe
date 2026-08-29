"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

const EYEBROW_CLASS =
  "text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]";

function ConfiguredSurface({ surface, placement }) {
  return (
    <section
      className={
        placement === "TOP"
          ? "border-b border-[var(--line-fade)] bg-[var(--surface-2)]/75 px-[var(--space-5)] py-3"
          : "border-t border-[var(--line-fade)] bg-[var(--surface-2)]/80 px-[var(--space-5)] py-3"
      }
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {surface.title ? (
          <p className={`${EYEBROW_CLASS} shrink-0`}>{surface.title}</p>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2">
          {surface.readouts.map((readout) => (
            <div
              key={readout.id}
              className="flex min-w-0 items-baseline gap-2 text-xs"
            >
              <span className="uppercase tracking-[0.16em] text-[var(--gold-ornament)]/85">
                {readout.label}
              </span>
              <span className="truncate text-[var(--ink-dim)]">
                {readout.displayValue}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ActorMechanicsSurface({ surface, onToggle }) {
  return (
    <section className="border-t border-[var(--gold-ornament)]/25 bg-[var(--surface-2)] px-4 py-3 sm:px-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2 border-b border-[var(--line-fade)] pb-2.5">
        <div className="min-w-0">
          <p className="truncate font-display text-base uppercase tracking-[0.08em] text-[var(--gold-ornament)] sm:text-lg">
            {surface.actorTitle}
          </p>
        </div>

        {surface.progression.length ? (
          <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.14em] sm:text-xs">
            {surface.progression.map((readout, index) => (
              <span key={readout.id} className="whitespace-nowrap text-[var(--gold-ornament)]/90">
                {index ? <span className="mr-3 text-[var(--ink-dim)]/35">·</span> : null}
                {readout.label} <strong className="font-semibold text-[var(--ink)]">{readout.displayValue}</strong>
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {surface.pools.length ? (
        <div className="flex flex-wrap gap-x-7 gap-y-1 border-b border-[var(--line-fade)] py-2 text-xs sm:text-sm">
          {surface.pools.map((readout) => (
            <span key={readout.id} className="whitespace-nowrap">
              <span className="mr-2 uppercase tracking-[0.08em] text-[var(--gold-ornament)]">
                {readout.label}
              </span>
              <strong className="font-semibold text-[var(--ink)]">
                {readout.displayValue}
              </strong>
            </span>
          ))}
        </div>
      ) : null}

      {surface.primaryStats.length ? (
        <div className="grid grid-cols-4 gap-x-4 gap-y-1.5 py-2 text-[11px] sm:grid-cols-6 lg:grid-cols-11">
          {surface.primaryStats.map((readout) => (
            <div key={readout.id} className="min-w-0 whitespace-nowrap" title={readout.label}>
              <span className="mr-1.5 text-[var(--gold-ornament)]">{readout.shortLabel}</span>
              <strong className="font-semibold text-[var(--ink)]">{readout.displayValue}</strong>
            </div>
          ))}
        </div>
      ) : null}

      {surface.hasDetails ? (
        <>
          {surface.expanded ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-1.5 border-t border-[var(--line-fade)] py-2 text-[11px] sm:grid-cols-3 lg:grid-cols-4">
              {surface.details.map((readout) => (
                <div key={readout.id} className="flex min-w-0 items-baseline justify-between gap-2">
                  <span className="truncate text-[var(--ink-dim)]" title={readout.label}>
                    {readout.label}
                  </span>
                  <strong className="shrink-0 font-semibold text-[var(--ink)]">
                    {readout.displayValue}
                  </strong>
                </div>
              ))}
            </div>
          ) : null}

          <div className="flex justify-end border-t border-[var(--line-fade)] pt-1.5">
            <button
              type="button"
              onClick={() => onToggle?.(surface.id)}
              className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-[var(--gold-ornament)]/80 transition hover:text-[var(--ink)]"
              aria-expanded={surface.expanded}
            >
              {surface.expanded ? "Less" : "More"}
              {surface.expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
}

export default function StoryRoomStatusSurfaceHostView({
  placement = "BOTTOM",
  surfaces = [],
  onToggleSurface,
}) {
  if (!surfaces.length) return null;

  return (
    <div className="shrink-0" data-story-status-surface-placement={placement}>
      {surfaces.map((surface) =>
        surface.variant === "ACTOR_MECHANICS" ? (
          <ActorMechanicsSurface
            key={surface.id}
            surface={surface}
            onToggle={onToggleSurface}
          />
        ) : (
          <ConfiguredSurface
            key={surface.id}
            surface={surface}
            placement={placement}
          />
        )
      )}
    </div>
  );
}
