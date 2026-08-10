"use client";

import { useState } from "react";

import StudioShellView from "@/components/studio/studio-shell/StudioShell.view";
import StudioSidebarView from "@/components/studio/studio-sidebar/StudioSidebar.view";
import { studioSidebarPreviewFixture } from "@/components/studio/studio-sidebar/StudioSidebar.fixtures";
import StudioTopBar from "@/components/studio/StudioTopBar";
import AccountV2Mockup from "@/app/studio/v2/account/AccountV2Mockup";

// Client wrapper so the mirror can carry the one piece of state the
// real StudioShell owns for its sidebar: collapsed/expanded. The
// sidebar fixture carries no Account row (no sidebar entry, per plan
// 4.1); fixture props only, byte-for-byte the pattern of the other v2
// page preview clients.
export default function AccountV2PagePreviewClient() {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarFixture = {
    ...studioSidebarPreviewFixture,
    collapsed,
    collapseAriaLabel: collapsed ? "Expand sidebar" : "Collapse sidebar",
  };

  return (
    <StudioShellView
      sidebarSlot={
        <StudioSidebarView
          {...sidebarFixture}
          onToggleCollapsed={() => setCollapsed((current) => !current)}
        />
      }
      topBarSlot={<StudioTopBar />}
    >
      <AccountV2Mockup />
    </StudioShellView>
  );
}
