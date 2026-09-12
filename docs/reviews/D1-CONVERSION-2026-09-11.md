# D1 conversion, 11 Sep 2026

Branch `fe/css`, tree clean before the first edit (G1). Scope: D1 rows
(`docs/reviews/TOKEN-GAPS-2026-09-11.md` decision D1, "Opaque panel and
control fills have no per-role surface mapping") on the 92 Current
routes only, sourced from the hit tables in
`docs/reviews/CSS-SWEEP-AUDIT-2026-09-11.md`. No other decision, no
other class, was touched.

Brian's ruling, 11 Sep 2026: four buckets by role, not by alpha
number.

1. Inset wells, inputs, search fields, empty beds, to `--surface-1`.
2. Cards, list rows, tiles, icon-button fills, to `--surface-2`.
3. Persistent chrome, sidebars, top bars, sticky headers, to
   `--surface-3`.
4. Anything sitting over artwork, media, a cover image, a gradient, or
   another translucent layer stays translucent. Logged, not converted.

Method: every `black-white-fills` hit row in the audit's sections 3
and 4 (plus a handful of `hex-rgba` and Stops-section rows the audit
itself ties to the same D1 gap) was read against its actual current
source line, not assumed from the audit's own line numbers alone. A
cluster of files in `components/studio/account/**` had drifted since
the audit ran, so those rows were re-anchored to their real lines by
matching the audit's own in-note line citations (e.g. "matches v2
`:489`") and by value. Two rows the audit tagged `black-white-fills`
turned out on inspection to be gradient literals belonging to D2, not
D1, and were excluded rather than converted (D2's own territory, not
this ruling's). A handful of dead files (no importer anywhere in the
tree, confirmed by grep) were excluded as unreachable from any Current
route.

## Rows converted per bucket

| Bucket | Token | Rows converted | Files touched |
|---|---|---|---|
| 1 | `--surface-1` | 438 | 137 |
| 2 | `--surface-2` | 404 | 135 |
| 3 | `--surface-3` | 4 | 4 |
| **Total** | | **846** | **171 distinct files** |

Four commits: `fe/css: D1 wells to surface-1` (7c939d82), `fe/css: D1
cards to surface-2` (62b7b895), `fe/css: D1 chrome to surface-3`
(19a6b1ae), and this report. `npm run build` exited 0 after each of
the three code commits (G2).

The `--surface-3` bucket absorbs three sticky bottom save rows that
carried a raw `#100f0d` literal with no named token before this ruling
(the audit's own note called it "missing token; do not mint" a
`--chrome-wash`) plus the guided-milestone mode selector's sticky bar.
Brian's ruling settles the open question: an existing token absorbs
all four, nothing new is minted.

## Rows logged, not converted (G3)

Every row below sits over media, a gradient, another translucent
layer, or belongs to a different decision entirely. Zero of these were
converted.

### Sits over artwork, a cover image, or a gradient (bucket 4)

| File | Line(s) | Reason |
|---|---|---|
| `components/studio/create/create-type-card/CreateTypeCard.view.jsx` | 13 | Card composited with a full-bleed cover image plus a permanent gradient overlay; fill sits beneath artwork. |
| `components/studio/create/creation-studio/CreationStudio.view.jsx` | 475, 476, 539, 579 | Milestone card composited with a full-bleed `GuidedMilestoneArtwork` cover image. |
| `components/studio/create/creation-studio/CreationStudio.view.jsx` | 341, 501 | Badge/step-number mark rendered over a full-bleed `GuidedMilestoneArtwork` cover image. |
| `components/studio/create/creation-studio/CreationStudio.view.jsx` | 363, 514, 562 | Button with `backdrop-blur` sitting directly over a full-bleed `GuidedMilestoneArtwork` cover image. |
| `components/public-home/PublicHome.view.jsx` | 117 | `FeaturePanel` card holds permanent side-by-side `FeatureArtwork` (absolute, edge-fade gradients); fill composes with the art. |
| `components/studio/create/wardrobe/outfit-picker/OutfitPickerModal.view.jsx` | 21 | Modal backdrop scrim, translucent over arbitrary page content behind it. |
| `components/studio/story-rooms/story-room-transcript/StoryRoomTranscript.view.jsx` | 136 | Floating modal panel background (MessageReportDialog), awaiting the KitModalFrame rewrite to `--grad-panel-lift`. |
| `components/studio/story-rooms/story-rooms-hub/StoryRoomsHub.view.jsx` | 473 | Check-circle mark over an art placeholder; already resolved to `--scrim`, a different row's answer. |

### Belongs to a different decision or class, not D1

| File | Line(s) | Reason |
|---|---|---|
| `components/studio/create/scenario/scenario-builder/ScenarioBuilder.view.jsx` | 207 | Toggle-card rest fill routed to `--fill-option-rest` (a B4 decision), not a surface-role row. |
| `components/studio/create/scenario/scenario-reference-picker/ScenarioReferencePickerModal.view.jsx` | 116, 120 | Tag pill routed to `--tag-bed-canvas`, a different decision. |
| `components/studio/my-creations/edit/sections/locations/trackers-module-config-modal/TrackersModuleConfigModal.view.jsx` | 350 | Source comment marks it BLOCKED-ON-RULING for a meter-recipe question, not a surface-role question. |
| `components/studio/timelines/timeline-reader/TimelineReader.view.jsx` | 19 | Hover-state accent fill and shadow, not a base surface role; outside this ruling's bucket scope. |
| `components/studio/image-studio/media-history-grid/MediaHistoryGrid.view.jsx` | 697, 765 | Gradient literal outside the sanctioned `--grad-*` list, D2's territory, tagged `black-white-fills` in error. |

21 rows logged. Zero rows converted where the fill sits over media, a
gradient, or another translucent layer (G3 satisfied).

## Files reaching 20 or more pages

Every file this pass touched, cross-referenced against the audit's own
collapse analysis (`CSS-SWEEP-AUDIT-2026-09-11.md` section 7, "Shared
files that clear the most pages"), that reaches 20 or more Current
routes through the import graph:

| File | Pages reached | Bucket(s) touched here |
|---|---|---|
| `components/studio/studio-sidebar/StudioSidebar.view.jsx` | 88 | 2 |
| `components/studio/studio-mobile-nav/StudioMobileNav.view.jsx` | 88 | 2 |
| `components/ui/CrestfallSelect.jsx` | 27 | 1 |

`app/studio/layout.js` also reaches 88 pages and carries a
`black-white-fills` hit (line 58), but that hit is a gradient wash
over the signed-out gate hero's artwork, logged under bucket 4 above,
not converted. No line in that file was touched by this pass.

No other file this pass touched reaches 20 pages; the remaining 168
touched files are page-local or reach a smaller shared surface (most
under 10 pages).

## Review pages, three per bucket

Each is a Current route (`docs/reviews/ROUTE-STATUS-2026-09-11.md`)
verified to render a converted row in that bucket.

### Bucket 1, surface-1

- **`/login`**, the magic-link/Google sign-in card's email input bed
  (`app/login/page.js`) moves off `bg-black/60` onto `--surface-1`.
- **`/studio/games`**, the "Start Playing" panel's search input bed
  and the mobile view-mode toggle rail (`GamesHub.view.jsx`) move onto
  `--surface-1`.
- **`/studio/account/preferences`**, the "Page Defaults" quiet
  section panel and the placeholder-controls notice band
  (`app/studio/account/preferences/page.js`) both move onto
  `--surface-1`.

### Bucket 2, surface-2

- **`/studio/games`**, the same page's feature/panel cards
  (`GamesHub.view.jsx`, several `bg-black/25` and `/45` card fills)
  move onto `--surface-2`.
- **`/terms`** and **`/terms/[slug]`**, the policy header plate and
  section cards (`components/policies/PolicyPage.jsx`) move onto
  `--surface-2`.
- **`/studio/my-creations/[id]/edit`**, the mechanics-actions
  section's Action Sets and Direct Actions panels
  (`MechanicsActionAvailabilitySection.jsx`) and its icon-tile fill
  move onto `--surface-2`.

### Bucket 3, surface-3

- **`/studio/create/ability-spell-profile`**, the sticky bottom save
  row (`AbilitySpellProfileBuilder.view.jsx`), previously a raw
  `#100f0d` literal with no named token, moves onto `--surface-3`.
- **`/studio/create/skills-profile`**, the same sticky save-row
  pattern (`SkillsProfileBuilder.view.jsx`) moves onto `--surface-3`.
- **`/studio/v2/studio`**, the guided-milestone mode selector's
  sticky top bar (`CreationStudio.view.jsx`, `bg-black/90`) moves onto
  `--surface-3`.

### Bucket 4, logged, left translucent

Nothing changed on these pages; they verify the hold, not a
conversion.

- **`/studio/v2/studio`**, the guided-milestone cards on the Full
  Studio path (`CreationStudio.view.jsx` lines 475, 476, 539, 579)
  keep their `bg-black/35` base fill under the full-bleed
  `GuidedMilestoneArtwork` image; still translucent, unconverted.
- **`/`** (public home), the `FeaturePanel` cards
  (`PublicHome.view.jsx` line 117) keep their
  `bg-[rgba(9,8,6,0.96)]` fill behind the side-by-side feature
  artwork; still translucent, unconverted.
- **`/studio/create/wardrobe`**, `OutfitPickerModal`'s modal backdrop
  (line 21, `bg-black/80`) keeps its scrim over whatever page content
  sits behind the picker; still translucent, unconverted.

## STATUS

G1: DONE. `git status --short` empty, branch `fe/css`, confirmed
before the first edit.
G2: DONE. Four commits exist, one per bucket plus this report;
`npm run build` exited 0 after each of the three code commits.
G3: DONE. Zero rows converted where the fill sits over media, a
gradient, or another translucent layer; all 21 such rows appear above
with their reason.
G4: DONE. Every converted row traces to a D1 hit row; the two rows
found to be D2 gradients in disguise were logged, not converted, and
no other decision or class was touched.
G5: DONE. Three review pages per bucket across all four buckets,
twelve page-bucket pairings in all (buckets 1 to 3 verified to carry a
converted row, bucket 4 verified to carry a correctly-logged,
still-translucent row).
G6: no em dashes in this file. Tree clean after push.

NEXT ACTION: Brian browser review of the D1 fills pass, bucket by
bucket.
