import { notFound } from "next/navigation";
import CharacterTemplateBuilderPreviewClient from "./CharacterTemplateBuilderPreviewClient";

export default function CharacterTemplateBuilderPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CharacterTemplateBuilderPreviewClient />;
}
