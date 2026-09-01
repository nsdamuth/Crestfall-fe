"use client";

import { useEffect, useMemo, useState } from "react";

import CreatorStopsView from "@/components/studio/create/character/creator-stops/CreatorStops.view";
import {
  buildCreatorStopItems,
  CREATOR_STOP_IDS,
} from "@/components/studio/create/character/creator-stops/CreatorStops.contract";
import {
  creatorStopsFirstFixture,
  creatorStopsLastFixture,
  creatorStopsMidFixture,
  creatorStopsUnsavedFixture,
  creatorStopsConfirmDiscardFixture,
  creatorStopsSaveErrorFixture,
  creatorStopsMidSavedFixture,
  creatorStopsJustSavedFixture,
} from "@/components/studio/create/character/creator-stops/CreatorStops.fixtures";
import NameStopView from "@/components/studio/create/character/creator-stops/name-stop/NameStop.view";
import KindStopView from "@/components/studio/create/character/creator-stops/kind-stop/KindStop.view";
import FaceStopView from "@/components/studio/create/character/creator-stops/face-stop/FaceStop.view";
import SilhouetteStopView from "@/components/studio/create/character/creator-stops/silhouette-stop/SilhouetteStop.view";
import HeartStopView from "@/components/studio/create/character/creator-stops/heart-stop/HeartStop.view";
import SealStopView from "@/components/studio/create/character/creator-stops/seal-stop/SealStop.view";
import PayoffStopView from "@/components/studio/create/character/creator-stops/payoff-stop/PayoffStop.view";
import PalettePanelBody from "@/components/studio/create/character/creator-stops/shared/PalettePanelBody";
import TemplatePanelBody from "@/components/studio/create/character/creator-stops/shared/TemplatePanelBody";
import { useCharacterColorPaletteModalViewModel } from "@/components/studio/create/character/character-color-palette/useCharacterColorPaletteModalViewModel";
import { useCharacterTemplateModalViewModel } from "@/components/studio/create/character/character-template-picker/useCharacterTemplateModalViewModel";
import { EmptyStateCard } from "@/components/studio/create/character/creator-stops/shared/Controls";
import KibbePresetModal from "@/components/studio/create/character/KibbePresetModal";
import MultiTraitModal from "@/components/studio/create/character/MultiTraitModal";
import PersonalityModal from "@/components/studio/create/character/PersonalityModal";
import TraitModal from "@/components/studio/create/character/TraitModal";
import VoiceModulePickerModal from "@/components/studio/create/character/VoiceModulePickerModal";
import DefaultClothingSelector from "@/components/studio/create/character/DefaultClothingSelector";
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
} from "@/components/studio/create/character/constants/constants";

const STATES = [
  ["First stop", creatorStopsFirstFixture],
  ["Mid stop", creatorStopsMidFixture],
  ["Last stop", creatorStopsLastFixture],
  ["Unsaved changes", creatorStopsUnsavedFixture],
  ["Confirm discard", creatorStopsConfirmDiscardFixture],
  ["Save unsuccessful", creatorStopsSaveErrorFixture],
  ["Saved, mid-flow (confirmation only)", creatorStopsMidSavedFixture],
  ["Saved, final stop (post-save footer)", creatorStopsJustSavedFixture],
];

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
  age: "",
  renderingStyle: "auto",
  characterColorPaletteId: "CRESTFALL_DEFAULT",
  creatorDirectives: "",
  extraRuntimeNotes: "",
};

const PREVIEW_FORM_FIELD_BY_CANONICAL_KEY = Object.freeze({
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

export default function CreatorStopsPreviewClient() {
  // Exercises both V2 creator entry modes. Full uses the restored V1
  // Character product semantics inside the V2 presentation shell; Quick
  // intentionally remains the smaller guided subset.
  const [fieldScope, setFieldScope] = useState("full");
  const [selectedState, setSelectedState] = useState(0);
  const [activeStop, setActiveStop] = useState(STATES[0][1].activeStop);
  const [maxReachedIndex, setMaxReachedIndex] = useState(
    Math.max(0, CREATOR_STOP_IDS.indexOf(STATES[0][1].activeStop))
  );
  const [templateNote, setTemplateNote] = useState("");
  const [moreHairOpen, setMoreHairOpen] = useState(false);
  const [heartAdvancedFoldOpen, setHeartAdvancedFoldOpen] = useState(false);

  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [savedSnapshot, setSavedSnapshot] = useState(INITIAL_FORM_STATE);
  const [isOpen, setIsOpen] = useState(true);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
  const [secondaryPanel, setSecondaryPanel] = useState(null);
  const [justSaved, setJustSaved] = useState(false);

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

  function updateCanonicalFormField(field, value) {
    const stateField = PREVIEW_FORM_FIELD_BY_CANONICAL_KEY[field];
    if (!stateField) return;
    setFormState((current) => ({ ...current, [stateField]: value }));
    setJustSaved(false);
  }

  function requestClose() {
    if (hasUnsavedChanges) {
      setConfirmDiscardOpen(true);
      return;
    }
    setIsOpen(false);
  }

  function handleKeepEditing() {
    setConfirmDiscardOpen(false);
  }

  function handleConfirmDiscard() {
    setFormState(INITIAL_FORM_STATE);
    setSavedSnapshot(INITIAL_FORM_STATE);
    setActiveStop(CREATOR_STOP_IDS[0]);
    setMaxReachedIndex(0);
    setTemplateNote("");
    setMoreHairOpen(false);
    setHeartAdvancedFoldOpen(false);
    setSecondaryPanel(null);
    setConfirmDiscardOpen(false);
    setJustSaved(false);
    setIsOpen(false);
  }

  function handleSave() {
    setSavedSnapshot(formState);
    setJustSaved(true);
  }

  function handleContinueInEditor() {
    setTemplateNote(
      'Keep editing routes to /studio/v2/editor/[id] for the just-saved item once a real creationId exists. Preview only.'
    );
  }

  function handleDone() {
    setTemplateNote("Done closes the modal in place. No navigation, no toast.");
    setIsOpen(false);
  }

  function handleReopen() {
    setIsOpen(true);
    setJustSaved(false);
  }

  const fixture = STATES[selectedState][1];

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

  const previewProps = {
    ...fixture,
    activeStop,
    activeIndex: Math.max(
      0,
      stopItems.findIndex((stop) => stop.active)
    ),
    stopItems,
    isLastStop: activeStop === "payoff",
    hasUnsavedChanges,
    confirmDiscardOpen,
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
    onContinueInEditor: handleContinueInEditor,
    onDone: handleDone,
    onClose: requestClose,
    onKeepEditing: handleKeepEditing,
    onConfirmDiscard: handleConfirmDiscard,
    secondaryPanel: secondaryPanelConfig,
  };

  function selectFixture(index) {
    const [, fx] = STATES[index];
    setSelectedState(index);
    setActiveStop(fx.activeStop);
    setMaxReachedIndex(Math.max(0, CREATOR_STOP_IDS.indexOf(fx.activeStop)));

    if (fx.hasUnsavedChanges) {
      setFormState((current) => ({ ...current, name: "Ashira" }));
    } else {
      setSavedSnapshot(formState);
    }
    setConfirmDiscardOpen(Boolean(fx.confirmDiscardOpen));
    setJustSaved(Boolean(fx.justSaved));
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex flex-wrap gap-2">
          {["full", "quick"].map((scope) => (
            <button
              key={scope}
              type="button"
              aria-pressed={fieldScope === scope}
              onClick={() => setFieldScope(scope)}
              className={`rounded-lg border px-3 py-2 text-xs uppercase tracking-[0.16em] ${
                fieldScope === scope
                  ? "border-[var(--gold-ornament)] bg-[var(--gold-ornament)]/15 text-[var(--gold-ornament)]"
                  : "border-white/10 text-[var(--ink-dim)]"
              }`}
            >
              {scope === "full" ? "Full (legacy default)" : "Quick (Studio hub)"}
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {STATES.map(([label], index) => (
            <button
              key={label}
              type="button"
              onClick={() => selectFixture(index)}
              className={`rounded-lg border px-3 py-2 text-xs uppercase tracking-[0.16em] ${
                index === selectedState
                  ? "border-[var(--gold-ornament)] bg-[var(--gold-ornament)]/15 text-[var(--gold-ornament)]"
                  : "border-white/10 text-[var(--ink-dim)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="mb-4 text-xs uppercase tracking-[0.16em] text-[var(--ink-faint)]">
          Fixture-driven UI preview. All seven stops are real. Preview
          loaded, no character form is connected.
        </p>
        {templateNote ? (
          <p className="mb-4 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
            {templateNote}
          </p>
        ) : null}

        {!isOpen ? (
          <button
            type="button"
            onClick={handleReopen}
            className="cf-btn cf-btn--primary"
          >
            Reopen creator
          </button>
        ) : null}
      </div>

      {isOpen ? (
        <CreatorStopsView
          {...previewProps}
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
                    description="Optional silhouette emphasis. Select multiple compatible traits."
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
                  />
                }
                westernZodiacControl={
                  <TraitModal
                    label="Western Zodiac"
                    field="western_zodiac_sign"
                    form={{ western_zodiac_sign: formState.westernZodiacSign }}
                    updateField={updateCanonicalFormField}
                    options={westernZodiacOptions}
                  />
                }
                eastAsianZodiacControl={
                  <TraitModal
                    label="East Asian Zodiac"
                    field="east_asian_zodiac_sign"
                    form={{ east_asian_zodiac_sign: formState.eastAsianZodiacSign }}
                    updateField={updateCanonicalFormField}
                    options={eastAsianZodiacOptions}
                  />
                }
                speechStyleControl={
                  <TraitModal
                    label="Speech Style"
                    field="speech_style"
                    form={{ speech_style: formState.speechStyle }}
                    updateField={updateCanonicalFormField}
                    options={speechStyleOptions}
                  />
                }
                movementStyleControl={
                  <TraitModal
                    label="Movement Style"
                    field="movement_style"
                    form={{ movement_style: formState.movementStyle }}
                    updateField={updateCanonicalFormField}
                    options={movementStyleOptions}
                  />
                }
                voiceModulesControl={
                  <VoiceModulePickerModal
                    value={formState.voiceModuleIds}
                    onChange={updateField("voiceModuleIds")}
                  />
                }
                interestsControl={
                  <MultiTraitModal
                    label="Interests"
                    field="interests"
                    form={{ interests: formState.interests }}
                    updateField={updateCanonicalFormField}
                    options={interestOptions}
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
      ) : null}
    </main>
  );
}
