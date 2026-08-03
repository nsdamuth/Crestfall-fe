"use client";

import EyeColorModalView from "./eye-color/EyeColorModal.view";
import { useEyeColorModalViewModel } from "./eye-color/useEyeColorModalViewModel";

export default function EyeColorModal(props) {
  const viewProps = useEyeColorModalViewModel(props);

  return <EyeColorModalView {...viewProps} />;
}
