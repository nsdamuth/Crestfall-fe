"use client";

import { useState } from "react";

import {
  applyMechanicsDocumentReplacement,
  buildMechanicsDocumentOrchestrationCapability,
  normalizeMechanicsPresetValidationGuide,
} from "./mechanicsDocumentOrchestrationOperations.js";

export function useMechanicsDocumentOrchestrationViewModel({
  mechanicsData = {},
  canReplaceData = false,
  onReplaceMechanicsData = null,
} = {}) {
  const [jsonEditorOpen, setJsonEditorOpen] = useState(false);
  const [presetLibraryOpen, setPresetLibraryOpen] = useState(false);
  const [presetValidationGuide, setPresetValidationGuide] = useState(null);
  const capability = buildMechanicsDocumentOrchestrationCapability(
    canReplaceData
  );

  function openPresetLibrary() {
    if (!capability.canReplaceData) return;
    setPresetLibraryOpen(true);
  }

  function openJsonEditor() {
    if (!capability.canReplaceData) return;
    setJsonEditorOpen(true);
  }

  function applyPreset(nextData, _audit, liveValidationGuide) {
    const result = applyMechanicsDocumentReplacement({
      nextData,
      onReplaceMechanicsData,
    });

    if (!result.ok) return false;

    setPresetValidationGuide(
      normalizeMechanicsPresetValidationGuide(liveValidationGuide)
    );
    return true;
  }

  function applyJson(nextData) {
    const result = applyMechanicsDocumentReplacement({
      nextData,
      onReplaceMechanicsData,
    });

    if (!result.ok) return false;

    setPresetValidationGuide(null);
    return true;
  }

  function dismissPresetValidationGuide() {
    setPresetValidationGuide(null);
  }

  return {
    controlsProps: {
      ...capability,
      onOpenPresetLibrary: openPresetLibrary,
      onOpenJsonEditor: openJsonEditor,
    },
    surfacesProps: {
      mechanicsData,
      canReplaceData: capability.canReplaceData,
      presetLibraryOpen,
      jsonEditorOpen,
      presetValidationGuide,
      onApplyPreset: applyPreset,
      onApplyJson: applyJson,
      onClosePresetLibrary: () => setPresetLibraryOpen(false),
      onCloseJsonEditor: () => setJsonEditorOpen(false),
      onDismissPresetValidationGuide: dismissPresetValidationGuide,
    },
    dismissPresetValidationGuide,
  };
}
