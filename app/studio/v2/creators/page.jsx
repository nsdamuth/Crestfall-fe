// PRE-PARITY. Fixture-driven mockup only, built under the v2 staging
// address per docs/BUILD-BLUEPRINT.md chapter 3, section 3.3 (route
// law): stays out of the sidebar until it passes the parity check in
// section 3.4. No live data, no API calls, no real navigation. Do not
// link this route from any nav list until a parity echo clears it.
//
// Build order row 2 (docs/BUILD-BLUEPRINT.md 3.1): reuses page 1's
// skeleton wholesale (filter bar, load-more), introduces the
// creator-card species in page composition. The composition lives in
// CreatorsV2Mockup.jsx and is mirrored at /dev/ui-preview/creators-v2-page
// for auth-free verification.
//
// Parity echo: run this pass, see docs/SPRINT-A-SONNET-BRIEF.md report
// (Phase 5 section) and the sprint handoff for the full echo against
// docs/APP-FUNCTION-MAP.csv rows for /studio/profile,
// /studio/profile/[username], and /studio/profile/[username]/connections.

import CreatorsV2Mockup from "./CreatorsV2Mockup";

export default function CreatorsV2Page() {
  return <CreatorsV2Mockup />;
}
