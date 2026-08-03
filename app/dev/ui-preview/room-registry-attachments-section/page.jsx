import { notFound } from "next/navigation";

import RoomRegistryAttachmentsSectionPreviewClient from "./RoomRegistryAttachmentsSectionPreviewClient";

export default function RoomRegistryAttachmentsSectionPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <RoomRegistryAttachmentsSectionPreviewClient />;
}
