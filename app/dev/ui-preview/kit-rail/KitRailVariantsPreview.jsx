"use client";

// Preview-local comparison surface for Brian's ruling on OPEN items
// 31, 33, 34 (docs/SPRINT-F-PLAN.md). Every variant here is built
// entirely inside this preview route. None of it touches
// components/kit/rail/, its contract, its fixtures, any page, or any
// law document. The shipped rail's behavior is unchanged; variants A,
// D, and G below render the real, unmodified KitRailView so Brian can
// compare the built default against alternatives side by side. B, C,
// E, F, H, and I are static preview-only mockups built from the same
// fixture data and the same design tokens, not the real component.
import { ChevronLeft, ChevronRight } from "lucide-react";

import KitRailView from "@/components/kit/rail/KitRail.view";
import {
  kitRailLongestContentFixture,
  kitRailTopRatedFixture,
} from "@/components/kit/rail/KitRail.fixtures";

const CELL_WIDTH_CLASSES =
  "w-[calc((100%-2*var(--space-3))/2.4)] min-[700px]:w-[calc((100%-3*var(--space-4))/3.4)] min-[1100px]:w-[calc((100%-4*var(--space-5))/4.4)]";

const BLEED_PADDING_CLASSES =
  "px-[var(--space-5)] sm:px-[var(--space-8)] lg:px-[var(--space-10)]";

const ARROW_CIRCLE_CLASSES =
  "flex h-[var(--control-sm)] w-[var(--control-sm)] flex-none items-center justify-center rounded-[var(--radius-full)] border border-[var(--line)] text-[var(--gold-action)] [@media(pointer:coarse)]:h-[var(--control-md)] [@media(pointer:coarse)]:w-[var(--control-md)]";

function VariantLabel({ letter }) {
  return (
    <div
      aria-hidden="true"
      className="flex h-[var(--control-lg)] w-[var(--control-lg)] flex-none items-center justify-center rounded-[var(--radius-full)] border border-[var(--gold-action)] font-display text-[length:var(--text-heading)] leading-none text-[var(--gold-bright)]"
    >
      {letter}
    </div>
  );
}

function VariantBlock({ letter, children }) {
  return (
    <div className="flex items-start gap-[var(--space-4)] rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-5)]">
      <VariantLabel letter={letter} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function GroupSection({ title, caption, children }) {
  return (
    <section className="flex flex-col gap-[var(--space-4)]">
      <div className="flex flex-col gap-[var(--space-1)]">
        <h2 className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          {title}
        </h2>
        <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          {caption}
        </p>
      </div>
      <div className="flex flex-col gap-[var(--space-3)]">{children}</div>
    </section>
  );
}

function Rule() {
  return (
    <div
      aria-hidden="true"
      className="h-px w-[var(--space-8)] flex-none bg-[var(--gold-ornament)]"
    />
  );
}

function LabelText({ label, truncateFrom700 = true }) {
  return (
    <p
      className={`min-w-0 flex-1 break-words text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] ${
        truncateFrom700 ? "min-[700px]:flex-none min-[700px]:truncate" : ""
      }`}
    >
      {label}
    </p>
  );
}

function CardCells({ cards }) {
  return (
    <>
      {cards.map((card, index) => (
        <div key={card.key ?? index} className={`grid flex-none snap-start ${CELL_WIDTH_CLASSES}`}>
          {card}
        </div>
      ))}
    </>
  );
}

function Scrollport({ cards, snap = true }) {
  return (
    <div
      className={`scrollbar-none flex items-stretch gap-[var(--space-3)] overflow-x-auto py-[var(--space-3)] min-[700px]:gap-[var(--space-4)] min-[1100px]:gap-[var(--space-5)] ${
        snap ? "snap-x snap-proximity" : ""
      } ${BLEED_PADDING_CLASSES}`}
    >
      <CardCells cards={cards} />
    </div>
  );
}

/* Item 31, variant B: View all pinned to the far right of the head
   row above 700px (no rule-adjacent seat), and to the two-row law's
   right-aligned row two below 700px, same as the shipped mechanic. */
function VariantB({ label, viewAllLabel, cards }) {
  return (
    <section className="flex flex-col gap-[var(--space-4)]">
      <div className="flex flex-wrap items-center gap-x-[var(--space-3)] gap-y-[var(--space-2)]">
        <div className="flex min-w-0 flex-1 items-center gap-[var(--space-3)]">
          <LabelText label={label} />
          <Rule />
        </div>
        <div aria-hidden="true" className="basis-full min-[700px]:hidden" />
        <button
          type="button"
          className="kit-focus ml-auto flex-none rounded-[var(--radius-xs)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--gold-action)] hover:underline"
        >
          {viewAllLabel}
        </button>
      </div>
      <div className={"relative"}>
        <Scrollport cards={cards} />
      </div>
    </section>
  );
}

/* Item 31, variant C: View all beneath the label, left-aligned, at
   every width. */
function VariantC({ label, viewAllLabel, cards }) {
  return (
    <section className="flex flex-col gap-[var(--space-4)]">
      <div className="flex flex-col gap-y-[var(--space-2)]">
        <div className="flex min-w-0 items-center gap-[var(--space-3)]">
          <LabelText label={label} truncateFrom700={false} />
          <Rule />
        </div>
        <button
          type="button"
          className="kit-focus flex-none self-start rounded-[var(--radius-xs)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--gold-action)] hover:underline"
        >
          {viewAllLabel}
        </button>
      </div>
      <div className={"relative"}>
        <Scrollport cards={cards} />
      </div>
    </section>
  );
}

/* Shared head row for item 33's mockups (E, F): label, rule, View
   all, and the head control seat, arrows omitted from the head. */
function HeadWithoutArrows({ label, viewAllLabel, headControlSlot }) {
  return (
    <div className="flex flex-wrap items-center gap-x-[var(--space-3)] gap-y-[var(--space-2)]">
      <div className="flex min-w-0 flex-1 items-center gap-[var(--space-3)]">
        <LabelText label={label} />
        <Rule />
      </div>
      <div aria-hidden="true" className="basis-full min-[700px]:hidden" />
      <button
        type="button"
        className="kit-focus ml-auto flex-none rounded-[var(--radius-xs)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--gold-action)] hover:underline min-[700px]:ml-0"
      >
        {viewAllLabel}
      </button>
      <div className="ml-0 flex flex-none items-center gap-[var(--space-3)] min-[700px]:ml-auto">
        {headControlSlot}
      </div>
    </div>
  );
}

/* Item 33, variant E: arrows floating over the scrollport's left and
   right edges, vertically centered on the cards. */
function VariantE({ label, viewAllLabel, headControlSlot, cards }) {
  return (
    <section className="flex flex-col gap-[var(--space-4)]">
      <HeadWithoutArrows label={label} viewAllLabel={viewAllLabel} headControlSlot={headControlSlot} />
      <div className={"relative"}>
        <Scrollport cards={cards} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-[var(--space-3)]"
        >
          <div className={`${ARROW_CIRCLE_CLASSES} bg-[var(--canvas)]`}>
            <ChevronLeft size={20} aria-hidden="true" />
          </div>
          <div className={`${ARROW_CIRCLE_CLASSES} bg-[var(--canvas)]`}>
            <ChevronRight size={20} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Item 33, variant F: arrows below the rail, right-aligned. */
function VariantF({ label, viewAllLabel, headControlSlot, cards }) {
  return (
    <section className="flex flex-col gap-[var(--space-4)]">
      <HeadWithoutArrows label={label} viewAllLabel={viewAllLabel} headControlSlot={headControlSlot} />
      <div className={"relative"}>
        <Scrollport cards={cards} />
      </div>
      <div className="flex items-center justify-end gap-[var(--space-2)]">
        <div className={ARROW_CIRCLE_CLASSES}>
          <ChevronLeft size={20} aria-hidden="true" />
        </div>
        <div className={ARROW_CIRCLE_CLASSES}>
          <ChevronRight size={20} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

/* Item 34, shared head with the built arrow seat (right-aligned in
   the head row), used by H and I so only the fade differs from G. */
function HeadWithArrows({ label, viewAllLabel, headControlSlot }) {
  return (
    <div className="flex flex-wrap items-center gap-x-[var(--space-3)] gap-y-[var(--space-2)]">
      <div className="flex min-w-0 flex-1 items-center gap-[var(--space-3)]">
        <LabelText label={label} />
        <Rule />
      </div>
      <div aria-hidden="true" className="basis-full min-[700px]:hidden" />
      <button
        type="button"
        className="kit-focus ml-auto flex-none rounded-[var(--radius-xs)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--gold-action)] hover:underline min-[700px]:ml-0"
      >
        {viewAllLabel}
      </button>
      <div className="ml-0 flex flex-none items-center gap-[var(--space-3)] min-[700px]:ml-auto">
        {headControlSlot}
        <div className="hidden flex-none items-center gap-[var(--space-2)] min-[700px]:flex">
          <div className={ARROW_CIRCLE_CLASSES}>
            <ChevronLeft size={20} aria-hidden="true" />
          </div>
          <div className={ARROW_CIRCLE_CLASSES}>
            <ChevronRight size={20} aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Item 34, variant H: softer, narrower fade. Variant I: stronger,
   wider fade. Both static (always shown) since this is a comparison
   mockup, not the real scroll-driven fade. */
function VariantFade({ label, viewAllLabel, headControlSlot, cards, fadeClassName, fadeStyle }) {
  return (
    <section className="flex flex-col gap-[var(--space-4)]">
      <HeadWithArrows label={label} viewAllLabel={viewAllLabel} headControlSlot={headControlSlot} />
      <div className={"relative"}>
        <Scrollport cards={cards} snap={false} />
        <div aria-hidden="true" className={`pointer-events-none absolute inset-y-0 right-0 ${fadeClassName}`} style={fadeStyle} />
      </div>
    </section>
  );
}

export default function KitRailVariantsPreview() {
  const longest = kitRailLongestContentFixture;
  const topRated = kitRailTopRatedFixture;

  return (
    <div className="flex flex-col gap-[var(--space-10)]">
      <GroupSection
        title="Item 31, seat for View all"
        caption="Three seats for the View all link, compared against the longest label fixture."
      >
        <VariantBlock letter="A">
          <p className="mb-[var(--space-3)] text-[length:var(--text-ui)] text-[var(--ink-faint)]">
            View all immediately beside the gold rule, as built today.
          </p>
          <KitRailView {...longest} />
        </VariantBlock>
        <VariantBlock letter="B">
          <p className="mb-[var(--space-3)] text-[length:var(--text-ui)] text-[var(--ink-faint)]">
            View all right-aligned at the far end of the head row, rule left of it.
          </p>
          <VariantB label={longest.label} viewAllLabel={longest.viewAllLabel} cards={longest.children} />
        </VariantBlock>
        <VariantBlock letter="C">
          <p className="mb-[var(--space-3)] text-[length:var(--text-ui)] text-[var(--ink-faint)]">
            View all beneath the label, left-aligned.
          </p>
          <VariantC label={longest.label} viewAllLabel={longest.viewAllLabel} cards={longest.children} />
        </VariantBlock>
      </GroupSection>

      <GroupSection
        title="Item 33, seat for the arrows"
        caption="Three positions for the arrow pair, compared against the topRated fixture."
      >
        <VariantBlock letter="D">
          <p className="mb-[var(--space-3)] text-[length:var(--text-ui)] text-[var(--ink-faint)]">
            Arrows right-aligned in the head row, as built today.
          </p>
          <KitRailView {...topRated} />
        </VariantBlock>
        <VariantBlock letter="E">
          <p className="mb-[var(--space-3)] text-[length:var(--text-ui)] text-[var(--ink-faint)]">
            Arrows floating over the rail&apos;s left and right edges, vertically centered on the cards.
          </p>
          <VariantE
            label={topRated.label}
            viewAllLabel={topRated.viewAllLabel}
            headControlSlot={topRated.headControlSlot}
            cards={topRated.children}
          />
        </VariantBlock>
        <VariantBlock letter="F">
          <p className="mb-[var(--space-3)] text-[length:var(--text-ui)] text-[var(--ink-faint)]">
            Arrows below the rail, right-aligned.
          </p>
          <VariantF
            label={topRated.label}
            viewAllLabel={topRated.viewAllLabel}
            headControlSlot={topRated.headControlSlot}
            cards={topRated.children}
          />
        </VariantBlock>
      </GroupSection>

      <GroupSection
        title="Item 34, fade strength"
        caption="Three trailing edge fades, compared against the topRated fixture."
      >
        <VariantBlock letter="G">
          <p className="mb-[var(--space-3)] text-[length:var(--text-ui)] text-[var(--ink-faint)]">
            The fade as built today.
          </p>
          <KitRailView {...topRated} />
        </VariantBlock>
        <VariantBlock letter="H">
          <p className="mb-[var(--space-3)] text-[length:var(--text-ui)] text-[var(--ink-faint)]">
            Visibly softer and narrower than the built fade.
          </p>
          <VariantFade
            label={topRated.label}
            viewAllLabel={topRated.viewAllLabel}
            headControlSlot={topRated.headControlSlot}
            cards={topRated.children}
            fadeClassName="w-[var(--space-6)]"
            fadeStyle={{
              backgroundImage:
                "linear-gradient(90deg, transparent, color-mix(in srgb, var(--canvas) 50%, transparent))",
            }}
          />
        </VariantBlock>
        <VariantBlock letter="I">
          <p className="mb-[var(--space-3)] text-[length:var(--text-ui)] text-[var(--ink-faint)]">
            Visibly stronger and wider than the built fade.
          </p>
          <VariantFade
            label={topRated.label}
            viewAllLabel={topRated.viewAllLabel}
            headControlSlot={topRated.headControlSlot}
            cards={topRated.children}
            fadeClassName="w-[var(--space-24)]"
            fadeStyle={{
              backgroundImage: "linear-gradient(90deg, transparent 0%, var(--canvas) 40%, var(--canvas) 100%)",
            }}
          />
        </VariantBlock>
      </GroupSection>
    </div>
  );
}
