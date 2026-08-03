import { notFound } from "next/navigation";

import RoomTemplateOpeningSectionPreviewClient from "./RoomTemplateOpeningSectionPreviewClient";

export default function RoomTemplateOpeningSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <RoomTemplateOpeningSectionPreviewClient />;
}
