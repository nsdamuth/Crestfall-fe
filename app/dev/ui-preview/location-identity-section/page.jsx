import { notFound } from "next/navigation";

import LocationIdentitySectionPreviewClient from "./LocationIdentitySectionPreviewClient";

export default function LocationIdentitySectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <LocationIdentitySectionPreviewClient />;
}
