import { notFound } from "next/navigation";

import ImageStudioV2PreviewClient from "./ImageStudioV2PreviewClient";

export default function ImageStudioV2PreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ImageStudioV2PreviewClient />;
}
