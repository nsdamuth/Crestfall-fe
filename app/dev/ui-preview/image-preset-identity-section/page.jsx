import { notFound } from "next/navigation";

import ImagePresetIdentitySectionPreviewClient from "./ImagePresetIdentitySectionPreviewClient";

export default function ImagePresetIdentitySectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ImagePresetIdentitySectionPreviewClient />;
}
