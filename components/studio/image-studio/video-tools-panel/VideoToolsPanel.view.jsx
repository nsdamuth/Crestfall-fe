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
      <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-[var(--muted-gold)]/10 p-4">
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
          <Film size={14} />
          Video Tools Preview
        </p>

        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
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
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-gold)]">
              {tool.eyebrow}
            </p>

            <h3 className="mt-2 font-display text-2xl text-[var(--foreground)]">
              {tool.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
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
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
          Video Direction
        </span>
        <textarea
          value={directionValue}
          onChange={(event) => onChangeDirection?.(event.target.value)}
          placeholder="Describe the short motion, scene beat, or recap moment..."
          rows={5}
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
        />
      </label>

      <button
        type="button"
        disabled
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-4 py-4 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] opacity-75"
      >
        <Wand2 size={15} />
        Generate Video Soon
      </button>

      <p className="flex items-start gap-2 text-xs leading-5 text-[var(--muted)]">
        <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--muted-gold)]" />
        Future video assets will save into the same internal media library as
        images, with no external uploads.
      </p>
    </div>
  );
}
