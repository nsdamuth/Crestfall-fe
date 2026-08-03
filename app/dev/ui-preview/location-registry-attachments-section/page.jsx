import { notFound } from "next/navigation";

import LocationRegistryAttachmentsSectionPreviewClient from "./LocationRegistryAttachmentsSectionPreviewClient";

export default function LocationRegistryAttachmentsSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <LocationRegistryAttachmentsSectionPreviewClient />;
}
