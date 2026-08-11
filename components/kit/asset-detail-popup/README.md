# Kit Asset Detail Popup LOOM package

**Contract:** `KitAssetDetailPopup.contract.js` (`2.3.0`)

## Purpose

The destination every `character`, `story`, and `adventure` media card
opens (`docs/BUILD-BLUEPRINT.md` section 2.15). Recomposed 10 Aug 2026
(kit polish 3 pass, R3/R8/R9, `docs/SPRINT-A-POLISH-PLAN.md` section 2)
against the live old-design creation preview modal
(`components/studio/creations/creation-preview-modal/`, read-only
reference, never edited).

## Boundary

```text
KitAssetDetailPopup.jsx
  -> KitModalFrame (components/kit/KitModalFrame.jsx)
  -> useKitAssetDetailPopupViewModel.js
  -> KitAssetDetailPopup.view.jsx
```

The shell composes `KitModalFrame` (`variant="modal"`,
`panelClassName="w-full max-w-xl"`) wrapping the popup's own content
view. The popup renders no close control of its own; the frame owns
dismissal (backdrop click, Escape, close control).

## v2.0.0, RULED 10 Aug 2026

`imageSrc` is REMOVED, replaced by `media: {id, src}[]` (a removal is
a major bump per contract law). `isLiked`, `onLike`, and
`onViewCatalogue` are ADDED.

## v2.1.0, RULED 10 Aug 2026 (R11)

Optional `credits` array ADDED, same item shape as `KitCredits`,
default `[]`. The shell injects `next/link` for the credits' handle
links. Rendered between the description/stats block and the footer,
matching the old modal's own order (credits after description and
tags, before actions).

## Credits collapse, RULED 10 Aug 2026 (R1, kit polish 3 pass, plan 1.3)

Presentation-only recomposition, contract stays `2.1.0`. In place of
the full `KitCreditsView` list, the popup renders a one-row collapsed
credit block on the same bed recipe (`--surface-1`, `--line` border,
`--radius-md`, `p-[var(--space-4)]`): the gold "Credits" label, the
FIRST credit only, and, when `credits.length > 1`, a "View all
credits (N)" control (quiet text button, `--gold-ornament`). One
credit: no control, just the row. Zero credits: nothing renders, as
before.

The control opens `KitCreditsModal` (`components/kit/credits/`,
package `1.1.0`) stacked above the popup, in the popup's own space
(`max-w-xl`). While it is open, the shell suppresses THIS frame's own
Escape and backdrop dismissal (`closeOnEscape`/`closeOnBackdrop`,
props the frame already has) so one Escape keypress closes only the
credits modal first; a second Escape closes the popup. The popup
never unmounts while the credits modal is open, so its scroll
position is preserved when the credits modal closes.

## Anatomy

- **Carousel frame** (top, full inner width, `aspect-[5/3]`,
  art-bleed into the frame's top LARGE corners, `object-cover
  object-[center_18%]`): at most 4 media items (the old modal's own
  cap) plus one synthetic catalogue slide. Circular arrow buttons
  (`--control-md`, `--radius-full`, `--surface-2` fill,
  `--line-whisper` border, `--shadow-popover`) wrap in both directions
  through the catalogue slide. A pill dot tray (N+1 dots) sits
  bottom-center over the art; the active dot is a gold lozenge
  (`--gold-action`), inactive dots are small `--ink-faint` circles.
  Empty or absent `media`: the standard no-art fallback renders and
  NO carousel chrome and NO catalogue slide render.
- **The catalogue slide** (the final slide): the first media item
  under a flat `--scrim-strong` veil, a centered `--surface-4` card
  (`max-w-xs`, `1px --line` border, `--radius-md`,
  `--shadow-popover`) with the gold eyebrow "Want to see more?", one
  fixture line, and the "View catalogue" primary CTA firing
  `onViewCatalogue`. The real destination (owner context routes to
  `/studio/my-creations/[id]/image-library`, public context to
  `/studio/creations/[id]`, per the old ViewModel) is a later wiring
  concern; fixtures wire a no-op.
- **Body** (`p-[var(--space-6)]`): badge row (`surface="canvas"`,
  moved off the art since chrome now owns the carousel), title
  (`font-display`, `--text-subhead`, `--ink`, keeps
  `KIT_ASSET_DETAIL_POPUP_TITLE_ID` for the frame's `ariaLabelledBy`),
  subtitle (`--text-ui`, `--ink-dim`), description (clamps at three
  lines past 160 characters with a See more / See less control,
  `--gold-ornament` text), then the stat row (same icons and order as
  the card: plays, hearts, saves, followers).
- **Stats placement, R8 render-time pick, LOGGED:** both plan-2.5
  readings (stacked vs. side-by-side) were built against the
  `longestCopy` fixture. Reading A, stacked, ships: at this panel's
  fixed `max-w-xl` (576px) width, Reading B's side-by-side split left
  too little room for both a legible description measure and the
  stat column, and Reading B collapses to Reading A under 700px
  anyway, so the split only ever applied at a width the panel never
  reaches. Stacking also matches every other stat row already in the
  app (the card face).
- **Footer**: four actions by default, `grid grid-cols-4`, evenly
  distributed, one row, `whitespace-nowrap`: Like (Heart), Save
  (Bookmark), Share (Share2, Ruling 6: icon plus the word), Play
  (primary, R9: universal label for all three asset kinds, superseding
  the prior per-kind Continue for adventure). Toggled Like and Save
  follow the selection-state law: gold text plus the light `--fill`
  wash, icon filled, `aria-pressed`, never a bold border. ADDED 10 Aug
  2026 (v2.1.0 to v2.2.0, docs/STUDIO-SPEC.md section 5, Studio brief
  S5): an optional fifth action, Edit (Pencil), rendered only when
  `onEdit` is provided (`grid-cols-5` in that state), the ruled single
  path from the Vault popup into the advanced editor. Every fixture
  but `kitAssetDetailPopupOwnWorkFixture` omits `onEdit`, so the
  four-action footer stays pixel-stable everywhere else (Community and
  every non-owner context).

## v2.2.0, RULED 10 Aug 2026 (docs/STUDIO-SPEC.md section 5, Studio brief S5)

Optional `onEdit` ADDED, the fifth footer action described above (see
Anatomy > Footer).

## v2.3.0, RULED 11 Aug 2026: reconciliation of two independent 2.2.0 drafts

design/sprint-h-final and design/community-parity each bumped this
contract from 2.1.0 to 2.2.0 independently, with different additions.
2.3.0 is the union of both, merged whole, nothing dropped:

- From **design/sprint-h-final**: optional `onEdit`, the fifth footer
  action (v2.2.0 above).
- From **design/community-parity**, restoring the parity audit's
  candidate 6 leftovers (`docs/PARITY-AUDIT.md` section 5) for
  `/studio/v2/community`: optional `creator: {handle, href}` ADDED,
  rendering the old modal's "by @handle" line under the subtitle
  (linked when `href` is present, plain text otherwise); optional
  `tags: string[]` ADDED, rendering the old modal's tag pill row
  between the description/stats block and credits. Both default to
  `null`/`[]` and render nothing when absent, so every existing
  consumer (Vault, Stories) that does not pass them stays
  pixel-stable. The credits block's existing `creditsLinkComponent`
  prop is reused for the creator-handle link rather than adding a
  second link-component prop.

`tags` ships with no live data source: the Community page's fixture
model carries no tag field on any creation (CR-037, filed
`docs/CONTRACT-REQUESTS.md`), so the row is built and wired but
renders nothing until that data exists, the same honest-stub posture
as this package's own video/liked/bookmarked media tabs.

## Open flags carried to OPEN FOR BRIAN

- Whether a Love action belongs on this popup in addition to Like (the
  image overlay and the card face both use Love/Heart language in
  different places; R3's four-action footer is Like, Save, Share,
  Play and does not add a fifth).

## Package assets

- `KitAssetDetailPopup.contract.js`
- `KitAssetDetailPopup.fixtures.js` (character, story, adventure,
  likedAndSaved, longestCopy, noImage, ownWork, noCreatorNoTags)
- `useKitAssetDetailPopupViewModel.js`
- `/dev/ui-preview/kit-asset-detail-popup`

Fixture-only; no query, persistence, or navigation is wired.
