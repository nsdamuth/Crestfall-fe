# SPRINT-D-PLAN v1.0.0, written 10 Aug 2026, branch design/kit-polish-3, planning gate only

Execution spec for Brian's seven ratified rulings R1 through R7 (10
Aug 2026 gate, the modal-system gate) across four workstreams: W1
modal system, W2 Images page, W3 Stories hub, W4 Account draft
restyle. Written by the Fable planning gate of 10 Aug 2026 after
reading: docs/HANDOFF-NEXT-CHAT.md, docs/SPRINT-A-POLISH-PLAN.md and
its brief, docs/SPRINT-B-PLAN.md and its brief, docs/FRONTEND-SOP.md,
docs/DESIGN-TOKENS.md, docs/CRESTFALL-PRODUCT-MODEL-UXUI.md,
docs/BUILD-BLUEPRINT.md sections 2.3, 2.5, 3.1 through 3.4,
docs/APP-FUNCTION-INVENTORY.md, docs/MOCKUP-DECISIONS.md, the full
kit package inventory (all thirteen packages, contracts, views,
fixtures), the modal frame and ModalShell internals, the live
account page and every component it composes, and the Phase Zero
witness described in 0.1. Repo state verified this session: branch
design/kit-polish-3, tree clean at bb21279, pushed.

R1 through R7 are RATIFIED, not open; nothing in them is re-decided
here. Where this plan and a law document disagree, the law document
wins and the conflict is escalated, never resolved locally, except
where a ruling below explicitly amends the law document and the
amendment is itself part of this plan's manifest.

This plan is the execution spec for docs/SPRINT-D-SONNET-BRIEF.md.
It supersedes docs/SPRINT-B-PLAN.md and docs/SPRINT-B-SONNET-BRIEF.md
(their content is absorbed into W2 below, updated to inherit R1
through R7). No Sprint C documents exist in this repo; a repo-wide
search this session found none, so there is nothing further to fold.

## 0. Standing facts established this session (read before building)

1. **Phase Zero: the image viewer witness, FOUND.** Brian's
   recollection is confirmed. The old front end at
   `/Users/briansmith/dev/crestfall-main/Crestfall` has a `UIUX`
   branch carrying a proof-of-concept image viewer, read in full this
   session:
   - `design-system/proof/modal.js` lines 1302 to 1448 (branch UIUX):
     `CFModal.preview`, the shared image preview for Images, Vault,
     and Chat. Its own header comment: "a gold frame that hugs the
     image at its own aspect (no letterbox panel), wheel/pinch zoom
     with click-drag panning while zoomed, spaced icon actions
     beneath. Closes by X, veil, and Escape, in place."
   - `design-system/proof/modal.css` lines 355 to 393 (branch UIUX):
     the `pv*` styles. The frame is a 1px gold border directly on the
     image figure, `background: none`, no panel surface anywhere.
     Image caps `max-width: min(88vw, 60rem)`, `max-height: 72dvh`.
     Veil is the shared `cmveil` (scrim plus blur). Action buttons
     are spaced circular icon buttons beneath, tooltips above.
   - `design-system/proof/image-studio.html` (branch UIUX): the
     images section page invoking the preview from its library grid,
     with the ruling note in its own review preload: "gold frame
     hugging the image at its own aspect, scroll to zoom, spaced icon
     actions."
   - Behavior in the witness, read from the code: zoom ceiling 4x,
     floor 1x; wheel steps 1.12x up, 0.9x down; two-pointer pinch;
     one-pointer drag-pan while zoomed with pan clamped so the image
     edge never crosses the frame center; double-click resets; reset
     on close; focus trapped and returned to the opener; Escape
     closes the preview before the panel beneath it.
   Per the gate manifest, the DESIGN INTENT is matched; no code is
   imported (it predates the token system). Two witness details R2
   does not restate are adopted as intent: pan clamping and
   double-click reset. One witness detail R2 overrides: the witness
   centers its action row under the image at its own natural width;
   R2 snaps the shelf to the image's width, and R2 wins.
2. **No Sprint C documents exist.** `grep -rn "SPRINT-C\|Sprint C"`
   over docs/ and the repo root returns nothing. The supersession in
   this plan's header covers Sprint B only, and this is stated
   rather than silently skipped.
3. **The current viewer, measured in code, is exactly what R2
   rejects.** `components/kit/image-overlay/KitImageOverlay.view.jsx`
   renders inside `KitModalFrame` variant modal: a `--surface-4`
   panel (the light brown R2 bans), the gold hairline around a
   full-panel-width figure whose `--canvas` letterbox bed puts the
   hairline around empty space at most aspect ratios, and a shelf
   spanning the figure (that is, the modal) width. The veil beneath
   is `--scrim-strong` plus `--blur-panel` (2px), not the sticky nav
   treatment.
4. **The sticky nav treatment R2 orders reused, exact tokens.**
   `StudioTopBar.view.jsx` line 39 and
   `KitStudioFilterBar.view.jsx` line 155 share one recipe:
   `bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)]` plus
   `backdrop-blur-[var(--blur-chrome)]` (12px). `StudioMobileNav`
   uses the same pair. This is the surround R2 names: darker than
   `--scrim-strong` over dark canvas, blurred, translucent.
5. **A token-law amendment is required by R2 and is part of this
   plan.** docs/DESIGN-TOKENS.md currently rules `--blur-chrome`
   legal only on persistent in-flow chrome, never floating panels.
   R2 (ratified) applies the chrome treatment to the image viewer
   veil, a floating surface. The amendment in 1.6 below records the
   viewer veil as a named legal use of `--blur-chrome` under R2's
   authority. This is a Brian ruling amending his own token law, not
   an agent mint; no new token is created anywhere in this sprint.
6. **The modal frame's mobile default, measured in code, is exactly
   what R4 rejects.** `useKitModalFrameViewModel.js` lines 12 to 26:
   variant modal at under 700px is `items-end p-0` with a
   bottom-docked `w-full max-h-[92dvh]` panel. R4 replaces the dock
   with a full-screen maximize for popup modals.
7. **The sheet close-control overlap, measured in code.** The sheet's
   close control is `KitModalFrame`'s absolutely positioned X
   (`KitModalFrame.view.jsx` lines 16 to 27). The dropdown sheet's
   label row clears it with right padding, but the X's 44px box
   overhangs the label row's height into the option list below
   (`KitDropdown.view.jsx` lines 234 to 259). That overhang is the
   R7 defect.
8. **The credits list today is uncapped inside the popup.**
   `KitAssetDetailPopup.view.jsx` lines 260 to 264 render the full
   `KitCreditsView` list, unbounded, between description and footer.
   R1 collapses it.
9. **The live account page defects, confirmed with mechanisms.**
   (a) Title collision: `app/studio/account/page.js` lines 43 to 46
   passes the page description as CHILDREN of `StudioPageHeader`,
   which renders children in a `shrink-0` slot BESIDE the H1 on the
   same `lg:flex-row` axis (`StudioPageHeader.view.jsx` lines 8, 29);
   the `description` prop's constrained paragraph branch (line 22)
   never renders. Every sibling account subpage uses the prop
   correctly; only `/studio/account` misuses it.
   (b) Stat duplication: `StudioAccountMetrics` is mounted twice
   (inside the profile card via `StudioAccountProfile.jsx` lines 17
   to 19, and again bare at `app/studio/account/page.js` lines 55 to
   57), each mount fetching `/api/account/metrics` independently; a
   third near-identical stat grid inside
   `StudioAccountCoins.view.jsx` lines 46 to 58 renders a hardcoded
   all-zeros constant that is never fetched
   (`useStudioAccountCoinsViewModel.js` lines 7 to 12).
   (c) Raw controls: the profile form's inputs and textareas, both
   modal close buttons, the PC picker's search and cards, the
   `CrestfallSelect` trigger, and the Sign Out anchor all carry
   ad-hoc literals (`border-white/10`, `bg-black/35`, `rounded-xl`,
   legacy `--muted-gold` bridge vars) with no `cf-btn`, `cf-field`,
   or kit recipe. Exact file:line inventory is in this session's
   read, restated in section 4.
10. **Terminology and ratings** read from
    `lib/shared/presentation/terminology.js` only
    (`CONTENT_RATING_TIERS`, display-name maps). Doc prose that
    disagrees is stale; the module wins.
11. **The rollup script is still not in the repo.** Every CSV edit
    logs "rollup not regenerated, script not in repo";
    docs/APP-FUNCTION-MAP.md is never hand-edited.
12. **Contract versions at session start**, from the contract files:
    KitModalFrame 1.0.0, KitImageOverlay 1.0.0, KitAssetDetailPopup
    2.1.0, KitCredits 1.0.0, KitDropdown 1.0.0, KitPromoBanner
    1.1.0, KitCreationCard 3.1.0, KitCreatorCard 1.0.0,
    KitStudioFilterBar 2.0.0, KitStudioPage 1.0.0, KitBadge 1.0.0,
    KitFilterChip 1.0.0, KitLoadMore 1.0.0.
13. **The modal frame has no focus trap** (stated in its own README;
    ModalShell never had one). This sprint does not add one and does
    not regress it; the gap stays named debt. The witness HAS a
    focus trap; adopting it is listed in OPEN FOR BRIAN, never built
    unruled.

## 1. W1: the modal system (R1, R2, R4, R5, R7, plus the R3 sweep)

### 1.1 R4 and R7: the modal frame's mobile law (owner: modal-frame)

`KIT_MODAL_FRAME_VIEW_CONTRACT_VERSION` moves `"1.0.0"` to `"1.1.0"`
(one minor bump covering the additive variant in 1.2; the mobile
changes below are presentation only).

**R4, variant modal, under 700px.** The bottom dock is replaced by a
full-screen maximize:

- Veil container: `items-stretch p-0` (was `items-end p-0`).
- Panel: `h-[100dvh] max-h-[100dvh] w-full rounded-none border-0
  pb-[env(safe-area-inset-bottom)]`, internal `overflow-y-auto`
  unchanged (thumb scrolling inside). The 92dvh cap, the top-only
  corners, and the removed bottom border all go; a full-screen
  surface has no visible corners or outer border.
- 700px and up: unchanged (centered, `p-[var(--space-4)]` gutters,
  `--radius-lg`, `--line` border, `--shadow-modal`).
- ModalShellView hardcodes `p-4` on its veil container; the frame's
  full-screen panel must actually reach the viewport edges. If that
  `p-4` blocks it, ModalShell's view takes the minimal presentation
  fix (the padding moves into the frame's own alignment classes so
  each variant controls its inset). ModalShell's contract reports
  nothing about padding; this is presentation. If it turns out to
  require a ModalShell contract or prop change beyond what 1.2
  authorizes, STOP and report.
- Every consumer inherits by construction: the asset detail popup,
  the credits modal (1.3), the image viewer (1.2, which is inherently
  full-screen on mobile per R5), and every future modal. This is the
  point of R4 naming the frame's mobile default.
- The `sheet` variant is NOT maximized. R4 names popup modals; the
  filter, sort, and settings sheets remain bottom sheets (they are
  the subject of R7, not R4). This reading is recorded here; if
  Brian intends sheets to maximize too, that is a one-line ruling,
  listed in OPEN FOR BRIAN.

**R7, variant sheet, the close header row.** The frame's sheet
variant gains a structural header band so the close control can never
overlap content:

- The sheet panel renders a frame-owned header row as its first
  child: full width, `flex items-center justify-end`,
  `min-h-[calc(var(--control-md)+var(--space-3)*2)]`,
  `px-[var(--space-3)]`, `border-b border-[var(--line-whisper)]`.
  The close control renders INSIDE this row as static flow content
  (same circular recipe: `--control-md`, `--radius-full`,
  `--surface-2` fill, `--line-whisper` border), not absolutely
  positioned.
- Sheet children render below the band. The dropdown package then
  DELETES its own right-padding clearance on the sheet label row
  (`pr-[calc(var(--control-md)+var(--space-3))]`,
  `KitDropdown.view.jsx` line 240), since nothing overlaps anymore.
  The dropdown's label row stays as content beneath the band; its
  contract is untouched at 1.0.0.
- Variant modal and the new viewer variant keep the absolutely
  positioned close control exactly as today.
- Every sheet inherits by construction: filter, sort, and any future
  settings sheet. R7 said fix it in the dropdown package; the actual
  owner of the X is the frame, so the fix lands in the frame's sheet
  variant and the dropdown only removes its now-dead clearance
  padding. This satisfies R7's intent (every sheet inherits) at the
  true owner; recorded here so the deviation from R7's literal
  wording is visible.

**Law edits for R4 and R7** (same commit as the frame change):

- docs/BUILD-BLUEPRINT.md 2.5, the anatomy line: "phone docks to the
  bottom edge (top corners only)" is REPLACED by "phone maximizes to
  the full screen, vertically and horizontally, with internal thumb
  scrolling (R4, 10 Aug 2026); sheets keep the bottom dock and carry
  a structural close header row (R7)".
- docs/BUILD-BLUEPRINT.md 2.16 gains entry **(p) Mobile modal law
  (R4), RULED 10 Aug 2026**: on mobile, popup modals maximize the
  screen vertically and horizontally with thumb scrolling inside;
  never anchored to the bottom edge, never small floating cards.
  Applies to the asset detail popup, the credits modal, the image
  viewer, and the modal frame's mobile default, so every future
  modal inherits it.
- docs/BUILD-BLUEPRINT.md 2.16 gains entry **(q) Sheet header law
  (R7), RULED 10 Aug 2026**: on mobile filter, sort, and settings
  sheets, the close control sits in its own header row above the
  content, never overlapping option rows; the row is frame anatomy
  so every sheet inherits it.
- docs/CRESTFALL-PRODUCT-MODEL-UXUI.md 3.5: "dock to the bottom edge
  at phone width, vertical internal scrolling only" is updated to
  the R4 maximize wording.

### 1.2 R2 and R5: the image viewer rebuild (owners: modal-frame, image-overlay)

**The frame grows a `viewer` variant** (the additive change behind
the 1.1.0 bump). `variant: "modal" | "sheet" | "viewer"`:

- Veil: the sticky nav treatment, reusing those exact token
  compositions per R2:
  `bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)]`
  plus `backdrop-blur-[var(--blur-chrome)]`. No `--scrim-strong`, no
  `--blur-panel` on this variant.
- Panel: NONE. The variant renders no surface chrome at all: no
  background, no border, no shadow, no radius, no light brown
  anywhere. The panel slot is a transparent full-viewport flex
  column (`h-[100dvh] w-full items-center justify-center p-0`) whose
  only chrome is the frame's close control, absolutely positioned
  top right (`--space-4` inset at 700px and up, `--space-3` under),
  on its standard circular recipe.
- Close behavior identical: X, veil click (a click on the veil that
  is not on the image, shelf, or close control), and Escape, close
  in place. Backdrop press-and-drag never false-closes (the existing
  ModalShell `event.target === event.currentTarget` guard).
- If passing the veil treatment through ModalShellView requires a
  veil class passthrough, `ModalShellView` gains an optional
  `veilClassName` prop (additive; bump ModalShell's contract version
  one minor step in the same commit). This is the ONLY ModalShell
  contract change authorized. Anything further: STOP.

**The image overlay recomposes onto the viewer variant** (owner:
image-overlay; `KIT_IMAGE_OVERLAY_VIEW_CONTRACT_VERSION` stays
`"1.0.0"`, presentation-only recomposition; the README rewrites):

- Shell: `KitModalFrame` `variant="viewer"`, no `panelClassName`
  width cap (the 76rem panel cap belongs to the dead panel).
- Anatomy, a shrink-wrapped column (`w-fit max-w-full`) centered in
  the viewport, so every piece takes the image's own width:
  1. **The image**, `display: block`, natural aspect, no letterbox
     bed, no object-contain box. Caps, desktop (700px and up):
     `max-w-[min(88vw,76rem)]`, `max-h-[78dvh]` (leaving room for
     the shelf; the witness used 88vw and 72dvh, the 76rem ceiling
     matches our wider kit scale; both numbers are defaults, listed
     in OPEN FOR BRIAN). Caps, mobile (under 700px), per R5 the
     maximum available space: `max-w-[100vw]` with only
     `px-[var(--space-2)]` breathing room on the column, and the
     image takes the full remaining height of the 100dvh column
     after the shelf (flex layout, image `min-h-0 flex-1
     object-contain` INSIDE its own box so it never overflows, but
     the box itself shrink-wraps the rendered image).
  2. **The gold hairline**, `1px solid var(--gold-ornament)`,
     `rounded-[var(--radius-md)]`, `overflow-hidden`, wrapping the
     IMAGE ALONE, snapped to its rendered edges. Never around empty
     space: the border sits on the element whose box IS the image.
  3. **The action shelf**, directly beneath the hairline frame,
     width-synced to the image by construction (same shrink-wrapped
     column), `mt-[var(--space-3)]`. Recipe unchanged from today:
     `bg-[var(--surface-1)]`, `border border-[var(--line)]`,
     `rounded-[var(--radius-md)]`, `p-[var(--space-3)]`, centered
     row `gap-[var(--space-3)]`, carrying Love, Save, Share exactly
     as built (same buttons, same selection-state law, same
     `aria-pressed`).
- **No creator handle on the viewer** (R2): none exists today and
  none is added. The `title` prop STAYS in the contract and becomes
  the accessible name only (the frame's `ariaLabel` path); the
  visible title line below the figure is REMOVED, matching the
  witness's chromeless intent. The witness renders no text at all
  around the image. This visibility change is a documented default,
  listed in OPEN FOR BRIAN; the prop surface does not change.
- **Zoom and pan carry over unchanged** from the R4 build (wheel
  toward cursor, double-click 1x/2x, two-pointer pinch, drag-pan
  while zoomed, ceiling 4x, translate clamped, `touch-action: none`
  only while zoomed, reset by unmount), now operating on the
  hairline-framed image box. R2 restates this feature set and adds
  nothing new to it. `zoomDisabled` stays for the no-image state.
- **No-image fallback**: the `--surface-1` block with the geometric
  mark, inside the hairline frame at a fixed `aspect-[5/3]`
  `w-[min(88vw,40rem)]` stand-in box, shelf still rendered beneath
  (actions stay reachable), zoom disabled. Fallback box size is a
  default, not a ruling.
- Fixtures carry over unchanged (default, loved, saved,
  longestTitle, noImage). Callers unchanged: Community, Vault,
  Creators thumbnails, package preview, and W2's Images page all
  render the same shell.

**Law edits for R2 and R5** (same commit):

- docs/BUILD-BLUEPRINT.md 2.16 gains entry **(r) Image viewer law
  (R2, R5), RULED 10 Aug 2026**: the image viewer is its own
  surface, never a panel with an image inside it. Gold hairline
  snapped to the image's own edges, never around empty space.
  Surround is the sticky nav treatment (canvas 88 percent mix plus
  `--blur-chrome`). Action shelf snaps to the image's width. No
  creator handle on the viewer. Zoom by wheel, double-click, and
  pinch; pan by drag while zoomed; sensible ceiling; reset on
  close. On mobile the image takes the maximum available space.
- docs/BUILD-BLUEPRINT.md 2.14 (the interim image overlay spec)
  gains a supersession line pointing at (r).
- docs/DESIGN-TOKENS.md, `--blur-chrome` row: legal-on gains "the
  image viewer veil (R2, 10 Aug 2026, Brian's ruling; the one
  floating surface that carries chrome frost instead of the
  scrim-plus-`--blur-panel` pair)". The never-on column drops
  "floating panels" to "other floating panels". No token value
  changes; no new token is minted.

### 1.3 R1: the credits collapse (owners: credits, asset-detail-popup)

**The credits package gains a modal composition.**
`KIT_CREDITS_VIEW_CONTRACT_VERSION` moves `"1.0.0"` to `"1.1.0"`
(additive: a second documented component in the same package).

- New files: `components/kit/KitCreditsModal.jsx` (shell) and
  `components/kit/credits/KitCreditsModal.view.jsx`. Props:
  `credits` (same item shape), `LinkComponent` (shell injects
  next/link), `onClose` (callback or null). Documented in the same
  contract file under the 1.1.0 note.
- Anatomy: `KitModalFrame` `variant="modal"`
  `panelClassName="w-full max-w-xl"` (the popup's own width, so the
  secondary modal occupies the same space per R1; on mobile both are
  full-screen per R4 by construction). Inside: a header row with a
  BACK control (left-pointing chevron icon plus the word "Back",
  `cf-btn cf-btn--secondary cf-btn--sm` recipe at desktop density)
  and the gold uppercase "Credits" label; beneath, a scrollable list
  region (`overflow-y-auto`, the frame's own max-height doing the
  bounding) rendering `KitCreditsView` with the FULL credits list.
  Handles stay links routing to `/studio/profile/[username]` exactly
  as the credits package already routes.
- Both the back control and the frame's X fire `onClose`; Escape and
  veil click close per frame law. Closing the credits modal returns
  to the popup beneath, untouched, scroll position preserved (the
  popup never unmounts while the credits modal is open).

**The popup collapses its credit rendering.**
`KIT_ASSET_DETAIL_POPUP_VIEW_CONTRACT_VERSION` stays `"2.1.0"`: the
`credits` prop, its shape, and every callback are unchanged; how
credits PRESENT changes, which is exactly what contract law permits.

- In place of the full `KitCreditsView` panel, the popup renders a
  single-row collapsed credit block on the same bed recipe
  (`--surface-1`, `--line` border, `--radius-md`,
  `p-[var(--space-4)]`): the gold "Credits" label, the FIRST credit
  only ("{kindLabel} from {handle}", handle linked as today), and,
  when `credits.length > 1`, a "View all credits" control (quiet
  tertiary text button, `--gold-ornament` text, `--text-ui`,
  rendered as "View all credits (N)" with N the total count; label
  copy is fixture-grade, Brian's to rewrite). One credit only: no
  control, just the row. Zero credits: nothing renders, as today.
- The control opens `KitCreditsModal` stacked above the popup.
  Open state is presentation-only local state in the popup view.
  While the credits modal is open the popup's own frame must not
  answer Escape (otherwise one keypress closes both layers): the
  popup shell passes `closeOnEscape={false}` and
  `closeOnBackdrop={false}` down while the stacked modal is open.
  If threading that state from the view to the shell requires a new
  popup prop, STOP: the sanctioned implementation is to mount the
  credits modal from the popup VIEW with the open state beside it,
  and to suppress the popup frame's dismissal via the props the
  frame already has, composed in the popup shell with a
  view-reported open flag. If the existing prop surface genuinely
  cannot express it, that is a stop-and-report, not an invention.
- Space budget (R1's point): the popup body gives its height to art
  and description; the credit block is one row tall regardless of
  credit count.
- Fixtures: the existing popup fixtures with credits keep their
  arrays; one fixture (`adventure`) grows to five credits so the
  collapsed row, the count, and the modal's scroll are all
  exercised. The credits package fixtures gain a
  `manyCredits` fixture (eight rows) for the modal preview.
- Preview: `app/dev/ui-preview/kit-credits/` gains a modal section;
  the popup preview exercises the stacked flow.
- CSV rows, same commit: the "View all credits" control, the credits
  modal's back control, and a note update on the existing credits
  handle-link row. Rollup note per 0.11.

**Law edit for R1** (same commit): docs/BUILD-BLUEPRINT.md 2.16
gains entry **(s) Credits collapse law (R1), RULED 10 Aug 2026**:
the asset detail popup shows only the first credit plus a View all
credits control opening a secondary modal in the same space,
scrollable, handles routing to profiles, with a back path returning
to the popup beneath. Popup space budget goes to art and
description, not the credit list.

### 1.4 R6: the mobile banner proportions (owner: promo-banner)

`KIT_PROMO_BANNER_VIEW_CONTRACT_VERSION` stays `"1.1.0"`
(presentation only; no prop changes).

- The `bottom` treatment's mobile aspect moves from `aspect-[5/3]`
  to `aspect-[1/1]` (390 wide renders 390 tall, a 67 percent height
  increase; more artwork shows). Desktop unchanged:
  `min-[700px]:aspect-[35/12]`. The `top` and `card` treatments are
  untouched (R6 names the bottom promo banner only). The 1/1 value
  is this plan's default for "taller", listed in OPEN FOR BRIAN
  with the alternative reading 4/5.
- The CTA button gets visually smaller on mobile WITHOUT breaking
  the 44px touch floor (FRONTEND-SOP section 2, a law this plan
  cannot and does not override): under 700px the button renders
  `px-[var(--space-4)]` (from the `cf-btn` default `--space-6`) and
  `text-[length:var(--text-ui)]` (from `--text-cta`), height
  staying `--control-md`. Implemented as responsive utility classes
  on the banner's own CTA, not an edit to `.cf-btn` (the shared
  recipe serves every button in the app and is not forked for one
  banner). If Brian wants the button physically shorter than 44px,
  that contradicts the touch-floor law and needs his explicit
  ruling: listed in OPEN FOR BRIAN.
- Verify: at 390 the banner is taller, the art region visibly
  larger, the button visually lighter, copy uncrowded; at 1440
  pixel-identical to today.

**Law edit for R6** (same commit): docs/BUILD-BLUEPRINT.md 2.3
(banner treatments) records the mobile bottom-banner aspect change,
and 2.16 gains entry **(t) Mobile banner law (R6), RULED 10 Aug
2026**: the bottom promo banner on mobile is taller with a smaller
button so more artwork shows; desktop proportions unchanged.

### 1.5 R3: the mobile verification method, written into law

- docs/FRONTEND-SOP.md section 8 gains, after the dev-server
  paragraph: "Mobile verification method, RULED 10 Aug 2026 (R3).
  All mobile verification uses the Chrome DevTools MCP emulate
  command with viewport 390x844, deviceScaleFactor 2, mobile true,
  touch enabled. The resize command is banned for mobile
  verification: it clamps near 500px wide and has produced false
  passes. A report claiming a 390 check that used resize is a
  failed report."
- Every generated brief restates this rule; docs/SPRINT-D-SONNET-BRIEF.md
  carries it in RULES IN FORCE and VERIFY.

### 1.6 The W1 re-verification sweep (R3 applied retroactively)

After 1.1 through 1.5 land: a true-390 re-verification pass of the
whole Sprint A polish surface, since prior mobile passes are suspect
under R3's finding.

- Surfaces: `/dev/ui-preview/community-v2-page`,
  `creators-v2-page`, `vault-v2-page`, and the package previews for
  studio-page, asset-detail-popup, image-overlay, credits, dropdown,
  promo-banner, creator-card, studio-filter-bar, modal-frame. Every
  fixture state. Emulate 390x844x2 mobile touch, per R3.
- Checks per surface: no horizontal overflow, nothing clipped,
  every control reachable and 44px at coarse pointer, modals
  maximize per R4, sheets show the R7 header, the viewer fills per
  R5, the R1 five-edge width measurement on the three pages, zero
  new console errors.
- Findings are fixed in the same workstream ONLY when the fix is
  presentation-only within existing contracts; anything else is
  logged under OPEN FOR BRIAN or as a stop, never guessed. Every
  finding and its disposition is reported, including "none found"
  if true.

## 2. W2: the Images page (absorbs and supersedes SPRINT-B-PLAN)

Everything in docs/SPRINT-B-PLAN.md carries forward with these
inheritance updates; where this section is silent, the Sprint B text
as absorbed here stands. The Sprint B pair is marked superseded at
their file heads and is no longer executed from.

- Files, composition, wiring, fixtures, parity echo, and CSV exactly
  per the absorbed Sprint B sections 1 through 5: 
  `app/studio/v2/images/page.jsx` plus `ImagesV2Mockup.jsx`, mirror
  `app/dev/ui-preview/images-v2-page/` with
  `ImagesV2PagePreviewClient.jsx`, composed inside
  `KitStudioPageView` (R1 width law); header eyebrow "Create", title
  "Images"; filter bar with Linked asset (Characters, Stories,
  Adventures, Unlinked) and Style (Anime, Realistic) multi-selects,
  sorts Newest, Most hearted, Most saved; view toggle; eighteen
  fixture images; cards `assetKind="image"` badge-free with
  hearts/saves stats; load more PAGE_SIZE 12; empty and loading
  states on the standing recipes; bottom banner selling the Vault;
  sidebar preview nav flips Images to `isBuilt: true`; parity echo
  over the 70 rows (48 image-studio, 22 image-library) with the
  Vault echo's borrow of the 22 named in the echo header; composer
  rows land Flagged, never invented into UI.
- **Inheritance updates (new since Sprint B was written):**
  - Cards open the R2/R5 viewer: hairline snapped to the image,
    shelf at image width, chrome-frost veil, full-space mobile.
    No panel, no title line.
  - Every modal surface reached from this page (viewer; the popup
    if any fixture routes there, none is planned) maximizes on
    mobile per R4.
  - The filter bar's dropdown sheets at 390 carry the R7 header row
    by construction.
  - The bottom banner renders the R6 mobile proportions.
  - Verification uses the R3 emulate method, stated in the brief.
- Sprint B's OPEN FOR BRIAN items 1 through 5 carry forward
  unchanged into this plan's consolidated list.

## 3. W3: the Stories hub at /studio/v2/stories

Build order note, deliberate: docs/BUILD-BLUEPRINT.md 3.1 places
Stories at row 4, before Images at row 5. Brian's 10 Aug gate
manifest orders W2 Images before W3 Stories; that manifest is the
ruling this ordering rides on, recorded here as 0-style fact, not
re-decided.

Scope: the hub only. The chat room `[id]` surface is excluded by the
standing sweep-scope ruling (blueprint 3.1 row 4); its rows land
Deliberately excluded in the echo, citing that ruling.

### 3.1 Files

- `app/studio/v2/stories/page.jsx` (the 3-line PRE-PARITY wrapper,
  route-law comment citing blueprint 3.3) plus `StoriesV2Mockup.jsx`
  (client, fixture-driven, presentation only).
- Mirror `app/dev/ui-preview/stories-v2-page/page.jsx` plus
  `StoriesV2PagePreviewClient.jsx`, byte-for-byte the pattern of the
  other mirrors (StudioShellView, `studioSidebarPreviewFixture`,
  local collapse state, real StudioTopBar, production `notFound()`).

### 3.2 Composition (top to bottom, inside KitStudioPageView per R1)

1. `harnessSlot`: fixture-mode row (Default, Empty, Loading).
2. `headerSlot`: StudioPageHeaderView, eyebrow "Play", title
   "Stories", description "Pick up where you left off, or start
   something new." (fixture copy, flagged). Description passed as
   the `description` prop.
3. `filterBarSlot`: KitStudioFilterBarView, search placeholder
   "Search your stories"; per product model 3.1 for Stories:
   - **Type** (multi-select): Character, Story, Adventure (display
     names via the terminology module; counts from fixtures).
   - **Status** (multi-select): In progress, Startable.
   - **Visibility** (multi-select): Private, Internal, Public,
     Canon (own-work context, so visibility rows are legal per the
     tag economy).
   - **Rating** (multi-select): the three tiers read from
     `CONTENT_RATING_TIERS`, exactly as Community wires them.
   - `sortOptions`: Latest activity (`recent`, default), Title A to
     Z (`title`).
   - `viewModeSlot`: present (grid/list), this plan's default.
4. `children`, two sections in one column:
   - **The Continue group leads** (product model 4.2). Each
     in-progress item renders as `KitPromoBannerView`
     `treatment="card"` (the blueprint 3.1 row 4 note, "continue-card
     usage of promo-banner treatment (b)", is exactly this):
     art, eyebrow "Continue", title the story title, line "Last
     played {relative time} · {kind display name}" (fixture copy),
     CTA "Continue" firing a fixture no-op. Stacked
     `gap-[var(--space-4)]`, at most three shown, with a quiet
     "Show all in progress ({N})" load-more style control when more
     exist. Empty Continue group: the section renders nothing (no
     empty card; the startable shelf carries the page).
   - **The startable shelf**: section label "Start something"
     (scope 1 section-label law: gold uppercase label, short solid
     gold rule to its right), then the standard
     `KitCreationCardView` grid/list exactly as Vault composes it
     (grid 2/3/4, list 1/2 at 1100px), badges per the tag economy
     (visibility badges legal here, own-work context; Canon the
     only gold badge), stats `{plays, hearts, saves}`, Expand
     opening `KitAssetDetailPopup` (Play primary per R9, credits
     collapsed per R1) for character/story/adventure kinds.
     KitLoadMoreView, PAGE_SIZE 12.
   - The Continue group is NOT duplicated into the shelf: an
     in-progress item appears once, in Continue, and is excluded
     from the shelf list (the model's "next session in one place"
     reading; recorded as this plan's default).
   - Filters and search apply to the startable shelf; the Continue
     group ignores filters but respects search (title substring).
     This split is a default, listed in OPEN FOR BRIAN.
5. `bannerSlot`: bottom KitPromoBannerView (`bottom`, `uniform`,
   R6 mobile proportions): eyebrow "Play", title "Worlds worth
   committing to.", CTA "Browse Adventures" (journey loop: Stories
   sells Adventures; fixture copy, flagged).

### 3.3 Wiring (all fixture-local)

- Sixteen fixture items: four in progress (two stories, one
  adventure, one character chat), twelve startable across all three
  kinds and all four visibilities, both ratings mix, three long
  titles, varied stats and recency. Media arrays sized to exercise
  the popup carousel on at least two items; credits arrays on at
  least two (one with five credits, exercising the R1 collapse).
- Like/Save toggle local `likedIds`/`savedIds`; popup wired exactly
  as Vault wires it (media, credits, isLiked/isSaved, callbacks,
  onViewCatalogue fixture no-op).
- Sidebar preview nav: flip Stories to `isBuilt: true` in
  `useStudioSidebarViewModel.js` and `StudioSidebar.fixtures.js`
  (preview surface only; the real sidebar gains nothing).
- Every display string for kinds and ratings through the
  terminology module. Backend names never render.

### 3.4 Parity echo (ends the workstream, in the report)

Every docs/APP-FUNCTION-MAP.csv row for `/studio/story-rooms`
(17 rows at this session's count) marked Present, Deliberately
excluded (ruling cited), or Flagged; every row for
`/studio/story-rooms/[id]` (45 rows) Deliberately excluded citing
the chat-room sweep-scope ruling (blueprint 3.1 row 4). The 10
unassigned `/studio/games` rows overlap Play > Stories per
docs/APP-FUNCTION-INVENTORY.md pass C; they are NOT claimed by this
page and land Flagged with the note "unassigned route, overlaps
Stories, needs Brian's ruling". Recount the rows at execution time;
the counts here are this session's and the CSV is living. A fixture
no-op is not Present. One open flag holds the page at its staging
address, out of the sidebar, per route law.

### 3.5 CSV

New rows in the same commit for every control the page ships
(search, four dropdowns, sort, view toggle, continue cards and
their CTA, show-all-in-progress control, creation cards, popup
open, load more, banner CTA), destination_page "Play > Stories".
Rollup note per 0.11.

## 4. W4: the Account draft restyle at /studio/v2/account

The live account page (`/studio/account`) recomposed in the v2
design system, fixture-driven, auth-free, out of the sidebar. The
live page is READ ONLY reference and is not edited, per the
strangler pattern. Account sits OUTSIDE the ruled nine-page model
(docs/APP-FUNCTION-INVENTORY.md pass C names it unassigned); Brian's
gate manifest orders this draft by name, which is the ruling the
route rides on. It joins the v2 tree as a staging draft, not a
tenth journey destination; the journey loop and sidebar are
untouched.

### 4.1 Files

- `app/studio/v2/account/page.jsx` (PRE-PARITY wrapper) plus
  `AccountV2Mockup.jsx` (client, fixture-driven).
- Mirror `app/dev/ui-preview/account-v2-page/page.jsx` plus
  `AccountV2PagePreviewClient.jsx`, the standard mirror pattern.
- No sidebar entry of any kind: the preview nav has no Account row
  and gains none.

### 4.2 The three defects, fixed in the draft (0.9 evidence)

1. **Title collision**: the draft passes the page description
   through StudioPageHeaderView's `description` prop (the
   constrained `max-w-[44rem]` paragraph below the H1), never as
   children. Nothing renders beside the title.
2. **Stat duplication**: exactly ONE stats block on the page
   (the five-tile metrics row: Characters, Canon, Interactions,
   Likes, Images), fixture-fed, rendered once in its own section.
   The coins panel renders balance and its actions WITHOUT the
   hardcoded zero-stat grid; that grid does not carry over.
3. **Raw controls**: every control resolves through the design
   system: `cf-field` recipes for inputs and textareas (visible max
   counts kept), `cf-btn` variants for every button, `KitDropdown`
   (single-select) replacing `CrestfallSelect` for the content
   preference, `KitModalFrame` for all three modal surfaces (age
   gate notice, buy-coins notice, default PC picker), the
   `kit-search-input` recipe for the picker's search field, and a
   `cf-btn cf-btn--secondary` Sign Out control replacing the raw
   anchor. No `white/10`, `black/35`, `rounded-xl`, or legacy
   `--muted-gold` bridge vars anywhere in the draft. Tokens only.

### 4.3 Composition

Inside `KitStudioPageView` (R1 one-width law; `filterBarSlot` and
`bannerSlot` empty: Account is not a browse page and sits outside
the journey loop, so no banner; both absences are defaults listed
in OPEN FOR BRIAN):

1. `headerSlot`: eyebrow "Account", title "Profile &amp;
   Preferences" (title copy carried from live), description via the
   prop.
2. **Identity section**: avatar initial circle, `@username`, email
   line, "View public profile" link (to the live
   `/studio/profile/[username]`, the standing cross-design link),
   one "Save profile" action (`cf-btn cf-btn--primary`). ONE save
   control at the section top; the live page's duplicate bottom
   save button is dropped in the draft (a deliberate
   simplification, listed in the parity echo as Present-once and in
   OPEN FOR BRIAN).
3. **Profile media section**: avatar and banner slots with their
   honest "Choose Soon" disabled stubs, carried as stubs (HIDE/STUB
   law: they are already honest).
4. **Stats section**: the single five-tile metrics row.
5. **Coins section**: balance line, explainer, "Buy coins soon"
   control opening the buy-coins notice modal on KitModalFrame.
6. **Account form section**: read-only login email, contact email,
   username, display name (cf-field, counters), content preference
   as a single-select KitDropdown whose non-SFW picks open the age
   gate notice modal (same intercept the live page performs, wired
   to fixture state); tier labels read from
   `CONTENT_RATING_TIERS`.
7. **Default Player Character section**: current-selection card,
   "Choose" opening the picker modal (KitModalFrame, search,
   fixture PC grid, select and clear), "Clear" danger button.
8. **Public profile text section**: tagline, description,
   announcement textareas (cf-field, counters).
9. **Settings rows**: the six subpage links (Subscription,
   Preferences, Appearance, Notifications, Privacy, Safety &amp;
   Content Settings) as one list of kit-styled rows routing to the
   LIVE `/studio/account/*` subpages (old pages stay routable under
   the strangler; no v2 subpages are built or stubbed this sprint).
10. **Sign out row**: styled control, fixture no-op in the draft
    and the mirror.

All data fixture-local, shapes mirrored from the live payload
mapping (`accountToForm` field names: username, display_name,
contact_email, tagline, description, announcement,
content_rating_preference, default_player_character_id, coin
balance, metrics). No fetch anywhere in the draft. Field length
caps read from `lib/shared/profile/constants` (shared constants,
not a backend call).

Fixture states: `default` (populated account), `empty` (new
account: no username, no default PC, zero metrics), `longestContent`
(caps exercised on every field, longest display name and tagline),
plus modal-open walks in the mirror.

### 4.4 Parity echo (ends the workstream, in the report)

Every docs/APP-FUNCTION-MAP.csv row for `/studio/account` (29 at
this session's count) and its six subpages (9 more) accounted one
by one: Present (file and line in the draft), Deliberately excluded
(ruling cited), or Flagged. Recount at execution time. Expectations
stated honestly in advance: form fields, modals, picker, links, and
stats land Present against fixtures; the subpage CONTENTS stay on
the live pages (their rows are the subpages' own and land Present
via the routed link only where the row IS the link, otherwise
Flagged); real persistence (save round-trip, metrics fetch) lands
Flagged (fixture no-ops are not Present). The 83-item live-control
inventory from this session's read is the completeness check
against the CSV; anything on the page but missing from the CSV is
named in the echo (the CSV gains rows only for controls the DRAFT
ships).

### 4.5 CSV

New rows for every control the draft ships, destination_page
"Account (outside nine-page model, staging draft)". Rollup note per
0.11.

## 5. Phase order, commits, dependencies

| Phase | Workstream | Delivers | Depends on |
|---|---|---|---|
| 1 | W1 | R3 law edit (SOP section 8); frame 1.1.0: R4 mobile maximize, R7 sheet header, viewer variant shell (empty); dropdown clearance removal; blueprint 2.5, 2.16 (p)(q), product model 3.5 edits | nothing |
| 2 | W1 | R2/R5 viewer rebuild on the viewer variant; token-law amendment; blueprint 2.16 (r), 2.14 note | 1 |
| 3 | W1 | R1 credits collapse: KitCreditsModal, popup recomposition, fixtures, CSV; blueprint 2.16 (s) | 1 |
| 4 | W1 | R6 banner mobile proportions; blueprint 2.3 note, 2.16 (t) | nothing |
| 5 | W1 | True-390 re-verification sweep of the Sprint A polish surface per 1.6; presentation-only fixes; findings log | 1, 2, 3, 4 |
| 6 | W2 | Images page, mirror, fixtures, sidebar preview flip, CSV, parity echo (70 rows) | 1, 2 (viewer), 5 |
| 7 | W3 | Stories hub, mirror, fixtures, sidebar preview flip, CSV, parity echo (62 rows plus the 10 games flags) | 1, 3 (popup credits), 5 |
| 8 | W4 | Account draft, mirror, fixtures, CSV, parity echo (38 rows) | 1, 5 |
| 9 | all | Handoff update, supersession check, final report | all |

One phase, one or more logical commits, committed and pushed at
phase end. Every phase re-runs the SOP section 3 checklist for the
packages it touched. The brief authorizes stopping cleanly at any
workstream boundary (after phases 5, 6, 7, or 8) when context
thins; W2, W3, and W4 each stand alone once W1 is landed.

## 6. Fixture states required, complete list

- modal-frame: existing fixtures carry over; the fixtures array
  gains a `viewer` entry and a sheet entry exercising the header
  row.
- image-overlay: default, loved, saved, longestTitle, noImage
  (carried; content unchanged, rendering new).
- credits: existing six carry over plus `manyCredits` (eight rows).
- asset-detail-popup: existing six carry over; `adventure` grows to
  five credits.
- promo-banner: existing fixtures carry over (mobile aspect is
  treatment-internal).
- Images page: eighteen images per W2; Default, Empty, Loading.
- Stories page: sixteen items per 3.3; Default, Empty, Loading.
- Account page: default, empty, longestContent per 4.3.

## 7. Contract version summary (the only authorized contract changes)

| Contract | From | To | Why |
|---|---|---|---|
| KitModalFrame | 1.0.0 | 1.1.0 | additive `variant: "viewer"`; R4 mobile maximize and R7 sheet header ride as presentation |
| ModalShell (components/ui) | current | one minor step | ONLY if the viewer veil needs an additive `veilClassName` passthrough; otherwise untouched |
| KitCredits | 1.0.0 | 1.1.0 | additive KitCreditsModal composition in the package |
| KitImageOverlay | 1.0.0 | 1.0.0 | presentation-only recomposition (R2/R5) |
| KitAssetDetailPopup | 2.1.0 | 2.1.0 | credits presentation collapse (R1); prop surface unchanged |
| KitPromoBanner | 1.1.0 | 1.1.0 | mobile proportions, presentation only (R6) |
| KitDropdown | 1.0.0 | 1.0.0 | dead clearance padding removed (R7), presentation only |
| KitStudioPage, KitCreationCard, KitCreatorCard, KitStudioFilterBar, KitLoadMore, KitBadge, KitFilterChip, StudioPageHeader | unchanged | same | consumed, not changed |

Any step that appears to need any contract, ViewModel, or data-flow
change beyond this table STOPS and is written up, never decided.

## 8. Law document updates, complete list (R2 through R7)

| Document | Edit | Phase |
|---|---|---|
| docs/FRONTEND-SOP.md section 8 | R3 mobile verification method paragraph (1.5) | 1 |
| docs/BUILD-BLUEPRINT.md 2.5 | R4 maximize wording replaces the phone dock line; R7 sheet header sentence | 1 |
| docs/BUILD-BLUEPRINT.md 2.16 | new entries (p) R4, (q) R7, (r) R2/R5, (s) R1, (t) R6 | 1, 2, 3, 4 |
| docs/BUILD-BLUEPRINT.md 2.14 | supersession note pointing at (r) | 2 |
| docs/BUILD-BLUEPRINT.md 2.3 | mobile bottom-banner aspect note (R6) | 4 |
| docs/CRESTFALL-PRODUCT-MODEL-UXUI.md 3.5 | R4 maximize wording replaces the bottom-dock sentence | 1 |
| docs/DESIGN-TOKENS.md `--blur-chrome` row | viewer veil legal-use amendment under R2 (1.2) | 2 |
| docs/SPRINT-B-PLAN.md, docs/SPRINT-B-SONNET-BRIEF.md | superseded headers pointing here | done at this gate |

R1 is a component-law ruling with no standing doc line to amend
beyond its new 2.16 entry (s).

## OPEN FOR BRIAN

Nothing here blocks the run; each names the default built. Items 1
through 10 are the standing Sprint A set, renumbered where resolved;
11 onward are new at this gate.

**Standing from Sprint A and its polish pass (ten carried, one
resolved):**

1. The lighter wash value for artwork under a tag bed (in fixtures
   since the batch-two sweep).
2. All fixture copy across every page and banner (descriptions,
   banner titles and CTAs, catalogue-slide line, empty states, and
   now the "View all credits" label, the Stories and Account page
   copy) is placeholder, yours to rewrite.
3. Creators "Most hearted" sort still orders by works as proxy; the
   creator-card contract has no hearts stat.
4. Vault's old mobile density toggle has no ruled successor.
5. The three my-creations card actions (Set as default Player
   Character, Start chat, Generate image) still have no ruled
   destination.
6. Saved-from-others Vault items carry no visibility badge; confirm
   or rule a "Saved" mark.
7. Creators grid columns 1/2/3 and Vault list two-up, confirm at
   render.
8. Sidebar group label color under R7's earlier scope ruling: built
   default gold uppercase; alternative ink-faint.
9. The R8 stats placement pick (the builder shipped stacked or
   side-by-side per the logged choice): review the logged pick.
10. The Creators performance eager/fetchpriority above-fold item
    from the polish pass: logged as not applied (needed a per-card
    position prop the kit API freeze forbade); rule whether to
    authorize the prop.
    RESOLVED and dropped: the former "desktop zoom triggers" item;
    R2 ratifies wheel, double-click, and drag.

**New at this gate:**

11. Viewer title visibility (1.2): the witness renders no text
    around the image, so the built default removes the visible
    title line and keeps `title` as the accessible name only.
    Confirm, or rule the title back (it would sit beneath the
    shelf).
12. Viewer desktop size caps (1.2): built defaults
    `max-w-[min(88vw,76rem)]`, `max-h-[78dvh]` (witness used 88vw
    and 72dvh at a narrower 60rem scale). Confirm or name values.
13. Mobile bottom-banner aspect (1.4): built default 1/1; the
    alternative taller reading is 4/5. One class either way.
14. Mobile banner CTA size (1.4): built default keeps the 44px
    touch-floor height and lightens padding and type. A physically
    shorter button contradicts the touch-floor law and needs your
    explicit override.
15. Sheets under R4 (1.1): built reading is that filter/sort/
    settings sheets stay bottom sheets (R4 names popup modals);
    confirm, or rule sheets full-screen too.
16. Stories Continue group behavior (3.2): built defaults are at
    most three continue cards with a show-all control, continue
    items excluded from the startable shelf, filters skip the
    Continue group while search reaches it. Any of the three is
    one ruling to change.
17. Stories sort set (3.2): built default Latest activity plus
    Title A to Z; the model's line for Stories names recency only.
18. Account draft banner and filter bar (4.3): built default is
    neither (Account is outside the journey loop and is not a
    browse page). Confirm, or rule a banner destination.
19. Account single Save control (4.3): the live page renders two
    Save buttons; the draft builds one at the section top. Confirm,
    or rule the bottom duplicate back.
20. The focus-trap gap (0.13): the frame has none, the witness has
    one. Adopting the witness's trap-and-return behavior for every
    frame surface is one ruling away; nothing is built unruled.
21. `/studio/games` (3.4): ten unassigned CSV rows overlap Play >
    Stories; the echo flags them and the page does not claim them.
    Ruling needed on where they land.

## Verification law for this sprint

Per FRONTEND-SOP section 8 as amended by R3 in Phase 1: rendered
checks only, Chrome DevTools MCP. Mobile FIRST via the emulate
command, viewport 390x844, deviceScaleFactor 2, mobile true, touch
enabled; the resize command is banned for mobile checks and any
result obtained with it is void. Then 1440. Every fixture state, on
the auth-free mirrors and package previews; page phases walk the
mirror sidebar expanded AND collapsed. The R1 five-edge measurement
(filter line inner row, heading block, grid container, load-more,
banner) within 1px on every page phase. R4: at 390 every popup
modal's panel measures the full viewport (window.innerHeight
matches panel height within the safe-area inset). R7: at 390 the
sheet close control's bounding box does not intersect any option
row's box. R2: the hairline's bounding box matches the rendered
image box within 1px on both axes at three aspect ratios (wide,
tall, square fixtures). R5: at 390 the image box width measures
viewport width minus the 2x `--space-2` breathing room. Zero NEW
console errors (the crestfall-seal.svg preload warning is known),
zero NEW ESLint errors (the three StudioSidebar.view.jsx
react-hooks/static-components errors are known standing debt), zero
em dashes in any touched file. Production build SKIPPED while the
dev server runs, flagged for a morning check. Anything unverified
is reported as unverified, never as done. Dev server law: check
3001 first, never restart Brian's server, own port and PID for
anything started, no broad process-name kills.
