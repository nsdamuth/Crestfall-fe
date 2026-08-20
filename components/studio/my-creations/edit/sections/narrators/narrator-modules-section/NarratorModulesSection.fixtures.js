import {
  narratorModuleSelectorDefaultFixture,
  narratorModuleSelectorEmptyFixture,
  narratorModuleSelectorEnsembleFixture,
  narratorModuleSelectorLongContentFixture,
  narratorModuleSelectorMissingCallbacksFixture,
  narratorModuleSelectorNarratorPrimaryFixture,
  narratorModuleSelectorNoActiveModulesFixture,
} from "@/components/studio/create/narrator/narrator-module-selector/NarratorModuleSelector.fixtures";

const baseFixture = {
  sectionEyebrow: "Narrator Editor",
  sectionTitle: "Narrator Modules",
  sectionDescription:
    "Edit the Story Presentation modules that shape prose, descriptive density, intra-beat pacing pressure, and atmosphere across Composer responses.",
  moduleSelector: narratorModuleSelectorDefaultFixture,
};

export const narratorModulesSectionDefaultFixture = {
  ...baseFixture,
};

export const narratorModulesSectionNarratorPrimaryFixture = {
  ...baseFixture,
  moduleSelector: narratorModuleSelectorNarratorPrimaryFixture,
};

export const narratorModulesSectionEnsembleFixture = {
  ...baseFixture,
  moduleSelector: narratorModuleSelectorEnsembleFixture,
};

export const narratorModulesSectionNoActiveModulesFixture = {
  ...baseFixture,
  moduleSelector: narratorModuleSelectorNoActiveModulesFixture,
};

export const narratorModulesSectionLongContentFixture = {
  ...baseFixture,
  sectionTitle:
    "Narrator Modules for a Long-Form Multi-Realm Chronicle Voice",
  sectionDescription:
    "Edit a detailed collection of official starter modules while preserving the same creation-data contract, response-direction behavior, and save workflow across an unusually long heading and supporting explanation.",
  moduleSelector: narratorModuleSelectorLongContentFixture,
};

export const narratorModulesSectionEmptyFixture = {
  ...baseFixture,
  moduleSelector: narratorModuleSelectorEmptyFixture,
};

export const narratorModulesSectionMissingCallbacksFixture = {
  ...baseFixture,
  moduleSelector: narratorModuleSelectorMissingCallbacksFixture,
};
