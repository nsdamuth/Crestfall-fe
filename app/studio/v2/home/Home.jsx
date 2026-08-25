"use client";

// Binding Shell (docs/CRESTFALL-DESIGN-CONTEXT.md LOOM shape): owns
// Crestfall-specific integration only. Next.js navigation
// (useRouter) is the one piece of application wiring Home needs;
// everything else is presentation, delegated to the ViewModel and
// View. The fixture-mode harness (full / empty Continue / empty
// rails) is dev-only QA scaffolding, never product, per
// docs/FRONTEND-SOP.md section 2 ("app/dev/ui-preview never product"
// carried here as the same rule for this pre-parity staging page).
import { useState } from "react";
import { useRouter } from "next/navigation";

import HomeView from "./home/Home.view";
import { useHomeViewModel } from "./home/useHomeViewModel";

const FIXTURE_MODES = {
  full: "Full page",
  emptyContinue: "Empty Continue",
  emptyRails: "Empty rails",
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

export default function Home() {
  const router = useRouter();
  const [fixtureMode, setFixtureMode] = useState("full");

  const viewProps = useHomeViewModel({
    fixtureMode,
    onNavigate: (route) => router.push(route),
  });

  return (
    <HomeView
      {...viewProps}
      harnessSlot={
        process.env.NODE_ENV === "production" ? null : (
          <FixtureModeHarness fixtureMode={fixtureMode} onChangeFixtureMode={setFixtureMode} />
        )
      }
    />
  );
}
