"use client";

import { useEffect, useState } from "react";

import CharacterTemplateFieldsSectionView from "@/components/studio/my-creations/edit/sections/character-template-fields-section/CharacterTemplateFieldsSection.view";
import {
  characterTemplateFieldsAppearanceFixture,
  characterTemplateFieldsBehaviorFixture,
  characterTemplateFieldsBodyFixture,
  characterTemplateFieldsIdentityFixture,
  characterTemplateFieldsMissingCallbacksFixture,
  characterTemplateFieldsTemplateFixture,
} from "@/components/studio/my-creations/edit/sections/character-template-fields-section/CharacterTemplateFieldsSection.fixtures";

const PREVIEW_STATES = {
  template: { label: "Template Info", props: characterTemplateFieldsTemplateFixture },
  identity: { label: "Identity", props: characterTemplateFieldsIdentityFixture },
  appearance: { label: "Appearance", props: characterTemplateFieldsAppearanceFixture },
  body: { label: "Body", props: characterTemplateFieldsBodyFixture },
  behavior: { label: "Behavior", props: characterTemplateFieldsBehaviorFixture },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: characterTemplateFieldsMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

function PreviewControl({ label, value, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-white/10 bg-black/25 p-4 text-left transition hover:border-[var(--muted-gold)]/40"
    >
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </span>
      <span className="mt-2 block text-sm text-[var(--foreground)]">
        {value}
      </span>
    </button>
  );
}

export default function CharacterTemplateFieldsSectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("template");
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.template.props)
  );
  const [feedback, setFeedback] = useState("No preview action yet.");
  const activeState = PREVIEW_STATES[activeStateKey];
  const callbacksEnabled = activeStateKey !== "missingCallbacks";

  useEffect(() => {
    setViewProps(cloneFixture(activeState.props));
    setFeedback("No preview action yet.");
  }, [activeState]);

  const control = (label, value) => (
    <PreviewControl
      label={label}
      value={value}
      onClick={() => setFeedback(`${label} preview opened.`)}
    />
  );

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Character Template Fields Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders all five portable Character Template edit tabs
            without Crestfall application modals.
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

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-6">
            <CharacterTemplateFieldsSectionView
              {...viewProps}
              roleArchetypeControl={control("Role Archetype", "Investigator")}
              skinToneControl={control("Skin Tone", "Warm")}
              eyeColorControl={control("Eye Color", "Hazel")}
              hairColorControl={control("Hair Color", "Black")}
              hairStyleControl={control("Hair Style", "Loose Waves")}
              kibbePresetControl={control("Kibbe Preset", "Natural")}
              bodyTypeControl={control("Body Type", "Athletic")}
              heightControl={control("Height", "Average")}
              buildControl={control("Build", "Graceful")}
              proportionsControl={control("Proportions", "Balanced")}
              outwardPersonalityControl={control("Outward Personality", "Reserved")}
              internalPersonalityControl={control("Internal Personality", "Analytical")}
              mbtiControl={control("MBTI", "INTJ")}
              westernZodiacControl={control("Western Zodiac", "Scorpio")}
              eastAsianZodiacControl={control("East Asian Zodiac", "Snake")}
              speechStyleControl={control("Speech Style", "Measured")}
              movementStyleControl={control("Movement Style", "Deliberate")}
              interestsControl={control("Interests", "Mysteries")}
              onChangeTemplateName={
                callbacksEnabled
                  ? (value) => setViewProps((current) => ({ ...current, templateNameValue: value }))
                  : null
              }
              onChangeCategory={
                callbacksEnabled
                  ? (value) => setViewProps((current) => ({ ...current, categoryValue: value }))
                  : null
              }
              onChangeShortDescription={
                callbacksEnabled
                  ? (value) => setViewProps((current) => ({ ...current, shortDescriptionValue: value }))
                  : null
              }
              onChangeTags={
                callbacksEnabled
                  ? (value) => setViewProps((current) => ({ ...current, tagsValue: value }))
                  : null
              }
              onChangeDefaultName={(value) =>
                setViewProps((current) => ({ ...current, defaultNameValue: value }))
              }
              onChangeDefaultTitle={(value) =>
                setViewProps((current) => ({ ...current, defaultTitleValue: value }))
              }
              onSelectSpecies={(value) =>
                setViewProps((current) => ({ ...current, speciesValue: value }))
              }
              onSelectGenderPresentation={(value) =>
                setViewProps((current) => ({ ...current, genderPresentationValue: value }))
              }
              onChangeClothingStyle={(value) =>
                setViewProps((current) => ({ ...current, clothingStyleValue: value }))
              }
              onChangeBodyNotes={(value) =>
                setViewProps((current) => ({ ...current, bodyNotesValue: value }))
              }
              onSelectVerbosity={(value) =>
                setViewProps((current) => ({ ...current, verbosityValue: value }))
              }
              onChangePhilosophy={(value) =>
                setViewProps((current) => ({ ...current, philosophyValue: value }))
              }
            />
          </div>

          <aside className="rounded-2xl border border-white/10 bg-black/25 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Preview Feedback
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {feedback}
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
