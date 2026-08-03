"use client";

import { useRoomTemplateBuilderViewModel } from "@/components/studio/create/room-template/room-template-builder/useRoomTemplateBuilderViewModel";

// Compatibility adapter for legacy callers that still consume the original
// flat Room Template Builder hook result. New LOOM callers should use the
// ViewModel directly.
export function useRoomTemplateBuilder(options) {
  const { viewProps, applicationContentProps } =
    useRoomTemplateBuilderViewModel(options);

  return {
    ...applicationContentProps,
    saveStatus: viewProps.saveStatus,
    saveMessage: viewProps.saveMessage,
    effectiveTurnBased: viewProps.effectiveTurnBased,
    selectedScenario: viewProps.selectedScenario,
    selectedNarrator: viewProps.selectedNarrator,
    selectedLocation: viewProps.selectedLocation,
    completion: viewProps.completion,
  };
}
