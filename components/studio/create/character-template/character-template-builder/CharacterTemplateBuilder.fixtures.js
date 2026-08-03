import { buildCharacterTemplateBuilderStepItems } from "./CharacterTemplateBuilder.contract";

function buildFixture(activeStep, overrides = {}) {
  const stepItems = buildCharacterTemplateBuilderStepItems(activeStep);
  const activeIndex = Math.max(
    0,
    stepItems.findIndex((step) => step.active)
  );

  return {
    templateTitle: "Roadsworn Guardian",
    templateCategory: "Fantasy Hero",
    templateDescription:
      "A practical heroic blueprint for vigilant travelers, escorts, and mountain-road defenders.",
    templateInitial: "R",
    activeStep,
    activeIndex,
    stepItems,
    completion: 48,
    filledFieldCount: 11,
    saveStatus: "idle",
    saveMessage: "",
    saveDisabled: false,
    isFinalStep: activeStep === "review",
    ...overrides,
  };
}

export const characterTemplateBuilderTemplateFixture = buildFixture("template");

export const characterTemplateBuilderReviewFixture = buildFixture("review", {
  completion: 86,
  filledFieldCount: 20,
  saveStatus: "saved",
  saveMessage: "Character template saved.",
});

export const characterTemplateBuilderSavingFixture = buildFixture("review", {
  completion: 86,
  filledFieldCount: 20,
  saveStatus: "saving",
  saveDisabled: true,
});

export const characterTemplateBuilderErrorFixture = buildFixture("behavior", {
  completion: 63,
  filledFieldCount: 15,
  saveStatus: "error",
  saveMessage: "Character template could not be saved.",
});
