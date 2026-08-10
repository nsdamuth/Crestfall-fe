"use client";

import { useState } from "react";

import StudioShellView from "@/components/studio/studio-shell/StudioShell.view";
import StudioSidebarView from "@/components/studio/studio-sidebar/StudioSidebar.view";
import { studioSidebarPreviewFixture } from "@/components/studio/studio-sidebar/StudioSidebar.fixtures";
import StudioTopBar from "@/components/studio/StudioTopBar";
import CommunityV2Mockup from "@/app/studio/v2/community/CommunityV2Mockup";

// Client wrapper so the mirror can carry the one piece of state the
// real StudioShell owns for its sidebar: collapsed/expanded. Fixture
// props only (StudioSidebarView, not the data-fetching StudioSidebar
// shell), so this stays harness-only with no account/network calls,
// matching StudioShellView's real structure (sidebarSlot, topBarSlot,
// children) exactly, which is what the full-bleed sticky bar math in
// docs/BUILD-BLUEPRINT.md 2.1 depends on.
//
// The preview-nav fixture (Play/Create/Explore group headers) is
// used, not the legacy nav, RULED 10 Aug 2026 (kit polish 3 pass):
// this mirror is the only auth-free surface where the section-label
// law on those group headers can be verified at all.
export default function CommunityV2PagePreviewClient() {
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
      <CommunityV2Mockup />
    </StudioShellView>
  );
}
