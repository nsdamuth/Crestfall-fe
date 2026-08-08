"use client";

import { useState } from "react";

import StudioSidebar from "@/components/studio/StudioSidebar";
import StudioMobileNav from "@/components/studio/StudioMobileNav";
import StudioTopBar from "@/components/studio/StudioTopBar";
import { StudioAccountProvider } from "@/components/studio/StudioAccountProvider";

import StudioShellView from "./studio-shell/StudioShell.view";
import { useStudioShellViewModel } from "./studio-shell/useStudioShellViewModel";

// Drawer open/closed is the one piece of state StudioTopBar's mobile
// hamburger (studio-top-bar package) and StudioMobileNav's drawer
// (studio-mobile-nav package) must share. Neither package may own the
// other's state, so it lives here, in the Binding Shell that composes
// both (8 Aug 2026, mobile nav restyle brief item 7).
export default function StudioShell({ user, children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const viewProps = useStudioShellViewModel({
    sidebarSlot: <StudioSidebar user={user} />,
    mobileNavSlot: (
      <StudioMobileNav
        user={user}
        open={mobileMenuOpen}
        onCloseMenu={() => setMobileMenuOpen(false)}
      />
    ),
    topBarSlot: (
      <StudioTopBar user={user} onOpenMenu={() => setMobileMenuOpen(true)} />
    ),
    children,
  });

  return (
    <StudioAccountProvider>
      <StudioShellView {...viewProps} />
    </StudioAccountProvider>
  );
}
