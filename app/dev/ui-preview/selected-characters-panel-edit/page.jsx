import { notFound } from "next/navigation";

import SelectedCharactersPanelEditPreviewClient from "./SelectedCharactersPanelEditPreviewClient";

export default function SelectedCharactersPanelEditPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <SelectedCharactersPanelEditPreviewClient />;
}
