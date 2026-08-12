"use client";

import { Eyebrow, FoldingTextField } from "../shared/Controls";
import { WORLD_FIELD_LIMITS } from "../WorldCreatorStops.contract";

export default function EssenceStopView({
  essence = "",
  onChangeEssence = null,
} = {}) {
  return (
    <>
      <Eyebrow>The premise</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        What is this world about?
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        A short premise: what makes this place worth telling stories in.
      </p>

      <div className="mt-6">
        <FoldingTextField
          label="Essence or premise"
          value={essence}
          onChange={onChangeEssence}
          placeholder="A drowned coastal city ruled by a council of merchant houses, one generation past a war nobody won."
          maxLength={WORLD_FIELD_LIMITS.essence}
        />
      </div>
    </>
  );
}
