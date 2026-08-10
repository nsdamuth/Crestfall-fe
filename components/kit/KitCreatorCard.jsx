"use client";

import KitCreatorCardView from "./creator-card/KitCreatorCard.view";
import { useKitCreatorCardViewModel } from "./creator-card/useKitCreatorCardViewModel";

export default function KitCreatorCard(props) {
  const viewProps = useKitCreatorCardViewModel(props);

  return <KitCreatorCardView {...viewProps} />;
}
