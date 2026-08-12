"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// The shared quick-create shape, consumed directly per the brief: do
// not fork or reimplement it. Same modal shell, stepper, discard
// dialog, and save-and-reaccess loop footer the Character quick
// create uses (contract creator-stops.view.v6).
import CreatorStopsView from "@/components/studio/create/character/creator-stops/CreatorStops.view";
import {
  createCreationDraft,
  updateCreationDraft,
  getCreationApiErrorMessage,
} from "@/lib/client/studio/creations/creationClient";
import { buildWorldStopItems, WORLD_STOP_IDS } from "./WorldCreatorStops.contract";
import NameStopView from "./name-stop/NameStopView";
import PremiseStopView from "./premise-stop/PremiseStopView";
import SettingStopView from "./setting-stop/SettingStopView";
import ToneStopView from "./tone-stop/ToneStopView";
import LookStopView from "./look-stop/LookStopView";

const INITIAL_FORM_STATE = {
  name: "",
  premise: "",
  setting: "",
  tone: "",
};

// Same top-level shape (type, title, description, visibility,
// content_rating, data) the Character quick create posts to
// /v1/studio/creations. type "LOCATION": the existing creation type
// this app's data model already uses for world-space assets
// (lib/shared/creations/creationTypePolicy.js); no new type
// introduced.
function buildSaveCreationPayload(formState) {
  const name = formState.name?.trim() || "Unnamed World";

  return {
    type: "LOCATION",
    title: name,
    description:
      formState.premise || formState.setting || "A private draft world created in Crestfall Studio.",
    visibility: "PRIVATE",
    content_rating: "SFW",
    data: {
      ...formState,
      name,
      builder: "WORLD_CREATOR",
      builder_version: "1.0",
    },
  };
}

function extractCreationFromApiResponse(payload) {
  return payload?.creation || payload?.data?.creation || null;
}

export default function WorldCreatorModal({ onClose }) {
  const router = useRouter();
  const [activeStop, setActiveStop] = useState(WORLD_STOP_IDS[0]);
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
    onClose?.();
  }

  function handleKeepEditing() {
    setConfirmDiscardOpen(false);
  }

  function handleConfirmDiscard() {
    onClose?.();
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
  // ("look") additionally swaps the footer to Keep editing / Done.
  async function handleSave() {
    const saved = await persistCreation();
    if (saved) {
      setJustSaved(true);
    }
  }

  function handleContinueInEditorAfterSave() {
    if (!creationId) return;
    onClose?.();
    // Origin tracking, same convention as the Character quick create:
    // carries the opening surface so the advanced editor's back
    // control returns here.
    router.push(`/studio/v2/editor/${creationId}?origin=studio`);
  }

  function handleDoneAfterSave() {
    onClose?.();
  }

  const stopItems = buildWorldStopItems(activeStop, maxReachedIndex);
  const isLastStop = activeStop === "look";

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
    onContinueInEditor: handleContinueInEditorAfterSave,
    onDone: handleDoneAfterSave,
    onClose: requestClose,
    onKeepEditing: handleKeepEditing,
    onConfirmDiscard: handleConfirmDiscard,
    secondaryPanel: null,
  };

  return (
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
  );
}
