import { notFound } from "next/navigation";

import RoomTemplateMultiplayerSectionPreviewClient from "./RoomTemplateMultiplayerSectionPreviewClient";

export default function RoomTemplateMultiplayerSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <RoomTemplateMultiplayerSectionPreviewClient />;
}
