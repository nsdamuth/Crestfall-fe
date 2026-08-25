"use client";

import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BookOpenText,
  Braces,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Eraser,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import RulesCodexJsonEditorModal from "../rules-codex-json-editor/RulesCodexJsonEditorModal";
import { TextAreaField } from "@/components/studio/my-creations/edit/sections/SharedFields";

function Counter({ value = 0, limit = 0 }) {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;
  const safeLimit = Number.isFinite(Number(limit)) ? Number(limit) : 0;
  const nearLimit = safeLimit > 0 && safeValue >= safeLimit * 0.9;

  return (
    <span className={nearLimit ? "text-amber-200" : "text-[var(--ink-dim)]"}>
      {safeValue.toLocaleString()} / {safeLimit.toLocaleString()}
    </span>
  );
}

function IssueList({ issues = [] }) {
  const safeIssues = Array.isArray(issues) ? issues : [];

  if (!safeIssues.length) return null;

  return (
    <div className="space-y-2">
      {safeIssues.map((issue, index) => {
        const warning = issue.severity === "WARNING";

        return (
          <div
            key={`${issue.code || "issue"}-${index}`}
            className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-xs leading-5 ${
              warning
                ? "border-amber-300/25 bg-amber-300/10 text-amber-100"
                : "border-red-300/25 bg-red-300/10 text-red-100"
            }`}
          >
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <span>{issue.message}</span>
          </div>
        );
      })}
    </div>
  );
}

function FieldLabel({ children, detail = "" }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <label className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
        {children}
      </label>
      {detail ? (
        <span className="text-[11px] text-[var(--ink-dim)]">{detail}</span>
      ) : null}
    </div>
  );
}

function TextInput({ value = "", onChange, placeholder = "", ...props }) {
  return (
    <input
      {...props}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
    />
  );
}

function NumberInput({ value, onChange, min, max, step = 1 }) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={onChange}
      className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]/50"
    />
  );
}

function SelectInput({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b0907] px-4 py-3 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]/50"
    >
      {children}
    </select>
  );
}

export default function RulesCodexEditorView({
  codex = {},
  enabled = true,
  summary = "",
  summaryCharacterCount = 0,
  summaryCharacterLimit = 0,
  maxSelectedSections = 8,
  maxContextCharacters = 12000,
  maxSelectedSectionsLimit = 24,
  maxContextCharactersLimit = 32000,
  sections = [],
  totalBodyCharacters = 0,
  totalBodyCharacterLimit = 0,
  sectionCount = 0,
  sectionLimit = 0,
  globalIssues = [],
  knownDomains = [],
  knownScopeTypes = [],
  activationSignalFields = [],
  jsonEditorOpen = false,
  onOpenJsonEditor = null,
  onCloseJsonEditor = null,
  onApplyJsonCodex = null,
  onSetEnabled = null,
  onUpdateSummary = null,
  onUpdateSelectionPolicy = null,
  onAddSection = null,
  onRemoveSection = null,
  onMoveSection = null,
  onToggleSection = null,
  onUpdateSection = null,
  onUpdateActivationInput = null,
  onClearSection = null,
}) {
  const safeSections = Array.isArray(sections) ? sections : [];
  const safeSignalFields = Array.isArray(activationSignalFields)
    ? activationSignalFields
    : [];

  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-black/30 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-[var(--gold-ornament)]">
            <BookOpenText size={18} />
            <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
              Rules Codex · Interpretation Layer
            </p>
          </div>

          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            Rules & Interpretation
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--ink-dim)]">
            Explain what verified mechanics mean and when world-specific rules
            apply. Codex guidance cannot mutate state, overrule guards, replace
            registries, or take control of a Player Character.
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpenJsonEditor?.()}
            className="cf-btn cf-btn--secondary"
          >
            <Braces size={15} />
            JSON editor
          </button>

          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={() => onSetEnabled?.(!enabled)}
            className={`rounded-xl border px-4 py-3 text-xs uppercase tracking-[0.16em] transition ${
              enabled
                ? "border-[var(--gold-ornament)]/50 bg-[var(--gold-ornament)]/15 text-[var(--ink)]"
                : "border-white/10 bg-black/25 text-[var(--ink-dim)] hover:border-[var(--gold-ornament)]/30"
            }`}
          >
            {enabled ? "Codex Enabled" : "Enable Codex"}
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
            Authority
          </p>
          <p className="mt-2 text-sm text-[var(--ink)]">
            Interpretation only
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
            Sections
          </p>
          <p className="mt-2 text-sm text-[var(--ink)]">
            {sectionCount.toLocaleString()} / {sectionLimit.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
            Guidance budget
          </p>
          <p className="mt-2 text-sm">
            <Counter
              value={totalBodyCharacters}
              limit={totalBodyCharacterLimit}
            />
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-300/5 px-4 py-3 text-sm text-emerald-100">
        <div className="flex items-start gap-3">
          <ShieldCheck size={17} className="mt-0.5 shrink-0" />
          <p className="leading-6">
            Platform safety, Player Character agency, deterministic mechanics,
            guards, registries, and verified state always take precedence.
          </p>
        </div>
      </div>

      {globalIssues.length ? (
        <div className="mt-4">
          <IssueList issues={globalIssues} />
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <TextAreaField
            label="Codex Summary"
            value={summary}
            onChange={(value) => onUpdateSummary?.(value)}
            placeholder="Describe what this Codex governs, where it applies, and what it helps the engine interpret..."
            maxLength={summaryCharacterLimit}
          />
        </div>

        <aside className="rounded-xl border border-white/10 bg-black/25 p-4">
          <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
            Selection Budget
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
            These limits cap how much Codex guidance the context planner may
            select for one turn. They do not force sections to load.
          </p>

          <div className="mt-4">
            <FieldLabel detail={`Maximum ${maxSelectedSectionsLimit}`}>
              Sections per turn
            </FieldLabel>
            <NumberInput
              value={maxSelectedSections}
              min={1}
              max={maxSelectedSectionsLimit}
              onChange={(event) =>
                onUpdateSelectionPolicy?.(
                  "maxSelectedSections",
                  event.target.value
                )
              }
            />
          </div>

          <div className="mt-4">
            <FieldLabel detail={`Maximum ${maxContextCharactersLimit.toLocaleString()}`}>
              Context characters
            </FieldLabel>
            <NumberInput
              value={maxContextCharacters}
              min={1000}
              max={maxContextCharactersLimit}
              step={500}
              onChange={(event) =>
                onUpdateSelectionPolicy?.(
                  "maxContextCharacters",
                  event.target.value
                )
              }
            />
          </div>
        </aside>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
        <div>
          <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
            Rules Sections
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
            Keep each section focused so the router can retrieve only the rules
            needed for the current turn.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onAddSection?.()}
          disabled={sectionCount >= sectionLimit}
          className="cf-btn cf-btn--primary"
        >
          <Plus size={15} />
          Add section
        </button>
      </div>

      {enabled ? (
        <div className="mt-5 space-y-4">
          {safeSections.map((section, index) => {
            const ToggleIcon = section.expanded ? ChevronDown : ChevronRight;
            const contextual = section.activationMode === "CONTEXTUAL";
            const hasContent = Boolean(section.title || section.body);

            return (
              <article
                key={`${section.id || "section"}-${section.order}-${index}`}
                className="overflow-hidden rounded-xl border border-white/10 bg-black/25"
              >
                <div className="flex items-start gap-2 px-3 py-3 sm:px-4">
                  <button
                    type="button"
                    onClick={() => onToggleSection?.(section.id)}
                    className="flex min-w-0 flex-1 items-start gap-3 text-left"
                  >
                    <ToggleIcon
                      size={17}
                      className="mt-1 shrink-0 text-[var(--gold-ornament)]"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium text-[var(--ink)]">
                          {section.title || "Untitled rules section"}
                        </p>
                        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.13em] text-[var(--ink-dim)]">
                          {section.activationMode.replaceAll("_", " ")}
                        </span>
                        {!section.enabled ? (
                          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.13em] text-[var(--ink-dim)]">
                            Disabled
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 truncate text-xs text-[var(--ink-dim)]">
                        {section.id || "Identifier required"}
                      </p>
                    </div>
                  </button>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      aria-label="Move section up"
                      title="Move section up"
                      disabled={index === 0}
                      onClick={() => onMoveSection?.(section.id, "UP")}
                      className="rounded-lg border border-white/10 p-2 text-[var(--ink-dim)] transition hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label="Move section down"
                      title="Move section down"
                      disabled={index === safeSections.length - 1}
                      onClick={() => onMoveSection?.(section.id, "DOWN")}
                      className="rounded-lg border border-white/10 p-2 text-[var(--ink-dim)] transition hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label="Remove section"
                      title="Remove section"
                      onClick={() => onRemoveSection?.(section.id)}
                      className="cf-btn cf-btn--danger cf-btn--sm"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>

                {section.expanded ? (
                  <div className="border-t border-white/10 px-4 py-5">
                    <IssueList issues={section.issues} />

                    <div className={section.issues.length ? "mt-5" : ""}>
                      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.65fr)]">
                        <div>
                          <FieldLabel>Section Title</FieldLabel>
                          <TextInput
                            value={section.title}
                            onChange={(event) =>
                              onUpdateSection?.(
                                section.id,
                                "title",
                                event.target.value
                              )
                            }
                            placeholder="Skill Tier and Level Gates"
                          />
                        </div>

                        <div>
                          <FieldLabel detail="Stable routing key">
                            Identifier
                          </FieldLabel>
                          <TextInput
                            value={section.id}
                            onChange={(event) =>
                              onUpdateSection?.(
                                section.id,
                                "id",
                                event.target.value
                              )
                            }
                            placeholder="skills.tier-gates"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                          />
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <FieldLabel>Activation</FieldLabel>
                          <SelectInput
                            value={section.activationMode}
                            onChange={(event) =>
                              onUpdateSection?.(
                                section.id,
                                "activationMode",
                                event.target.value
                              )
                            }
                          >
                            <option value="ALWAYS">Always</option>
                            <option value="CONTEXTUAL">Contextual</option>
                            <option value="EXPLICIT_ONLY">Explicit only</option>
                          </SelectInput>
                        </div>

                        <div>
                          <FieldLabel>Signal Matching</FieldLabel>
                          <SelectInput
                            value={section.matchMode}
                            onChange={(event) =>
                              onUpdateSection?.(
                                section.id,
                                "matchMode",
                                event.target.value
                              )
                            }
                          >
                            <option value="ANY">Any signal</option>
                            <option value="ALL">All populated groups</option>
                          </SelectInput>
                        </div>

                        <div>
                          <FieldLabel detail="0–100">Priority</FieldLabel>
                          <NumberInput
                            value={section.priority}
                            min={0}
                            max={100}
                            onChange={(event) =>
                              onUpdateSection?.(
                                section.id,
                                "priority",
                                event.target.value
                              )
                            }
                          />
                        </div>

                        <div>
                          <FieldLabel>Availability</FieldLabel>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={section.enabled}
                            onClick={() =>
                              onUpdateSection?.(
                                section.id,
                                "enabled",
                                !section.enabled
                              )
                            }
                            className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm transition ${
                              section.enabled
                                ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-100"
                                : "border-white/10 bg-black/35 text-[var(--ink-dim)]"
                            }`}
                          >
                            {section.enabled ? "Enabled" : "Disabled"}
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-xs leading-5 text-[var(--ink-dim)]">
                        <span className="font-medium text-[var(--gold-ornament)]">
                          Fixed authority:
                        </span>{" "}
                        {section.authorityLabel.replaceAll("_", " ")}. This
                        section can explain verified truth but cannot create or
                        mutate it.
                      </div>

                      <div className="mt-5">
                        <TextAreaField
                          label="Interpretive Guidance"
                          value={section.body}
                          onChange={(value) =>
                            onUpdateSection?.(section.id, "body", value)
                          }
                          placeholder="Explain what the verified values or outcome mean, when this rule applies, and how the result should be portrayed. Do not define hidden state changes here..."
                          maxLength={section.bodyCharacterLimit}
                        />
                      </div>

                      {contextual ? (
                        <div className="mt-6 rounded-xl border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/5 p-4">
                          <div className="flex items-start gap-3">
                            <CircleHelp
                              size={16}
                              className="mt-0.5 shrink-0 text-[var(--gold-ornament)]"
                            />
                            <div>
                              <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] font-medium uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
                                Contextual Activation Signals
                              </p>
                              <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
                                Enter comma-separated routing identifiers. The
                                context planner uses these signals to decide
                                whether this section is relevant; it does not
                                automatically execute a rule.
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            {safeSignalFields.map((field) => (
                              <div key={field.key}>
                                <FieldLabel>{field.label}</FieldLabel>
                                <TextInput
                                  value={
                                    section.activationInputs?.[field.key] || ""
                                  }
                                  onChange={(event) =>
                                    onUpdateActivationInput?.(
                                      section.id,
                                      field.key,
                                      event.target.value
                                    )
                                  }
                                  placeholder={field.placeholder}
                                  autoCapitalize="characters"
                                  spellCheck={false}
                                />
                                <p className="mt-2 text-[11px] leading-5 text-[var(--ink-dim)]">
                                  {field.description}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-[11px] leading-5 text-[var(--ink-dim)]">
                              Known domains: {knownDomains.join(", ")}
                            </div>
                            <div className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-[11px] leading-5 text-[var(--ink-dim)]">
                              Known scopes: {knownScopeTypes.join(", ")}
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {hasContent ? (
                        <div className="mt-5 flex justify-end">
                          <button
                            type="button"
                            onClick={() => onClearSection?.(section.id)}
                            className="cf-btn cf-btn--danger cf-btn--sm"
                          >
                            <Eraser size={13} />
                            Clear section
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-white/10 bg-black/20 p-5 text-sm leading-6 text-[var(--ink-dim)]">
          The authored Codex remains available for editing, but no section may be
          selected for runtime context while the Codex is disabled.
        </div>
      )}

      {jsonEditorOpen ? (
        <RulesCodexJsonEditorModal
          rulesCodex={codex}
          onApply={onApplyJsonCodex}
          onClose={onCloseJsonEditor}
        />
      ) : null}

      {!safeSections.length && enabled ? (
        <div className="mt-5 rounded-xl border border-dashed border-white/10 bg-black/20 p-6 text-center">
          <BookOpenText
            size={28}
            className="mx-auto text-[var(--gold-ornament)]"
          />
          <p className="mt-3 text-sm text-[var(--ink)]">
            No rules sections yet
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">
            Start with one focused interpretation rule rather than pasting an
            entire game manual into a single section.
          </p>
          <button
            type="button"
            onClick={() => onAddSection?.()}
            className="cf-btn cf-btn--primary mt-4"
          >
            <Plus size={15} />
            Add first section
          </button>
        </div>
      ) : null}
    </section>
  );
}
