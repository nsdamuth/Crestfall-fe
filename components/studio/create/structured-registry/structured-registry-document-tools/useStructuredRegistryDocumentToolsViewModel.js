"use client";

import { useState } from "react";

const ENABLED_REGISTRY_TYPES = new Set(["QUEST_REGISTRY", "EVENT_REGISTRY"]);

export function useStructuredRegistryDocumentToolsViewModel({
  registryType,
  registryData = {},
  onAddSample = null,
  onReplaceData = null,
} = {}) {
  const safeType = String(registryType || "").toUpperCase();
  const enabled = ENABLED_REGISTRY_TYPES.has(safeType);
  const [sampleLibraryOpen, setSampleLibraryOpen] = useState(false);
  const [jsonEditorOpen, setJsonEditorOpen] = useState(false);

  return {
    controlsProps: {
      enabled,
      sampleButtonTitle: `Open the educational ${safeType === "EVENT_REGISTRY" ? "Event" : "Quest"} Registry sample library`,
      jsonButtonTitle: `Open the complete ${safeType === "EVENT_REGISTRY" ? "Event" : "Quest"} Registry JSON editor`,
      onOpenSampleLibrary: () => enabled && setSampleLibraryOpen(true),
      onOpenJsonEditor: () => enabled && setJsonEditorOpen(true),
    },
    surfacesProps: {
      enabled,
      registryType: safeType,
      registryData,
      sampleLibraryOpen,
      jsonEditorOpen,
      onAddSample,
      onReplaceData,
      onCloseSampleLibrary: () => setSampleLibraryOpen(false),
      onCloseJsonEditor: () => setJsonEditorOpen(false),
    },
  };
}
