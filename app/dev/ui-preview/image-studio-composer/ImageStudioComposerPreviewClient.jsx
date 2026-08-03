"use client";

import { useEffect, useMemo, useState } from "react";

import ImageStudioComposerView from "@/components/studio/image-studio/image-studio-composer/ImageStudioComposer.view";
import {
  imageStudioComposerCoinLoadingFixture,
  imageStudioComposerCustomFixture,
  imageStudioComposerDefaultFixture,
  imageStudioComposerErrorFixture,
  imageStudioComposerLongContentFixture,
  imageStudioComposerUnavailableFixture,
  imageStudioComposerVideoFixture,
} from "@/components/studio/image-studio/image-studio-composer/ImageStudioComposer.fixtures";
import { videoToolsDefaultFixture } from "@/components/studio/image-studio/video-tools-panel/VideoToolsPanel.fixtures";

const PREVIEW_STATES = {
  default: { label: "Image Ready", props: imageStudioComposerDefaultFixture },
  unavailable: {
    label: "Unavailable",
    props: imageStudioComposerUnavailableFixture,
  },
  custom: { label: "Custom Ingredient", props: imageStudioComposerCustomFixture },
  video: { label: "Video Stub", props: imageStudioComposerVideoFixture },
  coinLoading: {
    label: "Coin Loading",
    props: imageStudioComposerCoinLoadingFixture,
  },
  error: { label: "Errors", props: imageStudioComposerErrorFixture },
  longContent: {
    label: "Long Content",
    props: imageStudioComposerLongContentFixture,
  },
};

export default function ImageStudioComposerPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");
  const activeState = PREVIEW_STATES[activeStateKey];
  const [mode, setMode] = useState(activeState.props.mode);
  const [prompt, setPrompt] = useState(activeState.props.promptValue);
  const [negativePrompt, setNegativePrompt] = useState(
    activeState.props.negativePromptValue
  );
  const [optionValues, setOptionValues] = useState(() =>
    Object.fromEntries(
      activeState.props.imageOptionFields.map((field) => [field.id, field.value])
    )
  );
  const [customPromptValues, setCustomPromptValues] = useState(() =>
    Object.fromEntries(
      activeState.props.customEditorItems.map((item) => [
        item.id,
        item.viewProps.promptValue,
      ])
    )
  );
  const initialVideoProps =
    activeState.props.videoToolsProps || videoToolsDefaultFixture;
  const [videoValues, setVideoValues] = useState({
    durationValue: initialVideoProps.durationValue,
    aspectRatioValue: initialVideoProps.aspectRatioValue,
    motionStyleValue: initialVideoProps.motionStyleValue,
  });
  const [feedback, setFeedback] = useState("No preview action yet.");

  useEffect(() => {
    setMode(activeState.props.mode);
    setPrompt(activeState.props.promptValue);
    setNegativePrompt(activeState.props.negativePromptValue);
    setOptionValues(
      Object.fromEntries(
        activeState.props.imageOptionFields.map((field) => [field.id, field.value])
      )
    );
    setCustomPromptValues(
      Object.fromEntries(
        activeState.props.customEditorItems.map((item) => [
          item.id,
          item.viewProps.promptValue,
        ])
      )
    );
    const nextVideoProps =
      activeState.props.videoToolsProps || videoToolsDefaultFixture;
    setVideoValues({
      durationValue: nextVideoProps.durationValue,
      aspectRatioValue: nextVideoProps.aspectRatioValue,
      motionStyleValue: nextVideoProps.motionStyleValue,
    });
    setFeedback("No preview action yet.");
  }, [activeState]);

  const previewProps = useMemo(
    () => ({
      ...activeState.props,
      mode,
      composerTitle: mode === "VIDEO" ? "Build a Video" : "Build an Image",
      promptValue: prompt,
      negativePromptValue: negativePrompt,
      videoToolsProps:
        mode === "VIDEO"
          ? {
              ...(activeState.props.videoToolsProps || videoToolsDefaultFixture),
              durationValue: videoValues.durationValue,
              aspectRatioValue: videoValues.aspectRatioValue,
              motionStyleValue: videoValues.motionStyleValue,
              directionValue: prompt,
              onChangeDirection: setPrompt,
              onChangeDuration: (nextValue) => {
                setVideoValues((current) => ({
                  ...current,
                  durationValue: nextValue,
                }));
                setFeedback(`Video duration: ${nextValue}`);
              },
              onChangeAspectRatio: (nextValue) => {
                setVideoValues((current) => ({
                  ...current,
                  aspectRatioValue: nextValue,
                }));
                setFeedback(`Video aspect: ${nextValue}`);
              },
              onChangeMotionStyle: (nextValue) => {
                setVideoValues((current) => ({
                  ...current,
                  motionStyleValue: nextValue,
                }));
                setFeedback(`Motion style: ${nextValue}`);
              },
            }
          : null,
      ingredientSlotItems: activeState.props.ingredientSlotItems.map((item) => ({
        ...item,
        viewProps: {
          ...item.viewProps,
          onOpenSlot: () => setFeedback(`Open ingredient: ${item.viewProps.label}`),
          onClearSlot: () => setFeedback(`Clear ingredient: ${item.viewProps.label}`),
        },
      })),
      customEditorItems: activeState.props.customEditorItems.map((item) => ({
        ...item,
        viewProps: {
          ...item.viewProps,
          promptValue:
            customPromptValues[item.id] ?? item.viewProps.promptValue,
          onChangePrompt: (nextValue) => {
            setCustomPromptValues((current) => ({
              ...current,
              [item.id]: nextValue,
            }));
            setFeedback(`Custom prompt: ${nextValue || "(empty)"}`);
          },
          onBackToPresets: () => setFeedback("Back to ingredient presets."),
          onClear: () => setFeedback("Clear custom ingredient."),
          onSavePreset: () => setFeedback("Preview save-preset action."),
        },
      })),
      imageOptionFields: activeState.props.imageOptionFields.map((field) => ({
        ...field,
        value: optionValues[field.id] ?? field.value,
        onChange: (nextValue) => {
          setOptionValues((current) => ({ ...current, [field.id]: nextValue }));
          setFeedback(`${field.label}: ${nextValue}`);
        },
      })),
      onChangeMode: setMode,
      onChangePrompt: setPrompt,
      onChangeNegativePrompt: setNegativePrompt,
      onGenerateImage: () => setFeedback(`Preview generate: ${prompt}`),
    }),
    [
      activeState.props,
      customPromptValues,
      mode,
      negativePrompt,
      optionValues,
      prompt,
      videoValues,
    ]
  );

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Image Studio Composer</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable composer with local fixture state.
            It does not open production pickers, spend coins, save presets, or
            start image generation.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Preview States
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(PREVIEW_STATES).map(([stateKey, state]) => (
              <button
                key={stateKey}
                type="button"
                onClick={() => setActiveStateKey(stateKey)}
                className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
                  activeStateKey === stateKey
                    ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/10 text-[var(--foreground)]"
                    : "border-white/10 text-[var(--muted)] hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
                }`}
              >
                {state.label}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Preview Feedback
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">{feedback}</p>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="min-h-[760px] rounded-2xl border border-white/10 bg-black/25 p-6 text-sm leading-6 text-[var(--muted)]">
            The production Image Studio media-history surface is intentionally
            omitted. Use the composer controls to exercise contract behavior.
          </div>
          <ImageStudioComposerView {...previewProps} />
        </section>
      </div>
    </main>
  );
}
