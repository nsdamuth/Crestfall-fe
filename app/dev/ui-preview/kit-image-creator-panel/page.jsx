import { notFound } from "next/navigation";

import KitImageCreatorPanelPreviewClient from "./KitImageCreatorPanelPreviewClient";

export default function KitImageCreatorPanelPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <KitImageCreatorPanelPreviewClient />;
}
