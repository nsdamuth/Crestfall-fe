// PRE-PARITY. Fixture-driven page only, built under the v2 staging
// address per docs/BUILD-BLUEPRINT.md chapter 3, section 3.3 (route
// law): stays out of the sidebar until it passes the parity check.
// No live data, no API calls. Dynamic [handle] segment, resolved
// fixture-first (../../creator-connections/creatorConnectionsContent.mock.js),
// same precedent as ../page.jsx resolving against
// creatorProfileContent.mock.js.
//
// Composition lives in ../../CreatorConnections.jsx (Binding Shell)
// and is mirrored at /dev/ui-preview/creators-connections-v2-page for
// auth-free verification. Parity echo: docs/PARITY-ECHO-FULL.md
// Creators rows 814-818, the connections sub-page.
import CreatorConnections from "../../CreatorConnections";

function normalizeTab(tab) {
  return tab === "following" ? "following" : "followers";
}

export default async function CreatorConnectionsV2Page({ params, searchParams }) {
  const { handle } = await params;
  const resolvedSearchParams = await searchParams;
  const initialTab = normalizeTab(resolvedSearchParams?.tab);

  return <CreatorConnections handle={handle} initialTab={initialTab} />;
}
