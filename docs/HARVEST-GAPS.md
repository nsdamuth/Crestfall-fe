# Harvest: corners, wash, blur, destructive controls, and batch-one skip list

Read-only harvest. Source of truth: `~/dev/crestfall-main/Crestfall/design-system/proof/*.html` and its sibling `.css` files (`proof.css`, `library.css`, `modal.css`, `picker.css`, `shell.css`), confirmed to exist before reading. Token values cross-checked against `~/dev/crestfall-main/Crestfall/app/theme.css`, which is identical to this repo's `app/theme.css`. No package in this repo was edited to produce this report.

---

## 1. Corners

### (a) Content-holding surfaces — cards, panels, modals, tiles

**Dominant: `--radius-md` (12px)** — 17 instances: `.cf-card`, `.lcard`, `.crt`, `.cmodal .tile`, `.cmodal .arttile`, `.cmpay .portrait`, `.pktile`, `.lz-shimmer`, `.arcrow`, `.arcempty`, `.notice`, `.ladder`, `.cbmenu`, `.sheet .pack`, `.sheet .tier`, `.quillpop .qcard`, `.quillpop .qshimmer`.

**Secondary tier, not an outlier — `--radius-lg` (20px)**, reserved consistently for the largest floating/full-bleed surfaces: `.continuecard`, `.endcap`, `.emptystate`, `.bulkbar`, `.cmodal` (the modal dialog itself), `.quillpop`, `.picker`, `.sheet`. This is a deliberate size-based second tier, not a violation of the md dominant.

**True outliers — `--radius-sm` (8px):**
- `.cf-art` (proof.css:66) — the generic art-frame recipe
- `.crtworks a` (library.css:263) — creator-profile work thumbnail
- `.crtworks .phw` (library.css:409) — creator-profile work placeholder

All three are small art thumbnails nested *inside* a larger `--radius-md`/`--radius-lg` parent card, not independent cards — a legitimate "smaller nested tile" exception, not noise.

### (b) Controls — buttons, inputs, chips, tags

**Dominant: `--radius-md` (12px)** — 13 instances: `.btn`, `input, .search` (proof.css), `.fchip`, `.cbar .cbsearch`, `.picker .pksearch`, `.picker .pkchips button`, `.cmodal .chip`, `.cmfield input,textarea`, `.cmodal .swatch`, `.cmodal .vis`, `.search` (shell.css topbar), `.quillpop .qtones button`, `.sheet .cadence button`.

**Pill tier, not an outlier — `--radius-full` (999px)**: `.tag`, `.iconbtn`, `.quillundo`, `.quillpop .qtoggle button`. Tags and icon-buttons are pills by design, a distinct architecture from rectangular controls — this is intentional, not drift.

**True outliers:**
- `--radius-sm` (8px) — `.cbmenu .fchip` (library.css:329): the chip recipe loses one radius step when it's a row inside a dropdown menu rather than a standalone filter-bar pill.
- `--radius-xs` (4px) — `.soon` badge, appearing identically in **both** `library.css:205` and `shell.css:208`. Consistent across two files, so this reads as a deliberate distinct "Coming Soon" badge shape, not a stray value — but it is a genuine outlier from both the tag-pill (`radius-full`) and chip (`radius-md`) norms.

---

## 2. Wash

Both groups resolve to the **same token and the same value**: `rgba(0, 0, 0, .70)`.

### (a) Small beds — tags, chips, meta on tile art
Token: `--tag-bed-art: var(--scrim-strong)` → `rgba(0, 0, 0, .70)` (`theme.css:140`, aliasing `theme.css:83`). Used directly on individual tag/chip elements sitting over artwork, e.g. `.lcard .tag { background: var(--tag-bed-art); border: 1px solid var(--line); }` (library.css:92-93), and identically at library.css:359 and proof.css:166.

### (b) Full covers — banners, hero, promo
Token: `--veil-screen: var(--scrim-strong)` → `rgba(0, 0, 0, .70)` (proof.css:431). Applied as a flat, uniform screen (not a gradient) per the draft's own "Sprint 6.5: banner law — uniform screen veil" comment (library.css:42): `.continuecard .veil` (library.css:48), `.endcap .veil` (library.css:161, browse.html:84), `.hero .veil` (studio-home.html:34).

**Dominant opacity for both groups: `.70`** — they are literally the same CSS custom property, not two independently-tuned values that happen to match.

### Do tags carry their own additional dark bed under the overall wash?
**Yes.** A tag positioned over art (e.g. `.lcard .tag`, library.css:92) gets its own `background: var(--tag-bed-art)` (`.70` flat) plus a `1px solid var(--line)` border, layered (z-index:2) *on top of* the card's separate caption-legibility gradient (`.lcard .veil`, library.css:91: `linear-gradient(to top, rgba(6,5,4,.86) 6%, rgba(6,5,4,.16) 40%, transparent 60%)`). So a tag sitting inside an art card is covered twice: once by the card's own bottom-fade gradient, and again by its own independent `.70` flat wash directly behind the tag pill. This third mechanism — the card-caption gradient veil (peak ~.82–.88 near the bottom edge, fading to transparent by 40–60%) — is distinct from both named groups; it belongs to neither the small-bed nor the full-cover recipe and is called out here because it's easy to conflate with (b).

---

## 3. Blur

Every floating-panel scrim in the draft uses the identical pairing:

**`backdrop-filter: blur(2px)`** with **`background: var(--scrim-strong)` → `rgba(0, 0, 0, .70)`**

Confirmed at:
- `.cmveil` (modal.css:16) — creator/content modal
- `.pkveil` (picker.css:11) — bottom-sheet picker
- `.railveil` (shell.css:47) — sidebar drawer scrim
- `.sheetveil` (shell.css:175) — account slide-up sheet

**Does this opacity differ from the banner value in item 2? No.** It's the same `--scrim-strong` token at the same `.70` value in both places — the floating-panel scrim and the hero/banner full-cover veil are the same color, just with (`blur(2px)`) added behind panels and no blur behind in-page banners.

(Unrelated, noted so it isn't confused with the above: the sticky filter bar uses a *different* mechanism entirely — `background: color-mix(in srgb, var(--canvas) 88%, transparent)` with `backdrop-filter: blur(12px)`, at library.css:64/303 and shell.css:158 — a much larger blur radius paired with a canvas-tinted translucency rather than a flat black scrim. And `.tag--meta { backdrop-filter: blur(4px) }` (proof.css:176) is a legibility property on one tag variant, not a panel scrim.)

---

## 4. Destructive

Exactly two literal delete controls exist in the entire draft:

- `image-studio.html:318` — `<button class="btn btn--sm btn--ghost" data-bulk="Deleted">Delete</button>`
- `my-vault.html:315` — `<button class="btn btn--sm btn--ghost" data-bulk="Deleted">Delete</button>`

**Geometry vs. a normal button: identical, zero deviation.** Both are exactly `.btn.btn--sm.btn--ghost` — same height (`--control-sm`), same padding (`0 var(--space-3)`), same radius (`--radius-md`, inherited from `.btn`) as the Archive and "Submit for publication" buttons sitting directly beside them in the same bulk bar. There is no distinct destructive size, padding, or radius anywhere in the draft.

**Filled red anywhere: none.** A full grep of every `.css` file in the proof draft for hex reds, `red`, `danger`, and `destructive` returns zero matches. The Delete buttons render in the same transparent ghost fill as every other ghost button — gold text and border, no red at all.

**Confirm steps: none found.** No `window.confirm()`, `<dialog>`, or "are you sure" copy is wired to either Delete button. The draft's one `window.confirm()` call (`review-mode.js:267`) is unrelated — it guards clearing a reviewer's saved page notes, not content deletion. Clicking Delete in the bulk bar sets `data-bulk="Deleted"` directly with no interstitial confirmation step visible in the static markup or its script.

---

## 5. Skip list — Crestfall-fe, branch `design/global-sweep`

Every instance below was left untouched by the batch-one conversion pass (19 packages, commits `aa99ab9`..`b312469`) for one of the three named reasons, verified against the current file contents on this branch. This is not an exhaustive scan of every remaining raw utility class in the repo — most files were converted only for their inventoried rule families, so large amounts of unrelated ad hoc styling remain outside this list's three specific reasons by design, not by omission.

### Off-scale radii (`rounded-2xl` / 16px — no exact match; `--radius-md` is 12px, `--radius-lg` is 20px)

| File | Line | Current value |
|---|---|---|
| `components/studio/story-rooms/story-room-cast-panel/StoryRoomCastPanel.view.jsx` | 47 | `rounded-2xl border border-[var(--gold-ornament)]/20 bg-black/45` (outer `<aside>` panel) |
| `components/studio/story-rooms/story-room-cast-panel/StoryRoomCastPanel.view.jsx` | 66 | `rounded-2xl border border-white/10` (featured-media frame) |
| `components/studio/create/location/location-builder/LocationBuilder.view.jsx` | 47 | `rounded-2xl border border-[var(--gold-ornament)]/20 bg-black/45` (outer `<aside>` shell) |
| `components/studio/create/location/location-builder/LocationBuilder.view.jsx` | 385 | `rounded-2xl border` (cover-image candidate tile) |
| `components/studio/create/location/location-builder/LocationBuilder.view.jsx` | 451 | `rounded-2xl border border-[var(--gold-ornament)]/20 bg-black/45` (`EditorCard` shell) |

### Opacity washes (`bg-black/NN`, ad hoc — left as bridge-var color swap only, box treatment untouched)

| File | Line | Current value |
|---|---|---|
| `components/studio/characters/actor-mechanics-profile-attachment/ActorMechanicsProfileAttachmentSection.view.jsx` | 99 | `bg-black/45` (avatar image frame) |
| `components/studio/characters/actor-mechanics-profile-attachment/ActorMechanicsProfileAttachmentSection.view.jsx` | 105 | `bg-black/45` (avatar icon frame, no image) |
| `components/studio/characters/actor-mechanics-profile-attachment/ActorMechanicsProfileAttachmentSection.view.jsx` | 183 | `bg-black/45` (notes textarea) |
| `components/studio/account/default-player-character-picker/DefaultPlayerCharacterPickerModal.view.jsx` | 46 | `border-white/10 bg-black/35` (search field) |
| `components/studio/account/default-player-character-picker/DefaultPlayerCharacterPickerModal.view.jsx` | 59 | `border-white/10 bg-black/25` (loading-state box) |
| `components/studio/account/default-player-character-picker/DefaultPlayerCharacterPickerModal.view.jsx` | 71 | `border-dashed border-white/10 bg-black/25` (empty-state box) |
| `components/studio/create/location/location-builder/LocationBuilder.view.jsx` | 47 | `bg-black/45` (outer `<aside>` shell — also listed above under radii) |
| `components/studio/create/location/location-builder/LocationBuilder.view.jsx` | 451 | `bg-black/45` (`EditorCard` shell — also listed above under radii) |

### Missing destructive-button geometry (delete/remove controls with no distinct destructive shape; color state varies by file)

| File | Line | Current value |
|---|---|---|
| `components/studio/create/location-registry/location-registry-builder/LocationRegistryBuilder.view.jsx` | 1673 | `SmallDangerAction` (`aria-label="Delete"`): `rounded-lg border border-white/10 px-3 py-2 text-red-200 hover:border-red-300/35` — identical geometry to the non-destructive `SmallAction` beside it; color still raw Tailwind red, never tokenized to `--status-danger` |
| `components/studio/image-studio/media-history-grid/MediaHistoryGrid.view.jsx` | 268 | "Delete Selected" chip: colors tokenized to `--status-danger`/`--status-danger-bed`/`--status-danger-border`, but geometry is the unmodified standard chip (`--control-sm`, `--radius-md`) — no distinct destructive size/shape introduced, matching the draft's own lack of a dedicated destructive variant |
| `components/studio/story-rooms/story-rooms-hub/StoryRoomsHub.view.jsx` | 132, 145 | Delete-room-templates button: `border-red-400/30 bg-red-400/10 text-red-200`, standard button geometry, raw Tailwind red left untouched |
| `components/studio/story-rooms/story-rooms-hub/StoryRoomsHub.view.jsx` | 390–391, 480–481 | Manage-mode selection checkbox/row states: `border-red-300 bg-red-300 text-black` / `border-red-300/70 bg-black/20` — raw red, explicitly flagged in-code (lines 382, 473) as left for a future pass per Ruling 2 |
| `components/studio/story-rooms/story-rooms-hub/StoryRoomsHub.view.jsx` | 440, 560 | Selected-room row/card tint: `bg-red-400/10`, `border-red-300/45 bg-red-400/10` — raw red, same reason |

**Total occurrences:** 5 off-scale-radius, 8 opacity-wash, 8 missing-destructive-geometry (21 lines across 7 files; 2 lines double-count between the radii and wash tables since the same class string carries both an off-scale radius and an ad hoc wash).
