import { notFound } from "next/navigation";

import ImageStudioWorkbenchPreviewClient from "./ImageStudioWorkbenchPreviewClient";

export default function ImageStudioWorkbenchPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ImageStudioWorkbenchPreviewClient />;
}
