"use client";

import StudioSidebar from "@/components/studio/StudioSidebar";
import StudioMobileNav from "@/components/studio/StudioMobileNav";
import StudioTopBar from "@/components/studio/StudioTopBar";
import { StudioAccountProvider } from "@/components/studio/StudioAccountProvider";

import StudioShellView from "./studio-shell/StudioShell.view";
import { useStudioShellViewModel } from "./studio-shell/useStudioShellViewModel";

export default function StudioShell({ user, children }) {
  const viewProps = useStudioShellViewModel({
    sidebarSlot: <StudioSidebar user={user} />,
    mobileNavSlot: <StudioMobileNav user={user} />,
    topBarSlot: <StudioTopBar user={user} />,
    children,
  });

  return (
    <StudioAccountProvider>
      <StudioShellView {...viewProps} />
    </StudioAccountProvider>
  );
}
