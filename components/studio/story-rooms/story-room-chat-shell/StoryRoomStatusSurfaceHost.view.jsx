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

function ActorMechanicsVisibilityTab({ surface, onToggleVisibility }) {
  const collapsed = surface.collapsed === true;
  const action = collapsed ? "Show" : "Hide";

  return (
    <button
      type="button"
      onClick={() => onToggleVisibility?.()}
      className="absolute right-0 top-1/2 z-10 flex h-11 w-10 -translate-y-1/2 items-center justify-center rounded-l-lg border border-r-0 border-[var(--gold-ornament)]/30 bg-black/60 text-[var(--gold-ornament)]/80 shadow-lg transition hover:bg-[var(--gold-ornament)]/10 hover:text-[var(--ink)] sm:h-10 sm:w-7"
      aria-label={`${action} ${surface.actorTitle} mechanics`}
      title={`${action} character mechanics`}
    >
      {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
    </button>
  );
}

function CollapsedActorMechanicsStrip({ surface }) {
  const criticalReadouts = surface.pools.slice(0, 2);

  return (
    <div
      className="flex min-h-8 min-w-0 items-center gap-3 overflow-hidden"
      data-actor-mechanics-collapsed-strip
    >
      <p className="min-w-0 shrink truncate font-display text-xs uppercase tracking-[0.08em] text-[var(--gold-ornament)] sm:text-sm">
        {surface.actorTitle}
      </p>

      {criticalReadouts.length ? (
        <div className="flex min-w-0 shrink-0 items-center gap-3 text-[10px] sm:text-xs">
          {criticalReadouts.map((readout) => (
            <span key={readout.id} className="whitespace-nowrap">
              <span className="mr-1 uppercase tracking-[0.08em] text-[var(--gold-ornament)]/85">
                {readout.shortLabel || readout.label}
              </span>
              <strong className="font-semibold text-[var(--ink)]">
                {readout.displayValue}
              </strong>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ActorMechanicsSurface({ surface, onToggle, onToggleVisibility }) {
  if (surface.collapsed) {
    return (
      <section className="relative min-h-11 border-t border-[var(--gold-ornament)]/25 bg-[var(--surface-2)]/70 px-3 py-1.5 pr-12 sm:min-h-10 sm:px-5 sm:py-1 sm:pr-11">
        <CollapsedActorMechanicsStrip surface={surface} />
        <ActorMechanicsVisibilityTab
          surface={surface}
          onToggleVisibility={onToggleVisibility}
        />
      </section>
    );
  }

  return (
    <section className="relative border-t border-[var(--gold-ornament)]/25 bg-[var(--surface-2)] px-3 py-2 pr-12 sm:px-5 sm:py-3 sm:pr-11">
      <ActorMechanicsVisibilityTab
        surface={surface}
        onToggleVisibility={onToggleVisibility}
      />
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-[var(--line-fade)] pb-1.5 sm:gap-x-5 sm:gap-y-2 sm:pb-2.5">
        <div className="min-w-0">
          <p className="truncate font-display text-sm uppercase tracking-[0.08em] text-[var(--gold-ornament)] sm:text-lg">
            {surface.actorTitle}
          </p>
        </div>

        {surface.progression.length ? (
          <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-0.5 text-[9px] uppercase tracking-[0.12em] sm:gap-x-3 sm:gap-y-1 sm:text-xs sm:tracking-[0.14em]">
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
        <div className="grid grid-cols-3 gap-x-2 gap-y-1 border-b border-[var(--line-fade)] py-1.5 text-[11px] sm:flex sm:flex-wrap sm:gap-x-7 sm:py-2 sm:text-sm">
          {surface.pools.map((readout) => (
            <span key={readout.id} className="min-w-0 whitespace-nowrap">
              <span className="mr-1 uppercase tracking-[0.06em] text-[var(--gold-ornament)] sm:mr-2 sm:tracking-[0.08em]">
                {readout.label}
              </span>
              <strong className="font-semibold text-[var(--ink)]">
                {readout.displayValue}
              </strong>
            </span>
          ))}
        </div>
      ) : null}

      {surface.wallets.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 border-b border-[var(--line-fade)] py-1.5 text-[11px] sm:flex sm:flex-wrap sm:gap-x-7 sm:py-2 sm:text-sm">
          {surface.wallets.map((readout) => (
            <span key={readout.id} className="min-w-0 whitespace-nowrap">
              <span className="mr-1 uppercase tracking-[0.06em] text-[var(--gold-ornament)] sm:mr-2 sm:tracking-[0.08em]">
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
        <div className="grid grid-cols-6 gap-x-2 gap-y-1 py-1.5 text-[10px] sm:grid-cols-6 sm:gap-x-4 sm:gap-y-1.5 sm:py-2 sm:text-[11px] lg:grid-cols-11">
          {surface.primaryStats.map((readout) => (
            <div key={readout.id} className="min-w-0 whitespace-nowrap" title={readout.label}>
              <span className="mr-1 text-[var(--gold-ornament)] sm:mr-1.5">{readout.shortLabel}</span>
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
  onToggleActorHudVisibility,
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
            onToggleVisibility={onToggleActorHudVisibility}
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
