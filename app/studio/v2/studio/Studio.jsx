"use client";

// Binding Shell (docs/CRESTFALL-DESIGN-CONTEXT.md LOOM shape): owns
// Crestfall-specific integration only. Next.js navigation (useRouter)
// is one piece of application wiring the Studio hub needs; the others
// are CharacterCreatorModal, the existing live-wired seven-stop
// creator (components/studio/create/character/creator-stops/),
// imported read-only per docs/STUDIO-SPEC.md section 3.2 and NOT
// modified by this brief; WorldCreatorModal, the five-stop creator
// (components/studio/create/world/creator-stops/); LookCreatorModal,
// the five-stop creator (components/studio/create/look/creator-stops/);
// and StoryCreatorModal, the five-stop creator this pass adds
// (components/studio/create/story/creator-stops/). All four consume
// CreatorStopsView, the same shared quick-create shape, directly. The
// Shell owns each modal's own open/close boolean directly, the same
// pattern as the legacy hub's CreationStudioExperience.jsx, because
// this is real integration, not fixture-shaped ViewModel state. The
// fixture-mode harness (default / empty / longest content) is
// dev-only QA scaffolding, never product, per docs/FRONTEND-SOP.md
// section 2.
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import StudioView from "./studio/Studio.view";
import { useStudioViewModel } from "./studio/useStudioViewModel";
import CharacterCreatorModal from "@/components/studio/create/character/creator-stops/CharacterCreatorModal";
import { CHARACTER_CREATOR_TYPES } from "@/components/studio/create/character/characterCreationMode";
import WorldCreatorModal from "@/components/studio/create/world/creator-stops/WorldCreatorModal";
import LookCreatorModal from "@/components/studio/create/look/creator-stops/LookCreatorModal";
import StoryCreatorModal from "@/components/studio/create/story/creator-stops/StoryCreatorModal";
import { useCreationStudioViewModel } from "@/components/studio/create/creation-studio/useCreationStudioViewModel";
import { CREATION_STUDIO_MODES } from "@/components/studio/create/creation-studio/CreationStudio.contract.mjs";
import { StudioGuidedModeView, StudioFullModeView } from "./studio/StudioModePanels.view";
import { getFullStudioSectionSlug } from "./studio/StudioModePanels.contract.mjs";


function StudioModeContent({
  mode,
  onModeChange,
  onOpenCharacterCreator,
  onOpenPlayerCharacterCreator,
  activeFullStudioSectionSlug = "",
  onOpenFullStudioSection = null,
  onBackToFullStudio = null,
}) {
  const creationStudioViewModel = useCreationStudioViewModel();

  if (mode === CREATION_STUDIO_MODES.QUICK) return null;

  if (mode === CREATION_STUDIO_MODES.GUIDED) {
    return (
      <StudioGuidedModeView
        chapters={creationStudioViewModel.guidedChapters}
        progress={creationStudioViewModel.guidedProgress}
        recommendedStep={creationStudioViewModel.recommendedGuidedStep}
        guidedAssets={creationStudioViewModel.guidedAssets}
        isLoading={creationStudioViewModel.isLoadingCounts}
        loadError={creationStudioViewModel.countLoadError}
        LinkComponent={Link}
        onOpenCharacterCreator={onOpenCharacterCreator}
        onOpenPlayerCharacterCreator={onOpenPlayerCharacterCreator}
        onOpenFullStudio={() => onModeChange(CREATION_STUDIO_MODES.FULL)}
      />
    );
  }

  return (
    <StudioFullModeView
      sections={creationStudioViewModel.fullStudioSections}
      activeSectionSlug={activeFullStudioSectionSlug}
      LinkComponent={Link}
      onOpenCharacterCreator={onOpenCharacterCreator}
      onOpenPlayerCharacterCreator={onOpenPlayerCharacterCreator}
      onSelectSection={onOpenFullStudioSection}
      onBack={onBackToFullStudio}
    />
  );
}

const FIXTURE_MODES = {
  default: "Default",
  empty: "Empty",
  longestContent: "Longest content",
};

function FixtureModeHarness({ fixtureMode, onChangeFixtureMode }) {
  return (
    <div className="flex flex-wrap items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)]">
      <span className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        Fixture mode
      </span>
      {Object.entries(FIXTURE_MODES).map(([key, label]) => (
        <button
          key={key}
          type="button"
          aria-pressed={fixtureMode === key}
          onClick={() => onChangeFixtureMode(key)}
          className={`min-h-[var(--control-sm)] rounded-[var(--radius-md)] border px-[var(--space-3)] text-[length:var(--text-label)] transition-colors ${
            fixtureMode === key
              ? "border-[var(--line-whisper)] bg-[var(--fill)] text-[var(--gold-bright)]"
              : "border-[var(--line-whisper)] text-[var(--ink-dim)] hover:border-[var(--line)]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function Studio({ showFixtureHarness = true }) {
  const router = useRouter();
  const [fixtureMode, setFixtureMode] = useState("default");
  const [characterCreatorRequest, setCharacterCreatorRequest] = useState(null);
  const [isWorldCreatorOpen, setIsWorldCreatorOpen] = useState(false);
  const [isLookCreatorOpen, setIsLookCreatorOpen] = useState(false);
  const [isStoryCreatorOpen, setIsStoryCreatorOpen] = useState(false);
  const [fullStudioSectionSlug, setFullStudioSectionSlug] = useState("");

  useEffect(() => {
    function syncFullStudioSectionFromLocation() {
      try {
        const params = new URLSearchParams(window.location.search);
        setFullStudioSectionSlug(String(params.get("section") || "").trim().toLowerCase());
      } catch {
        setFullStudioSectionSlug("");
      }
    }

    syncFullStudioSectionFromLocation();
    window.addEventListener("popstate", syncFullStudioSectionFromLocation);
    return () => window.removeEventListener("popstate", syncFullStudioSectionFromLocation);
  }, []);

  function setFullStudioSection(sectionId = "", { replace = false } = {}) {
    const slug = sectionId ? getFullStudioSectionSlug(sectionId) : "";

    try {
      const url = new URL(window.location.href);
      if (slug) url.searchParams.set("section", slug);
      else url.searchParams.delete("section");

      const nextUrl = `${url.pathname}${url.search}${url.hash}`;
      if (replace) window.history.replaceState({}, "", nextUrl);
      else window.history.pushState({}, "", nextUrl);
      setFullStudioSectionSlug(slug);
    } catch {
      setFullStudioSectionSlug(slug);
    }
  }

  const viewProps = useStudioViewModel({
    fixtureMode,
    onNavigate: (route) => router.push(route),
    onOpenCharacterCreator: () =>
      setCharacterCreatorRequest({
        creationType: CHARACTER_CREATOR_TYPES.CHARACTER,
        fieldScope: "quick",
      }),
    onOpenPlayerCharacterCreator: () =>
      setCharacterCreatorRequest({
        creationType: CHARACTER_CREATOR_TYPES.PLAYER_CHARACTER,
        fieldScope: "quick",
      }),
    onOpenWorldCreator: () => setIsWorldCreatorOpen(true),
    onOpenLookCreator: () => setIsLookCreatorOpen(true),
    onOpenStoryCreator: () => setIsStoryCreatorOpen(true),
  });

  function syncModeQuery(nextMode) {
    try {
      const url = new URL(window.location.href);
      const modeSlug = {
        [CREATION_STUDIO_MODES.QUICK]: "quick",
        [CREATION_STUDIO_MODES.GUIDED]: "guided",
        [CREATION_STUDIO_MODES.FULL]: "full",
      }[nextMode];

      if (modeSlug) url.searchParams.set("mode", modeSlug);
      else url.searchParams.delete("mode");

      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    } catch {
      // The persisted mode remains authoritative when URL mutation is unavailable.
    }
  }

  function handleModeChange(nextMode) {
    if (
      nextMode === CREATION_STUDIO_MODES.FULL &&
      viewProps.activeMode === CREATION_STUDIO_MODES.FULL &&
      fullStudioSectionSlug
    ) {
      setFullStudioSection("", { replace: true });
      syncModeQuery(nextMode);
      return;
    }

    viewProps.onSelectMode(nextMode);
    syncModeQuery(nextMode);
    if (nextMode !== CREATION_STUDIO_MODES.FULL && fullStudioSectionSlug) {
      setFullStudioSection("", { replace: true });
    }
  }

  return (
    <>
      <StudioView
        {...viewProps}
        onSelectMode={handleModeChange}
        modeContentSlot={
          viewProps.activeMode === CREATION_STUDIO_MODES.QUICK ? null : (
            <StudioModeContent
              mode={viewProps.activeMode}
              onModeChange={handleModeChange}
              onOpenCharacterCreator={() =>
                setCharacterCreatorRequest({
                  creationType: CHARACTER_CREATOR_TYPES.CHARACTER,
                  fieldScope: "full",
                })
              }
              onOpenPlayerCharacterCreator={() =>
                setCharacterCreatorRequest({
                  creationType: CHARACTER_CREATOR_TYPES.PLAYER_CHARACTER,
                  fieldScope: "full",
                })
              }
              activeFullStudioSectionSlug={fullStudioSectionSlug}
              onOpenFullStudioSection={(sectionId) => setFullStudioSection(sectionId)}
              onBackToFullStudio={() => setFullStudioSection("", { replace: true })}
            />
          )
        }
        harnessSlot={
          showFixtureHarness && process.env.NODE_ENV !== "production" ? (
            <FixtureModeHarness fixtureMode={fixtureMode} onChangeFixtureMode={setFixtureMode} />
          ) : null
        }
      />

      {characterCreatorRequest ? (
        <CharacterCreatorModal
          creationType={characterCreatorRequest.creationType}
          fieldScope={characterCreatorRequest.fieldScope}
          onClose={() => setCharacterCreatorRequest(null)}
        />
      ) : null}

      {isWorldCreatorOpen ? (
        // The Worlds quick create (components/studio/create/world/
        // creator-stops/): live-wired the same way
        // CharacterCreatorModal is, mounted by the Shell, not the
        // View.
        <WorldCreatorModal onClose={() => setIsWorldCreatorOpen(false)} />
      ) : null}

      {isLookCreatorOpen ? (
        // The Looks quick create (components/studio/create/look/
        // creator-stops/): live-wired the same way
        // CharacterCreatorModal and WorldCreatorModal are, mounted by
        // the Shell, not the View.
        <LookCreatorModal onClose={() => setIsLookCreatorOpen(false)} />
      ) : null}

      {isStoryCreatorOpen ? (
        // The Stories quick create, this pass's own brief
        // (components/studio/create/story/creator-stops/): live-wired
        // the same way the other three quick creates are, mounted by
        // the Shell, not the View.
        <StoryCreatorModal onClose={() => setIsStoryCreatorOpen(false)} />
      ) : null}
    </>
  );
}
