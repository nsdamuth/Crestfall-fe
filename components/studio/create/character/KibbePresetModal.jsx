"use client";

import KibbePresetModalView from "./kibbe-preset/KibbePresetModal.view";
import { useKibbePresetModalViewModel } from "./kibbe-preset/useKibbePresetModalViewModel";

export default function KibbePresetModal(props) {
  const viewProps = useKibbePresetModalViewModel(props);

  return <KibbePresetModalView {...viewProps} />;
}
