"use client";

import { useMemo, useState } from "react";

import CreationPreviewModalView from "@/components/studio/creations/creation-preview-modal/CreationPreviewModal.view";
import {
  creationPreviewMissingMediaFixture,
  creationPreviewOwnerFixture,
  creationPreviewPickerFixture,
  creationPreviewPublicFixture,
} from "@/components/studio/creations/creation-preview-modal/CreationPreviewModal.fixtures";
import { getCreationPreviewViewProps } from "@/components/studio/creations/creation-preview-modal/useCreationPreviewModalViewModel";

const fixtures = {
  owner: creationPreviewOwnerFixture,
  public: creationPreviewPublicFixture,
  picker: creationPreviewPickerFixture,
  missing: creationPreviewMissingMediaFixture,
};

function PreviewLink({ href, children, className }) {
  return (
    <a
      href={href}
      onClick={(event) => event.preventDefault()}
      className={className}
      title={href}
    >
      {children}
    </a>
  );
}

function PreviewStatusBadges({ creation }) {
  return (
    <div className="flex flex-wrap gap-2">
      {[creation?.visibility, creation?.status, creation?.contentRating]
        .filter(Boolean)
        .map((value) => (
          <span
            key={value}
            className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]"
          >
            {value}
          </span>
        ))}
    </div>
  );
}

function PreviewStatsRow({ stats = {} }) {
  return (
    <div className="flex flex-wrap gap-3 text-xs text-[var(--muted)]">
      <span>{stats.likes || 0} likes</span>
      <span>{stats.bookmarks || 0} saves</span>
      <span>{stats.images || 0} images</span>
      <span>{stats.messages || 0} messages</span>
    </div>
  );
}

function PreviewCredits({ credits = [] }) {
  return (
    <div className="mt-5 rounded-xl border border-white/10 bg-black/25 p-3 text-xs text-[var(--muted)]">
      Credits: {credits.length || 1} contributor entry
    </div>
  );
}

function PreviewShareButton({ href, label }) {
  return (
    <button
      type="button"
      title={href}
      className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)]"
    >
      {label}
    </button>
  );
}

export default function CreationPreviewModalPreviewClient() {
  const [fixtureKey, setFixtureKey] = useState("owner");
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [liked, setLiked] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [startingChat, setStartingChat] = useState(false);
  const [settingDefaultPc, setSettingDefaultPc] = useState(false);
  const [chatError, setChatError] = useState("");
  const [defaultPcStatus, setDefaultPcStatus] = useState("");
  const fixture = fixtures[fixtureKey];

  const viewProps = useMemo(
    () =>
      getCreationPreviewViewProps({
        ...fixture,
        liked,
        bookmarked,
        activeMediaIndex,
        descriptionExpanded,
        startingChat,
        settingDefaultPc,
        chatError,
        defaultPcStatus,
        canLike: true,
        canBookmark: true,
      }),
    [
      fixture,
      liked,
      bookmarked,
      activeMediaIndex,
      descriptionExpanded,
      startingChat,
      settingDefaultPc,
      chatError,
      defaultPcStatus,
    ]
  );

  function chooseFixture(key) {
    setFixtureKey(key);
    setActiveMediaIndex(0);
    setDescriptionExpanded(false);
    setLiked(key === "owner");
    setBookmarked(key === "public");
    setStartingChat(false);
    setSettingDefaultPc(false);
    setChatError("");
    setDefaultPcStatus("");
  }

  function previousMedia() {
    if (!viewProps?.hasFeaturedMedia) return;
    setActiveMediaIndex((current) =>
      current <= 0 ? viewProps.moreSlideIndex : current - 1
    );
  }

  function nextMedia() {
    if (!viewProps?.hasFeaturedMedia) return;
    setActiveMediaIndex((current) =>
      current >= viewProps.moreSlideIndex ? 0 : current + 1
    );
  }

  function simulateChat() {
    setChatError("");
    setStartingChat(true);
    window.setTimeout(() => setStartingChat(false), 600);
  }

  function simulateDefaultPc() {
    setDefaultPcStatus("");
    setSettingDefaultPc(true);
    window.setTimeout(() => {
      setSettingDefaultPc(false);
      setDefaultPcStatus("Default Player Character set.");
    }, 600);
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {[
            ["owner", "Owner"],
            ["public", "Community"],
            ["picker", "Picker"],
            ["missing", "No Media"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => chooseFixture(key)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.16em] ${
                fixtureKey === key
                  ? "border-[var(--muted-gold)] bg-[var(--muted-gold)]/15"
                  : "border-white/10 text-[var(--muted)]"
              }`}
            >
              {label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setChatError((current) => (current ? "" : "Story could not be started."))}
            className="rounded-full border border-white/10 px-4 py-2 text-xs text-[var(--muted)]"
          >
            Toggle chat error
          </button>
        </div>

        <section className="relative mx-auto max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[var(--muted-gold)]/25 bg-[#080706] shadow-2xl lg:overflow-hidden">
          <CreationPreviewModalView
            {...viewProps}
            onClose={() => undefined}
            onToggleDescription={() =>
              setDescriptionExpanded((current) => !current)
            }
            onSelectMedia={setActiveMediaIndex}
            onPreviousMedia={previousMedia}
            onNextMedia={nextMedia}
            onToggleLike={() => setLiked((current) => !current)}
            onToggleBookmark={() => setBookmarked((current) => !current)}
            onStartStory={simulateChat}
            onSetDefaultPc={simulateDefaultPc}
            LinkComponent={PreviewLink}
            StatusBadgesComponent={PreviewStatusBadges}
            StatsRowComponent={PreviewStatsRow}
            CreditsComponent={PreviewCredits}
            ShareButtonComponent={PreviewShareButton}
          />
        </section>
      </div>
    </main>
  );
}
