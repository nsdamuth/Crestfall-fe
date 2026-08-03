"use client";

import MechanicsJsonEditorModal from "../mechanics-json-editor/MechanicsJsonEditorModal";
import MechanicsPresetApplicationModal from "../mechanics-preset-application/MechanicsPresetApplicationModal";
import MechanicsPresetValidationPanel from "../mechanics-preset-validation/MechanicsPresetValidationPanel";
import MechanicsDocumentOrchestrationControlsView from "./MechanicsDocumentOrchestration.view.jsx";

export { useMechanicsDocumentOrchestrationViewModel } from "./useMechanicsDocumentOrchestrationViewModel.js";

export function MechanicsDocumentOrchestrationControls(props) {
  return <MechanicsDocumentOrchestrationControlsView {...props} />;
}

export function MechanicsDocumentOrchestrationSurfaces({
  mechanicsData = {},
  canReplaceData = false,
  presetLibraryOpen = false,
  jsonEditorOpen = false,
  presetValidationGuide = null,
  onApplyPreset = null,
  onApplyJson = null,
  onClosePresetLibrary = null,
  onCloseJsonEditor = null,
  onDismissPresetValidationGuide = null,
}) {
  return (
    <>
      {presetValidationGuide ? (
        <MechanicsPresetValidationPanel
          guide={presetValidationGuide}
          onDismiss={onDismissPresetValidationGuide}
        />
      ) : null}

      {presetLibraryOpen && canReplaceData ? (
        <MechanicsPresetApplicationModal
          moduleData={mechanicsData}
          onApply={onApplyPreset}
          onClose={onClosePresetLibrary}
        />
      ) : null}

      {jsonEditorOpen && canReplaceData ? (
        <MechanicsJsonEditorModal
          mechanicsData={mechanicsData}
          onApply={onApplyJson}
          onClose={onCloseJsonEditor}
        />
      ) : null}
    </>
  );
}
