import { notFound } from "next/navigation";

import LoreV2PagePreviewClient from "./LoreV2PagePreviewClient";

// Fixture mirror of the full Lore v2 composition, so this and future
// sessions can verify the whole page without auth. Harness only,
// never product; the product staging address is /studio/v2/lore.
export default function LoreV2PagePreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <LoreV2PagePreviewClient />;
}
