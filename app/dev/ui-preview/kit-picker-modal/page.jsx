import { notFound } from "next/navigation";

import KitPickerModalPreviewClient from "./KitPickerModalPreviewClient";

export default function KitPickerModalPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitPickerModalPreviewClient />;
}
