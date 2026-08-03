import {
  PLAYER_CHARACTER_CONTENT_RATING_OPTIONS,
  PLAYER_CHARACTER_RENDERING_STYLE_OPTIONS,
  PLAYER_CHARACTER_ROLE_ARCHETYPE_OPTIONS,
  PLAYER_CHARACTER_STEPS,
  PLAYER_CHARACTER_VISIBILITY_OPTIONS,
} from "./PlayerCharacterCreator.contract";
import { PLAYER_CHARACTER_INITIAL_FORM } from "./usePlayerCharacterCreatorViewModel";

function buildStepItems(activeStep) {
  const activeIndex = Math.max(
    0,
    PLAYER_CHARACTER_STEPS.findIndex((step) => step.id === activeStep)
  );

  return {
    activeIndex,
    stepItems: PLAYER_CHARACTER_STEPS.map((step, index) => ({
      ...step,
      active: step.id === activeStep,
      visited: index <= activeIndex,
    })),
  };
}

function buildFixture(activeStep = "identity", overrides = {}) {
  const stepState = buildStepItems(activeStep);

  return {
    activeStep,
    ...stepState,
    form: {
      ...PLAYER_CHARACTER_INITIAL_FORM,
      name: "Mara Vale",
      alias: "The Night Cartographer",
      age: "29",
      species: "HUMAN",
      gender_presentation: "FEMALE",
      role_archetype: "ADVENTURER",
      eye_color: "GREEN",
      hair_color: "BLACK",
      hair_style: "WAVY",
      body_type: "ATHLETIC",
      height: "ABOVE_AVERAGE",
      build: "GRACEFUL",
      personality_summary:
        "Observant, dryly funny, careful with promises, and stubborn under pressure.",
      backstory:
        "Mara maps places that shift when no one is looking and carries a notebook filled with streets that do not exist twice.",
      narrator_notes:
        "Frame discoveries around maps, thresholds, and choices without acting for Mara.",
    },
    progress: 55,
    saveStatus: "idle",
    saveMessage: "",
    saveDisabled: false,
    roleArchetypeOptions: PLAYER_CHARACTER_ROLE_ARCHETYPE_OPTIONS,
    visibilityOptions: PLAYER_CHARACTER_VISIBILITY_OPTIONS,
    contentRatingOptions: PLAYER_CHARACTER_CONTENT_RATING_OPTIONS,
    renderingStyleOptions: PLAYER_CHARACTER_RENDERING_STYLE_OPTIONS,
    characterColorPaletteContent: null,
    skinToneContent: null,
    eyeColorContent: null,
    hairColorContent: null,
    hairStyleContent: null,
    defaultClothingContent: null,
    bodyTypeContent: null,
    heightContent: null,
    buildContent: null,
    onSelectStep: () => {},
    onUpdateField: () => {},
    onNormalizeAdultAge: () => {},
    onBack: () => {},
    onNext: () => {},
    onSave: () => {},
    ...overrides,
  };
}

export const playerCharacterIdentityFixture = buildFixture("identity");
export const playerCharacterAppearanceFixture = buildFixture("appearance");
export const playerCharacterBodyFixture = buildFixture("body");
export const playerCharacterProfileFixture = buildFixture("profile");
export const playerCharacterReviewFixture = buildFixture("review", {
  progress: 82,
});
export const playerCharacterEmptyFixture = buildFixture("identity", {
  form: { ...PLAYER_CHARACTER_INITIAL_FORM },
  progress: 19,
});
export const playerCharacterSavingFixture = buildFixture("review", {
  saveStatus: "saving",
  saveDisabled: true,
});
export const playerCharacterSavedFixture = buildFixture("review", {
  saveStatus: "saved",
  saveMessage: "Draft saved.",
});
export const playerCharacterErrorFixture = buildFixture("review", {
  saveStatus: "error",
  saveMessage: "Player character draft could not be saved.",
});
