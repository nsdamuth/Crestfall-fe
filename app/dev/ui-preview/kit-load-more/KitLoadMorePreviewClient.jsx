"use client";

import { useState } from "react";

import KitLoadMoreView from "@/components/kit/load-more/KitLoadMore.view";
import {
  kitLoadMoreDefaultFixture,
  kitLoadMoreExhaustedFixture,
  kitLoadMoreLoadingFixture,
  kitLoadMoreUnknownCountFixture,
} from "@/components/kit/load-more/KitLoadMore.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  default: { label: "Default", props: kitLoadMoreDefaultFixture },
  loading: { label: "Loading", props: kitLoadMoreLoadingFixture },
  exhausted: { label: "Exhausted", props: kitLoadMoreExhaustedFixture },
  unknownCount: { label: "Unknown count", props: kitLoadMoreUnknownCountFixture },
};

export default function KitLoadMorePreviewClient() {
  const [activeKey, setActiveKey] = useState("default");
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No list or pagination cursor is connected."
  );

  const active = STATES[activeKey];

  return (
    <KitPreviewShell
      title="Kit Load More"
      description="No infinite scroll: an initial batch renders, then this control appends the next one, so the page footer and the journey banner stay reachable."
      states={Object.entries(STATES).map(([key, state]) => ({
        key,
        label: state.label,
      }))}
      activeKey={activeKey}
      onSelectState={setActiveKey}
      note={lastAction}
    >
      <div className="flex min-h-[var(--space-20)] items-center justify-center">
        <KitLoadMoreView
          {...active.props}
          onLoadMore={() => setLastAction("Requested the next batch (local preview only).")}
        />
      </div>
    </KitPreviewShell>
  );
}
