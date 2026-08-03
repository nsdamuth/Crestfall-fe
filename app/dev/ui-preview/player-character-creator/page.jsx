import { notFound } from "next/navigation";

import PlayerCharacterCreatorPreviewClient from "./PlayerCharacterCreatorPreviewClient";

export default function PlayerCharacterCreatorPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <PlayerCharacterCreatorPreviewClient />;
}
