"use client";

import MultiTraitModalView from "./multi-trait/MultiTraitModal.view";
import { useMultiTraitModalViewModel } from "./multi-trait/useMultiTraitModalViewModel";

export default function MultiTraitModal(props) {
  const viewProps = useMultiTraitModalViewModel(props);

  return <MultiTraitModalView {...viewProps} />;
}
