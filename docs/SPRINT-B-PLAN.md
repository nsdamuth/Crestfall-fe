# SPRINT-B-PLAN v1.0.0, SUPERSEDED 10 Aug 2026 by docs/SPRINT-D-PLAN.md

**SUPERSEDED.** This plan's content is absorbed into
docs/SPRINT-D-PLAN.md section 2 (workstream W2), updated to inherit
rulings R1 through R7 of the 10 Aug 2026 modal-system gate. Do not
execute from this document. Kept for lineage only.

# SPRINT-B-PLAN v1.0.0, written 10 Aug 2026, branch design/kit-polish-3, planning gate only

Sprint B: the Images page at `/studio/v2/images`, fixture-driven, out
of the sidebar, mirrored auth-free, ending with its parity echo. Same
shape as the Sprint A pair, inheriting rulings R1 through R11 (see
docs/SPRINT-A-POLISH-PLAN.md; this plan cites them by number).
Written by the Fable planning gate of 10 Aug 2026 from the same
source reading recorded in that plan, plus the Images-destination
rows of docs/APP-FUNCTION-MAP.csv and the pass C destination mapping
in docs/APP-FUNCTION-INVENTORY.md.

This plan is the execution spec for docs/SPRINT-B-SONNET-BRIEF.md.
Where this plan and a law document disagree, the law document wins
and the conflict is escalated, never resolved locally.

## 0. Standing facts (read before building)

1. **Build order note, deliberate.** docs/BUILD-BLUEPRINT.md 3.1
   places Images at row 5, after Stories (row 4). Images carries no
   lock ("No lock. All lightbox wiring exists and stays"); Stories is
   NOT built by this sprint and is not skipped silently: Brian's 10
   Aug 2026 gate manifest orders the Images page next by name, which
   is the ruling this deviation rides on.
2. **Dependency.** This sprint runs AFTER the Sprint A polish pass:
   it composes the `studio-page` scaffold (R1), the recomposed image
   overlay (R4), and inherits the width, banner, and heading laws.
   If `components/kit/studio-page/` does not exist on the branch,
   stop and report; the premise is wrong.
3. **Destination scope (pass C).** Create > Images owns
   `/studio/image-studio` (48 CSV rows) and
   `/studio/my-creations/[id]/image-library` (22 rows): 70 rows
   total. Note for the echo: the Sprint A Vault parity echo borrowed
   the 22 image-library rows to reconcile its own plan's 112 count
   (logged correction in docs/HANDOFF-NEXT-CHAT.md); pass C assigns
   them to Images, so this page's echo accounts for them under their
   real destination. The double appearance is named, not hidden.
4. **What Images is** (product model 4.5): the image workshop and
   library; the image creator plus the generated-image library;
   reference images that keep a look consistent. This sprint builds
   the LIBRARY BROWSE HUB fixture-first, exactly as Community,
   Creators, and Vault were built. The composer/creator surface (the
   old image-studio's prompt bar, batch controls, ingredient picker,
   etc.) has NO ruling assigning it a home on the new page yet; its
   rows land Flagged in the parity echo, never guessed into UI. No
   composer stub control is invented.
5. **Ratings and terminology** read from
   `lib/shared/presentation/terminology.js` only. No new tokens
   anywhere in this sprint.

## 1. Files

- `app/studio/v2/images/page.jsx` (mirrors the other v2 page
  wrappers) plus `ImagesV2Mockup.jsx` (client, fixture-driven,
  presentation only).
- Auth-free mirror `app/dev/ui-preview/images-v2-page/page.jsx` plus
  `ImagesV2PagePreviewClient.jsx`, byte-for-byte the pattern of the
  other mirrors: `StudioShellView` composed with the
  `studioSidebarPreviewFixture` sidebar (collapse toggle held
  locally) and a real `StudioTopBar`.

## 2. Composition (top to bottom, inside KitStudioPageView per R1)

1. `harnessSlot`: the fixture-mode row (Default, Empty, Loading),
   same harness the other pages carry.
2. `headerSlot`: `StudioPageHeaderView`, eyebrow "Create", title
   "Images", description "Craft the look once, pin it, and
   everything after stays on model." (fixture copy, flagged for
   Brian's copy pass). Left-aligned, full-width separator per R6.
3. `filterBarSlot`: `KitStudioFilterBarView`, search placeholder
   "Search your images"; filter groups per the product model 3.1
   line for Images ("linked asset, style mode, date"):
   - **Linked asset** (multi-select): Characters, Stories,
     Adventures, Unlinked. Counts from fixtures.
   - **Style** (multi-select): Anime, Realistic (the two live
     rendering-style values witnessed in the old design's visual
     reference cards and rendering-style select; display labels
     only).
   - The model's "date" facet is expressed through sort, not a
     dropdown (the branded dropdown has no date-picker species and
     none is invented; reading logged in OPEN FOR BRIAN).
   - `sortOptions`: Newest (`recent`, default), Most hearted
     (`hearts`), Most saved (`saved`).
   - `viewModeSlot` present (grid/list, this plan's default,
     confirm at render; the card law supports both layouts).
   - R10 audit line: Images lists the image kind only; stories and
     adventures are not selectable here, so no Remix row. Recorded
     in the echo.
4. `children`: card grid/list of `KitCreationCardView`
   `assetKind="image"`; grid columns exactly as Community and Vault
   (2 / 3 / 4 on the ruled gutters), list `grid-cols-1
   min-[1100px]:grid-cols-2`; `KitLoadMoreView`, PAGE_SIZE 12,
   batch-then-append; loading grid and empty state on the standing
   recipes (empty copy: "No images yet. Create one and it will land
   here." fixture copy, flagged).
5. `bannerSlot`: bottom `KitPromoBannerView` (`bottom`, `uniform`):
   eyebrow "Create", title "Everything you keep lives in the Vault.",
   CTA "Open the Vault" (journey loop: Images sells Vault; fixture
   copy, flagged). Full content width by R1/R2.

## 3. Wiring (all fixture-local)

- Eighteen fixture images from the draft-asset helpers, each
  `{id, title, imageSrc, linkedAsset: {kind, label} | null,
  style: "anime" | "realistic", hearts, saves, recency}`. Mix: at
  least three per linked-asset option including four unlinked, both
  styles, varied counts, three long titles.
- Cards: badges `[]` (tag economy: no Canon, no visibility story to
  tell on own generated images; nothing is invented), stats
  `{plays: null, hearts, saves, followers: null}`, subtitle from the
  linked asset's display label through the terminology module (e.g.
  "Image, linked to Character") or "Image" when unlinked.
- Every card and its Expand action open `KitImageOverlay` (the R4
  treatment: hairline, shelf, zoom); Love and Save toggle local
  `lovedIds`/`savedIds`; Share is the overlay's own action. No
  credits on the overlay (R11 scoped credits to the asset detail
  popup; images carry none this sprint, recorded).
- Search filters on title and linked-asset label substring; each
  sort orders by its stat, Newest by `recency`.
- Filter predicate: linked-asset group matches `linkedAsset.kind`
  (Unlinked matches null); style group matches `style`.
- Sidebar preview nav: flip Images to `isBuilt: true` in
  `useStudioSidebarViewModel.js` and `StudioSidebar.fixtures.js`
  (preview surface only; the real sidebar gains nothing, per the
  sidebar gate). Group headers already follow R7 after the polish
  pass.

## 4. Parity echo (ends the sprint, blueprint 3.4)

Every docs/APP-FUNCTION-MAP.csv row for `/studio/image-studio` (48)
and `/studio/my-creations/[id]/image-library` (22), 70 rows, each
marked Present (file and line), Deliberately excluded (ruling cited
by name), or Flagged for Brian. A fixture no-op is NOT Present.
Expectations, honestly stated in advance:

- Library browse rows (search, filters, sort, tile open, load more,
  like/bookmark) land Present where the new page genuinely performs
  the function against fixtures, Flagged where it does not.
- Composer rows (prompt, generation controls, ingredient picker,
  batch and queue machinery) have no ruling either way and land
  Flagged (0.4). Do not invent an exclusion ruling for them.
- Image-library rows tied to the edit tree's featured-slot workflow
  may cite the CR-007/CR-008 partial hold
  (docs/BUILD-BLUEPRINT.md 3.1 row 3) ONLY where the row's function
  is inseparable from editing a creation; otherwise Flagged.
- Note the Vault echo's borrow of the 22 rows (0.3) in the echo
  header.

The echo goes in the report, not a new doc. One open flag holds the
page at its staging address, out of the sidebar, per the route law.

## 5. CSV and definition of done

New rows in the same commit for every control the page ships
(search, both dropdowns, sort, view toggle, cards, overlay open,
load more, banner CTA), destination_page "Create > Images", plus the
"rollup not regenerated, script not in repo" log line. SOP section 3
checklist re-run for every package touched.

## OPEN FOR BRIAN

1. The "date" facet reading: built as the Newest sort, not a date
   dropdown. Confirm, or rule a date facet species.
2. View toggle presence and the grid columns (2/3/4) are this plan's
   layout defaults, confirm at render.
3. All fixture copy (description, empty state, banner title and CTA)
   is placeholder, yours to rewrite.
4. Cards ship badge-free; if generated images should carry a
   visibility or linked-asset badge, that is a new ruling.
5. The composer's home on the new Images page (top treatment, modal,
   or held) is unruled; every composer row lands Flagged in the echo
   until you place it.

## Verification law

Identical to the Sprint A polish plan's verification law: rendered
only via Chrome DevTools MCP, 390x844x2 mobile touch first then
1440, sidebar expanded and collapsed in the mirror, every fixture
state; the R1 five-edge measurement on this page (filter line inner
row, heading block, grid container, load-more, banner) matching
within 1px; zero NEW console errors, zero NEW ESLint errors, zero em
dashes in touched files; production build skipped while the dev
server runs and flagged; anything unverified reported as unverified.
Dev server law unchanged.
