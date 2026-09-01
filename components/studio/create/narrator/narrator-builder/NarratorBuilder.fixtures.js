import { getNarratorModuleSelectorViewProps } from "../narrator-module-selector/useNarratorModuleSelectorViewModel";
import {
  narratorResponseDirectionDefaults,
} from "../narratorModulePresets";
import {
  contentRatingOptions,
  toneOptions,
  visibilityOptions,
} from "../constants";
import { NARRATOR_BUILDER_DEFAULT_MODULES } from "./NarratorBuilder.contract";

function buildModuleSummaryItems(selectedModules) {
  return Object.entries(selectedModules).map(([groupId, moduleId]) => ({
    id: `${groupId}-${moduleId}`,
    label: `${groupId.replaceAll("_", " ")}: ${moduleId.replaceAll("_", " ")}`,
  }));
}

function buildFixture(overrides = {}) {
  const selectedModules = {
    ...NARRATOR_BUILDER_DEFAULT_MODULES,
    ...(overrides.selectedModules || {}),
  };
  const responseDirection = {
    ...narratorResponseDirectionDefaults,
    ...(overrides.responseDirection || {}),
  };

  return {
    name: "Lanternkeeper Narrator",
    description:
      "A cinematic storyteller for atmospheric mysteries, deliberate pacing, and grounded character-focused scenes.",
    tone: "CINEMATIC",
    narratorGuidance:
      "Frame each scene with sensory detail, preserve character agency, and let clues emerge through action rather than exposition.",
    avoidGuidance:
      "Avoid omniscient spoilers, forced emotional reactions, and excessive summaries.",
    narratorDirectives: null,
    tags: "cinematic, mystery, slow-burn",
    visibility: "PRIVATE",
    contentRating: "SFW",
    toneOptions,
    visibilityOptions,
    contentRatingOptions,
    moduleSummaryItems: buildModuleSummaryItems(selectedModules),
    moduleSelectorViewProps: getNarratorModuleSelectorViewProps({
      selectedModules,
      responseDirection,
    }),
    saveStatus: "idle",
    saveMessage: "",
    saveDisabled: false,
    onUpdateField: () => {},
    onSave: () => {},
    ...overrides,
  };
}

export const narratorBuilderDefaultFixture = buildFixture();

export const narratorBuilderEmptyFixture = buildFixture({
  name: "",
  description: "",
  tone: "",
  narratorGuidance: "",
  avoidGuidance: "",
  tags: "",
});

export const narratorBuilderSavingFixture = buildFixture({
  saveStatus: "saving",
  saveDisabled: true,
});

export const narratorBuilderSavedFixture = buildFixture({
  saveStatus: "saved",
  saveMessage: "Draft saved.",
});

export const narratorBuilderErrorFixture = buildFixture({
  saveStatus: "error",
  saveMessage: "Narrator draft could not be saved.",
});

export const narratorBuilderEnsembleFixture = buildFixture({
  responseDirection: {
    portrayal_mode: "ENSEMBLE",
    ensemble_character_limit: 4,
  },
});
