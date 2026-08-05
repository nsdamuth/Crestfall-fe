"use client";

import {
  ChevronDown,
  ChevronUp,
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
};

export default function StoryRoomNpcParticipantManagerView({
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
    <div className="rounded-xl border border-white/10 bg-black/25">
      <button
        type="button"
        onClick={() => onTogglePanel?.()}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-[var(--gold-ornament)]/10"
        aria-expanded={isOpen}
      >
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)]">
          <Users size={14} />
          {title}
        </span>

        <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[var(--ink-dim)]">
          {summaryText}
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      {isOpen ? (
        <div className="border-t border-white/10 p-3">
          {loadingNotice ? <Notice>{loadingNotice}</Notice> : null}
          {registryNotice ? <Notice>{registryNotice}</Notice> : null}

          {errorMessage ? (
            <p className="mb-3 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-200">
              {errorMessage}
            </p>
          ) : null}

          <div className="space-y-4">
            {safeSections.map((section) => (
              <NpcSection
                key={section.id}
                section={section}
                onActivateNpc={onActivateNpc}
              />
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
  const isUnloadAction = section?.actionIconKey === "unload";

  return (
    <section>
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
        {section?.title || "NPCs"}
      </p>

      <div className="mt-2 space-y-2">
        {entries.length ? (
          entries.map((entry) => (
            <article
              key={entry.actionId}
              className="rounded-lg border border-white/10 bg-black/30 p-3"
            >
              <div className="flex gap-3">
                <NpcAvatar entry={entry} />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-[var(--ink)]">
                    {entry.name}
                  </p>
                  <p className="mt-1 truncate text-[10px] uppercase tracking-[0.12em] text-[var(--gold-ornament)]">
                    {entry.title}
                  </p>
                  <p className="mt-1 truncate text-xs text-[var(--ink-dim)]">
                    {entry.registryTitle}
                  </p>
                  {entry.statusLabel ? (
                    <p className="mt-2 inline-flex rounded-full border border-[var(--gold-ornament)]/30 bg-[var(--gold-ornament)]/10 px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-[var(--gold-ornament)]">
                      {entry.statusLabel}
                    </p>
                  ) : null}
                  {entry.statusDetail ? (
                    <p className="mt-2 text-[11px] leading-4 text-[var(--ink-dim)]">
                      {entry.statusDetail}
                    </p>
                  ) : null}
                  {entry.pendingReason ? (
                    <p className="mt-2 line-clamp-3 text-[11px] leading-4 text-[var(--ink-dim)]">
                      {entry.pendingReason}
                    </p>
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onActivateNpc?.(entry.actionId)}
                disabled={entry.disabled}
                className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-[10px] uppercase tracking-[0.14em] transition disabled:cursor-not-allowed disabled:opacity-45 ${
                  isUnloadAction
                    ? "border-white/10 bg-transparent text-[var(--status-danger)] hover:border-[var(--status-danger)]/40"
                    : "border-[var(--gold-ornament)]/30 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)] hover:bg-[var(--gold-ornament)]/20"
                }`}
                title={entry.actionTitle || entry.actionLabel}
              >
                <ActionIcon size={13} />
                {entry.busy ? entry.busyLabel : entry.actionLabel}
              </button>
            </article>
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-white/10 px-3 py-3 text-xs leading-5 text-[var(--ink-dim)]">
            {section?.emptyMessage || "No NPCs are available."}
          </p>
        )}
      </div>
    </section>
  );
}

function NpcAvatar({ entry }) {
  return (
    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10">
      {entry.avatarUrl ? (
        <img
          src={entry.avatarUrl}
          alt={entry.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-display text-lg text-[var(--gold-ornament)]">
          {entry.fallbackInitial || "N"}
        </div>
      )}
    </div>
  );
}

function Notice({ children }) {
  return (
    <p className="mb-3 rounded-lg border border-dashed border-white/10 px-3 py-3 text-xs leading-5 text-[var(--ink-dim)]">
      {children}
    </p>
  );
}
