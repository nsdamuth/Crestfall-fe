import { notFound } from "next/navigation";

import DefaultPlayerCharacterPickerPreviewClient from "./DefaultPlayerCharacterPickerPreviewClient";

export default function DefaultPlayerCharacterPickerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <DefaultPlayerCharacterPickerPreviewClient />;
}
