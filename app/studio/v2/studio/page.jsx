// PRE-PARITY. Fixture-driven create hub, live only where the existing
// CharacterCreatorModal is live (docs/BUILD-BLUEPRINT.md chapter 3,
// section 3.3, route law): stays out of the sidebar until the whole
// nine-page set clears the cutover sequence in
// docs/CRESTFALL-DESIGN-CONTEXT.md. No live data on the hub itself, no
// API calls from this page's own fixtures.
//
// docs/STUDIO-SPEC.md Brief S1 (section 8.1): the Studio hub.
// Composition lives in ./Studio.jsx (Binding Shell) and is mirrored at
// /dev/ui-preview/studio-v2-page for auth-free verification.

import Studio from "./Studio";

export default function StudioV2Page() {
  return <Studio />;
}
