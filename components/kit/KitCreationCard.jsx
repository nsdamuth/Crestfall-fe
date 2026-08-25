"use client";

import KitCreationCardView from "./creation-card/KitCreationCard.view";
import { useKitCreationCardViewModel } from "./creation-card/useKitCreationCardViewModel";

export default function KitCreationCard(props) {
  const viewProps = useKitCreationCardViewModel(props);

  return <KitCreationCardView {...viewProps} />;
}
