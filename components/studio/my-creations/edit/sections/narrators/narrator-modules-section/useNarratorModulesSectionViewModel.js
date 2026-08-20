import {
  narratorResponseDirectionDefaults,
} from "@/components/studio/create/narrator/narratorModulePresets";
import { getNarratorModuleSelectorViewProps } from "@/components/studio/create/narrator/narrator-module-selector/useNarratorModuleSelectorViewModel";

const DEFAULT_MODULES = Object.freeze({
  prose_style: "cinematic",
  detail_level: "balanced",
  pacing: "balanced",
  atmosphere: "adventurous",
});

const STORY_PRESENTATION_MODULE_FIELDS = Object.freeze([
  "prose_style",
  "detail_level",
  "pacing",
  "atmosphere",
]);

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Narrator Editor",
  sectionTitle: "Narrator Modules",
  sectionDescription:
    "Edit the Story Presentation modules that shape prose, descriptive density, intra-beat pacing pressure, and atmosphere across Composer responses.",
});

function resolveSelectedModules(data) {
  const authored = data?.selected_modules || data?.selectedModules || {};

  return Object.fromEntries(
    STORY_PRESENTATION_MODULE_FIELDS.map((field) => [
      field,
      authored?.[field] || DEFAULT_MODULES[field],
    ])
  );
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
