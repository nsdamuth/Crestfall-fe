// See StudioSidebar.tsx: "StudioMobileNav" is the shim, previewed via its
// real prop surface (user, pathname, open, onCloseMenu). socialOpen is the
// hook's own interactive-only local state.
import StudioMobileNav from "../shims/StudioMobileNavShim";

export function DrawerOpen() {
  return (
    <StudioMobileNav
      user={{ email: "lilith@vermillioncoast.example" }}
      pathname="/studio"
      open
      onCloseMenu={() => {}}
    />
  );
}

export function DrawerClosed() {
  return (
    <StudioMobileNav
      user={{ email: "lilith@vermillioncoast.example" }}
      pathname="/studio"
      open={false}
      onCloseMenu={() => {}}
    />
  );
}
