"use client";

import KitModalFrameView from "./modal-frame/KitModalFrame.view";
import { useKitModalFrameViewModel } from "./modal-frame/useKitModalFrameViewModel";

export default function KitModalFrame(props) {
  const viewProps = useKitModalFrameViewModel(props);

  return <KitModalFrameView {...viewProps} />;
}
