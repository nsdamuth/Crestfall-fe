"use client";

import LoreEngineUseJsonEditorModalView from "./LoreEngineUseJsonEditorModal.view";
import { useLoreEngineUseJsonEditorViewModel } from "./useLoreEngineUseJsonEditorViewModel";

export default function LoreEngineUseJsonEditorModal(props) {
  const viewProps = useLoreEngineUseJsonEditorViewModel(props);
  return <LoreEngineUseJsonEditorModalView {...viewProps} />;
}
