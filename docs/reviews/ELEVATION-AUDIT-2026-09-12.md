# Elevation audit, 12 Sep 2026 (read-only, R10 follow-up)

Branch `fe/css`, at `97719d16` when this audit started. READ-ONLY: no
component, style, or token file was changed to produce this report. The
only writes this pass made are this file and the `bible/STATUS.md`
entry it names.

Reference pages: `/studio/create/storyline`, `/studio/create/lore`,
`/studio/create/actor-mechanics-profile`. Method: for G1 and part of
G4, three and six read-only subagents respectively traced the actual
import chain from each page's `page.js` down through its Shell, View,
and Kit consumers, citing file:line for every claim; the lead session
verified `app/theme.css`, `docs/DESIGN-TOKENS.md`, and ran the G2 and
G3 greps directly. Every value below is dark theme unless stated.

## G1. The elevation ladder

Token ladder as declared (`app/theme.css`, dark theme): `--canvas`
`#090805`, `--surface-1` `#16130f`, `--surface-2` `#1d1a15`,
`--surface-3` `#24211a`, `--surface-4` `#2c271e` (ruled 22 Aug 2026,
no floating-surface consumer should remain), `--bed-deep` `#0d0b08`
(documented field-bed fill, legal on field beds, never on the
surface-1..4 ramp), `--panel-glass` `rgba(36,32,25,.85)` (ratified
menu/popover/dropdown-panel background), `--grad-panel-lift`
`linear-gradient(160deg,#332d22,#2a251d)` (ratified modal panel).
Consecutive surface steps sit 6 to 13 units apart per channel out of
255; anything under roughly 10 units per channel reads as
indistinguishable to a human eye at this luminance.

One fact holds across all three pages before the per-page tables: none
of them render an actual `--bed-deep` field bed anywhere; that token
has zero consumers in `components/` (confirmed by grep). Fields
instead sit on `--surface-1`, one full step above where the documented
role table puts them, and directly adjacent to whatever the page calls
its "card."

### /studio/create/storyline

| Step | File:line | Token | Resolves to (dark) | Note |
|---|---|---|---|---|
| Page background | `components/studio/studio-shell/StudioShell.view.jsx:14` | `--canvas` | `#090805` | Ancestor `<main>` every signed-in `/studio/*` route renders through; the page itself declares no background. |
| Card | `components/studio/storylines/storyline-builder-shell/StorylineBuilderShell.view.jsx:138` | `--surface-1` | `#16130f` | Same at lines 39 and 142: every top-level panel this shell renders is `--surface-1`, not the docs' `--surface-2` "cards" token. |
| Nested card | `components/studio/storylines/storyline-node-list-editor/StorylineNodeListEditor.view.jsx:81` | `--surface-2` | `#1d1a15` | Per-node article card, nested inside the `--surface-1` wrapper above via the `nodeEditorSlot` prop. Confirmed always-reachable. |
| Input field | `components/studio/storylines/storyline-builder-shell/StorylineBuilderShell.view.jsx:56` | `--surface-1` | `#16130f` | `KitFormField` is imported zero times anywhere under `components/studio/storylines/`; every field is a raw input inline-styled `--surface-1`. The title input at line 56 is the literal same fill as the aside it sits inside (row 2). |
| Dropdown trigger | `components/kit/dropdown/KitDropdown.view.jsx:165` | `--surface-2` | `#1d1a15` | Six call sites on this page alone (Visibility, Content Rating, Default Transition, plus three list-editor selects) all render this one file:line. |
| Modal | `components/kit/modal-frame/useKitModalFrameViewModel.js:55` | `--grad-panel-lift` | `linear-gradient(160deg,#332d22,#2a251d)` | Reached via the node list's "Add story or scenario" button, `StorylineReferencePickerModal`. Correctly wired to the ratified token; the one step on this page that reads as genuinely distinct. |

Indistinguishable adjacent pairs: card (`#16130f`) vs nested card
(`#1d1a15`), nested card vs input field (reverse of the same pair),
input field vs dropdown trigger (the same pair again) all differ by
about 7 units per channel, under the distinguishability floor. The
input field is additionally byte-identical to its own enclosing card
(both `--surface-1`), not merely close. Page background vs card
(`#090805` vs `#16130f`, about 11 to 13 units per channel) sits right
at the edge of the floor; `app/theme.css`'s own inline comment
describes this as the ladder's first of "four even steps," so it
reads as an intentional first step rather than a collision, if a
narrow one.

### /studio/create/lore

| Step | File:line | Token | Resolves to (dark) | Note |
|---|---|---|---|---|
| Page background | `components/studio/studio-shell/StudioShell.view.jsx:14` | `--canvas` | `#090805` | Same ancestor as storyline. |
| Card | `components/studio/create/lore/lore-builder/LoreBuilder.view.jsx:48` | `--surface-1` | `#16130f` | Also at lines 83 and 102, and at `lore-editor/LoreEditor.view.jsx:1179` (the editor's own outer wrapper): every top-level card this shell renders is `--surface-1`, matching the storyline pattern. |
| Nested card | `components/studio/create/lore/lore-editor/LoreEditor.view.jsx:1399` | `--surface-2` | `#1d1a15` | Real nesting, four levels deep, every level the identical token: chapter article (1399) inside the surface-1 editor section (1179); an expanded chapter's section (1616) inside the chapter; a two-column block's per-column section (732) inside that; a `ColumnBlockCard` (249) inside that. Depths 1 through 4 are pixel-identical. |
| Input field | `components/studio/my-creations/edit/sections/SharedFields.jsx:65` (and `:293` for textareas) | `--surface-1` | `#16130f` | Reached by the shared `TextField`/`TextAreaField` this page's Description, Publication summary, and chapter/section bodies all render through, plus this page's own hand-rolled local input class (`LoreBuilder.view.jsx:12`, `LoreEditor.view.jsx:50`) which hardcodes the same literal independently. Identical to the card row, not merely close. |
| Dropdown trigger | `components/kit/dropdown/KitDropdown.view.jsx:165` | `--surface-2` | `#1d1a15` | Reached via `SharedFields.jsx:195`'s `SelectField` for Draft visibility, Content rating, heading Level, image Size/Alignment. Identical to the nested-card row. |
| Modal | `components/kit/modal-frame/useKitModalFrameViewModel.js:55` (compliant); `LoreEditor.view.jsx:927` and `:1029` (non-compliant) | `--grad-panel-lift` vs. a raw literal | `linear-gradient(160deg,#332d22,#2a251d)` vs. `#100d09` | Only one of the three modals this page reaches (the JSON editor) uses the ratified token. `LoreEditor.view.jsx`'s own `BlockPickerModal` (line 927) and `ImagePickerModal` (line 1029) hardcode `backgroundColor:"#100d09"` / `bg-[#100d09]` directly, no `var()`, no token at all. |

Indistinguishable adjacent pairs: the same three-hop chain as
storyline (card, nested card, input field, dropdown trigger alternate
`#16130f`/`#1d1a15` at about 7 units per channel), plus two exact
zero-diff collisions specific to this page: card and input field are
the identical token (`--surface-1`), and nested card and dropdown
trigger are the identical token (`--surface-2`). The two raw-literal
modals (`#100d09`) sit within 3 to 5 units per channel of the dead
`--bed-deep` value and within 7 to 13 units of `--canvas`/`--surface-1`,
so those two floating panels are visually inseparable from the page
background, and structurally invisible to the token system entirely.

### /studio/create/actor-mechanics-profile

| Step | File:line | Token | Resolves to (dark) | Note |
|---|---|---|---|---|
| Page background | `app/globals.css:52` (`body` background, chained through `--background: var(--canvas)` at `globals.css:17`) | `--canvas` | `#090805` | `components/studio/StudioShell.jsx` (the flat Shell, 58 lines) declares no background of its own; the same `StudioShell.view.jsx:14` `bg-[var(--canvas)]` confirmed for the other two pages also applies here, painted over this same body value. Dark mode layers four low-opacity radial washes over this base (`globals.css:52-56`), a documented atmosphere effect, not a token violation. |
| Card | `components/studio/create/actor-mechanics-profile/actor-mechanics-profile-builder/ActorMechanicsProfileBuilder.view.jsx:62` | `--surface-2` | `#1d1a15` | Also at line 125, and at `actor-mechanics-profile-editor/ActorMechanicsProfileEditor.view.jsx:229`. Unlike the other two pages, this page's card actually lands on the documented `--surface-2` "cards" token. |
| Nested card | `ActorMechanicsProfileEditor.view.jsx:375` | `--surface-2` | `#1d1a15` | The "Structural Origin" readout box nests inside the outer section opened at line 229. Both levels are the identical token, zero separation. A second copy of the same collision recurs one level deeper inside the reachable JSON editor modal (`ActorMechanicsProfileJsonEditorModal.view.jsx:164` containing `:176`, both `--surface-2`). |
| Input field | `components/studio/my-creations/edit/sections/SharedFields.jsx:293` | `--surface-1` | `#16130f` | Reached through `TextAreaField` (Profile Summary, Capability Notes, Binding Notes) and this page's own local single-line input helper, which hardcodes the identical literal directly rather than importing the shared component. |
| Dropdown trigger | `components/kit/dropdown/KitDropdown.view.jsx:165` | `--surface-2` | `#1d1a15` | A dozen or more live instances on this page (Profile Preset, Binding Mode, Owner Type, Domain, Activation Mode, Reference Type, Visibility, Content rating). Byte-identical to the card token. |
| Modal | `components/kit/modal-frame/useKitModalFrameViewModel.js:55` | `--grad-panel-lift` | `linear-gradient(160deg,#332d22,#2a251d)` | Reached via the Editor's "JSON editor" button. Correctly wired; not the stale `--surface-4` `app/theme.css` still comments as "modals, menus, popovers." |

Indistinguishable adjacent pairs: card and nested card are the
identical token (`--surface-2`, zero diff), the only page of the three
where that exact collision sits at the card tier itself rather than
one level in. Input field vs. card/dropdown-trigger differ by the same
sub-floor ~7 units per channel as the other two pages.

### G1 synthesis

All three reference pages independently converge on the same defect
shape, not three unrelated bugs: the six-step ladder the brief asked
about is, in the actual rendered tree, only ever two adjacent dark
values (`#16130f` and `#1d1a15`, about 7 units per channel apart)
doing double or triple duty, bracketed by `--canvas` at the bottom (a
narrow but real first step) and `--grad-panel-lift`'s gradient at the
top (the one step that reads as genuinely separate on every page,
because it is the only step built from two color stops rather than a
flat fill). `--bed-deep`, the token that would have put input fields
visibly below the card/dropdown tier, is dead in the codebase; no
consumer anywhere references it. `docs/DESIGN-TOKENS.md`'s Surfaces
table has no row at all for "a card nested inside a card," so every
package that nests cards (lore four levels deep, actor mechanics
profile at least twice) falls back to the single `--surface-2` value
with zero designed differentiation by depth, which is a gap in the
design law itself, not only in its implementation. Two further,
narrower findings recur across pages: the closed `KitDropdown` trigger
(`KitDropdown.view.jsx:165`) is the literal same token as a card
(`--surface-2`), and the open dropdown/menu panel
(`KitDropdown.view.jsx:201`, and four other Kit consumers) resolves
through an undocumented `--panel-ui-glass` token (`app/theme.css:622`,
`rgba(36,32,25,.92)`) rather than the ratified `--panel-glass`
(`rgba(36,32,25,.85)`, "NEW LAW B," 22 Aug 2026); see G2 for the full
file list. G1 DONE.

## G2. Distinct surface values across `/studio/create`

Commands run from the repo root, scope `components/studio/create`,
`components/kit`, `components/ui` (the packages every `/studio/create`
page actually composes):

```
grep -rnoE "bg-\[var\(--[a-zA-Z0-9-]+\)\]" components/studio/create components/kit components/ui
grep -rnoE "bg-\[#[0-9a-fA-F]{3,8}\]" components/studio/create components/kit components/ui
grep -rnoE "bg-(black|white)/[0-9]+" components/studio/create components/kit components/ui
```

Tokenized surface values in use (`bg-[var(--...)]` form), by count:
`--surface-1` 318, `--surface-2` 265, `--surface-4` 12, `--surface-3`
7, `--panel-glass` 7, `--panel-ui-glass` 6, `--canvas` 2. (Non-surface
gold/fill/status tokens also appear in this grep and are not elevation
steps; omitted here.)

**Count for the brief's question: 7 distinct surface-family token
values are in live use** (`--canvas`, `--surface-1`, `--surface-2`,
`--surface-3`, `--surface-4`, `--panel-glass`, `--panel-ui-glass`),
against a designed ladder of 5 opaque steps plus 2 floating recipes
(`--panel-glass`/`--grad-panel-lift`). The two outliers, both named
below with file and line:

**`--panel-ui-glass`, undocumented token (6 hits).** Declared in
`app/theme.css:622` (dark, `rgba(36,32,25,.92)`) and `:843` (light,
`rgba(252,248,238,.94)`) with no row anywhere in
`docs/DESIGN-TOKENS.md`. A comment at `KitDropdown.view.jsx:194`
("UI popovers use `--panel-ui-glass` at `--blur-panel` so the...")
shows it was a deliberate, explained choice at the point of writing,
just never entered into the token law per `docs/FRONTEND-SOP.md`
section 4 ("a new TOKEN enters `app/theme.css` only through a Brian
ruling, and enters `docs/DESIGN-TOKENS.md` in the same commit"). Used
instead of the ratified `--panel-glass` at:
`components/kit/dropdown/KitDropdown.view.jsx:201` (the dropdown menu
panel), `components/kit/creation-card/KitCreationCard.view.jsx:206`,
`components/kit/form-field/menuRecipe.jsx:18`,
`components/kit/global-search/KitGlobalSearch.view.jsx:53` and `:171`,
`components/kit/filter-panel/KitFilterPanel.view.jsx:245`.

**`--surface-4`, ruled retired for floating chrome (12 hits, 6 in
product code).** `docs/DESIGN-TOKENS.md`'s Surfaces table states, 22
Aug 2026, "No floating-surface consumer remains" for this token. 6 of
the 12 hits are in `components/ui/modal-shell/ModalShell.fixtures.js`
(a fixtures file, excluded from zero-tolerance counts by the same
document's own methodology note) and are stale demo data, not a
product violation. The remaining 6 are live product code, all
floating or popover-shaped surfaces the ruling says should not exist:
`components/kit/asset-detail-popup/KitAssetDetailPopup.view.jsx:211`
(a popover, `shadow-popover`, the clearest violation of the ruling as
written), `components/studio/create/room-template/room-template-package-picker/RoomTemplatePackagePickerModal.view.jsx:52`
(a modal panel that should be `--grad-panel-lift`),
`components/studio/create/location-registry/location-registry-builder/LocationRegistryBuilder.view.jsx:1412`
(same shape, same gap), `components/kit/picker-modal/KitPickerModal.view.jsx:148`
(a close-button icon chip), and the two `InfoTip` tooltip recipes named
in G4 (`components/kit/form-field/InfoTip.jsx:23`,
`components/studio/create/character/creator-stops/InfoTip.jsx:94`).

Raw hex `bg-[#...]` outliers (9 hits, all named in
`docs/DESIGN-TOKENS.md`'s Debt map as known, ruled-pending conversions,
not new violations): `#080706` at
`ability-spell-profile-json-editor/AbilitySpellProfileJsonEditorModal.view.jsx:87`,
`scenario-reference-picker/ScenarioReferencePickerModal.view.jsx:20`,
`registry-linked-creation-picker/RegistryLinkedCreationPickerModal.view.jsx:20`,
`wallet-profile-json-editor/WalletProfileJsonEditorModal.view.jsx:87`,
`skills-profile-json-editor/SkillsProfileJsonEditorModal.view.jsx:87`
(Debt map: converts to `--surface-1`, gated on Ruling 4's Sprint 3
Phase 1 manifest); `#44604b` at
`lore-document-renderer/LoreDocumentRenderer.view.jsx:69` (the logged
"Lore green pair," Queue T4, not a surface at all, a category color);
`#090806` at `lore-editor/LoreEditor.view.jsx:174` (Debt map: converts
to `--canvas`); `#100d09` at `lore-editor/LoreEditor.view.jsx:1029`
(Debt map: converts to `--surface-1`, and the same literal recurs at
line 927 as a `style` attribute, both cited in G1 above).

`bg-black/NN` / `bg-white/NN` raw-opacity outliers (out of contract
per `docs/DESIGN-TOKENS.md` item 3 and the FRONTEND-SOP PR checklist):
9 files, 18 hits total. The concentration worth naming: 7 of the 9
files are `components/studio/create/room-template/{BuilderSection,
RoomTemplateFields,OpeningMessageCard,RoomTemplateSummary,
ScenarioRecommendationsPanel,InvitedPlayersPanel}.jsx` (`bg-black/25`,
`/35`, `/45` at the lines G4 lists below), which G4 found to be a
stale, mostly-dead duplicate directory, one of whose literals still
leaks into the live page. The rest:
`components/studio/create/wardrobe/outfit-picker/OutfitPickerModal.view.jsx:21`
(`bg-black/80`),
`components/studio/create/creation-studio/CreationStudio.view.jsx`
(eight hits, lines 341 to 579, `bg-black/25`/`/35`, notably in a
`.view.jsx` file, which the DESIGN-TOKENS.md detection command scopes
to explicitly),
`components/studio/create/lore/lore-document-renderer/LoreDocumentRenderer.view.jsx:375`
(`bg-white/15`, `/25`),
`components/studio/create/scenario/scenario-builder/ScenarioBuilder.view.jsx:207`
and `scenario-reference-picker/ScenarioReferencePickerModal.view.jsx:19,117,121`,
`components/studio/create/create-type-card/CreateTypeCard.view.jsx:13`,
`components/studio/create/structured-registry/registry-linked-creation-picker/RegistryLinkedCreationPickerModal.view.jsx:19`.
No Tailwind default gray-scale utilities (`gray-`/`zinc-`/`stone-`/
`slate-`) were found in this scope. G2 DONE.

## G3. Did commit 2c7759c1 reach the two Actor Mechanics Profile files

No.

```
git show 2c7759c1 --stat --format="%H %s"
```

```
2c7759c154c81cbd5c53b339ea22a9d92d8fe4a7 fe/css: R10 refine, one dropdown recipe ruled
 components/kit/dropdown/KitDropdown.view.jsx | 6 +++---
 1 file changed, 3 insertions(+), 3 deletions(-)
```

The commit touched exactly one file,
`components/kit/dropdown/KitDropdown.view.jsx`, and touched neither
`actor-mechanics-profile-builder/ActorMechanicsProfileBuilder.view.jsx`
nor `actor-mechanics-profile-editor/ActorMechanicsProfileEditor.view.jsx`
directly. It reaches Actor Mechanics Profile only indirectly, because
both files consume `KitDropdown` (confirmed in G1's actor-mechanics-
profile trace: a dozen or more `KitDropdown` instances render through
this one shared file). The commit's own message and STATUS.md entry
(`bible/STATUS.md` line 107) describe its scope correctly as the
dropdown trigger's fill and border only ("raised fill (`--surface-2`)
and a visible border (`--line-whisper`) unconditionally"); it was
never intended to touch card, nested-card, or input-field elevation,
so the continued flatness among those three steps on the Actor
Mechanics Profile page (documented in G1) is not something this commit
was scoped to fix, not a sign the fix failed to land. G3 DONE.

## G4. Component families in more than one location or convention

Starting point confirmed: `NameStop` exists in four locations under
two conventions. Full census below, mechanically enumerated (component
base names normalized across `.view.jsx`/`.jsx`/`View.jsx`/`.contract.js`/
`.fixtures.js` suffixes, LOOM Shell-to-nested-View pairs collapsed to
one location each per `docs/FRONTEND-SOP.md` section 1), then each
candidate cluster verified by direct read, diff, and `git log --follow`
by a dedicated read-only pass. 228 raw name collisions across
`components/` collapsed to 27 candidates once the legitimate
Shell/View/ViewModel split was accounted for; of those, the following
are genuine independent-implementation duplicates.

**NameStop, 4 locations, 2 conventions.** Full LOOM triple at
`components/studio/create/character/creator-stops/name-stop/`
(`NameStop.view.jsx` + `.contract.js` + `.fixtures.js`); a bare
`NameStopView.jsx` with no contract or fixtures sibling at each of
`components/studio/create/{look,story,world}/creator-stops/name-stop/`.
The three bare copies are near-identical to each other (same single
`name` field, same `TextField` import from each package's own local
`shared/Controls`), differing only in heading copy, placeholder
string, and which package-local field-limits contract they import.
`git log --oneline --follow` proves deliberate hand-templating, not
accidental drift: World's earliest commit is `de53241b`, "build the
Worlds quick create as a strict Character template"; Look's is
`983b21bc`, "using Worlds as the proven template"; Story's is
`033675ae`, "using Looks as the proven template."

**Controls (creator-stops shared utility), 4 locations.** One file per
package: `components/studio/create/{character,look,story,world}/creator-stops/shared/Controls.jsx`.
Diff of the look, story, and world copies shows the exported functions
(`Eyebrow`, `SectionLabel`, `FieldLabel`, `TextField`,
`FoldingTextField`, and the identical `TEXTAREA_MAX_HEIGHT_PX = 200`
constant) are byte-identical; the only diffs are in comment text, and
those comments are self-documenting proof of the lineage (e.g. Story's
own file, lines 7 to 13: "mirroring the Looks quick create's ... itself
mirroring World's, itself mirroring Character's ... rather than
importing another package's"). Character's copy is a strict superset
(436 lines against roughly 60 to 106 for the other three), reflecting
its larger field vocabulary. One real shared component sits one layer
above this family and is not a duplicate: all four packages'
`*CreatorModal.jsx` files import the same
`components/studio/create/character/creator-stops/CreatorStops.view.jsx`
wizard chassis.

**PremiseStop, 2 locations.** `components/studio/create/{story,world}/creator-stops/premise-stop/PremiseStopView.jsx`,
same props (`premise`, `onChangePremise`), same structure, differing
only in heading, description copy, placeholder, and the package-local
field-limits import.

**Look/World preview family, 2 locations, 6 files.**
`components/studio/create/look/creator-stops/look-stop/` (`LookStopView.jsx`
composing local `LookPreview.view.jsx` and `useLookPreviewViewModel.js`)
against `components/studio/create/world/creator-stops/look-stop/`
(`LookStopView.jsx` composing local `WorldPreview.view.jsx` and
`useWorldPreviewViewModel.js`). The two `*Preview.view.jsx` files are
structurally identical line for line (same layout, same `hasGenerated`
state, same `KitArtPlaceholderView` empty state, same primary button,
same token-cost note), differing only in prop names and labels; the
two hooks share the same `TOKEN_COST = 40` and derivation shape,
differing only in field names.

**SettingStop, same name, not a duplicate.** Named here because a
mechanical scan flags it alongside the family above, and it is worth
recording as the negative case: `story/creator-stops/setting-stop/SettingStopView.jsx`
is a single-select picker-trigger component
(`selectedLocation`/`onOpenSettingPicker`/`onClearSetting`);
`world/creator-stops/setting-stop/SettingStopView.jsx` is a text field
plus negative-prompt fold (`setting`/`negativePrompt`/
`onChangeSetting`/`onChangeNegativePrompt`). Different props, markup,
and interaction pattern behind the same name and wizard slot.

**`components/studio/create/room-template/` vs.
`components/studio/room-templates/`, 9 names.** `RoomTemplateBuilder.view.jsx`
(the one live builder page's own view) imports `BuilderSection`,
`RoomTemplateSummaryView`, `SelectedCharactersPanelView`,
`SelectionCardView`, `ScenarioRecommendationsPanelView`,
`InvitedPlayersPanelView`, and `OpeningMessageCardView` all from
`@/components/studio/room-templates/...`, and its Shell imports
`RoomTemplatePickerModal` from the same directory, not from its own
sibling `create/room-template/`. For 7 of the 9 names
(`BuilderSection`, `RoomTemplateFields`, `OpeningMessageCard`,
`RoomTemplateSummary`, `ScenarioRecommendationsPanel`,
`InvitedPlayersPanel`, `RoomTemplatePickerModal`), the
`create/room-template/` copy is orphaned, raw pre-LOOM `.jsx`
carrying the exact `bg-black/NN` literals named in G2
(`BuilderSection.jsx:3` `bg-black/45`; `RoomTemplateFields.jsx:12,36`
`bg-black/35`; `RoomTemplateSummary.jsx:8` `bg-black/25`;
`OpeningMessageCard.jsx:23` `bg-black/25`;
`ScenarioRecommendationsPanel.jsx:83,109` `bg-black/25`;
`InvitedPlayersPanel.jsx:13,43` `bg-black/25`/`bg-black/35`), while the
`room-templates/` copy of each same filename is a thin Shell
delegating to a compliant nested LOOM view with zero `bg-black`
literals repo-wide. `git log --follow` shows both directories
duplicated from the same original import commit (`5c1275be`), then
diverged: only `room-templates/RoomTemplateFields.jsx` received commit
`7c939d82`, "D1 wells to surface-1," converting its literals to
`--surface-1`; `create/room-template/RoomTemplateFields.jsx` never
did. One live cross-contamination survives despite the dead directory
being otherwise unreferenced:
`room-templates/opening-message-card/OpeningMessageCard.view.jsx:2`
imports `TextAreaField` from the stale
`@/components/studio/create/room-template/RoomTemplateFields`
instead of its own compliant sibling, so the `bg-black/35` literal at
that file's line 36 renders live today in the Opening Message body
field of the actual builder page. The remaining 2 of the 9 names
(`SelectionCard`, `SelectedCharactersPanel`) are a legitimate LOOM
split duplicated wholesale across both directories (byte-identical
Shell files, `.view.jsx` identical, only `README.md`/`.contract.js`/
`.fixtures.js` differ), harmless for the token question, a lower-
priority cleanup candidate on its own.

**InfoTip, 2 locations, both live.**
`components/kit/form-field/InfoTip.jsx` (imported by
`KitImageCreatorPanel.view.jsx` and `KitImageViewer.view.jsx`, moved
out of the Media Studio composer per its own header comment) and
`components/studio/create/character/creator-stops/InfoTip.jsx`
(imported by that package's own `shared/Controls.jsx:6`, used at lines
139 and 368). The two are independently implemented (one is
CSS-hover-only via `group-hover`, the other carries its own
open/close state, outside-click, Escape, and scroll dismissal, plus
flip-direction measurement logic) and both render their tooltip panel
on the same retired `--surface-4` token, named in G2.

**Not duplicates, checked and cleared.** `ModalShell`
(`components/ui/modal-shell/` vs.
`components/studio/create/npc-registry/modal-shell/`): a three-layer
composition chain, not two reimplementations
(`npc-registry/modal-shell` imports `KitModalFrame`, which itself
imports `components/ui/modal-shell`'s `ModalShellView`), and the
npc-registry package's own README states the distinction is
deliberate: "This component is separate from:
`components/ui/ModalShell.jsx`. Do not merge or substitute the two
without an explicit architecture decision." A "centralized `hooks/`
directory" pattern flagged by the mechanical scan across nine
candidates (`StorylinesHub`, `CharacterTemplateBuilder`,
`ItemRegistryBuilder`, `NpcRegistryBuilder`, `RoomTemplateBuilder`,
`WardrobeBuilder`, `CharacterCreator`, plus `LocationRegistryBuilder`
and `StructuredRegistryBuilder`) is a false positive: every live Shell
imports its own co-located `useXViewModel.js` directly; the files
under the centralized `hooks/` directories are orphaned legacy
compatibility shims with zero live importers, several explicitly
self-commented "Compatibility adapter for legacy callers ... New LOOM
callers should use the ViewModel directly." `StudioAccountProvider`
is a mechanical-scan false positive: it is a context Provider with no
visual output, so it legitimately has no `.view.jsx` sibling for the
Shell to delegate to. `CharacterTemplateFieldsSection` is a correct
LOOM Shell-plus-View pair; the Shell's parent directory
(`character-templates/`) simply does not share its View's directory
name (`character-template-fields-section/`), which is why the
mechanical scan's parent-child collapsing missed it. G4 DONE.

## G5. Report and STATUS.md

This file, committed. `bible/STATUS.md` updated with the audit entry
and this commit's hash in the same commit. G5 DONE.
