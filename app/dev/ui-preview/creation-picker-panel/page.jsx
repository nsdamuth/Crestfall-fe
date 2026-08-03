import { notFound } from "next/navigation";

import CreationPickerPanelPreviewClient from "./CreationPickerPanelPreviewClient";

export default function CreationPickerPanelPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreationPickerPanelPreviewClient />;
}
