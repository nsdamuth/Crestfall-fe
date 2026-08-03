"use client";

import RulesCodexEditorView from "./rules-codex-editor/RulesCodexEditor.view";
import { useRulesCodexEditorViewModel } from "./rules-codex-editor/useRulesCodexEditorViewModel";

export default function RulesCodexEditor(props) {
  const viewProps = useRulesCodexEditorViewModel(props);

  return <RulesCodexEditorView {...viewProps} />;
}
