"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import StudioEconomyWidget from "@/components/studio/StudioEconomyWidget";
import StudioSidebarView from "./studio-sidebar/StudioSidebar.view";
import { useStudioSidebarViewModel } from "./studio-sidebar/useStudioSidebarViewModel";

export default function StudioSidebar(props) {
  const pathname = usePathname();
  const viewProps = useStudioSidebarViewModel({ ...props, pathname });

  return (
    <StudioSidebarView
      {...viewProps}
      InternalLinkComponent={Link}
      economySlot={<StudioEconomyWidget collapsed={viewProps.collapsed} />}
    />
  );
}
