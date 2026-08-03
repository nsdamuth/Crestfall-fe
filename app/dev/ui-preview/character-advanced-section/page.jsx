import { notFound } from "next/navigation";

import CharacterAdvancedSectionPreviewClient from "./CharacterAdvancedSectionPreviewClient";

export default function CharacterAdvancedSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CharacterAdvancedSectionPreviewClient />;
}
