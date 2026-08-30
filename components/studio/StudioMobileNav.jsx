"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import StudioEconomyWidget from "@/components/studio/StudioEconomyWidget";
import { useStudioAccount } from "@/components/studio/StudioAccountProvider";
import StudioMobileNavView from "@/components/studio/studio-mobile-nav/StudioMobileNav.view";
import { useStudioMobileNavViewModel } from "@/components/studio/studio-mobile-nav/useStudioMobileNavViewModel";
import { isStoryChatPath } from "@/components/studio/studio-shell/studioShellPathPolicy";

export default function StudioMobileNav({ user, open, onCloseMenu }) {
  const pathname = usePathname();
  const { accountProfile } = useStudioAccount();
  const viewModel = useStudioMobileNavViewModel({
    user,
    accountProfile,
    pathname,
    open,
    onCloseMenu,
  });

  return (
    <StudioMobileNavView
      {...viewModel}
      showBottomDock={!isStoryChatPath(pathname)}
      InternalLinkComponent={Link}
      drawerEconomySlot={<StudioEconomyWidget variant="drawer" />}
    />
  );
}
