// PRE-PARITY. Fixture-driven page only, built under the v2 staging
// address per docs/BUILD-BLUEPRINT.md chapter 3, section 3.3 (route
// law): stays out of the sidebar until it passes the parity check.
// No live data, no API calls. Dynamic [handle] segment, resolved
// fixture-first (../creator-profile/creatorProfileContent.mock.js),
// same precedent as the editor's [id] route (../../editor/[id]/
// page.jsx) resolving against editorSavedCreations.mock.js.
//
// Composition lives in ../CreatorProfile.jsx (Binding Shell) and is
// mirrored at /dev/ui-preview/creators-profile-v2-page for auth-free
// verification. Parity echo: docs/PARITY-ECHO-FULL.md Creators rows
// 796-818, the entire profile-detail page.
import CreatorProfile from "../CreatorProfile";

export default async function CreatorProfileV2Page({ params }) {
  const { handle } = await params;

  return <CreatorProfile handle={handle} />;
}
