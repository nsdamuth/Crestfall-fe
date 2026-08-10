"use client";

import { useState } from "react";

import KitCreditsView from "@/components/kit/credits/KitCredits.view";
import {
  kitCreditsAllLinkedFixture,
  kitCreditsEmptyFixture,
  kitCreditsLongestContentFixture,
  kitCreditsMixedFixture,
  kitCreditsNoAssetTitleFixture,
  kitCreditsUnlinkedHandleFixture,
} from "@/components/kit/credits/KitCredits.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  mixed: { label: "Mixed", props: kitCreditsMixedFixture },
  allLinked: { label: "All linked", props: kitCreditsAllLinkedFixture },
  unlinkedHandle: { label: "Unlinked handle", props: kitCreditsUnlinkedHandleFixture },
  noAssetTitle: { label: "No asset title", props: kitCreditsNoAssetTitleFixture },
  longestContent: { label: "Longest content", props: kitCreditsLongestContentFixture },
  empty: { label: "Empty", props: kitCreditsEmptyFixture },
};

export default function KitCreditsPreviewClient() {
  const [activeKey, setActiveKey] = useState("mixed");

  const active = STATES[activeKey];

  return (
    <KitPreviewShell
      title="Kit Credits"
      description="Attribution rows ported from the old-design credits panel onto current tokens (R11). Empty credits render null."
      states={Object.entries(STATES).map(([key, state]) => ({
        key,
        label: state.label,
      }))}
      activeKey={activeKey}
      onSelectState={setActiveKey}
      note={
        activeKey === "empty"
          ? "Empty fixture renders nothing below (null), by design."
          : undefined
      }
    >
      <KitCreditsView {...active.props} LinkComponent="a" />
    </KitPreviewShell>
  );
}
