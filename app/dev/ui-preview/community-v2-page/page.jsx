import { notFound } from "next/navigation";

import CommunityV2PagePreviewClient from "./CommunityV2PagePreviewClient";

// Fixture mirror of the full Community v2 composition, so this and
// future sessions can verify the whole page without auth. Harness
// only, never product; the product staging address is
// /studio/v2/community, where StudioLayout's StudioShell already
// supplies StudioSidebar and StudioTopBar. This mirror now composes
// StudioShellView with fixture sidebar props and a real StudioTopBar
// (harness-only, no account/network calls) so the sticky-stack and
// full-bleed relationships (docs/BUILD-BLUEPRINT.md, sticky filter
// bar) can be verified without auth, sidebar collapsed and expanded.
export default function CommunityV2PagePreview() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CommunityV2PagePreviewClient />;
}
