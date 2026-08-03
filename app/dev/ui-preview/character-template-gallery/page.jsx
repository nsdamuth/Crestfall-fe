import { notFound } from "next/navigation";

import CharacterTemplateGalleryPreviewClient from "./CharacterTemplateGalleryPreviewClient";

export default function CharacterTemplateGalleryPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CharacterTemplateGalleryPreviewClient />;
}
