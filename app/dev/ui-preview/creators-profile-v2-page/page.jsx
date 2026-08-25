import { notFound } from "next/navigation";

import CreatorsProfileV2PagePreviewClient from "./CreatorsProfileV2PagePreviewClient";

// Fixture mirror of the full Creator Profile v2 composition, so this
// and future sessions can verify the whole page without auth. Harness
// only, never product; the product staging address is
// /studio/v2/creators/[handle].
export default function CreatorsProfileV2PagePreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreatorsProfileV2PagePreviewClient />;
}
