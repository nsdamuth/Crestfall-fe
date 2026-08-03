import { notFound } from "next/navigation";
import MediaTileQuickActionsPreviewClient from "./MediaTileQuickActionsPreviewClient";

export default function MediaTileQuickActionsPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <MediaTileQuickActionsPreviewClient />;
}
