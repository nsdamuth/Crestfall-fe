"use client";

import LoreEngineUseJsonEditorModal from "./lore-engine-use/LoreEngineUseJsonEditorModal";
import LoreEngineUseView from "./lore-engine-use/LoreEngineUse.view";
import { useLoreEngineUseViewModel } from "./lore-engine-use/useLoreEngineUseViewModel";

export default function LoreEngineUse(props) {
  const viewProps = useLoreEngineUseViewModel(props);
  const jsonEditorSlot = viewProps.jsonEditorOpen ? (
    <LoreEngineUseJsonEditorModal
      configuration={viewProps.authoringConfiguration}
      source={viewProps.authoringSource}
      storyContextOptions={viewProps.storyContextOptions}
      storyContextLoadStatus={viewProps.storyContextLoadStatus}
      onApply={viewProps.applyImportedEngineUseConfiguration}
      onClose={viewProps.closeJsonEditor}
    />
  ) : null;

  return <LoreEngineUseView {...viewProps} jsonEditorSlot={jsonEditorSlot} />;
}
