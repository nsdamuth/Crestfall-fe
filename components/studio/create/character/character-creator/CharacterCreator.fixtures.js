import { buildCharacterCreatorStepItems } from "./CharacterCreator.contract";

function buildFixture(activeStep, overrides = {}) {
  const stepItems = buildCharacterCreatorStepItems(activeStep);
  const activeIndex = Math.max(
    0,
    stepItems.findIndex((step) => step.active)
  );

  return {
    activeStep,
    activeIndex,
    stepItems,
    progress: 38,
    saveStatus: "idle",
    saveMessage: "",
    saveDisabled: false,
    ...overrides,
  };
}

export const characterCreatorIdentityFixture = buildFixture("identity");

export const characterCreatorReviewFixture = buildFixture("review", {
  progress: 82,
  saveStatus: "saved",
  saveMessage: "Draft saved.",
});

export const characterCreatorSavingFixture = buildFixture("review", {
  progress: 82,
  saveStatus: "saving",
  saveDisabled: true,
});

export const characterCreatorErrorFixture = buildFixture("behavior", {
  progress: 54,
  saveStatus: "error",
  saveMessage: "Character draft could not be saved.",
});
