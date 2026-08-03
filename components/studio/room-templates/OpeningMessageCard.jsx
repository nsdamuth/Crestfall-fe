"use client";

import OpeningMessageCardView from "./opening-message-card/OpeningMessageCard.view";
import { useOpeningMessageCardViewModel } from "./opening-message-card/useOpeningMessageCardViewModel";

export default function OpeningMessageCard(props) {
  const viewProps = useOpeningMessageCardViewModel(props);

  return <OpeningMessageCardView {...viewProps} />;
}
