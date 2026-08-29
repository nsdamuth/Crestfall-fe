# Crestfall image generation spec brief, v2

Rebuilt 29 Aug 2026 from a read-only audit of Crestfall-fe
(design/fe-dev). Every VERIFIED backend value in the companion
SELECTOR-IMAGE-CATALOG.csv was read from the live component contracts
and constants, not invented. Package for Nick and Sol: the backend
pipeline that generates every static selector tile and page banner in
the Crestfall house style.

STATUS: GO from Brian 29 Aug 2026 on the package, with the base visual
approach OPEN: it is suggested, not ruled. Round 1 of the test in
section 6 renders all three candidates; Brian rules at a render
sitting before any mass generation.

CSV shape: 119 rows. 89 VERIFIED (values audited from FE code),
12 PROPOSED (pose starter library, needs sign-off), 18 DESIGN (page
banners). 96 rows need generated art; the rest are UI treatments
(CUSTOM, AUTO, DEFAULT tiles are interface chrome, never generated).

## 1. What this is for

Static selector tiles for enumerated creation options (Species, body
identity, hair, render style, and the rest) plus the nine-page journey
banners. Like a game character-select screen: the tile shows THE
SELECTION, not a promise about the art style of the user's final
output. User-created content thumbnails (characters, outfits,
locations in pickers) are a separate, existing backend concern and are
NOT in this package.

## 2. The candidate visual rule (suggested; ruled at render sitting)

Whichever base approach wins round 1, the consistency law is
non-negotiable: one base, one camera, one light, one backdrop. Only
the selected feature changes between tiles in a category.

- Suggested base: a single soft-featured, style-neutral mannequin.
  Warm clay-gray skin, simplified face, gray base garment. Adult, 18+.
- Backdrop: flat warm parchment-neutral. Scene-free.
- Light: one soft key plus a faint ember rim.
- Camera: locked per crop type (section 4). Never varies in a category.
- No text baked into any image. Labels render in HTML.
- Render Style tiles are the exception to style neutrality: each shows
  the same subject rendered IN that style, because the style is the
  selection.

## 3. File specs

All images WebP, quality 78 to 82, sRGB, no metadata. Dimensions are
already 2x for retina at rendered size. Filenames are in the CSV,
keyed on the exact backend value (species_KITSUNE.webp), so one asset
serves every surface that uses that value.

| Family | Crop | Aspect | Pixels | Max size |
|---|---|---|---|---|
| Species | bust | 4:5 | 600 x 750 | 60 KB |
| Hair (length, texture, style) | head_crop | 1:1 | 512 x 512 | 40 KB |
| Body Identity, Body Type, Proportions, Wardrobe Theme, Pose | full_body | 2:3 | 600 x 900 | 80 KB |
| Render Style | style_preview | 4:3 | 640 x 480 | 60 KB |
| Page banner desktop | full_width | 16:5 | 2400 x 750 | 250 KB |
| Page banner mobile | full_width | 4:3 | 828 x 620 | 120 KB |

Audited categories needing NO generated art (CSS swatches carry them):
Skin Tone, Eye Color, Hair Color, Character Color Palette. Camera /
Framing (29 values) stays text for v1; diagram tiles are a possible
later tier.

## 4. Crop rules per category

| Category | What changes | What never changes |
|---|---|---|
| Species | Defining trait (ears, tail, horns, wings, scales) | Base face, framing, light |
| Body Identity (Kibbe) | Frame and line per type | Pose, garment, camera |
| Hair Length | Length only, on one standard texture and style | Face, camera, light |
| Hair Texture | Texture only, on SHOULDER_LENGTH standard | Face, camera, light |
| Hair Style | Style only, standard color and length | Face, camera, light |
| Body Type | Proportions | Pose, garment, camera |
| Proportions | Named proportion emphasis | Everything else |
| Wardrobe Theme | Garment family, SFW | Base, pose |
| Pose Library | Pose | Base, garment |
| Render Style | The rendering style itself, same subject | Subject, composition |
| Page Banner | Per-page art direction | Obsidian and ember palette, no baked text |

## 5. Pipeline requirements (Chassis side)

1. One locked style reference set: seed-locked mannequin reference plus
   fixed prompt scaffold and params. Every tile generates from the same
   reference so the set reads as one hand.
2. Batch job reads the CSV, generates rows where tile_art is
   "required" (and "optional" if scoped in), validates dimensions and
   file size per row, writes to a versioned assets path using the CSV
   filename.
3. Post-process: center-crop to exact aspect, resize to exact pixels,
   WebP encode to the KB budget (step quality down to a q70 floor;
   flag any row that cannot hit budget).
4. Regeneration is per-row. One new hairstyle later is one CSV row and
   one job run, never a full reroll.
5. Rejects: any tile where the face drifts, light shifts, or style
   diverges gets rerolled before delivery. Consistency is the
   acceptance test.

## 6. Two test rounds before mass generation (render sittings)

ROUND 1, base approach. Three candidates, each on the same four probe
tiles (one species, one hair style, one body type, one pose), all in
the balanced crestfall_fantasy_realistic style:
- A: neutral clay mannequin (suggested)
- B: house model, one recurring rendered character
- C: per-frame models, feminine and masculine bases
Twelve images, one three-column board, Brian rules the approach.

ROUND 2, house style. The winning approach on three anchors using the
repo's own style names: crestfall_realistic_fantasy,
crestfall_fantasy_realistic, crestfall_fantasy. Same four probes plus
one banner concept each; fifteen images, one board, Brian rules.
That anchor's reference and params freeze, then the full run happens
once.

## 7. Front end loading rules (FE side, for the record)

- Every image tag carries explicit width and height (no layout shift).
- Selector grids lazy-load below the first row; banners always
  lazy-load (below the fold).
- Banners ship desktop and mobile sources via srcset or picture.
- Banner text is an HTML overlay styled by tokens, never baked in.
- KindStop's TileGrid already accepts imageUrl; wiring assets in is FE
  lane work once files exist.

## 8. Confirmations owed and audit flags

For Nick to confirm:
- N1: The enumerated lists in the CSV against the authoritative
  contracts on the Chassis side (FE audit is the source here; contracts
  win if they differ).
- N2: The PROPOSED pose starter library: right concept for the
  ingredient picker's system content? Exact list is Brian's call after.
- N3: Hair value collision: HairEyesModal uses BALD, HairModal uses
  BALD_SHAVED. One canonical value or an alias map; art keys on the
  canonical.

Audit flags, recorded so nobody trips on them (FE lane owns fixes):
- Quick vs advanced option sets diverge materially for Skin Tone
  (12 vs 17), Eye Color (12 vs 16), and Hair Color (9 vs 14, and the
  sets are not subsets: AUBURN, GOLDEN, COPPER, VIOLET exist only in
  quick). Swatch-only categories, so no art impact, but a product
  consistency ruling is owed.
- TraitModal fixtures show a stale Body Type set; real constants are
  the nine values in the CSV.
- CharacterColorPalette fixtures show 4 of 13 real palettes.
- Character Template and Player-Character routes use a merged
  HairEyesModal with its own option list, distinct from the standalone
  creator's modals.
- "Ethnic Appearance" (create) vs "Visual Heritage" (edit) naming
  drift, unresolved; backend-fed, no art impact.
- No ruled display names exist yet for individual appearance
  attributes in terminology.js; display labels for tiles will need a
  Brian pass before launch copy is final.

## 9. Open questions

- O-A: Base approach ruling (Brian, render sitting round 1).
- O-B: Style anchor ruling (Brian, render sitting round 2).
- O-C: Scope optional tiers in or out of the first run (Proportions,
  Wardrobe Theme).
- O-D: One mannequin frame or per-frame for body and pose categories
  (cost: roughly doubles 30 full-body tiles); revisitable later
  without rework.
