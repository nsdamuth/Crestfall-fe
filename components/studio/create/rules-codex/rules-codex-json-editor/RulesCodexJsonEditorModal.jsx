"use client";

import RulesCodexJsonEditorModalView from "./RulesCodexJsonEditorModal.view";
import { useRulesCodexJsonEditorViewModel } from "./useRulesCodexJsonEditorViewModel";

export default function RulesCodexJsonEditorModal(props) {
  const viewProps = useRulesCodexJsonEditorViewModel(props);
  return <RulesCodexJsonEditorModalView {...viewProps} />;
}
