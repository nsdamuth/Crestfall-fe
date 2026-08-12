"use client";

import WorldPreviewView from "./WorldPreview.view";
import { useWorldPreviewViewModel } from "./useWorldPreviewViewModel";
import { Eyebrow } from "../shared/Controls";

export default function LookStopView({
  name = "",
  essence = "",
  setting = "",
  tone = "",
} = {}) {
  const previewProps = useWorldPreviewViewModel({
    form: { name, essence, setting, tone },
  });

  return (
    <>
      <Eyebrow>The look</Eyebrow>
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        Every choice, brought together.
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        The finished shape of every choice made so far. This preview lives
        here and nowhere else in the creator.
      </p>

      <div className="mt-6">
        <WorldPreviewView {...previewProps} />
      </div>
    </>
  );
}
