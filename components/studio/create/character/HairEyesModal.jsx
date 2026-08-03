"use client";

import HairEyesModalView from "./hair-eyes/HairEyesModal.view";
import { useHairEyesModalViewModel } from "./hair-eyes/useHairEyesModalViewModel";

export default function HairEyesModal(props) {
  const viewProps = useHairEyesModalViewModel(props);

  return <HairEyesModalView {...viewProps} />;
}
