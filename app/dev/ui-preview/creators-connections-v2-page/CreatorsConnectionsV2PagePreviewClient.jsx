"use client";

import { useState } from "react";

import StudioShellView from "@/components/studio/studio-shell/StudioShell.view";
import StudioSidebarView from "@/components/studio/studio-sidebar/StudioSidebar.view";
import { studioSidebarPreviewFixture } from "@/components/studio/studio-sidebar/StudioSidebar.fixtures";
import StudioTopBar from "@/components/studio/StudioTopBar";
import CreatorConnections from "@/app/studio/v2/creators/CreatorConnections";

// Client wrapper so the mirror can carry the one piece of state the
// real StudioShell owns for its sidebar: collapsed/expanded. Fixture
// props only, byte-for-byte the pattern of the other v2 page preview
// clients (Creator Profile, Lore, Adventures, Home, Editor). The
// Shell's own internal fixture-mode harness (default / empty /
// loading / error) renders unchanged from
// /app/studio/v2/creators/CreatorConnections.jsx.
export default function CreatorsConnectionsV2PagePreviewClient() {
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
      <CreatorConnections handle="vermillion" />
    </StudioShellView>
  );
}
