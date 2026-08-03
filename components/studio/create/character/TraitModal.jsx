"use client";

import TraitModalView from "./trait/TraitModal.view";
import { useTraitModalViewModel } from "./trait/useTraitModalViewModel";

export default function TraitModal(props) {
  const viewProps = useTraitModalViewModel(props);

  return <TraitModalView {...viewProps} />;
}
