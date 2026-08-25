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
import { useState } from "react";
import { useRouter } from "next/navigation";

import StudioView from "./studio/Studio.view";
import { useStudioViewModel } from "./studio/useStudioViewModel";
import CharacterCreatorModal from "@/components/studio/create/character/creator-stops/CharacterCreatorModal";
import WorldCreatorModal from "@/components/studio/create/world/creator-stops/WorldCreatorModal";
import LookCreatorModal from "@/components/studio/create/look/creator-stops/LookCreatorModal";
import StoryCreatorModal from "@/components/studio/create/story/creator-stops/StoryCreatorModal";

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

export default function Studio() {
  const router = useRouter();
  const [fixtureMode, setFixtureMode] = useState("default");
  const [isCharacterCreatorOpen, setIsCharacterCreatorOpen] = useState(false);
  const [isWorldCreatorOpen, setIsWorldCreatorOpen] = useState(false);
  const [isLookCreatorOpen, setIsLookCreatorOpen] = useState(false);
  const [isStoryCreatorOpen, setIsStoryCreatorOpen] = useState(false);

  const viewProps = useStudioViewModel({
    fixtureMode,
    onNavigate: (route) => router.push(route),
    onOpenCharacterCreator: () => setIsCharacterCreatorOpen(true),
    onOpenWorldCreator: () => setIsWorldCreatorOpen(true),
    onOpenLookCreator: () => setIsLookCreatorOpen(true),
    onOpenStoryCreator: () => setIsStoryCreatorOpen(true),
  });

  return (
    <>
      <StudioView
        {...viewProps}
        harnessSlot={
          process.env.NODE_ENV === "production" ? null : (
            <FixtureModeHarness fixtureMode={fixtureMode} onChangeFixtureMode={setFixtureMode} />
          )
        }
      />

      {isCharacterCreatorOpen ? (
        // fieldScope="quick" per docs/STUDIO-SPEC.md section 3.2. S2
        // (components/studio/create/character/creator-stops/**, run in
        // parallel, not yet landed at this brief's build time) adds
        // this prop to CharacterCreatorModal's signature. Until it
        // lands the component destructures only { onClose } and
        // silently ignores the extra prop, rendering its full field
        // set: correct integration behavior per the brief, not a bug
        // to fix here.
        <CharacterCreatorModal
          fieldScope="quick"
          onClose={() => setIsCharacterCreatorOpen(false)}
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
