import { notFound } from "next/navigation";

import LocationParentPickerPreviewClient from "./LocationParentPickerPreviewClient";

export default function LocationParentPickerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <LocationParentPickerPreviewClient />;
}
