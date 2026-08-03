import { notFound } from "next/navigation";

import CharacterTemplatePickerPreviewClient from "./CharacterTemplatePickerPreviewClient";

export default function CharacterTemplatePickerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CharacterTemplatePickerPreviewClient />;
}
