"use client";

import { Eyebrow, TextField } from "../shared/Controls";
import { LOOK_FIELD_LIMITS } from "../LookCreatorStops.contract";

export default function NameStopView({
  name = "",
  onChangeName = null,
} = {}) {
  return (
    <>
      <Eyebrow>Build a look</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        Every look starts with a name.
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        You can change anything later. Nothing on this path is required.
      </p>

      <div className="mt-6">
        <TextField
          label="Name"
          value={name}
          onChange={onChangeName}
          placeholder="Midnight Court Regalia"
          maxLength={LOOK_FIELD_LIMITS.name}
        />
      </div>
    </>
  );
}
