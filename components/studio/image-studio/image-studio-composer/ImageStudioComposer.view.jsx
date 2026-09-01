"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Film,
  Image as ImageIcon,
  SlidersHorizontal,
  Wand2,
} from "lucide-react";

import CrestfallSelect from "@/components/ui/CrestfallSelect";
import CustomIngredientEditorView from "@/components/studio/image-studio/custom-ingredient-editor/CustomIngredientEditor.view";
import IngredientSlotView from "@/components/studio/image-studio/ingredient-slot/IngredientSlot.view";
import VideoToolsPanelView from "@/components/studio/image-studio/video-tools-panel/VideoToolsPanel.view";

const MODE_ICONS = {
  image: ImageIcon,
  video: Film,
};

export default function ImageStudioComposerView({
  modeOptions = [],
  mode = "IMAGE",
  composerTitle = "Build an Image",
  ingredientSlotItems = [],
  customEditorItems = [],
  videoToolsProps = null,
  promptValue = "",
  negativePromptValue = "",
  inheritedNegativePromptItems = [],
  canGenerateImage = false,
  generationHelpText = "",
  generationError = "",
  imageOptionFields = [],
  advancedTuningProps = null,
  coinBalanceLabel = "0",
  coinCostLabel = "5",
  showInsufficientCoins = false,
  coinError = "",
  onChangeMode = null,
  onChangePrompt = null,
  onChangeNegativePrompt = null,
  onGenerateImage = null,
}) {
  const [imageOptionsOpen, setImageOptionsOpen] = useState(false);
  const [advancedTuningOpen, setAdvancedTuningOpen] = useState(false);
  const isVideoMode = mode === "VIDEO";

  return (
    <aside className="self-start rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-4 xl:sticky xl:top-24">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
            Composer
          </p>
          <h2 className="mt-1 font-display text-2xl">{composerTitle}</h2>
        </div>

        <button
          type="button"
          onClick={() => setImageOptionsOpen((current) => !current)}
          className="rounded-xl border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/10 p-3 text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)]"
          title="Composer options"
        >
          <SlidersHorizontal size={17} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {modeOptions.map((option) => {
          const Icon = MODE_ICONS[option.iconKind] || ImageIcon;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChangeMode?.(option.id)}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
                mode === option.id
                  ? "border-[var(--gold-ornament)]/55 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                  : "border-white/10 bg-black/25 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/30 hover:text-[var(--ink)]"
              }`}
            >
              <Icon size={14} />
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {ingredientSlotItems.map((item) => (
          <IngredientSlotView key={item.id} {...item.viewProps} />
        ))}
      </div>

      {customEditorItems.length ? (
        <div className="mt-4 grid gap-3">
          {customEditorItems.map((item) => (
            <CustomIngredientEditorView key={item.id} {...item.viewProps} />
          ))}
        </div>
      ) : null}

      {isVideoMode ? (
        videoToolsProps ? (
          <VideoToolsPanelView {...videoToolsProps} />
        ) : null
      ) : (
        <>
          <label className="mt-5 block">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
              Prompt
            </span>
            <textarea
              value={promptValue}
              onChange={(event) => onChangePrompt?.(event.target.value)}
              placeholder="Describe what you want to see..."
              rows={5}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
            />
          </label>
          <button
            type="button"
            onClick={() => onGenerateImage?.()}
            disabled={!canGenerateImage}
            className="cf-btn cf-btn--primary mt-4 w-full"
          >
            <Wand2 size={15} />
            Generate image
          </button>

          {!canGenerateImage && generationHelpText ? (
            <p className="mt-3 rounded-xl border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/10 px-4 py-3 text-sm text-[var(--ink-dim)]">
              {generationHelpText}
            </p>
          ) : null}

          {generationError ? (
            <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {generationError}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => setImageOptionsOpen((current) => !current)}
            className="mt-4 flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-left text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
          >
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal size={14} />
              Options
            </span>
            {imageOptionsOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {imageOptionsOpen ? (
            <div className="mt-3 grid gap-4 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4">
              {imageOptionFields.map((field) => (
                <CrestfallSelect
                  key={field.id}
                  label={field.label}
                  value={field.value}
                  onChange={(nextValue) => field.onChange?.(nextValue)}
                  options={field.options}
                />
              ))}

              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
                  Negative Prompt
                </span>
                <textarea
                  value={negativePromptValue}
                  onChange={(event) =>
                    onChangeNegativePrompt?.(event.target.value)
                  }
                  placeholder="Optional: describe what to avoid for this request..."
                  rows={3}
                  className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
                />
              </label>

              {inheritedNegativePromptItems.length ? (
                <div className="rounded-xl border border-[var(--gold-ornament)]/15 bg-black/20 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                    Inherited from selected assets
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
                    Added automatically in addition to the request-level negative prompt above.
                  </p>
                  <div className="mt-3 grid gap-2">
                    {inheritedNegativePromptItems.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border border-white/10 bg-black/25 px-3 py-2"
                      >
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                          {item.sourceLabel} · {item.label}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}


              {advancedTuningProps?.enabled ? (
                <section className="rounded-xl border border-[var(--gold-ornament)]/15 bg-black/25">
                  <button
                    type="button"
                    onClick={() => setAdvancedTuningOpen((current) => !current)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
                        Advanced
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
                        Curated workflow controls
                      </p>
                    </div>
                    {advancedTuningOpen ? (
                      <ChevronUp size={15} />
                    ) : (
                      <ChevronDown size={15} />
                    )}
                  </button>

                  {advancedTuningOpen ? (
                    <div className="border-t border-white/10 px-4 pb-4 pt-4">
                      <p className="text-sm leading-6 text-[var(--ink-dim)]">
                        {advancedTuningProps.description}
                      </p>
                      <p className="mt-2 rounded-lg border border-[var(--gold-ornament)]/15 bg-[var(--gold-ornament)]/5 px-3 py-2 text-xs leading-5 text-[var(--ink-dim)]">
                        {advancedTuningProps.safetyNote}
                      </p>

                      <div className="mt-5 grid gap-5">
                        {advancedTuningProps.controls.map((control) => (
                          <label key={control.id} className="block">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <span className="text-sm text-[var(--ink)]">
                                  {control.label}
                                </span>
                                <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
                                  {control.description}
                                </p>
                              </div>
                              <span className="shrink-0 rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[10px] tabular-nums text-[var(--gold-ornament)]">
                                {control.valueLabel}
                              </span>
                            </div>

                            <input
                              type="range"
                              min={control.min}
                              max={control.max}
                              step={control.step}
                              value={control.value}
                              onChange={(event) =>
                                control.onChange?.(Number(event.target.value))
                              }
                              className="mt-3 w-full cursor-pointer"
                              style={{ accentColor: "var(--gold-action)" }}
                            />

                            <div className="mt-1 flex justify-between gap-3 text-[10px] uppercase tracking-[0.12em] text-[var(--ink-dim)]">
                              <span>{control.leftLabel}</span>
                              <span className="text-center">
                                Default {control.defaultValue}%
                              </span>
                              <span className="text-right">{control.rightLabel}</span>
                            </div>
                          </label>
                        ))}
                      </div>

                      {advancedTuningProps.handoff ? (
                        <div className="mt-5 rounded-xl border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/8 p-3">
                          <p className="text-xs leading-5 text-[var(--ink-dim)]">
                            {advancedTuningProps.handoff.message}
                          </p>
                          <button
                            type="button"
                            onClick={() => advancedTuningProps.handoff.onSwitch?.()}
                            className="mt-3 text-xs font-medium text-[var(--gold-ornament)] underline decoration-[var(--gold-ornament)]/35 underline-offset-4 hover:text-[var(--ink)]"
                          >
                            Switch to {advancedTuningProps.handoff.targetProfileLabel} →
                          </button>
                        </div>
                      ) : null}

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                        <p className="text-xs text-[var(--ink-dim)]">
                          {advancedTuningProps.modified
                            ? "Custom tuning will apply to this generation."
                            : "Using validated workflow defaults."}
                        </p>
                        <button
                          type="button"
                          onClick={() => advancedTuningProps.onReset?.()}
                          disabled={!advancedTuningProps.modified}
                          className="shrink-0 text-xs text-[var(--gold-ornament)] disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          Reset defaults
                        </button>
                      </div>
                    </div>
                  ) : null}
                </section>
              ) : null}
            </div>
          ) : null}

          <div className="mt-4 rounded-xl border border-white/10 bg-black/25 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                Coins
              </span>

              <span className="text-sm text-[var(--ink)]">
                {coinBalanceLabel}
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
              Image generation costs {coinCostLabel} coins.
            </p>

            {showInsufficientCoins ? (
              <p className="mt-2 text-xs leading-5 text-red-200">
                You need at least {coinCostLabel} coins to generate an image.
              </p>
            ) : null}

            {coinError ? (
              <p className="mt-2 text-xs leading-5 text-red-200">
                {coinError}
              </p>
            ) : null}
          </div>

          {generationError ? (
            <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {generationError}
            </p>
          ) : null}
        </>
      )}
    </aside>
  );
}
