"use client";

import { useState } from "react";

import CustomIngredientEditorView from "@/components/studio/image-studio/custom-ingredient-editor/CustomIngredientEditor.view";
import {
  customIngredientEditorClosedFixture,
  customIngredientEditorEmptyFixture,
  customIngredientEditorLongContentFixture,
  customIngredientEditorPresetFixture,
  customIngredientEditorUseOnceFixture,
} from "@/components/studio/image-studio/custom-ingredient-editor/CustomIngredientEditor.fixtures";

const PREVIEW_STATES = {
  preset: {
    label: "Saveable Preset",
    props: customIngredientEditorPresetFixture,
  },
  useOnce: {
    label: "Use Once Only",
    props: customIngredientEditorUseOnceFixture,
  },
  empty: {
    label: "Empty Guidance",
    props: customIngredientEditorEmptyFixture,
  },
  longContent: {
    label: "Long Content",
    props: customIngredientEditorLongContentFixture,
  },
  closed: {
    label: "Closed",
    props: customIngredientEditorClosedFixture,
  },
};

export default function CustomIngredientEditorPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("preset");
  const [promptValue, setPromptValue] = useState(
    PREVIEW_STATES.preset.props.promptValue
  );
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No Image Studio session is connected."
  );

  const activeState = PREVIEW_STATES[activeStateKey];


  function chooseState(stateKey) {
    const nextState = PREVIEW_STATES[stateKey];
    setActiveStateKey(stateKey);
    setPromptValue(nextState.props.promptValue);
    setLastAction(`Loaded the ${nextState.label} fixture.`);
  }

  function recordAction(message) {
    setLastAction(`${message} This was fixture-only and was not saved.`);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Image Studio Custom Ingredient Editor
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable inline editor directly from
            fixtures. It does not change composer ingredients, open the real
            picker, create a preset, or save application data.
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
                onClick={() => chooseState(stateKey)}
                className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
                  activeStateKey === stateKey
                    ? "border-[var(--muted-gold)]/45 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                    : "border-white/10 text-[var(--muted)] hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
                }`}
              >
                {state.label}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            {lastAction}
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Portable View
          </p>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/35 p-4">
            <CustomIngredientEditorView
              {...activeState.props}
              promptValue={promptValue}
              onChangePrompt={(nextValue) => {
                setPromptValue(nextValue);
                setLastAction("Custom guidance changed locally in the preview.");
              }}
              onBackToPresets={() => recordAction("Back to Presets requested.")}
              onClear={() => recordAction("Clear requested.")}
              onSavePreset={() => recordAction("Save as Preset requested.")}
            />

            {!activeState.props.open ? (
              <p className="text-sm leading-6 text-[var(--muted)]">
                The closed fixture returns no editor markup, matching the live
                component when the selected ingredient is not custom.
              </p>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            The View receives only display-ready labels, copy, prompt state,
            action visibility, and semantic callbacks. Slot definitions,
            selected-ingredient storage, and preset workflow behavior remain
            outside the View.
          </p>
        </section>
      </div>
    </main>
  );
}
