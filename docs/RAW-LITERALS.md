# Raw literal inventory

Inventory only, per manifest item 4. Nothing in this file is fixed. Scope matches
the legacy-bridge-retirement file set (reusable component packages, Chronicles/lore
surfaces excluded per the standing scope ruling).

Five categories counted via pattern search across the 211 in-scope files:

- hex colors: `#rgb`/`#rrggbb`/`#rrggbbaa` literals
- rgb()/rgba() literals
- Tailwind named-color utilities not backed by a design token (e.g. `bg-red-500`, `text-amber-300`)
- raw black/white Tailwind utilities (e.g. `bg-black/25`, `border-white/10`)
- literal Tailwind radius utilities (e.g. `rounded-xl`, `rounded-full`) not expressed as a `--radius` token

Counts are occurrences of the pattern in source text, not distinct values. A file
using the same class five times counts as five.

---

## Summary by package

| Package | Total | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|---|
| components/studio/create | 1798 | 50 | 0 | 315 | 922 | 511 |
| components/studio/my-creations | 1358 | 8 | 0 | 79 | 846 | 425 |
| components/studio/story-rooms | 179 | 14 | 0 | 18 | 91 | 56 |
| components/studio/creations | 176 | 6 | 2 | 45 | 77 | 46 |
| components/studio/storylines | 113 | 1 | 0 | 15 | 66 | 31 |
| components/studio/profile | 108 | 0 | 5 | 21 | 54 | 28 |
| components/studio/image-studio | 94 | 2 | 0 | 14 | 49 | 29 |
| components/studio/media | 92 | 0 | 0 | 25 | 50 | 17 |
| components/studio/account | 61 | 2 | 0 | 10 | 29 | 20 |
| components/studio/room-templates | 55 | 1 | 0 | 1 | 37 | 16 |
| components/studio/registries | 45 | 0 | 0 | 0 | 26 | 19 |
| components/studio/characters | 39 | 0 | 0 | 16 | 16 | 7 |
| components (root) | 25 | 0 | 1 | 8 | 12 | 4 |
| components/studio/community | 22 | 0 | 0 | 8 | 5 | 9 |
| components/studio/ui | 14 | 0 | 0 | 0 | 9 | 5 |
| components/studio/studio-economy-widget | 13 | 1 | 0 | 0 | 3 | 9 |
| components/studio/studio-mobile-nav | 12 | 0 | 0 | 0 | 4 | 8 |
| components/studio/studio-top-bar | 10 | 1 | 0 | 0 | 3 | 6 |
| components/studio/studio-sidebar | 9 | 0 | 0 | 0 | 3 | 6 |
| components/studio/templates | 9 | 0 | 0 | 0 | 7 | 2 |
| components/studio/official-characters-grid | 5 | 0 | 0 | 0 | 4 | 1 |
| components/studio/studio-coming-soon | 3 | 0 | 0 | 0 | 3 | 0 |
| components/studio (root) | 2 | 0 | 0 | 0 | 1 | 1 |
| components/studio/view-mode-toggle | 2 | 0 | 0 | 0 | 2 | 0 |
| components/studio/studio-action-card | 1 | 0 | 0 | 0 | 1 | 0 |
| components/studio/studio-back-link | 1 | 0 | 0 | 0 | 1 | 0 |
| components/studio/studio-page-header | 1 | 0 | 0 | 0 | 0 | 1 |
| **Total** | **4247** | | | | | |

---

## Per-file breakdown

### components/studio/create

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/create/RegistryStubPanel.jsx` | 0 | 0 | 0 | 6 | 2 |
| `components/studio/create/actor-mechanics-profile/actor-mechanics-profile-builder/ActorMechanicsProfileBuilder.view.jsx` | 1 | 0 | 2 | 11 | 6 |
| `components/studio/create/actor-mechanics-profile/actor-mechanics-profile-json-editor/ActorMechanicsProfileJsonEditorModal.view.jsx` | 1 | 0 | 9 | 14 | 11 |
| `components/studio/create/assets/asset-builder/AssetBuilder.view.jsx` | 0 | 0 | 2 | 24 | 10 |
| `components/studio/create/character-template/CharacterTemplateBuilder.jsx` | 0 | 0 | 0 | 0 | 1 |
| `components/studio/create/character-template/CharacterTemplateBuilderEditor.jsx` | 0 | 0 | 1 | 12 | 4 |
| `components/studio/create/character-template/character-template-builder/CharacterTemplateBuilder.view.jsx` | 0 | 0 | 2 | 15 | 7 |
| `components/studio/create/character/BehaviorStep.jsx` | 0 | 0 | 0 | 2 | 0 |
| `components/studio/create/character/CharacterCreatorUtils.jsx` | 0 | 0 | 0 | 8 | 3 |
| `components/studio/create/character/IdentityStep.jsx` | 0 | 0 | 0 | 1 | 1 |
| `components/studio/create/character/character-color-palette/CharacterColorPaletteModal.view.jsx` | 1 | 0 | 0 | 11 | 6 |
| `components/studio/create/character/character-creator/CharacterCreator.view.jsx` | 0 | 0 | 2 | 6 | 5 |
| `components/studio/create/character/character-preview/CharacterPreview.view.jsx` | 0 | 0 | 0 | 4 | 0 |
| `components/studio/create/character/default-clothing-selector/DefaultClothingSelector.view.jsx` | 0 | 0 | 0 | 5 | 3 |
| `components/studio/create/character/eye-color/EyeColorModal.view.jsx` | 1 | 0 | 0 | 10 | 7 |
| `components/studio/create/character/hair-eyes/HairEyesModal.view.jsx` | 1 | 0 | 0 | 12 | 8 |
| `components/studio/create/character/hair/HairModal.view.jsx` | 1 | 0 | 0 | 12 | 8 |
| `components/studio/create/character/kibbe-preset/KibbePresetModal.view.jsx` | 1 | 0 | 0 | 12 | 7 |
| `components/studio/create/character/multi-trait/MultiTraitModal.view.jsx` | 1 | 0 | 0 | 11 | 8 |
| `components/studio/create/character/personality/PersonalityModal.view.jsx` | 1 | 0 | 0 | 11 | 6 |
| `components/studio/create/character/review-step/CharacterReviewStep.view.jsx` | 0 | 0 | 0 | 10 | 0 |
| `components/studio/create/character/skin-tone/SkinToneModal.view.jsx` | 1 | 0 | 0 | 10 | 6 |
| `components/studio/create/character/trait/TraitModal.view.jsx` | 1 | 0 | 0 | 11 | 6 |
| `components/studio/create/character/voice-module-picker/VoiceModulePickerModal.view.jsx` | 1 | 0 | 0 | 10 | 8 |
| `components/studio/create/create-type-card/CreateTypeCard.view.jsx` | 0 | 0 | 0 | 4 | 0 |
| `components/studio/create/lore/lore-builder/LoreBuilder.view.jsx` | 0 | 0 | 5 | 12 | 8 |
| `components/studio/create/lore/lore-document-renderer/LoreDocumentRenderer.view.jsx` | 22 | 0 | 3 | 5 | 5 |
| `components/studio/create/lore/lore-editor/LoreEditor.view.jsx` | 3 | 0 | 11 | 86 | 54 |
| `components/studio/create/lore/lore-engine-use/LoreEngineUse.view.jsx` | 0 | 0 | 82 | 39 | 21 |
| `components/studio/create/lore/lore-json-editor/LoreJsonEditorModal.view.jsx` | 1 | 0 | 9 | 14 | 11 |
| `components/studio/create/lore/lore-publication-readiness/LorePublicationReadiness.view.jsx` | 0 | 0 | 81 | 35 | 26 |
| `components/studio/create/mechanics-module/mechanics-module-builder/MechanicsModuleBuilder.view.jsx` | 0 | 0 | 2 | 12 | 3 |
| `components/studio/create/narrator/narrator-builder/NarratorBuilder.view.jsx` | 0 | 0 | 2 | 14 | 5 |
| `components/studio/create/narrator/narrator-module-selector/NarratorModuleSelector.view.jsx` | 0 | 0 | 0 | 10 | 3 |
| `components/studio/create/npc-registry/RegistryUtils.jsx` | 0 | 0 | 0 | 8 | 4 |
| `components/studio/create/npc-registry/modal-actions/ModalActions.view.jsx` | 0 | 0 | 0 | 1 | 2 |
| `components/studio/create/npc-registry/modal-shell/ModalShell.fixtures.js` | 0 | 0 | 0 | 8 | 4 |
| `components/studio/create/npc-registry/modal-shell/ModalShell.view.jsx` | 1 | 0 | 0 | 3 | 1 |
| `components/studio/create/npc-registry/npc-entry/NpcEntryModal.view.jsx` | 0 | 0 | 0 | 3 | 1 |
| `components/studio/create/player-character/player-character-creator/PlayerCharacterCreator.view.jsx` | 0 | 0 | 2 | 21 | 9 |
| `components/studio/create/progression/progression-json-editor/ProgressionJsonEditorModal.view.jsx` | 1 | 0 | 9 | 14 | 11 |
| `components/studio/create/progression/progression-profile-builder/ProgressionProfileBuilder.view.jsx` | 1 | 0 | 5 | 10 | 8 |
| `components/studio/create/progression/progression-profile-editor/ProgressionProfileEditor.view.jsx` | 0 | 0 | 12 | 45 | 25 |
| `components/studio/create/room-template/BuilderSection.jsx` | 0 | 0 | 0 | 1 | 0 |
| `components/studio/create/room-template/InvitedPlayersPanel.jsx` | 0 | 0 | 1 | 5 | 4 |
| `components/studio/create/room-template/OpeningMessageCard.jsx` | 0 | 0 | 0 | 3 | 1 |
| `components/studio/create/room-template/RoomTemplateFields.jsx` | 0 | 0 | 0 | 4 | 2 |
| `components/studio/create/room-template/RoomTemplateSummary.jsx` | 0 | 0 | 0 | 2 | 0 |
| `components/studio/create/room-template/ScenarioRecommendationsPanel.jsx` | 0 | 0 | 0 | 9 | 6 |
| `components/studio/create/room-template/room-registry-attachments-section/RoomRegistryAttachmentsSection.view.jsx` | 0 | 0 | 0 | 14 | 5 |
| `components/studio/create/room-template/room-template-builder/RoomTemplateBuilder.view.jsx` | 0 | 0 | 3 | 13 | 4 |
| `components/studio/create/room-template/selected-characters-panel/SelectedCharactersPanel.view.jsx` | 0 | 0 | 0 | 6 | 3 |
| `components/studio/create/room-template/selection-card/SelectionCard.view.jsx` | 0 | 0 | 0 | 2 | 1 |
| `components/studio/create/room-template/story-rules-codex-attachments-section/StoryRulesCodexAttachmentsSection.view.jsx` | 0 | 0 | 0 | 17 | 6 |
| `components/studio/create/rules-codex/rules-codex-builder/RulesCodexBuilder.view.jsx` | 1 | 0 | 5 | 11 | 7 |
| `components/studio/create/rules-codex/rules-codex-editor/RulesCodexEditor.view.jsx` | 1 | 0 | 15 | 45 | 28 |
| `components/studio/create/rules-codex/rules-codex-json-editor/RulesCodexJsonEditorModal.view.jsx` | 1 | 0 | 9 | 14 | 11 |
| `components/studio/create/scenario/scenario-builder/ScenarioBuilder.view.jsx` | 0 | 0 | 3 | 24 | 8 |
| `components/studio/create/scenario/scenario-reference-picker/ScenarioReferencePickerModal.view.jsx` | 1 | 0 | 0 | 15 | 6 |
| `components/studio/create/stats-pools/stats-pools-builder/StatsPoolsBuilder.view.jsx` | 1 | 0 | 5 | 11 | 7 |
| `components/studio/create/stats-pools/stats-pools-editor/StatsPoolsEditor.view.jsx` | 1 | 0 | 12 | 48 | 30 |
| `components/studio/create/stats-pools/stats-pools-json-editor/StatsPoolsJsonEditorModal.view.jsx` | 1 | 0 | 9 | 14 | 11 |
| `components/studio/create/structured-registry/registry-linked-creation-picker/RegistryLinkedCreationPickerModal.view.jsx` | 1 | 0 | 3 | 12 | 7 |
| `components/studio/create/structured-registry/structured-registry-builder/StructuredRegistryBuilder.view.jsx` | 0 | 0 | 3 | 44 | 17 |
| `components/studio/create/wardrobe/outfit-picker/OutfitPickerModal.view.jsx` | 1 | 0 | 3 | 13 | 7 |
| `components/studio/create/wardrobe/wardrobe-builder/WardrobeBuilder.view.jsx` | 0 | 0 | 3 | 23 | 16 |

### components/studio/my-creations

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/my-creations/CreationEditShell.jsx` | 0 | 0 | 0 | 1 | 1 |
| `components/studio/my-creations/CreationReferenceImagePickerModal.jsx` | 1 | 0 | 3 | 14 | 9 |
| `components/studio/my-creations/creation-edit-media-panel/CreationEditMediaPanel.view.jsx` | 0 | 0 | 0 | 16 | 6 |
| `components/studio/my-creations/creation-edit-shell/CreationEditMechanicsRuntimeQuickNav.jsx` | 0 | 0 | 0 | 10 | 4 |
| `components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx` | 0 | 0 | 0 | 0 | 1 |
| `components/studio/my-creations/creation-edit-shell/CreationEditShell.view.jsx` | 0 | 0 | 0 | 4 | 1 |
| `components/studio/my-creations/edit/sections/MediaSection.jsx` | 0 | 0 | 0 | 2 | 0 |
| `components/studio/my-creations/edit/sections/SharedFields.jsx` | 0 | 0 | 0 | 9 | 3 |
| `components/studio/my-creations/edit/sections/character-appearance-section/CharacterAppearanceSection.view.jsx` | 0 | 0 | 0 | 5 | 4 |
| `components/studio/my-creations/edit/sections/character-behavior-section/CharacterBehaviorSection.view.jsx` | 0 | 0 | 0 | 2 | 0 |
| `components/studio/my-creations/edit/sections/character-identity-section/CharacterIdentitySection.view.jsx` | 0 | 0 | 0 | 2 | 1 |
| `components/studio/my-creations/edit/sections/character-template-fields-section/CharacterTemplateFieldsSection.view.jsx` | 0 | 0 | 0 | 2 | 0 |
| `components/studio/my-creations/edit/sections/creation-danger-section/CreationDangerSection.view.jsx` | 0 | 0 | 12 | 6 | 1 |
| `components/studio/my-creations/edit/sections/creation-overview-section/CreationOverviewSection.view.jsx` | 0 | 0 | 0 | 1 | 1 |
| `components/studio/my-creations/edit/sections/creation-publishing-section/CreationPublishingSection.view.jsx` | 0 | 0 | 2 | 2 | 2 |
| `components/studio/my-creations/edit/sections/item-registries/item-registry-fields-section/ItemRegistryFieldsSection.view.jsx` | 0 | 0 | 0 | 26 | 6 |
| `components/studio/my-creations/edit/sections/locations/TrackersModuleConfigModal.jsx` | 1 | 0 | 0 | 40 | 24 |
| `components/studio/my-creations/edit/sections/locations/location-identity-section/LocationIdentitySection.view.jsx` | 0 | 0 | 0 | 13 | 6 |
| `components/studio/my-creations/edit/sections/locations/location-registry-attachments-section/LocationRegistryAttachmentsSection.view.jsx` | 0 | 0 | 0 | 15 | 7 |
| `components/studio/my-creations/edit/sections/locations/location-runtime-modules-section/LocationRuntimeModulesSection.view.jsx` | 0 | 0 | 0 | 30 | 16 |
| `components/studio/my-creations/edit/sections/locations/location-scene-atmosphere-section/LocationSceneAtmosphereSection.view.jsx` | 0 | 0 | 0 | 2 | 0 |
| `components/studio/my-creations/edit/sections/locations/location-sensory-environment-fields/LocationSensoryEnvironmentFields.view.jsx` | 0 | 0 | 0 | 16 | 10 |
| `components/studio/my-creations/edit/sections/locations/weather-module-config-modal/WeatherModuleConfigModal.view.jsx` | 2 | 0 | 3 | 24 | 16 |
| `components/studio/my-creations/edit/sections/mechanics-modules/RuntimeMechanicsModulesSection.jsx` | 0 | 0 | 0 | 20 | 12 |
| `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-core/MechanicsCommandCore.view.jsx` | 0 | 0 | 0 | 38 | 21 |
| `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-domain-actions/MechanicsCommandDomainActions.view.jsx` | 0 | 0 | 3 | 15 | 9 |
| `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-effects/MechanicsCommandEffectCard.view.jsx` | 0 | 0 | 6 | 30 | 16 |
| `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-effects/MechanicsCommandEffects.view.jsx` | 0 | 0 | 0 | 4 | 3 |
| `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-outcomes/MechanicsCommandOutcomes.view.jsx` | 0 | 0 | 0 | 11 | 7 |
| `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-requirements/MechanicsCommandRequirements.view.jsx` | 0 | 0 | 0 | 21 | 13 |
| `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-resolution/MechanicsCommandResolution.view.jsx` | 0 | 0 | 0 | 65 | 33 |
| `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-compatibility-baseline/MechanicsCompatibilityBaseline.view.jsx` | 0 | 0 | 0 | 24 | 7 |
| `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-composition-builder/MechanicsCompositionBuilder.view.jsx` | 0 | 0 | 8 | 76 | 44 |
| `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-core/MechanicsDocumentCore.view.jsx` | 0 | 0 | 0 | 18 | 5 |
| `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-defaults/MechanicsDefaults.view.jsx` | 0 | 0 | 0 | 13 | 7 |
| `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-document-orchestration/MechanicsDocumentOrchestration.view.jsx` | 0 | 0 | 0 | 0 | 1 |
| `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-guards/MechanicsGuards.view.jsx` | 0 | 0 | 0 | 36 | 15 |
| `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-json-editor/MechanicsJsonEditorModal.view.jsx` | 1 | 0 | 9 | 12 | 10 |
| `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx` | 0 | 0 | 0 | 3 | 1 |
| `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.view.jsx` | 0 | 0 | 0 | 18 | 6 |
| `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-validation/MechanicsPresetValidationPanel.view.jsx` | 0 | 0 | 6 | 19 | 11 |
| `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-progression-profile/MechanicsProgressionProfileFields.view.jsx` | 1 | 0 | 6 | 21 | 13 |
| `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-status-blocks/MechanicsStatusBlocks.view.jsx` | 0 | 0 | 0 | 28 | 13 |
| `components/studio/my-creations/edit/sections/mechanics-modules/mechanics-trackers/MechanicsTrackersSection.view.jsx` | 0 | 0 | 4 | 36 | 17 |
| `components/studio/my-creations/edit/sections/npc-registries/npc-registry-fields-section/NpcRegistryFieldsSection.view.jsx` | 0 | 0 | 1 | 7 | 4 |
| `components/studio/my-creations/edit/sections/outfits/outfit-prompt-guidance-section/OutfitPromptGuidanceSection.view.jsx` | 0 | 0 | 0 | 4 | 0 |
| `components/studio/my-creations/edit/sections/room-templates/room-template-opening-section/RoomTemplateOpeningSection.view.jsx` | 0 | 0 | 0 | 3 | 1 |
| `components/studio/my-creations/edit/sections/room-templates/story-narrative-runtime-section/StoryNarrativeRuntimeSection.view.jsx` | 0 | 0 | 0 | 6 | 2 |
| `components/studio/my-creations/edit/sections/scenarios/scenario-cast-requirements-section/ScenarioCastRequirementsSection.view.jsx` | 0 | 0 | 1 | 6 | 3 |
| `components/studio/my-creations/edit/sections/scenarios/scenario-middleware-section/ScenarioMiddlewareSection.view.jsx` | 0 | 0 | 0 | 2 | 0 |
| `components/studio/my-creations/edit/sections/scenarios/scenario-story-circle-section/ScenarioStoryCircleSection.view.jsx` | 0 | 0 | 0 | 2 | 0 |
| `components/studio/my-creations/edit/sections/storylines/storyline-fields-section/StorylineFieldsSection.view.jsx` | 0 | 0 | 0 | 2 | 0 |
| `components/studio/my-creations/edit/sections/visual-references-section/VisualReferencesSection.view.jsx` | 0 | 0 | 3 | 9 | 4 |
| `components/studio/my-creations/edit/sections/wardrobes/wardrobe-fields-section/WardrobeFieldsSection.view.jsx` | 0 | 0 | 0 | 21 | 10 |
| `components/studio/my-creations/image-library/creation-featured-image-picker/CreationFeaturedImagePickerModal.view.jsx` | 1 | 0 | 6 | 13 | 7 |
| `components/studio/my-creations/image-library/creation-reference-image-picker/CreationReferenceImagePickerModal.view.jsx` | 1 | 0 | 3 | 13 | 5 |
| `components/studio/my-creations/my-creations-hub/MyCreationsHub.view.jsx` | 0 | 0 | 3 | 8 | 6 |

### components/studio/story-rooms

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/story-rooms/StoryRoomMobileToolbar.jsx` | 0 | 0 | 0 | 3 | 2 |
| `components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view.jsx` | 1 | 0 | 0 | 14 | 9 |
| `components/studio/story-rooms/story-room-composer/StoryRoomComposer.view.jsx` | 5 | 0 | 1 | 32 | 21 |
| `components/studio/story-rooms/story-room-message/StoryRoomMessage.view.jsx` | 7 | 0 | 4 | 5 | 2 |
| `components/studio/story-rooms/story-room-mobile-drawer/StoryRoomMobileDrawer.view.jsx` | 1 | 0 | 0 | 3 | 1 |
| `components/studio/story-rooms/story-room-npc-participant-manager/StoryRoomNpcParticipantManager.view.jsx` | 0 | 0 | 3 | 8 | 8 |
| `components/studio/story-rooms/story-room-runtime-mechanics-panel/StoryRoomRuntimeMechanicsPanel.view.jsx` | 0 | 0 | 6 | 17 | 11 |
| `components/studio/story-rooms/story-room-state-panel/StoryRoomStatePanel.view.jsx` | 0 | 0 | 0 | 5 | 2 |
| `components/studio/story-rooms/story-room-transcript/StoryRoomTranscript.view.jsx` | 0 | 0 | 4 | 4 | 0 |

### components/studio/creations

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/creations/CreationPreviewModal.jsx` | 1 | 0 | 0 | 0 | 0 |
| `components/studio/creations/CreationProfilePage.jsx` | 0 | 0 | 0 | 1 | 1 |
| `components/studio/creations/creation-card/CreationCard.view.jsx` | 0 | 0 | 8 | 17 | 9 |
| `components/studio/creations/creation-preview-modal/CreationPreviewModal.view.jsx` | 0 | 2 | 15 | 26 | 19 |
| `components/studio/creations/creation-profile-page/CreationProfilePage.view.jsx` | 0 | 0 | 4 | 16 | 7 |
| `components/studio/creations/creation-share-button/CreationShareButton.view.jsx` | 5 | 0 | 0 | 1 | 1 |
| `components/studio/creations/creation-status-badges/CreationStatusBadges.view.jsx` | 0 | 0 | 15 | 2 | 1 |
| `components/studio/creations/lore/LorePublicCreationPage.jsx` | 0 | 0 | 3 | 0 | 1 |
| `components/studio/creations/pickers/creation-picker-panel/CreationPickerPanel.view.jsx` | 0 | 0 | 0 | 14 | 7 |

### components/studio/storylines

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/storylines/storyline-builder-shell/StorylineBuilderShell.view.jsx` | 0 | 0 | 2 | 13 | 6 |
| `components/studio/storylines/storyline-node-list-editor/StorylineNodeListEditor.view.jsx` | 0 | 0 | 9 | 30 | 18 |
| `components/studio/storylines/storyline-open-world-settings/StorylineOpenWorldSettings.view.jsx` | 0 | 0 | 0 | 8 | 4 |
| `components/studio/storylines/storyline-reference-picker/StorylineReferencePickerModal.view.jsx` | 1 | 0 | 1 | 9 | 2 |
| `components/studio/storylines/storylines-hub/StorylinesHub.view.jsx` | 0 | 0 | 3 | 6 | 1 |

### components/studio/profile

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/profile/profile-avatar/ProfileAvatar.view.jsx` | 0 | 0 | 0 | 0 | 1 |
| `components/studio/profile/profile-back-button/ProfileBackButton.view.jsx` | 0 | 0 | 0 | 1 | 1 |
| `components/studio/profile/profile-banner/ProfileBanner.view.jsx` | 0 | 0 | 0 | 3 | 0 |
| `components/studio/profile/profile-follow-button/ProfileFollowButton.view.jsx` | 0 | 0 | 0 | 0 | 1 |
| `components/studio/profile/profile-media-manager/ProfileMediaManager.view.jsx` | 0 | 0 | 0 | 8 | 4 |
| `components/studio/profile/profile-share-button/ProfileShareButton.view.jsx` | 0 | 0 | 0 | 2 | 1 |
| `components/studio/profile/public-profile-activity-feed/PublicProfileActivityFeed.view.jsx` | 0 | 0 | 4 | 12 | 5 |
| `components/studio/profile/public-profile-badges/PublicProfileBadges.view.jsx` | 0 | 0 | 0 | 4 | 1 |
| `components/studio/profile/public-profile-creation-grid/PublicProfileCreationGrid.view.jsx` | 0 | 0 | 3 | 2 | 1 |
| `components/studio/profile/public-profile-donate-button/PublicProfileDonateButton.view.jsx` | 0 | 0 | 14 | 13 | 10 |
| `components/studio/profile/public-profile-hero/PublicProfileHero.view.jsx` | 0 | 5 | 0 | 7 | 3 |
| `components/studio/profile/public-profile-tabs/PublicProfileTabs.view.jsx` | 0 | 0 | 0 | 2 | 0 |

### components/studio/image-studio

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/image-studio/FilterPill.jsx` | 0 | 0 | 0 | 2 | 0 |
| `components/studio/image-studio/custom-ingredient-editor/CustomIngredientEditor.view.jsx` | 0 | 0 | 0 | 7 | 6 |
| `components/studio/image-studio/image-studio-composer/ImageStudioComposer.view.jsx` | 0 | 0 | 8 | 13 | 10 |
| `components/studio/image-studio/image-studio-workbench/ImageStudioWorkbench.view.jsx` | 0 | 0 | 0 | 4 | 1 |
| `components/studio/image-studio/ingredient-picker/IngredientPickerModal.view.jsx` | 1 | 0 | 3 | 4 | 1 |
| `components/studio/image-studio/save-ingredient-preset/SaveIngredientPresetModal.view.jsx` | 1 | 0 | 3 | 15 | 8 |
| `components/studio/image-studio/video-tools-panel/VideoToolsPanel.view.jsx` | 0 | 0 | 0 | 4 | 3 |

### components/studio/media

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/media/media-lightbox/MediaLightbox.view.jsx` | 0 | 0 | 25 | 50 | 17 |

### components/studio/account

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/account/studio-account-coins/StudioAccountCoins.view.jsx` | 1 | 0 | 1 | 5 | 3 |
| `components/studio/account/studio-account-profile/StudioAccountProfile.view.jsx` | 1 | 0 | 9 | 24 | 17 |

### components/studio/room-templates

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/room-templates/BuilderSection.jsx` | 0 | 0 | 0 | 1 | 0 |
| `components/studio/room-templates/RoomTemplateFields.jsx` | 0 | 0 | 0 | 4 | 2 |
| `components/studio/room-templates/invited-players-panel/InvitedPlayersPanel.view.jsx` | 0 | 0 | 1 | 6 | 3 |
| `components/studio/room-templates/opening-message-card/OpeningMessageCard.view.jsx` | 0 | 0 | 0 | 4 | 0 |
| `components/studio/room-templates/room-template-picker/RoomTemplatePickerModal.view.jsx` | 1 | 0 | 0 | 3 | 1 |
| `components/studio/room-templates/room-template-summary/RoomTemplateSummary.view.jsx` | 0 | 0 | 0 | 2 | 0 |
| `components/studio/room-templates/scenario-recommendations-panel/ScenarioRecommendationsPanel.view.jsx` | 0 | 0 | 0 | 9 | 6 |
| `components/studio/room-templates/selected-characters-panel/SelectedCharactersPanel.view.jsx` | 0 | 0 | 0 | 6 | 3 |
| `components/studio/room-templates/selection-card/SelectionCard.view.jsx` | 0 | 0 | 0 | 2 | 1 |

### components/studio/registries

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/registries/item-starting-assignment-editor/ItemStartingAssignmentEditor.view.jsx` | 0 | 0 | 0 | 26 | 19 |

### components/studio/characters

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/characters/advanced-prompting/advanced-prompting/AdvancedPromptingEditor.view.jsx` | 0 | 0 | 16 | 16 | 7 |

### components (root)

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/PaginatedCardGrid.jsx` | 0 | 0 | 0 | 0 | 1 |
| `components/SiteFooter.jsx` | 0 | 1 | 0 | 0 | 0 |
| `components/policies/PolicyIndex.jsx` | 0 | 0 | 4 | 2 | 0 |
| `components/policies/PolicyPage.jsx` | 0 | 0 | 4 | 7 | 1 |
| `components/ui/CrestfallSelect.jsx` | 0 | 0 | 0 | 3 | 2 |

### components/studio/community

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/community/creator-card/CreatorCard.view.jsx` | 0 | 0 | 2 | 1 | 4 |
| `components/studio/community/creator-engagement-actions/CreatorEngagementActions.view.jsx` | 0 | 0 | 3 | 2 | 1 |
| `components/studio/community/creator-list-row/CreatorListRow.view.jsx` | 0 | 0 | 3 | 2 | 4 |

### components/studio/ui

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/ui/responsive-filter-panel/ResponsiveFilterPanel.fixtures.js` | 0 | 0 | 0 | 4 | 3 |
| `components/studio/ui/responsive-filter-panel/ResponsiveFilterPanel.view.jsx` | 0 | 0 | 0 | 5 | 2 |

### components/studio/studio-economy-widget

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/studio-economy-widget/StudioEconomyWidget.view.jsx` | 1 | 0 | 0 | 3 | 9 |

### components/studio/studio-mobile-nav

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/studio-mobile-nav/StudioMobileNav.view.jsx` | 0 | 0 | 0 | 4 | 8 |

### components/studio/studio-top-bar

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/studio-top-bar/StudioTopBar.view.jsx` | 1 | 0 | 0 | 3 | 6 |

### components/studio/studio-sidebar

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/studio-sidebar/StudioSidebar.view.jsx` | 0 | 0 | 0 | 3 | 6 |

### components/studio/templates

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/templates/character-template-gallery/CharacterTemplateGallery.view.jsx` | 0 | 0 | 0 | 7 | 2 |

### components/studio/official-characters-grid

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/official-characters-grid/OfficialCharactersGrid.view.jsx` | 0 | 0 | 0 | 4 | 1 |

### components/studio/studio-coming-soon

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/studio-coming-soon/StudioComingSoon.view.jsx` | 0 | 0 | 0 | 3 | 0 |

### components/studio (root)

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/StudioShell.jsx` | 0 | 0 | 0 | 1 | 0 |
| `components/studio/StudioTopBar.jsx` | 0 | 0 | 0 | 0 | 1 |

### components/studio/view-mode-toggle

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/view-mode-toggle/ViewModeToggle.view.jsx` | 0 | 0 | 0 | 2 | 0 |

### components/studio/studio-action-card

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/studio-action-card/StudioActionCard.view.jsx` | 0 | 0 | 0 | 1 | 0 |

### components/studio/studio-back-link

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/studio-back-link/StudioBackLink.view.jsx` | 0 | 0 | 0 | 1 | 0 |

### components/studio/studio-page-header

| File | hex | rgb() | Tailwind color | black/white | radius |
|---|---|---|---|---|---|
| `components/studio/studio-page-header/StudioPageHeader.fixtures.js` | 0 | 0 | 0 | 0 | 1 |

