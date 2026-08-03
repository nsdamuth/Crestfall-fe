import { notFound } from "next/navigation";

import LocationBuilderPreviewClient from "./LocationBuilderPreviewClient";

export default function LocationBuilderPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <LocationBuilderPreviewClient />;
}
