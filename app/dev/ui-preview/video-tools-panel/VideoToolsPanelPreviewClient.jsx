"use client";

import { useState } from "react";

import VideoToolsPanelView from "@/components/studio/image-studio/video-tools-panel/VideoToolsPanel.view";
import {
  videoToolsActionFixture,
  videoToolsCinematicFixture,
  videoToolsDefaultFixture,
  videoToolsEmotiveFixture,
  videoToolsEmptyCardsFixture,
  videoToolsLongDirectionFixture,
} from "@/components/studio/image-studio/video-tools-panel/VideoToolsPanel.fixtures";

const PREVIEW_STATES = {
  default: {
    label: "Default",
    props: videoToolsDefaultFixture,
  },
  cinematic: {
    label: "Cinematic",
    props: videoToolsCinematicFixture,
  },
  action: {
    label: "Action",
    props: videoToolsActionFixture,
  },
  emotive: {
    label: "Emotive",
    props: videoToolsEmotiveFixture,
  },
  longDirection: {
    label: "Long Direction",
    props: videoToolsLongDirectionFixture,
  },
  emptyCards: {
    label: "No Tool Cards",
    props: videoToolsEmptyCardsFixture,
  },
};

function fixtureState(fixture) {
  return {
    toolCards: fixture.toolCards.map((tool) => ({ ...tool })),
    durationValue: fixture.durationValue,
    durationOptions: fixture.durationOptions.map((option) => ({ ...option })),
    aspectRatioValue: fixture.aspectRatioValue,
    aspectRatioOptions: fixture.aspectRatioOptions.map((option) => ({
      ...option,
    })),
    motionStyleValue: fixture.motionStyleValue,
    motionStyleOptions: fixture.motionStyleOptions.map((option) => ({
      ...option,
    })),
    directionValue: fixture.directionValue,
  };
}

export default function VideoToolsPanelPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");
  const [panelState, setPanelState] = useState(() =>
    fixtureState(PREVIEW_STATES.default.props)
  );
  const [lastAction, setLastAction] = useState(
    "Preview loaded. No video request or media workflow is connected."
  );

  function openState(stateKey) {
    const nextState = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setPanelState(fixtureState(nextState.props));
    setLastAction(`Opened the ${nextState.label} fixture.`);
  }

  function changeDuration(nextValue) {
    setPanelState((current) => ({ ...current, durationValue: nextValue }));
    setLastAction(`Changed duration to ${nextValue} locally.`);
  }

  function changeAspectRatio(nextValue) {
    setPanelState((current) => ({ ...current, aspectRatioValue: nextValue }));
    setLastAction(`Changed video aspect to ${nextValue} locally.`);
  }

  function changeMotionStyle(nextValue) {
    setPanelState((current) => ({ ...current, motionStyleValue: nextValue }));
    setLastAction(`Changed motion style to ${nextValue} locally.`);
  }

  function changeDirection(nextValue) {
    setPanelState((current) => ({ ...current, directionValue: nextValue }));
    setLastAction("Edited the video direction in preview-local state.");
  }

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">Video Tools Panel</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable View directly from contract-shaped
            fixtures. Controls modify only local preview state; video generation
            remains intentionally unavailable.
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

          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            {lastAction}
          </p>
        </section>

        <div className="max-w-md rounded-2xl border border-white/10 bg-black/45 p-4">
          <VideoToolsPanelView
            {...panelState}
            onChangeDuration={changeDuration}
            onChangeAspectRatio={changeAspectRatio}
            onChangeMotionStyle={changeMotionStyle}
            onChangeDirection={changeDirection}
          />
        </div>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            Contract Boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Fixtures contain display-ready tool cards, selector options, current
            values, direction text, and semantic edit callbacks. Image Studio
            ownership, composer mode, future request construction, API calls,
            media creation, and persistence remain application-owned.
          </p>
        </section>
      </div>
    </main>
  );
}
