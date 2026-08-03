"use client";

import SkinToneModalView from "./skin-tone/SkinToneModal.view";
import { useSkinToneModalViewModel } from "./skin-tone/useSkinToneModalViewModel";

export default function SkinToneModal(props) {
  const viewProps = useSkinToneModalViewModel(props);

  return <SkinToneModalView {...viewProps} />;
}
