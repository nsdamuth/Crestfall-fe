// PRE-PARITY. Fixture-driven page only, built under the v2 staging
// address per docs/BUILD-BLUEPRINT.md chapter 3, section 3.3 (route
// law): stays out of the sidebar until the whole nine-page set clears
// the cutover sequence in docs/CRESTFALL-DESIGN-CONTEXT.md. No live
// data, no API calls.
//
// Sprint H wave H4 (docs/SPRINT-H-PLAN.md section 3): Adventures, the
// smallest surface. Composition lives in ./Adventures.jsx (Binding
// Shell) and is mirrored at /dev/ui-preview/adventures-v2-page for
// auth-free verification.

import Adventures from "./Adventures";

export default function AdventuresV2Page() {
  return <Adventures />;
}
