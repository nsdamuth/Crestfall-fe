"use client";

import { Eyebrow, TextField } from "../shared/Controls";
import { WORLD_FIELD_LIMITS } from "../WorldCreatorStops.contract";

export default function SettingStopView({
  setting = "",
  onChangeSetting = null,
} = {}) {
  return (
    <>
      <Eyebrow>The setting</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        Where and what kind of place is it?
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        The setting or genre this world lives in, in a few words.
      </p>

      <div className="mt-6">
        <TextField
          label="Setting or genre"
          value={setting}
          onChange={onChangeSetting}
          placeholder="Gaslamp fantasy, flooded archipelago"
          maxLength={WORLD_FIELD_LIMITS.setting}
        />
      </div>
    </>
  );
}
