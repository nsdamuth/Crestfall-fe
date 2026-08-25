"use client";

import { useState } from "react";

import StudioShellView from "@/components/studio/studio-shell/StudioShell.view";
import StudioSidebarView from "@/components/studio/studio-sidebar/StudioSidebar.view";
import { studioSidebarPreviewFixture } from "@/components/studio/studio-sidebar/StudioSidebar.fixtures";
import StudioTopBar from "@/components/studio/StudioTopBar";
import VaultV2Mockup from "@/app/studio/v2/vault/VaultV2Mockup";

// Client wrapper so the mirror can carry the one piece of state the
// real StudioShell owns for its sidebar: collapsed/expanded. Fixture
// props only, byte-for-byte the pattern of
// CommunityV2PagePreviewClient.jsx and CreatorsV2PagePreviewClient.jsx.
export default function VaultV2PagePreviewClient() {
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
      <VaultV2Mockup />
    </StudioShellView>
  );
}
