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


function normalizeDisplayValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function formatKnowledgeMode(value) {
  const normalized = normalizeDisplayValue(value).toUpperCase();
  const labels = {
    PERSONAL_PARTICIPANT: "Personal participant",
    DIRECT_WITNESS: "Direct witness",
    SECONDHAND: "Secondhand knowledge",
    INSTITUTIONAL: "Institutional knowledge",
    CULTURAL: "Cultural knowledge",
    RUMOR: "Rumor",
    SCHOLARLY: "Scholarly knowledge",
    PRIVATE_BELIEF: "Private belief",
    CONTEXTUAL_RELEVANCE: "Contextual relevance",
  };
  return labels[normalized] || normalized || "Knowledge relationship unavailable";
}

function resolveBindingScopeLabel(binding, source) {
  const scopeType = normalizeDisplayValue(binding?.scopeType).toUpperCase();
  const chapters = Array.isArray(source?.chapters) ? source.chapters : [];
  const chapter = chapters.find((item) => item?.id === binding?.chapterId) || null;

  if (scopeType === "CHAPTER") {
    return `Chapter · ${chapter?.title || binding?.chapterId || "Unknown chapter"}`;
  }

  if (scopeType === "SECTION") {
    const section = chapters
      .flatMap((item) =>
        (Array.isArray(item?.sections) ? item.sections : []).map((candidate) => ({
          ...candidate,
          chapterTitle: item?.title || "",
        }))
      )
      .find((item) => item?.id === binding?.sectionId);
    return `Section · ${section?.title || binding?.sectionId || "Unknown section"}${
      section?.chapterTitle ? ` · ${section.chapterTitle}` : ""
    }`;
  }

  return "All submitted Lore";
}

function ActiveEngineConfiguration({ latest, source }) {
  const bindings = Array.isArray(latest?.bindings) ? latest.bindings : [];
  const characterBindings = bindings.filter(
    (binding) => normalizeDisplayValue(binding?.subjectType).toUpperCase() === "CHARACTER"
  );
  const locationBindings = bindings.filter(
    (binding) => normalizeDisplayValue(binding?.subjectType).toUpperCase() === "LOCATION"
  );
  const scopeMode = normalizeDisplayValue(latest?.scope?.mode).toUpperCase();
  const selectedSectionIds = Array.isArray(latest?.scope?.selectedSectionIds)
    ? latest.scope.selectedSectionIds
    : [];
  const scopeLabel =
    scopeMode === "SELECTED_SECTIONS"
      ? `${selectedSectionIds.length} selected section${selectedSectionIds.length === 1 ? "" : "s"}`
      : "Entire public revision";

  return (
    <div className="mt-5 rounded-[var(--radius-md)] border border-emerald-300/20 bg-emerald-300/[0.04] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">
            Active engine configuration
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
            This is the read-only binding configuration currently connected to the engine. Withdraw it before authoring a replacement.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-emerald-100">
          Connected
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">Lore scope</p>
        <p className="mt-1 text-sm text-[var(--ink)]">{scopeLabel}</p>
      </div>

      <div className="mt-4">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
          Connected Characters
        </p>
        {characterBindings.length ? (
          <div className="mt-2 grid gap-2">
            {characterBindings.map((binding) => {
              const approvalStatus = normalizeDisplayValue(binding?.approvalStatus).toUpperCase();
              return (
                <div
                  key={binding.id || `${binding.subjectId}:${binding.scopeType}`}
                  className="rounded-xl border border-emerald-300/20 bg-black/20 px-4 py-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <UserRound size={17} className="mt-0.5 shrink-0 text-emerald-200" />
                      <div className="min-w-0">
                        <p className="truncate text-sm text-[var(--ink)]">
                          {binding.subjectTitle || "Untitled Character"}
                        </p>
                        <p className="mt-1 text-xs text-emerald-100">
                          Connected to active Engine Use
                        </p>
                        <p className="mt-2 text-xs text-[var(--ink-dim)]">
                          {formatKnowledgeMode(binding.knowledgeMode)} · {resolveBindingScopeLabel(binding, source)}
                        </p>
                      </div>
                    </div>
                    {approvalStatus ? (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
                        {approvalStatus}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-2 rounded-xl border border-amber-300/20 bg-amber-300/5 px-4 py-3 text-xs text-amber-100">
            The active submission did not project a Character binding summary. Refresh before making lifecycle changes.
          </p>
        )}
      </div>

      {locationBindings.length ? (
        <div className="mt-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
            Connected Locations
          </p>
          <div className="mt-2 grid gap-2">
            {locationBindings.map((binding) => (
              <div
                key={binding.id || `${binding.subjectId}:location`}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
              >
                <MapPin size={17} className="mt-0.5 shrink-0 text-violet-200" />
                <div>
                  <p className="text-sm text-[var(--ink)]">
                    {binding.subjectTitle || "Untitled Location"}
                  </p>
                  <p className="mt-1 text-xs text-[var(--ink-dim)]">Contextual relevance</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
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

function KnowledgeTimePointFields({ label, value = {}, onChange }) {
  return (
    <div>
      <p className="text-xs text-[var(--ink)]">{label}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <label className="text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
          Story day
          <input
            type="number"
            min="1"
            step="1"
            value={value.day ?? ""}
            onChange={(event) => onChange("day", event.target.value)}
            placeholder="1"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm normal-case tracking-normal text-[var(--ink)]"
          />
        </label>
        <label className="text-[10px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
          Minute of day
          <input
            type="number"
            min="0"
            max="10079"
            step="1"
            value={value.minutes ?? ""}
            onChange={(event) => onChange("minutes", event.target.value)}
            placeholder="0"
            className="mt-1 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm normal-case tracking-normal text-[var(--ink)]"
          />
        </label>
      </div>
    </div>
  );
}

function CharacterAccessControls({
  characterId,
  knowledgeMode,
  knowledgeModeOptions,
  availabilityModeOptions,
  access = {},
  characterScopeOptions,
  availableChapters,
  includedSections,
  availableBlocks,
  availableScenarios,
  availableRoomTemplates,
  storyContextLoadStatus,
  storyContextLoadMessage,
  onKnowledgeModeChange,
  onScopeTypeChange,
  onChapterChange,
  onSectionChange,
  onToggleExclusion,
  onAvailabilityModeChange,
  onKnowledgeTimeFieldChange,
  onToggleContextAllowlist,
}) {
  const scopeType = access.scopeType || "ASSET";
  const includedChapterIds = new Set(
    includedSections.map((section) => section.chapterId)
  );
  const chapterOptions = availableChapters.filter((chapter) =>
    includedChapterIds.has(chapter.id)
  );
  const scopedSections = includedSections.filter((section) => {
    if (scopeType === "CHAPTER") return section.chapterId === access.chapterId;
    if (scopeType === "SECTION") return section.id === access.sectionId;
    return true;
  });
  const scopedSectionIds = new Set(scopedSections.map((section) => section.id));
  const scopedBlocks = availableBlocks.filter((block) =>
    scopedSectionIds.has(block.sectionId)
  );
  const scopedChapterIds = new Set(
    scopedSections.map((section) => section.chapterId)
  );

  const exclusionGroups = [
    scopeType === "ASSET"
      ? {
          field: "excludedChapterIds",
          label: "Excluded chapters",
          items: chapterOptions.filter((chapter) => scopedChapterIds.has(chapter.id)),
          selected: access.excludedChapterIds || [],
          getSecondary: () => "Deny every section and block in this chapter.",
        }
      : null,
    scopeType !== "SECTION"
      ? {
          field: "excludedSectionIds",
          label: "Excluded sections",
          items: scopedSections,
          selected: access.excludedSectionIds || [],
          getSecondary: (item) => item.chapterTitle,
        }
      : null,
    {
      field: "excludedBlockIds",
      label: "Excluded blocks",
      items: scopedBlocks,
      selected: access.excludedBlockIds || [],
      getSecondary: (item) => `${item.sectionTitle} · ${item.type}`,
    },
  ].filter(Boolean);

  return (
    <div className="grid gap-3">
      <label className="block text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
        Knowledge relationship
        <select
          value={knowledgeMode || "SECONDHAND"}
          onChange={(event) => onKnowledgeModeChange(event.target.value)}
          className="mt-2 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm normal-case tracking-normal text-[var(--ink)]"
        >
          {knowledgeModeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
        Knowledge scope
        <select
          value={scopeType}
          onChange={(event) => onScopeTypeChange(event.target.value)}
          className="mt-2 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm normal-case tracking-normal text-[var(--ink)]"
        >
          {characterScopeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {scopeType === "CHAPTER" ? (
        <label className="block text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
          Chapter
          <select
            value={access.chapterId || ""}
            onChange={(event) => onChapterChange(event.target.value)}
            className="mt-2 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm normal-case tracking-normal text-[var(--ink)]"
          >
            <option value="">Select a chapter</option>
            {chapterOptions.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.title}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {scopeType === "SECTION" ? (
        <label className="block text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
          Section
          <select
            value={access.sectionId || ""}
            onChange={(event) => onSectionChange(event.target.value)}
            className="mt-2 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm normal-case tracking-normal text-[var(--ink)]"
          >
            <option value="">Select a section</option>
            {includedSections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.chapterTitle} · {section.title}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {(scopeType === "ASSET" ||
        (scopeType === "CHAPTER" && access.chapterId) ||
        (scopeType === "SECTION" && access.sectionId)) ? (
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
            Explicit exclusions
          </p>
          <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
            Deny-precedence exceptions are removed before retrieval. Excluded Lore is never sent to the model for this Character.
          </p>
          <div className="mt-3 grid gap-3">
            {exclusionGroups.map((group) =>
              group.items.length ? (
                <div key={group.field}>
                  <p className="text-xs text-[var(--ink)]">{group.label}</p>
                  <div className="mt-2 grid gap-2">
                    {group.items.map((item) => (
                      <label
                        key={`${characterId}:${group.field}:${item.id}`}
                        className="flex cursor-pointer items-start gap-2 rounded-lg border border-white/10 bg-black/25 px-3 py-2"
                      >
                        <input
                          type="checkbox"
                          checked={group.selected.includes(item.id)}
                          onChange={() => onToggleExclusion(group.field, item.id)}
                          className="mt-0.5 h-4 w-4 accent-[var(--gold-ornament)]"
                        />
                        <span className="min-w-0">
                          <span className="block text-xs text-[var(--ink)]">
                            {item.title}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-[var(--ink-dim)]">
                            {group.getSecondary(item)}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      ) : null}

      <div className="rounded-lg border border-white/10 bg-black/20 p-3">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
          Knowledge availability
        </p>
        <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
          Optionally limit when this Character may receive this Lore as evidence. Story time comes from the active Time/Calendar runtime.
        </p>
        <label className="mt-3 block text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
          Availability window
          <select
            value={access.availabilityMode || "ALWAYS"}
            onChange={(event) => onAvailabilityModeChange(event.target.value)}
            className="mt-2 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-sm normal-case tracking-normal text-[var(--ink)]"
          >
            {availabilityModeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        {(["FROM", "BETWEEN"].includes(access.availabilityMode || "ALWAYS")) ? (
          <div className="mt-3">
            <KnowledgeTimePointFields
              label="Available from"
              value={access.knowledgeAvailableFrom}
              onChange={(field, value) =>
                onKnowledgeTimeFieldChange("knowledgeAvailableFrom", field, value)
              }
            />
          </div>
        ) : null}
        {(["UNTIL", "BETWEEN"].includes(access.availabilityMode || "ALWAYS")) ? (
          <div className="mt-3">
            <KnowledgeTimePointFields
              label="Available until"
              value={access.knowledgeAvailableUntil}
              onChange={(field, value) =>
                onKnowledgeTimeFieldChange("knowledgeAvailableUntil", field, value)
              }
            />
          </div>
        ) : null}
        <p className="mt-3 text-[11px] leading-5 text-[var(--ink-dim)]">
          Minute-of-day is validated against the active calendar when Story time is available. Timed bindings fail closed when Story time is unavailable, invalid, or outside the authored window.
        </p>
      </div>

      <div className="rounded-lg border border-white/10 bg-black/20 p-3">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--ink-dim)]">
          Story context
        </p>
        <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">
          Leave both lists empty for any Story context. Selecting Scenarios or Room Templates creates an allowlist. If both lists are used, both must match the active room.
        </p>
        {storyContextLoadStatus === "ERROR" ? (
          <p className="mt-3 text-xs text-amber-100">{storyContextLoadMessage}</p>
        ) : null}
        {storyContextLoadStatus === "LOADING" ? (
          <p className="mt-3 text-xs text-[var(--ink-dim)]">Loading Story context options…</p>
        ) : null}
        {availableScenarios.length ? (
          <div className="mt-3">
            <p className="text-xs text-[var(--ink)]">Allowed Scenarios</p>
            <div className="mt-2 grid gap-2">
              {availableScenarios.map((item) => (
                <label
                  key={`${characterId}:scenario:${item.id}`}
                  className="flex cursor-pointer items-start gap-2 rounded-lg border border-white/10 bg-black/25 px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={(access.allowedScenarioIds || []).includes(item.id)}
                    onChange={() => onToggleContextAllowlist("allowedScenarioIds", item.id)}
                    className="mt-0.5 h-4 w-4 accent-[var(--gold-ornament)]"
                  />
                  <span className="min-w-0">
                    <span className="block text-xs text-[var(--ink)]">{item.title}</span>
                    <span className="mt-0.5 block text-[11px] text-[var(--ink-dim)]">
                      Scenario{item.status ? ` · ${item.status}` : ""}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        ) : null}
        {availableRoomTemplates.length ? (
          <div className="mt-3">
            <p className="text-xs text-[var(--ink)]">Allowed Room Templates</p>
            <div className="mt-2 grid gap-2">
              {availableRoomTemplates.map((item) => (
                <label
                  key={`${characterId}:room-template:${item.id}`}
                  className="flex cursor-pointer items-start gap-2 rounded-lg border border-white/10 bg-black/25 px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={(access.allowedRoomTemplateIds || []).includes(item.id)}
                    onChange={() =>
                      onToggleContextAllowlist("allowedRoomTemplateIds", item.id)
                    }
                    className="mt-0.5 h-4 w-4 accent-[var(--gold-ornament)]"
                  />
                  <span className="min-w-0">
                    <span className="block text-xs text-[var(--ink)]">{item.title}</span>
                    <span className="mt-0.5 block text-[11px] text-[var(--ink-dim)]">
                      Room Template{item.status ? ` · ${item.status}` : ""}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        ) : null}
        {storyContextLoadStatus === "READY" &&
        !availableScenarios.length &&
        !availableRoomTemplates.length ? (
          <p className="mt-3 text-xs text-[var(--ink-dim)]">
            No owned Scenarios or Room Templates are available. This binding will remain valid in any Story context.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function SubmissionHistory({ submissions }) {
  if (!submissions.length) return null;

  return (
    <div className="mt-5 border-t border-white/10 pt-5">
      <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
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
  characterAccess = {},
  knowledgeModeOptions = [],
  availabilityModeOptions = [],
  characterScopeOptions = [],
  availableChapters = [],
  availableSections = [],
  availableBlocks = [],
  includedSections = [],
  characterRefs = [],
  locationRefs = [],
  storyContextOptions = { scenarios: [], roomTemplates: [] },
  storyContextLoadStatus = "IDLE",
  storyContextLoadMessage = "",
  canSubmit = false,
  canCancel = false,
  canWithdraw = false,
  setScopeMode,
  toggleSection,
  toggleCharacter,
  toggleLocation,
  setCharacterKnowledgeMode,
  setCharacterScopeType,
  setCharacterScopeChapter,
  setCharacterScopeSection,
  toggleCharacterExclusion,
  setCharacterAvailabilityMode,
  setCharacterKnowledgeTimeField,
  toggleCharacterContextAllowlist,
  submit,
  cancel,
  withdraw,
  refresh,
}) {
  const hasPublicRelease = Boolean(source.publicReleaseId);
  const isWorking = actionStatus === "WORKING";
  const hasAuthoritativeConfiguration = ["READY", "ACTIVE"].includes(
    String(latestStatus || "").trim().toUpperCase()
  );

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

          {hasAuthoritativeConfiguration ? (
            <ActiveEngineConfiguration latest={latest} source={source} />
          ) : null}

          {!isActive && !hasAuthoritativeConfiguration ? (
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
                          <CharacterAccessControls
                            characterId={refItem.id}
                            knowledgeMode={knowledgeModes[refItem.id] || "SECONDHAND"}
                            knowledgeModeOptions={knowledgeModeOptions}
                            availabilityModeOptions={availabilityModeOptions}
                            access={characterAccess[refItem.id] || {}}
                            characterScopeOptions={characterScopeOptions}
                            availableChapters={availableChapters}
                            includedSections={includedSections}
                            availableBlocks={availableBlocks}
                            availableScenarios={storyContextOptions.scenarios || []}
                            availableRoomTemplates={storyContextOptions.roomTemplates || []}
                            storyContextLoadStatus={storyContextLoadStatus}
                            storyContextLoadMessage={storyContextLoadMessage}
                            onKnowledgeModeChange={(mode) =>
                              setCharacterKnowledgeMode(refItem.id, mode)
                            }
                            onScopeTypeChange={(scopeType) =>
                              setCharacterScopeType(refItem.id, scopeType)
                            }
                            onChapterChange={(chapterId) =>
                              setCharacterScopeChapter(refItem.id, chapterId)
                            }
                            onSectionChange={(sectionId) =>
                              setCharacterScopeSection(refItem.id, sectionId)
                            }
                            onToggleExclusion={(field, id) =>
                              toggleCharacterExclusion(refItem.id, field, id)
                            }
                            onAvailabilityModeChange={(mode) =>
                              setCharacterAvailabilityMode(refItem.id, mode)
                            }
                            onKnowledgeTimeFieldChange={(boundary, field, value) =>
                              setCharacterKnowledgeTimeField(
                                refItem.id,
                                boundary,
                                field,
                                value
                              )
                            }
                            onToggleContextAllowlist={(field, id) =>
                              toggleCharacterContextAllowlist(refItem.id, field, id)
                            }
                          />
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
                ) : !canSubmit ? (
                  <p className="text-xs text-amber-100">
                    Complete the knowledge scope for each selected Character.
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
