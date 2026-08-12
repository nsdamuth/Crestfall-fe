"use client";

import { useEffect, useMemo, useState } from "react";

import CreatorStopsView from "@/components/studio/create/character/creator-stops/CreatorStops.view";
import {
  buildWorldStopItems,
  WORLD_STOP_IDS,
} from "@/components/studio/create/world/creator-stops/WorldCreatorStops.contract";
import {
  worldCreatorStopsEmptyFixture,
  worldCreatorStopsFilledFixture,
  worldCreatorStopsMidSavedFixture,
  worldCreatorStopsFinalSavedFixture,
  EMPTY_WORLD_FORM_STATE,
  FILLED_WORLD_FORM_STATE,
} from "@/components/studio/create/world/creator-stops/WorldCreatorStops.fixtures";
import NameStopView from "@/components/studio/create/world/creator-stops/name-stop/NameStopView";
import PremiseStopView from "@/components/studio/create/world/creator-stops/premise-stop/PremiseStopView";
import SettingStopView from "@/components/studio/create/world/creator-stops/setting-stop/SettingStopView";
import ToneStopView from "@/components/studio/create/world/creator-stops/tone-stop/ToneStopView";
import LookStopView from "@/components/studio/create/world/creator-stops/look-stop/LookStopView";

const STATES = [
  ["Empty", worldCreatorStopsEmptyFixture, EMPTY_WORLD_FORM_STATE],
  ["Filled", worldCreatorStopsFilledFixture, FILLED_WORLD_FORM_STATE],
  ["Saved, mid-flow (confirmation only)", worldCreatorStopsMidSavedFixture, FILLED_WORLD_FORM_STATE],
  ["Saved, final stop (post-save footer)", worldCreatorStopsFinalSavedFixture, FILLED_WORLD_FORM_STATE],
];

export default function WorldCreatorStopsPreviewClient() {
  const [selectedState, setSelectedState] = useState(0);
  const [activeStop, setActiveStop] = useState(STATES[0][1].activeStop);
  const [maxReachedIndex, setMaxReachedIndex] = useState(
    Math.max(0, WORLD_STOP_IDS.indexOf(STATES[0][1].activeStop))
  );
  const [formState, setFormState] = useState(STATES[0][2]);
  const [savedSnapshot, setSavedSnapshot] = useState(STATES[0][2]);
  const [isOpen, setIsOpen] = useState(true);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [note, setNote] = useState("");

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(formState) !== JSON.stringify(savedSnapshot),
    [formState, savedSnapshot]
  );

  useEffect(() => {
    const index = Math.max(0, WORLD_STOP_IDS.indexOf(activeStop));
    setMaxReachedIndex((current) => Math.max(current, index));
  }, [activeStop]);

  function updateField(key) {
    return (value) => {
      setFormState((current) => ({ ...current, [key]: value }));
      setJustSaved(false);
    };
  }

  function requestClose() {
    if (hasUnsavedChanges) {
      setConfirmDiscardOpen(true);
      return;
    }
    setIsOpen(false);
  }

  function handleKeepEditing() {
    setConfirmDiscardOpen(false);
  }

  function handleConfirmDiscard() {
    setFormState(EMPTY_WORLD_FORM_STATE);
    setSavedSnapshot(EMPTY_WORLD_FORM_STATE);
    setActiveStop(WORLD_STOP_IDS[0]);
    setMaxReachedIndex(0);
    setJustSaved(false);
    setConfirmDiscardOpen(false);
    setIsOpen(false);
  }

  function handleSave() {
    setSavedSnapshot(formState);
    setJustSaved(true);
  }

  function handleContinueInEditor() {
    setNote(
      "Keep editing routes to /studio/v2/editor/[id] for the just-saved item once a real creationId exists. Preview only."
    );
  }

  function handleDone() {
    setNote("Done closes the modal in place. No navigation, no toast.");
    setIsOpen(false);
  }

  function handleReopen() {
    setIsOpen(true);
    setJustSaved(false);
  }

  function selectFixture(index) {
    const [, fx, fixtureFormState] = STATES[index];
    setSelectedState(index);
    setActiveStop(fx.activeStop);
    setMaxReachedIndex(Math.max(0, WORLD_STOP_IDS.indexOf(fx.activeStop)));
    setFormState(fixtureFormState);
    setSavedSnapshot(fx.hasUnsavedChanges ? EMPTY_WORLD_FORM_STATE : fixtureFormState);
    setConfirmDiscardOpen(false);
    setJustSaved(Boolean(fx.justSaved));
    setIsOpen(true);
  }

  const stopItems = buildWorldStopItems(activeStop, maxReachedIndex);

  const previewProps = {
    activeStop,
    activeIndex: Math.max(
      0,
      stopItems.findIndex((stop) => stop.active)
    ),
    stopItems,
    isLastStop: activeStop === "look",
    saveDisabled: false,
    hasUnsavedChanges,
    confirmDiscardOpen,
    isSaving: false,
    saveError: null,
    justSaved,
    onSelectStop: setActiveStop,
    onBack: () =>
      setActiveStop((current) => {
        const index = WORLD_STOP_IDS.indexOf(current);
        return WORLD_STOP_IDS[Math.max(index - 1, 0)];
      }),
    onNext: () =>
      setActiveStop((current) => {
        const index = WORLD_STOP_IDS.indexOf(current);
        return WORLD_STOP_IDS[Math.min(index + 1, WORLD_STOP_IDS.length - 1)];
      }),
    onSave: handleSave,
    onFinishAndSave: handleSave,
    onSaveAndOpenEditor: handleSave,
    onContinueInEditor: handleContinueInEditor,
    onDone: handleDone,
    onClose: requestClose,
    onKeepEditing: handleKeepEditing,
    onConfirmDiscard: handleConfirmDiscard,
    secondaryPanel: null,
  };

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap gap-2">
          {STATES.map(([label], index) => (
            <button
              key={label}
              type="button"
              onClick={() => selectFixture(index)}
              className={`rounded-lg border px-3 py-2 text-xs uppercase tracking-[0.16em] ${
                index === selectedState
                  ? "border-[var(--gold-ornament)] bg-[var(--gold-ornament)]/15 text-[var(--gold-ornament)]"
                  : "border-white/10 text-[var(--ink-dim)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="mb-4 text-xs uppercase tracking-[0.16em] text-[var(--ink-faint)]">
          Fixture-driven UI preview. All five stops are real. Preview
          loaded, no world creation is persisted.
        </p>
        {note ? (
          <p className="mb-4 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
            {note}
          </p>
        ) : null}

        {!isOpen ? (
          <button type="button" onClick={handleReopen} className="cf-btn cf-btn--primary">
            Reopen creator
          </button>
        ) : null}
      </div>

      {isOpen ? (
        <CreatorStopsView
          {...previewProps}
          stopContent={
            activeStop === "name" ? (
              <NameStopView name={formState.name} onChangeName={updateField("name")} />
            ) : activeStop === "premise" ? (
              <PremiseStopView
                premise={formState.premise}
                onChangePremise={updateField("premise")}
              />
            ) : activeStop === "setting" ? (
              <SettingStopView
                setting={formState.setting}
                onChangeSetting={updateField("setting")}
              />
            ) : activeStop === "tone" ? (
              <ToneStopView tone={formState.tone} onChangeTone={updateField("tone")} />
            ) : activeStop === "look" ? (
              <LookStopView
                name={formState.name}
                premise={formState.premise}
                setting={formState.setting}
                tone={formState.tone}
              />
            ) : null
          }
        />
      ) : null}
    </main>
  );
}
