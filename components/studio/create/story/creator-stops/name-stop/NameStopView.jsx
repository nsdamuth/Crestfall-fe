"use client";

import { Eyebrow, TextField } from "../shared/Controls";
import { STORY_FIELD_LIMITS } from "../StoryCreatorStops.contract";

export default function NameStopView({
  name = "",
  onChangeName = null,
} = {}) {
  return (
    <>
      <Eyebrow>Gather a story</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        Every story starts with a name.
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        You can change anything later. Nothing on this path is required.
      </p>

      <div className="mt-6">
        <TextField
          label="Name"
          value={name}
          onChange={onChangeName}
          placeholder="The Long Watch at Crestfall"
          maxLength={STORY_FIELD_LIMITS.name}
        />
      </div>
    </>
  );
}
