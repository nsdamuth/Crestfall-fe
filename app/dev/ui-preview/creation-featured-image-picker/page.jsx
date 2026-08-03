import { notFound } from "next/navigation";

import CreationFeaturedImagePickerPreviewClient from "./CreationFeaturedImagePickerPreviewClient";

export default function CreationFeaturedImagePickerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreationFeaturedImagePickerPreviewClient />;
}
