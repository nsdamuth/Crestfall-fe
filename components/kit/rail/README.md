# Kit Rail LOOM Package

**Contract:** `KitRail.contract.js` (v1.0.0)

## Purpose

The horizontally scrolling rail that holds existing cards, ruled
10 Aug 2026 (`docs/CRESTFALL-DESIGN-CONTEXT.md`): "No horizontally
scrolling card row exists in the kit today, so this is a new kit
package, built once and used four times on Home. It holds existing
cards; no card-level work is needed." Head anatomy is
`docs/BUILD-BLUEPRINT.md` 2.16(o) scope 1: gold uppercase label with
one short solid gold rule to its right, View all beside the label.
Full build plan: `docs/SPRINT-F-PLAN.md`.

## Boundary

```text
KitRail.jsx
  -> useKitRailViewModel.js
  -> KitRail.view.jsx
      -> children passed through untouched (creation-card, creator-card)
      -> headControlSlot passed through untouched (e.g. KitDropdown)
```

- The ViewModel normalizes `label` and `viewAllLabel` to strings,
  defends `onViewAll` to function-or-null, and passes `headControlSlot`
  and `children` through as nullable nodes.
- The View is presentation only; its one sanctioned local state is
  the scroll-edge pair (`atStart`, `atEnd`) driving the arrows and
  the trailing fade, wired through the React `onScroll` prop and a
  `ResizeObserver` attached in a ref callback. No `useEffect`, no
  fetch, no router.
- The caller owns every card's data, reactions, and navigation; the
  View all destination; and the head control's entire behavior.

## Empty rail law

A rail with nothing in it renders nothing at all, head included.
This matches the ruled Continue strip precedent ("renders nothing
when nothing is in progress") and the creator-card strip law ("the
strip never invents placeholder frames").

## Advance behavior, ruled

Native scroll everywhere (touch, trackpad, shift-wheel), plus gold
arrow controls from 700px up, disabled at each end, with a trailing
edge fade signalling more content. No dot indicators, no page
counter. Arrow clicks advance the scrollport by one full card group
via `scrollBy`; the behavior option is chosen at event time (`smooth`
normally, `auto` when `matchMedia("(prefers-reduced-motion: reduce)")`
matches), so no reduced-motion listener state is needed.

## Snap and resize

`scroll-snap-type: x proximity` on the scrollport, `scroll-snap-align:
start` on each cell, aligned to the content edge by
`scroll-padding-inline`. Proximity, not mandatory: cards settle on a
clean edge when a scroll ends near one, but momentum flicks and
trackpad glides are never hijacked. On resize, nothing is stored and
nothing is scripted: cell widths are percentages so they reflow, the
browser clamps scroll position and re-resolves snap after layout. The
`ResizeObserver` only recomputes the `atStart`/`atEnd` flags so the
arrows and the fade stay truthful.

## Trailing fade, package-local recipe

Composed in place from the canvas,
`linear-gradient(90deg, transparent, var(--canvas))`, the same
construction as the card legibility veils, about `--space-10` wide,
`pointer-events-none`, hidden when the rail rests at its end. No fade
token exists and none is minted here; `docs/DESIGN-TOKENS.md` already
lists a proposed-but-unminted tile fade under "needs a ruling", and
this fade stays a package-local recipe until that ruling happens.

## Edge bleed on mobile

The head row stays in normal flow, sharing the page content edges by
construction. The scrollport alone bleeds, using the exact mechanism
the sticky filter bar already uses against the same shell: negative
horizontal margins that cancel the shell's section padding
(`mx-[calc(var(--space-5)*-1)]`, `sm:mx-[calc(var(--space-8)*-1)]`,
`lg:mx-[calc(var(--space-10)*-1)]`), the same values re-added as
padding-inline on the scrollport and mirrored as
`scroll-padding-inline`.

## Keyboard behavior

Tab order is natural DOM order: head first (View all, then the
seated head control when present, then the arrow pair), then each
card's own controls in card order. No roving tabindex. Arrow keys are
not intercepted; the scrollport carries no tabindex. The browser
scrolls a focused element into a scroll container natively, and
`scroll-padding-inline` insets that scroll target from the clip edge
so the 1px kit-focus mark always sits in open space.

## Focus law

`:focus-visible` brightens the border only (the kit-focus 1px
line-strong mark, 2.16(e)); no gold box, no pointer focus ring.

## New tokens

None. The head uses `--gold-ornament`, `--text-label`,
`--track-label`, `--space-3`, `--space-8`. The link and arrows use
`--gold-action`, `--icon-md`, `--control-sm` with the
`[@media(pointer:coarse)]:min-h-[var(--control-md)]` bump,
`--state-disabled-opacity`, and `kit-focus`. Gutters and bleed are
`--space-3/4/5` and `--space-5/8/10`.

## Card sizing

Item cells are percentage based: `calc((100% - N * gutter) / (N +
0.4))`, yielding N full cards plus a 0.4-card peek of the next as the
more-content signal. 2 cards under 700px, 3 at `min-[700px]`, 4 at
`min-[1100px]`. Both card kinds share the same cell width;
creation-card fills it and derives height from its own
`aspect-[3/4]`, creator-card fills it at its intrinsic height. Cells
use `items-stretch` so creator cards in one rail equalize height.

## Package assets

- `KitRail.contract.js`
- `KitRail.fixtures.js` (all eight fixture states, cards built from
  the creation-card and creator-card packages' own fixtures)
- `useKitRailViewModel.js`
- `/dev/ui-preview/kit-rail`

Fixture-only; every card's own actions are the card package's fixture
callbacks (no-ops in this preview).
