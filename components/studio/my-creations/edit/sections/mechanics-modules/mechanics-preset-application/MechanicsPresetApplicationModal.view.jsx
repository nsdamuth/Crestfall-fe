"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Beaker,
  Check,
  ChevronDown,
  Folder,
  FolderOpen,
  LibraryBig,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

const PRESET_FOLDER_DEFINITIONS = Object.freeze([
  {
    id: "MODULE",
    label: "Module Starters",
    description: "Complete Mechanics Module configurations.",
  },
  {
    id: "COMMAND",
    label: "Command Starters",
    description: "Complete reusable command configurations.",
  },
  {
    id: "COMMAND_RESOLUTION",
    label: "Resolution References",
    description: "Replace only a command's resolution block.",
  },
  {
    id: "COMMAND_COMPOSITION",
    label: "Composition References",
    description: "Replace only a command's composition block.",
  },
]);

function IssueList({ title, issues = [], tone = "error" }) {
  if (!issues.length) return null;

  const className =
    tone === "warning"
      ? "border-amber-300/20 bg-amber-500/10 text-amber-100"
      : "border-[var(--status-danger-border)] bg-[var(--status-danger-bed)] text-[var(--status-danger)]";

  return (
    <section className={`rounded-[var(--radius-md)] border p-[var(--space-4)] ${className}`}>
      <p className="text-[length:var(--text-label)] uppercase tracking-[var(--track-label)]">{title}</p>
      <div className="mt-3 grid gap-2">
        {issues.map((issue, index) => (
          <div
            key={`${issue?.path || "issue"}-${index}`}
            className="rounded-[var(--radius-sm)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] py-[var(--space-2)]"
          >
            <code className="break-all text-[length:var(--text-label)] text-[var(--gold-ornament)]">
              {issue?.path || "$"}
            </code>
            <p className="mt-1 text-xs leading-5">
              {issue?.message || "Unknown preset issue."}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CountGrid({ title, counts }) {
  if (!counts) return null;

  const rows = [
    ["Trackers", counts.trackerCount],
    ["Commands", counts.commandCount],
    ["Guards", counts.guardCount],
    ["Status Blocks", counts.statusBlockCount],
    ["Defaults", counts.defaultCount],
  ];

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-4)]">
      <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
        {title}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5 xl:grid-cols-2">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="rounded-[var(--radius-sm)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] py-[var(--space-2)]"
          >
            <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--ink-dim)]">
              {label}
            </p>
            <p className="mt-1 text-lg text-[var(--ink)]">{value ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PresetFolder({
  folder,
  selectedPresetId,
  queryActive = false,
  scopeFocused = false,
  onChoosePreset,
}) {
  const containsSelectedPreset = folder.cards.some(
    (preset) => preset.id === selectedPresetId
  );
  const [expanded, setExpanded] = useState(
    queryActive || scopeFocused || containsSelectedPreset
  );

  useEffect(() => {
    if (queryActive || scopeFocused || containsSelectedPreset) {
      setExpanded(true);
    }
  }, [queryActive, scopeFocused, containsSelectedPreset]);

  const FolderIcon = expanded ? FolderOpen : Folder;

  return (
    <section className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)]">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition hover:bg-white/[0.025]"
      >
        <span className="flex min-w-0 items-center gap-3">
          <FolderIcon
            size={16}
            className="shrink-0 text-[var(--gold-ornament)]"
          />
          <span className="min-w-0">
            <span className="block truncate text-sm text-[var(--ink)]">
              {folder.label}
            </span>
            <span className="mt-0.5 block truncate text-[10px] text-[var(--ink-dim)]">
              {folder.description}
            </span>
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-2">
          <span className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[10px] text-[var(--ink-dim)]">
            {folder.cards.length}
          </span>
          <ChevronDown
            size={15}
            className={`text-[var(--gold-ornament)] transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {expanded ? (
        <div className="grid gap-2 border-t border-white/10 p-2">
          {folder.cards.map((preset) => {
            const selected = preset.id === selectedPresetId;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onChoosePreset?.(preset.id)}
                className={`rounded-[var(--radius-sm)] border px-3 py-2.5 text-left transition ${
                  selected
                    ? "border-[var(--gold-action)] bg-[var(--surface-1)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                    : "border-[var(--line-whisper)] bg-[var(--surface-1)] hover:border-[var(--line)]"
                } ${preset.available ? "" : "opacity-70"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-[var(--ink)]">
                      {preset.label}
                    </p>
                    <p className="mt-1 truncate text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
                      {preset.eyebrow}
                    </p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1.5">
                    {preset.validationLabel ? (
                      <Beaker
                        size={12}
                        className="mt-0.5 text-[var(--status-success)]"
                        aria-label={preset.validationLabel}
                      />
                    ) : null}
                    {!preset.available ? (
                      <AlertTriangle
                        size={13}
                        className="mt-0.5 text-amber-200"
                      />
                    ) : null}
                  </span>
                </div>

                <p className="mt-1.5 truncate text-[length:var(--text-label)] text-[var(--ink-dim)]">
                  {preset.available
                    ? preset.summary
                    : preset.unavailableReason || preset.summary}
                </p>
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}


function PresetLibraryModalFrame({ children, onClose }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[var(--scrim-strong)] p-2 backdrop-blur-[2px] sm:p-4"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="mechanics-preset-library-title"
        className="grid min-h-0 w-[min(96vw,72rem)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--surface-4)] shadow-[var(--shadow-modal)]"
        style={{
          height: "min(88dvh, 48rem)",
          maxHeight: "calc(100dvh - 1rem)",
          gridTemplateRows: "auto minmax(0, 1fr) auto",
        }}
      >
        {children}
      </section>

      <style jsx global>{`
        .crestfall-preset-library-scroll {
          scrollbar-width: auto !important;
          scrollbar-color: rgba(199, 164, 89, 0.8) rgba(255, 255, 255, 0.06) !important;
        }

        .crestfall-preset-library-scroll::-webkit-scrollbar {
          display: block !important;
          width: 12px !important;
          height: 12px !important;
        }

        .crestfall-preset-library-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05) !important;
          border-left: 1px solid rgba(255, 255, 255, 0.06);
        }

        .crestfall-preset-library-scroll::-webkit-scrollbar-thumb {
          min-height: 44px;
          border: 3px solid transparent;
          border-radius: 999px;
          background: rgba(199, 164, 89, 0.72) !important;
          background-clip: padding-box !important;
        }

        .crestfall-preset-library-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(199, 164, 89, 0.95) !important;
          background-clip: padding-box !important;
        }
      `}</style>
    </div>
  );
}

export default function MechanicsPresetApplicationModalView({
  title = "Mechanics Preset Library",
  description = "",
  query = "",
  scopeFilter = "ALL",
  scopeOptions = [],
  presetCards = [],
  selectedPresetId = "",
  selectedPreset = null,
  commandTargets = [],
  selectedCommandId = "",
  requiresCommandTarget = false,
  applyModeOptions = [],
  selectedApplyMode = "",
  preview = null,
  errors = [],
  warnings = [],
  confirmationRequired = false,
  replacementConfirmed = false,
  canApply = false,
  statusMessage = "",
  onClose = null,
  onChangeQuery = null,
  onChooseScope = null,
  onChoosePreset = null,
  onChooseCommand = null,
  onChooseApplyMode = null,
  onToggleReplacementConfirmation = null,
  onApplyPreset = null,
}) {
  const presetFolders = useMemo(
    () =>
      PRESET_FOLDER_DEFINITIONS.map((definition) => ({
        ...definition,
        cards: presetCards.filter((preset) => preset.scope === definition.id),
      })).filter((folder) => folder.cards.length > 0),
    [presetCards]
  );
  const queryActive = Boolean(String(query || "").trim());

  return (
    <PresetLibraryModalFrame onClose={onClose}>
      <div className="flex shrink-0 items-start justify-between gap-[var(--space-3)] border-b border-[var(--line-whisper)] px-[var(--space-4)] py-[var(--space-3)]">
        <div>
          <p className="inline-flex items-center gap-2 text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
            <LibraryBig size={15} />
            Loom Preset Workflow
          </p>
          <h2
            id="mechanics-preset-library-title"
            className="mt-[var(--space-2)] font-display text-[length:var(--text-title)] leading-[var(--lh-title)] font-medium tracking-[var(--track-tight)]"
          >
            {title}
          </h2>
          <p className="mt-[var(--space-2)] max-w-3xl text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onClose?.()}
          className="flex h-[var(--control-md)] w-[var(--control-md)] flex-shrink-0 items-center justify-center rounded-[var(--radius-full)] border border-[var(--line-whisper)] bg-[var(--surface-2)] text-[var(--ink-dim)] transition hover:border-[var(--line)] hover:text-[var(--gold-action)]"
          aria-label="Close Mechanics Preset Library"
        >
          <X size={18} />
        </button>
      </div>

      <div
        className="crestfall-preset-library-scroll min-h-0 overflow-y-scroll overscroll-contain"
        style={{
          minHeight: 0,
          overflowY: "scroll",
          overscrollBehavior: "contain",
          scrollbarGutter: "stable",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="grid min-w-0 gap-4 p-4 md:grid-cols-[18rem_minmax(0,1fr)] md:items-start">
          <aside className="min-w-0">
            <label className="block">
              <span className="block text-xs text-[var(--ink)]">
                Search presets
              </span>
              <span className="mt-1 flex min-h-[var(--control-md)] min-w-0 items-center gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] transition focus-within:border-[var(--gold-action)]">
                <Search
                  size={15}
                  aria-hidden="true"
                  className="shrink-0 text-[var(--ink-dim)]"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => onChangeQuery?.(event.target.value)}
                  placeholder="Search presets..."
                  className="min-w-0 flex-1 !border-0 !bg-transparent !p-0 text-[length:var(--text-ui)] text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)] focus:!border-0 focus:!outline-none focus:!ring-0"
                  style={{
                    minWidth: 0,
                    margin: 0,
                    padding: 0,
                    border: 0,
                    background: "transparent",
                    boxShadow: "none",
                  }}
                />
              </span>
            </label>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {scopeOptions.map((option) => {
              const active = option.id === scopeFilter;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onChooseScope?.(option.id)}
                  className={`min-h-[var(--control-sm)] rounded-[var(--radius-md)] border px-[var(--space-4)] text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] transition ${
                    active
                      ? "border-[var(--gold-action)] text-[var(--gold-bright)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                      : "border-[var(--line-whisper)] bg-[var(--surface-1)] text-[var(--ink-dim)] hover:border-[var(--line)] hover:text-[var(--ink)]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid gap-2">
            {presetFolders.map((folder) => (
              <PresetFolder
                key={folder.id}
                folder={folder}
                selectedPresetId={selectedPresetId}
                queryActive={queryActive}
                scopeFocused={scopeFilter === folder.id}
                onChoosePreset={onChoosePreset}
              />
            ))}

            {!presetFolders.length ? (
              <p className="rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-[var(--ink-dim)]">
                No presets match the current filter.
              </p>
            ) : null}
          </div>
          </aside>

          <main className="min-w-0">
          {selectedPreset ? (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
              <section className="min-w-0 space-y-4">
                <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-2)] p-[var(--space-4)]">
                  <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
                    {selectedPreset.eyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-3xl">
                    {selectedPreset.label}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--ink-dim)]">
                    {selectedPreset.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedPreset.badges.map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex h-[var(--space-6)] items-center rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] font-medium uppercase tracking-[var(--track-label)] text-[var(--gold-bright)]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {selectedPreset.liveValidation ? (
                    <div className="mt-4 rounded-xl border border-[var(--status-success-border)] bg-[var(--status-success-bed)] p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--status-success)]">
                            <Beaker size={14} />
                            {selectedPreset.liveValidation.statusLabel}
                          </p>
                          {selectedPreset.liveValidation.runtimeImplementationId ? (
                            <code className="mt-2 block break-all text-[11px] text-[var(--ink-dim)]">
                              {selectedPreset.liveValidation.runtimeImplementationId}
                            </code>
                          ) : null}
                        </div>
                        {selectedPreset.liveValidation.expectedOutcome ? (
                          <span className="inline-flex h-[var(--space-6)] items-center rounded-[var(--radius-full)] bg-[var(--tag-bed-canvas)] px-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] font-medium uppercase tracking-[var(--track-label)] text-[var(--ink-dim)]">
                            Expected {selectedPreset.liveValidation.expectedOutcome.replaceAll("_", " ")}
                          </span>
                        ) : null}
                      </div>

                      {selectedPreset.liveValidation.testCommand ? (
                        <div className="mt-3 rounded-lg border border-white/10 bg-black/25 px-3 py-2">
                          <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
                            Reference Test Command
                          </p>
                          <code className="mt-1 block break-all text-xs text-[var(--ink)]">
                            {selectedPreset.liveValidation.testCommand}
                          </code>
                        </div>
                      ) : null}

                      <p className="mt-3 text-[11px] leading-5 text-[var(--ink-dim)]">
                        Applying this preset stages a bounded live-validation guide in the Mechanics builder. The normal page Save action still controls persistence.
                      </p>
                    </div>
                  ) : null}
                </div>

                {requiresCommandTarget ? (
                  <label className="block rounded-xl border border-white/10 bg-black/25 p-4">
                    <span className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
                      Target Command
                    </span>
                    <select
                      value={selectedCommandId}
                      onChange={(event) => onChooseCommand?.(event.target.value)}
                      className="mt-3 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--gold-ornament)]/50"
                    >
                      <option value="">Select a command</option>
                      {commandTargets.map((command) => (
                        <option key={command.id} value={command.id}>
                          {command.label} · {command.invocationLabel}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}

                <section className="rounded-xl border border-white/10 bg-black/25 p-4">
                  <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
                    Application Mode
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {applyModeOptions.map((option) => (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                          option.id === selectedApplyMode
                            ? "border-[var(--gold-action)] bg-[var(--surface-1)] shadow-[inset_0_0_0_1px_var(--gold-action)]"
                            : "border-[var(--line-whisper)] bg-[var(--surface-1)]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="mechanics-preset-apply-mode"
                          value={option.id}
                          checked={option.id === selectedApplyMode}
                          onChange={() => onChooseApplyMode?.(option.id)}
                          className="mt-0.5 h-4 w-4 accent-[var(--gold-ornament)]"
                        />
                        <span>
                          <span className="block text-xs uppercase tracking-[0.14em] text-[var(--ink)]">
                            {option.label}
                          </span>
                          <span className="mt-1 block text-[11px] leading-5 text-[var(--ink-dim)]">
                            {option.id === "MERGE_MODULE"
                              ? "Append the preset module only when IDs and invocations do not conflict."
                              : option.id === "MERGE_COMMAND"
                                ? "Keep the selected command identity while replacing its operational preset blocks."
                                : "Replace only the preset’s declared boundary."}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-2">
                  <CountGrid title="Current Module" counts={preview?.currentCounts} />
                  <CountGrid title="After Apply" counts={preview?.nextCounts} />
                </div>

                {confirmationRequired ? (
                  <label className="flex items-start gap-3 rounded-xl border border-amber-300/20 bg-amber-500/10 p-4 text-amber-100">
                    <input
                      type="checkbox"
                      checked={replacementConfirmed}
                      onChange={(event) =>
                        onToggleReplacementConfirmation?.(event.target.checked)
                      }
                      className="mt-0.5 h-4 w-4 accent-[var(--gold-ornament)]"
                    />
                    <span>
                      <span className="block text-xs uppercase tracking-[0.16em]">
                        Confirm Replacement Boundary
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[var(--ink-dim)]">
                        I understand that this mode replaces the selected command or the complete authored Mechanics Module data.
                      </span>
                    </span>
                  </label>
                ) : null}
              </section>

              <aside className="grid content-start gap-4">
                <section className="rounded-xl border border-white/10 bg-black/25 p-4">
                  <p className="inline-flex items-center gap-2 text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
                    <ShieldCheck size={14} />
                    Atomic Compliance
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
                    Presets are applied to a copy, checked through the Mechanics JSON compliance validator, and only then replace the open builder state.
                  </p>
                </section>

                {selectedPreset.replacementPaths.length ? (
                  <section className="rounded-xl border border-white/10 bg-black/25 p-4">
                    <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
                      Declared Boundary
                    </p>
                    <div className="mt-3 grid gap-2">
                      {selectedPreset.replacementPaths.map((path) => (
                        <code
                          key={path}
                          className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-[11px] text-[var(--ink)]"
                        >
                          {path}
                        </code>
                      ))}
                    </div>
                  </section>
                ) : null}

                <IssueList
                  title={`${errors.length} ${errors.length === 1 ? "Error" : "Errors"}`}
                  issues={errors}
                />
                <IssueList
                  title={`${warnings.length} ${warnings.length === 1 ? "Warning" : "Warnings"}`}
                  issues={warnings}
                  tone="warning"
                />

                {preview?.valid && !errors.length ? (
                  <section className="rounded-xl border border-[var(--status-success-border)] bg-[var(--status-success-bed)] p-4 text-[var(--status-success)]">
                    <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em]">
                      <Check size={14} />
                      Preview Valid
                    </p>
                    <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
                      The proposed result passed structural compliance checks.
                    </p>
                  </section>
                ) : null}

                {statusMessage ? (
                  <section className="rounded-xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs leading-5 text-[var(--ink-dim)]">
                      {statusMessage}
                    </p>
                  </section>
                ) : null}
              </aside>
            </div>
          ) : (
            <div className="flex min-h-[20rem] items-center justify-center rounded-[var(--radius-md)] border border-dashed border-white/10 bg-black/15 p-8 text-center">
              <div>
                <AlertTriangle
                  size={24}
                  className="mx-auto text-[var(--gold-ornament)]"
                />
                <h3 className="mt-3 font-display text-3xl">Choose a Preset</h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--ink-dim)]">
                  Open a preset folder, then select a preset to inspect its boundary, target, application mode, and compliance preview.
                </p>
              </div>
            </div>
          )}
          </main>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-white/10 p-4">
        <p className="text-xs leading-5 text-[var(--ink-dim)]">
          Applying updates the current builder only. Use the normal page Save action to persist the result.
        </p>
        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => onClose?.()}
            className="inline-flex h-[var(--control-md)] items-center justify-center rounded-[var(--radius-md)] border border-[var(--line-strong)] px-[var(--space-6)] text-[length:var(--text-cta)] leading-[var(--lh-cta)] font-bold text-[var(--gold-action)] transition hover:shadow-[var(--glow-hover)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset?.()}
            disabled={!canApply}
            className="inline-flex h-[var(--control-md)] items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] bg-[var(--gold-action)] bg-[image:var(--grad-gold)] px-[var(--space-6)] text-[length:var(--text-cta)] leading-[var(--lh-cta)] font-bold text-[var(--tag-fill-ink)] transition hover:shadow-[var(--glow-hover)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Check size={14} />
            Apply Preset
          </button>
        </div>
      </div>

    </PresetLibraryModalFrame>
  );
}
