// PRE-PARITY. Fixture-driven page only, built under the v2 staging
// address per docs/BUILD-BLUEPRINT.md chapter 3, section 3.3 (route
// law): stays out of the sidebar until the whole nine-page set clears
// the cutover sequence in docs/CRESTFALL-DESIGN-CONTEXT.md. No live
// data, no API calls.
//
// Sprint G wave 1 (docs/SPRINT-G-PLAN.md section 1): Home, the ruled
// guidepost. Composition lives in ./Home.jsx (Binding Shell) and is
// mirrored at /dev/ui-preview/home-v2-page for auth-free verification.

import Home from "./Home";

export default function HomeV2Page() {
  return <Home />;
}
