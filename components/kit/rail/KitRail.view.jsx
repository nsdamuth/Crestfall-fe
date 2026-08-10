"use client";

// Horizontally scrolling rail, docs/SPRINT-F-PLAN.md (branch
// design/rail, 10 Aug 2026). Native scroll everywhere (touch,
// trackpad, shift-wheel), plus gold arrow controls from 700px up,
// disabled at each end, with a trailing edge fade signalling more
// content. No dot indicators, no page counter. Head order is fixed
// (docs/BUILD-BLUEPRINT.md 2.16(o) scope 1): gold uppercase label,
// short gold rule to its right, View all beside the label, never at
// the end of the scroll.
//
// Empty-rail law: a rail with nothing in it renders nothing at all,
// head included (the ruled Continue strip and creator-card strip
// precedent).
//
// The one sanctioned local state is the scroll-edge pair (atStart,
// atEnd) driving the arrows and the fade, wired through the React
// onScroll prop and a ResizeObserver attached in a ref callback. No
// effect hook, no data call, no router. The reduced-motion check
// reads matchMedia inside the arrow click handler at event time, so
// no listener state is needed.
import { Children, useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CELL_WIDTH_CLASSES =
  "w-[calc((100%-2*var(--space-3))/2.4)] min-[700px]:w-[calc((100%-3*var(--space-4))/3.4)] min-[1100px]:w-[calc((100%-4*var(--space-5))/4.4)]";

const BLEED_MARGIN_CLASSES =
  "mx-[calc(var(--space-5)*-1)] sm:mx-[calc(var(--space-8)*-1)] lg:mx-[calc(var(--space-10)*-1)]";

const BLEED_PADDING_CLASSES =
  "px-[var(--space-5)] sm:px-[var(--space-8)] lg:px-[var(--space-10)] [scroll-padding-inline:var(--space-5)] sm:[scroll-padding-inline:var(--space-8)] lg:[scroll-padding-inline:var(--space-10)]";

function readEdges(node) {
  if (!node) return { atStart: true, atEnd: true };
  const maxScrollLeft = node.scrollWidth - node.clientWidth;
  return {
    atStart: node.scrollLeft <= 1,
    atEnd: node.scrollLeft >= maxScrollLeft - 1,
  };
}

function RailArrowButton({ direction, label, disabled = false, onClick = null }) {
  const Icon = direction === "back" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={() => onClick?.()}
      className={`kit-focus hidden h-[var(--control-sm)] w-[var(--control-sm)] flex-none items-center justify-center rounded-[var(--radius-full)] border border-[var(--line)] text-[var(--gold-action)] transition-colors min-[700px]:flex [@media(pointer:coarse)]:h-[var(--control-md)] [@media(pointer:coarse)]:w-[var(--control-md)] ${
        disabled
          ? "pointer-events-none opacity-[var(--state-disabled-opacity)]"
          : "hover:border-[var(--gold-action)]"
      }`}
    >
      <Icon size={20} aria-hidden="true" />
    </button>
  );
}

export default function KitRailView({
  label = "",
  viewAllLabel = "View all",
  onViewAll = null,
  headControlSlot = null,
  children = null,
}) {
  const [scrollport, setScrollport] = useState(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: true });

  const scrollportRef = useCallback((node) => {
    setScrollport(node);
    if (!node) return undefined;

    setEdges(readEdges(node));
    const observer = new ResizeObserver(() => setEdges(readEdges(node)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function handleScroll(event) {
    setEdges(readEdges(event.currentTarget));
  }

  function scrollByGroup(direction) {
    if (!scrollport) return;
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    scrollport.scrollBy({
      left: direction * scrollport.clientWidth,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  const hasChildren = Children.count(children) > 0;

  if (!hasChildren) return null;

  return (
    <section aria-label={label} className="flex flex-col gap-[var(--space-4)]">
      <div className="flex flex-wrap items-center gap-x-[var(--space-3)] gap-y-[var(--space-2)]">
        <div className="flex min-w-0 flex-1 items-center gap-[var(--space-3)]">
          <p className="flex-none truncate text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            {label}
          </p>
          <div aria-hidden="true" className="h-px w-[var(--space-8)] flex-none bg-[var(--gold-ornament)]" />
          {onViewAll && (
            <button
              type="button"
              onClick={() => onViewAll()}
              className="kit-focus flex-none rounded-[var(--radius-xs)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--gold-action)] hover:underline"
            >
              {viewAllLabel}
            </button>
          )}
        </div>

        <div className="ml-auto flex flex-none items-center gap-[var(--space-3)]">
          {headControlSlot}
          <div className="hidden flex-none items-center gap-[var(--space-2)] min-[700px]:flex">
            <RailArrowButton
              direction="back"
              label={`Scroll ${label || "rail"} back`}
              disabled={edges.atStart}
              onClick={() => scrollByGroup(-1)}
            />
            <RailArrowButton
              direction="forward"
              label={`Scroll ${label || "rail"} forward`}
              disabled={edges.atEnd}
              onClick={() => scrollByGroup(1)}
            />
          </div>
        </div>
      </div>

      <div className={`relative ${BLEED_MARGIN_CLASSES}`}>
        <div
          ref={scrollportRef}
          onScroll={handleScroll}
          className={`scrollbar-none flex snap-x snap-proximity items-stretch gap-[var(--space-3)] overflow-x-auto py-[var(--space-3)] min-[700px]:gap-[var(--space-4)] min-[1100px]:gap-[var(--space-5)] ${BLEED_PADDING_CLASSES}`}
        >
          {Children.map(children, (child) => (
            <div className={`grid flex-none snap-start ${CELL_WIDTH_CLASSES}`}>{child}</div>
          ))}
        </div>

        {!edges.atEnd && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-[var(--space-10)] bg-[linear-gradient(90deg,transparent,var(--canvas))]"
          />
        )}
      </div>
    </section>
  );
}
