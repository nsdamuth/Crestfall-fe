import { notFound } from "next/navigation";

import CharacterTemplateFieldsSectionPreviewClient from "./CharacterTemplateFieldsSectionPreviewClient";

export default function CharacterTemplateFieldsSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CharacterTemplateFieldsSectionPreviewClient />;
}
