# SPRINT-A-POLISH-PLAN v1.0.0, written 10 Aug 2026, branch design/kit-polish-3, planning gate only

Execution spec for Brian's eleven ratified rulings R1 through R11
(10 Aug 2026 gate), plus the Creators performance audit. Written by
the Fable planning gate of 10 Aug 2026 after reading, in order:
docs/HANDOFF-NEXT-CHAT.md, docs/SPRINT-A-PLAN.md,
docs/CRESTFALL-DESIGN-CONTEXT.md, docs/BUILD-BLUEPRINT.md,
docs/DESIGN-TOKENS.md, docs/FRONTEND-SOP.md,
docs/CRESTFALL-PRODUCT-MODEL-UXUI.md, docs/APP-FUNCTION-INVENTORY.md,
every components/kit/ package (all thirteen), the three v2 page
mockups and their mirrors, StudioShell.view.jsx,
StudioPageHeader.view.jsx, StudioSidebar.view.jsx,
lib/shared/presentation/terminology.js, and the live old-design
implementations this plan ports: the creation preview modal
(components/studio/creations/creation-preview-modal/, carousel and
catalogue CTA), the credits panel
(components/studio/creations/creation-credits/), and the attribution
resolver (lib/shared/creations/creationAttribution.js). Repo state
verified this session: branch design/kit-polish-3, tree clean, pushed,
Sprint A landed (commits 6fbeaf0 through 0de291d plus handoff 50ec0a5).

This plan is the execution spec for
docs/SPRINT-A-POLISH-SONNET-BRIEF.md. R1 through R11 are RATIFIED,
not open; nothing in them is re-decided here. Where this plan and a
law document disagree, the law document wins and the conflict is
escalated, never resolved locally.

## 0. Standing facts established this session (read before building)

1. **The R1 defect, measured in code.** Three width regimes coexist
   on every v2 page today. (a) StudioShell's content section pads
   `px-[var(--space-5)] sm:px-[var(--space-8)] lg:px-[var(--space-10)]`
   (StudioShell.view.jsx line 18). (b) Each page then wraps every
   non-filter section in its own
   `PAGE_COLUMN = "mx-auto max-w-[var(--container)] px-[var(--space-4)]
   min-[700px]:px-[var(--space-6)] min-[1100px]:px-[var(--space-10)]"`,
   stacking a second padding layer plus a 1200px cap plus centering on
   top of (a). (c) KitStudioFilterBar escapes (a) with matched negative
   margins, then re-applies its own inner padding at DIFFERENT tokens
   and breakpoints: `px-[var(--space-4)] min-[700px]:px-[var(--space-6)]
   min-[1100px]:px-[var(--space-10)]`. Net: at 1100px and up the filter
   line's controls sit 40px in from the shell edge while page content
   sits 80px in plus centering; at 390 the difference is 16px vs 36px.
   The heading separator, card grid, load-more, and bottom banner all
   live in regime (b), so every one of them is narrower than the
   filter line. This is the whole R1/R2 defect; the Creators banner is
   simply the most visible instance.
2. **R7 supersedes Follow-up 3.** The sidebar group-header treatment
   landed 10 Aug (gold label plus short solid gold rule beside it,
   StudioSidebar.view.jsx PreviewGroup, lines 344 to 361) is
   superseded by R7. The gold ornament rule beside a sidebar group
   label is now wrong by ruling. The three pre-existing
   `react-hooks/static-components` ESLint errors in that file remain
   standing debt: untouched, never counted as new.
3. **R9 supersedes the popup's Continue label.**
   useKitAssetDetailPopupViewModel.js maps adventure to "Continue";
   R9 rules Play universal. OPEN FOR BRIAN items 2 and 3 from
   docs/SPRINT-A-PLAN.md are resolved by R9 and R3 and drop off the
   open list.
4. **Ratings and terminology.** lib/shared/presentation/terminology.js
   remains the only source for display names and the three-tier
   rating mapping (SFW as Everyone, MATURE as Teen, EXPLICIT as
   Adult). Doc prose that disagrees is stale; the module wins.
5. **The rollup script is still not in the repo.** Every CSV edit in
   this pass logs "rollup not regenerated, script not in repo";
   docs/APP-FUNCTION-MAP.md is never hand-edited.
6. **The old credits render has a latent bug not to copy.**
   CreationPreviewModal.view.jsx line 411 renders
   `{credits.length && CreditsComponent ? ...}`, which emits a literal
   `0` text node when empty. The old design is NOT touched; the new
   KitCredits view returns null for an empty list.
7. **The credits panel has no CSV row.** The live credits feature
   (three surfaces per docs/COMPONENT-CENSUS.csv row 81) was never
   entered in docs/APP-FUNCTION-MAP.csv; the only "attribution" hit is
   an unrelated lore field. The R11 build adds the missing rows.

## 1. R1, R2, R6: the content width law, in the kit

### 1.1 Design

One width regime replaces the three in 0.1: **StudioShell's section
padding is the page container margin, and nothing else adds one.**

- Page sections (fixture-harness row, heading block, card grid,
  load-more, bottom banner) carry NO horizontal padding, NO max-width,
  NO centering margin of their own. Their content edge IS the shell's
  padded edge, at every width, both layouts.
- KitStudioFilterBar keeps its full-bleed background (the negative
  margins that cancel the shell padding are untouched) but its inner
  padding changes to mirror the shell token for token, breakpoint
  keyword for breakpoint keyword:
  `px-[var(--space-5)] sm:px-[var(--space-8)] lg:px-[var(--space-10)]`
  replacing the current `px-[var(--space-4)]
  min-[700px]:px-[var(--space-6)] min-[1100px]:px-[var(--space-10)]`.
  With the negative margin and the inner padding now the same three
  tokens on the same three keywords, the filter line's controls sit
  exactly on the shell content edge and can never drift from it
  silently.
- The `--container` (1200px) cap leaves these pages entirely. R1 says
  one content width, flush to the page container margins, no element
  narrower than the filter line; a centered cap re-creates exactly the
  narrower-column defect at wide viewports. `--container` stays a
  legal token elsewhere; it is simply no longer part of the v2 page
  skeleton.

### 1.2 The kit owner: new package `studio-page`

So the law lives in the kit and not in three page files, the page
skeleton becomes a kit piece. New package, full LOOM shape:

- `components/kit/KitStudioPage.jsx` (binding shell)
- `components/kit/studio-page/KitStudioPage.view.jsx`
- `components/kit/studio-page/useKitStudioPageViewModel.js` (thin
  pass-through, kit-batch practice)
- `components/kit/studio-page/KitStudioPage.contract.js`, line 1:
  `export const KIT_STUDIO_PAGE_VIEW_CONTRACT_VERSION = "1.0.0";`
- `components/kit/studio-page/KitStudioPage.fixtures.js`
- `components/kit/studio-page/README.md` (carries the width law text)
- Preview route `app/dev/ui-preview/kit-studio-page/` plus its client,
  `notFound()` in production.

Contract, prop by prop (all optional, all null-safe):

| Prop | Type | Meaning |
|---|---|---|
| `harnessSlot` | ReactNode | The fixture-mode row. Preview and staging harness only; real pages pass nothing. |
| `headerSlot` | ReactNode | The StudioPageHeaderView block. |
| `filterBarSlot` | ReactNode | The KitStudioFilterBarView. Rendered as a DIRECT child of the root with no wrapper, so the bar's own negative margins meet the shell padding with nothing in between. |
| `bannerSlot` | ReactNode | The bottom KitPromoBannerView. |
| `children` | ReactNode | Everything between the filter line and the banner: grid, list, load-more, loading, empty. |

Rendered anatomy: root `flex flex-col gap-[var(--space-6)]
py-[var(--space-6)]`; slots render in order harness, header, filter
bar, a `flex flex-col gap-[var(--space-6)]` content block around
`children`, banner. No horizontal class anywhere in the view. The
README states the law: "One content width per page. The shell's
section padding is the only horizontal margin. A consumer that adds
max-width, mx-auto, or horizontal padding around a slot is out of
contract."

Fixture states: `default` (all slots filled with placeholder blocks),
`noBanner`, `longestContent` (content tall enough to prove the sticky
filter slot docks while scrolling).

### 1.3 Page migrations

`CommunityV2Mockup.jsx`, `CreatorsV2Mockup.jsx`, `VaultV2Mockup.jsx`:
delete the local `PAGE_COLUMN` constant and every use; compose
`KitStudioPageView` with the existing sections as slots. Zero wiring
changes: state, fixtures, callbacks, and the filter bar props are
untouched. The three mirrors
(`community-v2-page`, `creators-v2-page`, `vault-v2-page` preview
clients) render the same mockups and need no edit of their own.

### 1.4 R2, the banner

With 1.1 through 1.3 landed the banner spans the full content width by
construction (it is a block-level child of the one column). Its fixed
proportions are already token-law in KitPromoBannerView
(`aspect-[5/3]` under 700px, `aspect-[35/12]` at 700px and up for the
`bottom` treatment) and scale with the column. No KitPromoBanner code
change is expected; the package is the R2 owner for verification and
its README gains the R2 sentence. Verify: no max-height or max-width
constrains the banner anywhere in the three pages; the banner's
rendered box is never narrower than the card grid above it and its
height is the aspect ratio's own result at that width.

### 1.5 R6, the heading block

StudioPageHeaderView already left-aligns eyebrow, title, and
description with no centering; inside the 1.2 column its `border-b`
separator spans the full content width by construction. No contract
change; the component is presentation-owner. One code check, no
restyle: confirm nothing in the header caps or centers the block
itself (the description's `max-w-[44rem]` measure cap is a reading
measure, not a column, and stays). Verify at render that the
separator's left and right edges measure identical to the filter
line's control edges.

### 1.6 Law-document edits for R1, R2, R6

- docs/BUILD-BLUEPRINT.md, chapter 2, new ruling entries appended to
  2.16 (kit revision rulings), dated 10 Aug 2026:
  - **(l) Content width law (R1).** One content width per page.
    The shell section padding is the page container margin; heading
    block, sticky filter line, card grid and list, load-more, and
    bottom banner share the same left and right edges, flush to that
    margin, both layouts, every width. No max-width cap, no second
    padding layer, no element in a narrower column than the filter
    line. The `studio-page` kit package owns the skeleton;
    `studio-filter-bar`'s inner padding mirrors the shell padding
    token for token.
  - **(m) Banner sizing law (R2), amends 2.3.** The bottom promo
    banner keeps its fixed per-treatment proportions and scales
    responsively with the content width. It is never narrower or
    shorter than the content above it.
  - **(n) Page heading law (R6).** Eyebrow, title, and description
    left-aligned to the content edge; the separator beneath the block
    spans the full content width per (l).
- docs/DESIGN-TOKENS.md: no edit. No new token exists in this sprint;
  every value below is an existing locked token.

## 2. R3, R8, R9: the asset detail popup recomposition

One contract bump covers all three rulings:
`KIT_ASSET_DETAIL_POPUP_VIEW_CONTRACT_VERSION` moves `"1.0.0"` to
`"2.0.0"` (a prop is replaced, which is a removal plus an addition;
majors on removal per contract law). R11 later adds `credits` as
`"2.1.0"` (section 5).

### 2.1 Contract v2.0.0, prop by prop

| Prop | Change | Type | Meaning |
|---|---|---|---|
| `assetKind` | kept | `"character"` \| `"story"` \| `"adventure"` | R9: the derived primary label is "Play" for ALL THREE kinds. The kind still drives nothing else today and stays in the contract as the popup's species key (future per-kind composition hangs on it). |
| `media` | REPLACES `imageSrc` | `{id: string, src: string}[]` | Carousel media, ported from the old preview modal's normalized shape. The view renders at most 4 items (the old modal's own cap, normalizeCreationPreviewMedia line 81) plus the synthetic catalogue slide. Empty or absent: the standard no-art fallback block renders and NO carousel chrome and NO catalogue slide render, matching the old modal's empty behavior. |
| `title` | kept | string | Now rendered in the BODY, not over art (2.4). |
| `subtitle` | kept | string | Body, under the title. |
| `badges` | kept | `{label, variant}[]` | Now rendered in the body above the title, `surface="canvas"` (default) since they no longer sit on art. |
| `stats` | kept | `{plays, hearts, saves, followers}` nullable each | Same icons and order. Placement per 2.5. |
| `description` | kept | string | Caps at three lines with See more (2.5). |
| `isLiked` | NEW (R3) | boolean | Like toggle state. |
| `isSaved` | kept | boolean | Save toggle state. |
| `onLike` | NEW (R3) | callback or null | Like toggle intent. |
| `onPrimaryAction` | kept | callback or null | Play intent (R9). |
| `onShare` | kept | callback or null | Share intent. |
| `onSave` | kept | callback or null | Save toggle intent. |
| `onViewCatalogue` | NEW (R8) | callback or null | The catalogue slide's CTA intent. Null-safe no-op in fixtures; the real destination (the old design routes owner context to `/studio/my-creations/[id]/image-library` and public context to `/studio/creations/[id]`, useCreationPreviewModalViewModel lines 84 to 101) is a later wiring concern, recorded in the README. |
| `credits` | arrives in v2.1.0 | see section 5 | Not part of this phase. |

ViewModel: `PRIMARY_ACTION_LABEL` collapses to "Play" for character,
story, and adventure (R9); `media` normalized to an array of valid
`{id, src}` entries.

### 2.2 Composition, top to bottom (supersedes plan-A 3.3's over-art header, by R8)

1. **Carousel frame** at the panel top, full inner width, art-bleed
   into the frame's top LARGE corners, `aspect-[5/3]`, `object-cover
   object-[center_18%]`. The title, subtitle, and badges MOVE OFF the
   art into the body: the art area now carries carousel chrome
   (arrows, dots), which cannot share the space with an over-art
   title block, and the old-design witness composes exactly this way
   (media frame carries chrome only). The bottom `--canvas` fade is
   removed with the over-art text it existed to serve.
2. **Body** (`p-[var(--space-6)]`): badge row (canvas surface), title
   (`font-display`, `--text-subhead`/`--lh-subhead`, `--ink`, keeps
   the `KIT_ASSET_DETAIL_POPUP_TITLE_ID` for the frame's
   `ariaLabelledBy`), subtitle (`--text-ui`, `--ink-dim`), then the
   description block and stats per 2.5, then credits (once 5 lands).
3. **Footer**, the R3 action row (2.3).

### 2.3 R3: the four-action footer, exact

Exactly four actions, left to right: **Like, Save, Share, Play.**

- Layout: `grid w-full grid-cols-4 gap-[var(--space-2)]` inside the
  body padding, `mt-[var(--space-4)]`. Each action is a full-cell
  button (`w-full justify-center`), so the four are evenly
  distributed across the modal's inner padding and each is centered
  in its quarter, vertically aligned, ONE ROW at every width
  including 390. Nothing wraps: labels carry `whitespace-nowrap`.
- Every action carries an icon plus its word at `--text-ui`:
  Like = lucide Heart plus "Like"/"Liked"; Save = Bookmark plus
  "Save"/"Saved"; Share = Share2 plus "Share" (Ruling 6); Play =
  Play icon plus "Play".
- Play keeps the primary treatment (`cf-btn cf-btn--primary`); the
  other three are `cf-btn cf-btn--secondary`. Toggled Like and Save
  follow the selection-state law: gold text plus the light `--fill`
  wash, icon filled, `aria-pressed`, never a bold border.
- Width check at 390: panel spans the viewport (bottom-docked sheet),
  inner width 390 minus 2 x `--space-6` = 342px, 4 cells of roughly
  82px each; icon 16 plus gap plus the longest word "Share"/"Saved"
  fits without wrap. Verified at render per the manifest.

### 2.4 R8: the carousel, ported from the live old design

Ported from creation-preview-modal (read this session; mechanics
cited by line in section 0 sources). All state is presentation-only
local view state; the popup unmounts on close so slide index resets
by construction.

- **Slide model:** N media items (max 4) plus one synthetic final
  slide at index N. Arrows wrap in both directions THROUGH the final
  slide (old VM lines 270 to 284). Dots render N+1 indicators; each
  jumps directly, the last labeled "View catalogue slide".
- **Arrows:** the frame's circular icon-button recipe
  (`--control-md`, `--radius-full`, `--surface-2` fill,
  `--line-whisper` border, `--shadow-popover`), absolutely positioned
  left and right, vertically centered, `aria-label` "Previous image"
  / "Next image". Rendered only when `media.length > 0`. Always
  visible (the old design has no swipe and none is invented; arrows
  and dots are the whole navigation, noted in the README).
- **Dots:** pill tray bottom-center over the art
  (`--surface-2` bed at low emphasis, `--line-whisper` border,
  `--radius-full`); active dot a gold lozenge
  (`h-[var(--space-2)] w-[var(--space-6)] bg-[var(--gold-action)]`),
  inactive `h-[var(--space-2)] w-[var(--space-2)] bg-[var(--ink-faint)]`,
  all `--radius-full`.
- **The catalogue slide** (the final slide, R8): backdrop is the
  FIRST media item under a flat `--scrim-strong` veil (the old
  design's raw rgba gradient literals are flagged, not copied; the
  token expresses the same darkening under token law). Centered card:
  `max-w-xs`, `bg-[var(--surface-4)]`, `1px --line` border,
  `--radius-md`, `--shadow-popover`, `p-[var(--space-6)]`,
  containing the gold eyebrow "Want to see more?", one short line
  "The full catalogue holds this creation's media library and
  details." (shortened from the old copy per R8's less-body-text
  direction; fixture copy, Brian's to rewrite), and the CTA button
  "View catalogue" (`cf-btn cf-btn--primary`) firing
  `onViewCatalogue`. R3's Play remains the popup's primary action;
  the slide CTA is content inside the media frame, the same
  primary-button recipe the old slide used.

### 2.5 R8: description clamp and the stats placement pick

- **Description:** renders at `--text-body`/`--lh-body` `--ink-dim`,
  measure-capped, clamped to THREE lines (`line-clamp-3`) when
  collapsed. A "See more" control (quiet tertiary text button,
  `--gold-ornament` text, `--text-ui`) expands in place; expanded
  state re-labels "See less" and removes the clamp. The control
  renders when the description exceeds a conservative always-clamps
  length (160 characters, a pure render decision so the stateless
  view needs no measurement effect; threshold recorded in the
  README). Overall body copy budget is LESS than the old modal: the
  520-character old limit is not ported; fixtures carry short
  descriptions.
- **Stats placement, both readings specced, builder picks at render
  and logs the choice (R8 verbatim):**
  - Reading A, stacked: description full-width, stat row beneath it
    (today's composition, clamp added).
  - Reading B, side-by-side: one row, description block `flex-1`,
    stat column right-aligned beside it (stats stacked vertically at
    `--text-label`, icons `--icon-sm`), collapsing to Reading A under
    700px where the row cannot hold both.
  The builder renders both against the longestCopy fixture at 390 and
  1440, ships whichever reads cleaner, and logs the pick and the
  reason in the report. The contract carries no placement prop; this
  is composition, not API.

### 2.6 Fixtures (KitAssetDetailPopup.fixtures.js, revised)

`character` (single media), `story` (two media), `adventure` (four
media, proving the cap plus the catalogue slide), `likedAndSaved`
(both toggles on), `longestCopy` (clamp plus See more forced), and
`noImage` (empty media: fallback block, no chrome, no catalogue
slide). All three kind fixtures now read "Play" (R9).

### 2.7 Caller migration and CSV

`CommunityV2Mockup.jsx` and `VaultV2Mockup.jsx`: fixture rows'
`imageSrc` feeds a one-item `media` array; two Community rows and two
Vault rows gain second/third media entries (draft assets) so the
carousel is exercised on live staging pages; `isLiked`/`onLike` wire
to the existing `likedIds` state; `onViewCatalogue` is a fixture
no-op. CSV rows added or updated in the same commit: popup Like
control, carousel previous/next controls, carousel dot indicators,
catalogue slide CTA, description See more toggle. Rollup note per 0.5.

## 3. R4: the image overlay treatment

Owner: `image-overlay` package. The view recomposes; the package's
prop surface is unchanged, so
`KIT_IMAGE_OVERLAY_VIEW_CONTRACT_VERSION` stays `"1.0.0"` (contract
law: presentation may change, reporting may not). The README rewrites
to the new treatment.

### 3.1 Anatomy

- The shell keeps `KitModalFrame` variant modal. `panelClassName`
  becomes `w-full max-w-[76rem]` (the `min-[700px]:w-fit` shrink-wrap
  is removed: R4 wants the image spanning the modal's full inner
  width, which needs a stable panel width for the zoom viewport).
- Inside the view's `p-[var(--space-6)]` content padding, one framed
  figure block spanning the full inner width:
  - **Hairline:** the whole figure block carries a thin gold hairline
    border: `1px solid var(--gold-ornament)` (ornament gold's ruled
    role explicitly includes decorative borders), `--radius-md`,
    `overflow-hidden`.
  - **Image viewport:** full width of the figure, `max-h-[70vh]`
    (65vh under 700px so the shelf and title stay on screen), the
    image centered `object-contain` on a `--canvas` bed so
    letterboxing reads as page ground, not panel.
  - **Action shelf:** directly beneath the image inside the same
    hairline frame, visually distinct and dark opaque:
    `bg-[var(--surface-1)]`, `border-t border-[var(--line)]`,
    `p-[var(--space-3)]`, a centered row (`gap-[var(--space-3)]`)
    carrying the existing three actions unchanged in behavior: Love
    (heart icon button), Save (bookmark icon button), Share (icon
    plus the word, rectangle). Toggled states keep the
    selection-state law.
- The title line moves BELOW the figure block, `--text-lead`
  `font-display` in `--ink` (it sits on the `--surface-4` panel now,
  not on art; the current `--art-ink` use is corrected as part of
  this recomposition).
- The no-image fallback keeps the existing `--surface-1` block with
  the geometric mark, inside the same figure frame, shelf still
  rendered (actions stay reachable), zoom disabled.

### 3.2 Zoom and pan

Presentation-only local state in the view (scale, translate), no
effects on product data:

- Pinch on touch zooms (two-pointer distance via pointer events).
- Pointer drag pans while zoomed (pointer capture; `cursor-grab` /
  `cursor-grabbing`); drag at scale 1 does nothing so the backdrop
  press-and-drag dismissal guard is never confused.
- Fine-pointer zoom defaults (R4 names touch only; the desktop
  trigger is this plan's documented default, listed in OPEN FOR
  BRIAN): wheel over the image viewport zooms toward the cursor
  (preventDefault scoped to the viewport so panel scroll is
  untouched elsewhere), and double-click toggles 1x to 2x.
  Double-tap on touch does the same.
- Ceiling 4x, floor 1x (the sensible ceiling, recorded in the
  README); translate clamped so the image never pans fully out of
  the viewport.
- Reset on close: the overlay unmounts on close everywhere it is
  used, so scale and translate reset by construction; the README
  records that a future persistent-mount consumer must reset
  explicitly.
- `touch-action: none` on the viewport only while zoomed;
  reduced-motion ships no animated transitions on transform.

### 3.3 Fixtures and callers

Existing fixtures carry over (default, loved, saved, longest title,
noImage). Zoom is interactive and not fixture-capturable; the VERIFY
walk exercises it live at both widths. No caller changes: Community,
Creators, Vault, and the package preview all render the shell
unchanged.

## 4. R5, R7, R10: small-batch rulings

### 4.1 R5, creator card actions

Owner: `creator-card`. The second action's label becomes "Profile"
(was "View profile"); both buttons gain `whitespace-nowrap`. Labels
are view-owned copy; the contract (handle, stats, callbacks,
`onViewProfile`) is untouched and stays `"1.0.0"`. Verify: at 390
(one-up), 700 (two-up), and 1100 plus (three-up), "Follow",
"Following", and "Profile" each render on one line, no wrap, no
truncation, no overflow.

### 4.2 R7, the two section-label scopes

Owner: StudioSidebar (presentation only; no contract exists for the
preview group markup). In `StudioSidebar.view.jsx` `PreviewGroup`:

- DELETE the short gold rule span beside the label (line 356 to 359
  today).
- ADD a plain full-width divider beneath the label row, matching the
  existing Legacy treatment exactly: the `SidebarDivider` recipe's
  line (`border-t border-[var(--line-strong)]`), full width of the
  nav column, `mb-[var(--space-2)]` before the group's rows.
- The divider renders in BOTH collapsed and expanded states (it is
  structural, like the Legacy dividers); the label stays
  expanded-only as today.
- The label's own treatment (gold uppercase `--text-label`
  `--track-label`) is unchanged: R7 bans the ornament RULE beside
  sidebar labels, not the label itself. Whether the label should also
  drop to the Legacy header's ink-faint is genuinely unstated and
  goes to OPEN FOR BRIAN with gold as the built default.

Law edit (R7's own instruction: write both scopes into the
section-label law so this stops being ambiguous):
docs/BUILD-BLUEPRINT.md 2.16 gains entry **(o) Section labels, two
scopes, RULED 10 Aug 2026**:

- Scope 1, page section eyebrows: gold uppercase label with one short
  solid gold rule to its right. Unchanged law.
- Scope 2, sidebar nav group headers (Play, Create, Explore):
  structural, not decorative. Label plus a plain full-width divider
  line beneath it, the Legacy divider recipe. No gold ornament rule
  beside a sidebar group label, and never both marks on one element.

The StudioSidebar README's preview-nav section updates to cite (o).
The three pre-existing ESLint errors in this file stay untouched.

### 4.3 R10, Remix in Type, full filter-surface audit

Audit of every filter surface in the new design, this session:

| Surface | Type dropdown? | Stories/adventures from others selectable? | Action |
|---|---|---|---|
| /studio/v2/community | yes, Remix row already present | yes | none, already compliant |
| /studio/v2/vault | yes, no Remix row today | yes (saved-from-others stories and adventures, and own remixes) | ADD Remix option row |
| /studio/v2/creators | no Type dropdown (metric sorts only per product model 3.1) | n/a | none; recorded |
| /studio/v2/images (Sprint B) | linked-asset and style facets, image kind only | no (images are not stories or adventures) | none; recorded in the Sprint B plan |
| Old-design pages | out of scope (held pages and legacy surfaces) | n/a | none |

Vault implementation: `TYPE_OPTIONS` gains
`{value: "remix", label: "Remix"}`; two or three fixture items gain
`isRemix: true` (a saved-from-others story, an own adventure remixed
from another creator's work); the filter predicate treats `remix` as
a Type row selecting `isRemix` items (matching Community's existing
fold-in semantics per 2.16(k)); the option's count wires like the
others. CSV: the Vault Type dropdown row's notes update in the same
commit.

## 5. R11: attribution, found, read, and specced

### 5.1 What exists, live, in the old design (read this session)

- **The credits panel:**
  `components/studio/creations/creation-credits/` (full LOOM,
  contract v1 shape `{id, kindLabel, creatorHandle, creatorHref,
  assetTitle}`), rendered by CreationPreviewModal on
  /studio/community, /studio/my-creations, and
  /studio/profile/[username]. Rows read "{kindLabel} from {handle}"
  with the handle linked when an href exists, plus an optional dim
  asset-title line. Its bed still uses pre-token literals
  (`border-white/10 bg-black/25`), flagged in
  docs/CLOSING-INVENTORY.md; the new kit piece does not copy them.
- **The resolver:** `lib/shared/creations/creationAttribution.js`.
  `getCreationCredits()` merges explicit credit arrays with
  connected references derived from the room-template/storyline
  payload (selected characters, scenario, narrator, location, image
  presets, outfits), normalizes kind labels via CREDIT_KIND_LABELS,
  drops uncreditable and handle-less rows, dedupes on
  kind:assetId:creatorUsername.
- **Routing:** handles route to
  `/studio/profile/${encodeURIComponent(username)}` (client and
  server twins), username validated `/^[a-zA-Z0-9_]{3,48}$/`,
  backend-supplied `creatorProfileHref` winning when present.

### 5.2 The new-design home

- **New kit package `credits`**, full LOOM:
  `components/kit/KitCredits.jsx`,
  `components/kit/credits/KitCredits.view.jsx`,
  `useKitCreditsViewModel.js`, `KitCredits.contract.js` line 1
  `export const KIT_CREDITS_VIEW_CONTRACT_VERSION = "1.0.0";`,
  fixtures, README, preview at `app/dev/ui-preview/kit-credits/`.
- Contract: `credits: {id, kindLabel, creatorHandle, creatorHref
  nullable, assetTitle nullable}[]`, `LinkComponent` injected by the
  shell (next/link) exactly as the old package does. Display-ready
  fields only; kind labels arrive already mapped through the
  terminology module by the caller (backend names never render).
- Anatomy, the old structure on current tokens: a section on
  `--surface-1`, `1px --line` border, `--radius-md`,
  `p-[var(--space-4)]`; label "Credits" as a plain gold uppercase
  label (`--text-label`, `--track-label`, `--gold-ornament`), no rule
  mark and no divider (it is neither of R7's two scopes; a panel
  label carries no mark); rows `grid gap-[var(--space-3)]`, each
  "{kindLabel} from {handle}" at `--text-ui` `--ink-dim` with the
  handle in `--ink` hover `--gold-ornament` when linked, plus the
  optional `--ink-faint` asset-title line. Empty list renders null
  (never the old `0`-node bug, 0.6).
- **Home on the asset detail popup:** `KitAssetDetailPopup` contract
  moves `"2.0.0"` to `"2.1.0"` adding optional `credits` (same item
  shape, default `[]`); the view renders KitCreditsView between the
  description/stats block and the R3 footer. This matches the old
  modal's order (credits after description and tags, before actions).
- **Anywhere else it belongs:** the Community and Vault pages pass
  fixture credits for their story and adventure items (characters,
  narrator, location rows with handles); the image overlay does NOT
  carry credits this sprint (the old lightbox never did; the
  catalogue surface, where the old design also shows per-media
  attribution, is out of scope until that page's own conversion).
  Handles link to the LIVE old profile route
  `/studio/profile/[username]`, exactly where the old design routes:
  under the strangler pattern old pages stay routable, and inventing
  a v2 profile destination is Creators-page future work, not this
  sprint's. This cross-design link is deliberate and recorded in the
  README.
- Fixture states (ported from the old package's six): mixed kinds,
  all linked, unlinked handle, no asset title, longest content,
  empty.
- CSV: new rows for the credits handle links (popup surface) in the
  same commit, closing the 0.7 inventory gap for the new design.

### 5.3 Cross-check against the Creators parity echo's 24 flagged rows

Checked row by row against docs/APP-FUNCTION-MAP.csv (rows 23 to 25,
796 to 818) and the handoff's flagged list:

- **Rows the attribution feature explains directly: none of the 24.**
  The credits panel itself never had a CSV row (0.7), so no flagged
  row IS the attribution function; the flag list is entirely
  profile-page and connections-page functions.
- **Rows attribution depends on as its destination: 2.** The
  `/studio/profile/[username]` profile hero (row 797) and the public
  creation card grid (rows 809 to 810) are exactly where credits
  handles land ("routing to their work"). R11's links keep working
  today because the OLD page still serves them; these two flags gain
  the note "attribution destination: credits handles route here"
  so the future profile-detail ruling weighs them accordingly.
- **Conclusion recorded for Brian:** attribution does not resolve any
  of the 24 flags; it adds one new, previously uninventoried function
  to the new design and one dependency note on the eventual Creators
  profile-detail decision.

## 6. Performance audit: /studio/v2/creators (no visual change)

Scope and rules exactly per the gate manifest:

1. **Separate dev-server compile artifacts from real cost.** First
   navigation on a dev server includes on-demand compilation; measure
   AFTER a warm-up load of the same route, and never run a production
   build while the dev server runs (skip it, flag it).
2. **Permitted fixes, only these, no visual change:**
   - Image sizing hints: explicit `width`/`height` (or an
     aspect-holding wrapper already present) on the raw `img`
     elements in KitCreatorCardView (avatar, thumbnails) and the page
     banner, so layout never shifts on load.
   - `loading="lazy"` on below-the-fold art (creator-card art already
     lazy; confirm banner stays `loading="lazy"` per its bottom
     treatment; add lazy to anything below the first viewport that
     lacks it).
   - Priority on above-the-fold art: the first visible card row's
     thumbnails and avatars get `loading="eager"` plus
     `fetchpriority="high"` (first three cards at desktop, first one
     at 390).
   - Re-render churn: CreatorsV2Mockup rebuilds every card's
     `thumbnails` array and `stats` object inline on every keystroke
     of search; memoize the mapped card prop rows (useMemo on the
     fixture mapping) and hoist stable callbacks (useCallback or
     per-item bound handlers) so typing in search does not re-render
     all thirteen cards' subtrees; wrap KitCreatorCardView export
     consumption in the page with React.memo ONLY if the measurement
     shows it pays; do not memo inside the kit package itself (kit
     API untouched).
3. Measure before and after with the Chrome DevTools MCP performance
   trace on the auth-free mirror, warm, at 1440 and 390; report the
   before/after numbers and name anything remaining as
   dev-server-only cost. No contract, fixture, or visual change of
   any kind; screenshots before and after must be pixel-identical.

## 7. Phase order, commits, dependencies

| Phase | Delivers | Depends on |
|---|---|---|
| 1 | R1/R2/R6: `studio-page` kit package, filter-bar padding mirror, three page migrations, law edits (l)(m)(n), edge measurements | nothing |
| 2 | R3/R8/R9: asset detail popup v2.0.0, carousel, four-action footer, clamp, fixtures, caller migrations, CSV | nothing (independent of 1; run after 1 so verification measures final geometry) |
| 3 | R4: image overlay treatment, zoom/pan | nothing |
| 4 | R5 creator card, R7 sidebar plus law entry (o), R10 Vault Remix | nothing |
| 5 | R11: `credits` kit package, popup v2.1.0, page fixture credits, CSV rows | 2 |
| 6 | Performance audit, Creators | 1 (measures final page) |
| 7 | Handoff update, final report | all |

One phase, one or more logical commits, committed and pushed at phase
end. Every phase re-runs the SOP section 3 checklist for packages it
touched.

## 8. Fixture states required, complete list

- `studio-page`: default, noBanner, longestContent.
- `asset-detail-popup`: character, story, adventure (4 media),
  likedAndSaved, longestCopy, noImage; credits added to two of them
  in Phase 5.
- `credits`: mixed, allLinked, unlinkedHandle, noAssetTitle,
  longestContent, empty.
- `image-overlay`: existing five carry over unchanged.
- `creator-card`: existing six carry over unchanged.
- Pages: Community (2 multi-media popup rows, credits on story and
  adventure rows), Vault (2 multi-media rows, `isRemix` on 2 or 3
  rows, credits on story and adventure rows), Creators (unchanged
  fixtures).

## 9. Contract version summary

| Contract | From | To | Why |
|---|---|---|---|
| KitStudioPage | none | 1.0.0 | new package (R1) |
| KitAssetDetailPopup | 1.0.0 | 2.0.0 | `imageSrc` replaced by `media[]`; `isLiked`, `onLike`, `onViewCatalogue` added (R3, R8, R9) |
| KitAssetDetailPopup | 2.0.0 | 2.1.0 | optional `credits[]` added (R11) |
| KitCredits | none | 1.0.0 | new package (R11) |
| KitImageOverlay | 1.0.0 | 1.0.0 | presentation-only recomposition (R4) |
| KitCreatorCard | 1.0.0 | 1.0.0 | view-owned label copy (R5) |
| KitStudioFilterBar | 1.0.0 | 1.0.0 | presentation-only padding (R1) |
| KitPromoBanner | 1.0.0 unchanged | same | verification owner only (R2) |
| KitDropdown, KitCreationCard, KitModalFrame, StudioPageHeader | unchanged | same | no prop change anywhere |

## OPEN FOR BRIAN

Nothing here blocks the overnight run; each names the default built.

1. **Standing, carried:** the lighter wash value for artwork under a
   tag bed (in fixtures since the batch-two sweep).
2. **Standing, carried:** all fixture copy (page descriptions, banner
   titles and CTAs, the new catalogue-slide line, empty-state copy)
   is placeholder, yours to rewrite.
3. **Standing, carried:** Creators "Most hearted" sort still orders
   by works as proxy; the creator-card contract has no hearts stat.
4. **Standing, carried:** Vault's old mobile density toggle has no
   ruled successor.
5. **Standing, carried:** the three my-creations card actions (Set as
   default Player Character, Start chat, Generate image) still have
   no ruled destination; R3's exactly-four footer deliberately does
   not house them.
6. **Standing, carried:** saved-from-others Vault items carry no
   visibility badge; confirm or rule a "Saved" mark.
7. **Standing, carried:** Creators grid columns 1/2/3 and Vault list
   two-up, confirm at render (now at the R1 full content width).
8. **New: sidebar group label color under R7.** Built default: the
   label stays gold uppercase (R7 bans only the ornament rule).
   Alternative reading: match the Legacy header's ink-faint label in
   full. One line to change either way.
9. **New: desktop zoom triggers on the image overlay.** R4 names
   pinch and drag; the built desktop defaults are wheel-to-zoom over
   the image plus double-click 1x/2x. Confirm or name different
   triggers. Ceiling built at 4x.
10. **New: the stats placement pick (R8)** is the BUILDER'S
    render-time choice by your ruling, logged in the report; review
    the logged pick at the next sitting.

Items 2, 3, and 4 from the Sprint A plan's OPEN FOR BRIAN list are
resolved (R9, R3, R4) and do not carry forward.

## Verification law for this sprint

Per FRONTEND-SOP section 8 plus the gate manifest: rendered checks
only, Chrome DevTools MCP, 390x844x2 mobile touch first, then 1440,
every fixture state, on the auth-free mirror routes. R1: measure the
actual left and right edges (getBoundingClientRect) of the filter
line's inner control row, the heading block, the card container, the
load-more control, and the bottom banner, and confirm they match at
390 and at 1440 with the sidebar expanded AND collapsed. R3 and R5:
confirm no wrap or truncation at 390. Zero NEW console errors (the
crestfall-seal.svg preload warning is known), zero NEW ESLint errors
(the three StudioSidebar.view.jsx errors are known), zero em dashes
in any touched file. Production build SKIPPED while the dev server
runs, flagged for a morning check. Anything unverified is reported as
unverified, never as done. Dev server law: check 3001 first, never
restart Brian's server, own port and PID for anything started.
