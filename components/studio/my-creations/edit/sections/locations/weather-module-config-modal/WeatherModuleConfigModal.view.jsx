import { CloudSun, Loader2, Plus, Save, Trash2, X } from "lucide-react";

export default function WeatherModuleConfigModalView({
  isInitializing = false,
  loadingMessage = "Loading weather module...",
  eyebrow = "Location Runtime Module",
  title = "Configure In-World Weather",
  description = "",
  message = "",
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
        <div className="rounded-[var(--radius-lg)] border border-[var(--muted-gold)]/25 bg-[#080706] p-6 text-sm text-[var(--muted)]">
          {loadingMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[var(--radius-lg)] border border-[var(--muted-gold)]/25 bg-[#080706] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-[var(--muted-gold)]/25 bg-[var(--muted-gold)]/10 p-3 text-[var(--muted-gold)]">
              <CloudSun size={22} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-gold)]">
                {eyebrow}
              </p>
              <h2 className="mt-2 font-display text-4xl">{title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-lg border border-white/10 p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-5">
          {message ? (
            <p className="mb-5 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--muted)]">
              {message}
            </p>
          ) : null}

          <div className="grid gap-5">
            <EditorPanel title="Module Identity">
              <div className="grid gap-4 md:grid-cols-2">
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
                    rows={3}
                  />
                </div>

                <ReadOnlyField label="Module Type" value={moduleTypeLabel} />
                <ReadOnlyField label="Status" value={moduleStatusLabel} />
              </div>
            </EditorPanel>

            <EditorPanel title="Current Weather">
              <div className="grid gap-4 md:grid-cols-3">
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
            </EditorPanel>

            <EditorPanel title="Add Recommended Conditions">
              <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
                <SelectField
                  label="Recommended Condition"
                  value={selectedPresetId}
                  options={recommendedConditionOptions}
                  onChange={onSelectedPresetChange}
                />

                <button
                  type="button"
                  onClick={() => onAddRecommendedCondition?.()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/15 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/25 hover:text-[var(--foreground)]"
                >
                  <Plus size={15} />
                  Add Recommended
                </button>

                <button
                  type="button"
                  onClick={() => onAddCustomCondition?.()}
                  className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
                >
                  Add Custom Draft
                </button>
              </div>

              <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
                Recommended conditions are preferred. Custom weather can be refined
                later with creator guidance.
              </p>
            </EditorPanel>

            <EditorPanel title="Weather Conditions">
              <div className="grid gap-4">
                {conditionCards.map((condition) => (
                  <WeatherConditionCard
                    key={condition.id}
                    condition={condition}
                  />
                ))}
              </div>
            </EditorPanel>

            <EditorPanel title="Presentation Preferences">
              <div className="grid gap-4 md:grid-cols-3">
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

              <div className="mt-5 grid gap-3 md:grid-cols-3">
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
            </EditorPanel>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-[var(--muted)]">{footerNote}</p>

          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={() => onClose?.()}
              className="rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted)] transition hover:border-[var(--muted-gold)]/35 hover:text-[var(--foreground)]"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => onSave?.()}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/15 px-4 py-3 text-xs uppercase tracking-[0.18em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/25 hover:text-[var(--foreground)] disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              Save Weather Module
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeatherConditionCard({ condition }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-display text-3xl">{condition.label}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
            {condition.summary}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => condition.onSetCurrent?.()}
            disabled={condition.isCurrent}
            className="rounded-xl border border-[var(--muted-gold)]/35 bg-[var(--muted-gold)]/10 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--muted-gold)] transition hover:bg-[var(--muted-gold)]/20 hover:text-[var(--foreground)] disabled:opacity-50"
          >
            {condition.isCurrent ? "Current" : "Set Current"}
          </button>

          <button
            type="button"
            onClick={() => condition.onRemove?.()}
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-[var(--status-danger)] transition hover:bg-white/5"
            aria-label={`Remove ${condition.label}`}
          >
            <Trash2 size={13} />
            Remove
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
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

      <div className="mt-4 grid gap-3 md:grid-cols-3">
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

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <TextAreaField
          label="Sensory Notes"
          value={condition.sensoryNotesText}
          onChange={condition.onSensoryNotesChange}
          rows={5}
          helperText="Use lines like Sight: ..., Sound: ..., Touch: ..., Smell: ..."
        />

        <TextAreaField
          label="Composer Guidance"
          value={condition.composerGuidance}
          onChange={condition.onComposerGuidanceChange}
          rows={5}
          helperText="Short guidance for how this weather should appear in scenes."
        />
      </div>

      {condition.blocked ? (
        <p className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs leading-5 text-red-100">
          This condition is known to the weather library but blocked for this location.
        </p>
      ) : null}
    </section>
  );
}

function EditorPanel({ title, children }) {
  return (
    <section className="rounded-2xl border border-[var(--muted-gold)]/20 bg-black/35 p-5">
      <h3 className="font-display text-3xl">{title}</h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function TextField({ label, value = "", onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value = "",
  onChange,
  rows = 5,
  helperText,
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        rows={rows}
        className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--muted-gold)]/50"
      />
      {helperText ? (
        <span className="mt-2 block text-xs leading-5 text-[var(--muted)]">
          {helperText}
        </span>
      ) : null}
    </label>
  );
}

function SelectField({ label, value = "", options = [], onChange }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--muted-gold)]/50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxField({ label, checked = false, onChange }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--muted)]">
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange?.(event.target.checked)}
        className="h-4 w-4 accent-[var(--muted-gold)]"
      />
      <span>{label}</span>
    </label>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted-gold)]">
        {label}
      </span>
      <div className="mt-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--muted)]">
        {value || "Not set"}
      </div>
    </label>
  );
}
