import { notFound } from "next/navigation";

import OutfitPickerPreviewClient from "./OutfitPickerPreviewClient";

export default function OutfitPickerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <OutfitPickerPreviewClient />;
}
