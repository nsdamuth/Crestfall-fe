import { notFound } from "next/navigation";

import CommunityV2Mockup from "@/app/studio/v2/community/CommunityV2Mockup";
import StudioTopBar from "@/components/studio/StudioTopBar";

// Fixture mirror of the full Community v2 composition, so this and
// future sessions can verify the whole page without auth. Harness
// only, never product; the product staging address is
// /studio/v2/community, where StudioLayout's StudioShell already
// supplies StudioTopBar. StudioTopBar is added here, harness-only,
// so the sticky-stack relationship (docs/BUILD-BLUEPRINT.md, sticky
// filter bar) can be verified without auth: the top bar needs no
// session data (StudioTopBarView falls back to a "?" account
// initial), so it is safe to render standalone. No onOpenMenu is
// passed: this page is a Server Component and an inline function
// prop cannot cross into the Client Component boundary; StudioTopBar
// already defaults it to a no-op.
export default function CommunityV2PagePreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <>
      <StudioTopBar />
      <CommunityV2Mockup />
    </>
  );
}
