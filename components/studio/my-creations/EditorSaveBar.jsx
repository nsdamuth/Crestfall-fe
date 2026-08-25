"use client";

import EditorSaveBarView from "./editor-save-bar/EditorSaveBar.view";
import { useEditorSaveBarViewModel } from "./editor-save-bar/useEditorSaveBarViewModel";

export default function EditorSaveBar(props) {
  const viewProps = useEditorSaveBarViewModel(props);

  return <EditorSaveBarView {...viewProps} />;
}
