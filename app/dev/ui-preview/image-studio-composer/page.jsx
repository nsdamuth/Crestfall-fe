import { notFound } from "next/navigation";

import ImageStudioComposerPreviewClient from "./ImageStudioComposerPreviewClient";

export default function ImageStudioComposerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ImageStudioComposerPreviewClient />;
}
