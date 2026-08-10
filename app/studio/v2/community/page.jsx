// PRE-PARITY. Fixture-driven mockup only, built under the v2 staging
// address per docs/BUILD-BLUEPRINT.md chapter 3, section 3.3 (route
// law): stays out of the sidebar until it passes the parity check in
// section 3.4. No live data, no API calls, no real navigation. Do not
// link this route from any nav list until a parity echo clears it.
//
// Rebuilt 9 Aug 2026 on the revised kit (2.16 rulings): one-line
// filter bar with branded dropdowns, full-bleed cards with overlay
// actions, rating facet as a dropdown (Everyone, Teen, and Adult all
// live per CR-027, ruled final in the kit polish 2 pass). The
// composition lives in CommunityV2Mockup.jsx and is mirrored at
// /dev/ui-preview/community-v2-page for auth-free verification.
//
// Parity echo: not yet run. That echo is a build-order task, not
// this fixture pass.

import CommunityV2Mockup from "./CommunityV2Mockup";

export default function CommunityV2Page() {
  return <CommunityV2Mockup />;
}
