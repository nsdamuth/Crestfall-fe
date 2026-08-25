"use client";

import { ChevronDown, Wand2 } from "lucide-react";

export default function ImageStudioWorkbenchView({
  mode = "IMAGE",
  mobileComposerOpen = false,
  canGenerateImage = false,
  onOpenMobileComposer,
  onCloseMobileComposer,
  onQuickGenerate,
  mediaHistoryProps = {},
  composerProps = {},
  pickerModalProps = null,
  savePresetModalProps = null,
  MediaHistoryGridComponent,
  ImageStudioComposerComponent,
  IngredientPickerModalComponent,
  SaveIngredientPresetModalComponent,
}) {
  const composer = ImageStudioComposerComponent ? (
    <ImageStudioComposerComponent {...composerProps} />
  ) : null;

  return (
    <>
      <section className="mt-4 pb-28 xl:grid xl:grid-cols-[1fr_420px] xl:gap-6 xl:pb-0">
        {MediaHistoryGridComponent ? (
          <MediaHistoryGridComponent {...mediaHistoryProps} />
        ) : null}

        <div className="hidden xl:block">{composer}</div>
      </section>

      <div className="xl:hidden">
        {!mobileComposerOpen ? (
          <div
            role="button"
            tabIndex={0}
            onClick={onOpenMobileComposer}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpenMobileComposer?.();
              }
            }}
            className="fixed bottom-20 left-4 right-4 z-40 flex cursor-pointer items-center justify-between rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/30 bg-black/95 px-4 py-3 text-left shadow-2xl backdrop-blur-[var(--blur-panel)]"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
                Composer
              </p>
              <p className="mt-1 font-display text-2xl">
                {mode === "VIDEO" ? "Build a Video" : "Build an Image"}
              </p>
            </div>

            <button
              type="button"
              onClick={onQuickGenerate}
              disabled={!canGenerateImage}
              className="cf-btn cf-btn--primary cf-btn--sm"
              title="Generate image"
            >
              <Wand2 size={16} />
              Gen
            </button>
          </div>
        ) : null}

        {mobileComposerOpen ? (
          <>
            <button
              type="button"
              aria-label="Close composer backdrop"
              onClick={onCloseMobileComposer}
              className="fixed inset-0 z-40 bg-[var(--scrim-strong)] backdrop-blur-[var(--blur-panel)]"
            />

            <aside className="fixed inset-x-0 bottom-16 z-50 max-h-[82vh] rounded-t-[var(--radius-lg)] border-t border-[var(--gold-ornament)]/25 bg-black/95 shadow-2xl backdrop-blur-[var(--blur-panel)]">
              <button
                type="button"
                onClick={onCloseMobileComposer}
                className="flex w-full items-center justify-between border-b border-white/10 px-5 py-4 text-left"
              >
                <div>
                  <div className="mb-3 h-1.5 w-14 rounded-full bg-[var(--gold-ornament)]/35" />
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
                    Composer
                  </p>
                  <p className="mt-1 font-display text-2xl">
                    {mode === "VIDEO" ? "Build a Video" : "Build an Image"}
                  </p>
                </div>

                <span className="rounded-[var(--radius-md)] border border-white/10 p-2 text-[var(--ink-dim)]">
                  <ChevronDown size={18} />
                </span>
              </button>

              <div className="max-h-[calc(82vh-92px)] overflow-y-auto px-4 pb-6 pt-4">
                {composer}
              </div>
            </aside>
          </>
        ) : null}
      </div>

      {pickerModalProps && IngredientPickerModalComponent ? (
        <IngredientPickerModalComponent {...pickerModalProps} />
      ) : null}

      {savePresetModalProps && SaveIngredientPresetModalComponent ? (
        <SaveIngredientPresetModalComponent {...savePresetModalProps} />
      ) : null}
    </>
  );
}
