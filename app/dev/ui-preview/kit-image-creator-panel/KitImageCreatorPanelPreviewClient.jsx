"use client";

import { useState } from "react";

import KitImageCreatorPanel from "@/components/kit/KitImageCreatorPanel";
import { kitImageCreatorPanelFixtures } from "@/components/kit/image-creator-panel/KitImageCreatorPanel.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

export default function KitImageCreatorPanelPreviewClient() {
  const [activeId, setActiveId] = useState(kitImageCreatorPanelFixtures[0].id);
  const [note, setNote] = useState("Fixture only. No control here fetches, persists, or navigates.");

  const activeFixture = kitImageCreatorPanelFixtures.find((fixture) => fixture.id === activeId);

  const overrides = {
    onSlotActivate: (slotId) => setNote(`Opened the ingredient picker for ${slotId} (phase 2 package, not composed here).`),
    onSlotClear: (slotId) => setNote(`Cleared ${slotId}.`),
    onCustomChangeText: (slotId) => setNote(`Edited custom guidance for ${slotId}.`),
    onCustomBackToPresets: (slotId) => setNote(`Back to presets for ${slotId}.`),
    onCustomSavePreset: (slotId) => setNote(`Opened the save-preset modal for ${slotId} (phase 2 package, not composed here).`),
    onChangeMode: (mode) => setNote(`Switched mode to ${mode}.`),
    onGenerate: () => setNote("Generate pressed. In a consuming page this opens the R4 fixture-action notice."),
  };

  return (
    <KitPreviewShell
      title="Kit Image Creator Panel"
      description="Fixture-driven mirror of the live image composer's function: mode toggle, the six ingredient slots, custom guidance, Options expander, and the generate/video blocks."
      states={kitImageCreatorPanelFixtures.map((fixture) => ({ key: fixture.id, label: fixture.label }))}
      activeKey={activeId}
      onSelectState={setActiveId}
      note={note}
    >
      <div className="mx-auto w-full max-w-sm">
        <KitImageCreatorPanel {...activeFixture.props} {...overrides} />
      </div>
    </KitPreviewShell>
  );
}
