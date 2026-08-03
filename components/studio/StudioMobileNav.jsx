"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import StudioEconomyWidget from "@/components/studio/StudioEconomyWidget";
import StudioMobileNavView from "@/components/studio/studio-mobile-nav/StudioMobileNav.view";
import { useStudioMobileNavViewModel } from "@/components/studio/studio-mobile-nav/useStudioMobileNavViewModel";

export default function StudioMobileNav({ user }) {
  const pathname = usePathname();
  const viewModel = useStudioMobileNavViewModel({ user, pathname });

  return (
    <StudioMobileNavView
      {...viewModel}
      InternalLinkComponent={Link}
      headerEconomySlot={<StudioEconomyWidget variant="mobileHeader" />}
      drawerEconomySlot={<StudioEconomyWidget variant="drawer" />}
    />
  );
}
