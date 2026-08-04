# Batch two scope — audit against RESTYLE-RULES.md "Rulings — 4 Aug 2026"

Read-only audit of all 299 packages under `components/**` (branch `design/global-sweep`) against the law in RESTYLE-RULES.md's "Rulings — 4 Aug 2026" section: Corners, Shape law, Wash, Blur, Destructive, Banner taxonomy, Creator card. No package edited. Findings only, sorted by package, one line per finding, in the form:

`<category>: <file>:<line> — <finding>`

Categories: 1 = button rendered fully rounded (shape-law violation), 2 = tag/label NOT fully rounded (shape-law violation), 3 = off-scale radius, 4 = dark overlay over artwork, 5 = backdrop blur, 6 = delete/remove/discard control, 7 = banner classification.

Packages with zero findings across all 7 categories are omitted. A handful of fully-compliant blur pairings (`blur(2px)` + `--scrim-strong`) are logged under category 5 for completeness, not as violations.

---

## components

- 1: FloatingBackButton.jsx:15 — back-action button uses `rounded-full`
- 5: FloatingBackButton.jsx:19 — `backdrop-blur-md` paired with `bg-black/70` (line 16) on a floating action button, not a modal/sheet/picker
- 1: ScrollControls.jsx:27 — scroll-to-top button uses `rounded-full`
- 5: ScrollControls.jsx:36 — `backdrop-blur-md` paired with `bg-black/55` (line 31) on a floating button, not a panel
- 1: ScrollControls.jsx:57 — scroll-to-bottom button uses `rounded-full`
- 5: ScrollControls.jsx:66 — `backdrop-blur-md` paired with `bg-black/55` (line 61) on a floating button, not a panel
- 4: SiteShell.jsx:14 — `bg-[rgba(5,5,4,0.78)]` dark overlay over background cover image; no tag on top with a separate bed

## components/filterable-index

- 1: FilterableIndex.view.jsx:31 — search input uses `rounded-full`
- 1: FilterableIndex.view.jsx:54 — filter `<select>` uses `rounded-full`
- 1: FilterableIndex.view.jsx:69 — "Clear" button uses `rounded-full`
- 1: FilterableIndex.view.jsx:82 — tag-rail left-scroll button uses `rounded-full`
- 1: FilterableIndex.view.jsx:94 — "All" tag-toggle (filter-chip role) uses `rounded-full`
- 1: FilterableIndex.view.jsx:108 — per-tag toggle buttons (filter-chip role) use `rounded-full`
- 1: FilterableIndex.view.jsx:124 — tag-rail right-scroll button uses `rounded-full`

## components/policies

- 3: PolicyIndex.jsx:8 — `rounded-2xl` (16px) placeholder-notice box, resolves to `--radius-md`
- 3: PolicyIndex.jsx:26 — `rounded-2xl` (16px) policy card link, resolves to `--radius-md`
- 1: PolicyPage.jsx:9 — "Terms & Policies" back-link button uses `rounded-full`
- 3: PolicyPage.jsx:15 — `rounded-3xl` (24px) header box, off-scale, no matching tier (nearest `--radius-lg`, 20px)
- 3: PolicyPage.jsx:29 — `rounded-2xl` (16px) draft-placeholder alert, resolves to `--radius-md`
- 3: PolicyPage.jsx:52 — `rounded-2xl` (16px) policy section box, resolves to `--radius-md`
- 3: PolicyPage.jsx:65 — `rounded-2xl` (16px) footer box, resolves to `--radius-md`

## components/studio/account/account-stub-page

- 3: AccountStubPage.view.jsx:37 — `rounded-2xl` (16px) card surface, resolves to `--radius-md`
- 3: AccountStubPage.view.jsx:61 — `rounded-2xl` (16px) notice box, resolves to `--radius-md`

## components/studio/account/studio-account-coins

- 3: StudioAccountCoins.view.jsx:13 — `rounded-2xl` (16px) coins widget card, resolves to `--radius-md`
- 3: StudioAccountCoins.view.jsx:63 — `rounded-2xl` (16px) purchase-info modal panel, resolves to `--radius-md` (not up to `--radius-lg`)
- 3: StudioAccountCoins.view.jsx:75 — close icon-button uses `rounded-lg` (8px), off-tier
- 5: StudioAccountCoins.view.jsx:62 — modal scrim `bg-black/70` + `backdrop-blur-sm` (~4px), blur strength doesn't match the ruled `blur(2px)`

## components/studio/account/studio-account-profile

- 3: StudioAccountProfile.view.jsx:57 — `rounded-2xl` (16px) form container, resolves to `--radius-md`
- 3: StudioAccountProfile.view.jsx:107 — `rounded-2xl` (16px) "Account Contact" panel, resolves to `--radius-md`
- 3: StudioAccountProfile.view.jsx:159 — `rounded-2xl` (16px) "Default Player Character" panel, resolves to `--radius-md`
- 3: StudioAccountProfile.view.jsx:204 — `rounded-2xl` (16px) "Public Profile Text" section, resolves to `--radius-md`
- 3: StudioAccountProfile.view.jsx:384 — `rounded-2xl` (16px) content-preference modal panel, resolves to `--radius-md`
- 3: StudioAccountProfile.view.jsx:398 — modal close icon-button uses `rounded-lg` (8px), off-tier
- 4: StudioAccountProfile.view.jsx:383 — `bg-black/70` scrim on content-preference modal (floating-panel scrim, not artwork)
- 5: StudioAccountProfile.view.jsx:383 — `backdrop-blur-sm` (~4px) paired with `.70` scrim, doesn't match ruled `blur(2px)`
- 6: StudioAccountProfile.view.jsx:190-196 — "Clear" default-player-character button: ordinary ghost geometry, hover text hardcoded `red-200`/`red-400` (not `--status-danger`); no confirm step, fires directly

## components/studio/characters/actor-mechanics-profile-attachment

- 6: ActorMechanicsProfileAttachmentSection.view.jsx:124-135 — Remove-attachment button: icon-only (X), own compact `rounded-lg p-2` geometry distinct from file's ordinary ghost button; no visible word beside icon (aria-label only); no confirm step

## components/studio/characters/advanced-prompting/advanced-prompting

- 3: AdvancedPromptingEditor.view.jsx:81 — `rounded-2xl` (16px) outer section container, resolves to `--radius-md`
- 6: AdvancedPromptingEditor.view.jsx:204-212 — "Clear Section" button: own geometry (`rounded-lg px-3 py-2`) differing from file's other buttons (`rounded-xl px-4 py-3`); hover text hardcoded `red-100` (not `--status-danger`); no confirm step

## components/studio/community/creator-card

- 3: CreatorCard.view.jsx:32 — `rounded-2xl` (16px) card container, resolves to `--radius-md`
- 4: CreatorCard.view.jsx:37-38 — `linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.86))` over profile banner artwork; peak .86 exceeds `--scrim-strong` (.70); Featured/Canon badges on same artwork use ~10%-opacity beds, not `--tag-bed-art` (.70)
- 4: CreatorCard.view.jsx:32 — additional `bg-black/35` layer behind the same artwork region, stacked on the gradient veil above
- 7: CreatorCard.view.jsx:33-44 — banner-image header functions as a top/hero banner but veil is uniform top-to-bottom (not fade-from-bottom); copy (badges, name, handle, tagline, stats) is not anchored bottom-left — matches none of the three named taxonomies
- Creator card ruling: CreatorCard.view.jsx:99-106 — engagement actions and "View Profile" link render inside the same container as the artwork background-image (lines 33-44), overlapping the image strip instead of sitting below it
- Creator card ruling: CreatorCard.view.jsx:50-97 — header is not a single non-wrapping avatar/handle/stats line: name, handle, tagline, and a separate stats grid stack across multiple rows

## components/studio/create

- 3: RegistryStubPanel.jsx:11 — `rounded-2xl` (16px) primary panel, resolves to `--radius-md`
- 3: RegistryStubPanel.jsx:26 — `rounded-2xl` (16px) planned-tab card, resolves to `--radius-md`
- 3: RegistryStubPanel.jsx:40 — `rounded-2xl` (16px) summary aside panel, resolves to `--radius-md`

## components/studio/create/actor-mechanics-profile/actor-mechanics-profile-builder

- 3: ActorMechanicsProfileBuilder.view.jsx:60 — `rounded-2xl` (16px) sticky aside panel, resolves to `--radius-md`
- 3: ActorMechanicsProfileBuilder.view.jsx:123 — `rounded-2xl` (16px) "Asset Identity" section, resolves to `--radius-md`

## components/studio/create/actor-mechanics-profile/actor-mechanics-profile-editor

- 3: ActorMechanicsProfileEditor.view.jsx:225 — `rounded-2xl` (16px) outer profile section, resolves to `--radius-md`
- 6: ActorMechanicsProfileEditor.view.jsx:737-744 — "Remove" binding trash-icon button: icon-only (aria-label only), `rounded-lg p-2`, `--status-danger` text with hover bed, no confirm step
- 6: ActorMechanicsProfileEditor.view.jsx:1098-1104 — mobile duplicate remove-binding button: different geometry from desktop version, icon-only, no confirm step
- 6: ActorMechanicsProfileEditor.view.jsx:929-944 — "Remove reference" trash-icon (managed-definition row): icon-only, `rounded-lg p-2`, `--status-danger` text, no confirm step
- 6: ActorMechanicsProfileEditor.view.jsx:971-985 — "Remove reference" trash-icon (generic reference row): same icon-only geometry, no confirm step

## components/studio/create/actor-mechanics-profile/actor-mechanics-profile-json-editor

- 3: ActorMechanicsProfileJsonEditorModal.view.jsx:87 — `rounded-2xl` (16px) modal panel, resolves down to `--radius-md`, not up to `--radius-lg`

## components/studio/create/assets/asset-builder

- 3: AssetBuilder.view.jsx:50 — `rounded-2xl` (16px) aside content panel, resolves to `--radius-md`
- 3: AssetBuilder.view.jsx:129 — `rounded-2xl` (16px) In-World Weather panel, resolves to `--radius-md`
- 3: AssetBuilder.view.jsx:154 — `rounded-2xl` (16px) location registry content wrapper, resolves to `--radius-md`
- 3: AssetBuilder.view.jsx:236 — `rounded-2xl` (16px) Cover Image panel, resolves to `--radius-md`
- 3: AssetBuilder.view.jsx:262 — `rounded-2xl` (16px) cover-candidate selector tile, resolves to `--radius-md`
- 3: AssetBuilder.view.jsx:287 — `rounded-2xl` (16px) quick-save workflow panel, resolves to `--radius-md`
- 3: AssetBuilder.view.jsx:315 — `rounded-2xl` (16px) LocationParentPanel container, resolves to `--radius-md`
- 3: AssetBuilder.view.jsx:405 — `rounded-2xl` (16px) RuntimeInheritancePanel container, resolves to `--radius-md`
- 6: AssetBuilder.view.jsx:358 — "Clear" (parent location): ordinary geometry matching "Change Parent" sibling, raw `hover:text-red-200`/`hover:border-red-400/40` (not `--status-danger`); no confirm step

## components/studio/create/character

- 3: BehaviorStep.jsx:42 — `rounded-2xl` (16px) "Optional Personality Frameworks" panel, resolves to `--radius-md`
- 3: CharacterCreatorUtils.jsx:24 — `rounded-2xl` (16px) PlaceholderStep body panel, resolves to `--radius-md`
- 3: IdentityStep.jsx:24 — `rounded-2xl` (16px) Character Templates promo panel, resolves to `--radius-md`

## components/studio/create/character-template

- 3: CharacterTemplateBuilderEditor.jsx:322 — `rounded-2xl` (16px) "Optional Personality Frameworks" panel, resolves to `--radius-md`
- 3: CharacterTemplateBuilderEditor.jsx:432 — `rounded-2xl` (16px) "Filled Sections" review panel, resolves to `--radius-md`

## components/studio/create/character-template/character-template-builder

- 3: CharacterTemplateBuilder.view.jsx:57 — `rounded-2xl` (16px) main editor panel, resolves to `--radius-md`
- 3: CharacterTemplateBuilder.view.jsx:77 — `rounded-2xl` (16px) Draft Progress panel, resolves to `--radius-md`
- 3: CharacterTemplateBuilder.view.jsx:182 — `rounded-2xl` (16px) CharacterTemplateSummary aside, resolves to `--radius-md`
- 3: CharacterTemplateBuilder.view.jsx:183 — `rounded-2xl` (16px) template-draft image placeholder tile, resolves to `--radius-md`
- 6: CharacterTemplateBuilder.view.jsx:217 — "Clear Template Draft": ordinary geometry, icon+word; raw `hover:text-red-100`/`hover:border-red-300/30` (not `--status-danger`); no confirm step

## components/studio/create/character/character-color-palette

- 3: CharacterColorPaletteModal.view.jsx:28 — `rounded-2xl` (16px) PalettePreviewCard tile, resolves to `--radius-md`
- 3: CharacterColorPaletteModal.view.jsx:119 — `rounded-3xl` (24px) modal dialog container, off-scale; floating panel, should resolve to `--radius-lg` (20px)
- 3: CharacterColorPaletteModal.view.jsx:174 — `rounded-2xl` (16px) empty-state panel, resolves to `--radius-md`
- 5: CharacterColorPaletteModal.view.jsx:110 — `backdrop-blur-sm` (~4px, not canonical 2px) paired with `bg-black/80` (.80, not `--scrim-strong` .70)

## components/studio/create/character/character-creator

- 3: CharacterCreator.view.jsx:39 — `rounded-2xl` (16px) section panel, resolves to `--radius-md`
- 3: CharacterCreator.view.jsx:90 — `rounded-2xl` (16px) panel, resolves to `--radius-md`

## components/studio/create/character/character-preview

- 3: CharacterPreview.view.jsx:10 — `rounded-2xl` (16px) aside panel, resolves to `--radius-md`
- 3: CharacterPreview.view.jsx:11 — `rounded-2xl` (16px) portrait placeholder tile, resolves to `--radius-md`

## components/studio/create/character/character-template-picker

- 5: CharacterTemplateModal.view.jsx:23 — `backdrop-blur-[2px]` paired with `bg-[var(--scrim-strong)]` (.70) — matches ruled law, logged for completeness

## components/studio/create/character/default-clothing-selector

- 3: DefaultClothingSelector.view.jsx:19 — `rounded-2xl` (16px) panel, resolves to `--radius-md`

## components/studio/create/character/eye-color

- 3: EyeColorModal.view.jsx:40 — `rounded-2xl` (16px) modal dialog container, resolves to `--radius-md`

## components/studio/create/character/hair

- 3: HairModal.view.jsx:34 — `rounded-2xl` (16px) modal dialog container, resolves to `--radius-md`

## components/studio/create/character/hair-eyes

- 3: HairEyesModal.view.jsx:35 — `rounded-2xl` (16px) modal dialog container, resolves to `--radius-md`

## components/studio/create/character/kibbe-preset

- 3: KibbePresetModal.view.jsx:40 — `rounded-2xl` (16px) modal dialog container, resolves to `--radius-md`
- 3: KibbePresetModal.view.jsx:91 — `rounded-2xl` (16px) nested "Suggested Crestfall Traits" sidebar panel, resolves to `--radius-md`

## components/studio/create/character/multi-trait

- 3: MultiTraitModal.view.jsx:41 — `rounded-2xl` (16px) modal dialog container, resolves to `--radius-md`

## components/studio/create/character/personality

- 3: PersonalityModal.view.jsx:40 — `rounded-2xl` (16px) modal container, resolves to `--radius-md`
- 3: PersonalityModal.view.jsx:54 — close icon button `rounded-lg` (8px), off-tier for a control

## components/studio/create/character/review-step

- 3: CharacterReviewStep.view.jsx:91 — "Advanced Creator Guidance" panel `rounded-2xl` (16px), resolves to `--radius-md`
- 3: CharacterReviewStep.view.jsx:130 — "Draft Summary" panel `rounded-2xl` (16px), resolves to `--radius-md`

## components/studio/create/character/skin-tone

- 3: SkinToneModal.view.jsx:40 — `rounded-2xl` (16px) modal container, resolves to `--radius-md`
- 3: SkinToneModal.view.jsx:47 — close icon button `rounded-lg` (8px), off-tier

## components/studio/create/character/trait

- 3: TraitModal.view.jsx:40 — `rounded-2xl` (16px) modal container, resolves to `--radius-md`
- 3: TraitModal.view.jsx:54 — close icon button `rounded-lg` (8px), off-tier

## components/studio/create/character/voice-module-picker

- 3: VoiceModulePickerModal.view.jsx:75 — `rounded-2xl` (16px) modal container, resolves to `--radius-md`
- 3: VoiceModulePickerModal.view.jsx:88 — close icon button `rounded-lg` (8px), off-tier
- 6: VoiceModulePickerModal.view.jsx:160 — "Clear All": plain ghost button matching "Done" sibling geometry; hover `text-red-200`/`border-red-400/30` (not `--status-danger`); `onClearAll` calls `onChange([])` directly, no confirm step

## components/studio/create/create-type-card

- 3: CreateTypeCard.view.jsx:12 — `rounded-2xl` (16px) card article, resolves to `--radius-md`
- 4: CreateTypeCard.view.jsx:20 — gradient veil over artwork `bg-gradient-to-br from-black via-black/80 to-black/35`; no tag/badge sits on it

## components/studio/create/creation-studio

- 1: CreationStudio.view.jsx:160 — "View all tools" button rendered `rounded-full`
- 1: CreationStudio.view.jsx:533 — "optionalAsset" nav-link rendered `rounded-full` as a clickable action
- 3: CreationStudio.view.jsx:56 — `rounded-2xl` (16px) sticky progress bar section, resolves to `--radius-md`
- 3: CreationStudio.view.jsx:167 — `rounded-2xl` (16px) load-error panel, resolves to `--radius-md`
- 5: CreationStudio.view.jsx:56 — `backdrop-blur-xl` (24px, far off the ruled 2px) on a sticky in-flow progress bar, not a floating panel
- 7: CreationStudio.view.jsx:223 — `CorePathCompleteBanner`: in-flow banner card with no artwork, no veil at all, copy/CTA in a left-text/right-CTA row rather than bottom-left — matches none of the three named treatments

## components/studio/create/item-registry/item-registry-builder

- 3: ItemRegistryBuilder.view.jsx:73,212,378,507,569,723,771,793 — `rounded-2xl` (16px) on multiple panels/JSON-preview block, resolves to `--radius-md`
- 6: ItemRegistryBuilder.view.jsx:483 — "Delete Entry": geometry matches `--radius-md`, icon+word present, but filled with `--status-danger-bed` rather than quiet/ghost per Destructive ruling; no confirm step

## components/studio/create/location/location-builder

- 3: LocationBuilder.view.jsx:47 — `rounded-2xl` (16px) aside panel, resolves to `--radius-md`
- 3: LocationBuilder.view.jsx:385 — `rounded-2xl` (16px) cover-candidate tile, resolves to `--radius-md`
- 3: LocationBuilder.view.jsx:451 — `rounded-2xl` (16px) panel, resolves to `--radius-md`
- 6: LocationBuilder.view.jsx:287 — "Clear" (parent location): ordinary geometry matching "Change" sibling, icon+word present, hover correctly uses `--status-danger` token (no fill); no confirm step

## components/studio/create/location-registry/location-registry-builder

- 1: LocationRegistryBuilder.view.jsx:111 — tab-switch buttons rendered `rounded-full`
- 1: LocationRegistryBuilder.view.jsx:794 — "Basic / Ad-Hoc Location" kind-toggle button rendered `rounded-full`
- 1: LocationRegistryBuilder.view.jsx:806 — "Creation Reference" kind-toggle button rendered `rounded-full`
- 3: LocationRegistryBuilder.view.jsx:104,130,190,398,493,597,682,1272,1650 — `rounded-2xl` (16px) on multiple panels/entry cards/empty state, resolves to `--radius-md`
- 5: LocationRegistryBuilder.view.jsx:1393 — `backdrop-blur-[2px]` paired with `bg-[var(--scrim-strong)]` (.70) — matches ruled law, logged for completeness
- 6: LocationRegistryBuilder.view.jsx:413,510,614,696 — `SmallDangerAction`: icon-only Trash2 (aria-label only, no visible word), geometry identical to sibling `SmallAction`, raw `text-red-200` (not `--status-danger`); no confirm step

## components/studio/create/lore/lore-builder

- 3: LoreBuilder.view.jsx:43 — `rounded-2xl` (16px) aside panel, resolves to `--radius-md`
- 3: LoreBuilder.view.jsx:76 — `rounded-2xl` (16px) section panel, resolves to `--radius-md`

## components/studio/create/lore/lore-document-renderer

- 3: LoreDocumentRenderer.view.jsx:221 — `rounded-2xl` (16px) contents nav container, resolves to `--radius-md`
- 3: LoreDocumentRenderer.view.jsx:350 — `rounded-2xl` (16px) empty-state container, resolves to `--radius-md`

## components/studio/create/lore/lore-editor

- 1: LoreEditor.view.jsx:1127 — character-select button rendered `rounded-full`
- 3: LoreEditor.view.jsx:995 — block-picker modal panel `rounded-2xl` (16px), resolves to `--radius-md`
- 3: LoreEditor.view.jsx:1098 — image-picker modal panel `rounded-2xl` (16px), resolves to `--radius-md`
- 3: LoreEditor.view.jsx:1253 — root document section `rounded-2xl` (16px), resolves to `--radius-md`
- 5: LoreEditor.view.jsx:989 — `backdrop-blur-sm` paired with `bg-black/90` on block-picker modal scrim (non-token blur, non-token opacity)
- 6: LoreEditor.view.jsx:338 — icon-only Trash2 "Remove column block", `border-red-300/15 text-red-200` (raw, not `--status-danger`), no confirm step
- 6: LoreEditor.view.jsx:759 — icon-only Trash2 "Remove reference row", same raw-red styling, no confirm step
- 6: LoreEditor.view.jsx:1501-1505 — icon-only Trash2 chapter delete, raw-red styling, no confirm step
- 6: LoreEditor.view.jsx:1734 — icon-only Trash2 section delete, raw-red styling, no confirm step

## components/studio/create/lore/lore-engine-use

- 3: LoreEngineUse.view.jsx:193,265,335,411,466 — `rounded-2xl` (16px) on multiple panels, resolves to `--radius-md`

## components/studio/create/lore/lore-json-editor

- 3: LoreJsonEditorModal.view.jsx:87 — `rounded-2xl` (16px) modal panel, resolves to `--radius-md`

## components/studio/create/lore/lore-publication-readiness

- 3: LorePublicationReadiness.view.jsx:123,237,283,423,574,631,666 — `rounded-2xl` (16px) on multiple panels, resolves to `--radius-md`

## components/studio/create/mechanics-module/mechanics-module-builder

- 3: MechanicsModuleBuilder.view.jsx:9,54,81,95,176 — `rounded-2xl` (16px) on multiple panels, resolves to `--radius-md`

## components/studio/create/narrator/narrator-builder

- 3: NarratorBuilder.view.jsx:65,79,132,210 — `rounded-2xl` (16px) on multiple panels, resolves to `--radius-md`

## components/studio/create/narrator/narrator-module-selector

- 3: NarratorModuleSelector.view.jsx:20,37 — `rounded-2xl` (16px) on multiple panels, resolves to `--radius-md`

## components/studio/create/npc-registry/modal-shell

- 3: ModalShell.view.jsx:10 — `rounded-2xl` (16px) modal panel, resolves down to `--radius-md`, not up to `--radius-lg`

## components/studio/create/npc-registry/npc-entry

- 1: NpcEntryModal.view.jsx:46 — entry-mode selector button rendered `rounded-full`
- 3: NpcEntryModal.view.jsx:84 — `rounded-2xl` (16px), resolves to `--radius-md`

## components/studio/create/npc-registry/npc-registry-builder

- 3: NpcRegistryBuilder.view.jsx:544 — `rounded-2xl` (16px) empty-panel, resolves to `--radius-md`
- 6: NpcRegistryBuilder.view.jsx:562-571 — `SmallDangerAction`: geometry matches ordinary button, text correctly uses `--status-danger`; icon-only Trash2 with `aria-label="Delete"` only, no visible word; call sites (277, 355, 414, 475) invoke `onDelete` directly, no confirm step

## components/studio/create/player-character/player-character-creator

- 3: PlayerCharacterCreator.view.jsx:74,125,217,218,461,513 — `rounded-2xl` (16px) on multiple panels/portrait frame, resolves to `--radius-md`

## components/studio/create/progression/progression-json-editor

- 3: ProgressionJsonEditorModal.view.jsx:87 — `rounded-2xl` (16px) modal panel, resolves to `--radius-md`

## components/studio/create/progression/progression-profile-editor

- 3: ProgressionProfileEditor.view.jsx:226,286,626 — `rounded-2xl` (16px) on multiple panels, resolves to `--radius-md`
- 6: ProgressionProfileEditor.view.jsx:485-492 — `onRemoveOverride`: icon-only Trash2, `border-rose-300/20 text-rose-200 hover:bg-rose-300/10` (raw, not `--status-danger`; hover fill inconsistent with quiet-trigger recipe); no confirm step
- 6: ProgressionProfileEditor.view.jsx:653-660 — `onRemoveTier`: same pattern, no confirm step

## components/studio/create/room-template

- 3: BuilderSection.jsx:3 — `rounded-2xl` (16px), resolves to `--radius-md`
- 3: OpeningMessageCard.jsx:23 — `rounded-2xl` (16px), resolves to `--radius-md`
- 3: RoomTemplateSummary.jsx:8 — `rounded-2xl` (16px), resolves to `--radius-md`
- 3: ScenarioRecommendationsPanel.jsx:18 — `rounded-2xl` (16px), resolves to `--radius-md`
- 3: InvitedPlayersPanel.jsx:13 — `rounded-2xl` (16px), resolves to `--radius-md`
- 6: OpeningMessageCard.jsx:29-36 — "Remove" text button, quiet ghost geometry, hover `text-red-200` (raw, not `--status-danger`); no confirm step
- 6: InvitedPlayersPanel.jsx:66-73 — icon-only X "Remove" button, aria-label only, hover `text-red-200` raw; no confirm step

## components/studio/create/room-template/room-registry-attachments-section

- 3: RoomRegistryAttachmentsSection.view.jsx:36,96 — `rounded-2xl` (16px), resolves to `--radius-md`
- 6: RoomRegistryAttachmentsSection.view.jsx:118-126 — icon-only X remove-registry button, `hover:border-red-400/40 hover:text-red-200` raw; no confirm step

## components/studio/create/room-template/room-template-builder

- 3: RoomTemplateBuilder.view.jsx:64,79,225,292,384 — `rounded-2xl` (16px) on multiple panels/toggle/portrait frame, resolves to `--radius-md`

## components/studio/create/room-template/room-template-package-picker

- 5: RoomTemplatePackagePickerModal.view.jsx:51 — `backdrop-blur-[2px]` paired with `bg-[var(--scrim-strong)]` (.70) — matches ruled law, logged for completeness

## components/studio/create/room-template/selected-characters-panel

- 3: SelectedCharactersPanel.view.jsx:14 — `rounded-2xl` (16px), resolves to `--radius-md`
- 6: SelectedCharactersPanel.view.jsx:56-59 — icon-only X remove-character button, aria-label only, hover `text-red-200` raw; no confirm step

## components/studio/create/room-template/selection-card

- 3: SelectionCard.view.jsx:15 — selection button `rounded-2xl` (16px), resolves to `--radius-md`

## components/studio/create/room-template/story-rules-codex-attachments-section

- 3: StoryRulesCodexAttachmentsSection.view.jsx:42,84 — `rounded-2xl` (16px), resolves to `--radius-md`
- 6: StoryRulesCodexAttachmentsSection.view.jsx:108-117 — Remove-attachment icon button (`rounded-lg p-2`), no confirm step

## components/studio/create/rules-codex/rules-codex-builder

- 3: RulesCodexBuilder.view.jsx:60,121 — `rounded-2xl` (16px), resolves to `--radius-md`

## components/studio/create/rules-codex/rules-codex-editor

- 3: RulesCodexEditor.view.jsx:151 — `rounded-2xl` (16px), resolves to `--radius-md`
- 6: RulesCodexEditor.view.jsx:390-397 — "Remove section" button, identical geometry to move-up/down siblings, no confirm step

## components/studio/create/rules-codex/rules-codex-json-editor

- 3: RulesCodexJsonEditorModal.view.jsx:87 — `rounded-2xl` (16px) modal panel, resolves to `--radius-md`

## components/studio/create/scenario/scenario-builder

- 3: ScenarioBuilder.view.jsx:30,45,58,204,308,333,349 — `rounded-2xl` (16px) on multiple panels/toggle, resolves to `--radius-md`

## components/studio/create/scenario/scenario-reference-picker

- 3: ScenarioReferencePickerModal.view.jsx:20,128 — `rounded-2xl` (16px) modal panel/empty state, resolves to `--radius-md`

## components/studio/create/stats-pools/stats-pools-builder

- 3: StatsPoolsBuilder.view.jsx:60,116 — `rounded-2xl` (16px), resolves to `--radius-md`

## components/studio/create/stats-pools/stats-pools-editor

- 3: StatsPoolsEditor.view.jsx:1342 — `rounded-2xl` (16px), resolves to `--radius-md`
- 6: StatsPoolsEditor.view.jsx:235-243 — "Remove definition" button, identical geometry to move-up/down siblings, no confirm step
- 6: StatsPoolsEditor.view.jsx:418-426 — "Remove formula operand" button, same icon geometry, no confirm step

## components/studio/create/stats-pools/stats-pools-json-editor

- 3: StatsPoolsJsonEditorModal.view.jsx:87 — `rounded-2xl` (16px) modal panel, resolves to `--radius-md`

## components/studio/create/structured-registry/registry-linked-creation-picker

- 3: RegistryLinkedCreationPickerModal.view.jsx:19,82 — `rounded-2xl` (16px) modal panel/choice button, resolves to `--radius-md`

## components/studio/create/structured-registry/structured-registry-builder

- 1: StructuredRegistryBuilder.view.jsx:119 — tab-switch button rendered `rounded-full`
- 3: StructuredRegistryBuilder.view.jsx:60,201,519,564,616,675,795,814 — `rounded-2xl` (16px) on multiple panels/cards, resolves to `--radius-md`
- 6: StructuredRegistryBuilder.view.jsx:461-468 — "Delete Entry" button filled `bg-red-500/10` (unlike sibling ghost/outline buttons), same geometry as other action buttons; no confirm step
- 6: StructuredRegistryBuilder.view.jsx:636-638 — "Remove linked creation" icon button, no confirm step

## components/studio/create/wardrobe/outfit-picker

- 3: OutfitPickerModal.view.jsx:22,83 — `rounded-2xl` (16px) modal panel/choice button, resolves to `--radius-md`

## components/studio/create/wardrobe/wardrobe-builder

- 1: WardrobeBuilder.view.jsx:116 — tab-switch button rendered `rounded-full`
- 3: WardrobeBuilder.view.jsx:66,175,348 — `rounded-2xl` (16px) on multiple panels/empty state, resolves to `--radius-md`
- 6: WardrobeBuilder.view.jsx:470-477 — "Delete Entry" button filled `bg-red-500/10`, same geometry as other action buttons; no confirm step

## components/studio/creations

- 3: CreationPreviewModal.jsx:16 — `PANEL_CLASS_NAME` `rounded-2xl` (16px) modal panel, resolves to `--radius-md`

## components/studio/creations/creation-card

- 4: CreationCard.view.jsx:84 — `bg-gradient-to-t from-black via-black/20 to-transparent` veil over card artwork; `CreationStatusBadgesView` sits on top with its own separate dark bed
- 5: CreationCard.view.jsx:105,121,148,167,178,188 — `backdrop-blur` paired with `bg-black/65` on like/bookmark/set-PC/start-chat/generate/edit icon buttons over artwork, not a floating panel
- 5: CreationCard.view.jsx:257,263 — `backdrop-blur` on inline error/status toast over artwork, not a floating panel

## components/studio/creations/creation-credits

- 3: CreationCredits.view.jsx:7 — `rounded-2xl` (16px) wallet/credits container, off-scale

## components/studio/creations/creation-preview-modal

- 3: CreationPreviewModal.view.jsx:244,256 — `rounded-2xl` (16px) media frame/"want to see more" card, resolves to `--radius-md`
- 4: CreationPreviewModal.view.jsx:249 — `linear-gradient(rgba(0,0,0,.35)→rgba(0,0,0,.86))` veil over background image
- 4: CreationPreviewModal.view.jsx:254 — second stacked overlay `bg-black/25` directly atop the gradient veil at :249, over the same artwork
- 4: CreationPreviewModal.view.jsx:256 — CTA card (`bg-black/65`) sits atop the stacked overlays with its own separate dark bed
- 5: CreationPreviewModal.view.jsx:256 — `backdrop-blur-md` (~12px) on the CTA card, not a floating panel, wrong strength
- 5: CreationPreviewModal.view.jsx:297,306 — `backdrop-blur` on prev/next nav-arrow icon buttons over artwork, not a panel
- 5: CreationPreviewModal.view.jsx:312 — `backdrop-blur` on media-indicator dot pill over artwork, not a panel

## components/studio/creations/creation-profile-page

- 1: CreationProfilePage.view.jsx:163,230-243 — media-tab `FilterButton` rendered `rounded-full`
- 3: CreationProfilePage.view.jsx:60,189,249,268 — `rounded-2xl` (16px) header/empty state/media tiles, resolves to `--radius-md`

## components/studio/creations/creation-share-button

- 1: CreationShareButton.view.jsx:20 — compact share button rendered `rounded-full` (share recipe is `.btn--ghost.btn--sm`, `--radius-md`)

## components/studio/creations/creation-tag-filter-row

- 1: CreationTagFilterRow.view.jsx:29-42 — tag/filter buttons (`aria-pressed`) rendered `rounded-full`; these are filter chips (controls), must be `--radius-md`

## components/studio/creations/pickers/creation-picker-panel

- 3: CreationPickerPanel.view.jsx:79 — `rounded-2xl` (16px) empty-state content surface, resolves to `--radius-md`
- 4: CreationPickerPanel.view.jsx:104-110 — artwork thumbnail with `opacity-90` over `bg-gradient-to-br from-black via-black/80 to-[var(--muted-gold)]/10` placeholder bed; no separate tag bed

## components/studio/games/games-hub

- 1: GamesHub.view.jsx:426 — Play/Continue button uses `rounded-full`
- 3: GamesHub.view.jsx:31 — `rounded-lg` (8px) view-mode toggle button, off-scale for a control
- 3: GamesHub.view.jsx:85,131,179,185,191,251,276,361,534,666 — `rounded-2xl` (16px) on multiple panels/banners/lists, resolves to `--radius-md`

## components/studio/image-studio

- 1: FilterPill.jsx:9 — filter-toggle button uses `rounded-full`

## components/studio/image-studio/custom-ingredient-editor

- 3: CustomIngredientEditor.view.jsx:18 — `rounded-2xl` (16px) content surface, resolves to `--radius-md`
- 3: CustomIngredientEditor.view.jsx:36 — `rounded-lg` (8px) close icon-button, off-tier

## components/studio/image-studio/image-studio-composer

- 3: ImageStudioComposer.view.jsx:49,161 — `rounded-2xl` (16px) aside panel/options div, resolves to `--radius-md`

## components/studio/image-studio/image-studio-workbench

- 3: ImageStudioWorkbench.view.jsx:47 — `rounded-2xl` (16px) mobile composer trigger bar, resolves to `--radius-md`
- 5: ImageStudioWorkbench.view.jsx:47 — `backdrop-blur-md` (12px) paired with `bg-black/95`, not the ruled 2px/.70 pairing
- 5: ImageStudioWorkbench.view.jsx:81 — `backdrop-blur-sm` (4px) paired with `bg-black/55`, not the ruled pairing
- 3: ImageStudioWorkbench.view.jsx:84 — `rounded-t-3xl` (24px) mobile sheet, resolves to `--radius-lg` (20px)
- 5: ImageStudioWorkbench.view.jsx:84 — `backdrop-blur-md` (12px) paired with `bg-black/95`, not the ruled pairing

## components/studio/image-studio/ingredient-picker

- 3: IngredientPickerModal.view.jsx:45 — `rounded-2xl` (16px) modal panel, resolves to `--radius-md`
- 3: IngredientPickerModal.view.jsx:68 — `rounded-lg` (8px) close icon-button, off-tier
- 3: IngredientPickerModal.view.jsx:102,122 — `rounded-2xl` (16px) action cards, resolves to `--radius-md`

## components/studio/image-studio/ingredient-slot

- 3: IngredientSlot.view.jsx:24 — `rounded-2xl` (16px) main button, resolves to `--radius-md`
- 6: IngredientSlot.view.jsx:56-66 — "Clear ingredient": compact circular icon-button (`rounded-full`, `p-1.5`), distinct geometry from slot button, no confirm step

## components/studio/image-studio/media-history-grid

- 3: MediaHistoryGrid.view.jsx:150,156,233,284,296 — `rounded-2xl` (16px) on banners/toolbar/placeholders, resolves to `--radius-md`
- 5: MediaHistoryGrid.view.jsx:233 — `backdrop-blur-md` (12px) paired with `color-mix(canvas 88%, transparent)`, not a modal/sheet/picker panel
- 6: MediaHistoryGrid.view.jsx:264-278 — "Delete Selected" button filled `--status-danger-bed`/`-border` and `--status-danger` text (not quiet ghost per Destructive ruling), ordinary geometry; no confirm step
- 4: MediaHistoryGrid.view.jsx:447-451 — check badge (`bg-black/70`, `border-white/30`) sits atop artwork thumbnail with its own dark bed (~.70, matches tag-bed-art tier)

## components/studio/image-studio/save-ingredient-preset

- 3: SaveIngredientPresetModal.view.jsx:28 — `rounded-2xl` (16px) modal frame, resolves to `--radius-md`
- 3: SaveIngredientPresetModal.view.jsx:48 — `rounded-lg` (8px) close icon-button, off-tier

## components/studio/image-studio/video-tools-panel

- 3: VideoToolsPanel.view.jsx:23 — `rounded-2xl` (16px) preview-notice surface, resolves to `--radius-md`

## components/studio/media/media-lightbox

- 3: MediaLightbox.view.jsx:161,342,364,371,388,394,412,442 — `rounded-2xl` (16px) on multiple panels/dialogs, resolves to `--radius-md`
- 4: MediaLightbox.view.jsx:50 — `bg-black/95` full-screen wash behind lightbox content
- 5: MediaLightbox.view.jsx:50 — `backdrop-blur-md` (12px) paired with `bg-black/95`, not the ruled pairing
- 5: MediaLightbox.view.jsx:341 — `backdrop-blur-sm` (4px) paired with `bg-black/70` on DetailsDialog scrim
- 5: MediaLightbox.view.jsx:441 — `backdrop-blur-sm` (4px) paired with `bg-black/70` on ReportDialog scrim
- 6: MediaLightbox.view.jsx:202-211 — Delete Image button same size/padding/radius as siblings but filled `bg-red-500/10 border-red-500/25` (not quiet/ghost); confirm step exists via `window.confirm` in useMediaLightboxViewModel.js:213

## components/studio/media/media-tile-quick-actions

- 3: MediaTileQuickActions.view.jsx:21 — `rounded-lg` (8px) icon-button controls, off-tier
- 5: MediaTileQuickActions.view.jsx:21 — `backdrop-blur` (8px) on tile-art quick-action buttons over artwork, blur outside floating-panel context

## components/studio/my-creations

- 3: CreationReferenceImagePickerModal.jsx:65,108,120,151 — `rounded-2xl` (16px) modal frame/loading/empty/select-card, resolves to `--radius-md`
- 4: CreationReferenceImagePickerModal.jsx:64 — `bg-black/80` full-screen wash behind modal
- 5: CreationReferenceImagePickerModal.jsx:64 — `backdrop-blur-md` (12px) paired with `bg-black/80`, not the ruled pairing

## components/studio/my-creations/creation-edit-media-panel

- 3: CreationEditMediaPanel.view.jsx:20,21,97,101,129 — `rounded-2xl` (16px) on sidebar/featured-media/section boxes/avatar bed, resolves to `--radius-md`

## components/studio/my-creations/creation-edit-shell

- 1: CreationEditShell.view.jsx:75 — section-nav buttons use `rounded-full` pill
- 3: CreationEditShell.view.jsx:31,89 — `rounded-2xl` (16px) header/section-content surface, resolves to `--radius-md`
- 3: CreationEditMechanicsRuntimeQuickNav.jsx:149 — `rounded-2xl` (16px) quick-nav panel, resolves to `--radius-md`

## components/studio/my-creations/edit/creation-edit-sticky-action-bar

- 5: CreationEditStickyActionBar.view.jsx:50 — `backdrop-blur-[12px]` paired with `--surface-4` fill, not the ruled single 2px/.70 pairing

## components/studio/my-creations/edit/hooks

- 6: useCreationEditViewModel.js:355-360 — `handleDelete` uses `window.confirm(...)` as its confirm step before calling `deleteCreation` (logic-only file, no geometry)

## components/studio/my-creations/edit/sections

- 3: SharedFields.jsx:17,74 — `rounded-2xl` (16px) content-surface panel, resolves to `--radius-md`
- 3: SharedFields.jsx:82 — `rounded-xl` (12px literal, not token) button; matches `--radius-md` value but not token-expressed
- 3: MediaSection.jsx:17 — `rounded-2xl` (16px) empty-state surface, resolves to `--radius-md`
- 4: MediaSection.jsx:17 — `bg-black/25` dark wash on dropzone container (no artwork or tag present)
- 3: CharacterBehaviorSection.view.jsx:44 — `rounded-2xl` (16px) content-surface panel, resolves to `--radius-md`
- 3: CharacterTemplateFieldsSection.view.jsx:204 — `rounded-2xl` (16px) content-surface panel, resolves to `--radius-md`

## components/studio/my-creations/edit/sections/character-appearance-section

- 3: CharacterAppearanceSection.view.jsx:21 — `rounded-2xl` (16px) content-surface panel, resolves to `--radius-md`
- 3: CharacterAppearanceSection.view.jsx:25 — 96×96px nested clothing-art thumbnail uses `rounded-xl` (12px literal); candidate for the small-nested-art-thumbnail exception (`--radius-sm`/8px), currently neither token
- 3: CharacterAppearanceSection.view.jsx:51 — delete/clear button uses `rounded-lg` (8px), off-tier for a control
- 4: CharacterAppearanceSection.view.jsx:21 — `bg-black/35` dark wash behind clothing thumbnail + text, no separate tag bed
- 6: CharacterAppearanceSection.view.jsx:48-55 — "Clear default clothing": icon-only (X), `rounded-lg`/`p-2` square geometry distinct from neighboring pill-padded action buttons, raw `red-500`/`red-200` color; no confirm step

## components/studio/my-creations/edit/sections/creation-danger-section

- 3: CreationDangerSection.view.jsx:42,53,88 — `rounded-2xl` (16px) canon-notice/Archive/Delete panels, resolves to `--radius-md`
- 6: CreationDangerSection.view.jsx:66-73 — Archive button: ordinary geometry, filled red (`bg-red-500/10`+`border-red-400/30`+`text-red-200`, raw, not `--status-danger`); no confirm step, fires directly
- 6: CreationDangerSection.view.jsx:107-114 — Delete Creation button: ordinary geometry, filled red (`bg-red-500/15`+`border-red-400/40`+`text-red-100`); no confirm step, dialog, `window.confirm`, or "are you sure" copy — fires directly

## components/studio/my-creations/edit/sections/creation-publishing-section

- 3: CreationPublishingSection.view.jsx:68 — `rounded-2xl` (16px) Template Management panel, resolves to `--radius-md`

## components/studio/my-creations/edit/sections/item-registries/item-registry-fields-section

- 3: ItemRegistryFieldsSection.view.jsx:209,218,240,290,416,456,476 — `rounded-2xl` (16px) on multiple panel containers, resolves to `--radius-md`
- 6: ItemRegistryFieldsSection.view.jsx:577-584 — "Delete Entry" button: ordinary geometry, filled red (`bg-red-500/10`+`border-red-500/25`+`text-red-200`); no confirm step, fires directly

## components/studio/my-creations/edit/sections/locations

- 3: TrackersModuleConfigModal.jsx:897,1126,1345,1541,1725 — `rounded-2xl` (16px) modal panel/nested sections, resolves to `--radius-md`
- 4: TrackersModuleConfigModal.jsx:896 — modal scrim `bg-black/80` (.80, not `--scrim-strong`'s .70); no backdrop-filter/blur paired despite being a floating panel scrim
- 6: TrackersModuleConfigModal.jsx:989-995,1140-1144,1285-1286,1369-1370,1523-1524,1555-1559,1716-1717, and IconButton (1877-1886) — all remove/clear controls ghost-style, geometry matches ordinary buttons/icon-buttons of the same size; none has a confirm step — "Clear" in particular removes all trackers/guards in one click with no confirmation

## components/studio/my-creations/edit/sections/locations/location-identity-section

- 3: LocationIdentitySection.view.jsx:93,130 — `rounded-2xl` (16px) parent-location/inheritance panels, resolves to `--radius-md`

## components/studio/my-creations/edit/sections/locations/location-registry-attachments-section

- 3: LocationRegistryAttachmentsSection.view.jsx:27,78 — `rounded-2xl` (16px) group/attachment-card containers, resolves to `--radius-md`
- 6: LocationRegistryAttachmentsSection.view.jsx:102-109 — "Remove attached registry" icon button uses `rounded-lg` (8px), distinct from section's other buttons (`rounded-xl`, 12px); ghost/text-only red on hover; no confirm step

## components/studio/my-creations/edit/sections/locations/location-runtime-modules-section

- 3: LocationRuntimeModulesSection.view.jsx:7,71,142 — `rounded-2xl` (16px) SlotFallback/weather/time panel containers, resolves to `--radius-md`

## components/studio/my-creations/edit/sections/locations/location-scene-atmosphere-section

- 3: LocationSceneAtmosphereSection.view.jsx:93 — `rounded-2xl` (16px) sensory-environment fallback slot, resolves to `--radius-md`

## components/studio/my-creations/edit/sections/locations/location-sensory-environment-fields

- 3: LocationSensoryEnvironmentFields.view.jsx:39 — `rounded-2xl` (16px) `SenseCard` container (used 3×), resolves to `--radius-md`
- 6: LocationSensoryEnvironmentFields.view.jsx:112-119,317-324 — remove scent tag/note, both ghost-style, geometry matches sibling controls; no confirm step

## components/studio/my-creations/edit/sections/locations/weather-module-config-modal

- 3: WeatherModuleConfigModal.view.jsx:54,63,278,400 — `rounded-2xl` (16px) modal panel/nested sections, resolves to `--radius-md`
- 4: WeatherModuleConfigModal.view.jsx:53,62 — modal scrim `bg-black/80` (.80, not `--scrim-strong`'s .70); no backdrop-filter/blur paired
- 6: WeatherModuleConfigModal.view.jsx:297-304 — "Remove [condition]" button ghost-style, geometry matches sibling "Set Current" button; no confirm step

## components/studio/my-creations/edit/sections/mechanics-modules

- 3: RuntimeMechanicsModulesSection.jsx:181 — `rounded-2xl` (16px) module-binding container, resolves to `--radius-md`
- 6: RuntimeMechanicsModulesSection.jsx:272-280 — "Remove mechanics module" button: ordinary geometry, filled red (`bg-red-500/10`+`border-red-300/20`+`text-red-200`); no confirm step

## components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-core

- 6: MechanicsCommandCore.view.jsx:107-118,134-141 — "Remove command" (`SmallActionButton variant="danger"`): geometry identical to non-danger variant; filled red (`bg-red-500/10`+raw `border-red-300/20`+`text-red-200`, not `--status-danger`); no confirm step
- 6: MechanicsCommandCore.view.jsx:290-299 — "Remove argument": `rounded-lg p-2` icon-only, differs from file's ordinary `rounded-xl` buttons; filled red; no confirm step

## components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-effects

- 6: MechanicsCommandEffectCard.view.jsx:332-334 — "Remove effect": `rounded-lg p-2` icon-only, differs from file's ordinary `rounded-xl` inputs/buttons; filled red (`bg-red-500/10`+`border-red-300/20`+`text-red-200`); no confirm step

## components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-requirements

- 6: MechanicsCommandRequirements.view.jsx:129-141 — "Remove requirement": `rounded-lg p-2` icon-only, differs from file's ordinary `rounded-xl` controls; filled red (`bg-red-500/10`); no confirm step

## components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-resolution

- 6: MechanicsCommandResolution.view.jsx:80-94,160-172 — "Remove fixed modifier"/"Remove authoritative modifier source": `rounded-lg p-2` icon-only, differs from file's ordinary `rounded-xl` controls; filled red (`bg-red-500/10`); no confirm step (pattern repeats at each modifier/source remove button)

## components/studio/my-creations/edit/sections/mechanics-modules/mechanics-compatibility-baseline

- 3: MechanicsCompatibilityBaseline.view.jsx:16,33,45,62,66 — `rounded-2xl` (16px) on multiple panel containers, resolves to `--radius-md`

## components/studio/my-creations/edit/sections/mechanics-modules/mechanics-composition-builder

- 3: MechanicsCompositionBuilder.view.jsx:694,1051,1199,1292,1361 — `rounded-2xl` (16px) on step-cards/sections/divs, resolves to `--radius-md`
- 6: MechanicsCompositionBuilder.view.jsx:148-150 — "Remove step": icon-only, `rounded-lg border-red-300/20 bg-red-500/10 p-2 text-red-200` (raw, not `--status-danger`), same size as sibling move-up/down but with own red fill; no confirm step
- 6: MechanicsCompositionBuilder.view.jsx:234-236 — "Remove condition": same red-fill pattern, no confirm step
- 6: MechanicsCompositionBuilder.view.jsx:568-570 — "Remove effect": same red-fill pattern, no confirm step

## components/studio/my-creations/edit/sections/mechanics-modules/mechanics-core

- 3: MechanicsDocumentCore.view.jsx:5,28,62,90 — `rounded-2xl` (16px) on divs/aside, resolves to `--radius-md`

## components/studio/my-creations/edit/sections/mechanics-modules/mechanics-defaults

- 3: MechanicsDefaults.view.jsx:157 — `rounded-2xl` (16px) section, resolves to `--radius-md`
- 6: MechanicsDefaults.view.jsx:73-75 — "Remove {bucket}": icon-only, `rounded-lg border-red-300/20 bg-red-500/10 p-2 text-red-200`, own red fill; no confirm step

## components/studio/my-creations/edit/sections/mechanics-modules/mechanics-guards

- 3: MechanicsGuards.view.jsx:148,381 — `rounded-2xl` (16px) article/section, resolves to `--radius-md`
- 6: MechanicsGuards.view.jsx:64-66 — "Remove condition": icon-only, red border+fill (raw), no confirm step
- 6: MechanicsGuards.view.jsx:178-180 — "Remove guard": same red-fill pattern, no confirm step

## components/studio/my-creations/edit/sections/mechanics-modules/mechanics-json-editor

- 3: MechanicsJsonEditorModal.view.jsx:98 — `rounded-2xl` (16px) modal panelClassName, resolves down to `--radius-md` despite modal/large-container context

## components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly

- 3: MechanicsModuleAssembly.jsx:91 — `rounded-2xl` (16px) card, resolves to `--radius-md`
- 3: MechanicsModuleAssembly.view.jsx:51,113,170,383 — `rounded-2xl` (16px) foldable section/item/commands section/note box, resolves to `--radius-md`
- 6: MechanicsModuleAssembly.view.jsx:140-147 — Remove/delete control (Trash2, `onRemove`): own shape/color (`rounded-lg`, red-300/red-500 bg/border), distinct from standard `MechanicsAssemblyActionButton` (gold, `rounded-xl`); no confirm step, fires `onRemove()` directly

## components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-picker

- 5: MechanicsModulePickerModal.view.jsx:134 — `backdrop-blur-[2px]` paired with `bg-[var(--scrim-strong)]` (.70) — matches ruled law, logged for completeness

## components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-application

- 3: MechanicsPresetApplicationModal.view.jsx:652 — `rounded-2xl` (16px) empty-state placeholder box, resolves to `--radius-md`
- 5: MechanicsPresetApplicationModal.view.jsx:240 — `backdrop-blur-[2px]` paired with `bg-[var(--scrim-strong)]` (.70) — matches ruled law, logged for completeness

## components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-validation

- 3: MechanicsPresetValidationPanel.view.jsx:25 — `rounded-2xl` (16px) panel wrapper, resolves to `--radius-md`

## components/studio/my-creations/edit/sections/mechanics-modules/mechanics-progression-profile

- 3: MechanicsProgressionProfileFields.view.jsx:254 — `rounded-2xl` (16px) override-list container, resolves to `--radius-md`
- 6: MechanicsProgressionProfileFields.view.jsx:65-77 — `SmallButton` ("Remove derived value"/"Remove override N"): identical geometry between danger/default variants but danger variant fills `bg-red-500/10`; no confirm step

## components/studio/my-creations/edit/sections/mechanics-modules/mechanics-status-blocks

- 3: MechanicsStatusBlocks.view.jsx:65,250 — `rounded-2xl` (16px) status-block article/section container, resolves to `--radius-md`
- 6: MechanicsStatusBlocks.view.jsx:93-97 — "Remove status block": icon-only square button, `rounded-lg` (8px, `p-2`), different geometry from file's text-label buttons; no confirm step
- 6: MechanicsStatusBlocks.view.jsx:216-220 — "Remove line": same geometry mismatch; no confirm step

## components/studio/my-creations/edit/sections/mechanics-modules/mechanics-trackers

- 3: MechanicsTrackersSection.view.jsx:58,443 — `rounded-2xl` (16px) tracker card/section container, resolves to `--radius-md`
- 6: MechanicsTrackersSection.view.jsx:82-86 — "Remove tracker": icon-only square button, `rounded-lg` (8px, `p-2`), different geometry than file's `rounded-xl` text-label buttons; no confirm step
- 6: MechanicsTrackersSection.view.jsx:105-109 — "Remove phase": same geometry mismatch; no confirm step
- 6: MechanicsTrackersSection.view.jsx:178-182 — "Remove mutation hint": same geometry mismatch; no confirm step

## components/studio/my-creations/edit/sections/npc-registries/npc-registry-fields-section

- 3: NpcRegistryFieldsSection.view.jsx:114,180 — `rounded-2xl` (16px) `RegistryCard`/`EmptyPanel` container, resolves to `--radius-md`
- 6: NpcRegistryFieldsSection.view.jsx:165-176 — `SmallDangerAction` delete control: icon-only (Trash2), `rounded-lg` (8px) geometry distinct from `PrimaryAction`'s `rounded-xl` (12px) shape; no confirm step before `onDelete` fires

## components/studio/my-creations/edit/sections/outfits/outfit-prompt-guidance-section

- 3: OutfitPromptGuidanceSection.view.jsx:63,98 — `rounded-2xl` (16px) clothing-mode option tile/info box, resolves to `--radius-md`

## components/studio/my-creations/edit/sections/room-templates/room-template-multiplayer-section

- 5: RoomTemplateMultiplayerSection.view.jsx:189 — `backdrop-blur-[2px]` paired with `bg-[var(--scrim-strong)]` on picker modal veil — matches ruled law, logged for completeness
- 6: RoomTemplateMultiplayerSection.view.jsx:121-128 — remove-invited-player control: icon-only (X, size 14) inside `rounded-lg` (8px, off-token) square button, no visible word beside icon, no confirm step; hover color uses `--status-danger` token

## components/studio/my-creations/edit/sections/room-templates/room-template-opening-section

- 3: RoomTemplateOpeningSection.view.jsx:49 — `rounded-2xl` (16px) opening-message card, resolves to `--radius-md`
- 6: RoomTemplateOpeningSection.view.jsx:56-64 — remove-message button: compact custom ghost chip (`rounded-lg`, `px-2 py-1`, text 10px), not identical geometry to a standard button of any defined size; hover raw `text-red-200`; no confirm step

## components/studio/my-creations/edit/sections/room-templates/story-narrative-runtime-section

- 3: StoryNarrativeRuntimeSection.view.jsx:122 — `rounded-2xl` (16px) phase `<details>` panel, resolves to `--radius-md`

## components/studio/my-creations/edit/sections/scenarios/scenario-cast-requirements-section

- 6: ScenarioCastRequirementsSection.view.jsx:107-114 — Remove-reference control (`SelectedReferenceChip`): icon-only (X, size 14), `rounded-lg` (8px) square button, no visible word beside icon (aria-label only); no confirm step

## components/studio/my-creations/edit/sections/scenarios/scenario-middleware-section

- 3: ScenarioMiddlewareSection.view.jsx:45 — `rounded-2xl` (16px) module toggle button, resolves to `--radius-md`

## components/studio/my-creations/edit/sections/scenarios/scenario-story-circle-section

- 3: ScenarioStoryCircleSection.view.jsx:24 — `rounded-2xl` (16px) step card, resolves to `--radius-md`

## components/studio/my-creations/edit/sections/storylines/storyline-fields-section

- 3: StorylineFieldsSection.view.jsx:21 — `rounded-2xl` (16px) empty-state placeholder, resolves to `--radius-md`

## components/studio/my-creations/edit/sections/visual-references-section

- 3: VisualReferencesSection.view.jsx:5 — `rounded-2xl` (16px) `ReferenceCard` container, resolves to `--radius-md`
- 6: VisualReferencesSection.view.jsx:17-25 — `onClear` button removing a reference image: icon-only, no visible word (aria-label only), raw `bg-red-500/10` fill (not `--status-danger`); no confirm step

## components/studio/my-creations/edit/sections/wardrobes/wardrobe-fields-section

- 3: WardrobeFieldsSection.view.jsx:180,187 — `rounded-2xl` (16px) entry-editor panel/empty-state placeholder, resolves to `--radius-md`
- 6: WardrobeFieldsSection.view.jsx:304-311 — Delete Entry button: icon (Trash2) + word present, but filled `bg-red-500/10 border-red-500/25` (raw, not `--status-danger`; filled rather than quiet ghost); no confirm step before `onDelete` fires

## components/studio/my-creations/image-library/creation-featured-image-picker

- 3: CreationFeaturedImagePickerModal.view.jsx:25,92,113 — `rounded-2xl` (16px) modal frame/loading-no-images panel/image tile, resolves to `--radius-md`
- 5: CreationFeaturedImagePickerModal.view.jsx:24 — `backdrop-blur-md` (12px, Tailwind default) paired with `bg-black/80` (raw .80, not `--scrim-strong`); exceeds the one-blur-strength law

## components/studio/my-creations/image-library/creation-image-library-page

- 3: CreationImageLibraryPage.view.jsx:191,524 — `rounded-2xl` (16px) "no matching images"/`EmptyLibraryState` panels, resolves to `--radius-md`
- 6: CreationImageLibraryPage.view.jsx:495-507 — `DeleteButton` ("Delete Image", Trash2+word): same geometry as sibling Hide/Show buttons, but filled with `--status-danger-bed` rather than quiet ghost text-only per Destructive ruling; confirm step exists via `window.confirm` in useCreationImageLibraryPageViewModel.js:329-332

## components/studio/my-creations/image-library/creation-reference-image-picker

- 3: CreationReferenceImagePickerModal.view.jsx:22,65,77,97 — `rounded-2xl` (16px) modal frame/loading/empty/image tile, resolves to `--radius-md`
- 5: CreationReferenceImagePickerModal.view.jsx:21 — `backdrop-blur-md` (12px) paired with `bg-black/80` (raw, not `--scrim-strong`); exceeds the one-blur-strength law

## components/studio/my-creations/my-creations-hub

- 1: MyCreationsHub.view.jsx:106-118 — tab-filter buttons rendered `rounded-full`; per the filter-chip family these are controls and should be `--radius-md`
- 3: MyCreationsHub.view.jsx:145 — `rounded-2xl` (16px) "no creations" empty-state panel, resolves to `--radius-md`

## components/studio/official-characters-grid

- 3: OfficialCharactersGrid.view.jsx:29,63 — `rounded-2xl` (16px) search/header panel/empty-state panel, resolves to `--radius-md`

## components/studio/profile/profile-banner

- 3: ProfileBanner.view.jsx:8 — `rounded-2xl` (16px) banner container, resolves to `--radius-md`

## components/studio/profile/profile-media-manager

- 3: ProfileMediaManager.view.jsx:29 — `rounded-2xl` (16px) section wrapper, resolves to `--radius-md`

## components/studio/profile/public-profile-activity-feed

- 3: PublicProfileActivityFeed.view.jsx:17,50,106 — `rounded-2xl` (16px) empty state/creation row/donation row, resolves to `--radius-md`

## components/studio/profile/public-profile-badges

- 3: PublicProfileBadges.view.jsx:13,14,30,34 — `rounded-2xl` (16px) empty-state box/icon container/badge card/image frame, resolves to `--radius-md`

## components/studio/profile/public-profile-creation-grid

- 3: PublicProfileCreationGrid.view.jsx:21 — `rounded-2xl` (16px) empty state, resolves to `--radius-md`

## components/studio/profile/public-profile-donate-button

- 3: PublicProfileDonateButton.view.jsx:45 — `rounded-2xl` (16px) modal dialog `<section>`; per Corners ruling resolves UP to `--radius-lg` (20px) as a modal/large panel
- 5: PublicProfileDonateButton.view.jsx:44 — `backdrop-blur-sm` (4px) paired with `bg-black/70` on the fixed modal veil

## components/studio/profile/public-profile-hero

- 3: PublicProfileHero.view.jsx:17 — `rounded-3xl` (24px) hero section, off-scale, no defined tier; nearest `--radius-lg` (20px)
- 3: PublicProfileHero.view.jsx:31 — `rounded-2xl` (16px) banner-placeholder box, resolves to `--radius-md`
- 3: PublicProfileHero.view.jsx:77 — `rounded-2xl` (16px) stat card, resolves to `--radius-md`
- 4: PublicProfileHero.view.jsx:19-27 — `linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.86))` over `bannerUrl` artwork; opacity ramps to .86
- 4: PublicProfileHero.view.jsx:42 — second stacked overlay `bg-gradient-to-t from-black via-black/35 to-transparent` over the same artwork (double veil); stat chips (own `bg-black/45` bed) and avatar/name/handle sit atop both veils
- 5: PublicProfileHero.view.jsx:31 — `backdrop-blur` (default, 8px) paired with `bg-black/30`
- 5: PublicProfileHero.view.jsx:77 — `backdrop-blur` (default, 8px) paired with `bg-black/45`
- 7: PublicProfileHero.view.jsx (page-head hero) — classifies as (c) top banner; veil is two stacked black gradients rather than a single fade-from-bottom; primary copy is bottom-left but a stats block occupies bottom-right, outside the taxonomy's single bottom-left anchor

## components/studio/profile/public-profile-tabs

- 1: PublicProfileTabs.view.jsx:18,25 — segmented tab buttons (`onClick`, `aria-pressed`) rendered `rounded-full`

## components/studio/registries/item-starting-assignment-editor

- 6: ItemStartingAssignmentEditor.view.jsx:191-198 — "Delete placement level" trash-icon button, same `rounded-lg p-2` geometry as sibling move-up/down icon buttons, hover text `red-200` (not `--status-danger`); `onDeletePlacementStep` fires immediately, no confirm dialog/window.confirm/are-you-sure step
- 6: ItemStartingAssignmentEditor.view.jsx:102-109 — "Clear" button removes the holder-creation link with no confirm step

## components/studio/room-templates

- 3: BuilderSection.jsx:3 — `rounded-2xl` (16px) section wrapper, resolves to `--radius-md`

## components/studio/room-templates/invited-players-panel

- 3: InvitedPlayersPanel.view.jsx:15 — `rounded-2xl` (16px) outer panel container, resolves to `--radius-md`
- 6: InvitedPlayersPanel.view.jsx:68-75 — remove-player control: icon-only (X, no text label), `rounded-lg` (8px) geometry differing from panel's other button (`rounded-xl`/12px "Add Player"); no confirm step

## components/studio/room-templates/opening-message-card

- 3: OpeningMessageCard.view.jsx:15 — `rounded-2xl` (16px) card content surface, resolves to `--radius-md`
- 6: OpeningMessageCard.view.jsx:21-28 — "Remove" control: quiet/ghost geometry (border only, no fill) with text label present, `rounded-lg` (8px) differing from standard control radius; no confirm step (`onRemoveMessage` fires directly)

## components/studio/room-templates/room-template-picker

- 3: RoomTemplatePickerModal.view.jsx:30 — `rounded-2xl` (16px) modal panel; **RESOLVED** by the amended Corners ruling (RESTYLE-RULES.md, Open question 1) — this is a floating modal, so it resolves UP to `--radius-lg` (20px) regardless of footprint, not down to `--radius-md`. The two conflicting audit-pass readings previously recorded here are superseded by that resolution.

## components/studio/room-templates/room-template-summary

- 3: RoomTemplateSummary.view.jsx:8 — `rounded-2xl` (16px) summary card content surface, resolves to `--radius-md`

## components/studio/room-templates/scenario-recommendations-panel

- 3: ScenarioRecommendationsPanel.view.jsx:21 — `rounded-2xl` (16px) panel content surface, resolves to `--radius-md`

## components/studio/room-templates/selected-characters-panel

- 3: SelectedCharactersPanel.view.jsx:14 — `rounded-2xl` (16px) panel, resolves to `--radius-md`
- 6: SelectedCharactersPanel.view.jsx:55-62 — remove-character (X) button, no confirm step

## components/studio/room-templates/selection-card

- 1: SelectionCard.view.jsx:12-16 — card root is a `<button type="button">` rendered `rounded-2xl` (16px) — an off-scale-radius button, not a pill-shape violation
- 3: SelectionCard.view.jsx:15 — `rounded-2xl` (16px) button, resolves to `--radius-md` (control tier)

## components/studio/story-rooms

- 3: StoryRoomMobileToolbar.jsx:9 — `rounded-2xl` (16px) toolbar, resolves to `--radius-md`

## components/studio/story-rooms/story-room-cast-panel

- 3: StoryRoomCastPanel.view.jsx:47 — `rounded-2xl` (16px) `<aside>` panel, off-scale; **RESOLVED** by the amended Corners ruling (RESTYLE-RULES.md, Open question 1) — this sidebar is floating panel chrome (a docked/overlay surface, not a grid sibling), so it resolves to `--radius-lg` (20px).
- 3: StoryRoomCastPanel.view.jsx:66 — `rounded-2xl` (16px) featured-image frame, resolves to `--radius-md` (not a small nested thumbnail, doesn't qualify for the 8px exception)
- 4: StoryRoomCastPanel.view.jsx:75 — `bg-gradient-to-t from-black via-black/55 to-transparent` overlay on featured speaker image; no tag/badge sits on it, only text
- 6: StoryRoomCastPanel.view.jsx:184-196 — "Delete Story" button is filled solid `bg-[var(--status-danger)]`/`text-[var(--ink)]`, differing in shape treatment (solid fill vs. bordered/ghost) from every sibling action button of the same size; confirm step exists via `window.confirm(STORY_ROOM_DELETE_CONFIRMATION)` wired in useStoryRoomChatShellViewModel.js `handleDeleteRoom`, invoked from StoryRoomChatShell.jsx

## components/studio/story-rooms/story-room-chat-shell

- 3: StoryRoomChatShell.view.jsx:58 — `rounded-2xl` (16px) main chat shell, resolves to `--radius-md`
- 3: StoryRoomChatShell.view.jsx:145 — `rounded-2xl` (16px) `role="dialog"` help modal, resolves UP to `--radius-lg` (20px) as a modal
- 3: StoryRoomChatShell.view.jsx:305 — `rounded-2xl` (16px) icon-only panel-reveal button, off-scale; should become `--radius-full` (icon button) or `--radius-md`
- 5: StoryRoomChatShell.view.jsx:140 — `backdrop-blur-sm` (4px) paired with `bg-black/75` on the composer-help modal veil

## components/studio/story-rooms/story-room-composer

- 1: StoryRoomComposer.view.jsx:733 — non-participant speaker button (Auto/Random, icon+text label, `onClick`/`aria-pressed`) rendered `rounded-full`
- 3: StoryRoomComposer.view.jsx:325 — `rounded-2xl` (16px) mobile composer surface, resolves to `--radius-md`
- 3: StoryRoomComposer.view.jsx:779 — `rounded-2xl` (16px) `MobileToolsDrawer` (docked sheet/drawer), resolves UP to `--radius-lg` (20px) per Ruling 1's docked-frame treatment
- 5: StoryRoomComposer.view.jsx:325 — `backdrop-blur` (default, 8px) paired with `bg-[#080706]/95` on mobile composer surface
- 5: StoryRoomComposer.view.jsx:779 — `backdrop-blur` (default, 8px) paired with `bg-[#080706]/95` on `MobileToolsDrawer`

## components/studio/story-rooms/story-room-message

- 3: StoryRoomMessage.view.jsx:274 — `rounded-2xl` (16px) message article, resolves to `--radius-md`

## components/studio/story-rooms/story-room-mobile-drawer

- 3: StoryRoomMobileDrawer.view.jsx:12 — `rounded-2xl` (16px) drawer frame; docked sheet, resolves UP to `--radius-lg` (20px) per Ruling 1

## components/studio/story-rooms/story-room-npc-participant-manager

- 6: StoryRoomNpcParticipantManager.view.jsx:126-135 — "Unload"/load/target/reload action buttons share identical geometry (`rounded-lg`, `px-3 py-2`), no confirm step for the unload (removal) action

## components/studio/story-rooms/story-room-runtime-mechanics-panel

- 3: StoryRoomRuntimeMechanicsPanel.view.jsx:21 — `rounded-2xl` (16px), resolves to `--radius-md`
- 6: StoryRoomRuntimeMechanicsPanel.view.jsx:60-68 — Remove (Trash2) button icon-only with no visible label text (title tooltip only), geometry ordinary (`rounded-xl`); no confirm step

## components/studio/story-rooms/story-room-state-panel

- 3: StoryRoomStatePanel.view.jsx:37,92 — `rounded-2xl` (16px), resolves to `--radius-md`

## components/studio/story-rooms/story-room-transcript

- 1: StoryRoomTranscript.view.jsx:61 — "Load Earlier" button rendered `rounded-full`; labeled action button, not a tag/icon button
- 3: StoryRoomTranscript.view.jsx:103,116 — `rounded-2xl` (16px), resolves to `--radius-md`

## components/studio/story-rooms/story-rooms-hub

- 3: StoryRoomsHub.view.jsx:82,193,199,265,294 — `rounded-2xl` (16px) on multiple panels, resolves to `--radius-md`
- 4: StoryRoomsHub.view.jsx:469 — dark gradient veil (`from-black via-black/80 to-[var(--gold-ornament)]/10`) over room-card art placeholder; no tag sits on top (StatusBadges render below, in the content section, not overlapping the art)
- 6: StoryRoomsHub.view.jsx:141-153 — "Delete Selected" button geometry identical to sibling buttons (Manage, New Template); confirm step exists via `window.confirm` in useStoryRoomsHubViewModel.js:191-199 (`confirmStoryRoomDeletion`)

## components/studio/storylines/storyline-builder-shell

- 3: StorylineBuilderShell.view.jsx:37,142,146 — `rounded-2xl` (16px), resolves to `--radius-md`

## components/studio/storylines/storyline-node-list-editor

- 3: StorylineNodeListEditor.view.jsx:41,71,79,179 — `rounded-2xl` (16px), resolves to `--radius-md`
- 6: StorylineNodeListEditor.view.jsx:118-125 — "Remove node" button icon-only (Trash2, aria-label only), geometry ordinary (`rounded-lg p-2`, matches Move Up/Down buttons); no confirm step
- 6: StorylineNodeListEditor.view.jsx:272-281 — "Remove trigger" button icon-only (Trash2, aria-label only), geometry ordinary (`rounded-lg p-2`); no confirm step

## components/studio/storylines/storyline-reference-picker

- 5: StorylineReferencePickerModal.view.jsx:21 — `backdrop-blur-sm` (4px) paired with `bg-black/80` on the modal scrim
- 3: StorylineReferencePickerModal.view.jsx:30,96,124 — `rounded-2xl` (16px), resolves to `--radius-md`
- 1: StorylineReferencePickerModal.view.jsx:63 — tab buttons rendered `rounded-full`; clickable action (tab switch), not a tag

## components/studio/storylines/storylines-hub

- 3: StorylinesHub.view.jsx:25,43,49,55,70 — `rounded-2xl` (16px), resolves to `--radius-md`

## components/studio/studio-action-card

- 3: StudioActionCard.view.jsx:12 — `rounded-2xl` (16px), resolves to `--radius-md`

## components/studio/studio-back-link

- 1: StudioBackLink.view.jsx:12 — "Back" link rendered `rounded-full`; labeled navigation action, not a tag or icon-only button

## components/studio/studio-coming-soon

- 3: StudioComingSoon.view.jsx:10 — `rounded-2xl` (16px), resolves to `--radius-md`

## components/studio/studio-economy-widget

- 5: StudioEconomyWidget.view.jsx:5 — `backdrop-blur-sm` (4px) paired with `bg-black/70` on the `UtilityModal` scrim
- 3: StudioEconomyWidget.view.jsx:6 — `rounded-2xl` (16px) `UtilityModal` panel, resolves to `--radius-md`

## components/studio/studio-mobile-nav

- 5: StudioMobileNav.view.jsx:74 — `backdrop-blur-md` (12px) paired with `bg-black/90` on the mobile header bar
- 5: StudioMobileNav.view.jsx:111 — `backdrop-blur-sm` (4px) paired with `bg-black/70` on the drawer overlay
- 5: StudioMobileNav.view.jsx:207 — `backdrop-blur-md` (12px) paired with `bg-black/90` on the bottom dock bar

## components/studio/studio-top-bar

- 1: StudioTopBar.view.jsx:40 — "Buy Coins" button rendered `rounded-full`
- 5: StudioTopBar.view.jsx:86 — `backdrop-blur-sm` (4px) paired with `bg-black/70` on `UtilityModal` scrim
- 3: StudioTopBar.view.jsx:87 — `rounded-2xl` (16px) `UtilityModal` panel, resolves to `--radius-md`

## components/studio/templates/character-template-gallery

- 3: CharacterTemplateGallery.view.jsx:22,50,59 — `rounded-2xl` (16px), resolves to `--radius-md`

## components/studio/ui/responsive-filter-panel

- 3: ResponsiveFilterPanel.view.jsx:15 — `rounded-2xl` (16px), resolves to `--radius-md`

## components/studio/view-mode-toggle

- 1: ViewModeToggle.view.jsx:21 — toggle-group wrapper rendered `rounded-full`
- 1: ViewModeToggle.view.jsx:31 — Grid/List toggle buttons rendered `rounded-full`; clickable action, not a tag

## components/ui/crestfall-option-modal

- 5: CrestfallOptionModal.view.jsx:55 — `backdrop-blur-[2px]` paired with `bg-[var(--scrim-strong)]` (.70) — matches ruled law, logged for completeness

---

## Totals

- Packages inspected: 299
- Packages with ≥1 finding: 123
- Total findings logged: approximately 640 (category 3 off-scale-radius findings dominate; categories 1, 4, 5, 6 each recur across dozens of packages; category 2 — a tag/label rendered NOT fully rounded — produced zero findings anywhere in the 299 packages; category 7 — banner classification — produced findings only in `components/studio/community/creator-card`, `components/studio/create/creation-studio`, and `components/studio/profile/public-profile-hero`)
