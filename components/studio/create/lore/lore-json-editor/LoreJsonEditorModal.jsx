"use client";

import LoreJsonEditorModalView from "./LoreJsonEditorModal.view";
import { useLoreJsonEditorViewModel } from "./useLoreJsonEditorViewModel";

export default function LoreJsonEditorModal(props) {
  const viewProps = useLoreJsonEditorViewModel(props);

  return <LoreJsonEditorModalView {...viewProps} />;
}
