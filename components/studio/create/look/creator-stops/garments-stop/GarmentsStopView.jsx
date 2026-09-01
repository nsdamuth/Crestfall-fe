"use client";

import { Eyebrow, FoldingTextField, SectionLabel, TextField } from "../shared/Controls";
import { LOOK_FIELD_LIMITS } from "../LookCreatorStops.contract";

export default function GarmentsStopView({
  garments = "",
  negativePrompt = "",
  onChangeGarments = null,
  onChangeNegativePrompt = null,
} = {}) {
  return (
    <>
      <Eyebrow>The garments</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        What is actually being worn?
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        The pieces this look is built from, in a few words.
      </p>

      <div className="mt-6 grid gap-[var(--space-5)]">
        <TextField
          label="Garments"
          value={garments}
          onChange={onChangeGarments}
          placeholder="Floor-length coat, high collar, fingerless gloves"
          maxLength={LOOK_FIELD_LIMITS.garments}
        />

        <div className="border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
          <SectionLabel>Image Generation Guidance</SectionLabel>
          <p className="mb-[var(--space-3)] text-sm leading-6 text-[var(--ink-dim)]">
            Optional persistent guidance added automatically whenever this clothing source is selected in Image Studio.
          </p>
          <FoldingTextField
            label="Negative Prompt"
            value={negativePrompt}
            onChange={onChangeNegativePrompt}
            placeholder="What should image generation avoid for this outfit?"
            maxLength={LOOK_FIELD_LIMITS.negativePrompt}
          />
        </div>
      </div>
    </>
  );
}
