"use client";

import CoverPreviewView from "./CoverPreview.view";
import { useCoverPreviewViewModel } from "./useCoverPreviewViewModel";
import { Eyebrow } from "../shared/Controls";

export default function CoverStopView({
  name = "",
  premise = "",
  castCharacters = [],
  setting = null,
} = {}) {
  const previewProps = useCoverPreviewViewModel({
    form: { name, premise, castCharacters, setting },
  });

  return (
    <>
      <Eyebrow>The cover</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        Every choice, brought together.
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        The finished shape of every choice made so far. This preview lives
        here and nowhere else in the creator.
      </p>

      <div className="mt-6">
        <CoverPreviewView {...previewProps} />
      </div>
    </>
  );
}
