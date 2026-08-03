import { notFound } from "next/navigation";

import ImagePresetPromptStackSectionPreviewClient from "./ImagePresetPromptStackSectionPreviewClient";

export default function ImagePresetPromptStackSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ImagePresetPromptStackSectionPreviewClient />;
}
