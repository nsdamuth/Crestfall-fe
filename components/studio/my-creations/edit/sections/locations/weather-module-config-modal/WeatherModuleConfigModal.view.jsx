import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import KitModalFrame from "@/components/kit/KitModalFrame";
import KitFormField from "@/components/kit/KitFormField";
import {
  CheckboxField,
  ReadOnlyField,
  SHORT_LONGFORM_MAX_LENGTH,
  TextAreaField,
} from "../../SharedFields";

// Ruling 3 (ED1G): hand-rolled fixed-inset overlay retired onto
// KitModalFrame (A4 mobile bottom-anchor law, B5/B8 unsaved-dismiss
// confirm, B1 fade dividers). LARGE width tier (section 8): the
// module identity grid, weather library, and per-condition cards are
// genuinely multi-column content. Section 5 de-nesting: EditorPanel's
// bordered/backgrounded box is retired for the inset-hairline
// sub-group pattern, one bordered depth (the frame) inside this
// surface.
export default function WeatherModuleConfigModalView({
  isInitializing = false,
  loadingMessage = "Loading weather module...",
  eyebrow = "Location Runtime Module",
  title = "Configure In-World Weather",
  description = "",
  message = "",
  messageTone = "success",
  moduleTitle = "",
  priority = "45",
  moduleDescription = "",
  moduleTypeLabel = "In-World Weather",
  moduleStatusLabel = "Will be created on save",
  currentConditionId = "",
  currentConditionOptions = [],
  weatherDisplayName = "",
  weatherDisplayPlaceholder = "Blue Mist",
  climateProfile = "",
  selectedPresetId = "",
  recommendedConditionOptions = [],
  conditionCards = [],
  detailLevel = "MEDIUM",
  detailLevelOptions = [],
  frequency = "OCCASIONAL",
  frequencyOptions = [],
  tone = "ATMOSPHERIC",
  surfaceSensoryNotes = true,
  allowWeatherComplications = false,
  respectIndoorOutdoorLogic = true,
  isSaving = false,
  hasUnsavedChanges = false,
  footerNote = "",
  onClose = null,
  onSave = null,
  onModuleTitleChange = null,
  onPriorityChange = null,
  onModuleDescriptionChange = null,
  onCurrentConditionChange = null,
  onWeatherDisplayNameChange = null,
  onClimateProfileChange = null,
  onSelectedPresetChange = null,
  onAddRecommendedCondition = null,
  onAddCustomCondition = null,
  onDetailLevelChange = null,
  onFrequencyChange = null,
  onToneChange = null,
  onSurfaceSensoryNotesChange = null,
  onAllowWeatherComplicationsChange = null,
  onRespectIndoorOutdoorLogicChange = null,
}) {
  if (isInitializing) {
    return (
      <KitModalFrame onClose={onClose} panelClassName="max-w-md" ariaLabel={title}>
        <div className="p-[var(--space-6)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
          {loadingMessage}
        </div>
      </KitModalFrame>
    );
  }

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
          {description ? (
            <p className="mt-[var(--space-2)] max-w-3xl text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
              {description}
            </p>
          ) : null}
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
            <Group title="Module Identity">
              <div className="grid gap-[var(--space-4)] md:grid-cols-2">
                <TextField
                  label="Module Title"
                  value={moduleTitle}
                  onChange={onModuleTitleChange}
                />

                <TextField
                  label="Priority"
                  value={priority}
                  onChange={onPriorityChange}
                  placeholder="45"
                />

                <div className="md:col-span-2">
                  <TextAreaField
                    label="Description"
                    value={moduleDescription}
                    onChange={onModuleDescriptionChange}
                    maxLength={SHORT_LONGFORM_MAX_LENGTH}
                  />
                </div>

                <ReadOnlyField label="Module Type" value={moduleTypeLabel} />
                <ReadOnlyField label="Status" value={moduleStatusLabel} />
              </div>
            </Group>

            <Group title="Current Weather">
              <div className="grid gap-[var(--space-4)] md:grid-cols-3">
                <SelectField
                  label="Current Condition"
                  value={currentConditionId}
                  options={currentConditionOptions}
                  onChange={onCurrentConditionChange}
                />

                <TextField
                  label="Weather Display Name"
                  value={weatherDisplayName}
                  onChange={onWeatherDisplayNameChange}
                  placeholder={weatherDisplayPlaceholder}
                />

                <TextField
                  label="Climate Profile"
                  value={climateProfile}
                  onChange={onClimateProfileChange}
                  placeholder="Old Crescent City"
                />
              </div>
            </Group>

            <Group title="Add Recommended Conditions">
              <div className="grid gap-[var(--space-4)] md:grid-cols-[1fr_auto_auto] md:items-end">
                <SelectField
                  label="Recommended Condition"
                  value={selectedPresetId}
                  options={recommendedConditionOptions}
                  onChange={onSelectedPresetChange}
                />

                <button
                  type="button"
                  onClick={() => onAddRecommendedCondition?.()}
                  className="cf-btn cf-btn--primary"
                >
                  <Plus size={15} />
                  Add recommended
                </button>

                <button
                  type="button"
                  onClick={() => onAddCustomCondition?.()}
                  className="cf-btn cf-btn--secondary"
                >
                  Add custom draft
                </button>
              </div>

              <p className="mt-[var(--space-3)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
                Recommended conditions are preferred. Custom weather can be refined
                later with creator guidance.
              </p>
            </Group>

            <Group title="Weather Conditions">
              <div className="grid gap-[var(--space-4)]">
                {conditionCards.map((condition) => (
                  <WeatherConditionCard key={condition.id} condition={condition} />
                ))}
              </div>
            </Group>

            <Group title="Presentation Preferences">
              <div className="grid gap-[var(--space-4)] md:grid-cols-3">
                <SelectField
                  label="Detail Level"
                  value={detailLevel}
                  options={detailLevelOptions}
                  onChange={onDetailLevelChange}
                />

                <SelectField
                  label="Frequency"
                  value={frequency}
                  options={frequencyOptions}
                  onChange={onFrequencyChange}
                />

                <TextField
                  label="Tone"
                  value={tone}
                  onChange={onToneChange}
                  placeholder="ATMOSPHERIC"
                />
              </div>

              <div className="mt-[var(--space-5)] grid gap-[var(--space-3)] md:grid-cols-3">
                <CheckboxField
                  label="Surface Sensory Notes"
                  checked={surfaceSensoryNotes}
                  onChange={onSurfaceSensoryNotesChange}
                />

                <CheckboxField
                  label="Allow Weather Complications"
                  checked={allowWeatherComplications}
                  onChange={onAllowWeatherComplicationsChange}
                />

                <CheckboxField
                  label="Respect Indoor / Outdoor Logic"
                  checked={respectIndoorOutdoorLogic}
                  onChange={onRespectIndoorOutdoorLogicChange}
                />
              </div>
            </Group>
          </div>
        </div>

        <div className="flex flex-col gap-[var(--space-3)] border-t border-[var(--line-fade)] p-[var(--space-5)] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
            {footerNote}
          </p>

          <div className="flex shrink-0 gap-[var(--space-3)]">
            <button
              type="button"
              onClick={() => onClose?.()}
              className="cf-btn cf-btn--secondary"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => onSave?.()}
              disabled={isSaving}
              className="cf-btn cf-btn--primary"
            >
              {isSaving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              Save weather module
            </button>
          </div>
        </div>
      </div>
    </KitModalFrame>
  );
}

function WeatherConditionCard({ condition }) {
  return (
    <section className="border-t border-[var(--line-whisper)] pt-[var(--space-4)] first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-[var(--space-4)] lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] font-medium text-[var(--ink)]">
            {condition.label}
          </p>
          <p className="mt-[var(--space-1)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
            {condition.summary}
          </p>
        </div>

        <div className="flex flex-wrap gap-[var(--space-2)]">
          <button
            type="button"
            onClick={() => condition.onSetCurrent?.()}
            disabled={condition.isCurrent}
            className="cf-btn cf-btn--secondary cf-btn--sm"
          >
            {condition.isCurrent ? "Current" : "Set current"}
          </button>

          <button
            type="button"
            onClick={() => condition.onRemove?.()}
            className="cf-btn cf-btn--danger cf-btn--sm"
            aria-label={`Remove ${condition.label}`}
          >
            <Trash2 size={13} />
            Remove
          </button>
        </div>
      </div>

      <div className="mt-[var(--space-4)] grid gap-[var(--space-4)] md:grid-cols-3">
        <TextField
          label="Condition Name"
          value={condition.label}
          onChange={condition.onLabelChange}
        />

        <SelectField
          label="Category"
          value={condition.category}
          options={condition.categoryOptions}
          onChange={condition.onCategoryChange}
        />

        <TextField
          label="Weight / Rarity"
          value={condition.weight}
          onChange={condition.onWeightChange}
          placeholder="30"
        />

        <SelectField
          label="Scene Impact"
          value={condition.sceneImpact}
          options={condition.sceneImpactOptions}
          onChange={condition.onSceneImpactChange}
        />

        <SelectField
          label="Hazard Level"
          value={condition.hazardLevel}
          options={condition.hazardLevelOptions}
          onChange={condition.onHazardLevelChange}
        />

        <TextField
          label="Tags"
          value={condition.tagsText}
          onChange={condition.onTagsChange}
          placeholder="rain, city, magical"
        />
      </div>

      <div className="mt-[var(--space-3)] grid gap-[var(--space-3)] md:grid-cols-3">
        <CheckboxField
          label="Available Here"
          checked={condition.allowed}
          onChange={condition.onAllowedChange}
        />

        <CheckboxField
          label="Blocked Here"
          checked={condition.blocked}
          onChange={condition.onBlockedChange}
        />

        <CheckboxField
          label="Can Affect Interiors"
          checked={condition.allowedIndoors}
          onChange={condition.onAllowedIndoorsChange}
        />
      </div>

      <div className="mt-[var(--space-4)] grid gap-[var(--space-4)] md:grid-cols-2">
        <TextAreaField
          label="Sensory Notes"
          value={condition.sensoryNotesText}
          onChange={condition.onSensoryNotesChange}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
          helperText="Use lines like Sight: ..., Sound: ..., Touch: ..., Smell: ..."
        />

        <TextAreaField
          label="Composer Guidance"
          value={condition.composerGuidance}
          onChange={condition.onComposerGuidanceChange}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
          helperText="Short guidance for how this weather should appear in scenes."
        />
      </div>

      {condition.blocked ? (
        <p className="mt-[var(--space-4)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--status-danger)]">
          This condition is known to the weather library but blocked for this location.
        </p>
      ) : null}
    </section>
  );
}

// Section 5 de-nesting: the inset-hairline sub-group pattern, a tier
// 4 group label, no border/background box.
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

function TextField({ label, value = "", onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="mt-[var(--space-1)] w-full min-h-[var(--control-md)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-faint)] hover:border-[var(--state-hover-line)]"
      />
    </label>
  );
}

function SelectField({ label, value = "", options = [], onChange }) {
  const normalizedOptions = options.map((option) =>
    typeof option === "object" && option !== null
      ? option
      : { value: option, label: option }
  );

  return (
    <KitFormFieldSelect
      label={label}
      value={value}
      options={normalizedOptions}
      onSelect={(nextValue) => onChange?.(nextValue)}
    />
  );
}

// Native-select conversion (ED1G ruling): the branded kit dropdown
// grammar, same pattern SharedFields.SelectField uses (KitFormField
// variant="select", which composes KitDropdown). Kept local here
// instead of importing SharedFields.SelectField because this modal's
// SelectField also serves the per-condition card grid with a plain
// `options` array of raw values, which SharedFields.SelectField
// already normalizes identically; this thin wrapper keeps the call
// sites in this file unchanged.
function KitFormFieldSelect({ label, value, options, onSelect }) {
  return (
    <KitFormField
      variant="select"
      label={label}
      value={value}
      options={options}
      onSelect={onSelect}
    />
  );
}
