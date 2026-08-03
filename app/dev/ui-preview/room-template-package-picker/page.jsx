import { notFound } from "next/navigation";

import RoomTemplatePackagePickerPreviewClient from "./RoomTemplatePackagePickerPreviewClient";

export default function RoomTemplatePackagePickerPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <RoomTemplatePackagePickerPreviewClient />;
}
