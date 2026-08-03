"use client";

import LoreJsonEditorModal from "./lore-json-editor/LoreJsonEditorModal";
import LoreEditorView from "./lore-editor/LoreEditor.view";
import { useLoreEditorViewModel } from "./lore-editor/useLoreEditorViewModel";

export default function LoreEditor(props) {
  const viewProps = useLoreEditorViewModel(props);
  const jsonEditorSlot = viewProps.jsonEditorOpen ? (
    <LoreJsonEditorModal
      loreDocument={viewProps.document}
      onApply={viewProps.onApplyJsonDocument}
      onClose={viewProps.onCloseJsonEditor}
    />
  ) : null;

  return <LoreEditorView {...viewProps} jsonEditorSlot={jsonEditorSlot} />;
}
