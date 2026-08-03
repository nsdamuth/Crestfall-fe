import { notFound } from "next/navigation";

import CreationReferenceImagePickerPreviewClient from "./CreationReferenceImagePickerPreviewClient";

export default function CreationReferenceImagePickerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreationReferenceImagePickerPreviewClient />;
}
