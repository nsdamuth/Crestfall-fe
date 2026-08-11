# SPRINT-F-PLAN v1.0.0, written 10 Aug 2026, branch design/rail, planning gate only

Scope, fixed at this gate: one new kit package, a horizontally scrolling
rail that holds existing cards, built once and used four times on Home.
Cards are not modified. Home itself is not built this sprint; this plan
covers the rail package and its own /dev/ui-preview route only. The rail
never appears inside a modal or sheet; horizontal scrolling is legal on
page surfaces only. No backend work, no services-api calls, no fetches.
Fixtures only. Display names only.

## 0. Standing facts established at this gate

- The rail is ruled (docs/CRESTFALL-DESIGN-CONTEXT.md, 10 Aug 2026):
  "No horizontally scrolling card row exists in the kit today, so this
  is a new kit package, built once and used four times on Home. It holds
  existing cards; no card-level work is needed." The four Home rails are
  top rated, recently added, from the community, creators to follow.
- Rail head law is BUILD-BLUEPRINT 2.16(o) scope 1: gold uppercase label
  with one short solid gold rule to its right. "View all" sits at the
  head beside the label, never at the end of the scroll. One sort
  control exists on Home's top rail only; the rail accepts a control in
  its head and renders correctly with that slot empty.
- Advance behavior, ruled: native scroll everywhere (touch, trackpad,
  shift-wheel), plus gold arrow controls from 700px up, disabled at each
  end, with a trailing edge fade signalling more content. No dot
  indicators, no page counter.
- A rail with nothing in it renders nothing at all, head included. This
  matches the ruled Continue strip precedent ("renders nothing when
  nothing is in progress") and creator-card strip law ("the strip never
  invents placeholder frames").
- Focus law holds: :focus-visible brightens the border only (the
  kit-focus 1px line-strong mark, 2.16(e)), no gold box, no pointer
  focus ring.
- The only horizontal-scroll precedents in law are the mobile filter
  line (2.1) and the dropdown line (2.16(d)), both plain overflow with
  the scrollbar-none idiom. No arrow, snap, edge-fade, or scroller
  keyboard law exists anywhere in the four law documents; this plan
  writes those mechanics into the package README as package law, citing
  this sprint's brief as the ruling source.
- Contract authorization for Sprint F: KitRail, none to 1.0.0, new
  package. Every other contract is consumed, not changed. Any other
  contract, ViewModel, or data-flow change: STOP and write up, never
  decide.

## 1. Package name and file list

Package: components/kit/rail/, component KitRail. LOOM shape:

- components/kit/KitRail.jsx (BindingShell, one level up, flat)
- components/kit/rail/KitRail.view.jsx
- components/kit/rail/useKitRailViewModel.js
- components/kit/rail/KitRail.contract.js (version 1.0.0 on line 1)
- components/kit/rail/KitRail.fixtures.js
- components/kit/rail/README.md

Preview route, two files per the standing convention:

- app/dev/ui-preview/kit-rail/page.jsx (server component, notFound() in
  production)
- app/dev/ui-preview/kit-rail/KitRailPreviewClient.jsx ("use client",
  imports the View and fixtures directly, uses KitPreviewShell)

## 2. Prop contract, version 1.0.0

Line 1 of KitRail.contract.js:
export const KIT_RAIL_VIEW_CONTRACT_VERSION = "1.0.0";

| Prop | Type | Default | Notes |
|---|---|---|---|
| label | string | "" | Head label text, rendered uppercase in gold. Also the rail's accessible name (aria-label on the section root). |
| viewAllLabel | string | "View all" | Display text of the head link. |
| onViewAll | function or null | null | When null, the View all link does not render. |
| headControlSlot | ReactNode | null | The head control seat. Home fills it with the sort dropdown on the top rail only; every other rail leaves it null and the head renders correctly without it. |
| children | ReactNode | null | The cards, in order. Each direct child is wrapped in one sized item cell. Zero renderable children means the whole rail, head included, renders nothing. |

What the rail renders itself: the section root; the head row (label at
--text-label, uppercase, --track-label, --gold-ornament; the short rule,
1px high, --space-8 wide, solid --gold-ornament, --space-3 gap, per
2.16(o) and the standing SectionLabel recipe; the View all link at
--text-ui in --gold-action with kit-focus; the head control seat; the
gold arrow pair from 700px up); the scrollport with its item cells,
snap, edge bleed, and trailing fade; the arrow enable and disable state.

What the rail delegates: everything inside the cards (children, passed
through untouched); the View all destination (onViewAll, the page owns
routing); the sort control's entire behavior (headControlSlot, the page
owns its state); all data. The rail fetches nothing, routes nothing,
and holds no application state.

ViewModel: normalizes label and viewAllLabel to strings, defends
onViewAll to function-or-null, passes headControlSlot and children
through as nullable nodes. View is presentation only; its one sanctioned
local state is the scroll-edge pair (atStart, atEnd) driving the arrows
and the fade, wired through the React onScroll prop and a ResizeObserver
attached in a ref callback. No useEffect, no fetch, no router. The
reduced-motion check reads matchMedia inside the arrow click handler at
event time, so no listener state is needed.

## 3. View all and the sort control: props or slots

- View all: the rail's own props (viewAllLabel plus onViewAll). Reason:
  its placement, typography, and gold treatment are ruled rail anatomy,
  identical on all four rails. Making it a slot would let a page break
  the ruled head; making it props makes the ruled form the only form.
  The page still owns what View all does, through the callback.
- Sort control: a slot (headControlSlot). Reason: the sort control is a
  full KitDropdownView with options, selection state, and a change
  handler that belong to the page, and it exists on one rail out of
  four. Reproducing the dropdown contract inside the rail's contract
  would duplicate KitDropdown 1.1.0 and couple the two packages'
  versions. A slot keeps the rail ignorant of sorting, which is the
  correct boundary: the rail seats the control, the page owns it.

## 4. Card sizing at 390, 768, 1100, 1440

Item cells are percentage based, so counts are the invariant and pixel
widths flex with the container. Cell width per tier:
calc((100% - N * gutter) / (N + 0.4)), which yields N full cards plus a
0.4-card peek of the next, the peek being the more-content signal.

| Width | Tier | Full cards | Peek | Gutter token | Approx card width |
|---|---|---|---|---|---|
| 390 | base, under 700 | 2 | 0.4 of the third | --space-3 (12px) | 136px, art height 181px |
| 768 | min-[700px] | 3 | 0.4 of the fourth | --space-4 (16px) | 193px, art height 257px |
| 1100 | min-[1100px] | 4 | 0.4 of the fifth | --space-5 (20px) | 214px, art height 285px |
| 1440 | min-[1100px] | 4 | 0.4 of the fifth | --space-5 (20px) | 291px, art height 388px |

Approximate widths assume the shell section spans the stated viewport;
with the sidebar expanded the cells shrink fluidly and the counts hold.
Gutter tokens follow the page grid law (BUILD-BLUEPRINT 1.11: --space-3
phone, --space-4 tablet, --space-5 desktop). Count tiers switch at the
ruled 700 and 1100 lines, written as min-[700px] and min-[1100px],
matching the kit's existing breakpoint idiom. Edge bleed tokens are the
shell's own gutter set, --space-5, sm --space-8, lg --space-10, taken
verbatim from the filter bar recipe (section 5). Both card kinds share
the same cell width; creation-card fills it and derives height from its
own aspect-[3/4], creator-card fills it at its intrinsic height. Cells
use items-stretch so creator cards in one rail equalize height. The
scrollport carries py-[var(--space-3)] of breathing room so the card
hover lift and --glow-hover never clip against the overflow edge.

## 5. Edge bleed on mobile, head aligned to content width

The head row stays in normal flow, so it shares the page content edges
with every other slot by construction. The scrollport alone bleeds,
using the exact mechanism the sticky filter bar already uses against the
same shell: negative horizontal margins that cancel the shell's section
padding, mx-[calc(var(--space-5)*-1)], sm:mx-[calc(var(--space-8)*-1)],
lg:mx-[calc(var(--space-10)*-1)], with the same values re-added as
padding-inline on the scrollport and mirrored as scroll-padding-inline.
Result: the first card rests exactly on the content edge under the head
label, scrolled cards run to the true section edge (on mobile that is
the screen edge), and snap positions land back on the content edge.
Because the bleed re-uses the shell's own gutter tokens, alignment
survives any future shell padding change. The same recipe runs at every
width; at desktop the section edge is the shell's inner edge beside the
sidebar, which is the page's true horizontal boundary.

## 6. New tokens

None. The head uses --gold-ornament, --text-label, --track-label,
--space-3, --space-8. The link and arrows use --gold-action, --icon-md,
--control-sm with the [@media(pointer:coarse)]:min-h-[var(--control-md)]
bump, --state-disabled-opacity, and kit-focus. Gutters and bleed are
--space-3/4/5 and --space-5/8/10 as above. The trailing fade is
composed in place from the canvas, linear-gradient(90deg, transparent,
var(--canvas)), the same construction as the card legibility veils,
about --space-10 wide, pointer-events-none, hidden when the rail rests
at its end. No fade token exists and none is minted; DESIGN-TOKENS
already lists a proposed-but-unminted tile fade under "needs a ruling",
and this fade stays a package-local recipe logged in the README until
that ruling happens. Snap and scroll padding are structural CSS with no
token dimension.

## 7. Keyboard behavior

- Tab order: natural DOM order. Head first (View all, then the seated
  sort control when present, then the arrow pair), then each card's own
  controls in card order. No roving tabindex: the cards are composite
  widgets with several interactive elements each, and a roving scheme
  would fight their internal tab order for no ruled benefit.
- Arrow keys: not intercepted. The scrollport carries no tabindex, so
  arrow keys keep their native page meaning; no scroller keyboard law
  exists and none is invented. The gold arrows are ordinary buttons,
  activated with Enter or Space. Native shift-wheel and trackpad scroll
  behave as everywhere else.
- Focus into view without clipping: the browser scrolls a focused
  element into a scroll container natively, and the scrollport's
  scroll-padding-inline (equal to the re-added gutter, at minimum
  --space-5, 20px) insets that scroll target from the clip edge, so the
  1px kit-focus mark always sits in open space. Vertically the
  py-[var(--space-3)] breathing room does the same. The fade overlay is
  pointer-events-none and never intercepts or obscures focus.

## 8. Reduced motion

Arrow clicks advance the scrollport by one full card group via
scrollBy. The behavior option is chosen at event time: smooth normally,
auto (an instant jump) when matchMedia("(prefers-reduced-motion:
reduce)") matches, satisfying FRONTEND-SOP section 2. No CSS
scroll-behavior is set, so native user scrolling is never reinterpreted.
The global reduced-motion kill-switch in app/design-system.css already
covers the rail's hover transitions.

## 9. Snap behavior and resize

scroll-snap-type: x proximity on the scrollport, scroll-snap-align:
start on each cell, aligned to the content edge by the
scroll-padding-inline above. Proximity, not mandatory: cards settle on a
clean edge when a scroll ends near one, but momentum flicks and
trackpad glides are never hijacked, which keeps the ruled native-scroll
feel. On resize, nothing is stored and nothing is scripted: cell widths
are percentages so they reflow, the browser clamps scroll position and
re-resolves snap after layout, so a partially scrolled rail settles on
or near a card boundary on its own. The ResizeObserver only recomputes
the atStart and atEnd flags so arrows and the fade stay truthful.

## 10. Fixture set

All named exports, kitRail<Case>Fixture, art via the standing
/tmp-mockup-images helpers. Card children are built in the fixtures file
from KitCreationCardView and KitCreatorCardView with props drawn from
those packages' own fixtures, via relative sibling imports, the
precedented View-to-View pattern. JSX in fixtures follows the
studio-page precedent.

1. kitRailTopRatedFixture: label "Top rated", eight creation cards of
   mixed kinds, View all wired, headControlSlot seated with a
   single-select KitDropdownView labeled "Sort".
2. kitRailRecentlyAddedFixture: label "Recently added", eight creation
   cards, View all wired, empty control seat.
3. kitRailFromTheCommunityFixture: label "From the community", eight
   creation cards, View all wired, empty control seat.
4. kitRailCreatorsToFollowFixture: label "Creators to follow", six
   creator cards, View all wired, empty control seat. This is the
   creator rail, proving the different card height and no-art surface
   inside the same cells.
5. kitRailOneCardFixture: one creation card, arrows permanently
   disabled, no fade.
6. kitRailTwoCardFixture: two creation cards, scrollable only below the
   tier where both fit.
7. kitRailEmptyFixture: no children; renders nothing at all, head
   included. The preview client states this in its note so a later
   agent does not read the blank as a bug.
8. kitRailLongestContentFixture: longest label, longest card titles,
   twelve cards, per the SOP longest-content requirement.

No loading fixture: the package has no async of its own (section 11),
and the SOP requires loading fixtures only where async exists.

## 11. Loading state

Recommendation: render nothing until data arrives, no skeleton. Reasons:
the empty rail already renders nothing by ruling, so absence is a legal
and expected state on Home; the Continue strip precedent establishes
that a Home row may simply not exist yet; no skeleton, shimmer, or
pulse token exists anywhere in the system, so a skeleton would mint new
tokens against this plan's section 6 answer and would need its own
ruling first. The alternative, a card-shaped placeholder row, is not
carried: it fakes application state in a package that holds none. If a
render later shows unacceptable layout shift on Home, that is a Home
composition question for the Home sprint, not a rail contract change.

## 12. Build sequence for the Sonnet wave

One phase, one or more logical commits, committed and pushed at phase
end. Production build at session start and end, dev server law observed.

1. Contract, README, fixtures. Write KitRail.contract.js (version line
   first), README.md citing 2.16(o), the 10 Aug rail ruling, and this
   plan, and KitRail.fixtures.js with all eight fixtures. Verify: files
   exist, grep confirms the version constant on line 1, production
   build exit 0, zero em dashes in both docs.
2. ViewModel, View, BindingShell, static. Head row, scrollport, cells,
   bleed, empty-renders-nothing. No arrows yet. Verify: SOP section 1
   greps pass on the View (no useEffect, no fetch, no client libs),
   build exit 0.
3. Preview route, both files, all eight fixture states switchable.
   Verify: emulate 390x844, deviceScaleFactor 2, mobile true, touch
   enabled, then 1440; every state renders, empty state blank with the
   note, zero horizontal page overflow, zero console errors. The
   resize command is banned.
4. Arrows, trailing fade, disabled ends, reduced motion. Verify: at
   1440 the arrows advance by one card group, disable at each end, the
   fade hides at the end of the scroll; at emulated 390 no arrows
   render and touch scrolling works; with reduced motion emulated the
   arrow jump is instant.
5. Snap and keyboard pass. scroll-snap, scroll-padding-inline, tab
   walk through head and cards at both widths, focus mark unclipped at
   every stop, resize mid-scroll settles on a card boundary. Verify:
   each check observed on the rendered preview at both widths.
6. Function map. One row per rail control (View all, back arrow,
   forward arrow) in docs/APP-FUNCTION-MAP.csv, markdown rollup
   regenerated in the same commit. Verify: CSV diff shows exactly the
   new rows.
7. Close. Full fixture walk at emulated 390 then 1440, production
   build exit 0, zero em dashes in every touched doc, report echoes
   this sequence part by part, DONE or STOPPED.

## 13. OPEN FOR BRIAN

Items 1 through 30 stand as written in docs/SPRINT-D-PLAN.md and
docs/SPRINT-E-PLAN.md, none resolved at this gate. New items, all picks
that need a render to settle:

31. Head order. Built default: label, short gold rule, then View all,
    reading left to right. The alternative seats View all tight to the
    label with the rule after it. Both satisfy 2.16(o) and the
    beside-the-label ruling; which reads better needs the render.
32. Peek depth. Built default: 0.4 of a card at every tier. Render
    alternatives: a shallower 0.25 peek (calmer, more of each card) or
    a 0.5 peek (louder more-content signal, smaller cards).
33. Arrow seat. Built default: the arrow pair rides the right end of
    the head row, after the control seat, clear of the cards and the
    fade. Render alternative: arrows overlaid on the scrollport edges
    at mid-card height. The overlay competes with the trailing fade
    and the card face actions, which is why it is not the default.
34. Fade width and strength. Built default: about --space-10 wide,
    transparent to full canvas. Whether it reads as an invitation or a
    smudge over gold-lit art only a render can say.
35. Creator rail vertical fit. Built default: cells stretch, so
    creator cards in one rail equalize height. Render alternative:
    top-aligned intrinsic heights with a ragged bottom edge.
36. Mute control placement on the creator profile. To be settled at
    render once the Creators profile-detail page exists (CR-028).

## Verification law for this sprint

This planning gate produces exactly one new file, this document. git
status shows one new file and no modified files; nothing under
components/, app/, or lib/ changes. The Sonnet wave that follows obeys
FRONTEND-SOP section 8 in full: rendered checks at emulated 390x844
(deviceScaleFactor 2, mobile true, touch enabled) then 1440, resize
banned, production build exit 0 at session start and end, zero em
dashes in any touched doc, and every finished-task report echoes its
brief's manifest part by part as DONE or STOPPED. Anything unverified
is reported as unverified, never as done.
