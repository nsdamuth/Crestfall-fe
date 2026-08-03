"use client";

import { useEffect, useMemo, useState } from "react";

import LocationRegistryAttachmentsSectionView from "@/components/studio/my-creations/edit/sections/locations/location-registry-attachments-section/LocationRegistryAttachmentsSection.view";
import {
  locationRegistryAttachmentsCompleteFixture,
  locationRegistryAttachmentsEmptyFixture,
  locationRegistryAttachmentsLegacyFixture,
  locationRegistryAttachmentsMixedFixture,
} from "@/components/studio/my-creations/edit/sections/locations/location-registry-attachments-section/LocationRegistryAttachmentsSection.fixtures";

const PREVIEW_STATES = {
  complete: {
    label: "Complete Location",
    props: locationRegistryAttachmentsCompleteFixture,
  },
  legacy: {
    label: "Legacy ID-Only Binding",
    props: locationRegistryAttachmentsLegacyFixture,
  },
  mixed: {
    label: "Mixed Registry Types",
    props: locationRegistryAttachmentsMixedFixture,
  },
  empty: {
    label: "Empty Location",
    props: locationRegistryAttachmentsEmptyFixture,
  },
};

function cloneFixture(fixture) {
  return JSON.parse(JSON.stringify(fixture));
}

export default function LocationRegistryAttachmentsSectionPreviewClient() {
  const [activeStateKey, setActiveStateKey] = useState("complete");
  const [viewProps, setViewProps] = useState(() =>
    cloneFixture(PREVIEW_STATES.complete.props)
  );
  const [pickerGroupId, setPickerGroupId] = useState("");
  const [feedback, setFeedback] = useState("No preview action yet.");

  const activeState = PREVIEW_STATES[activeStateKey];
  const activeGroup = useMemo(
    () => viewProps.groups.find((group) => group.id === pickerGroupId) || null,
    [pickerGroupId, viewProps.groups]
  );

  useEffect(() => {
    setViewProps(cloneFixture(activeState.props));
    setPickerGroupId("");
    setFeedback("No preview action yet.");
  }, [activeState]);

  function updateGroup(groupId, updater) {
    setViewProps((current) => ({
      ...current,
      groups: current.groups.map((group) =>
        group.id === groupId ? updater(group) : group
      ),
    }));
  }

  function attachFixtureRegistry() {
    if (!activeGroup) return;

    const creationId = `fixture-${activeGroup.id}`;
    const alreadyAttached = activeGroup.links.some(
      (link) => link.creationId === creationId
    );

    if (!alreadyAttached) {
      updateGroup(activeGroup.id, (group) => ({
        ...group,
        links: [
          ...group.links,
          {
            id: `link-${activeGroup.id}`,
            creationId,
            title: `Fixture ${activeGroup.label.replace(/ Registries$/, " Registry")}`,
            type: activeGroup.id
              .replace(/Registries$/, "_REGISTRY")
              .replace(/([a-z])([A-Z])/g, "$1_$2")
              .toUpperCase(),
            description:
              "Fixture-only registry metadata added through the preview picker.",
            imageUrl: "",
            notes: "",
          },
        ],
      }));
      setFeedback(`Attached a fixture to ${activeGroup.label}.`);
    } else {
      setFeedback(`${activeGroup.label} already contains the fixture registry.`);
    }

    setPickerGroupId("");
  }

  function removeRegistry(groupId, link) {
    updateGroup(groupId, (group) => ({
      ...group,
      links: group.links.filter(
        (item) =>
          item.id !== link.id && item.creationId !== link.creationId
      ),
    }));
    setFeedback(`Removed ${link.title || "attached registry"}.`);
  }

  function changeRegistryNotes(groupId, link, notes) {
    updateGroup(groupId, (group) => ({
      ...group,
      links: group.links.map((item) =>
        item.id === link.id || item.creationId === link.creationId
          ? { ...item, notes }
          : item
      ),
    }));
    setFeedback(
      `${link.title || "Attached registry"} notes: ${notes || "(empty)"}`
    );
  }

  const pickerSlot = activeGroup ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--muted-gold)]/35 bg-[#100e0b] p-6 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
          Fixture Picker
        </p>
        <h2 className="mt-2 font-display text-3xl">{activeGroup.addLabel}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          This local preview substitute demonstrates the application-owned
          registry picker slot without loading Creation data.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={attachFixtureRegistry}
            className="rounded-xl border border-[var(--muted-gold)]/40 bg-[var(--muted-gold)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--foreground)]"
          >
            Attach Fixture Registry
          </button>
          <button
            type="button"
            onClick={() => setPickerGroupId("")}
            className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  ) : null;

  const attachmentCount = viewProps.groups.reduce(
    (count, group) => count + group.links.length,
    0
  );

  return (
    <main className="min-h-screen bg-[#080706] px-4 py-10 text-[var(--foreground)] sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-[var(--muted-gold)]/25 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-gold)]">
            Fixture-Driven UI Preview
          </p>
          <h1 className="mt-2 font-display text-4xl">
            Location Registry Attachments Section
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            This route renders the portable attachment cards and a fixture-only
            picker slot without loading or persisting saved Creations.
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
          <div className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/45 p-5 sm:p-8">
            <LocationRegistryAttachmentsSectionView
              {...viewProps}
              pickerSlot={pickerSlot}
              onOpenPicker={(groupId) => {
                setPickerGroupId(groupId);
                setFeedback(`Opened the ${groupId} fixture picker.`);
              }}
              onRemoveRegistry={removeRegistry}
              onChangeRegistryNotes={changeRegistryNotes}
            />
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-black/25 p-6 xl:sticky xl:top-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Preview Feedback
            </p>
            <p className="mt-3 break-words text-sm leading-6 text-[var(--muted)]">
              {feedback}
            </p>

            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Attachment Count
            </p>
            <p className="mt-2 font-display text-3xl">{attachmentCount}</p>

            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Contract Boundary
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Fixtures contain display-ready registry cards only. JSONB
              normalization, legacy ID projection, picker filtering, mirrored
              writes, Creation save orchestration, and persistence remain
              application-owned.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
