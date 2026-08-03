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
  canGenerateImage = false,
  generationHelpText = "",
  generationError = "",
  imageOptionFields = [],
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
  const isVideoMode = mode === "VIDEO";

  return (
    <aside className="self-start rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-4 xl:sticky xl:top-24">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            Composer
          </p>
          <h2 className="mt-1 font-display text-2xl">{composerTitle}</h2>
        </div>

        <button
          type="button"
          onClick={() => setImageOptionsOpen((current) => !current)}
          className="rounded-xl border border-[var(--muted-gold)]/20 bg-[var(--muted-gold)]/10 p-3 text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)]"
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
                  ? "border-[var(--muted-gold)]/55 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                  : "border-white/10 bg-black/25 text-[var(--muted)] hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
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
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Prompt
            </span>
            <textarea
              value={promptValue}
              onChange={(event) => onChangePrompt?.(event.target.value)}
              placeholder="Describe what you want to see..."
              rows={5}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
            />
          </label>
          <button
            type="button"
            onClick={() => onGenerateImage?.()}
            disabled={!canGenerateImage}
            className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-4 text-xs uppercase tracking-[0.18em] transition ${
              canGenerateImage
                ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/15 text-[var(--foreground)] hover:bg-[var(--muted-gold)]/25"
                : "border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 text-[var(--muted-gold)] opacity-60"
            }`}
          >
            <Wand2 size={15} />
            Generate Image
          </button>

          {!canGenerateImage && generationHelpText ? (
            <p className="mt-3 rounded-xl border border-[var(--muted-gold)]/20 bg-[var(--muted-gold)]/10 px-4 py-3 text-sm text-[var(--muted)]">
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
            className="mt-4 flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-left text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
          >
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal size={14} />
              Options
            </span>
            {imageOptionsOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {imageOptionsOpen ? (
            <div className="mt-3 grid gap-4 rounded-2xl border border-white/10 bg-black/25 p-4">
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
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
                  Negative Prompt
                </span>
                <textarea
                  value={negativePromptValue}
                  onChange={(event) =>
                    onChangeNegativePrompt?.(event.target.value)
                  }
                  placeholder="Optional: describe what to avoid..."
                  rows={3}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
                />
              </label>
            </div>
          ) : null}

          <div className="mt-4 rounded-xl border border-white/10 bg-black/25 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
                Coins
              </span>

              <span className="text-sm text-[var(--foreground)]">
                {coinBalanceLabel}
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
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
