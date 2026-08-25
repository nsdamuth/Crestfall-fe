// PRE-PARITY. Fixture-driven mockup only, built under the v2 staging
// address per docs/BUILD-BLUEPRINT.md chapter 3, section 3.3 (route
// law): stays out of the sidebar until it passes the parity check in
// section 3.4. No live data, no API calls, no real navigation. Do not
// link this route from any nav list until a parity echo clears it.
//
// Build order row 4 (docs/BUILD-BLUEPRINT.md 3.1): Stories, the hub
// only. The chat room [id] surface is excluded by the standing
// sweep-scope ruling (blueprint 3.1 row 4). The composition lives in
// StoriesV2Mockup.jsx and is mirrored at /dev/ui-preview/stories-v2-page
// for auth-free verification. Per docs/SPRINT-D-PLAN.md section 3 (W3).
//
// Parity echo: run this pass, see the Sprint D session report (Phase
// 7 section) for the full echo against docs/APP-FUNCTION-MAP.csv rows
// for /studio/story-rooms, /studio/story-rooms/[id], and the
// unassigned /studio/games rows.

import StoriesV2Mockup from "./StoriesV2Mockup";

export default function StoriesV2Page() {
  return <StoriesV2Mockup />;
}
