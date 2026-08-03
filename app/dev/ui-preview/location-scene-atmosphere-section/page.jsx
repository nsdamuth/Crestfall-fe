import { notFound } from "next/navigation";

import LocationSceneAtmosphereSectionPreviewClient from "./LocationSceneAtmosphereSectionPreviewClient";

export default function LocationSceneAtmosphereSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <LocationSceneAtmosphereSectionPreviewClient />;
}
