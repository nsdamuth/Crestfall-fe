import { notFound } from "next/navigation";

import RoomTemplateIdentitySectionPreviewClient from "./RoomTemplateIdentitySectionPreviewClient";

export default function RoomTemplateIdentitySectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <RoomTemplateIdentitySectionPreviewClient />;
}
