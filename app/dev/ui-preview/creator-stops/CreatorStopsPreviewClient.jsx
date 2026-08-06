"use client";

import { useMemo, useState } from "react";

import CreatorStopsView from "@/components/studio/create/character/creator-stops/CreatorStops.view";
import {
  buildCreatorStopItems,
  CREATOR_STOP_IDS,
} from "@/components/studio/create/character/creator-stops/CreatorStops.contract";
import {
  creatorStopsFirstFixture,
  creatorStopsLastFixture,
  creatorStopsMidFixture,
  creatorStopsUnsavedFixture,
  creatorStopsConfirmDiscardFixture,
} from "@/components/studio/create/character/creator-stops/CreatorStops.fixtures";
import NameStopView from "@/components/studio/create/character/creator-stops/name-stop/NameStop.view";
import FaceStopView from "@/components/studio/create/character/creator-stops/face-stop/FaceStop.view";

const STATES = [
  ["First stop", creatorStopsFirstFixture],
  ["Mid stop", creatorStopsMidFixture],
  ["Last stop", creatorStopsLastFixture],
  ["Unsaved changes", creatorStopsUnsavedFixture],
  ["Confirm discard", creatorStopsConfirmDiscardFixture],
];

const STOP_STUBS = {
  name: {
    eyebrow: "Forge a soul",
    question: "A name is the first spell anyone casts on you.",
    body: "You can change anything later. Nothing on this path is required except an adult age.",
  },
  kind: {
    eyebrow: "",
    question: "What kind of being are they?",
    body: "Fifteen kinds, or write your own.",
  },
  face: {
    eyebrow: "",
    question: "Skin, eyes, and hair",
    body: "The face the portrait will carry.",
  },
  silhouette: {
    eyebrow: "",
    question: "The line of their body",
    body: "Pick an identity and Crestfall fills the frame beneath it. Fine-tune only if you care to.",
  },
  heart: {
    eyebrow: "",
    question: "How do they meet the world?",
    body: "The face they show first. Their private self can differ.",
  },
  seal: {
    eyebrow: "",
    question: "Who may meet them?",
    body: "Visibility, rating, rendering, and an adult age.",
  },
  payoff: {
    eyebrow: "The soul, forged",
    question: "Unnamed Character",
    body: "A private draft character.",
  },
};

const INITIAL_FORM_STATE = {
  name: "",
  title: "",
  skinTone: "",
  skinCustomValue: "",
  eyeColor: "",
  eyeCustomValue: "",
  hairColor: "",
  hairCustomValue: "",
  hairLength: "",
  hairTexture: "",
  hairStyle: "",
  ethnicAppearance: "",
};

function StopStub({ stopId }) {
  const stub = STOP_STUBS[stopId] || STOP_STUBS.name;

  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--line)] p-6">
      {stub.eyebrow ? (
        <p className="eyebrow eyebrow--ruled text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
          {stub.eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 font-display text-3xl text-[var(--ink)]">
        {stub.question}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
        {stub.body}
      </p>
      <p className="mt-6 text-xs uppercase tracking-[0.16em] text-[var(--ink-faint)]">
        Stop body stubbed for the chrome commit.
      </p>
    </div>
  );
}

export default function CreatorStopsPreviewClient() {
  const [selectedState, setSelectedState] = useState(0);
  const [activeStop, setActiveStop] = useState(STATES[0][1].activeStop);
  const [templateNote, setTemplateNote] = useState("");
  const [moreHairOpen, setMoreHairOpen] = useState(false);

  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [savedSnapshot, setSavedSnapshot] = useState(INITIAL_FORM_STATE);
  const [isOpen, setIsOpen] = useState(true);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(formState) !== JSON.stringify(savedSnapshot),
    [formState, savedSnapshot]
  );

  function updateField(key) {
    return (value) =>
      setFormState((current) => ({ ...current, [key]: value }));
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
    setFormState(INITIAL_FORM_STATE);
    setSavedSnapshot(INITIAL_FORM_STATE);
    setActiveStop(CREATOR_STOP_IDS[0]);
    setTemplateNote("");
    setMoreHairOpen(false);
    setConfirmDiscardOpen(false);
    setIsOpen(false);
  }

  function handleSave() {
    setSavedSnapshot(formState);
  }

  function handleReopen() {
    setIsOpen(true);
  }

  const fixture = STATES[selectedState][1];

  const stopItems = buildCreatorStopItems(activeStop);

  const previewProps = {
    ...fixture,
    activeStop,
    activeIndex: Math.max(
      0,
      stopItems.findIndex((stop) => stop.active)
    ),
    stopItems,
    isLastStop: activeStop === "payoff",
    hasUnsavedChanges,
    confirmDiscardOpen,
    onSelectStop: setActiveStop,
    onBack: () =>
      setActiveStop((current) => {
        const index = CREATOR_STOP_IDS.indexOf(current);
        return CREATOR_STOP_IDS[Math.max(index - 1, 0)];
      }),
    onNext: () =>
      setActiveStop((current) => {
        const index = CREATOR_STOP_IDS.indexOf(current);
        return CREATOR_STOP_IDS[
          Math.min(index + 1, CREATOR_STOP_IDS.length - 1)
        ];
      }),
    onSave: handleSave,
    onClose: requestClose,
    onKeepEditing: handleKeepEditing,
    onConfirmDiscard: handleConfirmDiscard,
  };

  function selectFixture(index) {
    const [, fx] = STATES[index];
    setSelectedState(index);
    setActiveStop(fx.activeStop);

    if (fx.hasUnsavedChanges) {
      setFormState((current) => ({ ...current, name: "Ashira" }));
    } else {
      setSavedSnapshot(formState);
    }
    setConfirmDiscardOpen(Boolean(fx.confirmDiscardOpen));
  }

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
          Fixture-driven UI preview. The name and title stop is real; every
          other stop body is still stubbed. Preview loaded, no character
          form is connected.
        </p>
        {templateNote ? (
          <p className="mb-4 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
            {templateNote}
          </p>
        ) : null}

        {!isOpen ? (
          <button
            type="button"
            onClick={handleReopen}
            className="cf-btn cf-btn--primary"
          >
            Reopen creator
          </button>
        ) : null}
      </div>

      {isOpen ? (
        <CreatorStopsView
          {...previewProps}
          stopContent={
            activeStop === "name" ? (
              <NameStopView
                name={formState.name}
                title={formState.title}
                onChangeName={updateField("name")}
                onChangeTitle={updateField("title")}
                onOpenTemplate={() =>
                  setTemplateNote(
                    "Start-from-a-template takeover is not built in this commit."
                  )
                }
              />
            ) : activeStop === "face" ? (
              <FaceStopView
                skinTone={formState.skinTone}
                skinCustomValue={formState.skinCustomValue}
                eyeColor={formState.eyeColor}
                eyeCustomValue={formState.eyeCustomValue}
                hairColor={formState.hairColor}
                hairCustomValue={formState.hairCustomValue}
                hairLength={formState.hairLength}
                hairTexture={formState.hairTexture}
                hairStyle={formState.hairStyle}
                ethnicAppearance={formState.ethnicAppearance}
                moreHairOpen={moreHairOpen}
                onChangeSkinTone={updateField("skinTone")}
                onChangeSkinCustomValue={updateField("skinCustomValue")}
                onChangeEyeColor={updateField("eyeColor")}
                onChangeEyeCustomValue={updateField("eyeCustomValue")}
                onChangeHairColor={updateField("hairColor")}
                onChangeHairCustomValue={updateField("hairCustomValue")}
                onChangeHairLength={updateField("hairLength")}
                onChangeHairTexture={updateField("hairTexture")}
                onChangeHairStyle={updateField("hairStyle")}
                onChangeEthnicAppearance={updateField("ethnicAppearance")}
                onToggleMoreHair={() => setMoreHairOpen((current) => !current)}
              />
            ) : (
              <StopStub stopId={activeStop} />
            )
          }
        />
      ) : null}
    </main>
  );
}
