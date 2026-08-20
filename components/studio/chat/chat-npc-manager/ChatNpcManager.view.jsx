"use client";

import {
  ChevronDown,
  ChevronUp,
  CircleSlash2,
  RotateCcw,
  Search,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";

const ACTION_ICONS = {
  unload: UserMinus,
  target: Search,
  load: UserPlus,
  reload: RotateCcw,
  unavailable: CircleSlash2,
};

export default function ChatNpcManagerView({
  title = "Manage Registry NPCs",
  summaryText = "0 loaded",
  isOpen = false,
  loadingNotice = "",
  registryNotice = "",
  errorMessage = "",
  sections = [],
  onTogglePanel = null,
  onActivateNpc = null,
}) {
  const safeSections = Array.isArray(sections) ? sections : [];

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)]">
      <button
        type="button"
        onClick={() => onTogglePanel?.()}
        className="flex min-h-[var(--control-md)] w-full touch-manipulation items-center justify-between gap-[var(--space-3)] px-[var(--space-4)] py-[var(--space-3)] text-left transition hover:bg-[var(--state-hover-fill)]"
        aria-expanded={isOpen}
      >
        <span className="inline-flex items-center gap-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          <Users size={14} aria-hidden="true" />
          {title}
        </span>

        <span className="inline-flex items-center gap-[var(--space-2)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
          {summaryText}
          {isOpen ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
        </span>
      </button>

      {isOpen ? (
        <div className="border-t border-[var(--line-whisper)] p-[var(--space-3)]">
          {loadingNotice ? <Notice>{loadingNotice}</Notice> : null}
          {registryNotice ? <Notice>{registryNotice}</Notice> : null}

          {errorMessage ? (
            <p className="mb-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--status-danger)]" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <div className="space-y-[var(--space-4)]">
            {safeSections.map((section) => (
              <NpcSection key={section.id} section={section} onActivateNpc={onActivateNpc} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NpcSection({ section, onActivateNpc }) {
  const entries = Array.isArray(section?.entries) ? section.entries : [];
  const ActionIcon = ACTION_ICONS[section?.actionIconKey] || UserPlus;

  return (
    <section>
      <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
        {section?.title || "NPCs"}
      </p>

      <div className="mt-[var(--space-2)] space-y-[var(--space-2)]">
        {entries.length ? (
          entries.map((entry) => (
            <article
              key={entry.actionId}
              className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-3)]"
            >
              <div className="flex gap-[var(--space-3)]">
                <NpcAvatar entry={entry} />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[length:var(--text-ui)] text-[var(--ink)]">{entry.name}</p>
                  <p className="mt-[var(--space-1)] truncate text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
                    {entry.title}
                  </p>
                  <p className="mt-[var(--space-1)] truncate text-[length:var(--text-label)] text-[var(--ink-faint)]">
                    {entry.registryTitle}
                  </p>

                  {entry.statusLabel ? (
                    <p className="mt-[var(--space-2)] inline-flex rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-bright)]">
                      {entry.statusLabel}
                    </p>
                  ) : null}

                  {entry.statusDetail ? (
                    <p className="mt-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
                      {entry.statusDetail}
                    </p>
                  ) : null}

                  {entry.pendingReason ? (
                    <p className="mt-[var(--space-2)] line-clamp-3 text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
                      {entry.pendingReason}
                    </p>
                  ) : null}
                </div>
              </div>

              {entry.hasAction !== false && entry.actionLabel ? (
                <button
                  type="button"
                  onClick={() => onActivateNpc?.(entry.actionId)}
                  disabled={entry.disabled}
                  title={entry.actionTitle || entry.actionLabel}
                  className="mt-[var(--space-3)] inline-flex min-h-[var(--control-sm)] w-full touch-manipulation items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-3)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] transition hover:bg-[var(--state-hover-fill)] disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)] [@media(pointer:coarse)]:min-h-[var(--control-md)]"
                >
                  <ActionIcon size={13} aria-hidden="true" />
                  {entry.busy ? entry.busyLabel : entry.actionLabel}
                </button>
              ) : null}
            </article>
          ))
        ) : (
          <p className="rounded-[var(--radius-md)] border border-dashed border-[var(--line-whisper)] px-[var(--space-3)] py-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-faint)]">
            {section?.emptyMessage || "No NPCs are available."}
          </p>
        )}
      </div>
    </section>
  );
}

function NpcAvatar({ entry }) {
  return (
    <div className="h-[var(--control-md)] w-[var(--control-md)] shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--line-whisper)] bg-[var(--surface-3)]">
      {entry.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={entry.avatarUrl} alt={entry.name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-display text-[length:var(--text-lead)] text-[var(--gold-ornament)]">
          {entry.fallbackInitial || "N"}
        </div>
      )}
    </div>
  );
}

function Notice({ children }) {
  return (
    <p className="mb-[var(--space-3)] rounded-[var(--radius-md)] border border-dashed border-[var(--line-whisper)] px-[var(--space-3)] py-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-dim)]">
      {children}
    </p>
  );
}
