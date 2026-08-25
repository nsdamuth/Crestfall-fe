"use client";

import { Clock3, Film, Wand2 } from "lucide-react";

import CrestfallSelect from "@/components/ui/CrestfallSelect";

export default function VideoToolsPanelView({
  toolCards = [],
  durationValue = "",
  durationOptions = [],
  aspectRatioValue = "",
  aspectRatioOptions = [],
  motionStyleValue = "",
  motionStyleOptions = [],
  directionValue = "",
  onChangeDuration = null,
  onChangeAspectRatio = null,
  onChangeMotionStyle = null,
  onChangeDirection = null,
}) {
  return (
    <div className="mt-5 space-y-5">
      <div className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/10 p-4">
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
          <Film size={14} />
          Video Tools Preview
        </p>

        <p className="mt-3 text-sm leading-6 text-[var(--ink-dim)]">
          Video generation is stubbed as a future Studio mode. These controls
          are placeholders only and do not call an API yet.
        </p>
      </div>

      <div className="grid gap-3">
        {toolCards.map((tool) => (
          <article
            key={tool.id}
            className="rounded-xl border border-white/10 bg-black/25 p-4"
          >
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
              {tool.eyebrow}
            </p>

            <h3 className="mt-2 font-display text-2xl text-[var(--ink)]">
              {tool.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
              {tool.body}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-4">
        <CrestfallSelect
          label="Duration"
          value={durationValue}
          onChange={(nextValue) => onChangeDuration?.(nextValue)}
          options={durationOptions}
        />

        <CrestfallSelect
          label="Video Aspect"
          value={aspectRatioValue}
          onChange={(nextValue) => onChangeAspectRatio?.(nextValue)}
          options={aspectRatioOptions}
        />

        <CrestfallSelect
          label="Motion Style"
          value={motionStyleValue}
          onChange={(nextValue) => onChangeMotionStyle?.(nextValue)}
          options={motionStyleOptions}
        />
      </div>

      <label className="block">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
          Video Direction
        </span>
        <textarea
          value={directionValue}
          onChange={(event) => onChangeDirection?.(event.target.value)}
          placeholder="Describe the short motion, scene beat, or recap moment..."
          rows={5}
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
        />
      </label>

      <button
        type="button"
        disabled
        className="cf-btn cf-btn--primary w-full"
      >
        <Wand2 size={15} />
        Generate video soon
      </button>

      <p className="flex items-start gap-2 text-xs leading-5 text-[var(--ink-dim)]">
        <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold-ornament)]" />
        Future video assets will save into the same internal media library as
        images, with no external uploads.
      </p>
    </div>
  );
}
