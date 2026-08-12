"use client";

import { Eyebrow, TextField } from "../shared/Controls";
import { LOOK_FIELD_LIMITS } from "../LookCreatorStops.contract";

export default function GarmentsStopView({
  garments = "",
  onChangeGarments = null,
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

      <div className="mt-6">
        <TextField
          label="Garments"
          value={garments}
          onChange={onChangeGarments}
          placeholder="Floor-length coat, high collar, fingerless gloves"
          maxLength={LOOK_FIELD_LIMITS.garments}
        />
      </div>
    </>
  );
}
