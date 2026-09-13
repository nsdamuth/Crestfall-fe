"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import StudioEconomyWidget from "@/components/studio/StudioEconomyWidget";
import { useStudioAccount } from "@/components/studio/StudioAccountProvider";
import { useStudioChrome } from "@/components/studio/StudioChromeProvider";
import StudioSidebarView from "./studio-sidebar/StudioSidebar.view";
import { useStudioSidebarViewModel } from "./studio-sidebar/useStudioSidebarViewModel";

export default function StudioSidebar(props) {
  const pathname = usePathname();
  const { accountProfile } = useStudioAccount();
  const { leftOwner, claimLeft } = useStudioChrome();
  const viewProps = useStudioSidebarViewModel({
    ...props,
    accountProfile,
    pathname,
    leftOwner,
    onClaimLeft: claimLeft,
  });

  return (
    <StudioSidebarView
      {...viewProps}
      InternalLinkComponent={Link}
      economySlot={<StudioEconomyWidget collapsed={viewProps.collapsed} />}
    />
  );
}
