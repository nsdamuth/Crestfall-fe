"use client";

import CrestfallOptionModalView from "./crestfall-option-modal/CrestfallOptionModal.view";
import { useCrestfallOptionModalViewModel } from "./crestfall-option-modal/useCrestfallOptionModalViewModel";

export default function CrestfallOptionModal(props) {
  const viewProps = useCrestfallOptionModalViewModel(props);

  return <CrestfallOptionModalView {...viewProps} />;
}
