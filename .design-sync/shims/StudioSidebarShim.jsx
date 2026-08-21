"use client";

// Presentation-only replacement for components/studio/StudioSidebar.jsx
// (the real Binding Shell), which wires next/link and
// next/navigation's usePathname. Every line here mirrors that real
// wrapper's wiring exactly, minus Next: InternalLinkComponent
// defaults to a plain "a" instead of next/link's Link, and pathname
// arrives as an explicit prop instead of usePathname(). No behavior
// invented; see components/studio/StudioSidebar.jsx for the original.
import StudioSidebarView from "@/components/studio/studio-sidebar/StudioSidebar.view";
import { useStudioSidebarViewModel } from "@/components/studio/studio-sidebar/useStudioSidebarViewModel";

import EconomySlotStub from "./EconomySlotStub";

export default function StudioSidebarShim({ user, pathname = "/studio/v2/editor" }) {
  const viewProps = useStudioSidebarViewModel({ user, pathname });

  return (
    <StudioSidebarView
      {...viewProps}
      InternalLinkComponent="a"
      economySlot={<EconomySlotStub variant={viewProps.collapsed ? "collapsed" : "sidebar"} />}
    />
  );
}
