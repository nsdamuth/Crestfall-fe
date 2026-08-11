import { notFound } from "next/navigation";

import StudioV2PagePreviewClient from "./StudioV2PagePreviewClient";

// Fixture mirror of the full Studio v2 composition, so this and future
// sessions can verify the whole page without auth. Harness only,
// never product; the product staging address is /studio/v2/studio.
export default function StudioV2PagePreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <StudioV2PagePreviewClient />;
}
