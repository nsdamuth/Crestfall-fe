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
import { useCharacterColorPaletteModalViewModel } from "../character-color-palette/useCharacterColorPaletteModalViewModel";
import { useCharacterTemplateModalViewModel } from "../character-template-picker/useCharacterTemplateModalViewModel";

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
  chestBust: "",
  bodyNotes: "",
  appearanceNotes: "",
  clothingStyle: "",
  defaultClothingMode: "NONE",
  defaultOutfitTitle: "",
  defaultWardrobeTitle: "",
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
  interests: "",
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

// Same top-level shape (type, title, description, visibility,
// content_rating, data) the working character creator posts to
// /v1/studio/creations, sourced from this form's own field names.
function buildSaveCreationPayload(formState) {
  const name = formState.name?.trim() || "Unnamed Character";

  return {
    type: "CHARACTER",
    title: name,
    description:
      formState.shortConcept ||
      formState.title ||
      formState.species ||
      "A private draft character created in Crestfall Studio.",
    visibility: formState.visibility || "PRIVATE",
    content_rating: formState.contentRating || "SFW",
    data: {
      ...formState,
      name,
      builder: "CHARACTER_CREATOR",
      builder_version: "1.0",
    },
  };
}

function extractCreationFromApiResponse(payload) {
  return payload?.creation || payload?.data?.creation || null;
}

// fieldScope, RULED 10 Aug 2026 (docs/STUDIO-SPEC.md section 3.2,
// Studio brief S2): "full" | "quick", default "full". Default renders
// exactly today's field set so the legacy /studio/create hub (which
// imports this same modal) stays pixel-stable under the strangler
// law; the v2 Studio hub passes "quick" for the section 2.2 QUICK set.
export default function CharacterCreatorModal({ onClose, fieldScope = "full" }) {
  const router = useRouter();
  const [activeStop, setActiveStop] = useState(CREATOR_STOP_IDS[0]);
  const [maxReachedIndex, setMaxReachedIndex] = useState(0);
  const [moreHairOpen, setMoreHairOpen] = useState(false);
  const [typingFoldOpen, setTypingFoldOpen] = useState(false);
  const [fineTuneFoldOpen, setFineTuneFoldOpen] = useState(false);
  const [heartAdvancedFoldOpen, setHeartAdvancedFoldOpen] = useState(false);

  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [savedSnapshot, setSavedSnapshot] = useState(INITIAL_FORM_STATE);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [creationId, setCreationId] = useState(null);
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

  function updateField(key) {
    return (value) => {
      setFormState((current) => ({ ...current, [key]: value }));
      setJustSaved(false);
    };
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
      const payload = buildSaveCreationPayload(snapshot);
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
              title: "Continue into a story",
              description:
                "Putting a saved character into a story is coming soon.",
              body: (
                <EmptyStateCard message="Story selection is not built yet. Once it exists, this will place this character into a story you pick, resumable from any device." />
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
    onSaveAndOpenEditor: handleSave,
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
            mbtiType={formState.mbtiType}
            westernZodiacSign={formState.westernZodiacSign}
            eastAsianZodiacSign={formState.eastAsianZodiacSign}
            onChangeSpecies={updateField("species")}
            onChangeCustomSpecies={updateField("customSpecies")}
            onChangeGenderPresentation={updateField("genderPresentation")}
            onChangeCustomGenderPresentation={updateField(
              "customGenderPresentation"
            )}
            onChangeShortConcept={updateField("shortConcept")}
            onChangeMbtiType={updateField("mbtiType")}
            onChangeWesternZodiacSign={updateField("westernZodiacSign")}
            onChangeEastAsianZodiacSign={updateField("eastAsianZodiacSign")}
            typingFoldOpen={typingFoldOpen}
            onToggleTypingFold={() =>
              setTypingFoldOpen((current) => !current)
            }
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
          />
        ) : activeStop === "silhouette" ? (
          <SilhouetteStopView
            kibbeIdentity={formState.kibbeIdentity}
            bodyType={formState.bodyType}
            height={formState.height}
            build={formState.build}
            proportions={formState.proportions}
            chestBust={formState.chestBust}
            bodyNotes={formState.bodyNotes}
            appearanceNotes={formState.appearanceNotes}
            clothingStyle={formState.clothingStyle}
            defaultClothingMode={formState.defaultClothingMode}
            defaultOutfitTitle={formState.defaultOutfitTitle}
            defaultWardrobeTitle={formState.defaultWardrobeTitle}
            onChangeKibbeIdentity={updateField("kibbeIdentity")}
            onChangeBodyType={updateField("bodyType")}
            onChangeHeight={updateField("height")}
            onChangeBuild={updateField("build")}
            onChangeProportions={updateField("proportions")}
            onChangeChestBust={updateField("chestBust")}
            onChangeBodyNotes={updateField("bodyNotes")}
            onChangeAppearanceNotes={updateField("appearanceNotes")}
            onChangeClothingStyle={updateField("clothingStyle")}
            onChangeDefaultClothingMode={updateField("defaultClothingMode")}
            onOpenOutfitPicker={() => {}}
            onOpenWardrobePicker={() => {}}
            fineTuneFoldOpen={fineTuneFoldOpen}
            onToggleFineTuneFold={() =>
              setFineTuneFoldOpen((current) => !current)
            }
            fieldScope={fieldScope}
          />
        ) : activeStop === "heart" ? (
          <HeartStopView
            outwardPersonality={formState.outwardPersonality}
            internalPersonality={formState.internalPersonality}
            speechStyle={formState.speechStyle}
            movementStyle={formState.movementStyle}
            greeting={formState.greeting}
            scenario={formState.scenario}
            backstory={formState.backstory}
            verbosityLevel={formState.verbosityLevel}
            philosophy={formState.philosophy}
            interests={formState.interests}
            relationshipToPlayer={formState.relationshipToPlayer}
            voiceModuleIds={formState.voiceModuleIds}
            personalityNotes={formState.personalityNotes}
            onChangeOutwardPersonality={updateField("outwardPersonality")}
            onChangeInternalPersonality={updateField("internalPersonality")}
            onChangeSpeechStyle={updateField("speechStyle")}
            onChangeMovementStyle={updateField("movementStyle")}
            onChangeGreeting={updateField("greeting")}
            onChangeScenario={updateField("scenario")}
            onChangeBackstory={updateField("backstory")}
            onChangeVerbosityLevel={updateField("verbosityLevel")}
            onChangePhilosophy={updateField("philosophy")}
            onChangeInterests={updateField("interests")}
            onChangeRelationshipToPlayer={updateField("relationshipToPlayer")}
            onOpenVoiceModulePicker={() => {}}
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
            onChangeExtraRuntimeNotes={updateField("extraRuntimeNotes")}
            onOpenStoryPanel={() => setSecondaryPanel("story")}
            fieldScope={fieldScope}
          />
        ) : null
      }
    />
  );
}
