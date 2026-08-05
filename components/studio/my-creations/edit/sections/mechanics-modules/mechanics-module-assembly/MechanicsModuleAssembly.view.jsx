"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronsDown, ChevronsUp, Plus, Trash2 } from "lucide-react";

function MechanicsTextField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
      />
    </label>
  );
}

function MechanicsAssemblyActionButton({ children, onClick, title, disabled = false }) {
  return (
    <button
      type="button"
      title={title}
      onClick={() => onClick?.()}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function MechanicsRuntimeFoldSection({
  id,
  eyebrow,
  title,
  summary,
  badge,
  expanded,
  onToggle,
  children,
}) {
  return (
    <section
      id={id}
      data-mechanics-runtime-section={id}
      className="scroll-mt-28 overflow-hidden rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/20"
    >
      <button
        type="button"
        onClick={() => onToggle?.()}
        aria-expanded={expanded}
        aria-controls={`${id}-content`}
        className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left transition hover:bg-white/[0.025]"
      >
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            {eyebrow}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h3 className="font-display text-3xl text-[var(--foreground)]">{title}</h3>
            {badge ? (
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                {badge}
              </span>
            ) : null}
          </div>
          {summary ? (
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{summary}</p>
          ) : null}
        </div>
        <ChevronDown
          size={20}
          className={`mt-1 shrink-0 text-[var(--muted-gold)] transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>
      {expanded ? (
        <div
          id={`${id}-content`}
          className="border-t border-white/10 p-5 [&>section]:border-0 [&>section]:bg-transparent [&>section]:p-0 [&>section>div:first-child>div:first-child]:hidden [&>section>div:first-child]:justify-end"
        >
          {children}
        </div>
      ) : null}
    </section>
  );
}

export function MechanicsFoldableItemShell({
  eyebrow,
  title,
  summary,
  defaultExpanded = false,
  foldSignal,
  onRemove,
  removeTitle,
  children,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  useEffect(() => {
    if (!foldSignal?.revision) return;
    setExpanded(foldSignal.expanded === true);
  }, [foldSignal?.revision, foldSignal?.expanded]);

  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-white/10 bg-black/25">
      <div className="flex items-start justify-between gap-3 px-5 py-4">
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          className="min-w-0 flex-1 text-left"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
            {eyebrow}
          </p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="truncate text-xl text-[var(--foreground)]">{title}</h4>
              {summary ? (
                <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{summary}</p>
              ) : null}
            </div>
            <ChevronDown
              size={18}
              className={`mt-1 shrink-0 text-[var(--muted-gold)] transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>
        {onRemove ? (
          <button
            type="button"
            onClick={() => onRemove?.()}
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-white/10 bg-transparent px-3 py-2 text-[var(--status-danger)] transition hover:border-[var(--status-danger)]"
            title={removeTitle || `Remove ${title}`}
          >
            <Trash2 size={13} />
            Remove
          </button>
        ) : null}
      </div>
      {expanded ? (
        <div className="border-t border-white/10 p-5 [&>article]:rounded-none [&>article]:border-0 [&>article]:bg-transparent [&>article]:p-0 [&>article>div:first-child]:hidden">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function MechanicsCommandsAssemblyView({
  commands = [],
  foldSignal = null,
  onAddCommand = null,
  onRemoveCommand = null,
  getCommandKey = null,
  getCommandTitle = null,
  getCommandSummary = null,
  renderCommand = null,
}) {
  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--muted-gold)]/20 bg-black/20 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            Visual Builder
          </p>
          <h3 className="mt-2 font-display text-3xl">Commands</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Define slash commands and deterministic effects without editing raw JSON.
            These save into instanceData.commands.
          </p>
        </div>
        <MechanicsAssemblyActionButton onClick={onAddCommand}>
          <Plus size={14} />
          Add Command
        </MechanicsAssemblyActionButton>
      </div>

      {commands.length ? (
        <div className="mt-6 grid gap-4">
          {commands.map((command, commandIndex) => (
            <MechanicsFoldableItemShell
              key={getCommandKey?.(command, commandIndex) || commandIndex}
              eyebrow="Command"
              title={
                getCommandTitle?.(command, commandIndex) ||
                `Command ${commandIndex + 1}`
              }
              summary={getCommandSummary?.(command, commandIndex) || ""}
              defaultExpanded={commandIndex === 0}
              foldSignal={foldSignal}
              onRemove={() => onRemoveCommand?.(commandIndex)}
              removeTitle="Remove command"
            >
              {renderCommand?.(command, commandIndex)}
            </MechanicsFoldableItemShell>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-[var(--muted)]">
          No commands defined yet. Add a command such as{" "}
          <span className="text-[var(--foreground)]">/settled</span>,{" "}
          <span className="text-[var(--foreground)]">/warn boundary</span>, or{" "}
          <span className="text-[var(--foreground)]">/reset warnings</span>.
        </div>
      )}
    </section>
  );
}

export default function MechanicsModuleAssemblyView({
  sectionIds = {},
  expandedSections = {},
  moduleDefinitionId = "",
  moduleDefinitionFallback = "core.trackers.v1",
  contractVersion = "",
  priority = "65",
  tagsText = "",
  trackerBadge = "0 trackers",
  trackerSummary = "",
  commandBadge = "0 commands",
  commandSummary = "",
  defaultsBadge = "0 entries",
  statusBlocksBadge = "0 blocks",
  guardsBadge = "0 guards",
  documentControls = null,
  documentSurfaces = null,
  trackersContent = null,
  commandsContent = null,
  defaultsContent = null,
  statusBlocksContent = null,
  guardsContent = null,
  onToggleSection = null,
  onCollapseAll = null,
  onExpandAll = null,
  onChangeModuleDefinitionId = null,
  onChangePriority = null,
  onChangeTags = null,
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
            Mechanics Module
          </p>
          <h3 className="mt-2 font-display text-3xl">Runtime Fields</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
            Define reusable tracker fields, guard rules, status blocks, and command
            mappings for the core tracker runtime. Live values remain room/session state.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {documentControls}
          <MechanicsAssemblyActionButton
            title="Collapse all Runtime Fields sections and cards"
            onClick={onCollapseAll}
          >
            <ChevronsUp size={14} />
            Collapse All
          </MechanicsAssemblyActionButton>
          <MechanicsAssemblyActionButton
            title="Expand all Runtime Fields sections and cards"
            onClick={onExpandAll}
          >
            <ChevronsDown size={14} />
            Expand All
          </MechanicsAssemblyActionButton>
        </div>
      </div>

      {documentSurfaces}

      <MechanicsRuntimeFoldSection
        id={sectionIds.overview}
        eyebrow="Runtime Fields"
        title="Overview"
        summary="Module identity, priority, tags, and saved contract version."
        expanded={expandedSections.overview}
        onToggle={() => onToggleSection?.("overview")}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <MechanicsTextField
            label="Module Definition ID"
            value={moduleDefinitionId || moduleDefinitionFallback}
            onChange={onChangeModuleDefinitionId}
            placeholder={moduleDefinitionFallback}
          />
          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
              Contract Version
            </span>
            <input
              value={contractVersion}
              readOnly
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--muted)] outline-none"
            />
          </label>
          <MechanicsTextField
            label="Priority"
            value={priority}
            onChange={onChangePriority}
            placeholder="65"
          />
          <MechanicsTextField
            label="Tags"
            value={tagsText}
            onChange={onChangeTags}
            placeholder="relationship, boundary, access"
          />
        </div>
      </MechanicsRuntimeFoldSection>

      <MechanicsRuntimeFoldSection
        id={sectionIds.trackers}
        eyebrow="Visual Builder"
        title="Trackers / Meters"
        badge={trackerBadge}
        summary={trackerSummary || "Reusable meter fields, display phases, and mutation hints."}
        expanded={expandedSections.trackers}
        onToggle={() => onToggleSection?.("trackers")}
      >
        {trackersContent}
      </MechanicsRuntimeFoldSection>

      <MechanicsRuntimeFoldSection
        id={sectionIds.commands}
        eyebrow="Visual Builder"
        title="Commands"
        badge={commandBadge}
        summary={commandSummary || "Slash commands, typed arguments, resolution, outcomes, and effects."}
        expanded={expandedSections.commands}
        onToggle={() => onToggleSection?.("commands")}
      >
        {commandsContent}
      </MechanicsRuntimeFoldSection>

      <MechanicsRuntimeFoldSection
        id={sectionIds.defaults}
        eyebrow="Visual Builder"
        title="Defaults"
        badge={defaultsBadge}
        summary="Initial flag, counter, and stage values used before live state exists."
        expanded={expandedSections.defaults}
        onToggle={() => onToggleSection?.("defaults")}
      >
        {defaultsContent}
      </MechanicsRuntimeFoldSection>

      <MechanicsRuntimeFoldSection
        id={sectionIds.statusBlocks}
        eyebrow="Visual Builder"
        title="Status Blocks"
        badge={statusBlocksBadge}
        summary="Deterministic public or private status lines appended outside the LLM."
        expanded={expandedSections.statusBlocks}
        onToggle={() => onToggleSection?.("statusBlocks")}
      >
        {statusBlocksContent}
      </MechanicsRuntimeFoldSection>

      <MechanicsRuntimeFoldSection
        id={sectionIds.guards}
        eyebrow="Visual Builder"
        title="Guards"
        badge={guardsBadge}
        summary="Hard locks, soft locks, and guidance conditions."
        expanded={expandedSections.guards}
        onToggle={() => onToggleSection?.("guards")}
      >
        {guardsContent}
      </MechanicsRuntimeFoldSection>

      <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4 text-sm leading-6 text-[var(--muted)]">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">Save Shape</p>
        <p className="mt-3">
          Saves into <span className="text-[var(--foreground)]">creation.data.instanceData</span>.
          The runtime resolver can later hydrate this as a reusable
          <span className="text-[var(--foreground)]"> core.trackers.v1 </span>
          module binding.
        </p>
      </div>
    </div>
  );
}
