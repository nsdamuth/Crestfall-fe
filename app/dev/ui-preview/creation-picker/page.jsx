import { notFound } from "next/navigation";

import CreationPickerPreviewClient from "./CreationPickerPreviewClient";

export default function CreationPickerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreationPickerPreviewClient />;
}
