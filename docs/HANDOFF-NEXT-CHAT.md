# Handoff to next chat

Written 10 Aug 2026, end of the kit polish 3 pass, branch
`design/kit-polish-3` (off `design/kit-polish-2`).

## State summary

The kit rebuild (`docs/BUILD-BLUEPRINT.md` chapter 2) is the current
design system: full-bleed cards with a single ruled overlay-action
placement, one branded-dropdown filter line at a single unified
control height (`--control-filter`) that now docks flush beneath the
sticky top bar, a content rating system ruled final at three fully
live tiers, and card surfaces without art sitting on the lighter
`--surface-2` elevated token against canvas. `/studio/v2/community`
is the only nine-page-architecture route built so far, fixture-driven
and pre-parity, mirrored auth-free at
`/dev/ui-preview/community-v2-page` (now also carrying `StudioTopBar`
in the mirror, harness-only, so the sticky-stack relationship can be
verified without auth).

## This pass (kit polish 3, 10 Aug 2026)

Full manifest, echoed DONE against the brief:

1. **DONE.** Branched `design/kit-polish-3` off `design/kit-polish-2`.
2. **DONE.** Overlay-action placement ruled final: `overlay-top`
   everywhere. The `scrim-row` variant, its fixture
   (`kitCreationCardScrimRowFixture`), and the `actionPlacement` prop
   are removed from `KitCreationCard` (contract v3.0.0 to v3.1.0);
   the side-by-side placement comparison in the package preview
   collapsed to one card. Ruling recorded in `docs/BUILD-BLUEPRINT.md`
   (2.6 and the 9 Aug rulings log), `docs/MOCKUP-DECISIONS.md`, and
   `docs/CRESTFALL-DESIGN-CONTEXT.md`.
3. **DONE.** Sticky stack fixed: the filter line was pinned at
   `top: 0`, the same offset as `StudioTopBar`'s own `sticky top-0`,
   so the two surfaces overlapped once both were pinned instead of
   stacking. A new token, `--topbar-h`
   (`calc(var(--control-md) + var(--space-3) * 2 + 1px)`, the top
   bar's own measured height), lets `KitStudioFilterBar` dock at
   `top: var(--topbar-h)` instead, closing the gap and clearing the
   overlap. Verified scrolling at 390 and 1440 in the auth-free
   mirror (which now renders `StudioTopBar` above the mockup for
   exactly this check): search stays anchored left, dropdowns/sort/
   view-toggle stay reachable on the right at the aligned control
   height, top bar always wins the stack.
4. **DONE.** Search field focus and clear control, ruled final. The
   kit polish 2 fix was incomplete: its `focus-visible:[box-shadow:
   none]` Tailwind utility on the raw `<input>` lost the cascade to
   the app-wide gold `:focus-visible` rule (both single-class
   specificity, and `design-system.css` imports after `tailwindcss`
   in `app/globals.css`, so the gold rule always won). Fixed with a
   dedicated `.kit-search-input:focus-visible` rule in
   `app/design-system.css` at higher specificity, order-independent.
   Deeper defect found and fixed the same pass: Chromium marks a text
   `<input>` `:focus-visible` on ANY focus, pointer or keyboard
   (verified live in Chrome DevTools), so the wrapper's
   `has-[:focus-visible]` border brightening was firing on mouse
   clicks too, not just keyboard, contradicting "pointer focus shows
   nothing." Replaced with explicit local state
   (`KitStudioFilterBar.view.jsx`'s `SearchField`): a `pointerdown` on
   the wrapper is recorded in a ref before the resulting focus event
   fires, so the handler can tell a pointer-caused focus from a
   keyboard-caused one and only light the `--line-strong` border for
   the latter. Verified both paths live: click leaves the wrapper at
   `border-[var(--line-whisper)]` (or the hover step), Tab leaves it
   at `border-[var(--line-strong)]`, gold never appears either way.
   Clear control: the native `type=search` cancel icon (browser
   blue/gray) is hidden
   (`.kit-search-input::-webkit-search-cancel-button` etc.) and
   replaced with a component-owned `X` icon in `--ink-faint`, the
   same token that colors the placeholder, shown only when the field
   has a value.
5. **DONE.** Loading and empty geometric marks (`icons-v7.svg#i-59`)
   scaled up on the existing spacing ladder: `var(--space-10)` (40px,
   +25% from the prior 32px) for the smaller marks (card no-image
   fallback in both layouts, the Community loading-grid tiles);
   `var(--space-14)` (56px, +40% from the prior 40px) for the larger
   marks (the Community empty state, the image-overlay fallback, the
   promo-banner no-image fallback). Both land inside the manifest's
   ruled 25 to 50 percent range; verified at 390 and 1440 that neither
   size dominates its card.
6. **DONE.** Banner art surveyed and replaced. Every draft asset (71
   files across `canon-character-images/` and
   `alpha-test-creator-images/`) was measured for orientation. Exactly
   one is a genuinely wide, single-subject composition: `Lilith.png`
   at 2560x1441 (1.78:1). The only other landscape file, `sassy.png`
   at 2352x1426, is an eight-panel reference sheet (a mood board with
   overlaid labels), not a scene, and does not compose at any crop, so
   it stays out. `Lilith.png` replaces the portrait-oriented `Serapha
   Veyloria.png` used through kit polish 2, in every `KitPromoBanner`
   fixture (top, card, both bottom sub-variants, the galaxy-top
   fixture) and the live Community bottom banner
   (`CommunityV2Mockup.jsx`). Its subject sits close enough to center
   (measured at roughly 35% down) that it survives every banner crop
   this pass uses, mobile 5/3 through desktop 35/12 and 20/9, without
   cutting into the face; `KitPromoBannerView`'s art now carries an
   explicit `object-[center_35%]` anchor recording that measurement
   rather than relying on a lucky center-crop. Only one asset is used
   across every banner instance because it is the only draft asset
   that qualifies; the team should supply proper wide-format banner
   art (distinct per journey) before this set needs to diversify
   further.
7. **DONE.** Verified in the auth-free mirror
   (`/dev/ui-preview/community-v2-page`, now StudioTopBar-fronted) and
   package previews (`kit-creation-card`, `kit-promo-banner`) at 390
   then 1440: sticky stack docks with no gap and no overlap while
   scrolling, search states (pointer, keyboard, populated, cleared)
   read correctly with no gold anywhere, marks read clearly at both
   sizes, banner art composes with the face in frame at every
   treatment and both widths, zero new console errors (one
   pre-existing, unrelated preload warning for
   `crestfall-seal.svg`), zero new ESLint errors on every touched
   file, `next build` exits 0, mobile comfortable throughout.
8. **DONE.** This handoff. Committed in logical chunks, pushed.

## Contract change this pass

`KitCreationCard.contract.js` moves v3.0.0 to v3.1.0: `actionPlacement`
is removed now that placement is ruled rather than a per-instance
choice. No live consumer existed beyond `CommunityV2Mockup` (which is
pre-parity, fixture-driven) and the package's own fixtures/preview,
all migrated in this same pass.

## New token this pass

`--topbar-h` (`app/theme.css`, documented in `docs/DESIGN-TOKENS.md`
sizing section): a derived layout constant, not a new primitive
value, for the sticky top bar's own rendered height. Legal use is the
`top` offset of a sticky surface docking directly beneath the top bar;
never an element's own height.

## Sprint map

**Kit revision / kit polish / kit polish 2 / kit polish 3 passes (9 to
10 Aug 2026):** the eleven `components/kit/` packages and their
governing rulings (card, filter line, tag economy, mobile, focus,
banner hierarchy, list density, ratings, selection-state, grid/list
toggle, remixable fold) are landed; see
`docs/CRESTFALL-DESIGN-CONTEXT.md` for the full list (not yet
regenerated to reflect this pass, next session's task if it drifts).

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

## One open pick awaiting Brian

Lives in fixtures today for a rendered choice, never decided by an
agent: the lighter wash value for artwork under a tag bed, carried
from the batch-two sweep. The creation-card overlay-action placement
pick from prior handoffs is now ruled (see item 2 above); it is no
longer open.

## Open CRs for Nick

Full detail in `docs/CONTRACT-REQUESTS.md`. Unchanged this pass,
later-pass, non-blocking unless noted:

- **CR-027**, content rating labels are ruled final; the required
  audit (re-tag existing MATURE and EXPLICIT content against the new
  ladder before live, non-fixture data reaches users under these
  labels) is still open and is Nick's to run.
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
- CR-007 and CR-008 (one edit surface or two; what the standalone
  editor exposes that the seven-stop creator does not) are Brian's,
  not Nick's, and remain open, folded into the Vault build-order item
  above.

## Opener line for the new chat

```
Continuing Crestfall-fe on design/kit-polish-3. Read docs/HANDOFF-NEXT-CHAT.md first, then docs/CRESTFALL-DESIGN-CONTEXT.md for current design law. One pick is waiting on you (tag-bed wash value); everything else is ready to keep moving. What's next?
```
