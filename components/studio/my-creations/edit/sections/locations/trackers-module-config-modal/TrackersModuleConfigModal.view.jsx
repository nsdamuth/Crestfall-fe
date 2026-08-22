import { Activity, Plus, Save, Shield, SlidersHorizontal, Trash2, Zap } from "lucide-react";
import KitModalFrame from "@/components/kit/KitModalFrame";
import {
  CheckboxField,
  NumberField,
  ReadOnlyField,
  SelectField,
  SHORT_LONGFORM_MAX_LENGTH,
  TextAreaField,
  TextField,
} from "../../SharedFields";
import {
  composerVisibilityOptions,
  effectTypeOptions,
  enforcementOptions,
  guardSourceOptions,
  operatorOptions,
  publicVisibilityOptions,
  scopeOptions,
  slugify,
  trackerKindOptions,
} from "./useTrackersModuleConfigModalViewModel";

// Ruling 3 (ED1G): hand-rolled fixed-inset overlay retired onto
// KitModalFrame (A4 mobile bottom-anchor law, B5/B8 unsaved-dismiss
// confirm, B1 fade dividers). LARGE width tier (section 8): the field
// grid, guard grid, and per-field/per-guard subsections are genuinely
// multi-column content. Section 5 de-nesting: EditorPanel's bordered/
// backgrounded box is retired for the inset-hairline sub-group
// pattern, one bordered depth (the frame) at the outermost level;
// TrackerCard and GuardCard keep their own border because they are
// repeatable list ITEMS, not a static sub-group (same allowance the
// mechanics-modules siblings use for their card lists).
export default function TrackersModuleConfigModalView({
  locationTitle = "",
  eyebrow = "Location Runtime Module",
  title = "Configure Mechanics Fields, Effects & Guards",
  description = "",
  message = "",
  messageTone = "success",
  hasUnsavedChanges = false,
  moduleId = "core.trackers.v1",
  form,
  trackerOptions = [],
  targetOptions = [],
  percentByTrackerId = {},
  onClose = null,
  onSave = null,
  onToggleEnabled = null,
  onInheritanceModeChange = null,
  onPriorityChange = null,
  onAddTracker = null,
  onAddGuard = null,
  onClearAll = null,
  onUpdateTracker = null,
  onRemoveTracker = null,
  onAddPhase = null,
  onUpdatePhase = null,
  onRemovePhase = null,
  onAddHint = null,
  onUpdateHint = null,
  onRemoveHint = null,
  onAddEffect = null,
  onUpdateEffect = null,
  onRemoveEffect = null,
  onUpdateGuard = null,
  onRemoveGuard = null,
  onAddCondition = null,
  onUpdateCondition = null,
  onRemoveCondition = null,
}) {
  if (!form) return null;

  return (
    <KitModalFrame
      onClose={onClose}
      panelClassName="max-w-4xl"
      hasUnsavedChanges={hasUnsavedChanges}
      ariaLabel={title}
    >
      <div className="flex max-h-[92dvh] flex-col">
        <div className="border-b border-[var(--line-fade)] p-[var(--space-5)]">
          <p className="text-[length:var(--text-eyebrow)] leading-[var(--lh-eyebrow)] uppercase tracking-[var(--track-eyebrow)] text-[var(--gold-ornament)]">
            {eyebrow}
          </p>
          <h2 className="mt-[var(--space-2)] font-display text-[length:var(--text-heading-m)] leading-[var(--lh-heading-m)] min-[700px]:text-[length:var(--text-heading)] min-[700px]:leading-[var(--lh-heading)]">
            {title}
          </h2>
          <p className="mt-[var(--space-2)] max-w-3xl text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            {description}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-[var(--space-5)] pb-[var(--space-6)]">
          {message ? (
            <span
              role={messageTone === "error" ? "alert" : undefined}
              aria-live="polite"
              className={`mb-[var(--space-5)] inline-flex items-center gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] ${
                messageTone === "error"
                  ? "text-[var(--status-danger)]"
                  : "text-[var(--status-success)]"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 flex-none rounded-full ${
                  messageTone === "error"
                    ? "bg-[var(--status-danger)]"
                    : "bg-[var(--status-success)]"
                }`}
              />
              <span className="inline">{message}</span>
            </span>
          ) : null}

          <div className="grid gap-[var(--space-6)]">
            <Group title="Module Settings">
              <div className="grid gap-[var(--space-4)] md:grid-cols-3">
                <CheckboxField
                  label="Enable mechanics module"
                  checked={form.enabled}
                  onChange={onToggleEnabled}
                />

                <SelectField
                  label="Inheritance Mode"
                  value={form.inheritanceMode}
                  options={[
                    {
                      value: "INHERITABLE",
                      label: "Inheritable / available to child spaces",
                    },
                    { value: "LOCAL_ONLY", label: "Local only" },
                    { value: "OVERRIDE", label: "Local override" },
                  ]}
                  onChange={onInheritanceModeChange}
                />

                <TextField
                  label="Priority"
                  value={form.priority}
                  onChange={onPriorityChange}
                  placeholder="65"
                />
              </div>

              <div className="mt-[var(--space-4)] grid gap-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)] md:grid-cols-3">
                <RuntimeStat label="Module ID" value={moduleId} />
                <RuntimeStat label="Mechanics fields" value={form.trackers.length} />
                <RuntimeStat label="Guards" value={form.guards.length} />
              </div>
            </Group>

            <Group title="Quick Starters">
              <div className="flex flex-wrap gap-[var(--space-3)]">
                <ActionButton onClick={onAddTracker} icon={<Plus size={15} />}>
                  Add meter field
                </ActionButton>

                <ActionButton onClick={onAddGuard} icon={<Plus size={15} />} variant="secondary">
                  Add guard / gate
                </ActionButton>

                <button type="button" onClick={onClearAll} className="cf-btn cf-btn--danger">
                  <Trash2 size={15} />
                  Clear
                </button>
              </div>
            </Group>

            <Group title="Mechanics Fields">
              <div className="grid gap-[var(--space-4)]">
                {form.trackers.length ? (
                  form.trackers.map((tracker, trackerIndex) => (
                    <TrackerCard
                      key={`${tracker.id}-${trackerIndex}`}
                      tracker={tracker}
                      trackerIndex={trackerIndex}
                      targetOptions={targetOptions}
                      percent={percentByTrackerId[tracker.id] ?? 0}
                      onUpdate={(patch) => onUpdateTracker(trackerIndex, patch)}
                      onRemove={() => onRemoveTracker(trackerIndex)}
                      onAddPhase={() => onAddPhase(trackerIndex)}
                      onUpdatePhase={(phaseIndex, patch) => onUpdatePhase(trackerIndex, phaseIndex, patch)}
                      onRemovePhase={(phaseIndex) => onRemovePhase(trackerIndex, phaseIndex)}
                      onAddHint={() => onAddHint(trackerIndex)}
                      onUpdateHint={(hintIndex, patch) => onUpdateHint(trackerIndex, hintIndex, patch)}
                      onRemoveHint={(hintIndex) => onRemoveHint(trackerIndex, hintIndex)}
                      onAddEffect={(hintIndex) => onAddEffect(trackerIndex, hintIndex)}
                      onUpdateEffect={(hintIndex, effectIndex, patch) =>
                        onUpdateEffect(trackerIndex, hintIndex, effectIndex, patch)
                      }
                      onRemoveEffect={(hintIndex, effectIndex) => onRemoveEffect(trackerIndex, hintIndex, effectIndex)}
                    />
                  ))
                ) : (
                  <EmptyState
                    title="No mechanics fields yet"
                    body="Add a meter field to create the first mechanics field."
                  />
                )}
              </div>
            </Group>

            <Group title="Guards / Gates">
              <div className="grid gap-[var(--space-4)]">
                {form.guards.length ? (
                  form.guards.map((guard, guardIndex) => (
                    <GuardCard
                      key={`${guard.id}-${guardIndex}`}
                      guard={guard}
                      guardIndex={guardIndex}
                      targetOptions={targetOptions}
                      onUpdate={(patch) => onUpdateGuard(guardIndex, patch)}
                      onRemove={() => onRemoveGuard(guardIndex)}
                      onAddCondition={() => onAddCondition(guardIndex)}
                      onUpdateCondition={(conditionIndex, patch) => onUpdateCondition(guardIndex, conditionIndex, patch)}
                      onRemoveCondition={(conditionIndex) => onRemoveCondition(guardIndex, conditionIndex)}
                    />
                  ))
                ) : (
                  <EmptyState
                    title="No guards yet"
                    body="Add an access guard to create a deterministic lock or guidance rule."
                  />
                )}
              </div>
            </Group>
          </div>
        </div>

        <div className="flex flex-col gap-[var(--space-3)] border-t border-[var(--line-fade)] p-[var(--space-5)] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            Module changes update the Location form. Save the Location to persist the runtime binding.
          </p>

          <div className="flex shrink-0 gap-[var(--space-3)]">
            <button type="button" onClick={() => onClose?.()} className="cf-btn cf-btn--secondary">
              Close
            </button>

            <ActionButton onClick={onSave} icon={<Save size={15} />}>
              Save mechanics module
            </ActionButton>
          </div>
        </div>
      </div>
    </KitModalFrame>
  );
}

function TrackerCard({
  tracker,
  trackerIndex,
  targetOptions,
  percent,
  onUpdate,
  onRemove,
  onAddPhase,
  onUpdatePhase,
  onRemovePhase,
  onAddHint,
  onUpdateHint,
  onRemoveHint,
  onAddEffect,
  onUpdateEffect,
  onRemoveEffect,
}) {
  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)]">
      <div className="flex flex-col gap-[var(--space-4)] border-b border-[var(--line-fade)] p-[var(--space-4)] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Field #{trackerIndex + 1}
          </p>
          <h3 className="mt-[var(--space-1)] text-[length:var(--text-body)] leading-[var(--lh-body)] font-medium text-[var(--ink)]">
            {tracker.label || tracker.id}
          </h3>
          <p className="mt-[var(--space-1)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            Meter · {tracker.kind} · {tracker.scope} · {tracker.min}-{tracker.max}
          </p>
        </div>

        <button type="button" onClick={onRemove} className="cf-btn cf-btn--danger cf-btn--sm">
          <Trash2 size={14} />
          Remove
        </button>
      </div>

      <div className="grid gap-[var(--space-5)] p-[var(--space-4)]">
        <div className="grid gap-[var(--space-4)] md:grid-cols-3">
          <TextField
            label="Field Name"
            value={tracker.label}
            onChange={(value) => onUpdate({ label: value, id: tracker.id || slugify(value, "tracker") })}
          />

          <TextField
            label="Internal ID"
            value={tracker.id}
            onChange={(value) => onUpdate({ id: slugify(value, tracker.id) })}
          />

          <SelectField
            label="Meter Kind"
            value={tracker.kind}
            options={trackerKindOptions.map((option) => ({ value: option, label: option }))}
            onChange={(value) => onUpdate({ kind: value })}
          />

          <SelectField
            label="Scope"
            value={tracker.scope}
            options={scopeOptions.map((option) => ({ value: option, label: option }))}
            onChange={(value) => onUpdate({ scope: value })}
          />

          <NumberField label="Min" value={tracker.min} onChange={(value) => onUpdate({ min: value })} />
          <NumberField label="Max" value={tracker.max} onChange={(value) => onUpdate({ max: value })} />
          <NumberField
            label="Starting Value"
            value={tracker.value}
            onChange={(value) => onUpdate({ value })}
          />

          <SelectField
            label="Composer Visibility"
            value={tracker.composerVisibility}
            options={composerVisibilityOptions}
            onChange={(value) => onUpdate({ composerVisibility: value })}
          />

          <SelectField
            label="Public Visibility"
            value={tracker.publicVisibility}
            options={publicVisibilityOptions}
            onChange={(value) => onUpdate({ publicVisibility: value })}
          />
        </div>

        {/* Progress meter recipe: BLOCKED-ON-RULING (no meter recipe
            exists in law, ED1G finding, SKIPPED-NO-RULING). Left as
            the prior visual shape, not reworked onto a new invented
            token contract. */}
        <div>
          <div className="mb-[var(--space-2)] flex items-center justify-between text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            <span>Starting Value Preview</span>
            <span>{tracker.value}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-[var(--gold-ornament)]/80" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <TextAreaField
          label="Field Summary / Composer Cue"
          value={tracker.summary || ""}
          onChange={(value) => onUpdate({ summary: value })}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <Subsection icon={<SlidersHorizontal size={16} />} title="Phases" actionLabel="Add phase" onAction={onAddPhase}>
          <div className="grid gap-[var(--space-3)]">
            {tracker.phases.map((phase, phaseIndex) => (
              <div
                key={`${phase.id}-${phaseIndex}`}
                className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-4)]"
              >
                <div className="grid gap-[var(--space-3)] md:grid-cols-[1fr_1fr_0.5fr_0.5fr_auto] md:items-end">
                  <TextField
                    label="Label"
                    value={phase.label}
                    onChange={(value) =>
                      onUpdatePhase(phaseIndex, {
                        label: value,
                        id: phase.id || slugify(value, "phase"),
                        publicLabel: phase.publicLabel || value,
                      })
                    }
                  />

                  <TextField
                    label="ID"
                    value={phase.id}
                    onChange={(value) => onUpdatePhase(phaseIndex, { id: slugify(value, phase.id) })}
                  />

                  <NumberField label="Min" value={phase.min} onChange={(value) => onUpdatePhase(phaseIndex, { min: value })} />
                  <NumberField label="Max" value={phase.max} onChange={(value) => onUpdatePhase(phaseIndex, { max: value })} />

                  <IconButton onClick={() => onRemovePhase(phaseIndex)}>
                    <Trash2 size={14} />
                  </IconButton>
                </div>

                <div className="mt-[var(--space-3)]">
                  <TextAreaField
                    label="Phase Composer Guidance"
                    value={phase.composerGuidance || ""}
                    onChange={(value) => onUpdatePhase(phaseIndex, { composerGuidance: value })}
                    maxLength={SHORT_LONGFORM_MAX_LENGTH}
                  />
                </div>
              </div>
            ))}
          </div>
        </Subsection>

        <Subsection icon={<Zap size={16} />} title="Mutation Hints / Triggers" actionLabel="Add hint" onAction={onAddHint}>
          <div className="grid gap-[var(--space-4)]">
            {tracker.mutationHints.map((hint, hintIndex) => (
              <HintCard
                key={`${hint.id}-${hintIndex}`}
                hint={hint}
                hintIndex={hintIndex}
                targetOptions={targetOptions}
                onUpdate={(patch) => onUpdateHint(hintIndex, patch)}
                onRemove={() => onRemoveHint(hintIndex)}
                onAddEffect={() => onAddEffect(hintIndex)}
                onUpdateEffect={(effectIndex, patch) => onUpdateEffect(hintIndex, effectIndex, patch)}
                onRemoveEffect={(effectIndex) => onRemoveEffect(hintIndex, effectIndex)}
              />
            ))}
          </div>
        </Subsection>
      </div>
    </section>
  );
}

function HintCard({ hint, hintIndex, targetOptions, onUpdate, onRemove, onAddEffect, onUpdateEffect, onRemoveEffect }) {
  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-4)]">
      <div className="flex flex-col gap-[var(--space-3)] md:flex-row md:items-end md:justify-between">
        <div className="grid flex-1 gap-[var(--space-3)] md:grid-cols-2">
          <TextField
            label={`Hint #${hintIndex + 1}`}
            value={hint.id}
            onChange={(value) => onUpdate({ id: slugify(value, hint.id) })}
          />

          <TextField
            label="Event Types"
            value={hint.eventTypes.join(", ")}
            onChange={(value) =>
              onUpdate({
                eventTypes: value.split(",").map((item) => item.trim().toUpperCase()).filter(Boolean),
              })
            }
            placeholder="BOUNDARY_RESPECTED"
          />
        </div>

        <IconButton onClick={onRemove}>
          <Trash2 size={14} />
        </IconButton>
      </div>

      <div className="mt-[var(--space-3)]">
        <TextAreaField
          label="Reason"
          value={hint.reason || ""}
          onChange={(value) => onUpdate({ reason: value })}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />
      </div>

      <div className="mt-[var(--space-4)] grid gap-[var(--space-3)] md:grid-cols-4">
        <TextField
          label="Min Confidence"
          value={hint.constraints.minConfidence}
          onChange={(value) => onUpdate({ constraints: { minConfidence: value } })}
          placeholder="0.6"
        />

        <TextField
          label="Max / Turn"
          value={hint.constraints.maxApplicationsPerTurn}
          onChange={(value) => onUpdate({ constraints: { maxApplicationsPerTurn: value } })}
          placeholder="1"
        />

        <TextField
          label="Max / Room"
          value={hint.constraints.maxApplicationsPerRoom}
          onChange={(value) => onUpdate({ constraints: { maxApplicationsPerRoom: value } })}
          placeholder="optional"
        />

        <CheckboxField
          label="Allow repeat"
          checked={hint.constraints.allowRepeat}
          onChange={(value) => onUpdate({ constraints: { allowRepeat: value } })}
        />
      </div>

      <Subsection icon={<Activity size={15} />} title="Effects" actionLabel="Add effect" onAction={onAddEffect} compact>
        <div className="grid gap-[var(--space-3)]">
          {hint.effects.map((effect, effectIndex) => (
            <EffectRow
              key={`${effect.id}-${effectIndex}`}
              effect={effect}
              targetOptions={targetOptions}
              onUpdate={(patch) => onUpdateEffect(effectIndex, patch)}
              onRemove={() => onRemoveEffect(effectIndex)}
            />
          ))}
        </div>
      </Subsection>
    </section>
  );
}

function EffectRow({ effect, targetOptions, onUpdate, onRemove }) {
  return (
    <div className="grid gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-3)] md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
      <SelectField
        label="Effect"
        value={effect.type}
        options={effectTypeOptions}
        onChange={(value) => onUpdate({ type: value })}
      />

      <ComboTextField
        label="Target"
        value={effect.targetId}
        options={targetOptions}
        onChange={(value) => onUpdate({ targetId: slugify(value, value) })}
      />

      {effect.type === "METER_DELTA" ? (
        <NumberField label="Delta" value={effect.delta} onChange={(value) => onUpdate({ delta: value, amount: value })} />
      ) : null}

      {effect.type === "COUNTER_INCREMENT" ? (
        <NumberField label="Amount" value={effect.amount} onChange={(value) => onUpdate({ amount: value })} />
      ) : null}

      {effect.type === "COUNTER_SET" ? (
        <NumberField label="Value" value={effect.value} onChange={(value) => onUpdate({ value })} />
      ) : null}

      {effect.type === "FLAG_SET" ? (
        <SelectField
          label="Value"
          value={String(effect.value === true || effect.value === "true")}
          options={[
            { value: "true", label: "true" },
            { value: "false", label: "false" },
          ]}
          onChange={(value) => onUpdate({ value: value === "true" })}
        />
      ) : null}

      {effect.type === "FLAG_CLEAR" ? <ReadOnlyField label="Value" value="false" /> : null}

      {effect.type === "STAGE_SET" ? (
        <TextField
          label="Stage"
          value={effect.value}
          onChange={(value) => onUpdate({ value: slugify(value, value) })}
          placeholder="boundary_respected"
        />
      ) : null}

      <IconButton onClick={onRemove}>
        <Trash2 size={14} />
      </IconButton>
    </div>
  );
}

function GuardCard({ guard, guardIndex, targetOptions, onUpdate, onRemove, onAddCondition, onUpdateCondition, onRemoveCondition }) {
  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)]">
      <div className="flex flex-col gap-[var(--space-4)] border-b border-[var(--line-fade)] p-[var(--space-4)] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            Guard #{guardIndex + 1}
          </p>
          <h3 className="mt-[var(--space-1)] text-[length:var(--text-body)] leading-[var(--lh-body)] font-medium text-[var(--ink)]">
            {guard.label || guard.id}
          </h3>
          <p className="mt-[var(--space-1)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {guard.enforcement} · {guard.mode}
          </p>
        </div>

        <button type="button" onClick={onRemove} className="cf-btn cf-btn--danger cf-btn--sm">
          <Trash2 size={14} />
          Remove
        </button>
      </div>

      <div className="grid gap-[var(--space-5)] p-[var(--space-4)]">
        <div className="grid gap-[var(--space-4)] md:grid-cols-3">
          <TextField
            label="Label"
            value={guard.label}
            onChange={(value) => onUpdate({ label: value, id: guard.id || slugify(value, "guard") })}
          />

          <TextField
            label="Internal ID"
            value={guard.id}
            onChange={(value) => onUpdate({ id: slugify(value, guard.id) })}
          />

          <SelectField
            label="Enforcement"
            value={guard.enforcement}
            options={enforcementOptions}
            onChange={(value) => onUpdate({ enforcement: value })}
          />

          <SelectField
            label="Mode"
            value={guard.mode}
            options={[
              { value: "ALL", label: "All conditions" },
              { value: "ANY", label: "Any condition" },
            ]}
            onChange={(value) => onUpdate({ mode: value })}
          />

          <SelectField
            label="Composer Visibility"
            value={guard.composerVisibility}
            options={composerVisibilityOptions}
            onChange={(value) => onUpdate({ composerVisibility: value })}
          />

          <SelectField
            label="Public Visibility"
            value={guard.publicVisibility}
            options={publicVisibilityOptions}
            onChange={(value) => onUpdate({ publicVisibility: value })}
          />
        </div>

        <TextAreaField
          label="Summary"
          value={guard.summary || ""}
          onChange={(value) => onUpdate({ summary: value })}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />

        <Subsection icon={<Shield size={16} />} title="Conditions" actionLabel="Add condition" onAction={onAddCondition}>
          <div className="grid gap-[var(--space-3)]">
            {guard.conditions.map((condition, conditionIndex) => (
              <ConditionRow
                key={`${condition.id}-${conditionIndex}`}
                condition={condition}
                targetOptions={targetOptions}
                onUpdate={(patch) => onUpdateCondition(conditionIndex, patch)}
                onRemove={() => onRemoveCondition(conditionIndex)}
              />
            ))}
          </div>
        </Subsection>

        <div className="grid gap-[var(--space-4)] md:grid-cols-2">
          <TextAreaField
            label="On Pass Summary"
            value={guard.onPass?.summary || ""}
            onChange={(value) => onUpdate({ onPass: { summary: value } })}
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
          />

          <TextAreaField
            label="On Fail Summary"
            value={guard.onFail?.summary || ""}
            onChange={(value) => onUpdate({ onFail: { summary: value } })}
            maxLength={SHORT_LONGFORM_MAX_LENGTH}
          />
        </div>
      </div>
    </section>
  );
}

function ConditionRow({ condition, targetOptions, onUpdate, onRemove }) {
  return (
    <div className="grid gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-[var(--space-3)] md:grid-cols-[0.8fr_1fr_0.8fr_0.8fr_auto] md:items-end">
      <SelectField
        label="Source"
        value={condition.source}
        options={guardSourceOptions}
        onChange={(value) => onUpdate({ source: value })}
      />

      <ComboTextField
        label="Target"
        value={condition.id}
        options={targetOptions}
        onChange={(value) => onUpdate({ id: slugify(value, value) })}
      />

      <SelectField
        label="Operator"
        value={condition.operator}
        options={operatorOptions}
        onChange={(value) => onUpdate({ operator: value })}
      />

      {condition.source === "flag" ? (
        <SelectField
          label="Value"
          value={String(condition.value === true || condition.value === "true")}
          options={[
            { value: "true", label: "true" },
            { value: "false", label: "false" },
          ]}
          onChange={(value) => onUpdate({ value: value === "true" })}
        />
      ) : ["exists", "missing", "truthy", "falsy"].includes(condition.operator) ? (
        <ReadOnlyField label="Value" value="not required" />
      ) : (
        <TextField label="Value" value={condition.value} onChange={(value) => onUpdate({ value })} />
      )}

      <IconButton onClick={onRemove}>
        <Trash2 size={14} />
      </IconButton>
    </div>
  );
}

// Section 5 de-nesting: the inset-hairline sub-group pattern, a tier
// 4 group label, no border/background box, matching the same pattern
// used in the sibling weather-module-config-modal package.
function Group({ title, children }) {
  return (
    <section className="border-t border-[var(--line-whisper)] pt-[var(--space-4)] first:border-t-0 first:pt-0">
      <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
        {title}
      </p>
      <div className="mt-[var(--space-4)]">{children}</div>
    </section>
  );
}

function Subsection({ icon, title, actionLabel, onAction, children, compact = false }) {
  return (
    <div className={compact ? "mt-[var(--space-4)]" : ""}>
      <div className="mb-[var(--space-3)] flex items-center justify-between gap-[var(--space-3)]">
        <div className="flex items-center gap-[var(--space-2)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          {icon}
          <span>{title}</span>
        </div>

        <button type="button" onClick={onAction} className="cf-btn cf-btn--secondary cf-btn--sm">
          <Plus size={12} />
          {actionLabel}
        </button>
      </div>

      {children}
    </div>
  );
}

// ComboTextField: a freeform text input with a native HTML5 datalist
// of suggested targets. Not a rigid <select> (target ids may be
// arbitrary strings outside the suggestion list), so it is out of
// scope for the native-select-to-branded-dropdown conversion; restyled
// onto the same token bed as every other field in this file.
function ComboTextField({ label, value, options, onChange }) {
  const listId = `${label.replace(/\s+/g, "-").toLowerCase()}-options`;

  return (
    <label className="block">
      <span className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        {label}
      </span>

      <input
        list={listId}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="kit-focus mt-[var(--space-1)] w-full min-h-[var(--control-md)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-faint)] hover:border-[var(--state-hover-line)]"
      />

      <datalist id={listId}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </datalist>
    </label>
  );
}

function IconButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-[var(--control-md)] items-center justify-center rounded-[var(--radius-md)] border border-[var(--line-whisper)] px-[var(--space-3)] text-[var(--ink-dim)] transition hover:text-[var(--status-danger)]"
    >
      {children}
    </button>
  );
}

function ActionButton({ onClick, icon, children, variant = "primary" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cf-btn ${variant === "secondary" ? "cf-btn--secondary" : "cf-btn--primary"}`}
    >
      {icon}
      {children}
    </button>
  );
}

function RuntimeStat({ label, value }) {
  return (
    <p>
      {label}: <span className="text-[var(--ink)]">{value}</span>
    </p>
  );
}

function EmptyState({ title, body }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-5)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
      <p className="text-[var(--ink)]">{title}</p>
      <p className="mt-[var(--space-2)]">{body}</p>
    </div>
  );
}
