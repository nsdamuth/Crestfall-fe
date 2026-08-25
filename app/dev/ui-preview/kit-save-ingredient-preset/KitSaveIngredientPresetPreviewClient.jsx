"use client";

import { useState } from "react";

import KitSaveIngredientPreset from "@/components/kit/KitSaveIngredientPreset";
import { kitSaveIngredientPresetFixtures } from "@/components/kit/save-ingredient-preset/KitSaveIngredientPreset.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

export default function KitSaveIngredientPresetPreviewClient() {
  const [openId, setOpenId] = useState(null);
  const [note, setNote] = useState("Choose a fixture to open the modal.");

  const activeFixture = kitSaveIngredientPresetFixtures.find((fixture) => fixture.id === openId);

  const overrides = {
    onSavePreset: () => setNote("Save as preset pressed. In a consuming page this opens the R4 fixture-action notice."),
    onUseOnce: () => {
      setNote("Use once pressed; closed without persisting.");
      setOpenId(null);
    },
    onClose:
      activeFixture?.props.onClose === null
        ? null
        : () => {
            setNote("Closed.");
            setOpenId(null);
          },
  };

  return (
    <KitPreviewShell
      title="Kit Save Ingredient Preset"
      description="Fixture-driven mirror of the live save-preset modal: Preset Name, Description, Prompt / Guidance, Tags, Save as preset, and Use once."
      states={kitSaveIngredientPresetFixtures.map((fixture) => ({ key: fixture.id, label: fixture.label }))}
      activeKey={openId}
      onSelectState={(id) => {
        setOpenId(id);
        setNote(`Opened the ${id} fixture.`);
      }}
      note={note}
    >
      <div className="flex flex-wrap gap-[var(--space-3)]">
        {kitSaveIngredientPresetFixtures.map((fixture) => (
          <button
            key={fixture.id}
            type="button"
            onClick={() => {
              setOpenId(fixture.id);
              setNote(`Opened the ${fixture.label} fixture.`);
            }}
            className="cf-btn cf-btn--secondary"
          >
            Open {fixture.label}
          </button>
        ))}
      </div>

      {activeFixture && <KitSaveIngredientPreset {...activeFixture.props} {...overrides} />}
    </KitPreviewShell>
  );
}
