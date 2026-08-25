# Banner audit, CC5 banner-artwork optimization

Written 11 Aug 2026, executing the 11 Aug 2026 banner-anchor ruling
(locked, not reopened here). For Nick's later consolidated review.

## The ruling

Banner images pin toward the top of their frame with roughly a 10%
downward bias by default (`KitPromoBanner.view.jsx`'s `imageAnchor`
prop, default `"center 10%"`), so faces and subjects stay visible, or
per-image positioning where an image reads better another way. This
supersedes the 10 Aug 2026 kit polish 3 pass's fixed
`object-[center_35%]` crop, which was measured against a single asset
whose claimed dimensions turned out to be wrong (see "Dimension
correction" below). No new art is generated anywhere in this pass;
every slot below draws from the already-committed, already-allowlisted
draft pool (`public/tmp-mockup-images/canon-character-images/` and
`alpha-test-creator-images/`) or was considered against
`public/assets/covers/` stock and rejected (see "Stock considered and
rejected").

## Dimension correction

The 10 Aug 2026 fixtures comment claimed Lilith.png was 2560x1441 and
sassy.png was 2352x1426. Measured directly (`sips -g pixelWidth -g
pixelHeight`) against the files as committed:

| File | Claimed | Actual |
|---|---|---|
| Lilith.png | 2560x1441 | 640x360 |
| sassy.png | 2352x1426 | 640x388 |

The orientation finding (Lilith.png is the one genuinely wide,
single-subject composition; sassy.png is an eight-panel reference
sheet that does not compose at any crop) is unaffected by the wrong
figures and stands. Corrected in `KitPromoBanner.fixtures.js` and in
the copy of the comment quoted in `CommunityV2Mockup.jsx`.

## Slot-by-slot survey (14 slots)

| # | Page | Slot | Image | Anchor | Kept / replaced | Rationale |
|---|---|---|---|---|---|---|
| 1 | Home | top (cold-start) | lilith-lux-eden-confrontation.png | default (10%) | Kept | Cinematic two-figure scene, both faces sit in the upper half (roughly 20-28% down); the ruled default keeps both in frame at every treatment width. |
| 2 | Home | bottom | athelgard-ampitheater-profile.png | default (10%) | Kept | Architectural interior, no face; the ruled default keeps the chandelier and dome arch (its visual center) in frame and crops the floor, which reads fine. |
| 3 | Studio | bottom | ~~lilith-lux-eden-confrontation.png~~ -> Djuna Smith.png | default (10%) | Replaced | Was a duplicate of slot 1 (Home, one click apart). Selena Velvet.png was tried first; rendered checked at 1440 her bent-over, face-down pose crops to a bare hair-bun under the ruled default, no visible face, so it was swapped for Djuna Smith.png, forward-facing and otherwise unused in any banner slot. |
| 4 | Adventures | top | ~~whiteviolin.png~~ -> Saeha Veyrune.png | default (10%) | Replaced | whiteviolin.png doubled as this banner and as Studio's door art (out of scope, see "Duplicate map"). Saeha Veyrune.png is otherwise unused and reads as an adventurer, fitting "Build an Adventure." |
| 5 | Adventures | bottom | ~~Lux.png~~ -> Enox Nix.png | default (10%) | Replaced | Lux.png doubled as this banner and as Studio's door art, and is a narrow portrait crop (flagged, see "Weak images"). Enox Nix.png is otherwise unused and its face sits near the very top (roughly 7% down), a clean match for the ruled anchor. |
| 6 | Lore | top | ~~lilith-lux-eden-confrontation.png~~ -> The Seer.png | default (10%) | Replaced | Was a duplicate of slot 1 (Home, one click apart) and slot 3 pre-reassignment. The Seer.png (an oracle) is otherwise unused and fits "Write into the world." |
| 7 | Lore | bottom | ~~athelgard-ampitheater-profile.png~~ -> Dalethia.png | default (10%) | Replaced | Was a duplicate of slot 2 (Home, one click apart). Dalethia.png is otherwise unused; face sits roughly 9% down, close to the ruled default's own bias. |
| 8 | Images | bottom | vermillion-8.png | default (10%) | Kept | Already unique to this slot; face sits roughly 16% down, well inside the ruled default's visible window at every treatment. |
| 9 | Stories | bottom | vermillion-13.png | **custom: `center 45%`** | Kept, anchor overridden | Environment scene (a ship at a cave mouth, a figure at the waterline); the subject sits mid-frame, not near the top. The ruled default would show mostly the dark cave arch above the ship. Per-image override per the ruling's own carve-out. |
| 10 | Creators | bottom | Lilith.png | default (10%) | Kept | The one retained use of Lilith.png (see "Duplicate map"); Creators is the flagship "read the lore" destination for the character, and Lilith.png's face sits roughly 25% down, inside the ruled default's window even at the widest desktop treatment. |
| 11 | Creator Profile | bottom | ~~Lilith.png~~ -> Crash Santosa.png | default (10%) | Replaced | Was a duplicate of slot 10 (Creators, one click apart). Rachel Sentry.png was tried first; rendered checked at 1440 her downward gaze crops out at the eyes under the ruled default, leaving only chin and jewelry, so it was swapped for Crash Santosa.png, forward-facing and otherwise unused. |
| 12 | Creator Connections | bottom | ~~Lilith.png~~ -> Maya Chen.png | default (10%) | Replaced | Was a duplicate of slot 10 (Creators, one click apart) and slot 11 (Creator Profile, one click apart from both). Maya Chen.png is otherwise unused; face sits roughly 11% down. |
| 13 | Community | bottom | ~~Lilith.png~~ -> Charlotte Steele.png | default (10%) | Replaced | Was a duplicate of slots 10-12. Charlotte Steele.png is otherwise unused; face sits roughly 9% down. |
| 14 | Vault | bottom | ~~Lilith.png~~ -> Jax Riker.png | default (10%) | Replaced | Was a duplicate of slots 10-13. Jax Riker.png is otherwise unused; face sits roughly 8% down. |

After this pass, no two banner slots on different pages share an
image; the pool allowed full de-duplication once single-subject
portraits were brought in alongside the three scene/environment
assets (Lilith.png, lilith-lux-eden-confrontation.png,
athelgard-ampitheater-profile.png).

## Weak images (flagged, not all resolved by reassignment)

- **Lilith.png upscaling at desktop.** The file is 640x360. Every
  desktop banner treatment renders wider than 640px (the `top`/
  `bottom` treatments reach `--container` 1200px and the frame spans
  full content width), so the image is upscaled and will read soft at
  desktop widths. No wider single-subject asset exists in the
  committed pool. Reducing its banner footprint from five slots to one
  (Creators, slot 10) reduces how often this is seen but does not fix
  the underlying softness; a higher-resolution replacement is new art
  and out of scope for this pass (RULING: no new art generation).
- **Lux.png portrait in a wide frame.** 361x640, the narrowest asset
  in the pool. Resolved for this pass by removing it from the one
  banner slot that used it (Adventures bottom, slot 5); it remains
  Studio's door art only (out of scope, see below), where its native
  crop treatment is a separate, unedited anchor.

## Duplicate map (before this pass)

- `lilith-lux-eden-confrontation.png` x3: Home top, Studio bottom,
  Lore top. Reduced to x1 (Home top only).
- `athelgard-ampitheater-profile.png` x2: Home bottom, Lore bottom.
  Reduced to x1 (Home bottom only).
- `Lilith.png` x5: Creators, Creator Profile, Creator Connections,
  Community, Vault. Reduced to x1 (Creators only).
- `Lux.png` and `whiteviolin.png` doubling as Studio door art: Lux.png
  was Adventures bottom banner art and a Studio door image in the same
  session; whiteviolin.png was Adventures top banner art and a
  different Studio door image in the same session. Both banners were
  reassigned off these files (slots 4 and 5); both files remain
  Studio's door art, unedited, out of scope for this pass.

## Stock considered and rejected

- `public/assets/covers/banner.png` (2172x724, genuinely wide,
  already committed): rejected as banner background art. It is a
  finished logotype card with "CRESTFALL" and "THE CHRONICLES" baked
  into the image itself; every `KitPromoBanner` treatment overlays its
  own eyebrow/title copy on the art, and stacking live copy over
  baked-in copy is illegal noise, not a second treatment. Left
  unadopted; no `.gitignore` or resize work needed since nothing new
  was committed.
- `alpha-test-creator-images/sassy.png` (640x388, the only other
  landscape file in the pool): rejected per the 10 Aug 2026 finding,
  unaffected by the dimension correction above; it is an eight-panel
  reference sheet with overlaid labels, not a scene, and does not
  compose at any single crop.

## Out of scope, audit note only (never edited)

- **`KitContinueRow.view.jsx`** (Stories' continue-row art) and the
  **card and door anchors** (`KitPromoBanner`'s `card` treatment
  callers and Studio's `Door` component,
  `Studio.view.jsx:85`'s `object-[center_20%]`) are explicitly
  forbidden to this sprint. Studio's five door images
  (`studioContent.mock.js`) include Lux.png and
  athelgard-ampitheater-profile.png, both also referenced elsewhere in
  this survey as banner or rail art; their door-specific anchor is
  untouched.
- Home's continue-state (filled) top banner image comes from
  `kitCreationCardStoryFixture` (a creation-card package fixture),
  forbidden territory ("every creation package"); only Home's
  cold-start top banner (slot 1) and bottom banner (slot 2) are this
  audit's concern.

## Closing-pass amendments needed (not applied here, forbidden files)

- `docs/BUILD-BLUEPRINT.md` line 1741 and `docs/CRESTFALL-DESIGN-CONTEXT.md`
  lines 281, 422, 442 cite "promo-banner contract 1.2.0"; the contract
  is now 1.3.0 (`imageAnchor`, additive). A closing pass should bump
  these citations.
- `docs/APP-FUNCTION-MAP.csv` rows 1047-1048 (Home's two banner ghost
  CTAs) cite "Promo-banner contract 1.2.0"; same bump. No row's
  `operation_name` or wiring changed in this pass, only the contract
  version and the banner art assignments in the "Weak images" and
  slot table above, so no new CSV rows are needed, only the version
  string in the two existing rows.
- `docs/SPRINT-D-PLAN.md` line 421 is a historical note that
  `KIT_PROMO_BANNER_VIEW_CONTRACT_VERSION` stayed `"1.1.0"` at that
  sprint's close; it is dated history and does not need updating.
