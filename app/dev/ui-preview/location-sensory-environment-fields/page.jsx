import { notFound } from "next/navigation";

import LocationSensoryEnvironmentFieldsPreviewClient from "./LocationSensoryEnvironmentFieldsPreviewClient";

export default function LocationSensoryEnvironmentFieldsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <LocationSensoryEnvironmentFieldsPreviewClient />;
}
