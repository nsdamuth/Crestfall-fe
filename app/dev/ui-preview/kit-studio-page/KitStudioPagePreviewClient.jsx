"use client";

import { useState } from "react";

import KitStudioPageView from "@/components/kit/studio-page/KitStudioPage.view";
import {
  kitStudioPageDefaultFixture,
  kitStudioPageNoBannerFixture,
  kitStudioPageLongestContentFixture,
  kitStudioPageCenteredHeaderFixture,
} from "@/components/kit/studio-page/KitStudioPage.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  default: { label: "Default", props: kitStudioPageDefaultFixture },
  noBanner: { label: "No banner", props: kitStudioPageNoBannerFixture },
  longestContent: {
    label: "Longest content",
    props: kitStudioPageLongestContentFixture,
  },
  centeredHeader: {
    label: "Centered header (Lore seat)",
    props: kitStudioPageCenteredHeaderFixture,
  },
};

export default function KitStudioPagePreviewClient() {
  const [activeKey, setActiveKey] = useState("default");

  const active = STATES[activeKey];

  return (
    <KitPreviewShell
      title="Kit Studio Page"
      description="The studio-v2 page skeleton, R1 content width law: one content width per page, flush to the shell's own section padding, no second padding layer."
      states={Object.entries(STATES).map(([key, state]) => ({
        key,
        label: state.label,
      }))}
      activeKey={activeKey}
      onSelectState={setActiveKey}
    >
      <KitStudioPageView {...active.props} />
    </KitPreviewShell>
  );
}
