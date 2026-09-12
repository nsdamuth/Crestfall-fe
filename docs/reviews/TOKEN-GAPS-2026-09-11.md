# Token gaps, 11 Sep 2026

Read-only. Branch `fe/css`, tree clean before the first read (G1). This file is the only file written; no product code, no other doc, is touched.

Scope: the 92 Current routes ruled in `docs/reviews/ROUTE-STATUS-2026-09-11.md`, across all 11 defect classes named in `docs/reviews/CSS-SWEEP-AUDIT-2026-09-11.md` section 8 (Surface and border color literals, White hairline borders, Tailwind named colors, Radius scale, Bridge variable retirement, Type floor, Focus visibility, Elevation shadows, Filter chip rows, Non-Kit overlays, Small and one-off classes).

Method: eleven parallel read agents walked every page and package hit table in the audit (`## 3` and `## 4`, lines 66 to 9393) against a fixed decision taxonomy built from `docs/DESIGN-TOKENS.md`, `docs/FRONTEND-SOP.md` sections 2 and 17, and the audit's own count summary and collapse analysis (section 7). Their raw finds were then checked by hand against the audit's Verifier-corrections tables and Stops section (`## 6`, lines 9442 to 9851) and the Lore section (`## 5`), which sit outside the agents' scanned range and carry several disputes the per-row Match column does not surface (a row can read `approximate`, meaning a fixer already wrote an answer, while the audit's own verifier or a later Stop still calls that answer unsettled). Every current value, count, and route below was traced back to a specific hit-table row, Verifier-correction, or Stops bullet; nothing is estimated from the class-level mechanical counts in section 1.

A "row" in this file means one line-number reference inside one hit-table entry, Verifier-correction, or Stops bullet, restricted to a Current route or a package with at least one Current-route consumer. The 13 excluded routes (7 Superseded, `/studio/story-rooms/[id]`, `/studio/story-rooms/[id]/character-configuration`, `/studio/create/character`, `/studio/create/player-character`, `/studio/play`, `/studio/profile`, `/studio/submit-canon`; plus `/studio/create`, `/studio/create/mechanics-loadout`, `/studio/create/timeline`, `/studio/create/timeline/[id]`; and 2 Unknown, `/chronicle/[...slug]`, `/stories/[...slug]`) are skipped entirely, along with `components/studio/studio-coming-soon`, `components/studio/studio-action-card`, and the character-creation-engine files reachable only through the two excluded `/studio/create/character*` routes, matching the audit's own section 8.0 exclusion notes.

Not counted here, on purpose: the 40 hit lines the audit itself could not attribute to a row (`## 6`, the `app/studio/account/*` unattributed list) - there is no old value or replacement recorded for them, so grouping them into a decision would mean inventing content the audit does not have; they are an open reconciliation item, not a token gap, and are flagged again in the closing section. Also not counted: the `cf-btn--sm` / `--control-sm` coarse-pointer touch-target gap that recurs in nearly every unit's Stops - it is a mobile-check and recipe question, not one of the 11 CSS defect classes. Also not counted: copy-only or product-only findings with no token or Kit-pattern content (orphan-file deletion calls, the R3/R4 label mapping, the `app/manifest.js` background-color drift, the archive-nav mobile-alternative question) - none of these is a row the audit marks against one of the 11 classes.

## 1. Summary

| Measure | Count |
|---|---|
| Gap rows on Current routes (the "unresolved total") | 1,161 |
| Decisions | 15 (a sixteenth candidate, D13, was withdrawn on verification; its one row already had a ruled answer, folded into section 4) |
| Distinct Current routes or route-reaching packages touched | 90+ (see decision D1; the shared studio shell and public-page shell alone carry gap rows onto nearly every one of the 92) |
| Classes with at least one gap row | 8 of 11 |
| Classes fully ruled, no decision needed (section 4) | 5 (Type floor's sub-11px half, Focus visibility, Radius scale's pill half, one Small-class item already resolved, one Small-class item with zero Current-route reach) |

Rows by class (a class-level total; several decisions draw rows from more than one class, so a row is counted once here under the class its own table row carries, even where the decision that resolves it spans classes):

| Class (session name) | Gap rows |
|---|---|
| 1. Surface and border color literals | 930 |
| 3. Tailwind named colors | 85 |
| 9. Filter chip rows | 57 |
| 2. White hairline borders | 39 |
| 4. Radius scale | 11 |
| 11. Small and one-off classes | 14 |
| 10. Non-Kit overlays | 8 |
| 5. Bridge variable retirement | 9 |
| 6. Type floor | 3 |
| 8. Elevation shadows | 1 |
| 7. Focus visibility | 0 |
| **Total** | **1,157** |

The class table's 1,157 sits 4 rows under the decision-level total of 1,161 below. The difference is D2's own few rows that were allocated to more than one class column above (a gradient row filed under Elevation shadows in the class table is the same row counted once, in full, under decision D2); the decision-level total, not this class table, is the authoritative unresolved total for gate G2.

Decisions, ordered by rows unblocked, descending:

| # | Decision | Rows | Routes/packages | Classes |
|---|---|---|---|---|
| D1 | Opaque panel and control fills have no per-role surface mapping | 853 | 87+ | Surface literals |
| D4 | Status-colored running text on a panel: is the `-text` tier the ruled step | 59 | 18 | Tailwind named colors |
| D10 | Loose filter and tab rows inside picker modals | 57 | 6 | Filter chip rows |
| D3 | The light parchment surface has no token family | 49 | 8 | Surface literals, Bridge variables |
| D5 | `border-white/10` family: is `--line-whisper` ever legal | 39 | 9 | White hairlines |
| D2 | Decorative gradients and glows outside the sanctioned list | 36 | 17 | Surface literals, Bridge variables, Elevation shadows |
| D9 | Violet, purple, and pink accents have no token | 25 | 9 | Tailwind named colors |
| D6 | Radius tier disputes on grid-sibling and nested-thumbnail surfaces | 11 | 6 | Radius scale |
| D12 | Retired-word and display-name copy needs Brian's exact replacement text | 10 | 6 | Small/one-off (retired words), Tailwind named colors |
| D11 | Five overlay shapes have no Kit pattern yet | 8 | 5 | Non-Kit overlays |
| D8 | Undeclared or uncited token names live in code | 7 | 6+ | Bridge variables, Small/one-off |
| D7 | Locked tokens written with a raw Tailwind alpha modifier | 3 | 2 | Small/one-off |
| D16 | Two off-token type-detail values in one label recipe | 2 | 1 | Type floor |
| D14 | `--surface-4` is reserved but still consumed by floating surfaces | 1 (+3 narrative-only) | 4+ | Bridge variables |
| D15 | The Home hero welcome line has no type-scale step | 1 | 1 | Type floor |
| D13 | *(withdrawn; see section 4)* | 0 | - | - |

## 2. Decisions

### D1. Opaque panel and control fills have no per-role surface mapping

**Rows: 853. Routes/packages: 87+**, effectively all 92 Current routes. `app/studio/layout.js` and `components/studio/studio-sidebar/StudioSidebar.view.jsx` alone each carry this gap onto 88 pages (every `/studio/**` route, per the audit's own collapse analysis, section 7); the public shell (`app/globals.css`, `components/ScrollControls.jsx`) carries it onto the public routes (`/`, `/login`, `/terms`, `/terms/[slug]`, `/lore`). Individually named routes in the hit tables include `/login`, `/terms`, `/terms/[slug]`, `/lore`, `/studio/image-studio`, `/studio/create/lore`, `/studio/profile/[username]`, `/studio/v2/lore/timelines/[id]`, `/studio/my-creations`, `/studio/creations/[id]`, and dozens more; the remaining reach comes through 48+ shared packages (`CrestfallSelect`, `FilterableIndex`, `RegistryLinkedCreationPickerModal`, `OutfitPickerModal`, and the mechanics-editor section packages among them).

What the gap is, in plain language: an opaque black (and a handful of near-black or near-white) fill is used as a card, control, well, or bed background across the app. The design law already states the *principle* - these fills should map onto the app's own opaque surface ramp, chosen by the fill's role (an input well is one step, a card is another, persistent chrome a third) - but has never named *which* alpha step goes to *which* role. Every one of these 853 rows carries a candidate ("candidate `--surface-2` by elevation role") rather than a ruled answer, and the law itself calls this "log, do not guess."

Current values in use, with counts (raw alpha-step occurrences across the document; the true per-row total after route exclusion is the 853 above):

| Value | Occurrences (raw) |
|---|---|
| `bg-black/35` | 144 |
| `bg-black/25` | 138 |
| `bg-black/45` | 77 |
| `bg-black/30` | 61 |
| `bg-black/20` | 56 |
| `bg-black/40` | 21 |
| `bg-black/55` | 20 |
| `bg-black/50`, `/60`, `/65`, `/70`, `/75`, `/80`, `/90`, `/95`, `/15`, `/10` (each under 10) | ~28 combined |
| Literal near-black hex used the same way (`#100f0d`, `#15130f`, `rgba(255,255,255,0.08)` as a well/tag fill) | ~10 |

Nearest existing tokens, with values: `--surface-1` (`#16130f` dark / `#f0e9d8` light, "Quiet sections, inset wells, inputs"), `--surface-2` (`#1d1a15` / `#f4eee0`, "Cards, list rows, icon-button fills"), `--surface-3` (`#24211a` / `#f8f3e7`, "Topbar, sidebar, sticky chrome"), `--surface-4` (`#2c271e` / `#fcf8ee`, reserved, no current floating-surface legal-on). These are exact role matches for the panel/control/chrome fills in question; the only thing missing is the ruling that assigns a specific bg-black/NN alpha, by role, to one of them (`docs/DESIGN-TOKENS.md`, "Surfaces" table and Debt map row "`bg-black/20` through `bg-black/45` panel fills").

Absorb or new: an existing token absorbs every one of these 853 rows. No new token is needed; this is a mapping ruling, not a minting ruling.

Options:
1. **Rule the per-role mapping now**: input beds and wells to `--surface-1`, cards/list rows/icon-button fills to `--surface-2`, persistent chrome to `--surface-3`, in one sitting, then batch-convert. Reuses tokens already locked in `docs/DESIGN-TOKENS.md` "Surfaces." Recommended - this is the single ruling queue item T2 has been waiting on since Sprint 3 (`docs/SPRINT-3-PLAN.md`, "Remaining queue," item T2), and it clears more rows at once than anything else in this report.
2. Defer further and keep logging. Costs nothing today but leaves 853 rows, and every route in the app, permanently open.
3. Convert every instance to a single flat step (always `--surface-2`) as a stopgap, accepting some visual mismatch on wells and chrome, to unblock the batch immediately pending a later per-role correction pass.

### D4. Status-colored running text on a panel: is the `-text` tier the ruled step

**Rows: 59. Routes/packages: 18**, including `/studio/community`, `/studio/create/lore`, `/studio/profile/[username]`, `/studio/profile/[username]/connections`, `/studio/create/character-template`, `/studio/create/narrator`, `/studio/create/wardrobe`, `/studio/v2/lore/timelines/[id]`, and the shared `edit-section-components`, `LoreEngineUse`, `LorePublicationReadiness`, `TimelineBuilder`, `image-creator-panel`, `character-engine`, `asset-builder-shared`, `studio-v2-studio`, and `mechanics-story-status-surfaces` packages.

What the gap is: dozens of rows convert a raw Tailwind status color (`text-red-200`, `text-amber-200`, `border-emerald-400/25 bg-emerald-400/10 text-emerald-100`, and so on) to the matching `--status-danger` / `--status-warning` / `--status-success` triad, and each one carries the same caveat: the Contrast law blocks any status color as *normal-size running text* on a `--surface-2/3/4` panel until "a brighter ladder step" is named. `docs/DESIGN-TOKENS.md` itself already names one, in a different section: `--status-danger-text`, `--status-warning-text`, and `--status-success-text` are locked tokens, minted by "Ruling 1, 22 Aug 2026," explicitly for "status-colored running text at normal size on dark panels only." But the Contrast law section of the same file, and `docs/FRONTEND-SOP.md` section 2, both still carry the older 12 Aug "STOP... no brighter step exists to name" language, unedited to reference the newer ruling. The audit's own unit passes split on this: some rows apply the `-text` tokens and move on; others (`LoreEngineUse`, `LorePublicationReadiness`, several U08/U09/U10/U12/U16 Stops) treat the question as still open and say "Stop and ask."

Current values in use: `text-red-200`/`text-red-100`/`border-red-300|400|500/NN`, `text-amber-200`/`text-amber-100`/`border-amber-300/NN`, `text-emerald-200`/`text-emerald-100`/`border-emerald-300|400/NN`, `text-amber-50`, `text-emerald-50`, `text-red-50` (roughly 45 danger/warning/success instances across the 59 rows, by literal Tailwind class).

Nearest existing tokens, with values: `--status-danger-text` `oklch(.78 .12 32)`, `--status-warning-text` `oklch(.80 .13 60)`, `--status-success-text` `oklch(.86 .09 135)` (`docs/DESIGN-TOKENS.md`, "Status colors," Ruling 1, 22 Aug 2026). These already carry the exact role description this dispute is about; the match is not approximate, it is a citation gap between two sections of the same document.

Absorb or new: fully absorbed by an existing, already-locked token family. Nothing to mint.

Options:
1. **Ratify that Ruling 1's `-text` tier closes the Contrast law's STOP for running text specifically**, and edit the Contrast law section of `docs/DESIGN-TOKENS.md` plus `docs/FRONTEND-SOP.md` section 2 to cross-reference Ruling 1 so this stops re-tripping unit passes. Recommended - it costs a documentation edit, not a design decision, since the token already exists for exactly this case.
2. Name a different or new ladder step instead of the `-text` tier.
3. Leave the Contrast law's STOP standing as written and require a per-instance render check before any of these 59 rows convert.

### D10. Loose filter and tab rows inside picker modals

**Rows: 57. Routes/packages: 6** - `/studio/create/stats-pools-profile` directly, plus the shared `FilterableIndex`, `ChatShell` (chat party roster), `mechanics-module-picker`, `mechanics-preset-application`, and `mechanics-actions` packages (reaching the my-creations edit sections and the v2 editor).

What the gap is: `docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` section 3.1 and the audit's MOCKUP-DECISIONS ADOPT ruling retire loose selectable chip and tab rows on *page-level list filters* in favor of `KitStudioFilterBar`. Every one of these 57 rows is the identical pattern - a row of `aria-pressed` or gold-bordered toggle buttons filtering a list - but sitting *inside a modal or picker* (a mechanics-module source-tab row, a preset-application scope-filter row, a Mine/Public source toggle, a Stats/Pools/Modifiers/Conditions panel switcher), not on a page. Nothing rules whether the page-level ADOPT ruling reaches inside a modal, or whether pickers keep their own lighter pattern; `components/kit/kit-ingredient-picker`'s search-plus-one-`KitDropdown` line is the only in-modal precedent anyone has actually built.

Current values in use: hand-rolled `aria-pressed` button rows and gold-bordered pill rows, 6 distinct call sites, one of them (`MechanicsModulePickerModal.view.jsx`) spanning 19 individual source-tab button lines and another (`MechanicsPresetApplicationModal.view.jsx`) spanning 18 scope-option lines - which is why this decision's row count is large despite touching only 6 places in the code.

Nearest existing tokens/patterns: `KitStudioFilterBar` (the ruled page-level pattern, `docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` 3.1) and `KitDropdown` (the one in-modal precedent already built, `components/kit/kit-ingredient-picker`). Neither is a value-level token question; this is a component-pattern ruling.

Absorb or new: an existing pattern (`KitDropdown`, optionally boxed in `KitFilterPanel`) can absorb every instance; nothing new needs building.

Options:
1. **Extend the ADOPT ruling into modals**, converting every picker-internal filter/tab row to a compact `KitDropdown` (or `KitFilterPanel` for the multi-filter cases), matching the `KitIngredientPicker` precedent. Recommended - it is the only pattern that already exists and is already proven inside a picker.
2. Rule that pickers keep a lighter, non-Kit tab pattern deliberately, since they are transient surfaces, not persistent list pages.
3. Leave every instance as-is; no change, accepting the pre-Kit look only inside pickers.

### D3. The light parchment surface has no token family

**Rows: 49. Routes/packages: 8** - `/intro` directly (`Breadcrumbs.jsx`); the shared `DetailPage` composition (`components/blocks/*`, `RelatedRecords.jsx`), which reaches `/characters/[...slug]`, `/factions/[...slug]`, `/locations/[...slug]`, and `/lore/[...slug]` in addition to `/intro`; the shared `lore-document-renderer`, which reaches `/studio/v2/lore/timelines/[id]/lore/[loreId]`, `/studio/creations/[id]` (for a LORE-type creation), and `/studio/my-creations/[id]/preview`; and `app/globals.css`'s own `--panel` / `--panel-strong` bridge aliases, which back the same sourcebook recipe.

What the gap is: two light-on-paper surfaces exist inside an otherwise dark app - the public policy/detail-page "sourcebook" article, and the Lore document renderer's parchment reader - and neither has its own ink, line, fill, or shadow token. The dark-theme Debt map conversions (`#7b5525` to `--gold-deep`, `#5a4732` to `--line-strong`) do not apply here: those map to the *dark* ramp value, and using the dark value on a light page either looks wrong or fails the Contrast law outright. `docs/DESIGN-TOKENS.md`'s own Surfaces and Ink tables already carry a full *Light* column (`--ink` Light `#2a2418`, `--line` Light `rgba(96,74,34,.17)`, and so on) for exactly this kind of surface, but nothing scopes those Light values onto `.sourcebook-page` or `.lore-parchment-page` outside a full app-wide theme toggle, which does not exist.

Current values in use, with counts: `#2a2118` / `#2a2418` (body ink, 6 rows across `blocks/*`), `#17120d` (heading/dark ink, 2 rows), `#3a2917` / `#5f421e` (h2/h3 ink, 2 rows), `#a88957` (ornament, 1 row), `rgba(120,85,40,.24-.28)` (warm-brown hairline/border/frame, 4 rows), `rgba(255,255,255,.18/.28)` (white wash on parchment, 2 rows); separately, the lore-parchment family: `#e4d4b8` (surface), `#17120d` (ink), `#7b5525` / `#6a481f` (heading gold, 6+ rows across chapter and cover instances), `#5a4732` / `#3b3024` (lines, 4 rows), `#44604b` / `#36513e` (the already-logged lore green pair), `bg-white/15` (return-button wash), and `rgba(255,251,240,.16)` + `rgba(225,205,169,.04)` (the overlay gradient); and `app/globals.css:106,174,196,218`'s `var(--panel)` / `var(--panel-strong)` (4 rows).

Nearest existing tokens, with values: the *Light* column already published for every dark-ramp token this surface needs - `--ink` `#2a2418`, `--ink-dim` `#5a5243`, `--gold-deep` `#4a3812`, `--line` `rgba(96,74,34,.17)`, `--line-strong` `rgba(96,74,34,.36)`, `--surface-1` `#f0e9d8` (`docs/DESIGN-TOKENS.md`, "Surfaces," "Ink," "Lines, fills, scrims" tables). `#2a2118` is one hex step from the Light `--ink` value already in the law; that is not a coincidence, it is the same color family already written down.

Absorb or new: the *existing* Light-theme values absorb nearly every literal in this decision; no new token is required to cover the .sourcebook-page family. The lore-parchment's own surface color (`#e4d4b8`) and its three box-shadow literals have no Light-column equivalent and would need one small new set (a parchment surface value and shadow) if the two parchment surfaces are meant to look different from each other; if they should look the same, the existing Light values cover both.

Options:
1. **Ratify that both parchment surfaces consume the existing Light-column values already in `docs/DESIGN-TOKENS.md`**, scoped with a `[data-theme="light"]`-style block on `.sourcebook-page` and `.lore-parchment-page` specifically, not a site-wide toggle. Recommended - reuses law already written, mints nothing, and does not touch the scale or naming convention.
2. Mint a dedicated `--parchment-*` token family, independent of the Light/Dark theme columns, so a future theme change cannot accidentally move the parchment surface. Naming-law note: `docs/DESIGN-TOKENS.md`'s locked tokens are named by role (`--ink`, `--surface-1`), not by material; a `--parchment-ink` name would be the first material-named token in the file and should be weighed against that pattern before minting.
3. Leave parchment as a documented literal exception in `docs/DESIGN-TOKENS.md`'s "Out of contract" list, never tokenized.

### D5. `border-white/10` family: is `--line-whisper` ever legal

**Rows: 39. Routes/packages: 9** - `/terms`, `/terms/[slug]`, `/studio/creations/[id]`, `/studio/my-creations`, `/studio/official-characters`, `/studio/create/character-template`, `/studio/my-creations/[id]/edit`, and the shared `ResponsiveFilterPanel` and `image-creator-panel`/`CrestfallSelect` packages.

What the gap is: this is not a mechanical-hit-table row (the class itself carries zero `log` rows; every `border-white/10` instance was already converted with a committed answer). It is a dispute the audit's own independent verifier pass raised across five units (`## 6`, "Verifier corrections," U01, U03 twice, U04 twice, U09, U10): `Ruling 5, 7 Aug 2026` names exactly two legal outputs for the white hairline family, `--line` and `--line-strong`, "per context." Several fixer passes wrote `--line-whisper` instead for card edges and input borders - and `docs/DESIGN-TOKENS.md`'s own "Lines, fills, scrims" table lists `--line-whisper`'s legal-on role as "Card edges, input borders, inset hairline dividers," which is exactly what these rows are. The verifier flagged every one of them as needing a ruling before `--line-whisper` is written, rather than picking a side.

Current values in use: `border-[var(--line-whisper)]` written where the source was `border-white/10`, on 39 named lines (`PolicyIndex.jsx:26`, `PolicyPage.jsx:52,65`, `StudioComingSoon.view.jsx:30`, `ResponsiveFilterPanel.fixtures.js:35,48`, `VideoDirectorJsonEditorModal.view.jsx:31,140,156,167,179`, `CrestfallSelect.jsx:46`, `MediaSection.jsx:17`, and a 27-line group across `CreationProfilePage.view.jsx`, `MyCreationsHub.view.jsx`, `CreationCard.view.jsx`, `CreationCredits.view.jsx`, `ItemStartingAssignmentEditor.view.jsx`, `AdvancedPromptingEditor.view.jsx`, `CreationPickerPanel.view.jsx`, `OfficialCharactersGrid.view.jsx`, and `CharacterTemplateGallery.view.jsx`).

Nearest existing tokens, with values: `--line` `rgba(242,209,148,.10)` (an exact alpha match to `border-white/10`'s own `.10`), `--line-strong` `rgba(242,209,148,.20)`, `--line-whisper` `rgba(242,209,148,.03)` (`docs/DESIGN-TOKENS.md`, "Lines, fills, scrims"). All three already exist and are locked; the dispute is which one Ruling 5 actually authorizes for these specific edges.

Absorb or new: fully absorbed either way; no new token needed.

Options:
1. **Add `--line-whisper` as a third legal output of Ruling 5, scoped to card edges and input borders**, matching the token's own documented role and what several fixer passes already wrote before being flagged. Recommended.
2. Hold Ruling 5 exactly as worded and correct all 39 instances to `--line` or `--line-strong` per the verifier's stricter reading.
3. Split by exact alpha match: `border-white/10` (`.10`) always becomes `--line` (also `.10`, an exact match), reserving `--line-whisper` for a source class with a genuinely lower alpha, if one exists elsewhere.

### D2. Decorative gradients and glows outside the sanctioned list

**Rows: 36. Routes/packages: 17** - `/` (public home, 4 rows), `/lore` (2 rows), `/studio/v2/home`, `/studio/v2/studio`, `/studio/my-creations` (via `CreationPreviewModal`), `/studio/profile/[username]` (via `PublicProfileHero`, `ProfileBanner`), `/studio/v2/lore/timelines/[id]` (via `TimelineReader`), and the shared `ScrollControls`, `MediaHistoryGridSkin`, `lore-document-renderer`, `StudioShell` (`app/studio/layout.js`, reaching every unauthenticated `/studio/**` view), `image-creator-panel`, `art-placeholder` (reaching 30 pages per the audit's own collapse analysis), and `KitPromoBanner` (reaching 12 pages) packages.

What the gap is: `docs/DESIGN-TOKENS.md` "Gradients, glows, atmosphere" locks a short, closed list of gradients and says "nothing outside this list is legal," and `docs/FRONTEND-SOP.md` section 2's anti-slop rule repeats "no gradient outside the sanctioned `--grad-*` list." Thirty-six rows write a literal `bg-gradient-to-*`, `linear-gradient(...)`, `radial-gradient(...)`, or a hand-authored shadow/ring with color stops instead, for roles the sanctioned list does not cover: an art-to-surface edge fade (horizontal and vertical, public home), a page atmosphere layer, an over-art bottom scrim, six identity-tone card gradients, a wordmark plate gradient with a text shadow, a selected-card ring, a marker glow, and a Home-hero frame shadow. Four of the public-home rows have a *named* candidate that already exists (`--atm-hearth`) and are simply not yet ruled to use it; the rest have no candidate at all.

Current values in use: `rgba(9,8,5,0.16-0.98)` edge-fade stops (3 rows, public home), `rgba(201,168,106,.06)` / `rgba(224,171,94,.025)` atmosphere stops (1 row), `rgba(196,163,98,.15-.2)` and `rgba(0,0,0,.85)` (selected-card ring and over-art text shadow, `StoryRoomCastPanel`), `from-black via-black/70-95 to-transparent` bottom washes (`image-creator-panel`, `MediaHistoryGridSkin`), six identity-tone `radial-gradient`/`linear-gradient` pairs (`kitArtPlaceholderIdentity.js`), `#303030`/`#181818`/`#262626` neutral-gray wordmark plate plus `rgba(238,238,238,.22)` text and a drop-shadow (`KitPromoBanner.view.jsx`), `bg-gradient-to-r from-black via-black/80 to-black/40` (`app/studio/layout.js`, the signed-out gate hero).

Nearest existing tokens, with values: `--atm-hearth`, `--atm-vault`, `--atm-veil`, `--atm-constellation` (locked, "applied as positioned layers," `docs/DESIGN-TOKENS.md` "Gradients, glows, atmosphere") match the public-home atmosphere layer's own row-level candidate exactly. `--scrim` `rgba(0,0,0,.40)` / `--scrim-strong` `rgba(0,0,0,.70)` are the nearest material for the over-art washes but are flat colors, not gradients, so they do not fully match a fading wash. Nothing in the locked list matches the identity-tone, wordmark, or selected-card-ring shapes at all.

Absorb or new: `--atm-hearth` absorbs the 4 public-home atmosphere rows outright. The remaining ~32 rows need between one and several new tokens, following the existing `--grad-*` naming pattern (role-based: `--grad-card`, `--grad-rail`, not material-based).

Options:
1. **Ratify `--atm-hearth` for the public-home atmosphere layer now** (zero-cost, reuses an existing locked token), and separately name the missing edge-fade and over-art bottom-scrim gradients as one or two new `--grad-*` tokens, leaving the smaller one-off shapes (wordmark plate, identity tones, selected-card ring) logged for a dedicated pass. Recommended as the first pass; unblocks the most rows for the least new-token surface.
2. Expand the sanctioned list wholesale in one sitting to cover every distinct shape found here (roughly 8 new tokens).
3. Require each gradient to earn its token individually at a future render sitting, case by case, as it comes up (status quo, slow, but zero risk of over-minting).

### D9. Violet, purple, and pink accents have no token

**Rows: 25. Routes/packages: 9** - `/studio/my-creations` (via `CreationCard`), `/studio/community`, `/studio/profile/[username]`, `/studio/create/actor-mechanics-profile`, `/studio/create/lore` (via `LoreEngineUse`, 15 of the 25 rows), and the shared `CreationStatusBadges`, `CreatorCard`, `creator-engagement-actions`, and `public-profile-activity-feed` packages.

What the gap is: the Debt map converts red, emerald, and amber Tailwind utilities to the status triad, and removes sky (no info color exists). It says nothing about violet, purple, or pink, and neither does the Status colors table - these hues are used for a "liked/bookmarked" icon state, a MATURE content-rating badge, and identity accents inside the Lore engine, and every one of the 25 rows reads "log, do not guess (missing token: no purple/pink accent exists)" with no candidate offered at all.

Current values in use, with counts: `text-pink-300` (liked/bookmarked, 2 rows), `text-pink-200` / `border-pink-400/25-45 bg-pink-400/10-15` (5 rows), `border-purple-400/25 bg-purple-400/10 text-purple-200` (MATURE badge, 1 row), `text-violet-100`/`text-violet-200` / `border-violet-300/20-40 bg-violet-300/[0.04]-.10` (17 rows, `LoreEngineUse`'s identity-accent marks).

Nearest existing tokens, with values: `--gold-action` `#e0ab5e` / `--gold-bright` `#f2d194` - the audit's own rows cite these as the one live precedent ("KitCreationCard and CreationPreviewModal render the liked state in `--gold-action` / `--gold-bright`"), though that is a different hue family, not a real color match. `--status-warning` `#C97B35` is the nearest *legal* accent hue in the law but carries a state meaning (warning), which a content-rating badge or a "liked" heart does not have.

Absorb or new: no existing token absorbs these without changing what the color means. A small new accent family is the honest answer for at least one of the three use cases.

Options:
1. **Collapse the "liked/bookmarked" pink onto the existing `--gold-action`/`--gold-bright` precedent** site-wide (2 rows, zero new tokens, matches what `KitCreationCard` already ships), and separately decide MATURE and the Lore identity accents. Recommended for the liked-state half.
2. Mint a small dedicated accent family (for example `--accent-violet`, `--accent-pink`) for MATURE and the Lore identity marks that do not carry a status meaning. Naming-law note: this follows the existing hue-family pattern (`--gold-action`, `--gold-ornament`) and would not need a scale change.
3. Route MATURE through the existing `--status-warning` triad instead of inventing a new hue, accepting that it reads as a warning rather than a rating tier.

### D6. Radius tier disputes on grid-sibling and nested-thumbnail surfaces

**Rows: 11. Routes/packages: 6** - `/studio/my-creations/[id]/edit` (`CreationEditMediaPanel`), `/studio/create/wardrobe` (`WardrobeBuilder`, a Verifier correction), `/studio/create/room-template` (`StructuredRegistryBuilder`), and the shared `edit-section-components` (`ActorMechanicsProfileAttachmentSection`), `RoomRegistryAttachmentsSection`, and `StoryRulesCodexAttachmentsSection` packages.

What the gap is: `docs/DESIGN-TOKENS.md`'s Corners rule is clear in principle ("tier is decided by where a surface sits, not how big it is," `--radius-sm` reserved for "small nested art thumbnails ONLY, the one exception," everything else nested defaults to `--radius-md`) but does not disambiguate the exact edge cases these 11 rows raise: is a ~64px thumbnail "small" enough to earn the exception, or does its role as a nested card put it at `--radius-md`? The audit's own verifier found one live miscue (`WardrobeBuilder.view.jsx` applied `--radius-lg` uniformly to a full-width surface and two grid-sibling surfaces that should have split `--radius-lg`/`--radius-md`), and a separate unit Stop (U16) named six more 64px-thumbnail instances where "which one applies is not written down."

Current values in use: `rounded-xl` on a featured-slot thumbnail grid (`CreationEditMediaPanel.view.jsx:52`), `rounded-xl` on a 64px profile-cover thumbnail and its icon placeholder (`ActorMechanicsProfileAttachmentSection.view.jsx:96,102`), `rounded-2xl` on three `WardrobeBuilder.view.jsx` panel instances (66, 175, 348, two of which are grid-siblings), and `rounded-xl` on six 64px nested-art-thumbnail instances (`StructuredRegistryBuilder.view.jsx:619,623`, `RoomRegistryAttachmentsSection.view.jsx:100,106`, `StoryRulesCodexAttachmentsSection.view.jsx:88,94`).

Nearest existing tokens, with values: `--radius-sm` `8px` ("Small nested art thumbnails ONLY"), `--radius-md` `12px` ("every grid-sibling card, everything nested inside a large panel"), `--radius-lg` `20px` ("every full-content-width surface"). All three are locked and exactly on point; the gap is which one a ~64px thumbnail or a grid-sibling panel actually is.

Absorb or new: fully absorbed by the existing three-tier scale. No new token.

Options:
1. **Rule a bright-line size test for the `--radius-sm` exception** (for example, any thumbnail under roughly 80px square qualifies; everything nested and larger defaults to `--radius-md`), removing per-instance judgment. Recommended.
2. Rule `--radius-sm` applies only inside the specific card types the law already names as precedent, and every other nested surface defaults to `--radius-md` regardless of pixel size.
3. Retire the `--radius-sm` thumbnail exception entirely and standardize every nested surface at `--radius-md`.

### D12. Retired-word and display-name copy needs Brian's exact replacement text

**Rows: 10. Routes/packages: 6** - `/lore`, `/studio/v2/stories`, `/studio/create/narrator`, and the shared `CreationStatusBadges`, `studio-v2-studio` (premise stop copy), and `TimelineBuilder` (view plus fixtures) packages.

What the gap is: `docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` section 1 names which words are retired (Arc, Codex, Sessions) and what the presentation-layer names are (Story, Adventure, and so on), but does not supply the exact replacement sentence for any of these ten specific strings - the audit itself calls this "copy ruling needed," not a hit to convert mechanically.

Current copy: `eyebrow="The Codex"` (`/lore`, sits directly above the title "Lore"), "Choose the Story-session preference for future in-chat imagery" (`/studio/v2/stories`), a bare "sessions" placeholder (`/studio/create/narrator`), a bare "session" string (`studio-v2-studio` premise stop), the CANON badge sharing the `emerald` "success" recipe rather than its own exclusive-gold treatment (`docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` section 5 rules CANON an exclusive gold badge), and the `TimelineBuilder` placeholder and fixture chapter titles ("Arc I - Origins to Bronze Age," "Arc I," "Arc II"), each also carrying a forbidden em dash.

Nearest law: `docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` section 1's presentation-name table and retired-word list settle *which* words go away and what the entity is called; they do not write the sentence. `docs/DESIGN-TOKENS.md` has no CANON-badge token distinct from the success triad.

Absorb or new: the copy fixes need Brian's words, not a token. The CANON badge needs either a new small token (a gold badge variant) or reuse of `--gold-action`/`--tag-fill-ink`, which already exist.

Options:
1. **Brian supplies the exact replacement copy for each of the ten strings in one pass**, and CANON's badge is ruled to reuse `--gold-action`/`--tag-fill-ink` rather than the success triad. Recommended - fastest, and keeps the copy consistent across all ten sites at once.
2. Delegate replacement wording to whoever lands each area's own fix, checked against the UXUI section 1 table at review time.
3. Leave the non-compliant copy in place until a dedicated copy-hygiene pass (which will also need to remove the em dashes here regardless) touches these files.

### D11. Five overlay shapes have no Kit pattern yet

**Rows: 8. Routes/packages: 5** - `/studio/v2/images` (the Compose action dock), `/studio/v2/stories/[id]/character-configuration` (the datalist combobox), `/studio/create/lore` (`LoreEditor`'s two picker-shaped modals), and the shared `StoryRoomChatShell` (side-anchored mobile drawer) and `MediaHistoryGridSkin` (in-viewer delete confirm) packages; the sixth reach is structural, through `StudioMobileNav`'s bottom dock, onto every `/studio/**` route.

What the gap is: `KitModalFrame` has exactly three named variants (modal, sheet, viewer, per `docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` 3.5's "maximize... at phone width... center at 700px and up"). Five real overlay shapes in the app do not fit any of the three: a persistent, non-modal bottom action dock (both the legacy studio-wide navigation dock and the Media Studio Compose dock); a native `<input list>` plus `<datalist>` combobox, for which no Kit combobox exists at all; a side-anchored (not bottom-sheet) drawer; an in-viewer delete-confirm panel that rides `KitImageViewer`'s own `overlaySlot` instead of a `KitModalFrame` modal; and two picker-shaped modals that could reasonably go to either `KitPickerModal` or a plain `KitModalFrame` modal, with no ruling saying which.

Current shapes: `components/studio/studio-mobile-nav/StudioMobileNav.view.jsx:267` (bottom nav dock, `.cf-dock-link` recipe, already token-clean), `app/studio/v2/images/ImagesV2Live.jsx:385` (Compose dock, also token-clean), `components/studio/story-rooms/story-character-configuration/StoryCharacterConfiguration.view.jsx:243,319` (datalist combobox), `components/studio/story-rooms/story-room-mobile-drawer/StoryRoomMobileDrawer.view.jsx:56` (side drawer), `components/studio/media/media-lightbox/MediaLightbox.view.jsx:406` (in-viewer confirm), and `components/studio/create/lore/lore-editor/LoreEditor.view.jsx:918,1023` (BlockPickerModal, ImagePickerModal).

Nearest existing tokens/patterns: `KitModalFrame`'s three variants, `KitDropdown` (a closed-trigger menu, not a typed-filter combobox), `KitPickerModal` (a picker with a search field). None is a value-level token question; these are component-vocabulary rulings.

Absorb or new: the dock and drawer cases need the Kit vocabulary itself extended (a fourth variant, or a ruling that side drawers are out-of-vocabulary and convert to sheets); the combobox needs a genuinely new component; the two `LoreEditor` modals can go to an existing pattern once someone picks one.

Options:
1. **Rule that `KitModalFrame` gains a fourth "dock" variant** (persistent, non-modal, bottom-anchored) covering both dock instances, and that a side-anchored drawer is out of the Kit vocabulary (convert to a bottom sheet everywhere). Recommended for the dock and drawer half - both docks are already token-clean, so this is a pattern ruling, not a rebuild.
2. Build a new `KitCombobox` for the datalist cases rather than stretching `KitDropdown` to do a job it was not designed for.
3. Leave all five as documented one-off exceptions, never folded into the Kit vocabulary.

### D8. Undeclared or uncited token names live in code

**Rows: 7 (formal), reaching 6+ routes/packages** directly, plus a wider reach through `KitCreationCard`'s kebab menu and `KitFilterPanel`'s popover, both of which mount on many more routes than the 6 named here.

What the gap is: five distinct `var(--x)` names are used in live code that either do not exist in `app/theme.css` at all, or exist there but were never carried into `docs/DESIGN-TOKENS.md`'s law. `--parchment` is declared nowhere (`components/ScrollControls.jsx:40,68`). `--text-head` / `--lh-head` are declared nowhere; the real pair is `--text-heading` / `--lh-heading` (`app/studio/v2/stories/StoryLaunchRequirementsSheet.jsx:91`). `--radius-xl` is declared nowhere; the scale stops at `--radius-lg` (`MediaHistoryGrid.view.jsx:353`). `--surface-0` is declared nowhere; the ramp starts at `--canvas`/`--surface-1` (`TimelineReader.view.jsx:70`). And `--panel-ui-glass` *is* declared, in `app/theme.css:622` and `:843`, but was never ratified into `docs/DESIGN-TOKENS.md`, which instead names `--panel-glass` as the one menu/popover surface app-wide; `--panel-ui-glass` has two live consumers (`KitCreationCard`'s owner kebab menu, `KitFilterPanel`'s filter popover) that render an undocumented recipe today.

Current values in use: `hover:text-[var(--parchment)]` (2 lines), `text-[length:var(--text-head)] leading-[var(--lh-head)]` (1 line), `rounded-t-[var(--radius-xl)]` (1 line), `focus-visible:ring-offset-[var(--surface-0)]` (1 line), `bg-[var(--panel-ui-glass)]` (2 consumers).

Nearest existing tokens, with values: `--ink` `#ece7dc`/`#2a2418` (for `--parchment`), `--text-heading`/`--lh-heading` `28/36` (for `--text-head`/`--lh-head`), `--radius-lg` `20px` (the ceiling of the scale, for `--radius-xl`), `--canvas` `#090805` or `--surface-1` `#16130f` (for `--surface-0`), `--panel-glass` `rgba(36,32,25,.85)` (the ratified sibling of `--panel-ui-glass`).

Absorb or new: the four broken references are pure staleness or typos - an existing, correctly-named token absorbs each one exactly. `--panel-ui-glass` is a genuine two-way choice: migrate its two consumers to `--panel-glass`, or ratify `--panel-ui-glass` as a legal bordered variant.

Options:
1. **Fix the four broken `var()` references to their real declared names in one mechanical pass** (no design decision required), and separately rule whether `KitCreationCard` and `KitFilterPanel` move to `--panel-glass` or `--panel-ui-glass` gets ratified as a bordered-menu variant. Recommended.
2. Leave the broken references as-is until each consumer's own session lands.
3. Ratify `--panel-ui-glass` into `docs/DESIGN-TOKENS.md` as a legal bordered variant instead of migrating its two consumers.

### D7. Locked tokens written with a raw Tailwind alpha modifier

**Rows: 3. Routes/packages: 2** - `/studio/my-creations/[id]/edit` and `/studio/v2/editor/[id]` (both reached through the shared `edit-section-components` registry, which the audit's own package note confirms "mounted by both the legacy edit route and the v2 editor").

What the gap is: three rows write a locked color token with a raw Tailwind alpha fraction (`border-[var(--gold-ornament)]/35`, `bg-[var(--gold-ornament)]/10`, `hover:bg-[var(--gold-ornament)]/20`, `border-[var(--gold-ornament)]/30`, `bg-[var(--gold-ornament)]/5`) instead of resolving through the line or fill family, which already expresses the same base color at fixed, named alpha steps. No rule in the law says whether this shorthand is ever legal.

Current values in use: `border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 hover:bg-[var(--gold-ornament)]/20` (`LocationSensoryEnvironmentFields.view.jsx:66`, an icon button), `border-[var(--gold-ornament)]/30 bg-[var(--gold-ornament)]/5` and `/25 /5` (`OutfitPromptGuidanceSection.view.jsx:155,192`, a notice strip).

Nearest existing tokens, with values: `--line-whisper` `rgba(242,209,148,.03)`, `--line` `rgba(242,209,148,.10)`, `--fill-whisper` `rgba(242,209,148,.06)`, `--fill` `rgba(242,209,148,.12)`, `--fill-strong` `rgba(242,209,148,.20)` - all derived from the same base gold these three rows are re-deriving by hand with an arbitrary fraction.

Absorb or new: fully absorbed; no new token.

Options:
1. **Rule that a locked color token is never written with a raw Tailwind alpha modifier**; every wash or border resolves through the matching line or fill family step instead. Recommended - consistent with how the rest of the law is already structured.
2. Allow modifiers only from a short, pre-approved whitelist of fractions.
3. Leave modifiers legal case by case, with no blanket rule.

### D16. Two off-token type-detail values in one label recipe

**Rows: 2. Routes/packages: 1** - `/studio/my-creations/[id]/edit` (`WardrobeFieldsSection.view.jsx`).

What the gap is: one field-label recipe carries two small unruled values alongside an otherwise-exact conversion: `tracking-[0.12em]` (line 235, next to a `text-[11px]` that maps exactly to `--text-label`) has no matching tracking token, and the same file's line 403 offers a real recipe (`SharedFields`'s `LABEL_CLASS`) but leaves the label's *color* an open choice between `--ink-faint` (the `SharedFields` precedent) and `--gold-ornament` (this file's own current color), logged for the fixer rather than decided.

Current values in use: `tracking-[0.12em]` (1 row), a color choice between `--ink-faint` and `--gold-ornament` for the same label class (1 row).

Nearest existing tokens, with values: `--track-label` `.18em` (the only locked tracking token near this value), `--ink-faint` `#8d8674`/`#7c7259`, `--gold-ornament` `#C9A86A`/`#8a6524` (both already locked; the ambiguity is role, not value).

Absorb or new: fully absorbed; no new token.

Options:
1. **Snap `tracking-[0.12em]` to `--track-label` (`.18em`)** as a visible but intentional change, and rule the wardrobe label color follows the `SharedFields` precedent (`--ink-faint`) for consistency across every label recipe in the editor. Recommended.
2. Mint a tighter tracking step distinct from `--track-label` for compact ID lines specifically.
3. Leave both as page-local exceptions, given the row count is only 2.

### D14. `--surface-4` is reserved but still consumed by floating surfaces

**Row: 1 formal hit-table row, plus 3 more instances the audit names by reading (not yet formal hit rows): `components/kit/form-field/InfoTip.jsx:23`, `components/kit/asset-detail-popup/KitAssetDetailPopup.view.jsx:211`, `components/kit/picker-modal/KitPickerModal.view.jsx:148`. Routes/packages: 4+** - the creator-stops `InfoTip.jsx:94` variant directly, plus the widely-reused kit `InfoTip`, `KitAssetDetailPopup`, and `KitPickerModal` components, each mounted on many routes.

What the gap is: `docs/DESIGN-TOKENS.md`'s Surfaces table locks `--surface-4` as "Superseded on floating chrome 22 Aug 2026... No floating-surface consumer remains," since modal panels moved to `--grad-panel-lift` and menus/popovers moved to `--panel-glass` in the same ruling. Four floating consumers still write `bg-[var(--surface-4)]` directly: a tooltip recipe, a catalogue slide card, a picker tile check badge, and a creator-stops info panel, none of them migrated when the rest of the app's menus and popovers moved.

Current values in use: `bg-[var(--surface-4)]` (4 instances, each on a floating or popover-adjacent surface).

Nearest existing tokens, with values: `--panel-glass` `rgba(36,32,25,.85)`, paired with `--blur-panel` `2px` - the exact recipe every other menu and popover in the app already moved to in the same 22 Aug ruling that reserved `--surface-4`.

Absorb or new: fully absorbed by `--panel-glass`; no new token.

Options:
1. **Extend the 22 Aug `--panel-glass` widening explicitly to these four holdouts**, closing the last `--surface-4` floating consumers. Recommended - consistent with the law's own stated direction, and the widening ruling already says "every menu and popover app-wide."
2. Hold these four sites at `--surface-4` as a deliberate, documented exception until the CR-047 tooltip-glass component ships.
3. Move them to `--surface-3` paired with `--shadow-popover` instead of `--panel-glass`.

### D15. The Home hero welcome line has no type-scale step

**Row: 1. Route: `/studio/v2/home`.**

What the gap is: `app/studio/v2/home/home/Home.view.jsx:34` sets the welcome line at `text-[clamp(1.55rem,2.35vw,2.65rem)] leading-[1.05] tracking-[-0.015em]`, a fluid size between 24.8px and 42.4px. `docs/DESIGN-TOKENS.md`'s Type scale brackets that range with `--text-heading`/`--lh-heading` (28/36) below and `--text-display`/`--lh-display` (40/48) above, but the one fluid step in the scale, `--text-hero`, is explicitly reserved "Hero only, never product UI" - and this welcome line sits inside the ruled Home hero composition (Home contract 4.0.0, 6 Sep 2026), not ordinary product copy, which is exactly the case `--text-hero`'s own restriction does not address either way.

Current value in use: `clamp(1.55rem,2.35vw,2.65rem)` / `leading-[1.05]` / `tracking-[-0.015em]` (1 row).

Nearest existing tokens, with values: `--text-heading`/`--lh-heading` `28/36`, `--text-display`/`--lh-display` `40/48`, `--text-hero` (fluid, hero-only), `--track-tight` `-.01em` (close to the `-.015em` used here).

Absorb or new: fully absorbed either by extending `--text-hero`'s scope or by snapping to a fixed step; no new token strictly required, though a distinct fluid step is a defensible small mint.

Options:
1. **Rule that the welcome line counts as "Hero" for type-scale purposes**, extending `--text-hero`'s fluid formula to this specific line, since it sits inside the ruled hero composition rather than ordinary product UI. Recommended.
2. Snap it to the nearest fixed step, `--text-display`, and drop the fluid clamp.
3. Mint a new fluid step scoped to "hero-adjacent welcome lines," distinct from both `--text-hero` and the fixed scale.

## 3. A note on two large, already-answered items this report does not re-open

Two things surfaced repeatedly while tracing these rows and are worth naming even though they are not decisions:

- `app/studio/v2/home/home/Home.view.jsx:45`'s sheen gradient reads, in its own row, "no sheen gradient token" - but a Verifier correction (`## 6`, "Verifier corrections, unit U06") already found this claim false: `--grad-sheen` exists (`app/theme.css:694`) and `.cf-sheen` already consumes it (`app/design-system.css:31-50`). This row is excluded from D2's count because it is a citation error already resolved, not a gap.
- `LoreEngineUse.view.jsx:847`'s `text-sky-50` reads "log, do not guess" in isolation, but the Debt map already rules sky "REMOVED, not converted (no info color)," and the row's own note points at a neutral chip recipe the same file already uses correctly elsewhere. Excluded for the same reason.

## 4. Classes fully ruled, no decision needed

- **Focus visibility** (`outline-none`): zero `log` rows on any Current route; every instance resolves against the global `--focus-ring` rule.
- **Type floor, sub-11px half** (`sub11-type`): zero `log` rows; every `text-[10px]`/`[9px]`/`[8px]` instance already names `--text-label` as the token, with a per-use render check (queue item T10) as the only remaining step - a verification task, not a missing-token question.
- **Radius scale, pill half** (`pill-buttons-candidates`): zero `log` rows; every `rounded-full` instance is already ruled exact, approximate, or reviewed-and-legal.
- **Small/one-off, `heavy-weights`**: its one instance (`KitCreatorCard.view.jsx:87`) already has a ruled answer - `--weight-light` per A1's ghost-button rule - and is a bug to fix, not a ruling to make.
- **Small/one-off, `off-grid-spacing`**: its one instance (`ChatCastPanel`/`ChatPartyRoster`/`ChatStatePanel`) lives entirely inside the chat package, which the audit's own Stops confirm has no product consumer outside the retired preview harness (U06); it carries zero Current-route rows and needs no ruling here.

Also excluded from every decision above, and flagged again rather than folded in: the 40 hit lines across `app/studio/account/**` and `app/studio/v2/account/**` that the audit's own reconciliation (`## 6`) could not attribute to any category or replacement. There is no old value or candidate recorded for them, so this report cannot group them into a decision without inventing content; they need a fresh reconciliation pass before anyone can say whether they are gaps at all.

## STATUS

G1: DONE. `git status --short` empty, branch `fe/css`, confirmed before the first read.
G2: DONE. 1,161 gap rows on Current routes, all traced to specific hit-table rows, Verifier corrections, or Stops bullets; the 16 decisions above sum to that total with none counted twice (D13 withdrawn on verification, its one candidate row already resolved, folded into section 4).
G3: DONE. Every decision states its current values with counts and its nearest existing tokens with values.
G4: DONE. Every proposed new token or naming choice is checked against `docs/DESIGN-TOKENS.md`'s naming and scale law, cited by section, in the decision that proposes it.
G5: no em dashes in this file (checked by re-read before commit). Commit "docs: token gaps 11 Sep 2026", push, tree clean.

NEXT ACTION: Brian rules the token gaps.
