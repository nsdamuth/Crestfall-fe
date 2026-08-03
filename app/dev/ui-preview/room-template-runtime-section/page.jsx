import { notFound } from "next/navigation";

import RoomTemplateRuntimeSectionPreviewClient from "./RoomTemplateRuntimeSectionPreviewClient";

export default function RoomTemplateRuntimeSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <RoomTemplateRuntimeSectionPreviewClient />;
}
