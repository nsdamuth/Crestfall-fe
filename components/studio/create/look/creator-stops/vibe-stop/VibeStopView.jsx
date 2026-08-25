"use client";

import { Eyebrow, FoldingTextField } from "../shared/Controls";
import { LOOK_FIELD_LIMITS } from "../LookCreatorStops.contract";

export default function VibeStopView({
  vibe = "",
  onChangeVibe = null,
} = {}) {
  return (
    <>
      <Eyebrow>The vibe</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        What does this look say before it says anything?
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        A short description of the mood or feeling this look carries.
      </p>

      <div className="mt-6">
        <FoldingTextField
          label="Vibe"
          value={vibe}
          onChange={onChangeVibe}
          placeholder="Quiet menace under formal restraint. Old money dressed for a funeral it arranged."
          maxLength={LOOK_FIELD_LIMITS.vibe}
        />
      </div>
    </>
  );
}
