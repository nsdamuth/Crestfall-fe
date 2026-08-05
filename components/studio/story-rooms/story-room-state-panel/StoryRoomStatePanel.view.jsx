"use client";

import {
  CloudSun,
  Download,
  Eye,
  Flag,
  Lock,
  PanelRightClose,
  Share2,
} from "lucide-react";

const SECTION_ICONS = {
  scenario: Flag,
  world: CloudSun,
  knowledge: Lock,
  memory: Eye,
};

const ACTION_ICONS = {
  download: Download,
  share: Share2,
};

export default function StoryRoomStatePanelView({
  eyebrow = "Chronicle State",
  title = "Story Data",
  sections = [],
  actions = [],
  showCloseControl = false,
  onClosePanel = null,
}) {
  const safeSections = Array.isArray(sections) ? sections : [];
  const safeActions = Array.isArray(actions) ? actions : [];

  return (
    <aside className="self-start rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/45 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
          {eyebrow}
        </p>

        {showCloseControl ? (
          <button
            type="button"
            onClick={() => onClosePanel?.()}
            className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
            aria-label="Hide state panel"
            title="Hide state panel"
          >
            <PanelRightClose size={15} />
          </button>
        ) : null}
      </div>

      <h2 className="mt-2 font-display text-3xl">{title}</h2>

      <div className="mt-6 space-y-4">
        {safeSections.map((section) => (
          <StateCard key={section.id} section={section} />
        ))}
      </div>

      {safeActions.length ? (
        <div className="mt-6 grid gap-3">
          {safeActions.map((action) => {
            const ActionIcon = ACTION_ICONS[action.iconKey] || Download;

            return (
              <button
                key={action.id}
                type="button"
                disabled={action.disabled !== false}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--muted)] opacity-60"
              >
                <ActionIcon size={14} />
                {action.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </aside>
  );
}

function StateCard({ section }) {
  const Icon = SECTION_ICONS[section?.iconKey] || Flag;
  const rows = Array.isArray(section?.rows) ? section.rows : [];

  return (
    <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4">
      <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)]">
        <Icon size={14} />
        {section?.title || "State"}
      </p>

      <div className="mt-3 space-y-3">
        {rows.map((row) => (
          <div key={row.id}>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
              {row.label}
            </p>

            <p className="mt-1 text-sm leading-5 text-[var(--foreground)]">
              {row.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
