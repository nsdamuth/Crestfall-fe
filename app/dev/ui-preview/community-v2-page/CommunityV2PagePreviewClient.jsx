"use client";

import { useState } from "react";

import StudioShellView from "@/components/studio/studio-shell/StudioShell.view";
import StudioSidebarView from "@/components/studio/studio-sidebar/StudioSidebar.view";
import {
  studioSidebarCollapsedFixture,
  studioSidebarExpandedFixture,
} from "@/components/studio/studio-sidebar/StudioSidebar.fixtures";
import StudioTopBar from "@/components/studio/StudioTopBar";
import CommunityV2Mockup from "@/app/studio/v2/community/CommunityV2Mockup";

// Client wrapper so the mirror can carry the one piece of state the
// real StudioShell owns for its sidebar: collapsed/expanded. Fixture
// props only (StudioSidebarView, not the data-fetching StudioSidebar
// shell), so this stays harness-only with no account/network calls,
// matching StudioShellView's real structure (sidebarSlot, topBarSlot,
// children) exactly, which is what the full-bleed sticky bar math in
// docs/BUILD-BLUEPRINT.md 2.1 depends on.
export default function CommunityV2PagePreviewClient() {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarFixture = collapsed
    ? studioSidebarCollapsedFixture
    : studioSidebarExpandedFixture;

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
