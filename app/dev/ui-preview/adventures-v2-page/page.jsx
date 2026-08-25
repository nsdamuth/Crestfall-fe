import { notFound } from "next/navigation";

import AdventuresV2PagePreviewClient from "./AdventuresV2PagePreviewClient";

// Fixture mirror of the full Adventures v2 composition, so this and
// future sessions can verify the whole page without auth. Harness
// only, never product; the product staging address is
// /studio/v2/adventures.
export default function AdventuresV2PagePreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <AdventuresV2PagePreviewClient />;
}
