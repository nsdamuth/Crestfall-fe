import { notFound } from "next/navigation";

import LocationRuntimeModulesSectionPreviewClient from "./LocationRuntimeModulesSectionPreviewClient";

export default function LocationRuntimeModulesSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <LocationRuntimeModulesSectionPreviewClient />;
}
