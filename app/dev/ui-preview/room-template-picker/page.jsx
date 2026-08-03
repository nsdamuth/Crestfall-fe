import { notFound } from "next/navigation";

import RoomTemplatePickerPreviewClient from "./RoomTemplatePickerPreviewClient";

export default function RoomTemplatePickerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <RoomTemplatePickerPreviewClient />;
}
