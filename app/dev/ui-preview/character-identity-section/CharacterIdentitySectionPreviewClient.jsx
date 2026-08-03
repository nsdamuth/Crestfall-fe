"use client";

import { useEffect, useState } from "react";

import CharacterIdentitySectionView from "@/components/studio/my-creations/edit/sections/character-identity-section/CharacterIdentitySection.view";
import {
  characterIdentitySectionCustomIdentityFixture,
  characterIdentitySectionDefaultFixture,
  characterIdentitySectionFallbackFixture,
  characterIdentitySectionLongContentFixture,
  characterIdentitySectionMinimumAgeFixture,
  characterIdentitySectionMissingCallbacksFixture,
  characterIdentitySectionNoOptionsFixture,
} from "@/components/studio/my-creations/edit/sections/character-identity-section/CharacterIdentitySection.fixtures";

const PREVIEW_STATES = {
  default: {
    label: "Default Character",
    props: characterIdentitySectionDefaultFixture,
  },
  customIdentity: {
    label: "Custom Identity",
    props: characterIdentitySectionCustomIdentityFixture,
  },
  fallback: {
    label: "Fallback Values",
    props: characterIdentitySectionFallbackFixture,
  },
  minimumAge: {
    label: "Adult Minimum",
    props: characterIdentitySectionMinimumAgeFixture,
  },
  longContent: {
    label: "Long Content",
    props: characterIdentitySectionLongContentFixture,
  },
  noOptions: {
    label: "No Options",
    props: characterIdentitySectionNoOptionsFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: characterIdentitySectionMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

function PreviewControl({ label, value, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="w-full rounded-2xl border border-white/10 bg-black/25 p-4 text-left transition hover:border-[var(--muted-gold)]/40"
    >
      <span className="text-xs uppercase tracking-[0.22em] text-[var(--muted-gold)]">
        {label}
      </span>
      <span className="mt-2 block text-sm text-[var(--foreground)]">
        {value || "Not chosen"}
      </span>
    </button>
  );
}

export default function CharacterIdentitySectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.default.props)
  );
  const [feedback, setFeedback] = useState("No preview action yet.");

  const activeState = PREVIEW_STATES[activeStateKey];

  useEffect(() => {
    setViewProps(cloneFixture(activeState.props));
    setFeedback("No preview action yet.");
  }, [activeState]);

  const callbacksEnabled = activeStateKey !== "missingCallbacks";

  function updateValue(field, value, message) {
    setViewProps((current) => ({ ...current, [field]: value }));
    setFeedback(message);
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Character Identity Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable identity form directly from
            contract-shaped fixtures. Changes update local preview state only.
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
            <CharacterIdentitySectionView
              {...viewProps}
              colorPaletteControl={
                <PreviewControl
                  label="Character Color Palette"
                  value={viewProps.colorPaletteValue}
                  onChange={() =>
                    updateValue(
                      "colorPaletteValue",
                      viewProps.colorPaletteValue === "CRESTFALL_DEFAULT"
                        ? "EMBER_GOLD"
                        : "CRESTFALL_DEFAULT",
                      "Color palette preview changed."
                    )
                  }
                />
              }
              roleArchetypeControl={
                <PreviewControl
                  label="Role Archetype"
                  value={viewProps.roleArchetypeValue}
                  onChange={() =>
                    updateValue(
                      "roleArchetypeValue",
                      viewProps.roleArchetypeValue === "ARTIFICER"
                        ? "INVESTIGATOR"
                        : "ARTIFICER",
                      "Role archetype preview changed."
                    )
                  }
                />
              }
              onChangeCharacterName={
                callbacksEnabled
                  ? (value) =>
                      updateValue(
                        "characterNameValue",
                        value,
                        `Character name changed: ${value || "(empty)"}`
                      )
                  : null
              }
              onChangeCharacterTitle={
                callbacksEnabled
                  ? (value) =>
                      updateValue(
                        "characterTitleValue",
                        value,
                        `Character title changed: ${value || "(empty)"}`
                      )
                  : null
              }
              onSelectSpecies={
                callbacksEnabled
                  ? (value) => {
                      setViewProps((current) => ({
                        ...current,
                        speciesValue: value,
                        showCustomSpecies: value === "CUSTOM",
                      }));
                      setFeedback(`Species changed: ${value || "Not chosen"}`);
                    }
                  : null
              }
              onChangeCustomSpecies={
                callbacksEnabled
                  ? (value) =>
                      updateValue(
                        "customSpeciesValue",
                        value,
                        `Custom species changed: ${value || "(empty)"}`
                      )
                  : null
              }
              onSelectRenderingStyle={
                callbacksEnabled
                  ? (value) =>
                      updateValue(
                        "renderingStyleValue",
                        value,
                        `Rendering style changed: ${value}`
                      )
                  : null
              }
              onChangeAge={
                callbacksEnabled
                  ? (value) =>
                      updateValue("ageValue", value, `Age changed: ${value}`)
                  : null
              }
              onCommitAge={
                callbacksEnabled
                  ? (value) => {
                      const nextValue = Number(value) < 18 ? "18" : value;
                      updateValue(
                        "ageValue",
                        nextValue,
                        `Committed adult age: ${nextValue || "(empty)"}`
                      );
                    }
                  : null
              }
              onSelectGenderPresentation={
                callbacksEnabled
                  ? (value) => {
                      setViewProps((current) => ({
                        ...current,
                        genderPresentationValue: value,
                        showCustomGenderPresentation: value === "CUSTOM",
                      }));
                      setFeedback(
                        `Gender presentation changed: ${value || "Not chosen"}`
                      );
                    }
                  : null
              }
              onChangeCustomGenderPresentation={
                callbacksEnabled
                  ? (value) =>
                      updateValue(
                        "customGenderPresentationValue",
                        value,
                        `Custom gender presentation changed: ${
                          value || "(empty)"
                        }`
                      )
                  : null
              }
            />
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-black/25 p-6 xl:sticky xl:top-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Preview Feedback
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {feedback}
            </p>

            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Contract Boundary
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Fixtures contain display-ready identity values only. Raw creation
              forms, JSON field names, age enforcement, modal ownership, saving,
              and persistence remain application-owned.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
