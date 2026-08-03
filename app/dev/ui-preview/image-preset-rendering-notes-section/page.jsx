import { notFound } from "next/navigation";

import ImagePresetRenderingNotesSectionPreviewClient from "./ImagePresetRenderingNotesSectionPreviewClient";

export default function ImagePresetRenderingNotesSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ImagePresetRenderingNotesSectionPreviewClient />;
}
