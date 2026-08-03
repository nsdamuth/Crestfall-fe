import {
  MECHANICS_MODULE_CONTENT_RATING_OPTIONS,
  MECHANICS_MODULE_DEFAULT_CONTRACT_VERSION,
  MECHANICS_MODULE_DEFAULT_MODULE_ID,
  MECHANICS_MODULE_VISIBILITY_OPTIONS,
} from "./MechanicsModuleBuilder.contract";

function buildFixture(overrides = {}) {
  return {
    title: "Boundary Safety Mechanics",
    description:
      "Reusable meters, commands, status readouts, and guards for boundary-focused story rooms.",
    visibility: "PRIVATE",
    contentRating: "SFW",
    visibilityOptions: MECHANICS_MODULE_VISIBILITY_OPTIONS,
    contentRatingOptions: MECHANICS_MODULE_CONTENT_RATING_OPTIONS,
    moduleId: MECHANICS_MODULE_DEFAULT_MODULE_ID,
    contractVersion: MECHANICS_MODULE_DEFAULT_CONTRACT_VERSION,
    runtimeStorageNote:
      "Runtime fields remain fixture-only here. The live Shell supplies the application editor and persistence callbacks.",
    runtimeFieldsContent: null,
    saveStatus: "idle",
    saveMessage: "",
    saveDisabled: false,
    onUpdateField: () => {},
    onSave: () => {},
    ...overrides,
  };
}

export const mechanicsModuleBuilderDefaultFixture = buildFixture();

export const mechanicsModuleBuilderEmptyFixture = buildFixture({
  title: "",
  description: "",
});

export const mechanicsModuleBuilderSavingFixture = buildFixture({
  saveStatus: "saving",
  saveDisabled: true,
});

export const mechanicsModuleBuilderSavedFixture = buildFixture({
  saveStatus: "saved",
  saveMessage: "Draft saved.",
});

export const mechanicsModuleBuilderErrorFixture = buildFixture({
  saveStatus: "error",
  saveMessage: "Mechanics module draft could not be saved.",
});

export const mechanicsModuleBuilderCustomContractFixture = buildFixture({
  title: "Travel Resolution Mechanics",
  moduleId: "core.travel.v1",
  contractVersion: "travel_instance_data.v0_1",
  contentRating: "MATURE",
  visibility: "UNLISTED",
});
