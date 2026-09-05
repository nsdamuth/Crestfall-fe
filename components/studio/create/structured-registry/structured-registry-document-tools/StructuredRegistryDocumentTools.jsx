"use client";

import StructuredRegistryJsonEditorModal from "../structured-registry-json-editor/StructuredRegistryJsonEditorModal";
import StructuredRegistrySampleLibraryModal from "../structured-registry-sample-library/StructuredRegistrySampleLibraryModal";
import StructuredRegistryDocumentToolsControlsView from "./StructuredRegistryDocumentTools.view";

export { useStructuredRegistryDocumentToolsViewModel } from "./useStructuredRegistryDocumentToolsViewModel";

export function StructuredRegistryDocumentToolsControls(props) {
  return <StructuredRegistryDocumentToolsControlsView {...props} />;
}

export function StructuredRegistryDocumentToolsSurfaces({
  enabled = false,
  registryType,
  registryData = {},
  sampleLibraryOpen = false,
  jsonEditorOpen = false,
  onAddSample = null,
  onReplaceData = null,
  onCloseSampleLibrary = null,
  onCloseJsonEditor = null,
}) {
  if (!enabled) return null;

  return (
    <>
      {sampleLibraryOpen ? (
        <StructuredRegistrySampleLibraryModal
          registryType={registryType}
          onApply={onAddSample}
          onClose={onCloseSampleLibrary}
        />
      ) : null}

      {jsonEditorOpen ? (
        <StructuredRegistryJsonEditorModal
          registryType={registryType}
          registryData={registryData}
          onApply={onReplaceData}
          onClose={onCloseJsonEditor}
        />
      ) : null}
    </>
  );
}
