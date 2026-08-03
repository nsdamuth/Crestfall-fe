import { notFound } from "next/navigation";
import LocationRegistryBuilderPreviewClient from "./LocationRegistryBuilderPreviewClient";

export default function LocationRegistryBuilderPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <LocationRegistryBuilderPreviewClient />;
}
