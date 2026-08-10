# Handoff to next chat

Written 10 Aug 2026, end of the kit polish 2 pass, branch
`design/kit-polish-2` (off `design/demo-prep`).

## State summary

The kit rebuild (`docs/BUILD-BLUEPRINT.md` chapter 2) is the current
design system: full-bleed cards, one branded-dropdown filter line at
a single unified control height (`--control-filter`, new this pass),
selection-state and focus laws, a content rating system now ruled
final at three fully live tiers (Everyone, Teen, Adult, one to one
against SFW/MATURE/EXPLICIT, no disabled row, CR-027 closed on
labels), and card surfaces without art sitting on the lighter
`--surface-2` elevated token against canvas. `/studio/v2/community`
is the only nine-page-architecture route built so far, fixture-driven
and pre-parity, mirrored auth-free at
`/dev/ui-preview/community-v2-page`. The flag-gated preview of the
full nine-destination sidebar nav
(`NEXT_PUBLIC_SIDEBAR_V2_PREVIEW`) is unchanged in shape this pass,
polished (real dividers and spacing, a demo-visible duplicate
sign-in panel removed and consolidated into one).

## This pass (kit polish 2, 10 Aug 2026)

Full manifest, echoed DONE against the brief:

1. **DONE.** Branched `design/kit-polish-2` off `design/demo-prep`.
2. **DONE.** Ratings ruled final: SFW/Everyone, MATURE/Teen,
   EXPLICIT/Adult, one to one, no disabled row, no interim note, no
   NC-17 anywhere (`lib/shared/presentation/terminology.js`). CR-027
   updated with a required gate: existing MATURE/EXPLICIT content
   must be audited and re-tagged against this ladder before live
   (non-fixture) data reaches users under these labels; that audit is
   Nick's to run and is not done here.
3. **DONE.** Filter line unified to one control height,
   `--control-filter` (38px, new locked token, splits
   `--control-sm`/`--control-md`, desktop only, touch keeps the 44px
   floor) across search, dropdown triggers, sort, and the view
   toggle. Sticky behavior (`sticky top-0` in
   `KitStudioFilterBar.view.jsx`) verified at 390 and 1440: the page
   head scrolls away and the filter line pins, dropdowns still open
   and are still usable while pinned.
4. **DONE.** Overlay icon active state restructured
   (`KitCreationCard.view.jsx` `IconActionButton`): the dark art-plate
   now stays under the gold wash at lowered opacity when active
   instead of the border changing (there was never a border change;
   the real defect was the plate disappearing on activation, losing
   its dark backing against light art). Verified against the darkest
   fixture (Lilith) and a light/mixed fixture (Elowen): the gold mark
   reads on both.
5. **DONE.** Sidebar: real `SidebarDivider`s now use `--line-strong`
   (the dividers role) and `--space-4` instead of a raw gold/15
   opacity slash; the duplicate, unconverted sign-in panel (raw
   `rounded-xl`/`bg-black/40`) is removed and its only unique
   affordance (logout) folded into the one polished sign-in block.
   Confirmed structurally: `StudioSidebar.view.jsx` is the single
   component behind both `/dev/ui-preview/studio-sidebar` and the
   real `StudioShell` render path, so cutover is still only a route
   swap.
6. **DONE.** Banners: every treatment's aspect ratio reduced ~20% in
   height (4/3 to 5/3, 21/9 to 35/12, 16/9 to 20/9), padding trimmed
   to match. Copy rewritten to one line plus one CTA, sentence case,
   no em dashes, across the fixtures and the live Community bottom
   banner ("Follow the creators behind every world you love." /
   "Browse creators"). Draft art unchanged for the live banner; it
   already read well at the reduced height.
7. **DONE.** Image anchoring: card grid/list art and creator
   thumbnails move from a hard top anchor to `object-[center_18%]`.
   Ruling, rendered both ways against the draft set: a hard top
   anchor clipped foreheads/crowns on tight crops (list rows, narrow
   grid columns) with no offsetting benefit; 18% down held faces
   consistently across the set. The image overlay (lightbox) is left
   centered, not given the same numeric anchor: it renders the full
   image uncropped (`object-contain`) and shrink-wraps to it, so
   there is normally no letterboxed space for a percentage anchor to
   act on. Per-view adjustment stays a later expansion, not built.
8. **DONE.** Loading and empty placeholders (card art fallback, image
   overlay fallback, banner no-image fallback, the Community mockup's
   loading grid and empty state) all carry the geometric brand mark
   (`icons-v7.svg#i-59`) instead of a blank fill.
9. **DONE.** Card grid/list art, creator avatars and thumbnails, and
   the bottom-treatment banner image now carry `loading="lazy"`; top
   and card treatments stay eager (frequently the page's own hero
   art). Reserved aspect ratio already existed everywhere via
   Tailwind `aspect-[...]` containers, so no layout shift risk either
   way. Global smooth scroll (`app/globals.css`) is now gated behind
   `prefers-reduced-motion: no-preference`; it never fights sticky
   positioning or keyboard focus movement since it only changes how
   the browser's own scroll-into-view animates, not whether it fires.
10. **DONE.** Verified in the auth-free mirror
    (`/dev/ui-preview/community-v2-page`) and package previews
    (`kit-studio-filter-bar`, `kit-promo-banner`, `studio-sidebar`,
    `kit-creator-card`) at 390 then 1440: every fixture state (grid,
    list, empty, loading), sticky filter line, all three dropdowns
    usable, banners at the new height, zero console errors, zero new
    ESLint errors on every touched file (3 pre-existing
    `react-hooks/static-components` errors in
    `StudioSidebar.view.jsx` are untouched debt outside this pass's
    edited lines, confirmed by diffing against the pre-pass file),
    `next build` exits 0, mobile comfortable throughout.
11. **DONE.** This handoff. Committed in logical chunks, pushed.

## Ruling recorded this pass: image anchor

Face-safe anchor is `object-[center_18%]` (roughly the middle of the
manifest's 15-20% range), applied to `KitCreationCard` grid and list
art and `KitCreatorCard` thumbnails. Reasoning: rendered against the
canon/creator draft asset set both at the old hard-top anchor and at
several percentages in range, a hard top anchor cuts into foreheads
and crowns whenever the crop is tighter than the source art's own
headroom (narrow grid columns, the wide-and-short list-row crop), and
gains nothing when it doesn't, since centered subjects already sit
near the top of most of this art. 18% consistently kept the face and
primary subject in frame across the set without giving up meaningful
headroom above it. The image overlay (lightbox) was evaluated
separately and left centered; see item 7 above for why.

## Sprint map

**Kit revision / kit polish / kit polish 2 passes (9 to 10 Aug
2026):** the eleven `components/kit/` packages and their governing
rulings (card, filter line, tag economy, mobile, focus, banner
hierarchy, list density, ratings, selection-state, grid/list toggle,
remixable fold) are landed; see `docs/CRESTFALL-DESIGN-CONTEXT.md` for
the full list (not yet regenerated to reflect this pass, next
session's task if it drifts).

**Nine-page build order** (`docs/BUILD-BLUEPRINT.md` section 3.1),
Community built first because it builds the whole browse kit once:

1. Community, built, pre-parity (`/studio/v2/community`)
2. Creators, not started (no lock; reuses page 1's skeleton)
3. Vault, not started (partial hold on the standalone edit tree,
   CR-007/CR-008)
4. Stories, not started (no lock)
5. Images, not started (no lock)
6. Studio, not started (waits on Nick's CR-026 quick-create pass)
7. Adventures, not started (waits on Nick's CR-025 rename)
8. Home, not started (ruled composition exists, section 4.1)
9. Lore, not started (most net-new contract surface, needs Nick's
   CR-015 first)

## Two open picks awaiting Brian

Both live in fixtures today for a rendered side-by-side choice, never
decided by an agent:

1. **Creation-card overlay-action placement.** `actionPlacement`:
   `overlay-top` vs `scrim-row`, both shipped in
   `KitCreationCard.fixtures.js`.
2. **Lighter wash value for artwork under a tag bed.** Carried over
   from the batch-two sweep, provisional until Brian rules it from a
   rendered card.

## Open CRs for Nick

Full detail in `docs/CONTRACT-REQUESTS.md`. Later-pass, non-blocking
unless noted:

- **CR-027**, content rating labels are now ruled final (see above);
  what remains open and blocks turning on live (non-fixture) rating
  data is the required audit: re-tag existing MATURE and EXPLICIT
  content against the new ladder (MATURE now surfaces as Teen, so any
  MATURE-tagged item that is not teen-appropriate under this ladder
  needs to move to EXPLICIT/Adult as part of the audit).
- **CR-024/CR-025**, Room Template to Story and Storyline to Adventure
  backend renames (display layer already reads the new names; CR-025
  blocks the Adventures page conversion until it lands).
- **CR-026**, Nick's review pass over the Character QUICK/ADVANCED
  field allocation before the Studio page builds.
- **CR-023**, Community vs Adventures structural model, feed/link
  data-model questions still open under an already-ruled copy split.
- **CR-013**, duplicate drawer nav tree retirement (`StudioMobileNav`
  and `StudioSidebar` still render separate copies; a one-element
  merge is agreed in shape, not landed).
- **CR-015**, lore pipeline confirmation, blocks the Lore page (last
  in the build order).
- Standing lower-priority queue: CR-001, CR-002, CR-003, CR-005,
  CR-009, CR-011, CR-012, CR-014, CR-016 through CR-022. None block
  current work; each is logged with its own verify-with-Nick note in
  `docs/CONTRACT-REQUESTS.md`.

Two CRs are Brian's, not Nick's, and are the "two open picks" above
in a different frame: CR-007 and CR-008 (one edit surface or two;
what the standalone editor exposes that the seven-stop creator does
not).

## Opener line for the new chat

```
Continuing Crestfall-fe on design/kit-polish-2. Read docs/HANDOFF-NEXT-CHAT.md first, then docs/CRESTFALL-DESIGN-CONTEXT.md for current design law. Two picks are waiting on you (overlay-action placement, tag-bed wash value); everything else is ready to keep moving. What's next?
```
