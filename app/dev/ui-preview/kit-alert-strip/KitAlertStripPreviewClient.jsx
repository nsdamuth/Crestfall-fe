"use client";

import { useState } from "react";

import KitAlertStrip from "@/components/kit/KitAlertStrip";
import {
  kitAlertStripDangerFixture,
  kitAlertStripDangerWithActionFixture,
  kitAlertStripLongestCopyFixture,
  kitAlertStripNeutralFixture,
  kitAlertStripSuccessFixture,
  kitAlertStripSuccessWithActionFixture,
  kitAlertStripWarningFixture,
} from "@/components/kit/alert-strip/KitAlertStrip.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

const STATES = {
  success: { label: "Success", props: kitAlertStripSuccessFixture },
  warning: { label: "Warning", props: kitAlertStripWarningFixture },
  danger: { label: "Danger", props: kitAlertStripDangerFixture },
  neutral: { label: "Neutral", props: kitAlertStripNeutralFixture },
  successAction: { label: "Success + action", props: kitAlertStripSuccessWithActionFixture },
  dangerAction: { label: "Danger + action + dismiss", props: kitAlertStripDangerWithActionFixture },
  longest: { label: "Longest copy", props: kitAlertStripLongestCopyFixture },
};

export default function KitAlertStripPreviewClient() {
  const [activeKey, setActiveKey] = useState("success");
  const [note, setNote] = useState("");

  const active = STATES[activeKey];

  return (
    <KitPreviewShell
      title="Kit Alert Strip"
      description="Full-width in-flow notice, four tones exactly: success, warning, danger, neutral. Every tone ships its own word; neutral is the info tone."
      states={Object.entries(STATES).map(([key, state]) => ({ key, label: state.label }))}
      activeKey={activeKey}
      onSelectState={(key) => {
        setActiveKey(key);
        setNote("");
      }}
      note={note || "Fixture-only. The inline action and dismiss control render only when their handler prop is present."}
    >
      <div className="flex flex-col gap-[var(--space-4)]">
        <KitAlertStrip
          {...active.props}
          onAction={active.props.onAction ? () => setNote("Action pressed.") : null}
          onDismiss={active.props.onDismiss ? () => setNote("Dismissed.") : null}
        />
      </div>
    </KitPreviewShell>
  );
}
