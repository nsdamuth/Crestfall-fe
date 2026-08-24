"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// The shared quick-create shape, consumed directly per the brief: do
// not fork or reimplement it. Same modal shell, stepper, discard
// dialog, and save-and-reaccess loop footer the Character, World, and
// Look quick creates use (contract creator-stops.view.v6).
import CreatorStopsView from "@/components/studio/create/character/creator-stops/CreatorStops.view";
// The picker pattern, RULED (the Q3 story quick-create brief):
// KitPickerModal, the kit's existing branded, fixture-fed selection
// modal, reused unmodified for both cast (multi-select) and setting
// (single-select). See StoryCreatorStops.contract.js for why this was
// chosen over inventing a new pattern.
import KitPickerModalView from "@/components/kit/picker-modal/KitPickerModal.view";
import { useKitPickerModalViewModel } from "@/components/kit/picker-modal/useKitPickerModalViewModel";
import {
  createCreationDraft,
  updateCreationDraft,
  getCreationApiErrorMessage,
} from "@/lib/client/studio/creations/creationClient";
import {
  buildStoryStopItems,
  STORY_STOP_IDS,
} from "./StoryCreatorStops.contract";
import {
  FIXTURE_CHARACTERS,
  FIXTURE_LOCATIONS,
} from "./StoryCreatorStops.fixtures";
import NameStopView from "./name-stop/NameStopView";
import PremiseStopView from "./premise-stop/PremiseStopView";
import CastStopView from "./cast-stop/CastStopView";
import SettingStopView from "./setting-stop/SettingStopView";
import CoverStopView from "./cover-stop/CoverStopView";

const INITIAL_FORM_STATE = {
  name: "",
  premise: "",
  castIds: [],
  settingId: null,
};

function matchesSearch(item, query) {
  if (!query) return true;
  return item.title.toLowerCase().includes(query.trim().toLowerCase());
}

// Same top-level shape (type, title, description, visibility,
// content_rating, data) the Character, World, and Look quick creates
// post to /v1/studio/creations. type "ROOM_TEMPLATE": the existing
// creation type this app's data model already uses for Stories
// (lib/shared/creations/creationTypePolicy.js, label "Story"), per
// the brief's instruction to map the new Studio hub door onto this
// existing type.
function buildSaveCreationPayload(formState) {
  const name = formState.name?.trim() || "Unnamed Story";

  return {
    type: "ROOM_TEMPLATE",
    title: name,
    description: formState.premise || "A private draft story created in Crestfall Studio.",
    visibility: "PRIVATE",
    content_rating: "SFW",
    data: {
      name,
      premise: formState.premise,
      cast_ids: formState.castIds,
      setting_id: formState.settingId,
      builder: "STORY_CREATOR",
      builder_version: "1.0",
    },
  };
}

function extractCreationFromApiResponse(payload) {
  return payload?.creation || payload?.data?.creation || null;
}

export default function StoryCreatorModal({ onClose }) {
  const router = useRouter();
  const [activeStop, setActiveStop] = useState(STORY_STOP_IDS[0]);
  const [maxReachedIndex, setMaxReachedIndex] = useState(0);

  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [savedSnapshot, setSavedSnapshot] = useState(INITIAL_FORM_STATE);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [creationId, setCreationId] = useState(null);
  // The save-and-reaccess loop, two-tier: true immediately after any
  // confirmed save, cleared the moment a field changes again.
  const [justSaved, setJustSaved] = useState(false);
  const saveInFlightRef = useRef(false);

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
    onClose?.();
  }

  function handleKeepEditing() {
    setConfirmDiscardOpen(false);
  }

  function handleConfirmDiscard() {
    onClose?.();
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

  // Shared by the footer Save, Finish and save, and Save and open
  // editor actions. Guards against a duplicate record: the first
  // successful save records a creationId, and every save after that
  // updates that same record.
  async function persistCreation() {
    if (saveInFlightRef.current) return null;
    saveInFlightRef.current = true;
    setSaveError(null);
    setIsSaving(true);

    const snapshot = formState;

    try {
      const payload = buildSaveCreationPayload(snapshot);
      const response = creationId
        ? await updateCreationDraft(creationId, payload)
        : await createCreationDraft(payload);
      const creation = extractCreationFromApiResponse(response);

      if (!creation?.id) {
        throw new Error(
          getCreationApiErrorMessage(
            response,
            "The save did not go through. Your work is still here, try again."
          )
        );
      }

      if (!creationId) {
        setCreationId(creation.id);
      }

      setSavedSnapshot(snapshot);
      return { snapshot, id: creation.id };
    } catch {
      setSaveError(true);
      return null;
    } finally {
      setIsSaving(false);
      saveInFlightRef.current = false;
    }
  }

  // The save-and-reaccess loop, two-tier: every save control in the
  // footer runs persistCreation and sets justSaved on a confirmed
  // save. CreatorStopsView keys the actual footer on isLastStop: a
  // non-final stop shows the Saved confirmation only; the final stop
  // ("cover") additionally swaps the footer to Keep editing / Done.
  async function handleSave() {
    const saved = await persistCreation();
    if (saved) {
      setJustSaved(true);
    }
  }

  function handleContinueInEditorAfterSave() {
    if (!creationId) return;
    onClose?.();
    // Origin tracking, same convention as the Character, World, and
    // Look quick creates: carries the opening surface so the advanced
    // editor's back control returns here.
    router.push(`/studio/v2/editor/${creationId}?origin=studio`);
  }

  function handleDoneAfterSave() {
    onClose?.();
  }

  const stopItems = buildStoryStopItems(activeStop, maxReachedIndex);
  const isLastStop = activeStop === "cover";

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

  const viewProps = {
    activeStop,
    activeIndex: Math.max(
      0,
      stopItems.findIndex((stop) => stop.active)
    ),
    stopItems,
    isLastStop,
    saveDisabled: isSaving,
    hasUnsavedChanges,
    confirmDiscardOpen,
    isSaving,
    saveError,
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
    closeAriaLabel: "Close story creator",
    onContinueInEditor: handleContinueInEditorAfterSave,
    onDone: handleDoneAfterSave,
    onClose: requestClose,
    onKeepEditing: handleKeepEditing,
    onConfirmDiscard: handleConfirmDiscard,
    secondaryPanel: null,
  };

  return (
    <>
      <CreatorStopsView
        {...viewProps}
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

      {isCastPickerOpen ? <KitPickerModalView {...castPickerProps} /> : null}
      {isSettingPickerOpen ? <KitPickerModalView {...settingPickerProps} /> : null}
    </>
  );
}
