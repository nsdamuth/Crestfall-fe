"use client";

import { Eyebrow, FoldingTextField, SectionLabel, TextField } from "../shared/Controls";
import { WORLD_FIELD_LIMITS } from "../WorldCreatorStops.contract";

export default function SettingStopView({
  setting = "",
  negativePrompt = "",
  onChangeSetting = null,
  onChangeNegativePrompt = null,
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

      <div className="mt-6 grid gap-[var(--space-5)]">
        <TextField
          label="Setting or genre"
          value={setting}
          onChange={onChangeSetting}
          placeholder="Gaslamp fantasy, flooded archipelago"
          maxLength={WORLD_FIELD_LIMITS.setting}
        />

        <div className="border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
          <SectionLabel>Image Generation Guidance</SectionLabel>
          <p className="mb-[var(--space-3)] text-sm leading-6 text-[var(--ink-dim)]">
            Optional persistent guidance added automatically whenever this location is selected in Image Studio.
          </p>
          <FoldingTextField
            label="Negative Prompt"
            value={negativePrompt}
            onChange={onChangeNegativePrompt}
            placeholder="What should image generation avoid for this location?"
            maxLength={WORLD_FIELD_LIMITS.negativePrompt}
          />
        </div>
      </div>
    </>
  );
}
