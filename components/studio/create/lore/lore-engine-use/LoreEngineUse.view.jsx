"use client";

import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Send,
  UserRound,
  XCircle,
} from "lucide-react";

const STATUS_PRESENTATION = {
  QUEUED: {
    label: "Queued",
    className: "border-sky-300/25 bg-sky-300/10 text-sky-100",
  },
  PREPARING: {
    label: "Preparing",
    className: "border-sky-300/25 bg-sky-300/10 text-sky-100",
  },
  INDEXING: {
    label: "Processing",
    className: "border-sky-300/25 bg-sky-300/10 text-sky-100",
  },
  VERIFYING: {
    label: "Verifying",
    className: "border-sky-300/25 bg-sky-300/10 text-sky-100",
  },
  PREPARED: {
    label: "Prepared",
    className: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  },
  READY: {
    label: "Ready",
    className: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  },
  ACTIVE: {
    label: "Active",
    className: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  },
  CANCELLING: {
    label: "Cancelling",
    className: "border-amber-300/25 bg-amber-300/10 text-amber-100",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "border-white/15 bg-white/5 text-[var(--ink-dim)]",
  },
  FAILED: {
    label: "Failed",
    className: "border-red-300/25 bg-red-300/10 text-red-100",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    className: "border-white/15 bg-white/5 text-[var(--ink-dim)]",
  },
  SUPERSEDED: {
    label: "Superseded",
    className: "border-white/15 bg-white/5 text-[var(--ink-dim)]",
  },
};

function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleString();
}

function EngineUseStatusBadge({ status }) {
  const normalized = String(status || "").trim().toUpperCase();
  const presentation = STATUS_PRESENTATION[normalized] || {
    label: normalized || "Not submitted",
    className: "border-white/15 bg-white/5 text-[var(--ink-dim)]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] ${presentation.className}`}
    >
      {presentation.label}
    </span>
  );
}

function ReferenceChoice({
  icon: Icon,
  refItem,
  selected,
  onToggle,
  children = null,
}) {
  return (
    <div
      className={`rounded-xl border p-4 transition ${
        selected
          ? "border-[var(--gold-ornament)]/40 bg-[var(--gold-ornament)]/10"
          : "border-white/10 bg-black/20"
      }`}
    >
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="mt-1 h-4 w-4 accent-[var(--gold-ornament)]"
        />
        <Icon size={17} className="mt-0.5 shrink-0 text-[var(--gold-ornament)]" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm text-[var(--ink)]">
            {refItem.title}
          </span>
          <span className="mt-1 block text-xs text-[var(--ink-dim)]">
            {selected ? "Included in this submission" : "Not included"}
          </span>
        </span>
      </label>
      {selected && children ? <div className="mt-3 pl-10">{children}</div> : null}
    </div>
  );
}

function SubmissionHistory({ submissions }) {
  if (!submissions.length) return null;

  return (
    <div className="mt-5 border-t border-white/10 pt-5">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        Recent engine-use submissions
      </p>
      <div className="mt-3 grid gap-2">
        {submissions.slice(0, 5).map((submission) => (
          <div
            key={submission.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
          >
            <div>
              <p className="text-sm text-[var(--ink)]">
                Public revision {submission.sourceRevisionNumber || "·"}
              </p>
              <p className="mt-1 text-xs text-[var(--ink-dim)]">
                Submitted {formatDate(submission.submittedAt || submission.createdAt)}
              </p>
            </div>
            <EngineUseStatusBadge status={submission.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoreEngineUseView({
  source = {},
  submissions = [],
  latest = null,
  latestStatus = "",
  isActive = false,
  loadStatus = "IDLE",
  loadMessage = "",
  actionStatus = "IDLE",
  actionMessage = "",
  scopeMode = "ENTIRE_ASSET",
  selectedSectionIds = [],
  selectedCharacterIds = [],
  selectedLocationIds = [],
  knowledgeModes = {},
  knowledgeModeOptions = [],
  availableSections = [],
  characterRefs = [],
  locationRefs = [],
  canSubmit = false,
  canCancel = false,
  canWithdraw = false,
  setScopeMode,
  toggleSection,
  toggleCharacter,
  toggleLocation,
  setCharacterKnowledgeMode,
  submit,
  cancel,
  withdraw,
  refresh,
}) {
  const hasPublicRelease = Boolean(source.publicReleaseId);
  const isWorking = actionStatus === "WORKING";

  return (
    <div className="mt-6 rounded-[var(--radius-md)] border border-violet-300/20 bg-violet-300/[0.04] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-violet-200">
            Character use
          </p>
          <h3 className="mt-2 font-display text-3xl">Submit for Engine Use</h3>
          <p className="mt-3 leading-7 text-[var(--ink-dim)]">
            Choose which parts of the active public Lore revision may be prepared for approved Characters, and identify the Locations that should provide contextual relevance.
          </p>
          <p className="mt-2 text-sm text-[var(--ink-dim)]">
            This is separate from publication. The editable draft and public page are not changed by this submission.
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={loadStatus === "LOADING"}
          className="cf-btn cf-btn--secondary cf-btn--sm"
        >
          <RefreshCw
            size={13}
            className={loadStatus === "LOADING" ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {loadMessage ? (
        <div className="mt-4 rounded-xl border border-red-300/20 bg-red-300/5 px-4 py-3 text-sm text-red-100">
          {loadMessage}
        </div>
      ) : null}

      {!hasPublicRelease ? (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-300/20 bg-amber-300/5 p-4">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-200" />
          <p className="text-sm leading-6 text-amber-50">
            Publish a validated Lore revision before configuring engine use.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-violet-200">
                Source revision
              </p>
              <p className="mt-1 text-sm text-[var(--ink)]">
                Public revision {source.revisionNumber || "·"}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-violet-200">
                Tagged Characters
              </p>
              <p className="mt-1 text-sm text-[var(--ink)]">
                {characterRefs.length}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-violet-200">
                Tagged Locations
              </p>
              <p className="mt-1 text-sm text-[var(--ink)]">
                {locationRefs.length}
              </p>
            </div>
          </div>

          {latest ? (
            <div className="mt-5 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-dim)]">
                    Latest engine-use submission
                  </p>
                  <p className="mt-2 text-sm text-[var(--ink)]">
                    Public revision {latest.sourceRevisionNumber || "·"} · {formatDate(latest.submittedAt || latest.createdAt)}
                  </p>
                </div>
                <EngineUseStatusBadge status={latest.status} />
              </div>

              {latestStatus === "QUEUED" ? (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-sky-300/20 bg-sky-300/5 p-4">
                  <Clock3 size={18} className="mt-0.5 shrink-0 text-sky-200" />
                  <p className="text-sm leading-6 text-sky-50">
                    The immutable source, selected scope, and proposed bindings are safely recorded. Processing and character activation are not enabled in this foundation patch.
                  </p>
                </div>
              ) : null}

              {latestStatus === "PREPARED" ? (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-200" />
                  <p className="text-sm leading-6 text-emerald-50">
                    Source preparation is complete. The immutable Lore structure and text chunks are ready for the next processing stage, but Character use is not active yet.
                  </p>
                </div>
              ) : null}

              {latestStatus === "ACTIVE" || latestStatus === "READY" ? (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-300/20 bg-emerald-300/5 p-4">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-200" />
                  <p className="text-sm leading-6 text-emerald-50">
                    This public Lore revision is available for approved character use.
                  </p>
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-3">
                {canCancel ? (
                  <button
                    type="button"
                    onClick={cancel}
                    disabled={isWorking}
                    className="cf-btn cf-btn--danger"
                  >
                    <XCircle size={14} />
                    Cancel submission
                  </button>
                ) : null}

                {canWithdraw ? (
                  <button
                    type="button"
                    onClick={withdraw}
                    disabled={isWorking}
                    className="cf-btn cf-btn--danger"
                  >
                    <XCircle size={14} />
                    Withdraw from engine use
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {!isActive ? (
            <div className="mt-5 grid gap-5">
              <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/20 p-5">
                <div className="flex items-center gap-3">
                  <BookOpenCheck size={19} className="text-violet-200" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-violet-200">
                      Lore scope
                    </p>
                    <p className="mt-1 text-sm text-[var(--ink-dim)]">
                      Choose the authored material included in this submission.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setScopeMode("ENTIRE_ASSET")}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      scopeMode === "ENTIRE_ASSET"
                        ? "border-violet-300/40 bg-violet-300/10"
                        : "border-white/10 bg-black/20"
                    }`}
                  >
                    <span className="block text-sm text-[var(--ink)]">
                      Entire public revision
                    </span>
                    <span className="mt-1 block text-xs text-[var(--ink-dim)]">
                      Include every chapter and section.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScopeMode("SELECTED_SECTIONS")}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      scopeMode === "SELECTED_SECTIONS"
                        ? "border-violet-300/40 bg-violet-300/10"
                        : "border-white/10 bg-black/20"
                    }`}
                  >
                    <span className="block text-sm text-[var(--ink)]">
                      Selected sections
                    </span>
                    <span className="mt-1 block text-xs text-[var(--ink-dim)]">
                      Include only specific sections.
                    </span>
                  </button>
                </div>

                {scopeMode === "SELECTED_SECTIONS" ? (
                  <div className="mt-4 grid gap-2">
                    {availableSections.map((section) => (
                      <label
                        key={section.id}
                        className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSectionIds.includes(section.id)}
                          onChange={() => toggleSection(section.id)}
                          className="mt-1 h-4 w-4 accent-[var(--gold-ornament)]"
                        />
                        <span>
                          <span className="block text-sm text-[var(--ink)]">
                            {section.title}
                          </span>
                          <span className="mt-1 block text-xs text-[var(--ink-dim)]">
                            {section.chapterTitle}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/20 p-5">
                <div className="flex items-center gap-3">
                  <UserRound size={19} className="text-violet-200" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-violet-200">
                      Character knowledge
                    </p>
                    <p className="mt-1 text-sm text-[var(--ink-dim)]">
                      Select at least one tagged Character and describe how they know the Lore.
                    </p>
                  </div>
                </div>

                {characterRefs.length ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {characterRefs.map((refItem) => {
                      const selected = selectedCharacterIds.includes(refItem.id);
                      return (
                        <ReferenceChoice
                          key={refItem.id}
                          icon={UserRound}
                          refItem={refItem}
                          selected={selected}
                          onToggle={() => toggleCharacter(refItem.id)}
                        >
                          <label className="block text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
                            Knowledge relationship
                            <select
                              value={knowledgeModes[refItem.id] || "SECONDHAND"}
                              onChange={(event) =>
                                setCharacterKnowledgeMode(
                                  refItem.id,
                                  event.target.value
                                )
                              }
                              className="mt-2 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm normal-case tracking-normal text-[var(--ink)]"
                            >
                              {knowledgeModeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </label>
                        </ReferenceChoice>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-dashed border-white/15 px-4 py-4 text-sm text-[var(--ink-dim)]">
                    Tag at least one Character in the Lore document before submitting it for engine use.
                  </div>
                )}
              </div>

              <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/20 p-5">
                <div className="flex items-center gap-3">
                  <MapPin size={19} className="text-violet-200" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-violet-200">
                      Location relevance
                    </p>
                    <p className="mt-1 text-sm text-[var(--ink-dim)]">
                      Optional Location associations can make this Lore relevant to matching story contexts. They do not grant knowledge to every Character at that Location.
                    </p>
                  </div>
                </div>

                {locationRefs.length ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {locationRefs.map((refItem) => (
                      <ReferenceChoice
                        key={refItem.id}
                        icon={MapPin}
                        refItem={refItem}
                        selected={selectedLocationIds.includes(refItem.id)}
                        onToggle={() => toggleLocation(refItem.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-dashed border-white/15 px-4 py-4 text-sm text-[var(--ink-dim)]">
                    This public Lore revision has no tagged Locations.
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={submit}
                  disabled={!canSubmit}
                  className="cf-btn cf-btn--primary"
                >
                  {isWorking ? (
                    <LoaderCircle size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  Submit for engine use
                </button>

                {!selectedCharacterIds.length ? (
                  <p className="text-xs text-amber-100">
                    Select at least one tagged Character.
                  </p>
                ) : scopeMode === "SELECTED_SECTIONS" &&
                  !selectedSectionIds.length ? (
                  <p className="text-xs text-amber-100">
                    Select at least one Lore section.
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {actionMessage ? (
            <p
              className={`mt-4 text-sm ${
                actionStatus === "ERROR" ? "text-red-200" : "text-emerald-200"
              }`}
            >
              {actionMessage}
            </p>
          ) : null}

          <SubmissionHistory submissions={submissions} />
        </>
      )}
    </div>
  );
}
