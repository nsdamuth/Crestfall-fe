"use client";

import { useState } from "react";

import StudioAccountProfileView from "@/components/studio/account/studio-account-profile/StudioAccountProfile.view";
import {
  studioAccountProfileContentNoticeFixture,
  studioAccountProfileDefaultFixture,
  studioAccountProfileLoadErrorFixture,
  studioAccountProfileLoadingFixture,
  studioAccountProfileNoDefaultPcFixture,
  studioAccountProfileNoUsernameFixture,
  studioAccountProfileSavedFixture,
  studioAccountProfileSavingFixture,
} from "@/components/studio/account/studio-account-profile/StudioAccountProfile.fixtures";

const PREVIEW_STATES = {
  default: { label: "Default", props: studioAccountProfileDefaultFixture },
  loading: { label: "Loading", props: studioAccountProfileLoadingFixture },
  loadError: {
    label: "Load Error",
    props: studioAccountProfileLoadErrorFixture,
  },
  saving: { label: "Saving", props: studioAccountProfileSavingFixture },
  saved: { label: "Saved", props: studioAccountProfileSavedFixture },
  noUsername: {
    label: "No Username",
    props: studioAccountProfileNoUsernameFixture,
  },
  noDefaultPc: {
    label: "No Default PC",
    props: studioAccountProfileNoDefaultPcFixture,
  },
  contentNotice: {
    label: "Content Notice",
    props: studioAccountProfileContentNoticeFixture,
  },
};

function PreviewSlot({ title, body }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/5 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p>
    </div>
  );
}

export default function StudioAccountProfilePreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("default");
  const [viewProps, setViewProps] = useState({
    ...studioAccountProfileDefaultFixture,
  });
  const [lastAction, setLastAction] = useState(
    "Choose a fixture or edit the preview-local fields."
  );

  function openState(stateKey) {
    const state = PREVIEW_STATES[stateKey];

    setActiveStateKey(stateKey);
    setViewProps({ ...state.props });
    setLastAction(`Opened the ${state.label} fixture.`);
  }

  function updateField(fieldName, value) {
    setViewProps((current) => ({
      ...current,
      fields: {
        ...current.fields,
        [fieldName]: {
          ...current.fields[fieldName],
          value,
          count: `${value.length}/${current.fields[fieldName].maxLength}`,
        },
      },
    }));
    setLastAction(`Updated ${fieldName} in preview-local state.`);
  }

  const profileMediaContent = (
    <PreviewSlot
      title="Profile Media Slot"
      body="The application Shell supplies the real ProfileMediaManager here."
    />
  );
  const accountMetricsContent = (
    <PreviewSlot
      title="Account Metrics Slot"
      body="The application Shell supplies the real StudioAccountMetrics here."
    />
  );

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Studio Account Profile
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable account-profile View directly.
            Loading, saving, content gating, and Player Character selection are
            represented by fixture props and preview-local callbacks only.
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

        <StudioAccountProfileView
          {...viewProps}
          profileMediaContent={profileMediaContent}
          accountMetricsContent={accountMetricsContent}
          onSubmit={(event) => {
            event.preventDefault();
            setLastAction("Submitted the preview-local profile form.");
          }}
          onUsernameChange={(value) => updateField("username", value)}
          onDisplayNameChange={(value) => updateField("displayName", value)}
          onContactEmailChange={(value) => updateField("contactEmail", value)}
          onTaglineChange={(value) => updateField("tagline", value)}
          onDescriptionChange={(value) => updateField("description", value)}
          onAnnouncementChange={(value) => updateField("announcement", value)}
          onContentPreferenceChange={(value) => {
            if (value === "SFW") {
              setViewProps((current) => ({
                ...current,
                fields: {
                  ...current.fields,
                  contentPreference: {
                    ...current.fields.contentPreference,
                    value,
                  },
                },
              }));
            } else {
              setViewProps((current) => ({
                ...current,
                isContentPreferenceNoticeOpen: true,
                contentPreferenceNoticeLabel:
                  value === "EXPLICIT" ? "Explicit / Web Only" : "Mature",
              }));
            }
          }}
          onCloseContentPreferenceNotice={() =>
            setViewProps((current) => ({
              ...current,
              isContentPreferenceNoticeOpen: false,
            }))
          }
          onOpenDefaultPlayerCharacterPicker={() =>
            setLastAction("Requested the application-owned default-PC picker.")
          }
          onClearDefaultPlayerCharacter={() =>
            setViewProps((current) => ({
              ...current,
              defaultPlayerCharacter: null,
              hasDefaultPlayerCharacter: false,
              hasDefaultPlayerCharacterSelection: false,
            }))
          }
        />
      </div>
    </main>
  );
}
