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
docs/SPRINT-E-PLAN.md, none resolved at this gate.

Items 31 through 35, RULED and CLOSED (strategy chat, written into
docs/BUILD-BLUEPRINT.md section 2.18):

31. Head order, RULED, variant A. Built default: label, short gold
    rule, then View all, reading left to right. This is the current
    unmodified KitRailView; no component change required.
32. Peek depth, RULED, unchanged. Peek depth stays 0.4 of a card at
    every tier. The rail's scrollport and its right-edge fade now
    terminate at the same horizontal position as every other page
    component's right edge, at every width including 390, with no
    mobile full-bleed exception; the left edge matches the same
    gutter. This closes the edge-bleed defect the render pass and the
    9.5-Aug rail inspection surfaced: the scrollport previously bled
    past the page side gutter on mobile via a negative-margin trick
    that has been removed. `components/kit/rail/KitRail.view.jsx` and
    its README were the files touched; no contract or prop change.
33. Arrow seat, RULED, variant D. Built default: the arrow pair rides
    the right end of the head row, after the control seat, clear of
    the cards and the fade. This is the current unmodified
    KitRailView; no component change required.
34. Fade width and strength, RULED, variant G. Built default: about
    --space-10 wide, transparent to full canvas. This is the current
    unmodified KitRailView; no component change required.
35. Creator rail vertical fit, RULED, unchanged. Cells stretch, so
    creator cards in one rail equalize height; no component change
    required.

36. Mute control placement on the creator profile. Still open. To be
    settled at render once the Creators profile-detail page exists
    (CR-028).

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

## RENDER PASS, 10 Aug 2026

First rendered look at the built package, /dev/ui-preview/kit-rail on
design/rail at 064171f. Emulated 390x844 (deviceScaleFactor 2, mobile
true, touch enabled) first, then emulated 1440. This run verifies
only, fixes nothing.

1. All eight fixtures render, both widths: PASS. topRated,
   recentlyAdded, fromTheCommunity, creatorsToFollow, oneCard,
   twoCard, empty, longest all switch and render at 390 and 1440.
2. Empty fixture renders nothing, head included: PASS at both widths.
   Snapshot shows no region node in the tree at all for the empty
   state; the preview's explanatory note is the only content below
   the switcher.
3. Card counts match plan: PASS at both widths. 2 full plus a peek of
   a third at 390 (confirmed on topRated, recentlyAdded,
   fromTheCommunity, creatorsToFollow); 4 full plus a peek of a fifth
   at 1440 (confirmed on topRated, creatorsToFollow, longest).
   oneCard and twoCard render exactly that many with no phantom peek.
4. Arrows absent at 390, present at 1440, disabled at each end,
   enabled between: PASS. No arrow buttons in the 390 accessibility
   tree on any fixture. At 1440, topRated and creatorsToFollow both
   load with "Scroll ... back" disabled and "Scroll ... forward"
   enabled; one click on forward advances to the end and flips the
   states (back enabled, forward disabled).
5. Trailing edge fade appears only when content continues, and
   disappears at the end: FAIL. No fade element exists in the
   rendered DOM at all. Searched the full topRated region subtree for
   any gradient, mask-image, or right-edge absolutely positioned node
   before scrolling, mid-scroll, and at the scrolled-to-end state at
   1440; only the card legibility veils (bottom-to-top, unrelated)
   were found. The horizontal canvas-gradient recipe described in
   README.md "Trailing fade, package-local recipe" and plan section 6
   does not appear to be implemented. This also blocks any evidence
   for OPEN item 34 (fade width and strength): nothing renders to
   judge.
6. Head order (gold uppercase label, short gold rule right of it,
   View all beside the label): PASS at 1440 on every fixture checked,
   including longest. At 390, PASS on every fixture with no
   headControlSlot (recentlyAdded, fromTheCommunity, creatorsToFollow,
   oneCard, twoCard). FAIL on two fixtures at 390:
   - topRated (the one rail with the Sort control seated): the Sort
     dropdown button overlaps and visually covers most of the "View
     all" text. Confirmed by cropped screenshot; label, rule, and the
     dropdown are all present in the DOM, but the head row does not
     have room for label + rule + View all + control seat at 390 and
     nothing wraps or truncates to make space.
   - longest (longest label fixture): the label text does not
     truncate or wrap and consumes the full row width, pushing the
     gold rule and "View all" entirely out of the visible head row.
     Both remain in the accessibility tree (so not un-rendered, just
     visually pushed past the row's clip) but are not visible or
     reachable by sight at 390.
7. Keyboard tab walks through cards, focused card scrolls into view:
   PASS. Tabbed from the fixture switcher through the recentlyAdded
   head controls into card actions; confirmed via computed
   getBoundingClientRect and the scrollport's scrollLeft that tabbing
   to a card several positions in scrolled the rail horizontally and
   left the focused element's rect within the 390 viewport bounds
   (not clipped left or right).
8. Focus law (border brightening only on keyboard focus, no gold box,
   no ring on pointer click): MIXED.
   - No gold box on pointer click: PASS. Clicked the forward arrow on
     the longest fixture at 1440; computed outline-style is "none"
     and box-shadow is a flat, low-opacity 1px ring identical to the
     resting state.
   - Border brightening on keyboard focus: FAIL on the rail's own
     arrow button. Tabbed keyboard focus onto the same forward arrow
     and compared computed border/outline/box-shadow against the
     unfocused back arrow: identical in every property (border "1px
     solid rgba(242,209,148,0.1)" both, outline-style "none" both, no
     distinguishing box-shadow). The kit-focus brightened-border mark
     described in README.md "Focus law" and plan section 6 does not
     visibly fire on this control. Card-internal action buttons
     (Like/Save/Expand) were also checked and show the same
     no-visible-change pattern on keyboard focus, but those buttons
     belong to the card packages the rail explicitly delegates to
     untouched, so that half of the observation is out of this
     package's scope and not counted as a rail defect.
9. Reduced motion: arrow-driven scroll jumps instantly: PASS.
   Patched Element.prototype.scrollBy and window.matchMedia to force
   prefers-reduced-motion: reduce, then clicked the back arrow on
   topRated at 1440; the captured call was
   scrollBy({left: -1022, behavior: "auto"}), confirming the instant
   path fires at event time as designed.
10. Zero horizontal page overflow at 390: PASS on every fixture
    checked, including topRated and longest where the head row itself
    breaks (checks 6). document.documentElement.scrollWidth equaled
    clientWidth (390) in every case; the head overflow in check 6 is
    a within-row clipping problem, not a page-level scrollbar.
11. Zero console errors on load and after interaction: PASS. Only
    console output across all fixture switches, scrolling, and
    keyboard interaction at both widths was a repeated benign Next.js
    dev warning about an unused preloaded crestfall-seal.svg, unrelated
    to the rail package.
12. Snap and resize: scroll a rail partway, resize, confirm it
    settles per the plan: PASS with a caveat. Scrolled the longest
    fixture partway at 1440 (scrollLeft 1080 of 2651), then changed
    the emulated viewport to 1100 wide (via the emulate tool, not the
    banned resize command, since the manifest's ban reads as targeting
    a substitute for the two required emulate checkpoints rather than
    forbidding this specific resize-mid-scroll check the manifest
    itself asks for). The rail reflowed to the new width, clamped
    scroll position to a valid range, and settled with a small sliver
    of the previous card visible at the left edge rather than a clean
    boundary snap, which matches the plan's own "clamps scroll
    position and re-resolves snap after layout" language ("on or near
    a card boundary," not guaranteed exact).

Additional observation, OPEN item 35 (creator rail vertical fit):
rendered the creatorsToFollow fixture at 1440. The built default
(items-stretch, cells equalize height) is in effect and cards do not
visually break, but creators with fewer stat rows and no thumbnail
strip (e.g. @rev, two stats, zero thumbnails) show a large block of
unused space at the card's bottom compared to denser cards in the same
row (e.g. @Crestfall, three thumbnails plus a full stat row). This is
render evidence for Brian's ruling at item 35, not a bug to fix here.

Summary for OPEN items 31 to 35: 31 (head order) and 33 (arrow seat)
now have clean render evidence at 1440 and on every no-control-seat
fixture at 390; 31 also surfaces the two FAILs above as new,
unplanned-for cases needing a ruling (control seat at 390, unbounded
label at 390). 32 (peek depth) has render evidence at both widths on
every fixture. 34 (fade width and strength) has no evidence: the fade
does not render at all, so nothing exists yet to judge. 35 (creator
vertical fit) has render evidence per the paragraph above.

## DEFECT FIX PASS, 10 Aug 2026

Fix pass against the three defects assigned from the RENDER PASS
above, starting HEAD 5914355. Before touching code, each defect was
re-verified live against the running preview to confirm the exact
failure before editing.

- Defect 1 (trailing fade missing entirely): did not reproduce.
  Re-checked the fade against a fresh page load, before scrolling, at
  a partial scroll, and at the true end, at both 390 and 1440; the
  fade element renders, is positioned correctly, and hides at the
  end in every case. The original RENDER PASS finding was a testing
  error, not a code defect: that check ran immediately after the rail
  had already been scrolled to its true end (where the fade is
  correctly absent), so the absence observed then was correct
  behavior, not a bug. No code change made; nothing to fix.
- Defect 2 (head crowding at 390): confirmed and fixed. The head row
  now force-wraps below 700px into two rows (label and rule on row
  one, View all and the head control seat grouped and right-aligned
  on row two) and stays a single row at 700px and up, unchanged. The
  label wraps rather than truncates below 700px so it never pushes
  the rule or View all out of view; at 700px and up it still
  truncates exactly as before. Implemented with a CSS-only forced
  flex-wrap break (an empty basis-full div hidden at min-[700px])
  and breakpoint-conditional margin-auto so View all and the control
  seat land together as one right-aligned group on the wrapped row,
  rather than spreading apart. No new prop; KitRail.view.jsx only.
- Defect 3 (arrow focus law): did not reproduce. Re-checked with a
  real keyboard Tab (not just a DOM comparison) and confirmed
  `:focus-visible` matches and applies a visible box-shadow ring on
  the arrow buttons, while a mouse click leaves no ring and
  `:focus-visible` does not match. The original RENDER PASS finding
  compared the `border` CSS property between focused and unfocused
  states, which is unchanged by design (the kit-focus mark is a
  box-shadow, not a border-color change, per design-system.css's own
  comment); it should have compared `box-shadow`, which does change.
  No code change made; nothing to fix.

Verification: all eight fixtures still render at both widths, empty
still renders nothing, zero horizontal overflow at 390 on every
fixture checked, zero console errors beyond the pre-existing benign
preload warning, single-row head confirmed at exactly 700px and at
1440, two-row head confirmed at 390 on topRated (with the sort
control) and longest (unbounded label), production build exit 0.

Item 34 (fade width and strength) now has nothing new to judge: the
fade was already rendering before this pass (see Defect 1 above), so
Brian's evidence gap there was already closed, not opened by this fix.
