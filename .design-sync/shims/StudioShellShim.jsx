"use client";

// Presentation-only replacement for components/studio/StudioShell.jsx.
// Composes the three frame shims exactly as the real Binding Shell
// composes StudioSidebar/StudioMobileNav/StudioTopBar, owning the one
// piece of shared state (mobile drawer open/closed) the same way.
// StudioAccountProvider is not wrapped here: it supplies live
// coin-balance/account-status context (components/studio/StudioAccountProvider.jsx)
// that the EconomySlotStub deliberately does not depend on.
import { useState } from "react";

import StudioShellView from "@/components/studio/studio-shell/StudioShell.view";
import { useStudioShellViewModel } from "@/components/studio/studio-shell/useStudioShellViewModel";

import StudioSidebarShim from "./StudioSidebarShim";
import StudioMobileNavShim from "./StudioMobileNavShim";
import StudioTopBarShim from "./StudioTopBarShim";

export default function StudioShellShim({ user, pathname = "/studio/v2/editor", children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const viewProps = useStudioShellViewModel({
    sidebarSlot: <StudioSidebarShim user={user} pathname={pathname} />,
    mobileNavSlot: (
      <StudioMobileNavShim
        user={user}
        pathname={pathname}
        open={mobileMenuOpen}
        onCloseMenu={() => setMobileMenuOpen(false)}
      />
    ),
    topBarSlot: (
      <StudioTopBarShim user={user} onOpenMenu={() => setMobileMenuOpen(true)} />
    ),
    children,
  });

  return <StudioShellView {...viewProps} />;
}
