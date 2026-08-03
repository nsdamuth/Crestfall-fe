import { notFound } from "next/navigation";

import InvitedPlayersPanelPreviewClient from "./InvitedPlayersPanelPreviewClient";

export default function InvitedPlayersPanelPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <InvitedPlayersPanelPreviewClient />;
}
