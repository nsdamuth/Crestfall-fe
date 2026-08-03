import { notFound } from "next/navigation";

import ImagePresetStyleMediumSectionPreviewClient from "./ImagePresetStyleMediumSectionPreviewClient";

export default function ImagePresetStyleMediumSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ImagePresetStyleMediumSectionPreviewClient />;
}
