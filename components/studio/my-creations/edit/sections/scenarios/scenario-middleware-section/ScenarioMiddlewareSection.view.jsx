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

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {modules.map((module) => {
          const Icon = ICONS[module.iconKey] || Flag;

          return (
            <button
              key={module.id}
              type="button"
              aria-pressed={module.isEnabled}
              onClick={() => module.onToggle?.()}
              className={`rounded-[var(--radius-md)] border p-4 text-left transition ${
                module.isEnabled
                  ? "border-[var(--muted-gold)]/60 bg-[var(--muted-gold)]/15 text-[var(--foreground)]"
                  : "border-white/10 bg-black/25 text-[var(--muted)] hover:border-[var(--muted-gold)]/30 hover:text-[var(--foreground)]"
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon
                  size={20}
                  className={
                    module.isEnabled
                      ? "text-[var(--muted-gold)]"
                      : "text-[var(--muted)]"
                  }
                />

                <div>
                  <p className="text-sm font-medium">{module.title}</p>
                  <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
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
