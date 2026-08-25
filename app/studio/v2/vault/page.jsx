// PRE-PARITY. Fixture-driven mockup only, built under the v2 staging
// address per docs/BUILD-BLUEPRINT.md chapter 3, section 3.3 (route
// law): stays out of the sidebar until it passes the parity check in
// section 3.4. No live data, no API calls, no real navigation. Do not
// link this route from any nav list until a parity echo clears it.
//
// Build order row 3 (docs/BUILD-BLUEPRINT.md 3.1): full skeleton,
// list AND grid creation-card layouts, own-work badge context. The
// standalone edit tree (/studio/my-creations/[id]/edit) stays out of
// scope under the CR-007/CR-008 partial hold; the hub itself converts
// freely. The composition lives in VaultV2Mockup.jsx and is mirrored
// at /dev/ui-preview/vault-v2-page for auth-free verification.
//
// Parity echo: run this pass, see docs/SPRINT-A-SONNET-BRIEF.md report
// (Phase 6 section) and the sprint handoff for the full echo against
// docs/APP-FUNCTION-MAP.csv rows for /studio/my-creations,
// /studio/my-creations/[id]/edit, /studio/my-creations/[id]/preview,
// and /studio/my-creations/[id]/image-library.

import VaultV2Mockup from "./VaultV2Mockup";

export default function VaultV2Page() {
  return <VaultV2Mockup />;
}
