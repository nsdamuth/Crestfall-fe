import { notFound } from "next/navigation";

import CharacterAppearanceSectionPreviewClient from "./CharacterAppearanceSectionPreviewClient";

export default function CharacterAppearanceSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CharacterAppearanceSectionPreviewClient />;
}
