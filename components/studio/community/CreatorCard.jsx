"use client";

import Link from "next/link";

import CreatorCardView from "./creator-card/CreatorCard.view";
import { useCreatorCardViewModel } from "./creator-card/useCreatorCardViewModel";

export default function CreatorCard(props) {
  const viewProps = useCreatorCardViewModel(props);

  return <CreatorCardView {...viewProps} LinkComponent={Link} />;
}
