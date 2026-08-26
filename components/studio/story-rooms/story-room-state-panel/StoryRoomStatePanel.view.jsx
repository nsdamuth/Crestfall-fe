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
    <aside className="self-start rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/45 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
          {eyebrow}
        </p>

        {showCloseControl ? (
          <button
            type="button"
            onClick={() => onClosePanel?.()}
            className="rounded-lg border border-white/10 p-2 text-[var(--ink-dim)] transition hover:border-[var(--gold-ornament)]/35 hover:text-[var(--ink)]"
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
                onClick={() => action.onPress?.()}
                className="cf-btn cf-btn--secondary"
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
      <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
        <Icon size={14} />
        {section?.title || "State"}
      </p>

      <div className="mt-3 space-y-3">
        {rows.map((row) => (
          <div key={row.id}>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
              {row.label}
            </p>

            <p className="mt-1 text-sm leading-5 text-[var(--ink)]">
              {row.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
