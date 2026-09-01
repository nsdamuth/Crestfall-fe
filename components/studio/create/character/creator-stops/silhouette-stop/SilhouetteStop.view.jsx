"use client";

import {
  Eyebrow,
  TextAreaField,
} from "../shared/Controls";
import {
  SILHOUETTE_NOTES_MAX_LENGTH,
} from "./SilhouetteStop.contract";

export default function SilhouetteStopView({
  bodyIdentityControl = null,
  bodyTypeControl = null,
  heightControl = null,
  buildControl = null,
  proportionsControl = null,
  bodyNotes = "",
  onChangeBodyNotes = null,
} = {}) {
  return (
    <>
      <Eyebrow>Define their body</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        Body
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        Define the character&apos;s physical silhouette. These details help visual
        generation, narration, movement, and scene description.
      </p>

      <div className="mt-6 grid gap-[var(--space-4)] md:grid-cols-2">
        <div className="md:col-span-2">{bodyIdentityControl}</div>

        {bodyTypeControl}
        {heightControl}
        {buildControl}
        {proportionsControl}

        <div className="md:col-span-2">
          <TextAreaField
            label="Custom body notes"
            value={bodyNotes}
            onChange={onChangeBodyNotes}
            placeholder="Optional physical details that should affect image generation or narration."
            maxLength={SILHOUETTE_NOTES_MAX_LENGTH}
          />
        </div>
      </div>
    </>
  );
}
