import { notFound } from "next/navigation";

import CommunityV2Mockup from "@/app/studio/v2/community/CommunityV2Mockup";

// Fixture mirror of the full Community v2 composition, so this and
// future sessions can verify the whole page without auth. Harness
// only, never product; the product staging address is
// /studio/v2/community.
export default function CommunityV2PagePreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CommunityV2Mockup />;
}
