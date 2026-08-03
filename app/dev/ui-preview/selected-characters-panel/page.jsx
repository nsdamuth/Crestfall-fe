import { notFound } from "next/navigation";

import SelectedCharactersPanelPreviewClient from "./SelectedCharactersPanelPreviewClient";

export default function SelectedCharactersPanelPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <SelectedCharactersPanelPreviewClient />;
}
