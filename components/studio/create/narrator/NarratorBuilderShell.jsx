"use client";

import NarratorBuilderView from "./narrator-builder/NarratorBuilder.view";
import { useNarratorBuilderViewModel } from "./narrator-builder/useNarratorBuilderViewModel";

export default function NarratorBuilderShell(props) {
  const viewProps = useNarratorBuilderViewModel(props);

  return <NarratorBuilderView {...viewProps} />;
}
