"use client";

import { useEffect, useMemo, useState } from "react";

import CreatorStopsView from "@/components/studio/create/character/creator-stops/CreatorStops.view";
import KitPickerModalView from "@/components/kit/picker-modal/KitPickerModal.view";
import { useKitPickerModalViewModel } from "@/components/kit/picker-modal/useKitPickerModalViewModel";
import {
  buildStoryStopItems,
  STORY_STOP_IDS,
} from "@/components/studio/create/story/creator-stops/StoryCreatorStops.contract";
import {
  storyCreatorStopsEmptyFixture,
  storyCreatorStopsFilledFixture,
  storyCreatorStopsMidSavedFixture,
  storyCreatorStopsFinalSavedFixture,
  EMPTY_STORY_FORM_STATE,
  FILLED_STORY_FORM_STATE,
  FIXTURE_CHARACTERS,
  FIXTURE_LOCATIONS,
} from "@/components/studio/create/story/creator-stops/StoryCreatorStops.fixtures";
import NameStopView from "@/components/studio/create/story/creator-stops/name-stop/NameStopView";
import PremiseStopView from "@/components/studio/create/story/creator-stops/premise-stop/PremiseStopView";
import CastStopView from "@/components/studio/create/story/creator-stops/cast-stop/CastStopView";
import SettingStopView from "@/components/studio/create/story/creator-stops/setting-stop/SettingStopView";
import CoverStopView from "@/components/studio/create/story/creator-stops/cover-stop/CoverStopView";

const STATES = [
  ["Empty", storyCreatorStopsEmptyFixture, EMPTY_STORY_FORM_STATE],
  ["Filled", storyCreatorStopsFilledFixture, FILLED_STORY_FORM_STATE],
  ["Saved, mid-flow (confirmation only)", storyCreatorStopsMidSavedFixture, FILLED_STORY_FORM_STATE],
  ["Saved, final stop (post-save footer)", storyCreatorStopsFinalSavedFixture, FILLED_STORY_FORM_STATE],
];

function matchesSearch(item, query) {
  if (!query) return true;
  return item.title.toLowerCase().includes(query.trim().toLowerCase());
}

export default function StoryCreatorStopsPreviewClient() {
  const [selectedState, setSelectedState] = useState(0);
  const [activeStop, setActiveStop] = useState(STATES[0][1].activeStop);
  const [maxReachedIndex, setMaxReachedIndex] = useState(
    Math.max(0, STORY_STOP_IDS.indexOf(STATES[0][1].activeStop))
  );
  const [formState, setFormState] = useState(STATES[0][2]);
  const [savedSnapshot, setSavedSnapshot] = useState(STATES[0][2]);
  const [isOpen, setIsOpen] = useState(true);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [note, setNote] = useState("");

  const [isCastPickerOpen, setIsCastPickerOpen] = useState(false);
  const [castSearchValue, setCastSearchValue] = useState("");
  const [isSettingPickerOpen, setIsSettingPickerOpen] = useState(false);
  const [settingSearchValue, setSettingSearchValue] = useState("");

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(formState) !== JSON.stringify(savedSnapshot),
    [formState, savedSnapshot]
  );

  useEffect(() => {
    const index = Math.max(0, STORY_STOP_IDS.indexOf(activeStop));
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
    setFormState(EMPTY_STORY_FORM_STATE);
    setSavedSnapshot(EMPTY_STORY_FORM_STATE);
    setActiveStop(STORY_STOP_IDS[0]);
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

  function handleToggleCastMember(id) {
    setFormState((current) => {
      const alreadySelected = current.castIds.includes(id);
      const castIds = alreadySelected
        ? current.castIds.filter((castId) => castId !== id)
        : [...current.castIds, id];
      return { ...current, castIds };
    });
    setJustSaved(false);
  }

  function handleRemoveCastMember(id) {
    setFormState((current) => ({
      ...current,
      castIds: current.castIds.filter((castId) => castId !== id),
    }));
    setJustSaved(false);
  }

  function handleToggleSettingItem(id) {
    setFormState((current) => ({ ...current, settingId: id }));
    setJustSaved(false);
  }

  function handleClearSetting() {
    setFormState((current) => ({ ...current, settingId: null }));
    setJustSaved(false);
  }

  function selectFixture(index) {
    const [, fx, fixtureFormState] = STATES[index];
    setSelectedState(index);
    setActiveStop(fx.activeStop);
    setMaxReachedIndex(Math.max(0, STORY_STOP_IDS.indexOf(fx.activeStop)));
    setFormState(fixtureFormState);
    setSavedSnapshot(fx.hasUnsavedChanges ? EMPTY_STORY_FORM_STATE : fixtureFormState);
    setConfirmDiscardOpen(false);
    setJustSaved(Boolean(fx.justSaved));
    setIsOpen(true);
  }

  const stopItems = buildStoryStopItems(activeStop, maxReachedIndex);

  const selectedCharacters = formState.castIds
    .map((id) => FIXTURE_CHARACTERS.find((character) => character.id === id))
    .filter(Boolean);
  const selectedLocation =
    FIXTURE_LOCATIONS.find((location) => location.id === formState.settingId) || null;

  const castPickerItems = FIXTURE_CHARACTERS.filter((character) =>
    matchesSearch(character, castSearchValue)
  );
  const settingPickerItems = FIXTURE_LOCATIONS.filter((location) =>
    matchesSearch(location, settingSearchValue)
  );

  const castPickerProps = useKitPickerModalViewModel({
    title: "Choose characters",
    isMultiSelect: true,
    items: castPickerItems,
    selectedIds: formState.castIds,
    searchValue: castSearchValue,
    searchPlaceholder: "Search your characters",
    emptyMessage: "No characters match that search.",
    onSearchChange: setCastSearchValue,
    onToggleItem: handleToggleCastMember,
    onConfirm: () => setIsCastPickerOpen(false),
    onClose: () => setIsCastPickerOpen(false),
  });

  const settingPickerProps = useKitPickerModalViewModel({
    title: "Choose a setting",
    isMultiSelect: false,
    items: settingPickerItems,
    selectedIds: formState.settingId ? [formState.settingId] : [],
    searchValue: settingSearchValue,
    searchPlaceholder: "Search your worlds",
    emptyMessage: "No worlds match that search.",
    onSearchChange: setSettingSearchValue,
    onToggleItem: handleToggleSettingItem,
    onConfirm: () => setIsSettingPickerOpen(false),
    onClose: () => setIsSettingPickerOpen(false),
  });

  const previewProps = {
    activeStop,
    activeIndex: Math.max(
      0,
      stopItems.findIndex((stop) => stop.active)
    ),
    stopItems,
    isLastStop: activeStop === "cover",
    saveDisabled: false,
    hasUnsavedChanges,
    confirmDiscardOpen,
    isSaving: false,
    saveError: null,
    justSaved,
    onSelectStop: setActiveStop,
    onBack: () =>
      setActiveStop((current) => {
        const index = STORY_STOP_IDS.indexOf(current);
        return STORY_STOP_IDS[Math.max(index - 1, 0)];
      }),
    onNext: () =>
      setActiveStop((current) => {
        const index = STORY_STOP_IDS.indexOf(current);
        return STORY_STOP_IDS[Math.min(index + 1, STORY_STOP_IDS.length - 1)];
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
          Fixture-driven UI preview. All five stops are real. Cast and
          setting pick from fixture characters and locations. Preview
          loaded, no story creation is persisted.
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
            ) : activeStop === "cast" ? (
              <CastStopView
                selectedCharacters={selectedCharacters}
                onOpenCastPicker={() => setIsCastPickerOpen(true)}
                onRemoveCastMember={handleRemoveCastMember}
              />
            ) : activeStop === "setting" ? (
              <SettingStopView
                selectedLocation={selectedLocation}
                onOpenSettingPicker={() => setIsSettingPickerOpen(true)}
                onClearSetting={handleClearSetting}
              />
            ) : activeStop === "cover" ? (
              <CoverStopView
                name={formState.name}
                premise={formState.premise}
                castCharacters={selectedCharacters}
                setting={selectedLocation}
              />
            ) : null
          }
        />
      ) : null}

      {isCastPickerOpen ? <KitPickerModalView {...castPickerProps} /> : null}
      {isSettingPickerOpen ? <KitPickerModalView {...settingPickerProps} /> : null}
    </main>
  );
}
