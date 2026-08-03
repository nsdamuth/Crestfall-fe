import { notFound } from "next/navigation";

import VideoToolsPanelPreviewClient from "./VideoToolsPanelPreviewClient";

export default function VideoToolsPanelPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <VideoToolsPanelPreviewClient />;
}
