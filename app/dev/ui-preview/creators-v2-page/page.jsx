import { notFound } from "next/navigation";

import CreatorsV2PagePreviewClient from "./CreatorsV2PagePreviewClient";

// Fixture mirror of the full Creators v2 composition, so this and
// future sessions can verify the whole page without auth. Harness
// only, never product; the product staging address is
// /studio/v2/creators. Byte-for-byte the pattern of
// CommunityV2PagePreviewClient.jsx.
export default function CreatorsV2PagePreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CreatorsV2PagePreviewClient />;
}
