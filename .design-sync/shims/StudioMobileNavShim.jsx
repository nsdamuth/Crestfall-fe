"use client";

// Presentation-only replacement for components/studio/StudioMobileNav.jsx,
// mirroring its wiring minus Next: InternalLinkComponent is "a"
// instead of next/link's Link, and pathname arrives as an explicit
// prop instead of usePathname(). No behavior invented.
import StudioMobileNavView from "@/components/studio/studio-mobile-nav/StudioMobileNav.view";
import { useStudioMobileNavViewModel } from "@/components/studio/studio-mobile-nav/useStudioMobileNavViewModel";

import EconomySlotStub from "./EconomySlotStub";

export default function StudioMobileNavShim({
  user,
  open,
  onCloseMenu,
  pathname = "/studio/v2/editor",
}) {
  const viewModel = useStudioMobileNavViewModel({ user, pathname, open, onCloseMenu });

  return (
    <StudioMobileNavView
      {...viewModel}
      InternalLinkComponent="a"
      drawerEconomySlot={<EconomySlotStub variant="drawer" />}
    />
  );
}
