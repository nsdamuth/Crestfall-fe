"use client";

import { Eyebrow, FoldingTextField } from "../shared/Controls";
import { LOOK_FIELD_LIMITS } from "../LookCreatorStops.contract";

export default function PaletteStopView({
  palette = "",
  onChangePalette = null,
} = {}) {
  return (
    <>
      <Eyebrow>The palette</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        What colors and materials carry it?
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        The colors, textures, and materials that define this look.
      </p>

      <div className="mt-6">
        <FoldingTextField
          label="Palette"
          value={palette}
          onChange={onChangePalette}
          placeholder="Charcoal wool, oxblood leather, tarnished silver hardware."
          maxLength={LOOK_FIELD_LIMITS.palette}
        />
      </div>
    </>
  );
}
