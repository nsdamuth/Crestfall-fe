"use client";

import { useEffect, useMemo, useState } from "react";

import CreatorStopsView from "./CreatorStops.view";
import { buildCreatorStopItems, CREATOR_STOP_IDS } from "./CreatorStops.contract";
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
  age: "",
  characterColorPaletteId: "CRESTFALL_DEFAULT",
  creatorDirectives: "",
  extraRuntimeNotes: "",
};

export default function CharacterCreatorModal({ onClose }) {
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
    return (value) =>
      setFormState((current) => ({ ...current, [key]: value }));
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

  function handleSave() {
    setSavedSnapshot(formState);
  }

  async function handleFinishAndSave() {
    setSaveError(null);
    setIsSaving(true);
    try {
      await Promise.resolve(formState).then(setSavedSnapshot);
      setIsSaving(false);
      onClose?.();
    } catch (error) {
      setIsSaving(false);
      setSaveError("The save did not go through. Your work is still here, try again.");
    }
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
                <EmptyStateCard message="Story selection is not built in this pass. Once it exists, this will place this character into a story you pick, resumable from any device." />
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
    hasUnsavedChanges,
    confirmDiscardOpen,
    isSaving,
    saveError,
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
    onFinishAndSave: handleFinishAndSave,
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
          />
        ) : activeStop === "heart" ? (
          <HeartStopView
            outwardPersonality={formState.outwardPersonality}
            internalPersonality={formState.internalPersonality}
            speechStyle={formState.speechStyle}
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
          />
        ) : activeStop === "seal" ? (
          <SealStopView
            visibility={formState.visibility}
            contentRating={formState.contentRating}
            age={formState.age}
            colorPaletteLabel={paletteVM.triggerPalette.label}
            colorPaletteSwatches={paletteVM.triggerPalette.swatches}
            onChangeVisibility={updateField("visibility")}
            onChangeContentRating={updateField("contentRating")}
            onChangeAge={updateField("age")}
            onOpenColorPalette={() => setSecondaryPanel("palette")}
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
          />
        ) : null
      }
    />
  );
}
