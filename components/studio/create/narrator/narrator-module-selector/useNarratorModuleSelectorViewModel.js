import {
  narratorEnsembleCharacterLimitOptions,
  narratorModuleGroups,
  narratorResponseDirectionDefaults,
  narratorResponseDirectionGroups,
} from "../narratorModulePresets";

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Official Starter Modules",
  sectionTitle: "Build from Modules",
  sectionDescription:
    "Choose official prebuilt narrator modules. These are lightweight style and behavior presets that can later be bundled into a reusable narrator. Custom/community modules can come later.",
  responseEyebrow: "Response Direction",
  responseTitle: "Narrator Control",
  responseDescription:
    "Choose whether AUTO follows the active Cast or returns to the Narrator, and whether Narrator-owned responses remain scene-only or may portray an active ensemble.",
  ensembleLimitLabel: "Ensemble Character Limit",
  ensembleLimitDescription:
    "Maximum active Characters the Narrator may portray in one Narrator-owned response.",
  safeDefaultNote:
    "Scene Narration Only remains the safe default. Ensemble authority is not activated unless the creator explicitly selects it.",
});

function normalizeResponseDirectionGroups(resolvedResponseDirection) {
  return narratorResponseDirectionGroups.map((group) => ({
    id: group.id,
    label: group.label,
    description: group.description,
    options: group.options.map((option) => ({
      id: String(option.value),
      value: option.value,
      title: option.title,
      body: option.body,
      active: resolvedResponseDirection[group.id] === option.value,
    })),
  }));
}

function normalizeEnsembleLimitOptions(resolvedResponseDirection) {
  return narratorEnsembleCharacterLimitOptions.map((option) => ({
    id: String(option.value),
    value: option.value,
    title: option.title,
    active:
      resolvedResponseDirection.ensemble_character_limit === option.value,
  }));
}

function normalizeModuleGroups(selectedModules) {
  const selected = selectedModules || {};

  return narratorModuleGroups.map((group) => ({
    id: group.id,
    label: group.label,
    description: group.description,
    modules: group.modules.map((module) => ({
      id: module.id,
      title: module.title,
      body: module.body,
      active: selected[group.id] === module.id,
    })),
  }));
}

export function getNarratorModuleSelectorViewProps({
  selectedModules = {},
  updateModule = null,
  responseDirection = {},
  updateResponseDirection = null,
} = {}) {
  const resolvedResponseDirection = {
    ...narratorResponseDirectionDefaults,
    ...(responseDirection || {}),
  };

  return {
    ...DEFAULT_COPY,
    responseDirectionGroups: normalizeResponseDirectionGroups(
      resolvedResponseDirection
    ),
    showEnsembleLimit:
      resolvedResponseDirection.portrayal_mode === "ENSEMBLE",
    ensembleLimitOptions: normalizeEnsembleLimitOptions(
      resolvedResponseDirection
    ),
    moduleGroups: normalizeModuleGroups(selectedModules),
    onSelectResponseDirection: (groupId, value) =>
      updateResponseDirection?.(groupId, value),
    onSelectEnsembleCharacterLimit: (value) =>
      updateResponseDirection?.("ensemble_character_limit", value),
    onSelectModule: (groupId, moduleId) =>
      updateModule?.(groupId, moduleId),
  };
}

export function useNarratorModuleSelectorViewModel(props = {}) {
  return getNarratorModuleSelectorViewProps(props);
}
