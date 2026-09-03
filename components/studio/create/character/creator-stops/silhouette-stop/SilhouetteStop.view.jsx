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
  fantasyBodyNotes = "",
  onChangeFantasyBodyNotes = null,
  realisticBodyNotes = "",
  onChangeRealisticBodyNotes = null,
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
            label="Custom body prompt"
            value={bodyNotes}
            onChange={onChangeBodyNotes}
            placeholder="Optional model-neutral physical details that should affect image generation across all rendering styles."
            maxLength={SILHOUETTE_NOTES_MAX_LENGTH}
          />
        </div>

        <div>
          <TextAreaField
            label="Fantasy specific prompt details"
            value={fantasyBodyNotes}
            onChange={onChangeFantasyBodyNotes}
            placeholder="Optional short guidance applied only to fantasy and anime rendering stages."
            maxLength={SILHOUETTE_NOTES_MAX_LENGTH}
          />
        </div>

        <div>
          <TextAreaField
            label="Realistic specific prompt details"
            value={realisticBodyNotes}
            onChange={onChangeRealisticBodyNotes}
            placeholder="Optional short guidance applied only to realistic rendering stages."
            maxLength={SILHOUETTE_NOTES_MAX_LENGTH}
          />
        </div>
      </div>
    </>
  );
}
