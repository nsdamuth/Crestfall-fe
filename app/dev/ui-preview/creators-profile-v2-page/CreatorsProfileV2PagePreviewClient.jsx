"use client";

import { useState } from "react";

import StudioShellView from "@/components/studio/studio-shell/StudioShell.view";
import StudioSidebarView from "@/components/studio/studio-sidebar/StudioSidebar.view";
import { studioSidebarPreviewFixture } from "@/components/studio/studio-sidebar/StudioSidebar.fixtures";
import StudioTopBar from "@/components/studio/StudioTopBar";
import CreatorProfile from "@/app/studio/v2/creators/CreatorProfile";

// Client wrapper so the mirror can carry the one piece of state the
// real StudioShell owns for its sidebar: collapsed/expanded. Fixture
// props only, byte-for-byte the pattern of the other v2 page preview
// clients (Lore, Adventures, Home, Editor). The Shell's own internal
// fixture-mode harness (default / empty / loading / error / muted /
// longest content, plus the item 36 mute-placement toggle) renders
// unchanged from /app/studio/v2/creators/CreatorProfile.jsx.
export default function CreatorsProfileV2PagePreviewClient() {
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
      <CreatorProfile handle="vermillion" />
    </StudioShellView>
  );
}
