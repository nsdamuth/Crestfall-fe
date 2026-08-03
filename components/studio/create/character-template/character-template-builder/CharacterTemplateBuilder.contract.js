export const CHARACTER_TEMPLATE_BUILDER_VIEW_CONTRACT_VERSION =
  "character-template-builder.view.v1";

export const CHARACTER_TEMPLATE_BUILDER_STEPS = Object.freeze([
  Object.freeze({ id: "template", label: "Template", iconKey: "template" }),
  Object.freeze({ id: "identity", label: "Identity", iconKey: "identity" }),
  Object.freeze({ id: "appearance", label: "Appearance", iconKey: "appearance" }),
  Object.freeze({ id: "body", label: "Body", iconKey: "body" }),
  Object.freeze({ id: "behavior", label: "Behavior", iconKey: "behavior" }),
  Object.freeze({ id: "review", label: "Review", iconKey: "review" }),
]);

export const CHARACTER_TEMPLATE_BUILDER_STEP_IDS = Object.freeze(
  CHARACTER_TEMPLATE_BUILDER_STEPS.map((step) => step.id)
);

export function buildCharacterTemplateBuilderStepItems(activeStep) {
  const activeIndex = Math.max(
    0,
    CHARACTER_TEMPLATE_BUILDER_STEPS.findIndex(
      (step) => step.id === activeStep
    )
  );

  return CHARACTER_TEMPLATE_BUILDER_STEPS.map((step, index) => ({
    ...step,
    active: step.id === activeStep,
    visited: index <= activeIndex,
  }));
}
