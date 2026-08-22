import {
  Compass,
  Eye,
  Flag,
  KeyRound,
  Lock,
  RefreshCcw,
} from "lucide-react";

import { SectionTitle } from "@/components/studio/my-creations/edit/sections/SharedFields";

const ICONS = Object.freeze({
  compass: Compass,
  eye: Eye,
  flag: Flag,
  key: KeyRound,
  lock: Lock,
  refresh: RefreshCcw,
});

export default function ScenarioMiddlewareSectionView({
  sectionEyebrow = "Scenario Editor",
  sectionTitle = "Scenario Add-ons",
  sectionDescription = "",
  modules = [],
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-[var(--space-6)] grid gap-[var(--space-3)] md:grid-cols-2">
        {modules.map((module) => {
          const Icon = ICONS[module.iconKey] || Flag;

          return (
            // 4.9: no color-only state. A tier 7 state word joins the
            // B4 token-pair fill so "on" is legible without relying
            // on the gold wash alone.
            <button
              key={module.id}
              type="button"
              aria-pressed={module.isEnabled}
              onClick={() => module.onToggle?.()}
              className={`rounded-[var(--radius-md)] border p-[var(--space-4)] text-left transition ${
                module.isEnabled
                  ? "border-[var(--gold-action)] bg-[var(--fill-whisper)] text-[var(--ink)]"
                  : "border-[var(--line-whisper)] bg-[var(--fill-option-rest)] text-[var(--ink-dim)] hover:border-[var(--state-hover-line)] hover:text-[var(--ink)]"
              }`}
            >
              <div className="flex items-start gap-[var(--space-3)]">
                <Icon
                  size={20}
                  className={
                    module.isEnabled
                      ? "text-[var(--gold-ornament)]"
                      : "text-[var(--ink-faint)]"
                  }
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-[var(--space-2)]">
                    <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] font-medium">
                      {module.title}
                    </p>
                    <span className="flex-none text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
                      {module.isEnabled ? "On" : "Off"}
                    </span>
                  </div>
                  <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                    {module.body}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
