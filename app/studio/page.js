import Studio from "./v2/studio/Studio";

// Crestfall V2 convergence cutover foundation:
// /studio is the primary authenticated product landing surface. The historical
// /studio/v2/studio route remains available during convergence, but product
// navigation should treat this route as the canonical Studio entry point.
export default function StudioPage() {
  return <Studio showFixtureHarness={false} />;
}
