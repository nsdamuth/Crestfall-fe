// PRE-PARITY. Fixture-driven page only, built under the v2 staging
// address per docs/BUILD-BLUEPRINT.md chapter 3, section 3.3 (route
// law): stays out of the sidebar until the whole nine-page set clears
// the cutover sequence in docs/CRESTFALL-DESIGN-CONTEXT.md. No live
// data, no API calls.
//
// Sprint H wave H3 (docs/SPRINT-H-PLAN.md section 5.7): Lore, the
// index page. Composition lives in ./Lore.jsx (Binding Shell) and is
// mirrored at /dev/ui-preview/lore-v2-page for auth-free
// verification.

import Lore from "./Lore";

export default function LoreV2Page() {
  return <Lore />;
}
