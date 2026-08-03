import { notFound } from "next/navigation";

import LocationVisualDescriptionSectionPreviewClient from "./LocationVisualDescriptionSectionPreviewClient";

export default function LocationVisualDescriptionSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <LocationVisualDescriptionSectionPreviewClient />;
}
