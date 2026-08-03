"use client";

import HairModalView from "./hair/HairModal.view";
import { useHairModalViewModel } from "./hair/useHairModalViewModel";

export default function HairModal(props) {
  const viewProps = useHairModalViewModel(props);

  return <HairModalView {...viewProps} />;
}
