"use client";

import StructuredRegistryJsonEditorModalView from "./StructuredRegistryJsonEditorModal.view";
import { useStructuredRegistryJsonEditorViewModel } from "./useStructuredRegistryJsonEditorViewModel";

export default function StructuredRegistryJsonEditorModal(props) {
  const viewProps = useStructuredRegistryJsonEditorViewModel(props);
  return <StructuredRegistryJsonEditorModalView {...viewProps} />;
}
