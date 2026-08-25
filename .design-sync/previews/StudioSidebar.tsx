// The exported "StudioSidebar" is the shim (../shims/StudioSidebarShim), not
// the raw View, so these stories vary its real prop surface (user, pathname)
// rather than the View's own fixtures (which are shaped for a different
// component). collapsed/socialOpen are the hook's own interactive-only
// local state, not props, not representable in a static preview; verify
// those by toggling in the live web-app smoke test.
import StudioSidebar from "../shims/StudioSidebarShim";

export function StudioHomeActive() {
  return <StudioSidebar user={{ email: "lilith@vermillioncoast.example" }} pathname="/studio" />;
}

export function EditorRouteActive() {
  return (
    <StudioSidebar user={{ email: "lilith@vermillioncoast.example" }} pathname="/studio/v2/editor" />
  );
}

export function SignedOut() {
  return <StudioSidebar pathname="/studio" />;
}
