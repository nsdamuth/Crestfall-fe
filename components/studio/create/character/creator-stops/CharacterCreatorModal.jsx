"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import CreatorStopsView from "./CreatorStops.view";
import { buildCreatorStopItems, CREATOR_STOP_IDS } from "./CreatorStops.contract";
import {
  createCreationDraft,
  updateCreationDraft,
  getCreationApiErrorMessage,
} from "@/lib/client/studio/creations/creationClient";
import {
  generateCharacterPreviewImage,
} from "@/lib/client/studio/characters/characterPreviewClient";
import NameStopView from "./name-stop/NameStop.view";
import KindStopView from "./kind-stop/KindStop.view";
import FaceStopView from "./face-stop/FaceStop.view";
import SilhouetteStopView from "./silhouette-stop/SilhouetteStop.view";
import HeartStopView from "./heart-stop/HeartStop.view";
import SealStopView from "./seal-stop/SealStop.view";
import PayoffStopView from "./payoff-stop/PayoffStop.view";
import PalettePanelBody from "./shared/PalettePanelBody";
import TemplatePanelBody from "./shared/TemplatePanelBody";
import { EmptyStateCard } from "./shared/Controls";
import KibbePresetModal from "../KibbePresetModal";
import MultiTraitModal from "../MultiTraitModal";
import PersonalityModal from "../PersonalityModal";
import TraitModal from "../TraitModal";
import VoiceModulePickerModal from "../VoiceModulePickerModal";
import DefaultClothingSelector from "../DefaultClothingSelector";
import {
  bodyTypeOptions,
  buildOptions,
  eastAsianZodiacOptions,
  heightOptions,
  interestOptions,
  mbtiTypeOptions,
  movementStyleOptions,
  proportionOptions,
  speechStyleOptions,
  westernZodiacOptions,
} from "../constants/constants";
import { useCharacterColorPaletteModalViewModel } from "../character-color-palette/useCharacterColorPaletteModalViewModel";
import { useCharacterTemplateModalViewModel } from "../character-template-picker/useCharacterTemplateModalViewModel";
import {
  CHARACTER_CREATOR_TYPES,
  buildCharacterCreatorCreationPayload,
  getCharacterCreatorMode,
} from "../characterCreationMode";

const INITIAL_FORM_STATE = {
  name: "",
  title: "",
  species: "",
  customSpecies: "",
  genderPresentation: "",
  customGenderPresentation: "",
  shortConcept: "",
  mbtiType: "",
  westernZodiacSign: "",
  eastAsianZodiacSign: "",
  skinTone: "",
  skinCustomValue: "",
  eyeColor: "",
  eyeCustomValue: "",
  hairColor: "",
  hairCustomValue: "",
  hairLength: "",
  hairTexture: "",
  hairStyle: "",
  ethnicAppearance: "",
  kibbeIdentity: "",
  bodyType: "",
  height: "",
  build: "",
  proportions: [],
  hipsWaistShoulders: "",
  chestBust: "",
  bodyNotes: "",
  appearanceNotes: "",
  clothingStyle: "",
  defaultClothingMode: "NONE",
  defaultOutfitId: null,
  defaultOutfitTitle: "",
  defaultOutfitDescription: "",
  defaultOutfitImageUrl: "",
  defaultOutfitContentRating: "",
  defaultWardrobeId: null,
  defaultWardrobeTitle: "",
  defaultWardrobeDescription: "",
  defaultWardrobeImageUrl: "",
  defaultWardrobeContentRating: "",
  outwardPersonality: "",
  internalPersonality: "",
  speechStyle: "",
  // QUICK fields added per docs/STUDIO-SPEC.md section 2.2 (10 Aug
  // 2026, Studio brief S2): the allocation names both QUICK but the
  // seven-stop form state was missing them. Schema catch-up is
  // CR-001 (movement_style) and CR-002 (rendering_style), still
  // Nick's; these keys ride the existing data blob same as every
  // other field.
  movementStyle: "",
  greeting: "",
  scenario: "",
  backstory: "",
  verbosityLevel: "3",
  philosophy: "",
  interests: [],
  relationshipToPlayer: "",
  voiceModuleIds: [],
  personalityNotes: "",
  visibility: "PRIVATE",
  contentRating: "SFW",
  age: "18",
  renderingStyle: "auto",
  characterColorPaletteId: "CRESTFALL_DEFAULT",
  creatorDirectives: "",
  extraRuntimeNotes: "",
};

const CREATOR_FORM_FIELD_BY_CANONICAL_KEY = Object.freeze({
  kibbe_identity: "kibbeIdentity",
  body_type: "bodyType",
  height: "height",
  build: "build",
  proportions: "proportions",
  hips_waist_shoulders: "hipsWaistShoulders",
  outward_personality: "outwardPersonality",
  internal_personality: "internalPersonality",
  mbti_type: "mbtiType",
  western_zodiac_sign: "westernZodiacSign",
  east_asian_zodiac_sign: "eastAsianZodiacSign",
  speech_style: "speechStyle",
  movement_style: "movementStyle",
  interests: "interests",
  clothing_style: "clothingStyle",
  default_clothing_mode: "defaultClothingMode",
  default_outfit_id: "defaultOutfitId",
  default_outfit_title: "defaultOutfitTitle",
  default_outfit_description: "defaultOutfitDescription",
  default_outfit_image_url: "defaultOutfitImageUrl",
  default_outfit_content_rating: "defaultOutfitContentRating",
  default_wardrobe_id: "defaultWardrobeId",
  default_wardrobe_title: "defaultWardrobeTitle",
  default_wardrobe_description: "defaultWardrobeDescription",
  default_wardrobe_image_url: "defaultWardrobeImageUrl",
  default_wardrobe_content_rating: "defaultWardrobeContentRating",
});

function extractCreationFromApiResponse(payload) {
  return payload?.creation || payload?.data?.creation || null;
}

// fieldScope preserves the V2 Quick/Full entry modes. Both modes share
// the same V2 presentation shell; Full restores the V1 Character product
// semantics while Quick intentionally keeps a smaller guided subset.
export default function CharacterCreatorModal({
  onClose,
  fieldScope = "full",
  creationType = CHARACTER_CREATOR_TYPES.CHARACTER,
}) {
  const router = useRouter();
  const creatorMode = getCharacterCreatorMode(creationType);
  const isPlayerCharacter =
    creatorMode.creationType === CHARACTER_CREATOR_TYPES.PLAYER_CHARACTER;
  const [activeStop, setActiveStop] = useState(CREATOR_STOP_IDS[0]);
  const [maxReachedIndex, setMaxReachedIndex] = useState(0);
  const [moreHairOpen, setMoreHairOpen] = useState(false);
  const [heartAdvancedFoldOpen, setHeartAdvancedFoldOpen] = useState(false);

  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [savedSnapshot, setSavedSnapshot] = useState(INITIAL_FORM_STATE);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [creationId, setCreationId] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [previewStatus, setPreviewStatus] = useState("idle");
  const [previewError, setPreviewError] = useState("");
  // The save-and-reaccess loop, RULED 11 Aug 2026: true immediately
  // after any confirmed save, cleared the moment a field changes again
  // so the post-save footer is not sticky across further edits.
  const [justSaved, setJustSaved] = useState(false);
  const saveInFlightRef = useRef(false);
  // Which field currently owns the secondary panel takeover, or null.
  const [secondaryPanel, setSecondaryPanel] = useState(null);

  const paletteVM = useCharacterColorPaletteModalViewModel({
    value: formState.characterColorPaletteId,
    onChange: updateField("characterColorPaletteId"),
  });

  const templateVM = useCharacterTemplateModalViewModel({
    templates: [],
    onApply: () => setSecondaryPanel(null),
    onClose: () => setSecondaryPanel(null),
  });

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(formState) !== JSON.stringify(savedSnapshot),
    [formState, savedSnapshot]
  );

  useEffect(() => {
    const index = Math.max(0, CREATOR_STOP_IDS.indexOf(activeStop));
    setMaxReachedIndex((current) => Math.max(current, index));
  }, [activeStop]);

  function invalidatePreview() {
    setPreviewImageUrl("");
    setPreviewStatus("idle");
    setPreviewError("");
  }

  function updateField(key) {
    return (value) => {
      setFormState((current) => ({ ...current, [key]: value }));
      setJustSaved(false);
      invalidatePreview();
    };
  }

  function updateCanonicalFormField(field, value) {
    const stateField = CREATOR_FORM_FIELD_BY_CANONICAL_KEY[field];
    if (!stateField) return;

    setFormState((current) => ({ ...current, [stateField]: value }));
    setJustSaved(false);
    invalidatePreview();
  }

  function requestClose() {
    if (hasUnsavedChanges) {
      setConfirmDiscardOpen(true);
      return;
    }
    onClose?.();
  }

  function handleKeepEditing() {
    setConfirmDiscardOpen(false);
  }

  function handleConfirmDiscard() {
    onClose?.();
  }

  // Shared by the footer Save, Finish and save, and Save and open
  // editor actions. Guards against a duplicate record: the first
  // successful save records a creationId, and every save after that
  // updates that same record.
  async function persistCreation() {
    if (saveInFlightRef.current) return null;
    saveInFlightRef.current = true;
    setSaveError(null);
    setIsSaving(true);

    const snapshot = formState;

    try {
      const payload = buildCharacterCreatorCreationPayload(
        snapshot,
        creatorMode.creationType
      );
      const response = creationId
        ? await updateCreationDraft(creationId, payload)
        : await createCreationDraft(payload);
      const creation = extractCreationFromApiResponse(response);

      // A request that completed without throwing is not the same
      // thing as a save that succeeded: read the body before
      // treating this as done.
      if (!creation?.id) {
        throw new Error(
          getCreationApiErrorMessage(
            response,
            "The save did not go through. Your work is still here, try again."
          )
        );
      }

      if (!creationId) {
        setCreationId(creation.id);
      }

      setSavedSnapshot(snapshot);
      return { snapshot, id: creation.id };
    } catch {
      setSaveError(true);
      return null;
    } finally {
      setIsSaving(false);
      saveInFlightRef.current = false;
    }
  }

  // The save-and-reaccess loop, RULED 11 Aug 2026, two-tier
  // (supersedes the three previously distinct post-save behaviors of
  // Save, Finish and save, and Save and open the advanced editor):
  // every save control in the footer runs persistCreation and sets
  // justSaved on a confirmed save. CreatorStopsView keys the actual
  // footer on isLastStop: a non-final stop shows the Saved
  // confirmation only (Back/Save/Next unchanged); the final stop
  // additionally swaps the footer to Keep editing / Done.
  async function handleSave() {
    const saved = await persistCreation();
    if (saved) {
      setJustSaved(true);
    }
  }

  async function handleGeneratePreview() {
    if (["preparing", "generating"].includes(previewStatus)) return;

    setPreviewError("");
    setPreviewStatus("preparing");

    const saved = await persistCreation();
    if (!saved?.id) {
      setPreviewStatus("error");
      setPreviewError(
        "Save the Character draft before generating a preview. Your work is still here."
      );
      return;
    }

    setPreviewStatus("generating");

    try {
      const result = await generateCharacterPreviewImage({
        creationId: saved.id,
        creationType: creatorMode.creationType,
      });

      if (!result?.imageUrl) {
        throw new Error("The preview finished without a displayable image.");
      }

      setPreviewImageUrl(result.imageUrl);
      setPreviewStatus("ready");
    } catch (error) {
      setPreviewStatus("error");
      setPreviewError(
        error?.message || "Character preview could not be generated."
      );
    }
  }

  // Payoff-stop CTA, RULED 10 Aug 2026 (docs/STUDIO-SPEC.md section
  // 3.3), on the two-tier save-and-reaccess loop since 11 Aug 2026: on
  // a confirmed save from the final stop, the modal reaches the
  // two-action post-save state rather than navigating immediately.
  // Navigation now waits for "Keep editing".
  function handleContinueInEditorAfterSave() {
    if (!creationId) return;
    onClose?.();
    // Origin tracking, RULED 11 Aug 2026: carries the opening surface
    // so the advanced editor's back control returns here.
    router.push(`/studio/v2/editor/${creationId}?origin=studio`);
  }

  function handleDoneAfterSave() {
    onClose?.();
  }

  const stopItems = buildCreatorStopItems(activeStop, maxReachedIndex);

  const secondaryPanelConfig =
    secondaryPanel === "template"
      ? {
          eyebrow: templateVM.eyebrow,
          title: templateVM.modalTitle,
          description: templateVM.modalDescription,
          body: (
            <TemplatePanelBody
              tabs={templateVM.tabs}
              activeTabId={templateVM.activeTabId}
              searchQuery={templateVM.searchQuery}
              searchPlaceholder={templateVM.searchPlaceholder}
              showTemplateGrid={templateVM.showTemplateGrid}
              templates={templateVM.templates}
              emptyStateTitle={templateVM.emptyStateTitle}
              emptyStateDescription={templateVM.emptyStateDescription}
              onChooseTab={templateVM.onChooseTab}
              onChangeSearchQuery={templateVM.onChangeSearchQuery}
              onChooseTemplate={templateVM.onChooseTemplate}
            />
          ),
          onCancel: () => setSecondaryPanel(null),
        }
      : secondaryPanel === "palette"
        ? {
            eyebrow: paletteVM.modalEyebrow,
            title: paletteVM.modalTitle,
            description:
              "This sets the color of this character's dialogue in chat.",
            body: (
              <PalettePanelBody
                paletteFamilies={paletteVM.paletteFamilies}
                selectedPaletteId={paletteVM.selectedPaletteId}
                onChoosePalette={(paletteId) => {
                  paletteVM.onChoosePalette(paletteId);
                  setSecondaryPanel(null);
                }}
              />
            ),
            onCancel: () => setSecondaryPanel(null),
          }
        : secondaryPanel === "story"
          ? {
              eyebrow: "Next step",
              title: creatorMode.storyPanelTitle,
              description: creatorMode.storyPanelDescription,
              body: (
                <EmptyStateCard message={creatorMode.storyPanelMessage} />
              ),
              onCancel: () => setSecondaryPanel(null),
            }
          : null;

  const viewProps = {
    activeStop,
    activeIndex: Math.max(
      0,
      stopItems.findIndex((stop) => stop.active)
    ),
    stopItems,
    isLastStop: activeStop === "payoff",
    saveDisabled: isSaving,
    hasUnsavedChanges,
    confirmDiscardOpen,
    isSaving,
    saveError,
    justSaved,
    onSelectStop: setActiveStop,
    onBack: () =>
      setActiveStop((current) => {
        const index = CREATOR_STOP_IDS.indexOf(current);
        return CREATOR_STOP_IDS[Math.max(index - 1, 0)];
      }),
    onNext: () =>
      setActiveStop((current) => {
        const index = CREATOR_STOP_IDS.indexOf(current);
        return CREATOR_STOP_IDS[
          Math.min(index + 1, CREATOR_STOP_IDS.length - 1)
        ];
      }),
    onSave: handleSave,
    onFinishAndSave: handleSave,
    closeAriaLabel: creatorMode.closeAriaLabel,
    onContinueInEditor: handleContinueInEditorAfterSave,
    onDone: handleDoneAfterSave,
    onClose: requestClose,
    onKeepEditing: handleKeepEditing,
    onConfirmDiscard: handleConfirmDiscard,
    secondaryPanel: secondaryPanelConfig,
  };

  return (
    <CreatorStopsView
      {...viewProps}
      stopContent={
        activeStop === "name" ? (
          <NameStopView
            name={formState.name}
            title={formState.title}
            onChangeName={updateField("name")}
            onChangeTitle={updateField("title")}
            onOpenTemplate={() => setSecondaryPanel("template")}
          />
        ) : activeStop === "kind" ? (
          <KindStopView
            species={formState.species}
            customSpecies={formState.customSpecies}
            genderPresentation={formState.genderPresentation}
            customGenderPresentation={formState.customGenderPresentation}
            shortConcept={formState.shortConcept}
            onChangeSpecies={updateField("species")}
            onChangeCustomSpecies={updateField("customSpecies")}
            onChangeGenderPresentation={updateField("genderPresentation")}
            onChangeCustomGenderPresentation={updateField(
              "customGenderPresentation"
            )}
            onChangeShortConcept={updateField("shortConcept")}
            fieldScope={fieldScope}
          />
        ) : activeStop === "face" ? (
          <FaceStopView
            skinTone={formState.skinTone}
            skinCustomValue={formState.skinCustomValue}
            eyeColor={formState.eyeColor}
            eyeCustomValue={formState.eyeCustomValue}
            hairColor={formState.hairColor}
            hairCustomValue={formState.hairCustomValue}
            hairLength={formState.hairLength}
            hairTexture={formState.hairTexture}
            hairStyle={formState.hairStyle}
            ethnicAppearance={formState.ethnicAppearance}
            moreHairOpen={moreHairOpen}
            onChangeSkinTone={updateField("skinTone")}
            onChangeSkinCustomValue={updateField("skinCustomValue")}
            onChangeEyeColor={updateField("eyeColor")}
            onChangeEyeCustomValue={updateField("eyeCustomValue")}
            onChangeHairColor={updateField("hairColor")}
            onChangeHairCustomValue={updateField("hairCustomValue")}
            onChangeHairLength={updateField("hairLength")}
            onChangeHairTexture={updateField("hairTexture")}
            onChangeHairStyle={updateField("hairStyle")}
            onChangeEthnicAppearance={updateField("ethnicAppearance")}
            onToggleMoreHair={() => setMoreHairOpen((current) => !current)}
            defaultClothingControl={
              <DefaultClothingSelector
                form={{
                  clothing_style: formState.clothingStyle,
                  default_clothing_mode: formState.defaultClothingMode,
                  default_outfit_id: formState.defaultOutfitId,
                  default_outfit_title: formState.defaultOutfitTitle,
                  default_outfit_description: formState.defaultOutfitDescription,
                  default_outfit_image_url: formState.defaultOutfitImageUrl,
                  default_outfit_content_rating: formState.defaultOutfitContentRating,
                  default_wardrobe_id: formState.defaultWardrobeId,
                  default_wardrobe_title: formState.defaultWardrobeTitle,
                  default_wardrobe_description: formState.defaultWardrobeDescription,
                  default_wardrobe_image_url: formState.defaultWardrobeImageUrl,
                  default_wardrobe_content_rating: formState.defaultWardrobeContentRating,
                }}
                updateField={updateCanonicalFormField}
              />
            }
          />
        ) : activeStop === "silhouette" ? (
          <SilhouetteStopView
            bodyIdentityControl={
              <KibbePresetModal
                label="Body Identity"
                form={{
                  kibbe_identity: formState.kibbeIdentity,
                  body_type: formState.bodyType,
                  height: formState.height,
                  build: formState.build,
                  proportions: formState.proportions,
                  hips_waist_shoulders: formState.hipsWaistShoulders,
                }}
                updateField={updateCanonicalFormField}
              />
            }
            bodyTypeControl={
              <TraitModal
                label="Body Type"
                field="body_type"
                form={{ body_type: formState.bodyType }}
                updateField={updateCanonicalFormField}
                options={bodyTypeOptions}
                description="Choose a broad body silhouette."
              />
            }
            heightControl={
              <TraitModal
                label="Height"
                field="height"
                form={{ height: formState.height }}
                updateField={updateCanonicalFormField}
                options={heightOptions}
                description="Use relative adult height descriptors rather than exact measurements."
              />
            }
            buildControl={
              <TraitModal
                label="Build"
                field="build"
                form={{ build: formState.build }}
                updateField={updateCanonicalFormField}
                options={buildOptions}
                description="Choose how the character's frame feels physically."
              />
            }
            proportionsControl={
              <MultiTraitModal
                label="Proportions"
                field="proportions"
                form={{ proportions: formState.proportions }}
                updateField={updateCanonicalFormField}
                options={proportionOptions}
                description="Optional silhouette emphasis for image generation and narration. You can select multiple compatible traits."
              />
            }
            bodyNotes={formState.bodyNotes}
            onChangeBodyNotes={updateField("bodyNotes")}
          />
        ) : activeStop === "heart" ? (
          <HeartStopView
            outwardPersonalityControl={
              <PersonalityModal
                label="Outward Personality"
                field="outward_personality"
                form={{ outward_personality: formState.outwardPersonality }}
                updateField={updateCanonicalFormField}
              />
            }
            internalPersonalityControl={
              <PersonalityModal
                label="Internal Personality"
                field="internal_personality"
                form={{ internal_personality: formState.internalPersonality }}
                updateField={updateCanonicalFormField}
              />
            }
            mbtiControl={
              <TraitModal
                label="MBTI Personality Type"
                field="mbti_type"
                form={{ mbti_type: formState.mbtiType }}
                updateField={updateCanonicalFormField}
                options={mbtiTypeOptions}
                description="Choose an optional MBTI-style archetype for supplemental personality flavor only."
              />
            }
            westernZodiacControl={
              <TraitModal
                label="Western Zodiac"
                field="western_zodiac_sign"
                form={{ western_zodiac_sign: formState.westernZodiacSign }}
                updateField={updateCanonicalFormField}
                options={westernZodiacOptions}
                description="Choose an optional Western zodiac archetype for supplemental narrative flavor only."
              />
            }
            eastAsianZodiacControl={
              <TraitModal
                label="East Asian Zodiac"
                field="east_asian_zodiac_sign"
                form={{ east_asian_zodiac_sign: formState.eastAsianZodiacSign }}
                updateField={updateCanonicalFormField}
                options={eastAsianZodiacOptions}
                description="Choose an optional East Asian zodiac animal for supplemental narrative flavor only."
              />
            }
            speechStyleControl={
              <TraitModal
                label="Speech Style"
                field="speech_style"
                form={{ speech_style: formState.speechStyle }}
                updateField={updateCanonicalFormField}
                options={speechStyleOptions}
                description="How the character tends to speak in dialogue."
              />
            }
            movementStyleControl={
              <TraitModal
                label="Movement Style"
                field="movement_style"
                form={{ movement_style: formState.movementStyle }}
                updateField={updateCanonicalFormField}
                options={movementStyleOptions}
                description="How the character physically carries themselves in scenes."
              />
            }
            voiceModulesControl={
              <VoiceModulePickerModal
                value={formState.voiceModuleIds}
                onChange={updateField("voiceModuleIds")}
                description="Attach one or more reusable tone, emphasis, accent, or dialogue modules. These modify expression without replacing the character's core voice."
              />
            }
            interestsControl={
              <MultiTraitModal
                label="Interests"
                field="interests"
                form={{ interests: formState.interests }}
                updateField={updateCanonicalFormField}
                options={interestOptions}
                description="Choose every core subject, goal, or fascination the character naturally gravitates toward."
              />
            }
            greeting={formState.greeting}
            verbosityLevel={formState.verbosityLevel}
            philosophy={formState.philosophy}
            relationshipToPlayer={formState.relationshipToPlayer}
            personalityNotes={formState.personalityNotes}
            onChangeGreeting={updateField("greeting")}
            onChangeVerbosityLevel={updateField("verbosityLevel")}
            onChangePhilosophy={updateField("philosophy")}
            onChangeRelationshipToPlayer={updateField("relationshipToPlayer")}
            showRelationshipToPlayer={!isPlayerCharacter}
            onChangePersonalityNotes={updateField("personalityNotes")}
            advancedFoldOpen={heartAdvancedFoldOpen}
            onToggleAdvancedFold={() =>
              setHeartAdvancedFoldOpen((current) => !current)
            }
            fieldScope={fieldScope}
          />
        ) : activeStop === "seal" ? (
          <SealStopView
            visibility={formState.visibility}
            contentRating={formState.contentRating}
            age={formState.age}
            renderingStyle={formState.renderingStyle}
            colorPaletteLabel={paletteVM.triggerPalette.label}
            colorPaletteSwatches={paletteVM.triggerPalette.swatches}
            onChangeVisibility={updateField("visibility")}
            onChangeContentRating={updateField("contentRating")}
            onChangeAge={updateField("age")}
            onChangeRenderingStyle={updateField("renderingStyle")}
            onOpenColorPalette={() => setSecondaryPanel("palette")}
            fieldScope={fieldScope}
          />
        ) : activeStop === "payoff" ? (
          <PayoffStopView
            creationType={creatorMode.creationType}
            name={formState.name}
            title={formState.title}
            shortConcept={formState.shortConcept}
            species={formState.species}
            customSpecies={formState.customSpecies}
            genderPresentation={formState.genderPresentation}
            customGenderPresentation={formState.customGenderPresentation}
            clothingStyle={formState.clothingStyle}
            creatorDirectives={formState.creatorDirectives}
            extraRuntimeNotes={formState.extraRuntimeNotes}
            onChangeCreatorDirectives={updateField("creatorDirectives")}
            creatorDirectivesPlaceholder={
              creatorMode.creatorDirectivesPlaceholder
            }
            onChangeExtraRuntimeNotes={updateField("extraRuntimeNotes")}
            onOpenStoryPanel={() => setSecondaryPanel("story")}
            previewImageUrl={previewImageUrl}
            previewStatus={previewStatus}
            previewError={previewError}
            onGeneratePreview={handleGeneratePreview}
            fieldScope={fieldScope}
          />
        ) : null
      }
    />
  );
}
