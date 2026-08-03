"use client";

import Link from "next/link";

import StudioCharacterCardView from "./studio-character-card/StudioCharacterCard.view";
import { useStudioCharacterCardViewModel } from "./studio-character-card/useStudioCharacterCardViewModel";

export default function StudioCharacterCard(props) {
  const viewProps = useStudioCharacterCardViewModel(props);

  return <StudioCharacterCardView {...viewProps} LinkComponent={Link} />;
}
