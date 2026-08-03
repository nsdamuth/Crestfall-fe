import { notFound } from "next/navigation";

import CreationEditMediaPanelPreviewClient from "./CreationEditMediaPanelPreviewClient";

export default function CreationEditMediaPanelPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreationEditMediaPanelPreviewClient />;
}
