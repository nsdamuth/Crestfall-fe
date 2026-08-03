"use client";

import AdvancedPromptingEditorView from "./advanced-prompting/AdvancedPromptingEditor.view";
import { useAdvancedPromptingViewModel } from "./advanced-prompting/useAdvancedPromptingViewModel";

export default function AdvancedPromptingEditor(props) {
  const viewProps = useAdvancedPromptingViewModel(props);

  return <AdvancedPromptingEditorView {...viewProps} />;
}
