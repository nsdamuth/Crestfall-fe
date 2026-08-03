import { notFound } from "next/navigation";

import ResponsiveFilterPanelPreviewClient from "./ResponsiveFilterPanelPreviewClient";

export default function ResponsiveFilterPanelPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ResponsiveFilterPanelPreviewClient />;
}
