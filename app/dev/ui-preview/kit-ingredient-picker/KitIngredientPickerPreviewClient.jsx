"use client";

import { useState } from "react";

import KitIngredientPicker from "@/components/kit/KitIngredientPicker";
import { kitIngredientPickerFixtures } from "@/components/kit/ingredient-picker/KitIngredientPicker.fixtures";
import KitPreviewShell from "../kit-batch-1/KitPreviewShell";

export default function KitIngredientPickerPreviewClient() {
  const [openId, setOpenId] = useState(null);
  const [note, setNote] = useState("Choose a fixture to open the picker.");

  const activeFixture = kitIngredientPickerFixtures.find((fixture) => fixture.id === openId);

  const overrides = {
    onChooseIngredient: (itemId) => {
      setNote(`Chose ${itemId}.`);
      setOpenId(null);
    },
    onUseCustom: () => {
      setNote("Custom pressed. On the live page this opens the custom asset modal for the slot.");
      setOpenId(null);
    },
    onClose: () => {
      setNote("Closed.");
      setOpenId(null);
    },
  };

  return (
    <KitPreviewShell
      title="Kit Ingredient Picker"
      description="Fixture-driven mirror of the live asset picker: search, the filter dropdown, Custom as the first card, the asset grid, and the rows layout for camera framing."
      states={kitIngredientPickerFixtures.map((fixture) => ({ key: fixture.id, label: fixture.label }))}
      activeKey={openId}
      onSelectState={(id) => {
        setOpenId(id);
        setNote(`Opened the ${id} fixture.`);
      }}
      note={note}
    >
      <div className="flex flex-wrap gap-[var(--space-3)]">
        {kitIngredientPickerFixtures.map((fixture) => (
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

      {activeFixture && <KitIngredientPicker {...activeFixture.props} {...overrides} />}
    </KitPreviewShell>
  );
}
