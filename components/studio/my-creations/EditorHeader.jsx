"use client";

import EditorHeaderView from "./editor-header/EditorHeader.view";
import { useEditorHeaderViewModel } from "./editor-header/useEditorHeaderViewModel";

export default function EditorHeader(props) {
  const viewProps = useEditorHeaderViewModel(props);

  return <EditorHeaderView {...viewProps} />;
}
