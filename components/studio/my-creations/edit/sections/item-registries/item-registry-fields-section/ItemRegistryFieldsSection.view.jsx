import { useState } from "react";
import { Box, Database, Plus, Trash2 } from "lucide-react";

import {
  CheckboxField,
  SectionTitle,
  SelectField,
  SHORT_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function ItemRegistryFieldsSectionView({
  activeSection = "overview",
  sectionEyebrow = "Object Continuity",
  sectionTitle = "Inventory & Signature Objects",
  sectionDescription = "",
  registryTitleValue = "",
  registryScopeValue = "",
  registryDescriptionValue = "",
  entries = [],
  activeEntry = null,
  categoryOptions = [],
  roleOptions = [],
  placementOptions = [],
  quantityOptions = [],
  consumptionOptions = [],
  durabilityOptions = [],
  startingAssignmentContentByEntryId = {},
  promptSummaryValue = "",
  promptUsageNotesValue = "",
  promptNegativeNotesValue = "",
  reviewEntryCountValue = "0",
  reviewScopeValue = "Not set",
  reviewPayloadText = "{}",
  onChangeRegistryTitle = null,
  onChangeRegistryScope = null,
  onChangeRegistryDescription = null,
  onAddEntry = null,
  onChangePromptSummary = null,
  onChangePromptUsageNotes = null,
  onChangePromptNegativeNotes = null,
} = {}) {
  if (
    ![
      "overview",
      "entries",
      "associations",
      "tracking",
      "prompt",
      "review",
    ].includes(activeSection)
  ) {
    return null;
  }

  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      {activeSection === "overview" ? (
        <OverviewSection
          registryTitleValue={registryTitleValue}
          registryScopeValue={registryScopeValue}
          registryDescriptionValue={registryDescriptionValue}
          onChangeRegistryTitle={onChangeRegistryTitle}
          onChangeRegistryScope={onChangeRegistryScope}
          onChangeRegistryDescription={onChangeRegistryDescription}
        />
      ) : null}

      {activeSection === "entries" ? (
        <EntriesSection
          entries={entries}
          activeEntry={activeEntry}
          categoryOptions={categoryOptions}
          roleOptions={roleOptions}
          placementOptions={placementOptions}
          onAddEntry={onAddEntry}
        />
      ) : null}

      {activeSection === "associations" ? (
        <AssociationsSection
          entries={entries}
          startingAssignmentContentByEntryId={
            startingAssignmentContentByEntryId
          }
        />
      ) : null}

      {activeSection === "tracking" ? (
        <TrackingSection
          entries={entries}
          quantityOptions={quantityOptions}
          consumptionOptions={consumptionOptions}
          durabilityOptions={durabilityOptions}
        />
      ) : null}

      {activeSection === "prompt" ? (
        <PromptSection
          entries={entries}
          promptSummaryValue={promptSummaryValue}
          promptUsageNotesValue={promptUsageNotesValue}
          promptNegativeNotesValue={promptNegativeNotesValue}
          onChangePromptSummary={onChangePromptSummary}
          onChangePromptUsageNotes={onChangePromptUsageNotes}
          onChangePromptNegativeNotes={onChangePromptNegativeNotes}
        />
      ) : null}

      {activeSection === "review" ? (
        <ReviewSection
          reviewEntryCountValue={reviewEntryCountValue}
          reviewScopeValue={reviewScopeValue}
          reviewPayloadText={reviewPayloadText}
        />
      ) : null}
    </div>
  );
}

function OverviewSection({
  registryTitleValue,
  registryScopeValue,
  registryDescriptionValue,
  onChangeRegistryTitle,
  onChangeRegistryScope,
  onChangeRegistryDescription,
}) {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <Field label="Registry title">
        <TextInput
          value={registryTitleValue}
          onChange={(event) => onChangeRegistryTitle?.(event.target.value)}
          placeholder="Charlotte's Signature Objects"
        />
      </Field>

      <Field label="Registry scope">
        <TextInput
          value={registryScopeValue}
          onChange={(event) => onChangeRegistryScope?.(event.target.value)}
          placeholder="Character inventory, office props, faction cache..."
        />
      </Field>

      <div className="lg:col-span-2">
        <Field label="Description">
          <TextArea
            rows={4}
            value={registryDescriptionValue}
            onChange={(event) =>
              onChangeRegistryDescription?.(event.target.value)
            }
            placeholder="Describe what this registry tracks and how runtime systems should use it."
          />
        </Field>
      </div>
    </div>
  );
}

function EntriesSection({
  entries,
  activeEntry,
  categoryOptions,
  roleOptions,
  placementOptions,
  onAddEntry,
}) {
  return (
    <div className="mt-6 grid gap-5 xl:grid-cols-[0.42fr_1fr]">
      <div>
        <button
          type="button"
          onClick={() => onAddEntry?.()}
          className="cf-btn cf-btn--primary"
        >
          <Plus size={14} />
          Add entry
        </button>

        <div className="mt-4 space-y-2">
          {entries.length ? (
            entries.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => entry.onSelect?.()}
                className={`w-full rounded-[var(--radius-md)] border px-4 py-3 text-left transition ${
                  entry.isActive
                    ? "border-[var(--gold-action)] bg-[var(--gold-ornament)]/10"
                    : "border-[var(--line-whisper)] bg-[var(--surface-2)] hover:border-[var(--line)]"
                }`}
              >
                <p className="line-clamp-1 text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
                  {entry.nameDisplay}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--ink-dim)]">
                  {entry.roleDisplay} · {entry.categoryDisplay}
                </p>
              </button>
            ))
          ) : (
            <EmptyPanel message="No entries yet. Add an object to begin." />
          )}
        </div>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-5">
        {activeEntry ? (
          <ItemEntryEditor
            entry={activeEntry}
            categoryOptions={categoryOptions}
            roleOptions={roleOptions}
            placementOptions={placementOptions}
          />
        ) : (
          <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--line-whisper)] bg-[var(--surface-1)] p-8 text-center">
            <Box size={28} className="mx-auto text-[var(--gold-ornament)]" />
            <p className="mt-4 text-sm text-[var(--ink-dim)]">
              Select an object entry or add a new one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function AssociationsSection({
  entries,
  startingAssignmentContentByEntryId,
}) {
  return (
    <div className="mt-6 space-y-4">
      {entries.length ? (
        entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-4"
          >
            <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
              {entry.nameDisplay}
            </p>

            {startingAssignmentContentByEntryId[entry.id] || null}

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Field label="Ownership notes">
                <TextArea
                  rows={3}
                  value={entry.ownershipNotesValue}
                  onChange={(event) =>
                    entry.onChangeOwnershipNotes?.(event.target.value)
                  }
                  placeholder="Owner, prior owner, rightful owner, custody history..."
                />
              </Field>

              <Field label="Location notes">
                <TextArea
                  rows={3}
                  value={entry.locationNotesValue}
                  onChange={(event) =>
                    entry.onChangeLocationNotes?.(event.target.value)
                  }
                  placeholder="Carried, stored, displayed, hidden, last seen..."
                />
              </Field>
            </div>
          </div>
        ))
      ) : (
        <EmptyPanel message="Add entries before defining associations." />
      )}
    </div>
  );
}

function TrackingSection({
  entries,
  quantityOptions,
  consumptionOptions,
  durabilityOptions,
}) {
  return (
    <div className="mt-6 space-y-4">
      {entries.length ? (
        entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-4"
          >
            <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
              {entry.nameDisplay}
            </p>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <SelectField
                label="Quantity mode"
                value={entry.quantityModeValue}
                options={quantityOptions}
                onChange={(value) => entry.onChangeQuantityMode?.(value)}
              />

              <Field label="Starting quantity">
                <TextInput
                  value={entry.startingQuantityValue}
                  onChange={(event) =>
                    entry.onChangeStartingQuantity?.(event.target.value)
                  }
                  placeholder="1"
                />
              </Field>

              <SelectField
                label="Consumption"
                value={entry.consumptionModeValue}
                options={consumptionOptions}
                onChange={(value) => entry.onChangeConsumptionMode?.(value)}
              />

              <SelectField
                label="Durability"
                value={entry.durabilityModeValue}
                options={durabilityOptions}
                onChange={(value) => entry.onChangeDurabilityMode?.(value)}
              />

              <Field label="Condition percent">
                <TextInput
                  value={entry.conditionPercentValue}
                  onChange={(event) =>
                    entry.onChangeConditionPercent?.(event.target.value)
                  }
                  placeholder="100"
                />
              </Field>

              <Field label="Availability rule">
                <TextInput
                  value={entry.availabilityRuleValue}
                  onChange={(event) =>
                    entry.onChangeAvailabilityRule?.(event.target.value)
                  }
                  placeholder="Only available in Charlotte's office"
                />
              </Field>
            </div>

            <CheckboxField
              label="Runtime systems should not assume this item is available unless state, location, ownership, or story context allows it."
              checked={entry.doNotHallucinateAvailabilityChecked}
              onChange={(checked) =>
                entry.onChangeDoNotHallucinateAvailability?.(checked)
              }
            />
          </div>
        ))
      ) : (
        <EmptyPanel message="Add entries before defining tracking rules." />
      )}
    </div>
  );
}

function PromptSection({
  entries,
  promptSummaryValue,
  promptUsageNotesValue,
  promptNegativeNotesValue,
  onChangePromptSummary,
  onChangePromptUsageNotes,
  onChangePromptNegativeNotes,
}) {
  return (
    <div className="mt-6 grid gap-4">
      <Field label="Registry summary">
        <TextArea
          rows={4}
          value={promptSummaryValue}
          onChange={(event) => onChangePromptSummary?.(event.target.value)}
          placeholder="Summarize how these objects should influence scenes and images."
        />
      </Field>

      <Field label="Usage notes">
        <TextArea
          rows={4}
          value={promptUsageNotesValue}
          onChange={(event) => onChangePromptUsageNotes?.(event.target.value)}
          placeholder="When should these objects appear? When should they be excluded?"
        />
      </Field>

      <Field label="Negative prompt notes">
        <TextArea
          rows={3}
          value={promptNegativeNotesValue}
          onChange={(event) => onChangePromptNegativeNotes?.(event.target.value)}
          placeholder="Objects, styles, or errors to avoid."
        />
      </Field>

      {entries.map((entry) => (
        <div
          key={entry.id}
          className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-4"
        >
          <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)]">
            {entry.nameDisplay}
          </p>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Field label="Entry prompt guidance">
              <TextArea
                rows={4}
                value={entry.promptGuidanceValue}
                onChange={(event) =>
                  entry.onChangePromptGuidance?.(event.target.value)
                }
                placeholder="Prompt-ready description for this object."
              />
            </Field>

            <Field label="Entry negative prompt notes">
              <TextArea
                rows={4}
                value={entry.negativePromptNotesValue}
                onChange={(event) =>
                  entry.onChangeNegativePromptNotes?.(event.target.value)
                }
                placeholder="What should image generation avoid?"
              />
            </Field>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewSection({
  reviewEntryCountValue,
  reviewScopeValue,
  reviewPayloadText,
}) {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-[0.35fr_0.65fr]">
      <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] p-4">
        <Database size={24} className="text-[var(--gold-ornament)]" />
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-[var(--ink-dim)]">Entries</dt>
            <dd className="text-[var(--ink)]">
              {reviewEntryCountValue}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--ink-dim)]">Scope</dt>
            <dd className="text-[var(--ink)]">{reviewScopeValue}</dd>
          </div>
          <div>
            <dt className="text-[var(--ink-dim)]">Future payload</dt>
            <dd className="text-[var(--ink)]">ITEM_REGISTRY</dd>
          </div>
        </dl>
      </div>

      <pre className="max-h-[520px] overflow-auto rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-4 text-xs leading-5 text-[var(--ink-dim)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {reviewPayloadText}
      </pre>
    </div>
  );
}

function ItemEntryEditor({
  entry,
  categoryOptions,
  roleOptions,
  placementOptions,
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Name">
          <TextInput
            value={entry.nameValue}
            onChange={(event) => entry.onChangeName?.(event.target.value)}
            placeholder="Framed Djuna pistol"
          />
        </Field>

        <SelectField
          label="Category"
          value={entry.categoryValue}
          options={categoryOptions}
          onChange={(value) => entry.onChangeCategory?.(value)}
        />

        <SelectField
          label="Role"
          value={entry.roleValue}
          options={roleOptions}
          onChange={(value) => entry.onChangeRole?.(value)}
        />

        <SelectField
          label="Default placement"
          value={entry.defaultPlacementValue}
          options={placementOptions}
          onChange={(value) => entry.onChangeDefaultPlacement?.(value)}
        />

        <div className="lg:col-span-2">
          <Field label="Aliases, one per line">
            <TextArea
              rows={3}
              value={entry.aliasesText}
              onChange={(event) =>
                entry.onChangeAliasesText?.(event.target.value)
              }
              placeholder={"Djuna's gift\nThe framed pistol"}
            />
          </Field>
        </div>

        <div className="lg:col-span-2">
          <Field label="Description">
            <TextArea
              rows={4}
              value={entry.descriptionValue}
              onChange={(event) =>
                entry.onChangeDescription?.(event.target.value)
              }
              placeholder="What this object is and why it exists."
            />
          </Field>
        </div>

        <div className="lg:col-span-2">
          <Field label="Visual description">
            <TextArea
              rows={4}
              value={entry.visualDescriptionValue}
              onChange={(event) =>
                entry.onChangeVisualDescription?.(event.target.value)
              }
              placeholder="How this object should appear in images or scene descriptions."
            />
          </Field>
        </div>

        <div className="lg:col-span-2">
          <Field label="Symbolic / memory meaning">
            <TextArea
              rows={3}
              value={entry.symbolicMeaningValue}
              onChange={(event) =>
                entry.onChangeSymbolicMeaning?.(event.target.value)
              }
              placeholder="Relationship meaning, memory value, status value, emotional weight..."
            />
          </Field>
        </div>
      </div>

      <button
        type="button"
        onClick={() => entry.onDelete?.()}
        className="cf-btn cf-btn--danger"
      >
        <Trash2 size={14} />
        Delete entry
      </button>
    </div>
  );
}


function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--ink)] outline-none transition-colors hover:border-[var(--line)]"
    />
  );
}

// K1 folding field pattern (SharedFields.jsx TextAreaField), ED1d
// Defect 2: every long-form field here was a bare textarea with no
// fold and no counter. Reimplemented inline (rather than delegating
// to TextAreaField) because every call site already owns its label
// via the `Field` wrapper above; a second label would double up.
// `maxLength` defaults to the SHORT_LONGFORM ruling for call sites
// that do not pass their own.
function TextArea({
  value = "",
  onChange = () => {},
  placeholder,
  maxLength = SHORT_LONGFORM_MAX_LENGTH,
  rows: _rows, // superseded by the fold's own resting/expanded heights
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasExpanded, setHasExpanded] = useState(false);
  const isExpanded = hasExpanded || Boolean(String(value).trim());
  const atLimit = maxLength && value.length >= maxLength;
  const pastThreshold = maxLength && value.length >= maxLength * 0.8;
  const showCounter = maxLength && (isFocused || pastThreshold);

  return (
    <div>
      <textarea
        {...rest}
        value={value}
        onChange={(event) => onChange(event)}
        onFocus={(event) => {
          setIsFocused(true);
          setHasExpanded(true);
          rest.onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          rest.onBlur?.(event);
        }}
        placeholder={placeholder}
        maxLength={maxLength || undefined}
        className="w-full resize-none overflow-y-auto rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none transition-[height,border-color] hover:border-[var(--line)]"
        style={{ height: isExpanded ? undefined : "3rem", maxHeight: "320px" }}
      />
      {showCounter ? (
        <span
          className={`mt-1 block text-right text-[length:var(--text-label)] tabular-nums ${
            atLimit ? "text-[var(--status-danger)]" : "text-[var(--ink-faint)]"
          }`}
        >
          {value.length}/{maxLength}
          {atLimit ? " limit" : ""}
        </span>
      ) : null}
    </div>
  );
}

function EmptyPanel({ message }) {
  return (
    <p className="rounded-[var(--radius-md)] border border-dashed border-[var(--line-whisper)] bg-[var(--surface-1)] p-4 text-sm leading-6 text-[var(--ink-dim)]">
      {message}
    </p>
  );
}
