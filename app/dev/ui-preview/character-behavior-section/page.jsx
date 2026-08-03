import { notFound } from "next/navigation";

import CharacterBehaviorSectionPreviewClient from "./CharacterBehaviorSectionPreviewClient";

export default function CharacterBehaviorSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CharacterBehaviorSectionPreviewClient />;
}
