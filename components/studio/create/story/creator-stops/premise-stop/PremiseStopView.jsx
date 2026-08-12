"use client";

import { Eyebrow, FoldingTextField } from "../shared/Controls";
import { STORY_FIELD_LIMITS } from "../StoryCreatorStops.contract";

export default function PremiseStopView({
  premise = "",
  onChangePremise = null,
} = {}) {
  return (
    <>
      <Eyebrow>The premise</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        What is this story about?
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        A short premise: what starts it, and what a session here is for.
      </p>

      <div className="mt-6">
        <FoldingTextField
          label="Premise"
          value={premise}
          onChange={onChangePremise}
          placeholder="A council seat has come open at midnight, and three factions want it before dawn."
          maxLength={STORY_FIELD_LIMITS.premise}
        />
      </div>
    </>
  );
}
