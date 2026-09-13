"use client";

import { CloudSun, Download, Eye, Flag, Lock, Share2 } from "lucide-react";

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

// 2.0.0 (fe/chat-studio item 6): no card chrome, no eyebrow or title, no
// close control. The details rail names the section; this View renders
// the world state rows (`layout="sections"`), the Export and Share
// actions (`layout="actions"`), or both (the default), inside whatever
// container mounts it.
export default function StoryRoomStatePanelView({
  sections = [],
  actions = [],
  layout = "full",
}) {
  const safeSections = Array.isArray(sections) ? sections : [];
  const safeActions = Array.isArray(actions) ? actions : [];
  const showSections = layout !== "actions";
  const showActions = layout !== "sections";

  return (
    <div className="min-w-0">
      {showSections ? (
        <div className="space-y-[var(--space-4)]">
          {safeSections.map((section) => (
            <StateSection key={section.id} section={section} />
          ))}
        </div>
      ) : null}

      {showActions && safeActions.length ? (
        <div className={`grid grid-cols-2 gap-[var(--space-2)] ${showSections ? "mt-[var(--space-5)]" : ""}`}>
          {safeActions.map((action) => {
            const ActionIcon = ACTION_ICONS[action.iconKey] || Download;

            return (
              <button
                key={action.id}
                type="button"
                disabled={action.disabled !== false}
                onClick={() => action.onPress?.()}
                className="cf-btn cf-btn--secondary w-full justify-center disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]"
              >
                <ActionIcon size={14} aria-hidden="true" />
                {action.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function StateSection({ section }) {
  const Icon = SECTION_ICONS[section?.iconKey] || Flag;
  const rows = Array.isArray(section?.rows) ? section.rows : [];

  return (
    <div className="min-w-0">
      <p className="inline-flex items-center gap-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        <Icon size={14} aria-hidden="true" />
        {section?.title || "State"}
      </p>

      <dl className="mt-[var(--space-3)] space-y-[var(--space-3)]">
        {rows.map((row) => (
          <div key={row.id}>
            <dt className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]">
              {row.label}
            </dt>
            <dd className="mt-[var(--space-1)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink)]">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
