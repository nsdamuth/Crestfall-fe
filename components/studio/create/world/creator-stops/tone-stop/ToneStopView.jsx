"use client";

import { Eyebrow, FoldingTextField } from "../shared/Controls";
import { WORLD_FIELD_LIMITS } from "../WorldCreatorStops.contract";

export default function ToneStopView({
  tone = "",
  onChangeTone = null,
} = {}) {
  return (
    <>
      <Eyebrow>The tone</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        What does it feel like to be here?
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        The mood a story set here should carry: hopeful, bleak, wry,
        reverent, whatever it is.
      </p>

      <div className="mt-6">
        <FoldingTextField
          label="Tone"
          value={tone}
          onChange={onChangeTone}
          placeholder="Wry and weary. Grand ruins, small people, gallows humor."
          maxLength={WORLD_FIELD_LIMITS.tone}
        />
      </div>
    </>
  );
}
