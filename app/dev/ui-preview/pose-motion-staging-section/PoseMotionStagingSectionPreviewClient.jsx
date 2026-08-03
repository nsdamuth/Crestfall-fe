"use client";

import { useEffect, useState } from "react";

import PoseMotionStagingSectionView from "@/components/studio/my-creations/edit/sections/poses/pose-motion-staging-section/PoseMotionStagingSection.view";
import {
  poseMotionStagingSectionActionFixture,
  poseMotionStagingSectionCustomCopyFixture,
  poseMotionStagingSectionDefaultFixture,
  poseMotionStagingSectionEmptyFixture,
  poseMotionStagingSectionLongContentFixture,
  poseMotionStagingSectionMissingCallbacksFixture,
  poseMotionStagingSectionQuietFixture,
} from "@/components/studio/my-creations/edit/sections/poses/pose-motion-staging-section/PoseMotionStagingSection.fixtures";

const PREVIEW_STATES = {
  default: {
    label: "Default",
    props: poseMotionStagingSectionDefaultFixture,
  },
  empty: {
    label: "Empty",
    props: poseMotionStagingSectionEmptyFixture,
  },
  quiet: {
    label: "Quiet",
    props: poseMotionStagingSectionQuietFixture,
  },
  action: {
    label: "Action",
    props: poseMotionStagingSectionActionFixture,
  },
  longContent: {
    label: "Long Content",
    props: poseMotionStagingSectionLongContentFixture,
  },
  customCopy: {
    label: "Custom Copy",
    props: poseMotionStagingSectionCustomCopyFixture,
  },
  missingCallbacks: {
    label: "Missing Callbacks",
    props: poseMotionStagingSectionMissingCallbacksFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

export default function PoseMotionStagingSectionPreviewClient() {
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

  const updateValue = (key, label) =>
    callbacksEnabled
      ? (value) => {
          setViewProps((current) => ({
            ...current,
            [key]: value,
          }));
          setFeedback(`${label} changed: ${value || "(empty)"}`);
        }
      : null;

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Pose Motion / Staging Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable Pose motion/staging form directly
            from contract-shaped fixtures. Field changes update local preview
            state only.
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
            <PoseMotionStagingSectionView
              {...viewProps}
              onChangeActionMotion={updateValue(
                "actionMotionValue",
                "Action / motion"
              )}
              onChangeEnergyLevel={updateValue(
                "energyLevelValue",
                "Energy level"
              )}
              onChangeViewerRelation={updateValue(
                "viewerRelationValue",
                "Viewer relation"
              )}
              onChangePropInteraction={updateValue(
                "propInteractionValue",
                "Prop interaction"
              )}
              onChangeSceneFit={updateValue("sceneFitValue", "Scene fit")}
              onChangeMoodAttitude={updateValue(
                "moodAttitudeValue",
                "Mood / attitude"
              )}
              onChangeStagingNotes={updateValue(
                "stagingNotesValue",
                "Staging notes"
              )}
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
              Fixtures contain only display-ready motion and staging values. Raw
              creation forms, stored Pose field names, save behavior, and
              persistence remain application-owned.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
