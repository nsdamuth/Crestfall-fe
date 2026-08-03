import {
  narratorResponseDirectionDefaults,
} from "@/components/studio/create/narrator/narratorModulePresets";
import { getNarratorModuleSelectorViewProps } from "@/components/studio/create/narrator/narrator-module-selector/useNarratorModuleSelectorViewModel";

const DEFAULT_MODULES = Object.freeze({
  prose_style: "cinematic",
  detail_level: "balanced",
  pacing: "balanced",
  dialogue_style: "naturalistic",
  knowledge_behavior: "moderate",
  atmosphere: "adventurous",
});

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Narrator Editor",
  sectionTitle: "Narrator Modules",
  sectionDescription:
    "Edit the official starter modules that shape this narrator's prose, pacing, dialogue, knowledge behavior, and atmosphere.",
});

function resolveSelectedModules(data) {
  return {
    ...DEFAULT_MODULES,
    ...(data?.selected_modules || data?.selectedModules || {}),
  };
}

function resolveResponseDirection(data) {
  return {
    ...narratorResponseDirectionDefaults,
    ...(data?.response_direction || data?.responseDirection || {}),
  };
}

export function getNarratorModulesSectionViewProps({
  form = {},
  updateDataField = null,
} = {}) {
  const data = form?.data || {};
  const selectedModules = resolveSelectedModules(data);
  const responseDirection = resolveResponseDirection(data);

  function updateModule(groupId, moduleId) {
    updateDataField?.("selected_modules", {
      ...selectedModules,
      [groupId]: moduleId,
    });
  }

  function updateResponseDirection(field, value) {
    updateDataField?.("response_direction", {
      ...responseDirection,
      [field]: value,
    });
  }

  return {
    ...DEFAULT_COPY,
    moduleSelector: getNarratorModuleSelectorViewProps({
      selectedModules,
      updateModule,
      responseDirection,
      updateResponseDirection,
    }),
  };
}

export function useNarratorModulesSectionViewModel(props = {}) {
  return getNarratorModulesSectionViewProps(props);
}
