"use client";

// Binding Shell (docs/CRESTFALL-DESIGN-CONTEXT.md LOOM shape): owns
// Crestfall-specific integration only. Next.js navigation (useRouter)
// is the one piece of application wiring this page needs beyond the
// back button, which is self-contained (components/studio/profile/
// ProfileBackButton owns its own router hook internally, composed
// directly by CreatorProfile.view.jsx). The fixture-mode harness
// (default / empty / loading / error / muted / longest content) is
// dev-only QA scaffolding, never product, per docs/FRONTEND-SOP.md
// section 2. Mute placement is ruled (item 36, CR-028, 11 Aug 2026):
// inline in the engagement row only, no variant switch.
import { useState } from "react";
import { useRouter } from "next/navigation";

import CreatorProfileView from "./creator-profile/CreatorProfile.view";
import { useCreatorProfileViewModel } from "./creator-profile/useCreatorProfileViewModel";

const FIXTURE_MODES = {
  default: "Default",
  empty: "Empty",
  loading: "Loading",
  error: "Error",
  muted: "Muted",
  longestContent: "Longest content",
};

function FixtureModeHarness({ fixtureMode, onChangeFixtureMode }) {
  return (
    <div className="flex flex-col gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)]">
      <div className="flex flex-wrap items-center gap-[var(--space-2)]">
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
    </div>
  );
}

export default function CreatorProfile({ handle = "" }) {
  const router = useRouter();
  const [fixtureMode, setFixtureMode] = useState("default");

  const viewProps = useCreatorProfileViewModel({
    handle,
    fixtureMode,
    onNavigate: (route) => router.push(route),
  });

  return (
    <CreatorProfileView
      {...viewProps}
      harnessSlot={
        process.env.NODE_ENV === "production" ? null : (
          <FixtureModeHarness
            fixtureMode={fixtureMode}
            onChangeFixtureMode={setFixtureMode}
          />
        )
      }
    />
  );
}
