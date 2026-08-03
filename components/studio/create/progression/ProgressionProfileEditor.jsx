"use client";

import ProgressionProfileEditorView from "./progression-profile-editor/ProgressionProfileEditor.view";
import { useProgressionProfileEditorViewModel } from "./progression-profile-editor/useProgressionProfileEditorViewModel";

export default function ProgressionProfileEditor(props) {
  const viewProps = useProgressionProfileEditorViewModel(props);
  return <ProgressionProfileEditorView {...viewProps} />;
}
