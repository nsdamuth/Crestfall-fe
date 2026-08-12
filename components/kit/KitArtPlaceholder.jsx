"use client";

import KitArtPlaceholderView from "./art-placeholder/KitArtPlaceholder.view";
import { useKitArtPlaceholderViewModel } from "./art-placeholder/useKitArtPlaceholderViewModel";

export default function KitArtPlaceholder(props) {
  const viewProps = useKitArtPlaceholderViewModel(props);

  return <KitArtPlaceholderView {...viewProps} />;
}
