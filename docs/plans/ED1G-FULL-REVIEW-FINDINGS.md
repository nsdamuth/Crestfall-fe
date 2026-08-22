# ED1G: Full-Scale Review Findings

Written 22 Aug 2026 on `design/ds1-claude-design-sync` by the Fable
full-scale review, ruled by Brian. Read-only pass over the trunk state
`design/sprint-h-final` at `cd8e709` (the design-complete build handed
to Nick; the ds1 branch tree is byte-identical to that trunk). Ten
parallel read-only review agents covered, in priority order: the
advanced editor family full tree, chat C1 through C6, repo hygiene,
the contract surfaces since `ad8e586`, and the ranked parity items 1
to 10. Judged against `docs/plans/ED1E-EDITOR-DESIGN-STANDARD.md`, the
ED1F ratified laws (`docs/plans/ED1F-DESIGN-DELTAS.md`,
`docs/plans/ED1F-PROPAGATION-PLAN.md`), and token ground truth in
`app/theme.css` and `app/design-system.css`. No file outside this one
was created, edited, or deleted.

## 1. Executive summary

**Counts: 48 BLOCKER, 206 DEFECT, 38 CLEANUP, 56 DOC-DRIFT. 348
findings total** (deduplicated across agents; systemic per-package
patterns counted once per package, native controls counted per file).

Five conclusions carry the weight:

1. **The ED1E propagation checklist (section 11, items 1 through 10)
   largely never ran.** The G1 token layer, G2 modal kit, and G3
   viewer family landed clean and verified, but the editor family
   itself still carries most of the original D1 to D22 defect
   catalogue live on the design-complete trunk: the hero renders
   broken-image wells and duplicates the primary art (D10), the rail
   scrolls inside itself with the save block second (D12), the Danger
   Zone is still the red-billboard recipe (D3), Publishing still nests
   display-headed panels (D4), CrestfallSelect is still mounted across
   six section families (D1), folding fields never expand (D5/F1), and
   the mechanics subtree has grown from 30 to 47 native selects (D22).
   This is the single largest exposure in the Nick review.
2. **What was scheduled did land, and landed well.** G1 is fully in
   `app/theme.css` and `app/design-system.css` with mirrors
   recompiled and the contrast matrix regenerated; KitModalFrame
   implements the A4 mobile law in full including the B5/B8-conformant
   unsaved-dismiss confirm; the kit modal packages compose it; G3
   (image-overlay, media-lightbox) executed with lawful contract
   bumps, contrary to the plan's own deferral language.
3. **Chat is structurally sound but not sitting-ready.** The C1 to C6
   packages are contract-clean with complete fixtures, but the session
   dialogs run on native selects, no modal footer in the family obeys
   the B1/B8 fade-line law, the composer keeps two local focus
   recipes, and the legacy story-room shell is wholly off-token with a
   window.confirm delete.
4. **Contract law holds almost everywhere.** 279 contracts audited
   across both auditors; every version bump since `ad8e586`
   corresponds to a real prop change except one: MediaLightbox 1.1.0
   removed `onDelete` in a minor bump, a breaking change shipped as
   additive. The long tail is 33 contracts whose typedefs under-declare
   their actual view props (drift, not version-law violations).
5. **The focus-system retirement left one live behavior bug and 142
   dead class strings.** KitStudioFilterBar still brightens its border
   in JS on keyboard focus, so every browse page's search field now
   renders a doubled focus treatment. `--focus-ring-ongold` was minted
   with zero consumers; the ruled `.goldring` hook was never wired to
   any gold-filled CTA.

Parity: all ten ranked FE-lane items in `docs/PARITY-ECHO-FULL.md`
verified still accurate against code; zero stale, zero moved.

## 2. Findings: advanced editor family

### 2.1 Editor core, hero, rail, shell

BLOCKER | app/studio/v2/editor/editor/Editor.view.jsx:368 | Rail carries max-h-[calc(100vh...)] plus overflow-y-auto, the exact D12 inner-scroll defect ED1E section 7 bans | Sonnet propagation
BLOCKER | app/studio/v2/editor/editor/Editor.view.jsx:369 | Rail order is switcher, save block, ToC; law rules save block FIRST (same wrong order in the mobile sheet at :429) | Sonnet propagation
BLOCKER | components/studio/my-creations/editor-header/EditorHeader.view.jsx:49 | Slot rail renders every empty slot as an ImageOff broken-image well and provides no add tile (D10) | Sonnet propagation
BLOCKER | app/studio/v2/editor/editor/useEditorViewModel.js:234 | heroSlots includes the active slot, so the active thumb duplicates the primary art beside it at rest (D10) | Sonnet propagation
BLOCKER | components/studio/my-creations/creation-edit-shell/CreationEditMechanicsRuntimeQuickNav.jsx:149 | Quick nav mounts inside a v2 editor section box as a second bordered panel on raw bg-black with border gold/20 (D2); rows at :177-195 carry rounded-xl, border-white/10, text-[10px] pills, tracking-[0.22em] labels, an entire off-token recipe off the section 7 tiers | Sonnet propagation
DEFECT | app/studio/v2/editor/editor/Editor.view.jsx:310 | Page container raw max-w-5xl; --container (75rem) is the ruled replacement (D20) | Sonnet propagation
DEFECT | app/studio/v2/editor/editor/Editor.view.jsx:315 | Loading skeleton raw h-64 plus three raw h-16 rows at :316-318 (D20) | Sonnet propagation
DEFECT | app/studio/v2/editor/editor/Editor.view.jsx:323 | Rail column hardcoded 264px in lg:grid-cols (D20) | Sonnet propagation
DEFECT | app/studio/v2/editor/editor/Editor.view.jsx:370 | Save block bed --surface-1; law rules --surface-2 matching the boxes (D15; same at sheet copy :430) | Sonnet propagation
DEFECT | app/studio/v2/editor/editor/Editor.view.jsx:70 | Switcher is a hand-rolled border --line-strong control, the D15 strong-border outlier; law says standard secondary button | Sonnet propagation
DEFECT | app/studio/v2/editor/editor/Editor.view.jsx:178 | Rail category labels tier-4 shape but --ink-dim, no gold, no grad-rule mark (D13; also page-column group labels :340) | Sonnet propagation
DEFECT | app/studio/v2/editor/editor/Editor.view.jsx:190 | ToC item hover gets a bed; law rules hover ink-only, the bed means active (D13) | Sonnet propagation
DEFECT | app/studio/v2/editor/editor/Editor.view.jsx:190 | ToC rows radius-md and min-h control-md always; law rules radius-sm rows, items indented --space-3 beyond the label (zero indent here), control-sm compression on fine pointers | Sonnet propagation
DEFECT | app/studio/v2/editor/editor/Editor.view.jsx:190 | Dirty/saved marks pushed to the far row edge by justify-between (D14); law seats marks inline --space-2 after the item label | Sonnet propagation
DEFECT | app/studio/v2/editor/editor/Editor.view.jsx:237 | Open box body px-space-5 pb-space-6 with NO pt-space-4; the body owns its top padding per section 5 | Sonnet propagation
DEFECT | app/studio/v2/editor/editor/Editor.view.jsx:391 | Mobile save row wash is a raw color-mix literal; Gate 2 token law row 10 pairs this surface with the minted --chrome-wash | Sonnet propagation
DEFECT | app/studio/v2/editor/editor/Editor.view.jsx:427 | Mobile sections sheet has no visible structural title "Sections" (7.3, D18); only an sr-only ariaLabel over a titleless band | Sonnet propagation
DEFECT | app/studio/v2/editor/editor/Editor.view.jsx:134 | Save-error words render --status-danger at --text-ui on surface beds (rail, sheet, chrome row :404); the exact ED1E section 10 item 1 BLOCKED-ON-RULING cell, still unruled | Brian ruling needed
DEFECT | app/studio/v2/editor/Editor.jsx:162 | Owner-only-draft-preview badge is a hand-rolled pill instead of KitBadge and sits inside the section box above the body | Sonnet propagation
DEFECT | app/studio/v2/editor/Editor.jsx:85 | defaultPcError renders error?.message raw (fallback chain in useCreationEditShellViewModel.js:141); plain-language-only error law violated | Sonnet propagation
DEFECT | components/studio/my-creations/editor-header/EditorHeader.view.jsx:100 | Hero action row gap space-2 and never becomes full-width equal rows at 390 (D11) | Sonnet propagation
DEFECT | components/studio/my-creations/editor-header/EditorHeader.view.jsx:86 | Tier-2 type eyebrow lacks the trailing --grad-rule mark | Sonnet propagation
DEFECT | components/studio/my-creations/editor-header/EditorHeader.view.jsx:14 | Raw pixel sizing throughout the hero (w-[148px]/w-[232px], thumbs :43, basis-[240px] :84); no token backs any of them (D20) | Sonnet propagation
DEFECT | app/studio/v2/editor/EditorIndexClient.jsx:21 | Index h1 fixed --text-title with no --text-title-m mobile pair, 33px at 390 | Sonnet propagation
DEFECT | components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx:109 | Lore preview row raw mb-5, gap-3, text-sm leading-6; 14px is off the type scale | Sonnet propagation
DEFECT | app/studio/v2/editor/image-library/ImageLibrary.view.jsx:21 | Raw internal creation id renders on screen ("Creation ID: {creationId}") | Sonnet propagation
DEFECT | app/studio/v2/editor/editor/Editor.fixtures.js:394 | body_notes (and philosophy :404) seeded with LONG_PARAGRAPH over the field's own 600 limit; F4 unresolved, renders a permanent over-limit counter | Nick's lane
CLEANUP | app/studio/v2/editor/editor/Editor.view.jsx:78 | Dead template ternary in SwitcherBlock confirm panel | Sonnet propagation
CLEANUP | app/studio/v2/editor/editor/Editor.view.jsx:111 | Saving state word "Saving..." where law writes spinner plus "Saving" (D21 kin) | Sonnet propagation
CLEANUP | app/studio/v2/editor/editor/Editor.view.jsx:428 | Sheet content raw max-h-[75vh]; no token backs 75vh (modal law uses 92dvh) | Sonnet propagation
CLEANUP | app/studio/v2/editor/image-library/ImageLibrary.view.jsx:14 | Raw pb-24 where --space-24 exists; literal arrow character in the Back button instead of a lucide glyph | Sonnet propagation
CLEANUP | app/design-system.css:128 | Legacy .cf-modal-frame recipe still declares background --surface-4; B3/C4 ratified the panel lift gradient; stale unconsumed recipe | Sonnet propagation
DOC-DRIFT | app/studio/v2/editor/editor/README.md:64 | README says seven saved-creation fixtures; EDITOR_FIXTURE_STATES holds eight (Character Template omitted) | Sonnet propagation
DOC-DRIFT | components/studio/my-creations/edit/creation-edit-sticky-action-bar/CreationEditStickyActionBar.view.jsx:96 | SKIPPED comment claims no success token exists; --status-success has existed since 3 Aug and was revised 22 Aug | Sonnet propagation

Legacy-route findings, deferred G7 by the plan's honesty rule, catalogued for the sweep:

DEFECT | components/studio/my-creations/edit/creation-edit-sticky-action-bar/CreationEditStickyActionBar.view.jsx:106 | Raw emerald-400/100 on the Public toggle active state; disabled:opacity-45 vs --state-disabled-opacity at :90/:108/:118 (deferred G7) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/creation-edit-sticky-action-bar/useCreationEditStickyActionBarViewModel.js:105 | Raw enums PRIVATE/DRAFT/NONE render in the meta row (deferred G7) | Sonnet propagation
DEFECT | components/studio/my-creations/creation-edit-shell/CreationEditShell.view.jsx:31 | Legacy shell frame off-token washes and spacing (deferred G7) | Sonnet propagation
DEFECT | components/studio/my-creations/creation-edit-shell/CreationEditShell.view.jsx:37 | Legacy shell h2 raw text-4xl display with raw tracking eyebrow (deferred G7) | Sonnet propagation
DEFECT | components/studio/my-creations/creation-edit-shell/CreationEditShell.view.jsx:75 | Legacy section tab pills off-token (deferred G7) | Sonnet propagation
DEFECT | components/studio/my-creations/my-creations-hub/MyCreationsHub.view.jsx:79 | Hub search is a native input in a hand-rolled off-token bed (deferred G7) | Sonnet propagation
DEFECT | components/studio/my-creations/my-creations-hub/MyCreationsHub.view.jsx:124 | Engagement error banner raw red-* (deferred G7) | Sonnet propagation
DEFECT | components/studio/my-creations/my-creations-hub/MyCreationsHub.view.jsx:110 | Hub tab pills and empty state off-token (deferred G7) | Sonnet propagation

### 2.2 SharedFields and the character/creation sections

BLOCKER | components/studio/my-creations/edit/sections/SharedFields.jsx:248 | TextAreaField folding never expands: rows=1 with no autosize, and isExpanded (:260) is true for any non-empty value so a filled field never shows the ruled one-line rest preview either; 4.3 expand-to-320px not implemented, no fold glyph, D5 and F1 both live | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/creation-danger-section/CreationDangerSection.view.jsx:53 | Danger Zone still the full legacy D3 recipe: two red-washed bordered billboards at rest with raw red-* classes, icon parade; the ED1E 5.4 quiet ghost-row rewrite never landed | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/creation-danger-section/CreationDangerSection.view.jsx:58 | font-display text-3xl serif titles inside danger rows; tier ceiling is --text-lead | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/creation-publishing-section/CreationPublishingSection.view.jsx:172 | Template Operations inner bordered panel with text-3xl font-display header outranking the box header (D4) | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/character-identity-section/CharacterIdentitySection.view.jsx:73 | CrestfallSelect still mounted (also :90, :121; CharacterTemplateFieldsSection.view.jsx:144,151,228; CharacterBehaviorSection.view.jsx:64; CreationPublishingSection.view.jsx:157,164): retired gold-label off-token recipe with shadow-2xl menu and local focus border (D1, 4.4, A3) | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/character-behavior-section/CharacterBehaviorSection.view.jsx:45 | Personality Frameworks bordered inner panel with trait trigger panels nested inside, three bordered depths (D2; duplicated at CharacterTemplateFieldsSection.view.jsx:208) | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/character-appearance-section/CharacterAppearanceSection.view.jsx:35 | Selected clothing title font-display text-3xl, an entry value at display size and family | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/SharedFields.jsx:286 | Collapsed rest height leaves a 2px second-line sliver that can clip mid-glyph; no ellipsized one-line preview (4.3, D5/D6 kin) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/SharedFields.jsx:143 | TextField single-line overflow hard-clips mid-letter, no fade or ellipsis (4.2, D6) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/SharedFields.jsx:151 | Label-to-bed and bed-to-helper spacing swapped versus law (mt-2 where --space-1, mt-1 where --space-2); repeats at :223/:225, :282/:290, :299 | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/SharedFields.jsx:213 | NumberField not right-aligned, no tabular-nums (4.2) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/SharedFields.jsx:295 | ReadOnlyField renders a full field bed; 4.6 rules read-only bedless (D8) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/SharedFields.jsx:306 | ActionPanel is an inner bordered panel with ornament icon, display-size header, raw spacing (section 5) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/SharedFields.jsx:74 | At-limit counter ships --status-danger at tier 8 size on box surfaces, the ED1E section 10 item 1 BLOCKED-ON-RULING cell | Brian ruling needed
DEFECT | components/studio/my-creations/edit/hooks/useCreationEditViewModel.js:356 | Delete routes through window.confirm and archive (:337) fires with no confirm at all; 5.4 requires the in-place arming swap, B5 requires the modal confirm recipe with type-aware copy and the CR-054 placeholder | Sonnet propagation
DEFECT | components/studio/my-creations/edit/hooks/useCreationEditViewModel.js:1 | No over-limit save blocking anywhere; 4.3 rules an over-limit value blocks save with plain words | Sonnet propagation
DEFECT | components/studio/my-creations/edit/hooks/useCreationEditViewModel.js:129 | Raw error.message strings surfaced as UI copy (also :257, :279, :297) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/character-identity-section/CharacterIdentitySection.view.jsx:97 | Hand-rolled age field: gold tier-5 label (Gate 1 Quiet violated), off-token bed, local focus border; SharedFields.NumberField unused | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/character-identity-section/CharacterIdentitySection.view.jsx:148 | ReadOnlyField fed raw enum ("CHARACTER"; template view :125 "CHARACTER_TEMPLATE"); terminology map never applied, F2 live (D8) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/character-body-section/CharacterBodySection.view.jsx:32 | Trait pickers still the TraitModal trigger-panel grammar, not 4.5 picker fields; empty "Not chosen" at full --ink not --ink-faint (D9); same in template-fields and behavior sections | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/character-appearance-section/CharacterAppearanceSection.view.jsx:21 | SelectedClothingCard is an inner bordered panel with gold raw-tracking labels and a CTA row inside, second panel depth | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/character-appearance-section/CharacterAppearanceSection.view.jsx:42 | Raw internal id string surfaced in the UI uppercase at 11px (D8/F2 class) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/creation-publishing-section/CreationPublishingSection.view.jsx:184 | Disabled template actions are cf-btn--primary gold buttons with "Soon" baked into the label (viewmodel :91/:97/:107); 4.7/D19 | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/creation-publishing-section/CreationPublishingSection.view.jsx:198 | Public/Canon Review and Unlist as ActionPanel inner bordered panels with display headers | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/creation-publishing-section/CreationPublishingSection.view.jsx:229 | Raw text-red-200/text-emerald-200 instead of --status-danger/--status-success (same at CreationDangerSection.view.jsx:6) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/creation-danger-section/CreationDangerSection.view.jsx:42 | Canon notice is a gold-washed bordered billboard, status color as decoration, second depth; nested requirement box at :102 adds a third | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/creation-overview-section/useCreationOverviewSectionViewModel.js:10 | previewButtonLabel "Preview Soon" bakes Soon into a disabled button label (4.7, D19) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/character-advanced-section/CharacterAdvancedSection.view.jsx:50 | Field stack gap-5 where law rules --space-4 | Sonnet propagation
CLEANUP | components/studio/my-creations/edit/sections/character-identity-section/CharacterIdentitySection.view.jsx:59 | Child-owned raw mt-6 above the field grid; the box body owns its top padding (same pattern across all nine packaged sections, plus mt-8 at overview :49 and publishing :172/:197) | Sonnet propagation
CLEANUP | components/studio/my-creations/edit/sections/creation-publishing-section/CreationPublishingSection.view.jsx:102 | disabled:opacity-45 literal vs --state-disabled-opacity; underline-hover danger link not the ghost recipe | Sonnet propagation
CLEANUP | components/studio/my-creations/edit/creationEditLifecycle.js:1 | File is empty, a dead module named in the manifest | Sonnet propagation
DOC-DRIFT | components/studio/my-creations/edit/sections/SharedFields.jsx:49 | Comment still cites the kit-focus border-brightening law as current; A3 retired it | Sonnet propagation
DOC-DRIFT | components/studio/my-creations/edit/sections/SharedFields.jsx:22 | SHARED_FIELDS_VERSION still 1.1.0; the ED1E item 1 rework was to land as 1.2.0, confirming propagation item 1 never ran | Sonnet propagation

### 2.3 Mechanics modules, registries, storylines, wardrobes

The ED1E section 11 item 10 field-grammar conversion visibly never
ran on the mechanics subtree, and item 9 (registry and wardrobe type
ladder) is incomplete. Native selects have grown from D22's recorded
30 to 47. Systemic patterns are counted once per package.

Native selects, 47 instances, all BLOCKER, all Sonnet propagation:

BLOCKER | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-resolution/MechanicsCommandResolution.view.jsx:196,214,237,266,299,320,404,447,585,607,668,799,816 | 13 native selects | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-effects/MechanicsCommandEffectCard.view.jsx:55,83,150,234,265,296,304,346 | 8 native selects | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-guards/MechanicsGuards.view.jsx:83,114,218,235,252,271 | 6 native selects | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-requirements/MechanicsCommandRequirements.view.jsx:61,77,169,229,249 | 5 native selects | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-domain-actions/MechanicsCommandDomainActions.view.jsx:22,70,152 | 3 native selects | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-core/MechanicsCommandCore.view.jsx:231,245,332 | 3 native selects | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-composition-builder/MechanicsCompositionBuilder.view.jsx:38,1245 | 2 native selects | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-status-blocks/MechanicsStatusBlocks.view.jsx:140,157 | 2 native selects | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-outcomes/MechanicsCommandOutcomes.view.jsx:84 | 1 native select | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-defaults/MechanicsDefaults.view.jsx:42 | 1 native select | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-trackers/MechanicsTrackersSection.view.jsx:317 | 1 native select | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-progression-profile/MechanicsProgressionProfileFields.view.jsx:35 | 1 native select | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-application/MechanicsPresetApplicationModal.view.jsx:515 | 1 native select | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-json-editor/MechanicsJsonEditorModal.view.jsx:101 | Composes raw ModalShell not KitModalFrame, max-w-7xl exceeds every ruled width tier, raw bg-[#080706], shadow-2xl, font-display text-4xl modal header, raw amber/red/emerald status classes (:26-27) | Brian ruling needed

Native checkboxes and radios, 23 instances, no ruled recipe exists (4.9 covers toggles only):

DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/RuntimeMechanicsModulesSection.jsx:290 | Native checkbox with accent gold, not the 4.9 toggle | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-resolution/MechanicsCommandResolution.view.jsx:699,713,836,851,900 | 5 native checkboxes | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-core/MechanicsCommandCore.view.jsx:259,270,418,432,449 | 5 native checkboxes | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-composition-builder/MechanicsCompositionBuilder.view.jsx:77,106,755,1103 | 4 native checkboxes | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-application/MechanicsPresetApplicationModal.view.jsx:545,577 | Native radio plus native checkbox | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-domain-actions/MechanicsCommandDomainActions.view.jsx:255 | Native checkbox | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-status-blocks/MechanicsStatusBlocks.view.jsx:174 | Native checkbox | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-progression-profile/MechanicsProgressionProfileFields.view.jsx:322 | Native checkbox | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/item-registries/item-registry-fields-section/ItemRegistryFieldsSection.view.jsx:354 | Native checkbox | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/wardrobes/wardrobe-fields-section/WardrobeFieldsSection.view.jsx:294,347 | 2 native checkboxes | Sonnet propagation

Type ladder (display-size internal headers and entry titles, D4 class):

DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/RuntimeMechanicsModulesSection.jsx:195,265 | font-display text-3xl internal header plus text-lg entry title | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-core/MechanicsDocumentCore.view.jsx:35,99,117 | font-display text-4xl and text-3xl internal headers, text-lg value | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.view.jsx:68,129,180,260 | font-display text-3xl headers, text-xl entry titles | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-trackers/MechanicsTrackersSection.view.jsx:73,449 | text-xl entry title, font-display text-3xl header | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-status-blocks/MechanicsStatusBlocks.view.jsx:85,268 | text-xl entry title, font-display text-3xl header | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-guards/MechanicsGuards.view.jsx:169,381 | text-xl entry title, font-display text-3xl header | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-defaults/MechanicsDefaults.view.jsx:168 | font-display text-3xl internal header | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-core/MechanicsCommandCore.view.jsx:135 | text-xl entry title | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-composition-builder/MechanicsCompositionBuilder.view.jsx:705,1062,1211,1223,1229 | text-xl titles, font-display text-3xl header, text-lg values | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-compatibility-baseline/MechanicsCompatibilityBaseline.view.jsx:21,52 | font-display text-4xl and text-3xl headers | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-validation/MechanicsPresetValidationPanel.view.jsx:37 | font-display text-3xl internal header | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-application/MechanicsPresetApplicationModal.view.jsx:100,453,663 | text-lg stat value, font-display text-3xl headers | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-json-editor/MechanicsJsonEditorModal.view.jsx:110 | font-display text-4xl modal header | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-picker/MechanicsModulePickerModal.view.jsx:28 | font-display text-2xl card entry title inside the picker | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/item-registries/item-registry-fields-section/ItemRegistryFieldsSection.view.jsx:197,244,294,420,597 | font-display text-xl/2xl/3xl entry titles and headers; ED1E item 9 not run here | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/npc-registries/npc-registry-fields-section/NpcRegistryFieldsSection.view.jsx:122 | font-display text-3xl card title | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/wardrobes/wardrobe-fields-section/WardrobeFieldsSection.view.jsx:166,225,494 | font-display text-xl/2xl entry titles, text-3xl header | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/storylines/storyline-fields-section/StorylineFieldsSection.view.jsx:32-40 | Internal eyebrow plus font-display text-4xl plus description stack inside section content, banned by ED1E section 3 | Sonnet propagation

Field grammar and surface nesting, systemic (hand-rolled cards two to
three bordered depths deep, plain text-sm labels, off-token beds
rounded-xl border-white/10 bg-black/40, 78 such beds across
mechanics-modules), one line per package:

DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/RuntimeMechanicsModulesSection.jsx:184,257,288,361 | Nested bordered panels, legacy bed recipe, hand-rolled 0.22em labels | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-core/MechanicsCommandCore.view.jsx | Systemic: 16 nested bordered panels, 10 legacy beds, no label-bed-helper anatomy | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-resolution/MechanicsCommandResolution.view.jsx | Systemic: 32 nested bordered panels, 19 legacy beds | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-effects/MechanicsCommandEffectCard.view.jsx | Systemic: 15 nested bordered panels, 9 legacy beds | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-requirements/MechanicsCommandRequirements.view.jsx | Systemic: 10 nested bordered panels, 6 legacy beds | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-outcomes/MechanicsCommandOutcomes.view.jsx | Systemic: 5 nested bordered panels | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-domain-actions/MechanicsCommandDomainActions.view.jsx | Systemic: 9 nested bordered panels, 4 legacy beds | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-composition-builder/MechanicsCompositionBuilder.view.jsx | Systemic: 35 nested bordered panels, 36 wash literals across 1200+ lines | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-guards/MechanicsGuards.view.jsx | Systemic: 11 nested bordered panels, 7 legacy beds | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-trackers/MechanicsTrackersSection.view.jsx | Systemic: 13 nested bordered panels | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-status-blocks/MechanicsStatusBlocks.view.jsx | Systemic: 11 nested bordered panels | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-defaults/MechanicsDefaults.view.jsx | Systemic: 5 nested bordered panels | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-progression-profile/MechanicsProgressionProfileFields.view.jsx | Systemic: 11 nested bordered panels, raw bg-[#0b0a09] at :461 | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-validation/MechanicsPresetValidationPanel.view.jsx | Systemic: 4 nested bordered panels, emerald-* status classes | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-compatibility-baseline/MechanicsCompatibilityBaseline.view.jsx | Systemic: 5 nested bordered panels, 12 wash literals | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/item-registries/item-registry-fields-section/ItemRegistryFieldsSection.view.jsx:191,211,220,242,292 | Nested bordered entry cards and panels inside the section box | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/npc-registries/npc-registry-fields-section/NpcRegistryFieldsSection.view.jsx:116,183 | Nested rounded-2xl bordered cards inside section content | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/wardrobes/wardrobe-fields-section/WardrobeFieldsSection.view.jsx | Systemic: 8 nested bordered panels, 10 wash literals | Sonnet propagation

Retired select recipe, off-token status colors, focus, and modals:

DEFECT | components/studio/my-creations/edit/sections/item-registries/item-registry-fields-section/ItemRegistryFieldsSection.view.jsx:298,316,324,503,511,519 | 6 CrestfallSelect uses, retired recipe | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/wardrobes/wardrobe-fields-section/WardrobeFieldsSection.view.jsx:252,338 | 2 CrestfallSelect uses, retired recipe | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-application/MechanicsPresetApplicationModal.view.jsx:243-259 | Hand-rolled fixed-inset overlay dialog, not KitModalFrame, w-[min(96vw,72rem)] exceeds the LARGE tier | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-progression-profile/MechanicsProgressionProfileFields.view.jsx | amber-100/300/500 warning panels, 6 instances | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-validation/MechanicsPresetValidationPanel.view.jsx | emerald-100/300/500 success panels, 6 instances | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-application/MechanicsPresetApplicationModal.view.jsx | amber-* warning classes, 7 instances | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-composition-builder/MechanicsCompositionBuilder.view.jsx | amber-* and red-* classes, 8 instances | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-effects/MechanicsCommandEffectCard.view.jsx | amber-* classes, 6 instances | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-domain-actions/MechanicsCommandDomainActions.view.jsx | amber-* classes, 3 instances | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/npc-registries/npc-registry-fields-section/NpcRegistryFieldsSection.view.jsx:108 | loadError in text-red-200 instead of --status-danger | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/mechanics-modules (18 files, 67 instances; heaviest MechanicsCommandResolution 14, MechanicsCommandEffectCard 9, MechanicsGuards 7) | outline-none plus focus:border gold on native controls suppresses and replaces the global --focus-ring (A3) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/item-registries/item-registry-fields-section/ItemRegistryFieldsSection.view.jsx and wardrobes/wardrobe-fields-section/WardrobeFieldsSection.view.jsx | 2 local focus styles each on hand-rolled beds | Sonnet propagation
DOC-DRIFT | docs/plans/ED1E-EDITOR-DESIGN-STANDARD.md:60 | D22 records 30 native selects in the mechanics subtree; the tree at cd8e709 has 47 | Sonnet propagation
DOC-DRIFT | components/studio/my-creations/edit/sections/location-registries/LocationRegistryFieldsSection.jsx and structured-registries/StructuredRegistryFieldsSection.js | Thin wrappers whose actual UI lives in components/studio/create location-registry and structured-registry builders, outside the ED1E section 11 checklist as written | Brian ruling needed

### 2.4 Locations, room templates, scenarios, outfits, narrators, image presets, poses, visual references

None of these fall in a deferred group. Clean packages, no findings:
all four image-presets, all four poses, narrator-guidance,
narrator-modules, outfit-identity, outfit-garment, outfit-materials,
location-prompt-guidance, location-visual-description,
scenario-runtime-guidance, room-template-runtime.

BLOCKER | components/studio/my-creations/edit/sections/locations/weather-module-config-modal/WeatherModuleConfigModal.view.jsx:451 | Native select in a shipped modal (4.4) | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/locations/weather-module-config-modal/WeatherModuleConfigModal.view.jsx:68 | Hand-rolled overlay, not KitModalFrame; no A4 bottom-anchor, bg-black/80 scrim off the scrim tokens | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/locations/weather-module-config-modal/WeatherModuleConfigModal.view.jsx:69 | Panel raw bg-[#080706], shadow-2xl, max-w-6xl over the LARGE cap; should sit on --grad-panel-lift | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/locations/TrackersModuleConfigModal.jsx:1815 | Native select (second at :1846) | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/locations/TrackersModuleConfigModal.jsx:907 | Hand-rolled overlay, not KitModalFrame; no A4 behavior | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/locations/TrackersModuleConfigModal.jsx:908 | Raw bg-[#080706], shadow-2xl, max-w-7xl exceeds every tier, radius-md where modals are radius-lg | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/locations/location-parent-picker/LocationParentPickerModal.view.jsx:22 | Hand-rolled overlay, not KitModalFrame; no A4 behavior | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/room-templates/room-template-multiplayer-section/RoomTemplateMultiplayerSection.view.jsx:190 | PlayerPickerModal is a hand-rolled overlay, not KitModalFrame | Sonnet propagation
BLOCKER | components/studio/my-creations/edit/sections/locations/location-identity-section/LocationIdentitySection.view.jsx:94 | Parent Location picker rendered as an inner bordered panel, not a 4.5 picker FIELD | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/location-parent-picker/LocationParentPickerModal.view.jsx:23 | max-w-5xl over the cap; panel --surface-4 not --grad-panel-lift | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/location-parent-picker/LocationParentPickerModal.view.jsx:24 | Edge-to-edge border-b header divider versus --line-fade (B1) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/location-parent-picker/LocationParentPickerModal.view.jsx:29 | font-display text-4xl modal title | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/location-parent-picker/LocationParentPickerModal.view.jsx:46 | Search input off the field grammar: no label row, surface-2 bed with --line border | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/location-parent-picker/LocationParentPickerModal.view.jsx:84 | Option selection border-gold/60; B4 rules selected --fill-whisper, rest --fill-option-rest | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/location-parent-picker/LocationParentPickerModal.view.jsx:100 | font-display text-2xl entry titles inside option cards | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/weather-module-config-modal/WeatherModuleConfigModal.view.jsx:80 | font-display text-4xl modal title; text-3xl internal headers at :302 and :423 | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/weather-module-config-modal/WeatherModuleConfigModal.view.jsx:420 | EditorPanel inner bordered panels with internal display headers | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/weather-module-config-modal/WeatherModuleConfigModal.view.jsx:429 | Hand-rolled TextField: gold label, off-token bed, local focus border versus A3 | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/weather-module-config-modal/WeatherModuleConfigModal.view.jsx:412 | Raw red-400/20, red-500/10, red-100 classes | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/weather-module-config-modal/WeatherModuleConfigModal.view.jsx:466 | Native checkbox chip rows, accent gold, color-only state; no ruled checkbox recipe exists | Brian ruling needed
DEFECT | components/studio/my-creations/edit/sections/locations/weather-module-config-modal/WeatherModuleConfigModal.view.jsx:265 | Footer edge-to-edge border-t with right-clustered buttons; B1 fade divider plus B8 ends-alignment required | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/TrackersModuleConfigModal.jsx:919 | font-display text-4xl title; text-3xl internal headers at :1158, :1573, :1752 | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/TrackersModuleConfigModal.jsx:1751 | EditorPanel inner bordered panels with display headers | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/TrackersModuleConfigModal.jsx:1785 | Hand-rolled field primitives (also :1833): gold labels, off-token beds, local focus borders | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/TrackersModuleConfigModal.jsx:1857 | Native checkbox chip rows, color-only, off-token; no ruled recipe | Brian ruling needed
DEFECT | components/studio/my-creations/edit/sections/locations/TrackersModuleConfigModal.jsx:1251 | Progress meter off-token (h-3 white/10 track, gold/80 fill); no meter recipe exists in law | Brian ruling needed
DEFECT | components/studio/my-creations/edit/sections/locations/TrackersModuleConfigModal.jsx:1101 | Footer edge-to-edge border-t versus B1/B8 | Sonnet propagation
CLEANUP | components/studio/my-creations/edit/sections/locations/TrackersModuleConfigModal.jsx:1 | 1908-line monolith: no view/viewmodel/contract/fixtures split, no filled-variant fixture at all | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/location-identity-section/LocationIdentitySection.view.jsx:90 | Hand-rolled gold label at raw text-xs tracking-[0.2em]; tier 5 is --text-label --ink-faint | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/location-identity-section/LocationIdentitySection.view.jsx:131 | Inheritance sub-group as an inner bordered panel with gold eyebrow; law rules inset hairline plus tier 4 label | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/location-identity-section/LocationIdentitySection.view.jsx:176 | CheckboxField native checkboxes in off-token chip rows; no ruled recipe | Brian ruling needed
DEFECT | components/studio/my-creations/edit/sections/locations/location-identity-section/LocationIdentitySection.view.jsx:211 | font-display text-2xl parent-location value title (also :262); values are tier 6, never display | Sonnet propagation
CLEANUP | components/studio/my-creations/edit/sections/locations/location-identity-section/LocationIdentitySection.view.jsx:284 | MetadataBadge off-token pill instead of KitBadge/tag recipe | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/location-registry-attachments-section/LocationRegistryAttachmentsSection.view.jsx:31 | Registry group as an inner bordered panel with internal eyebrow (:35) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/location-registry-attachments-section/LocationRegistryAttachmentsSection.view.jsx:82 | Attachment cards at a third bordered depth (card, header bar :83, thumb :86) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/location-registry-attachments-section/LocationRegistryAttachmentsSection.view.jsx:98 | font-display text-xl entry title; tier 6 rules | Sonnet propagation
CLEANUP | components/studio/my-creations/edit/sections/locations/location-registry-attachments-section/LocationRegistryAttachmentsSection.view.jsx:92 | text-[10px] tracking meta type (also :101) off the --text-label step | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/location-runtime-modules-section/LocationRuntimeModulesSection.view.jsx:74 | Weather and Time modules as inner bordered panels (also :145) with icon plaques, eyebrows, font-display text-3xl headers (:85, :155) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/location-runtime-modules-section/LocationRuntimeModulesSection.view.jsx:193 | Hand-rolled number inputs through :263: off-token beds, local focus borders, no tabular-nums | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/location-runtime-modules-section/LocationRuntimeModulesSection.view.jsx:122 | Read-only blocks as inner bordered panels (also :280); 4.6 rules bedless | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/location-runtime-modules-section/LocationRuntimeModulesSection.view.jsx:104 | Native checkbox chip rows for enable toggles (also :163, :266); boolean state should be the 4.9 toggle with state word | Brian ruling needed
DEFECT | components/studio/my-creations/edit/sections/locations/location-sensory-environment-fields/LocationSensoryEnvironmentFields.view.jsx:39 | SenseCard inner bordered panels with icon plaque, gold eyebrow, font-display text-2xl header (:49) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/location-sensory-environment-fields/LocationSensoryEnvironmentFields.view.jsx:13 | ScaleField gold labels (also :70, :284); off-token bed (:25); no tabular-nums | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/location-sensory-environment-fields/LocationSensoryEnvironmentFields.view.jsx:281 | Scent note rows at a third depth inside the SenseCard | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/locations/location-sensory-environment-fields/LocationSensoryEnvironmentFields.view.jsx:93 | disabled:opacity-40 not 0.5; custom h-11 w-11 control off --control-md | Sonnet propagation
CLEANUP | components/studio/my-creations/edit/sections/locations/location-sensory-environment-fields/LocationSensoryEnvironmentFields.view.jsx:171 | Guidance banner as a gold-washed inner panel; a tier 7 helper line is the ruled form | Sonnet propagation
CLEANUP | components/studio/my-creations/edit/sections/locations/location-scene-atmosphere-section/LocationSceneAtmosphereSection.view.jsx:95 | SlotFallback inner bordered panel (same helper at location-runtime-modules :10) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/narrators/narrator-identity-section/NarratorIdentitySection.view.jsx:46 | CrestfallSelect used; retired recipe with off-token menu | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/outfits/outfit-prompt-guidance-section/OutfitPromptGuidanceSection.view.jsx:55 | Clothing Mode group label gold; option labels gold (:71); tier 4/5 recipes unused | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/outfits/outfit-prompt-guidance-section/OutfitPromptGuidanceSection.view.jsx:65 | Mode option cards off-token versus the B4 token pair | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/outfits/outfit-prompt-guidance-section/OutfitPromptGuidanceSection.view.jsx:102 | Advanced Clothing Sections header as an inner bordered panel | Sonnet propagation
CLEANUP | components/studio/my-creations/edit/sections/outfits/outfit-prompt-guidance-section/OutfitPromptGuidanceSection.view.jsx:86 | rows prop passed to TextAreaField which does not accept it (also :98, :120, :132, :141); dead prop | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/room-templates/room-template-identity-section/RoomTemplateIdentitySection.view.jsx:32 | CrestfallSelect twice (:32, :39); retired recipe | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/room-templates/room-template-opening-section/RoomTemplateOpeningSection.view.jsx:51 | Opening message rows as inner bordered panels with gold eyebrow (:54) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/room-templates/room-template-opening-section/RoomTemplateOpeningSection.view.jsx:70 | CrestfallSelect for Speaker; retired | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/room-templates/room-template-package-section/RoomTemplatePackageSection.view.jsx:57 | Raw text-red-200 error | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/room-templates/room-template-multiplayer-section/RoomTemplateMultiplayerSection.view.jsx:49 | Turn-based toggle as a full-width card with color-only state; 4.9 requires pill track plus state word | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/room-templates/room-template-multiplayer-section/RoomTemplateMultiplayerSection.view.jsx:68 | Invitees group as an inner bordered surface-2 panel with hand-rolled gold labels (:55, :71) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/room-templates/room-template-multiplayer-section/RoomTemplateMultiplayerSection.view.jsx:191 | Picker panel max-w-5xl over the cap, --surface-4 not lift, edge-to-edge border-b (:192) versus B1 | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/room-templates/room-template-multiplayer-section/RoomTemplateMultiplayerSection.view.jsx:199 | font-display text-4xl picker title; text-2xl card titles :249; text-3xl empty state :273 | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/room-templates/room-template-multiplayer-section/RoomTemplateMultiplayerSection.view.jsx:236 | Selected option card gold-action border plus inset shadow versus B4 | Sonnet propagation
CLEANUP | components/studio/my-creations/edit/sections/room-templates/room-template-multiplayer-section/RoomTemplateMultiplayerSection.view.jsx:240 | Arbitrary avatar gradient; no ruled token | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/room-templates/story-narrative-runtime-section/StoryNarrativeRuntimeSection.view.jsx:120 | Phase disclosure as inner bordered panels with eyebrow :125 and font-display text-3xl header :128 | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/scenarios/scenario-identity-section/ScenarioIdentitySection.view.jsx:35 | CrestfallSelect twice (:35, :42) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/scenarios/scenario-cast-requirements-section/ScenarioCastRequirementsSection.view.jsx:27 | Raw text-red-200 error | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/scenarios/scenario-cast-requirements-section/ScenarioCastRequirementsSection.view.jsx:42 | Picker field off the 4.5 grammar: gold label, off-token trigger bed (:49), prose in the bed, no dialog glyph | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/scenarios/scenario-cast-requirements-section/ScenarioCastRequirementsSection.view.jsx:99 | font-display text-lg entry titles (:94, :99); chips off-token (:85) | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/scenarios/scenario-middleware-section/ScenarioMiddlewareSection.view.jsx:45 | Add-on toggle cards with color-only state, off-token fills, no state word | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/scenarios/scenario-story-circle-section/ScenarioStoryCircleSection.view.jsx:25 | Story Circle steps as inner bordered panels, eyebrow :29, font-display text-3xl titles :33 | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/visual-references-section/VisualReferencesSection.view.jsx:8 | ReferenceCard inner bordered panel, eyebrow :11, font-display text-2xl :14; media well adds a second nested border :33 | Sonnet propagation
DEFECT | components/studio/my-creations/edit/sections/visual-references-section/VisualReferencesSection.view.jsx:105 | Raw red-500/30, red-500/10, red-200 error panel | Sonnet propagation
DEFECT | (six identity viewmodels) image-presets:37, outfits:37, poses:37, narrators:49, scenarios:55, locations:157 | creationTypeValue passes form?.type raw; raw enums (IMAGE_PRESET and kin) reach the screen unmapped (4.6/F2) | Sonnet propagation
CLEANUP | components/studio/my-creations/edit/sections/image-presets/image-preset-identity-section/ImagePresetIdentitySection.view.jsx:34 | Raw mt-6 top spacing; same pattern in effectively all 36 section views in this group | Sonnet propagation
CLEANUP | components/studio/my-creations/edit/sections/image-presets/image-preset-prompt-stack-section/ImagePresetPromptStackSection.view.jsx:49 | Long-prose stacks gap-5 versus --space-4 (also location, pose, outfit, scenario guidance views) | Sonnet propagation
DOC-DRIFT | components/studio/my-creations/edit/sections/locations/weather-module-config-modal/WeatherModuleConfigModal.fixtures.js:4 | No fresh-create variant; messageTone error chip unexercised | Sonnet propagation

### 2.5 Modal family: kit layer, image library, trait modals

Kit layer verified sound: KitModalFrame implements A4 in full
(bottom-anchor at content height, blurred context, unsaved-dismiss
confirm with a B5/B8-conformant body, --grad-panel-lift panel, 44px
close); KitPickerModal, KitSaveIngredientPreset, KitCreditsModal,
KitAssetDetailPopup, KitDropdown sheet, and the npc-registry shell
all compose it; B2 is satisfied everywhere (no desktop sort sheet
exists). Remaining findings:

BLOCKER | components/studio/my-creations/creation-edit-media-panel/CreationEditMediaPanel.view.jsx:97 | supportsChatMedia section renders a literal "..." text node; ChatMediaSlot (:114) is defined but never used, the chat media slots content is lost and the panel shows a bare ellipsis | Sonnet propagation
BLOCKER | components/studio/my-creations/image-library/creation-featured-image-picker/useCreationFeaturedImagePickerViewModel.js:86 | D17/F3 unresolved: fires fetchCreationImageLibrary unconditionally on mount with no fixture-first gate; fixture mode hits the live API | Nick's lane
BLOCKER | components/studio/my-creations/image-library/creation-featured-image-picker/useCreationFeaturedImagePickerViewModel.js:114 | Raw error.message surfaced to the banner (also :168), rendering the literal "Unauthorized" in fixture or logged-out mode | Nick's lane
BLOCKER | components/studio/my-creations/image-library/hooks/useCreationImageLibraryViewModel.js:92 | Same D17 pattern in the shared hook (raw error.message at :108, :204, :236), reaching the reference picker and the whole library page | Nick's lane
BLOCKER | components/studio/my-creations/image-library/creation-image-library-page/useCreationImageLibraryPageViewModel.js:329 | Image delete routes through window.confirm, not the B5 recipe (no type-aware copy, no CR-054 placeholder, not bottom-anchored at 390) | Sonnet propagation
BLOCKER | components/studio/my-creations/image-library/creation-reference-image-picker/CreationReferenceImagePickerModal.view.jsx:21 | Hand-rolled fixed-inset overlay, not KitModalFrame: no A4, no unsaved-dismiss, blur literal backdrop-blur-[2px] not var(--blur-panel) | Sonnet propagation
DEFECT | components/studio/my-creations/image-library/creation-reference-image-picker/CreationReferenceImagePickerModal.view.jsx:22 | max-w-5xl over the tier ceiling; shadow-2xl; opacity-modified gold border | Sonnet propagation
DEFECT | components/studio/my-creations/image-library/creation-reference-image-picker/CreationReferenceImagePickerModal.view.jsx:49 | Close control about 42px, below the 44 floor; raw literals versus the circular close recipe | Sonnet propagation
DEFECT | components/studio/my-creations/image-library/creation-reference-image-picker/CreationReferenceImagePickerModal.view.jsx:61 | Raw Tailwind red error banner; banned black/white wash literals at :67, :79, :99, :101 | Sonnet propagation
DEFECT | components/studio/my-creations/image-library/creation-featured-image-picker/CreationFeaturedImagePickerModal.view.jsx:39 | Header divider solid edge-to-edge border-b, not the B1 --line-fade device | Sonnet propagation
DEFECT | components/studio/my-creations/image-library/creation-featured-image-picker/CreationFeaturedImagePickerModal.view.jsx:64 | Raw red banners (:64, :73), gold opacity fills (:74), black/white wash literals (:82, :94, :115, :117), raw radii and tracking | Sonnet propagation
DEFECT | components/studio/my-creations/image-library/creation-image-library-page/CreationImageLibraryPage.view.jsx:172 | Native select for sort | Sonnet propagation
DEFECT | components/studio/my-creations/image-library/creation-image-library-page/CreationImageLibraryPage.view.jsx:192 | Banned fills and raw literals across the page (:192, :280, :457, :515, rounded-xl at five spots, gold fills :105) | Sonnet propagation
CLEANUP | components/studio/my-creations/CreationReferenceImagePickerModal.jsx:64 | Dead duplicate reference picker (nothing imports it): hand-rolled overlay, 12px blur on a panel veil (A2 cross-borrow), raw hex, its own live fetch; delete it | Sonnet propagation
DEFECT | components/kit/asset-detail-popup/KitAssetDetailPopup.view.jsx:400 | Native select for media-library sort inside a kit modal | Sonnet propagation
DEFECT | components/kit/asset-detail-popup/KitAssetDetailPopup.view.jsx:220 | Carousel dot buttons at 8px touch size inside a modal versus the A4 44px floor | Brian ruling needed
DEFECT | components/kit/credits/KitCreditsModal.view.jsx:30 | cf-btn--sm Back control at 32px inside a modal; A4 44px floor missed under 700px; same at KitSaveIngredientPreset.view.jsx:63, KitIngredientPicker.view.jsx:125, and both image-library Refresh buttons | Sonnet propagation
DEFECT | components/kit/dropdown/KitDropdown.view.jsx:50 | Sheet rows hold 44px only via pointer:coarse; A4 words the floor by width (under 700px), so narrow fine-pointer windows render 32px rows; same keying in KitAssetDetailPopup media controls and KitFilterChip | Brian ruling needed
DEFECT | components/kit/ingredient-picker/KitIngredientPicker.view.jsx:116 | panelClassName max-w-5xl exceeds the tier ceiling | Sonnet propagation
DEFECT | components/kit/picker-modal/KitPickerModal.view.jsx:263 | B8 conflict: Cancel/Confirm cluster right with the count word left, buttons not at the fade-line ends; the 2.9 count-in-footer anatomy collides with B8 | Brian ruling needed
DEFECT | components/studio/create/npc-registry/modal-shell/ModalShell.view.jsx:19 | max-w-4xl for single-column NPC form modals versus the width-tier rule | Brian ruling needed
DEFECT | components/studio/create/npc-registry/modal-shell/ModalShell.view.jsx:22 | Raw scale literals (p-5, pr-16, text-4xl, tracking-[0.25em]); scroll pb p-5 not --space-6 | Sonnet propagation
DEFECT | components/kit/save-ingredient-preset/KitSaveIngredientPreset.view.jsx:17 | Every field label a gold uppercase eyebrow; Gate 1 Quiet rules tier-5 muted labels; no helper-line anatomy | Sonnet propagation
DEFECT | components/ui/crestfall-option-modal/CrestfallOptionModal.view.jsx:56 | Hand-rolled overlay reached from the editor: bottom-anchors at 768px not 700px, panel --surface-4 not lift, blur literal, trigger carries a local focus recipe (:44) | Sonnet propagation
DEFECT | components/ui/modal-shell/ModalShell.view.jsx:21 | Twelve direct ModalShell consumers (StudioTopBar, CreationPreviewModal, live IngredientPickerModal, five JSON-editor modals, lore/actor/rules editors, mechanics json-editor) get only the centered veil, bypassing A4/B1/B3/B8; the base shell has no under-700 anchor | Brian ruling needed
CLEANUP | components/kit/picker-modal/KitPickerModal.view.jsx:235 | Scroll region pb --space-4 not the mandated --space-6 (same at KitCreditsModal.view.jsx:42); last-row clip risk | Sonnet propagation
CLEANUP | components/kit/filter-chip/KitFilterChip.view.jsx:2 | disabled:opacity-[.45] versus --state-disabled-opacity | Sonnet propagation
CLEANUP | components/kit/asset-detail-popup/KitAssetDetailPopup.view.jsx:241 | CatalogueSlide card and TileItem check badge (picker-modal :148) still on --surface-4, whose DESIGN-TOKENS row says no floating-surface consumer remains | Brian ruling needed
DOC-DRIFT | components/kit/credits/KitCreditsModal.view.jsx:19 | Comment cites retired R4; same stale citations at KitIngredientPicker.view.jsx:6, CreationFeaturedImagePickerModal.view.jsx:25, npc-registry ModalShell.view.jsx:6 | Sonnet propagation
DOC-DRIFT | components/kit/ingredient-picker/KitIngredientPicker.view.jsx:6 | Contract note "full-screen at 390 per R4" contradicts the shipped A4 bottom-anchor behavior | Sonnet propagation

Trait modal family, deferred G4 by the plan, catalogued for that pass:

DEFECT | components/studio/create/character/trait/TraitModal.view.jsx:39 | Hand-rolled overlay (D16): raw bg-black/75 scrim with no blur, raw hex panel, shadow-2xl, max-w-5xl, centered not bottom-anchored at 390; identical in multi-trait:40, personality:39, hair:33 (max-w-6xl), hair-eyes:34, eye-color:39, skin-tone:39, kibbe-preset:39 (max-w-6xl), voice-module-picker:70 (deferred G4) | Sonnet propagation
DEFECT | components/studio/create/character/trait/TraitModal.view.jsx:54 | Close controls p-2, about 34px, below the 44 floor across the family (character-color-palette :138 same) (deferred G4) | Sonnet propagation
DEFECT | components/studio/create/character/trait/TraitModal.view.jsx:78 | Custom-value inputs carry a local focus recipe versus A3; same in multi-trait:79, hair:225, hair-eyes:222, eye-color:103, skin-tone:102 (deferred G4) | Sonnet propagation
DEFECT | components/studio/create/character/trait/TraitModal.view.jsx:25 | Picker trigger still a panel-styled button, not the 4.5 field grammar; family-wide (deferred G4) | Sonnet propagation
DEFECT | components/studio/create/character/eye-color/useEyeColorModalViewModel.js:38 | Gradient swatches persist including the banned purple-to-cyan family (:38, :27; skin-tone fixture :39 runs #8b6bd6 to #0a7eac); ED1E 8 requires flat radius-md tiles (deferred G4) | Sonnet propagation
DEFECT | components/studio/create/character/character-color-palette/CharacterColorPaletteModal.view.jsx:36 | Selected check badge a gold pill with literal text-black; swatch dots rounded-full pills (:13); law is radius-md tiles plus the ChipRow recipe, no pills (deferred G4) | Sonnet propagation
DEFECT | components/studio/create/character/character-template-picker/CharacterTemplateModal.view.jsx:24 | Panel still --surface-4 with a blur literal; the family's only half-migrated overlay (deferred G4) | Sonnet propagation

## 3. Findings: chat C1 through C6

Contract surfaces and fixtures are clean across all eight packages
(every state variant present including at-limit and delete-confirm).
The defects below are what a taste review would catch.

BLOCKER | components/studio/chat/chat-session-dialogs/ChatSessionDialogs.view.jsx:45 | Native select renders every field in the Report, Export, and Share dialogs; branded KitDropdown/SelectField grammar exists and is unused here | Sonnet propagation
BLOCKER | components/studio/chat/chat-session-dialogs/ChatSessionDialogs.view.jsx:436 | DeleteConfirmDialog footer justify-end with no fade divider; B5 rules Cancel/CTA at the ends of a --line-fade divider (KitModalFrame.view.jsx:100 shows the correct pattern) | Sonnet propagation
BLOCKER | components/studio/chat/chat-cast-panel/ChatCastPanel.view.jsx:220 | Same B5/B8 defect in the duplicated DeleteConfirmSheet | Sonnet propagation
BLOCKER | components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view.jsx:145 | Raw hex bg-[#080706], shadow-2xl, hand-rolled fixed dialog not composing KitModalFrame; veil bg-black/75 with backdrop-blur-sm, no lawful blur token; live at /studio/story-rooms/[id] | Brian ruling needed
BLOCKER | components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view.jsx:58 | Whole file off-token: border-white/10, bg-black/30-45 fills, raw text sizes, tracking, radii; --gold-ornament alpha used as interactive fills | Brian ruling needed
BLOCKER | components/studio/story-rooms/StoryRoomChatShell.jsx:22 | Room deletion confirm is window.confirm; destructive law requires the B5 modal confirm | Brian ruling needed
DEFECT | components/studio/chat/chat-session-dialogs/ChatSessionDialogs.view.jsx:80 | ReportDialog never passes hasUnsavedChanges to KitModalFrame; a typed 2000-char comment is silently discarded on dismiss, violating A4 condition 3 | Sonnet propagation
DEFECT | components/studio/chat/chat-session-dialogs/ChatSessionDialogs.view.jsx:133 | Report, Export, Share, Revoke, and Library Pass footers all justify-end with no fade divider (also :206, :279, :375; ChatShell.view.jsx:105; ChatComposer.view.jsx:305); B1 plus B8 violated family-wide | Sonnet propagation
DEFECT | components/studio/chat/chat-session-dialogs/ChatSessionDialogs.view.jsx:124 | At-limit state fills the whole textarea bed with --status-danger-bed; the ruled error direction is border plus plain-language line, never a filled red bed | Sonnet propagation
DEFECT | components/studio/chat/chat-session-dialogs/ChatSessionDialogs.view.jsx:27 | DialogHeading renders font-display at --text-heading inside the panel; the ladder caps in-panel headers at --text-lead, and the dialog family carries three different header sizes | Sonnet propagation
DEFECT | components/studio/chat/chat-composer/ChatComposer.view.jsx:396 | Local focus recipe on both composer textareas (also :520); A3 retired local focus treatments | Sonnet propagation
DEFECT | components/studio/chat/chat-composer/ChatComposer.view.jsx:151 | Active speaker chip wears ring-2 gold/20, a faux focus ring as selection state with an off-token alpha | Sonnet propagation
DEFECT | components/studio/chat/chat-composer/ChatComposer.view.jsx:183 | Draft counter "{n} past 2000" versus ReportDialog "{n}/{max}"; D21 counter grammar inconsistent within one page (composer has no max by O5, so the soft-threshold wording needs a ruling) | Brian ruling needed
DEFECT | components/studio/chat/chat-composer/ChatComposer.view.jsx:644 | Export/Share DisabledToolButtons disabled with no "Soon" meta word beside the control (also ChatStatePanel.view.jsx:73); 4.7/D19 | Sonnet propagation
DEFECT | components/studio/chat/chat-composer/ChatComposer.view.jsx:113 | Mode segmented control and speaker chips are text buttons on radius-full, reserved for tags and icon buttons (also ChatTranscript :92, :157) | Brian ruling needed
DEFECT | app/design-system.css:344 | --focus-ring-ongold minted with zero consumers; gold-filled primary CTAs fall through to the global ring on a gold fill where B10 rules the ongold recipe; the ruled .goldring hook was never wired | Sonnet propagation
DEFECT | components/studio/chat/chat-message/ChatMessage.view.jsx:191 | Message body pairs --text-body with raw leading-7 instead of --lh-body (also :412); off-token line height in the most-rendered text block of the app | Sonnet propagation
DEFECT | components/studio/chat/chat-shell/ChatShell.view.jsx:325 | SummaryPendingCard renders below the 100dvh column, so an active recap card lands below the fold while ChatTranscript renders its own summaryPending StatusCard; duplicate indicators, one unreachable | Sonnet propagation
DEFECT | app/studio/v2/stories/StoriesV2Mockup.jsx:446 | deleteSelected routes through native window.confirm on a v2 page; the B5 modal confirm recipe is the law for destructive actions | Sonnet propagation
CLEANUP | components/studio/chat/chat-composer/ChatComposer.view.jsx:207 | Stop button hover bed equals its rest bed (no-op hover); arbitrary token alphas (/20 through /70) on gold borders recur across composer, cast panel, transcript, and shell instead of the --line ladder | Sonnet propagation
CLEANUP | components/studio/chat/chat-cast-panel/ChatCastPanel.view.jsx:195 | DeleteConfirmSheet is a near-verbatim duplicate of the session-dialogs DeleteConfirmDialog; one portable confirm should exist | Sonnet propagation
CLEANUP | components/studio/chat/chat-cast-panel/ChatCastPanel.view.jsx:249 | xl:top-24 raw offset where --topbar-h exists; raw avatar sizes (:320); max-h-[26rem] literals in transcript and message media wells | Sonnet propagation
CLEANUP | components/studio/chat/chat-state-panel/ChatStatePanel.view.jsx:43 | Icon-only close/toggle buttons on --radius-md versus the circular icon-control law (also ChatCastPanel:61, ChatShell:224/235) | Sonnet propagation
CLEANUP | components/studio/chat/chat-transcript/ChatTranscript.view.jsx:171 | StatusCard tone="quiet" branch byte-identical to the default; dead parameter, unrendered distinction | Sonnet propagation
CLEANUP | components/studio/chat/chat-message/ChatMessage.fixtures.js:10 | Shared AVATAR_DATA_URL is a cool steel-blue swatch in every fixture; off-brand blue avatars throughout renders and screenshots | Nick's lane
CLEANUP | components/studio/chat/chat-composer/ChatComposer.view.jsx:632 | Mobile tools sheet says "Cast / Room" while the cast panel trigger says "Room & Cast"; one name per destination | Nick's lane
CLEANUP | components/studio/chat/chat-shell/ChatShell.view.jsx:200 | Desktop page title at --text-heading; tier 1 puts page titles at --text-title-m to --text-title (chrome-condensed header, possibly intentional, unruled) | Brian ruling needed
DOC-DRIFT | components/studio/chat/chat-session-dialogs/README.md:36 | README states Report is "KitModalFrame variant='modal' (R4 full-screen at 390)"; R4 is superseded under 700px by A4, which the frame implements | Sonnet propagation
DOC-DRIFT | components/studio/chat/chat-cast-panel/ChatCastPanel.contract.js:12 | Delete confirm copy says "permanently deletes" with no CR-054 "[X] days" placeholder (same constant in ChatSessionDialogs.contract.js) | Nick's lane
DOC-DRIFT | components/studio/chat/chat-message/ChatMessage.view.jsx:266 | System messages use hard edge-to-edge border-y dividers; the transcript-scope divider device is unruled after B1 broadened --line-fade | Brian ruling needed

## 4. Findings: repo hygiene

The G1 law-document edit list (ED1F propagation plan section B) was
verified fully executed: all twelve DESIGN-TOKENS edits, the
FRONTEND-SOP focus bullet, the BUILD-BLUEPRINT 2.5/2.16 amendments
with strike-for-lineage, CR-047 through CR-056 states, and the
regenerated contrast matrix. Zero em dashes in the law docs. The
drift below is in secondary spots the edit list never touched.

BLOCKER | components/kit/studio-filter-bar/KitStudioFilterBar.view.jsx:106-157 | SearchField still implements the retired border-brightening focus in JS; with the G1 suppression rule deleted, keyboard focus renders BOTH the brightened border and the global gold ring, a doubled treatment on every browse page's search field (A3) | Sonnet propagation
DEFECT | components/kit/studio-filter-bar/KitStudioFilterBar.view.jsx:78-93 | Comment states the retired 2.16(e) law as current and cites a suppression CSS rule deleted in G1 | Sonnet propagation
DEFECT | components/kit/picker-modal/KitPickerModal.view.jsx:47 and components/kit/ingredient-picker/KitIngredientPicker.view.jsx:24 | kit-search-input inner inputs carry focus:outline-none; the global ring now lands on the borderless inner input inside the bordered wrapper bed; needs a render check against the A3 legibility requirement | Sonnet propagation
CLEANUP | app/design-system.css:172-179 | Retirement comment wording invites misreading against the surviving differently-purposed .kit-search-input cancel-icon rule at :185-191 | Sonnet propagation
CLEANUP | (23 dead cf-field class attributes in 14 files) | SharedFields.jsx (3), the four creator-stops Controls.jsx files, NameStop, SilhouetteStop, SealStop, AccountV2Mockup, KitSaveIngredientPreset, KitImageCreatorPanel, KitFormField, Lore.view, CreatorProfile | Sonnet propagation
CLEANUP | (119 dead kit-focus class attributes in 47 files) | Heaviest: KitAssetDetailPopup (11), AccountV2Mockup (11), Editor.view (8), KitImageCreatorPanel (7), CreatorProfile (7), SharedFields (4), KitPickerModal (4), KitCreationCard (4), StoriesV2Mockup (4), Lore.view (4), plus 37 more files including eight dev-preview clients and KitModalFrame.fixtures.js | Sonnet propagation
CLEANUP | ds-bundle/_ds_bundle.js | Compiled mirror carries the same dead class strings; regenerates automatically with the JSX sweep | Sonnet propagation
CLEANUP | .design-sync/NOTES.md:152-176 | Deferred DS-check item (a) unexecuted: the space-y scan exclusion; no check script exists in this repo (the check is the upstream Claude Design self-check), and ds-bundle/_ds_bundle.css still carries 14 --tw-space-y-* custom properties the self-check misreads as tokens; fix location undecided | Brian ruling needed
CLEANUP | .design-sync/NOTES.md:162-176 | Deferred DS-check item (b) unexecuted: zero @kind comments exist (0 of the 38 NOTES.md names; the deltas doc says 33); NOTES.md parks the injection approach as a real decision | Brian ruling needed
DOC-DRIFT | docs/BUILD-BLUEPRINT.md:459-461 | Section 2 state shorthand still sanctions the cf-field variant, contradicting A3 | Sonnet propagation
DOC-DRIFT | docs/BUILD-BLUEPRINT.md:907-908 | Form-field states row repeats the "sanctioned 1px cf-field variant" as current | Sonnet propagation
DOC-DRIFT | docs/BUILD-BLUEPRINT.md:1518 | Rail keyboard law still describes the 1px kit-focus mark as current mechanics | Sonnet propagation
DOC-DRIFT | docs/BUILD-BLUEPRINT.md:160 | Status ladder anchors --success-5 at #7D9B6A "(= --status-success)"; the token is now oklch(.76 .08 135), the equation is false | Sonnet propagation
DOC-DRIFT | docs/BUILD-BLUEPRINT.md:513 | 2.6 top-bar search popover still "--surface-4 with --shadow-popover" against the ruled glass-menu retirement, no supersession note | Sonnet propagation
DOC-DRIFT | docs/BUILD-BLUEPRINT.md:929 | 2.9 menu popover anatomy likewise unannotated (2.17 was revised, 2.9 was not) | Sonnet propagation
DOC-DRIFT | docs/plans/ED1E-EDITOR-DESIGN-STANDARD.md:96-97 | ED1E section 4 still prescribes the quiet field ring (1px --gold-action, cf-field), the exact recipe A3 retired; no supersession note anywhere in ED1E | Sonnet propagation
DOC-DRIFT | components/kit/form-field/README.md:78-79 | "or the sanctioned cf-field 1px variant" stated as current | Sonnet propagation
DOC-DRIFT | components/kit/rail/README.md:97,101-102,110 | kit-focus mark and focus law stated current; kit-focus in the tokens list | Sonnet propagation
DOC-DRIFT | components/kit/destination-tile/README.md:66 | kit-focus listed in the locked-tokens inventory | Sonnet propagation
DOC-DRIFT | docs/CRESTFALL-DESIGN-CONTEXT.md:437 | "cf-field recipes still cover this" in present tense | Sonnet propagation
DOC-DRIFT | docs/SPRINT-A-PLAN.md:135, SPRINT-D-PLAN.md:227, SPRINT-E-PLAN.md:172,218, SPRINT-F-PLAN.md (six spots), SPRINT-D/E-SONNET-BRIEF.md, docs/plans/FABLE-GATE-PLAN.md:215 | Historical sprint docs carry retired cf-field/kit-focus/R4 language with no supersession notes; per CLAUDE.md only the active sprint plan is law, so these mislead only if read as current | Brian ruling needed
DOC-DRIFT | docs/plans/ED1F-DESIGN-DELTAS.md:415 versus .design-sync/NOTES.md:162 | Deferred @kind count disagrees: 33 versus 38 | Sonnet propagation
DOC-DRIFT | components/studio/my-creations/edit/sections/AdvancedSection.jsx and kin | NOT dead code: all six legacy wrappers are live via creationEditSectionComponentMap.js:18-22 and CreationEditSectionContent.jsx:7, and CrestfallSelect is imported by 34 files; recorded here so nobody deletes them as dead during the sweep | Sonnet propagation

## 5. Findings: contract audit since ad8e586

279 contracts audited (26 kit/ui plus 253 studio/app). Version law
holds everywhere but one place: every bump since baseline
(KitCreationCard 3.4.0, KitImageOverlay 1.1.0, KitModalFrame 1.2.0,
MediaLightbox 1.1.0) corresponds to a real prop change, and every
no-bump change is presentation-only. The KitCreationCard F2 gate was
lawfully resolved by NEW LAW A (22 Aug, BUILD-BLUEPRINT 2.16(aa))
with Archive as an honest disabled stub and CR-056 filed. G3
(image-overlay, media-lightbox) executed with its planned bumps.

DEFECT | components/studio/media/media-lightbox/MediaLightbox.contract.js:1 | Breaking change shipped as minor: 1.1.0 removes onDelete (replaced by onRequestDelete/onCancelDelete/onConfirmDelete); SOP section 5 classes removals as breaking, and the handoff calls all bumps additive | Brian ruling needed
DOC-DRIFT | docs/handoffs/HANDOFF-ED1F-NICK-2026-08-22.md:12 | Handoff claims a "Reassign Asset callback added" to MediaLightbox; no onReassignAsset prop exists (CR-055 stub is render-only) | Sonnet propagation
DOC-DRIFT | components/studio/media/media-lightbox/MediaLightbox.contract.js:28 | Typedef omits 12 props the view destructures (onSelectMedia through onSubmitReport) | Sonnet propagation
DOC-DRIFT | docs/plans/ED1F-PROPAGATION-PLAN.md:307 | Plan records G3 as deferred; G3 executed and landed (commits b2b4096, 3b2310d, bumps ruled 22 Aug); the record needs reconciling | Sonnet propagation
DOC-DRIFT | docs/plans/ED1F-PROPAGATION-PLAN.md:393 | Contract-bump table still reads "KitCreationCard: Gated on F2" and section F still poses the B6 scope question; both superseded by NEW LAW A | Sonnet propagation
DOC-DRIFT | docs/plans/ED1F-PROPAGATION-PLAN.md:466 | Section F item 3 still lists glass-menu scope as held for a ruling; the Final Ruling Render (GO 2B) closed it and it landed in DESIGN-TOKENS.md:230 and KitDropdown | Sonnet propagation
DOC-DRIFT | components/studio/chat/chat-composer/ChatComposer.contract.js:1 | initialToolsOpen consumed by the view (:90) and fixtures (:208), never declared | Sonnet propagation
DOC-DRIFT | components/studio/my-creations/creation-edit-media-panel/CreationEditMediaPanel.contract.js:1 | Injected LinkComponent undeclared | Sonnet propagation
DOC-DRIFT | app/studio/v2/creators/creator-profile/CreatorProfile.contract.js:1 | v1.3.0 omits activityLoadMore (view :254) | Sonnet propagation
DOC-DRIFT | components/studio/my-creations/image-library/creation-image-library-page/CreationImageLibraryPage.contract.js:1 | 24 view props undeclared including loadStatus, eligibilityFilter, sortMode, and all ten semantic callbacks | Sonnet propagation
DOC-DRIFT | components/studio/image-studio/media-history-grid/MediaHistoryGrid.contract.js:1 | 22 view props undeclared including selection-mode state and bulk-action callbacks | Sonnet propagation
DOC-DRIFT | components/studio/creations/creation-preview-modal/CreationPreviewModal.contract.js:1 | 8 undeclared (statusBadgesProps, statsRowProps, moreSlideBackgroundImage, LinkComponent, four injected subcomponents) | Sonnet propagation
DOC-DRIFT | components/studio/creations/creation-profile-page/CreationProfilePage.contract.js:1 | 6 undeclared callbacks (onSelectTab through onStartChat) | Sonnet propagation
DOC-DRIFT | components/studio/creations/creation-share-button/CreationShareButton.contract.js:1 | compact and ariaLabel undeclared | Sonnet propagation
DOC-DRIFT | components/studio/account/studio-account-profile/StudioAccountProfile.contract.js:1 | hasDefaultPlayerCharacterSelection undeclared | Sonnet propagation
DOC-DRIFT | components/studio/community/community-hub/CommunityHub.contract.js:1 | eyebrow and filterBody undeclared | Sonnet propagation
DOC-DRIFT | components/studio/create/npc-registry/npc-registry-builder/NpcRegistryBuilder.contract.js:1 | title, scope, description, knowledgeRules undeclared | Sonnet propagation
DOC-DRIFT | components/studio/create/actor-mechanics-profile/actor-mechanics-profile-editor/ActorMechanicsProfileEditor.contract.js:1 | 14 undeclared including jsonEditorOpen and the JSON-editor/picker callback set | Sonnet propagation
DOC-DRIFT | components/studio/create/rules-codex/rules-codex-editor/RulesCodexEditor.contract.js:1 | codex, jsonEditorOpen, and three JSON-editor callbacks undeclared | Sonnet propagation
DOC-DRIFT | components/studio/my-creations/edit/sections/mechanics-modules/mechanics-composition-builder/MechanicsCompositionBuilder.contract.js:1 | 10 undeclared option-list props plus an injected component | Sonnet propagation
DOC-DRIFT | components/studio/my-creations/edit/sections/character-template-fields-section/CharacterTemplateFieldsSection.contract.js:1 | 18 undeclared label/placeholder props | Sonnet propagation
DOC-DRIFT | components/studio/my-creations/edit/sections/locations/location-identity-section/LocationIdentitySection.contract.js:1 | 39 view props undeclared including the full onChange set | Sonnet propagation
DOC-DRIFT | components/studio/my-creations/edit/sections/locations/weather-module-config-modal/WeatherModuleConfigModal.contract.js:1 | eyebrow, title, description, messageTone, footerNote undeclared | Sonnet propagation
DOC-DRIFT | components/studio/my-creations/edit/sections/locations/location-runtime-modules-section/LocationRuntimeModulesSection.contract.js:1 | Two fallbackText props undeclared | Sonnet propagation
DOC-DRIFT | (12 contracts with an undeclared LinkComponent injection prop) | studio-back-link, official-characters-grid, story-room-cast-panel, studio-action-card, character-template-gallery, creation-credits, creations/creation-card, studio-character-card, account-stub-page, creator-list-row, community/creator-card, create-type-card | Sonnet propagation
CLEANUP | (57 boundary-only contracts under components/studio/create/** and edit/sections/**) | Version plus boundary constants with no prop surface declared; whether this satisfies FRONTEND-SOP section 13 or is lawful family practice is unruled | Brian ruling needed
CLEANUP | components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.contract.js:1 and kin | Version-format split (semver versus dotted-name) persists; the mechanics loom contracts also fail the SOP verification item 4 version-on-line-1 check | Brian ruling needed
CLEANUP | components/kit/promo-banner/KitContinueRow.view.jsx:10 | Orphaned view, zero consumers (Stories migrated to KitCreationCard onContinue); no contract coverage of its own | Sonnet propagation
DOC-DRIFT | components/kit/promo-banner/README.md:127 | README still names Stories as the "first and only consumer of KitContinueRow" (same stale claim at docs/BUILD-BLUEPRINT.md:1311 and docs/CRESTFALL-DESIGN-CONTEXT.md:361) | Sonnet propagation
DOC-DRIFT | components/kit/destination-tile/README.md:3 | README v1.0.0 versus contract 1.0.1 | Sonnet propagation
DOC-DRIFT | components/kit/ingredient-picker/README.md:3 | README 1.0.0 versus contract 1.1.0; backLabel prop undocumented | Sonnet propagation
DOC-DRIFT | components/kit/save-ingredient-preset/README.md:3 | README 1.0.0 versus contract 1.1.0; backLabel prop undocumented | Sonnet propagation
DOC-DRIFT | components/ui/modal-shell/README.md:5 | No bump was correct (no prop added), but the plan requires the README to record the 22 Aug modal-law ruling either way and it does not | Sonnet propagation

Audited clean, for the record: all eight chat contracts including
story-room-chat-shell (24 of 24 props), Editor.contract.js 4.0.0 (27
props declared), editor-header 3.0.0, editor-save-bar 2.0.0,
creation-edit-shell, creation-edit-sticky-action-bar,
media-tile-quick-actions, the app-level page contracts, games-hub,
view-mode-toggle, my-creations-hub, the image-studio family except
media-history-grid, and 21 kit/ui packages listed in the audit notes.

## 6. Findings: parity spot-check (FE-lane ranked items 1 to 10)

All ten items in `docs/PARITY-ECHO-FULL.md` verified ACCURATE against
current code; zero stale, zero moved. The doc's own totals (285
Present, 29 Flagged, 93 Deliberately excluded) match the propagation
plan's echo. One internal inconsistency found:

DOC-DRIFT | docs/PARITY-ECHO-FULL.md:376 versus :180 | Ranked item 10 lists the media-tile lightbox as an open FE fix while the Community table row marks the same control Deliberately excluded (OPEN item 28); one disposition should govern | Sonnet propagation

## 7. Proposed Sonnet worklist, disjoint file sets

Ordering: SW1 before SW2 (sections consume SharedFields recipes);
everything else parallel; SW13 runs LAST and serial because its files
overlap every other lane. Standing constraints apply: one package one
commit, verification per FRONTEND-SOP section 8, contract law stops
and escalates, no em dashes, never sed or awk on markup or CSS.

- **SW1, SharedFields grammar core** (`components/studio/my-creations/edit/sections/SharedFields.jsx`, `edit/hooks/useCreationEditViewModel.js`, `edit/creationEditPayloads.js`, delete empty `creationEditLifecycle.js`): folding rework (one-line rest preview, focus expansion, fold glyph), overflow fade, spacing law, NumberField alignment, ReadOnlyField de-bedding plus terminology map, ActionPanel retirement, over-limit save blocking, comment drift. Contract 1.1.0 to 1.2.0 per ED1E item 1.
- **SW2, character and creation sections** (the nine packaged sections plus `character-templates/`, their viewmodels): CrestfallSelect retirement to the 4.4/4.5 grammars, Personality Frameworks and Template Operations de-boxing, Danger Zone 5.4 rewrite with in-place arming, disabled "Soon" meta words, raw status colors, mt-6 ownership.
- **SW3, editor core** (`app/studio/v2/editor/**`, `components/studio/my-creations/editor-header/`, `creation-edit-shell/` including the quick nav and section content): rail per section 7 (no inner scroll, save block first, tiers, marks, indents), hero per section 6 (add tile, no broken wells, no duplicate art, seated actions), container and skeleton tokens, sheet title, chrome wash token, KitBadge, fixture F4 coordination with Nick. Editor contract 4.0.0 to 4.1.0, or 5.0.0 if hero slots change shape.
- **SW4, mechanics subtree** (`edit/sections/mechanics-modules/**`): 47 native selects to the branded grammar, 20 checkboxes pending the R2 ruling, type ladder, de-nesting, status tokens, local-focus removal, preset-application overlay to KitModalFrame; the JSON editor modal waits on ruling R4.
- **SW5, registries, storylines, wardrobes** (`item-registries/`, `npc-registries/`, `storylines/`, `wardrobes/`): ladder, de-nesting, CrestfallSelect retirement, status tokens, local focus.
- **SW6, locations and remaining section families** (`locations/**` including both config modals and the parent picker, `room-templates/**`, `scenarios/**`, `outfits/**`, `narrators/**`, `visual-references-section/`, `image-presets/**` spacing): the section 2.4 list; the four hand-rolled overlays move to KitModalFrame; checkbox rows wait on R2; the Trackers monolith gets split into a package with fixtures.
- **SW7, image library and pickers** (`my-creations/image-library/**`, delete dead `CreationReferenceImagePickerModal.jsx`, `creation-edit-media-panel/`, `app/studio/v2/editor/image-library/` and `ImageLibrary.jsx`): reference picker to KitModalFrame, B1 dividers, B5 delete confirm, media panel ellipsis BLOCKER, raw literals; the fixture-first load path (F3) is Nick's lane and lands with him.
- **SW8, chat family** (`components/studio/chat/**`, `app/studio/v2/stories/StoriesV2Mockup.jsx` delete confirm): session-dialog selects to the branded grammar, fade-line footers family-wide, hasUnsavedChanges wiring, header ladder, local focus removal, disabled meta words, leading-7, recap card placement, confirm dedup, StoriesV2Mockup window.confirm to B5.
- **SW9, kit polish** (`studio-filter-bar/`, `picker-modal/`, `ingredient-picker/`, `credits/`, `save-ingredient-preset/`, `filter-chip/`, `asset-detail-popup/`, `ui/crestfall-option-modal/`, `create/npc-registry/modal-shell/`): the SearchField double-focus BLOCKER, native sort select, 44px floors where already lawful, pb space-6, disabled opacity, ingredient-picker width, option-modal 700px boundary and lift surface, gold field labels, `.goldring` wiring for --focus-ring-ongold on gold CTAs.
- **SW10, trait modal family** (deferred G4 as planned: `components/studio/create/character/**` modal packages): KitModalFrame migration, 44px closes, flat swatch tiles, ChipRow selected recipe, 4.5 trigger fields, focus cleanup.
- **SW11, docs pass** (BUILD-BLUEPRINT secondary spots, ED1E supersession notes and D22 count, kit READMEs, chat session-dialogs README, ED1F-PROPAGATION-PLAN annotations for G3/F2/F3, PARITY-ECHO item 10 disposition, handoff Reassign claim, CRESTFALL-DESIGN-CONTEXT stale lines, @kind count reconciliation, promo-banner README): pure doc edits, no code.
- **SW12, contract typedefs** (the 33 under-declared contracts in section 5, MediaLightbox typedef after ruling R7): reconcile typedefs to actual prop surfaces, no version bumps (doc-only corrections) unless R7 rules otherwise.
- **SW13, dead focus-class sweep, LAST and serial** (142 instances across 61 files plus ds-bundle recompile): remove cf-field and kit-focus class attribute strings; runs after SW1 through SW10 merge to avoid conflicts.

Held out of the worklist pending rulings: story-room shell restyle
(R11), ModalShell consumers (R4), checkbox grammar sites (R2), the
44px keying change (R6), and the DS-check items (R10).

## 8. Items needing Brian rulings

1. **Status color at text size on raised surfaces** (ED1E section 10 item 1, still BLOCKED-ON-RULING): traps the editor save-error words (Editor.view.jsx:134), the at-limit counters (SharedFields.jsx:74), and any field-level error line. Nothing in ED1F ruled it.
2. **Checkbox and multi-select grammar**: no law exists (4.9 covers toggles only); 20-plus native checkbox sites in mechanics and locations need a ruled target before SW4/SW6 can convert them.
3. **Progress meter recipe**: TrackersModuleConfigModal:1251 renders a meter with no law behind it.
4. **ModalShell's future**: twelve direct consumers bypass A4/B1/B3/B8; teach ModalShell the laws or migrate consumers to KitModalFrame. Includes whether wide code editors (JSON editor at max-w-7xl) get a width-tier exception, and whether the npc-registry shell's max-w-4xl single-column form is legal.
5. **B8 versus the picker footer**: KitPickerModal's ruled count-in-footer anatomy collides with the B8 buttons-at-fade-line-ends law.
6. **44px floor keying**: A4 words the floor by width (under 700px); KitDropdown, KitFilterChip, and the asset-detail media controls key it on pointer:coarse; the popup's 8px carousel dots fail either reading.
7. **MediaLightbox 1.1.0**: onDelete removal is breaking-as-minor; ratify as shipped or reissue as 2.0.0.
8. **Boundary-only contract style**: 57 contracts declare version plus boundary constants with no prop surface; rule whether that satisfies FRONTEND-SOP section 13. Related: the semver-versus-dotted-name version split (open queue item T14).
9. **Historical sprint docs**: archive versus annotate the retired cf-field/kit-focus/R4 language in SPRINT-A/D/E/F plans and briefs.
10. **DS-check deferred items**: where the space-y scan exclusion lives (upstream check versus bundle restructure), and the @kind injection approach (also reconcile the 33 versus 38 count).
11. **Story-room chat shell**: wholly off-token with a window.confirm delete on a live route; rule whether it gets a pre-Nick fix lane or stays in the G7 legacy hold.
12. **Registry builders outside the checklist**: location-registry and structured-registry section UIs live in components/studio/create builders the ED1E section 11 checklist never names; rule whether the checklist extends to them.
13. **Chat small rulings**: composer counter wording for the no-max soft threshold (O5), text buttons on radius-full (mode segmented control, transcript controls), the condensed ChatShell page title size, the transcript divider device after B1, and the residual --surface-4 consumers in asset-detail-popup and picker-modal versus the DESIGN-TOKENS claim that none remain.

## 9. Verification note

Static read-only review; no renders were produced and no build was
run (nothing was modified, so build state is trunk's own). The A3
ring-legibility check per surface depth and all 390/1440 render
verification remain for Brian's sitting or the propagation passes.
Zero em dashes in this document.
