"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Plus, Trash2, X } from "lucide-react";

import {
  normalizeMechanicsTrackerMutationHint,
  normalizeMechanicsTrackerPhase,
  normalizeTrackerNumber,
  normalizeTrackerString,
  slugifyTrackerId,
} from "./mechanicsTrackersNormalization.js";

function ActionButton({ children, onClick, variant = "gold", title }) {
  const className = `cf-btn cf-btn--sm ${variant === "danger" ? "cf-btn--danger" : "cf-btn--secondary"}`;

  return (
    <button type="button" onClick={onClick} title={title} className={className}>
      {children}
    </button>
  );
}

function TextField({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <label className="grid gap-2 text-sm text-[var(--ink-dim)]">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]"
      />
    </label>
  );
}

function FoldableTracker({
  title,
  summary,
  defaultExpanded,
  foldSignal,
  onRemove,
  children,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  useEffect(() => {
    if (!foldSignal?.revision) return;
    setExpanded(foldSignal.expanded === true);
  }, [foldSignal?.revision, foldSignal?.expanded]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/25">
      <div className="flex items-start justify-between gap-3 px-5 py-4">
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
          className="min-w-0 flex-1 text-left"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            Tracker / Meter
          </p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="truncate text-xl text-[var(--ink)]">{title}</h4>
              <p className="mt-1 text-xs leading-5 text-[var(--ink-dim)]">{summary}</p>
            </div>
            <ChevronDown
              size={18}
              className={`mt-1 shrink-0 text-[var(--gold-ornament)] transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="cf-btn cf-btn--danger cf-btn--sm"
          title="Remove tracker"
        >
          <Trash2 size={13} />
          Remove
        </button>
      </div>
      {expanded ? <div className="border-t border-white/10 p-5">{children}</div> : null}
    </div>
  );
}

function TrackerPhaseCard({ phase, phaseIndex, onPatch, onRemove }) {
  const safePhase = normalizeMechanicsTrackerPhase(phase, phaseIndex);

  return (
    <div className="rounded-xl border border-white/10 bg-black/35 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
          Phase {phaseIndex + 1}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="cf-btn cf-btn--danger cf-btn--sm"
          title="Remove phase"
        >
          <Trash2 size={13} />
          Remove
        </button>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <TextField
          label="Phase ID"
          value={safePhase.id}
          onChange={(value) =>
            onPatch({ id: slugifyTrackerId(value, `phase_${phaseIndex + 1}`) })
          }
          placeholder="curious"
        />
        <TextField
          label="Label"
          value={safePhase.label}
          onChange={(value) =>
            onPatch({
              label: value,
              id: phase.id || slugifyTrackerId(value, `phase_${phaseIndex + 1}`),
            })
          }
          placeholder="Curious"
        />
        <TextField
          label="Min"
          type="number"
          value={String(safePhase.min)}
          onChange={(value) => onPatch({ min: normalizeTrackerNumber(value, 0) })}
          placeholder="0"
        />
        <TextField
          label="Max"
          type="number"
          value={String(safePhase.max)}
          onChange={(value) => onPatch({ max: normalizeTrackerNumber(value, 100) })}
          placeholder="100"
        />
      </div>
    </div>
  );
}

function MutationHintCard({ hint, hintIndex, onPatch, onRemove }) {
  const safeHint = normalizeMechanicsTrackerMutationHint(hint, hintIndex);
  const [eventTypeDraft, setEventTypeDraft] = useState("");
  const [triggerDraft, setTriggerDraft] = useState("");

  function addEventType() {
    const eventType = normalizeTrackerString(eventTypeDraft).toUpperCase();
    if (!eventType || safeHint.eventTypes.includes(eventType)) return;
    onPatch({ eventTypes: [...safeHint.eventTypes, eventType] });
    setEventTypeDraft("");
  }

  function addTrigger() {
    const trigger = normalizeTrackerString(triggerDraft);
    if (!trigger || safeHint.triggers.includes(trigger)) return;
    onPatch({ triggers: [...safeHint.triggers, trigger] });
    setTriggerDraft("");
  }

  return (
    <div className="rounded-xl border border-white/10 bg-black/35 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
          Mutation Hint {hintIndex + 1}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="cf-btn cf-btn--danger cf-btn--sm"
          title="Remove mutation hint"
        >
          <Trash2 size={13} />
          Remove
        </button>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <TextField
          label="Hint ID"
          value={safeHint.id}
          onChange={(value) =>
            onPatch({ id: slugifyTrackerId(value, `hint_${hintIndex + 1}`) })
          }
          placeholder="accepted_quiet_care"
        />
        <TextField
          label="Delta"
          type="number"
          value={String(safeHint.delta)}
          onChange={(value) => onPatch({ delta: normalizeTrackerNumber(value, 1) })}
          placeholder="2"
        />
      </div>
      <HintList
        title="Event Types"
        values={safeHint.eventTypes}
        empty="No event types yet."
        draft={eventTypeDraft}
        setDraft={setEventTypeDraft}
        add={addEventType}
        placeholder="ACCEPTED_REDIRECT"
        addLabel="Add event"
        remove={(index) =>
          onPatch({
            eventTypes: safeHint.eventTypes.filter((_value, itemIndex) => itemIndex !== index),
          })
        }
      />
      <HintList
        title="Trigger Phrases"
        values={safeHint.triggers}
        empty="No trigger phrases yet."
        draft={triggerDraft}
        setDraft={setTriggerDraft}
        add={addTrigger}
        placeholder="accepts redirect"
        addLabel="Add trigger"
        remove={(index) =>
          onPatch({
            triggers: safeHint.triggers.filter((_value, itemIndex) => itemIndex !== index),
          })
        }
      />
      <label className="mt-4 block">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">Reason</span>
        <textarea
          value={safeHint.reason}
          onChange={(event) => onPatch({ reason: event.target.value })}
          rows={2}
          placeholder="The player accepted the redirect without pushing."
          className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
        />
      </label>
    </div>
  );
}

function HintList({ title, values, empty, draft, setDraft, add, placeholder, addLabel, remove }) {
  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.map((value, index) => (
          <span
            key={`${value}-${index}`}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-[var(--ink)]"
          >
            <span className="break-all">{value}</span>
            <button
              type="button"
              onClick={() => remove(index)}
              className="inline-flex items-center gap-1 text-[var(--status-danger)] transition"
              title={`Remove ${title.toLowerCase()}`}
              aria-label={`Remove ${title.toLowerCase()}`}
            >
              <X size={12} />
              <span className="text-[10px]">Remove</span>
            </button>
          </span>
        ))}
        {!values.length ? <span className="text-xs text-[var(--ink-dim)]">{empty}</span> : null}
      </div>
      <div className="mt-4 flex flex-col gap-2 md:flex-row">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
        />
        <ActionButton onClick={add}>
          <Plus size={14} />
          {addLabel}
        </ActionButton>
      </div>
    </div>
  );
}

function TrackerCard({ entry, handlers }) {
  const { tracker, index: trackerIndex, hadExplicitId } = entry;

  return (
    <article>
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Tracker ID"
          value={tracker.id}
          onChange={(value) => handlers.updateTrackerId(trackerIndex, value)}
          placeholder="trust"
        />
        <TextField
          label="Label"
          value={tracker.label}
          onChange={(value) =>
            handlers.updateTrackerLabel(trackerIndex, value, hadExplicitId)
          }
          placeholder="Trust"
        />
        <label className="grid gap-2 text-sm text-[var(--ink-dim)]">
          <span>Kind</span>
          <select
            value={tracker.kind}
            onChange={(event) =>
              handlers.patchTracker(trackerIndex, { kind: event.target.value })
            }
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--gold-ornament)]"
          >
            <option value="meter">meter</option>
          </select>
        </label>
        <TextField
          label="Initial Value"
          type="number"
          value={String(tracker.initial)}
          onChange={(value) => handlers.updateTrackerInitial(trackerIndex, value)}
          placeholder="40"
        />
        <TextField
          label="Min"
          type="number"
          value={String(tracker.min)}
          onChange={(value) =>
            handlers.patchTracker(trackerIndex, {
              min: normalizeTrackerNumber(value, 0),
            })
          }
          placeholder="0"
        />
        <TextField
          label="Max"
          type="number"
          value={String(tracker.max)}
          onChange={(value) =>
            handlers.patchTracker(trackerIndex, {
              max: normalizeTrackerNumber(value, 100),
            })
          }
          placeholder="100"
        />
      </div>
      <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">Phases</p>
          <ActionButton onClick={() => handlers.addPhase(trackerIndex)}>
            <Plus size={14} /> Add phase
          </ActionButton>
        </div>
        {tracker.phases.length ? (
          <div className="mt-4 grid gap-4">
            {tracker.phases.map((phase, phaseIndex) => (
              <TrackerPhaseCard
                key={phase.id || phaseIndex}
                phase={phase}
                phaseIndex={phaseIndex}
                onPatch={(patch) => handlers.patchPhase(trackerIndex, phaseIndex, patch)}
                onRemove={() => handlers.removePhase(trackerIndex, phaseIndex)}
              />
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--ink-dim)]">
            No phases yet. Phases give display labels like Guarded, Curious, or Bare.
          </p>
        )}
      </div>
      <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">Mutation Hints</p>
          <ActionButton onClick={() => handlers.addMutationHint(trackerIndex)}>
            <Plus size={14} /> Add hint
          </ActionButton>
        </div>
        {tracker.mutationHints.length ? (
          <div className="mt-4 grid gap-4">
            {tracker.mutationHints.map((hint, hintIndex) => (
              <MutationHintCard
                key={hint.id || hintIndex}
                hint={hint}
                hintIndex={hintIndex}
                onPatch={(patch) =>
                  handlers.patchMutationHint(trackerIndex, hintIndex, patch)
                }
                onRemove={() =>
                  handlers.removeMutationHint(trackerIndex, hintIndex)
                }
              />
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--ink-dim)]">
            No mutation hints yet. Hints let the router map detected events into meter changes.
          </p>
        )}
      </div>
    </article>
  );
}

export default function MechanicsTrackersSectionView({
  entries = [],
  foldSignal = null,
  addTracker,
  removeTracker,
  patchTracker,
  updateTrackerId,
  updateTrackerLabel,
  updateTrackerInitial,
  addPhase,
  patchPhase,
  removePhase,
  addMutationHint,
  patchMutationHint,
  removeMutationHint,
}) {
  const handlers = {
    patchTracker,
    updateTrackerId,
    updateTrackerLabel,
    updateTrackerInitial,
    addPhase,
    patchPhase,
    removePhase,
    addMutationHint,
    patchMutationHint,
    removeMutationHint,
  };

  return (
    <section className="rounded-2xl border border-[var(--gold-ornament)]/20 bg-black/20 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">Visual Builder</p>
          <h3 className="mt-2 font-display text-3xl">Trackers / Meters</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
            Define reusable meter fields, display phases, and mutation hints.
            These save into instanceData.trackers.
          </p>
        </div>
        <ActionButton onClick={addTracker}>
          <Plus size={14} /> Add tracker
        </ActionButton>
      </div>
      {entries.length ? (
        <div className="mt-6 grid gap-4">
          {entries.map((entry) => (
            <FoldableTracker
              key={entry.key}
              title={entry.title}
              summary={entry.summary}
              defaultExpanded={entry.defaultExpanded}
              foldSignal={foldSignal}
              onRemove={() => removeTracker(entry.index)}
            >
              <TrackerCard entry={entry} handlers={handlers} />
            </FoldableTracker>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-[var(--ink-dim)]">
          No trackers defined yet. Add meters such as <span className="text-[var(--ink)]">affection</span>,{" "}
          <span className="text-[var(--ink)]">trust</span>, or <span className="text-[var(--ink)]">health</span>.
        </div>
      )}
    </section>
  );
}
