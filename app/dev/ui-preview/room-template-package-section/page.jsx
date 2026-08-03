import { notFound } from "next/navigation";

import RoomTemplatePackageSectionPreviewClient from "./RoomTemplatePackageSectionPreviewClient";

export default function RoomTemplatePackageSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <RoomTemplatePackageSectionPreviewClient />;
}
