"use client";

import { useMemo, useState } from "react";

import ImageStudioWorkbenchView from "@/components/studio/image-studio/image-studio-workbench/ImageStudioWorkbench.view";
import {
  imageStudioWorkbenchGenerationErrorFixture,
  imageStudioWorkbenchLowCoinsFixture,
  imageStudioWorkbenchNoSourceFixture,
  imageStudioWorkbenchPickerFixture,
  imageStudioWorkbenchReadyFixture,
  imageStudioWorkbenchSavePresetFixture,
} from "@/components/studio/image-studio/image-studio-workbench/ImageStudioWorkbench.fixtures";

const PREVIEW_STATES = Object.freeze({
  ready: { label: "Ready", fixture: imageStudioWorkbenchReadyFixture },
  noSource: { label: "No Source", fixture: imageStudioWorkbenchNoSourceFixture },
  lowCoins: { label: "Low Coins", fixture: imageStudioWorkbenchLowCoinsFixture },
  error: {
    label: "Generation Error",
    fixture: imageStudioWorkbenchGenerationErrorFixture,
  },
  picker: { label: "Ingredient Picker", fixture: imageStudioWorkbenchPickerFixture },
  savePreset: {
    label: "Save Preset",
    fixture: imageStudioWorkbenchSavePresetFixture,
  },
});

function PreviewMediaHistory({
  generatedMedia = [],
  historyStatus,
  historyError,
  hasMoreHistory,
  onLoadMoreHistory,
}) {
  return (
    <section className="min-h-[520px] rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        Preview Media History
      </p>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Status: {historyStatus} · Items: {generatedMedia.length}
      </p>
      {historyError ? (
        <p className="mt-3 rounded-xl border border-red-400/25 bg-red-950/20 p-3 text-sm text-red-200">
          {historyError}
        </p>
      ) : null}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {generatedMedia.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-white/10 bg-black/30 p-4"
          >
            <p className="font-medium">{item.title}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.15em] text-[var(--muted)]">
              {item.status}
            </p>
          </article>
        ))}
      </div>
      {hasMoreHistory ? (
        <button
          type="button"
          onClick={onLoadMoreHistory}
          className="mt-5 rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em]"
        >
          Load More
        </button>
      ) : null}
    </section>
  );
}

function PreviewComposer(props) {
  return (
    <section className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/60 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        Preview Composer
      </p>
      <h2 className="mt-2 font-display text-3xl">
        {props.mode === "VIDEO" ? "Build a Video" : "Build an Image"}
      </h2>
      <p className="mt-4 text-sm text-[var(--muted)]">{props.prompt}</p>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Coins: {props.coinBalance} / Cost: {props.coinCost}
      </p>
      {props.generationHelpText ? (
        <p className="mt-3 rounded-xl border border-white/10 p-3 text-xs leading-5 text-[var(--muted)]">
          {props.generationHelpText}
        </p>
      ) : null}
      {props.generationError ? (
        <p className="mt-3 rounded-xl border border-red-400/25 bg-red-950/20 p-3 text-xs text-red-200">
          {props.generationError}
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!props.canGenerateImage}
          onClick={props.onGenerateImage}
          className="rounded-xl border border-[var(--muted-gold)]/35 px-4 py-3 text-xs uppercase tracking-[0.16em] disabled:opacity-40"
        >
          Generate
        </button>
        <button
          type="button"
          onClick={() => props.onOpenIngredient?.({ id: "outfit", label: "Outfit" })}
          className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em]"
        >
          Open Ingredient
        </button>
      </div>
    </section>
  );
}

function PreviewPickerModal({ slot, items = [], onClose, onSelect }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-6">
      <section className="w-full max-w-lg rounded-2xl border border-[var(--muted-gold)]/30 bg-black p-6">
        <h2 className="font-display text-3xl">Choose {slot?.label}</h2>
        <div className="mt-4 grid gap-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect?.(item)}
              className="rounded-xl border border-white/10 px-4 py-3 text-left"
            >
              {item.title}
            </button>
          ))}
        </div>
        <button type="button" onClick={onClose} className="mt-5 text-sm underline">
          Close
        </button>
      </section>
    </div>
  );
}

function PreviewSavePresetModal({ slot, promptValue, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-6">
      <section className="w-full max-w-lg rounded-2xl border border-[var(--muted-gold)]/30 bg-black p-6">
        <h2 className="font-display text-3xl">Save {slot?.label} Preset</h2>
        <p className="mt-4 text-sm text-[var(--muted)]">{promptValue}</p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={() => onSave?.({ name: "Fixture Preset" })}
            className="rounded-xl border border-[var(--muted-gold)]/30 px-4 py-3 text-sm"
          >
            Simulate Save
          </button>
          <button type="button" onClick={onClose} className="text-sm underline">
            Close
          </button>
        </div>
      </section>
    </div>
  );
}

export default function ImageStudioWorkbenchPreviewClient() {
  const [activeState, setActiveState] = useState("ready");
  const [mobileComposerOpen, setMobileComposerOpen] = useState(false);
  const [feedback, setFeedback] = useState("No preview action yet.");

  const previewProps = useMemo(() => {
    const fixture = PREVIEW_STATES[activeState].fixture;

    return {
      ...fixture,
      mobileComposerOpen,
      onOpenMobileComposer: () => setMobileComposerOpen(true),
      onCloseMobileComposer: () => setMobileComposerOpen(false),
      onQuickGenerate: (event) => {
        event.stopPropagation();
        setFeedback("Quick Generate requested without spending coins.");
      },
      mediaHistoryProps: {
        ...fixture.mediaHistoryProps,
        onLoadMoreHistory: () => setFeedback("Load More requested."),
      },
      composerProps: {
        ...fixture.composerProps,
        onGenerateImage: () =>
          setFeedback("Generate requested without submitting a job."),
        onOpenIngredient: () => setFeedback("Ingredient picker requested."),
      },
      pickerModalProps: fixture.pickerModalProps
        ? {
            ...fixture.pickerModalProps,
            onSelect: (item) => setFeedback(`Selected ${item.title}.`),
            onClose: () => setActiveState("ready"),
          }
        : null,
      savePresetModalProps: fixture.savePresetModalProps
        ? {
            ...fixture.savePresetModalProps,
            onSave: () => setFeedback("Preset save simulated."),
            onClose: () => setActiveState("ready"),
          }
        : null,
    };
  }, [activeState, mobileComposerOpen]);

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-8 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Image Studio Workbench</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Exercises the portable Workbench layout and injected child-control
            contract without loading account data, fetching history, saving a
            Creation, spending coins, or submitting generation work.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {Object.entries(PREVIEW_STATES).map(([key, state]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveState(key);
                  setMobileComposerOpen(false);
                  setFeedback("No preview action yet.");
                }}
                className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.15em] ${
                  activeState === key
                    ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/10"
                    : "border-white/10 text-[var(--muted)]"
                }`}
              >
                {state.label}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">{feedback}</p>
        </header>

        <ImageStudioWorkbenchView
          {...previewProps}
          MediaHistoryGridComponent={PreviewMediaHistory}
          ImageStudioComposerComponent={PreviewComposer}
          IngredientPickerModalComponent={PreviewPickerModal}
          SaveIngredientPresetModalComponent={PreviewSavePresetModal}
        />
      </div>
    </main>
  );
}
