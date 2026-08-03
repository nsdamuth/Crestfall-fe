import { notFound } from "next/navigation";

import StudioCharacterCardPreviewClient from "./StudioCharacterCardPreviewClient";

export default function StudioCharacterCardPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StudioCharacterCardPreviewClient />;
}
