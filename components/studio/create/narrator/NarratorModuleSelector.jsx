"use client";

import NarratorModuleSelectorView from "./narrator-module-selector/NarratorModuleSelector.view";
import { useNarratorModuleSelectorViewModel } from "./narrator-module-selector/useNarratorModuleSelectorViewModel";

export default function NarratorModuleSelector(props) {
  const viewProps = useNarratorModuleSelectorViewModel(props);

  return <NarratorModuleSelectorView {...viewProps} />;
}
