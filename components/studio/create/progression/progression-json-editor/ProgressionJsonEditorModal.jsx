"use client";

import ProgressionJsonEditorModalView from "./ProgressionJsonEditorModal.view";
import { useProgressionJsonEditorViewModel } from "./useProgressionJsonEditorViewModel";

export default function ProgressionJsonEditorModal(props) {
  const viewProps = useProgressionJsonEditorViewModel(props);

  return <ProgressionJsonEditorModalView {...viewProps} />;
}
