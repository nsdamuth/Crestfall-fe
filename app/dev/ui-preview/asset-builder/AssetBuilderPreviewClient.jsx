"use client";

import { useState } from "react";

import AssetBuilderView from "@/components/studio/create/assets/asset-builder/AssetBuilder.view";
import {
  assetBuilderEmptyFixture,
  assetBuilderErrorFixture,
  assetBuilderImagePresetFixture,
  assetBuilderLocationFixture,
  assetBuilderOutfitFixture,
  assetBuilderPoseFixture,
  assetBuilderSavedFixture,
  assetBuilderSavingFixture,
} from "@/components/studio/create/assets/asset-builder/AssetBuilder.fixtures";

const PREVIEW_STATES = {
  outfit: { label: "Outfit", props: assetBuilderOutfitFixture },
  pose: { label: "Pose", props: assetBuilderPoseFixture },
  imagePreset: {
    label: "Image Preset",
    props: assetBuilderImagePresetFixture,
  },
  location: { label: "Location", props: assetBuilderLocationFixture },
  empty: { label: "Empty", props: assetBuilderEmptyFixture },
  saving: { label: "Saving", props: assetBuilderSavingFixture },
  saved: { label: "Saved", props: assetBuilderSavedFixture },
  error: { label: "Error", props: assetBuilderErrorFixture },
};

function FixtureLocationRuntime() {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-[var(--muted)]">
      Fixture runtime-module controls supplied by the preview host.
    </div>
  );
}

function FixtureRegistryAttachments() {
  return (
    <div className="text-sm text-[var(--muted)]">
      Fixture registry attachment controls supplied by the preview host.
    </div>
  );
}

export default function AssetBuilderPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("outfit");
  const [viewProps, setViewProps] = useState({ ...assetBuilderOutfitFixture });
  const [lastAction, setLastAction] = useState(
    "Choose a fixture or edit preview-local asset fields."
  );

  function openState(stateKey) {
    const state = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setViewProps({ ...state.props });
    setLastAction(`Opened the ${state.label} fixture.`);
  }

  function updateField(field, value) {
    setViewProps((current) => ({
      ...current,
      form: {
        ...current.form,
        [field]: value,
      },
    }));
    setLastAction(`Updated ${field} in preview-local state.`);
  }

  function updateExtra(field, value) {
    setViewProps((current) => ({
      ...current,
      extraValues: {
        ...current.extraValues,
        [field]: value,
      },
    }));
    setLastAction(`Updated ${field} in preview-local extra values.`);
  }

  const isLocation = viewProps.creationType === "LOCATION";

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Visual Asset Builder</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable builder directly. Creation
            persistence, navigation, location pickers, runtime modules, and
            registry queries remain disconnected.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <div className="flex flex-wrap gap-3">
            {Object.entries(PREVIEW_STATES).map(([stateKey, state]) => (
              <button
                key={stateKey}
                type="button"
                onClick={() => openState(stateKey)}
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
          <p className="mt-4 text-sm text-[var(--muted)]">{lastAction}</p>
        </section>

        <AssetBuilderView
          {...viewProps}
          locationRuntimeContent={
            isLocation ? <FixtureLocationRuntime /> : null
          }
          locationRegistryContent={
            isLocation ? <FixtureRegistryAttachments /> : null
          }
          onUpdateField={updateField}
          onUpdateExtra={updateExtra}
          onSelectCover={(candidateId) => {
            setViewProps((current) => ({
              ...current,
              selectedCover: candidateId,
            }));
            setLastAction(`Selected ${candidateId} in preview-local state.`);
          }}
          onOpenParentPicker={() =>
            setLastAction("Requested the application parent-location picker.")
          }
          onClearParentLocation={() => {
            setViewProps((current) => ({
              ...current,
              parentLocation: {
                id: "",
                title: "",
                imageUrl: "",
                scale: "",
                spaceType: "",
              },
            }));
            setLastAction("Cleared the preview-local parent location.");
          }}
          onSave={() => setLastAction("Requested a preview-local draft save.")}
        />
      </div>
    </main>
  );
}
