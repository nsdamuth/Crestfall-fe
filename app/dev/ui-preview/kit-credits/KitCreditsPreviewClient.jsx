"use client";

import { useState } from "react";

import KitCreditsView from "@/components/kit/credits/KitCredits.view";
import KitCreditsModal from "@/components/kit/KitCreditsModal";
import {
  kitCreditsAllLinkedFixture,
  kitCreditsEmptyFixture,
  kitCreditsLongestContentFixture,
  kitCreditsManyFixture,
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const active = STATES[activeKey];

  return (
    <KitPreviewShell
      title="Kit Credits"
      description="Attribution rows ported from the old-design credits panel onto current tokens (R11). Empty credits render null. Added 1.1.0 (R1): KitCreditsModal, the popup's View all credits destination."
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

      <div className="mt-[var(--space-6)] border-t border-[var(--line-whisper)] pt-[var(--space-6)]">
        <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
          Modal (1.1.0, eight-credit fixture)
        </p>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="kit-focus cf-btn cf-btn--secondary mt-[var(--space-3)]"
        >
          Open credits modal
        </button>
      </div>

      {isModalOpen && (
        <KitCreditsModal
          credits={kitCreditsManyFixture.credits}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </KitPreviewShell>
  );
}
