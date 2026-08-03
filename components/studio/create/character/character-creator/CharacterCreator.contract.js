export const CHARACTER_CREATOR_VIEW_CONTRACT_VERSION = "character-creator.view.v1";

export const CHARACTER_CREATOR_STEPS = Object.freeze([
  Object.freeze({ id: "identity", label: "Identity", iconKey: "identity" }),
  Object.freeze({ id: "appearance", label: "Appearance", iconKey: "appearance" }),
  Object.freeze({ id: "body", label: "Body", iconKey: "body" }),
  Object.freeze({ id: "behavior", label: "Behavior", iconKey: "behavior" }),
  Object.freeze({ id: "review", label: "Review", iconKey: "review" }),
]);

export const CHARACTER_CREATOR_STEP_IDS = Object.freeze(
  CHARACTER_CREATOR_STEPS.map((step) => step.id)
);

export function buildCharacterCreatorStepItems(activeStep) {
  const activeIndex = Math.max(
    0,
    CHARACTER_CREATOR_STEPS.findIndex((step) => step.id === activeStep)
  );

  return CHARACTER_CREATOR_STEPS.map((step, index) => ({
    ...step,
    active: step.id === activeStep,
    visited: index <= activeIndex,
  }));
}
