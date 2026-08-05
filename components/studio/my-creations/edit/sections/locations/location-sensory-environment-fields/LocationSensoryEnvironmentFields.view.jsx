import { Ear, Eye, Plus, Trash2, Wind, X } from "lucide-react";

function ScaleField({
  label,
  value,
  onChange,
  helperText = "",
  min = 1,
  max = 10,
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
        {label}
      </span>

      <input
        type="number"
        min={min}
        max={max}
        step="1"
        value={value ?? ""}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder="Inherit"
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />

      {helperText ? (
        <span className="mt-2 block text-xs leading-5 text-[var(--ink-dim)]">
          {helperText}
        </span>
      ) : null}
    </label>
  );
}

function SenseCard({ icon, eyebrow, title, body, children }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-xl border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 p-3 text-[var(--gold-ornament)]">
          {icon}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
            {eyebrow}
          </p>
          <h3 className="mt-1 font-display text-2xl">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">{body}</p>
        </div>
      </div>

      <div className="mt-5">{children}</div>
    </div>
  );
}

function ScentTagEditor({
  noteIndex,
  tags = [],
  draft = "",
  canAddTags = false,
  onChangeDraft,
  onAddTags,
  onRemoveTag,
}) {
  return (
    <div className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
        Tags
      </span>

      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(event) => onChangeDraft?.(noteIndex, event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;

            event.preventDefault();
            onAddTags?.(noteIndex);
          }}
          placeholder="e.g., industrial"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
        />

        <button
          type="button"
          onClick={() => onAddTags?.(noteIndex)}
          disabled={!canAddTags}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Add scent tag"
        >
          <Plus size={15} />
        </button>
      </div>

      <span className="mt-2 block text-xs leading-5 text-[var(--ink-dim)]">
        Type a tag, then press Enter or the plus button. Commas are also accepted when pasting multiple tags.
      </span>

      {tags.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.toLowerCase()}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-xs text-[var(--ink)]"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemoveTag?.(noteIndex, tag)}
                className="inline-flex items-center gap-1 text-[var(--status-danger)] transition"
                aria-label={`Remove ${tag} tag`}
              >
                <X size={13} />
                <span className="text-[10px]">Remove</span>
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function LocationSensoryEnvironmentFieldsView({
  guidanceText = "",
  scaleMin = 1,
  scaleMax = 10,
  visionEyebrow = "Vision",
  visionTitle = "Light and Visibility",
  visionDescription = "",
  visionLightLevelValue = null,
  visionObstructionLevelValue = null,
  visionGlareLevelValue = null,
  hearingEyebrow = "Hearing",
  hearingTitle = "Sound Environment",
  hearingDescription = "",
  hearingAmbientNoiseLevelValue = null,
  hearingObstructionLevelValue = null,
  hearingEchoLevelValue = null,
  scentEyebrow = "Scent",
  scentTitle = "Ambient Scent Palette",
  scentDescription = "",
  scentMaskingLevelValue = null,
  scentDispersalLevelValue = null,
  scentNotes = [],
  emptyScentNotesText = "",
  addScentNoteLabel = "Add Scent Note",
  onChangeVisionLightLevel = null,
  onChangeVisionObstructionLevel = null,
  onChangeVisionGlareLevel = null,
  onChangeHearingAmbientNoiseLevel = null,
  onChangeHearingObstructionLevel = null,
  onChangeHearingEchoLevel = null,
  onChangeScentMaskingLevel = null,
  onChangeScentDispersalLevel = null,
  onChangeScentNoteLabel = null,
  onChangeScentNoteStrength = null,
  onChangeScentTagDraft = null,
  onAddScentTags = null,
  onRemoveScentTag = null,
  onAddScentNote = null,
  onRemoveScentNote = null,
} = {}) {
  return (
    <div>
      <div className="rounded-xl border border-[var(--gold-ornament)]/20 bg-[var(--gold-ornament)]/5 px-4 py-3 text-sm leading-6 text-[var(--ink-dim)]">
        {guidanceText}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <SenseCard
          icon={<Eye size={19} />}
          eyebrow={visionEyebrow}
          title={visionTitle}
          body={visionDescription}
        >
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
            <ScaleField
              label="Light Level"
              value={visionLightLevelValue}
              onChange={onChangeVisionLightLevel}
              min={scaleMin}
              max={scaleMax}
              helperText="1 is effectively lightless, 2 resembles a moonless night, 5 is ordinary dim indoor light, and 8 is clear daylight."
            />

            <ScaleField
              label="Visual Obstruction"
              value={visionObstructionLevelValue}
              onChange={onChangeVisionObstructionLevel}
              min={scaleMin}
              max={scaleMax}
              helperText="Fog, smoke, dust, clutter, foliage, crowds, partitions, or other conditions that complicate sight."
            />

            <ScaleField
              label="Glare Level"
              value={visionGlareLevelValue}
              onChange={onChangeVisionGlareLevel}
              min={scaleMin}
              max={scaleMax}
              helperText="Reflected light, magical radiance, forge glow, snow glare, or other brightness that can overwhelm vision."
            />
          </div>
        </SenseCard>

        <SenseCard
          icon={<Ear size={19} />}
          eyebrow={hearingEyebrow}
          title={hearingTitle}
          body={hearingDescription}
        >
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
            <ScaleField
              label="Ambient Noise"
              value={hearingAmbientNoiseLevelValue}
              onChange={onChangeHearingAmbientNoiseLevel}
              min={scaleMin}
              max={scaleMax}
              helperText="Crowds, machinery, weather, music, traffic, wildlife, or other background noise."
            />

            <ScaleField
              label="Sound Obstruction"
              value={hearingObstructionLevelValue}
              onChange={onChangeHearingObstructionLevel}
              min={scaleMin}
              max={scaleMax}
              helperText="Walls, heavy doors, insulation, terrain, water, or other barriers that suppress sound."
            />

            <ScaleField
              label="Echo Level"
              value={hearingEchoLevelValue}
              onChange={onChangeHearingEchoLevel}
              min={scaleMin}
              max={scaleMax}
              helperText="Echo may reveal that something made a sound while making its exact position harder to determine."
            />
          </div>
        </SenseCard>
      </div>

      <div className="mt-4">
        <SenseCard
          icon={<Wind size={19} />}
          eyebrow={scentEyebrow}
          title={scentTitle}
          body={scentDescription}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <ScaleField
              label="Scent Masking"
              value={scentMaskingLevelValue}
              onChange={onChangeScentMaskingLevel}
              min={scaleMin}
              max={scaleMax}
              helperText="Strong ambient odors that make characters, items, or temporary scent traces harder to distinguish."
            />

            <ScaleField
              label="Scent Dispersal"
              value={scentDispersalLevelValue}
              onChange={onChangeScentDispersalLevel}
              min={scaleMin}
              max={scaleMax}
              helperText="How readily scent travels through the space due to openness, airflow, ventilation, or similar narrative factors."
            />
          </div>

          <div className="mt-5 grid gap-3">
            {scentNotes.length ? (
              scentNotes.map((note) => (
                <div
                  key={note.loomViewId}
                  className="grid gap-3 rounded-xl border border-white/10 bg-black/30 p-4 md:grid-cols-[1fr_150px_1fr_auto] md:items-end"
                >
                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
                      Scent Note
                    </span>
                    <input
                      type="text"
                      value={note.label}
                      onChange={(event) =>
                        onChangeScentNoteLabel?.(note.loomRowIndex, event.target.value)
                      }
                      placeholder="e.g., machine oil"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
                    />
                  </label>

                  <ScaleField
                    label="Strength"
                    value={note.strength}
                    onChange={(value) =>
                      onChangeScentNoteStrength?.(note.loomRowIndex, value)
                    }
                    min={scaleMin}
                    max={scaleMax}
                  />

                  <ScentTagEditor
                    noteIndex={note.loomRowIndex}
                    tags={note.tags}
                    draft={note.tagDraft}
                    canAddTags={note.canAddTags}
                    onChangeDraft={onChangeScentTagDraft}
                    onAddTags={onAddScentTags}
                    onRemoveTag={onRemoveScentTag}
                  />

                  <button
                    type="button"
                    onClick={() => onRemoveScentNote?.(note.loomRowIndex)}
                    className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-white/10 px-3 py-2 text-[length:var(--text-label)] uppercase tracking-[var(--track-label)] text-[var(--status-danger)] transition hover:bg-white/5"
                    aria-label={`Remove scent note ${note.loomRowIndex + 1}`}
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 bg-black/20 px-4 py-5 text-sm leading-6 text-[var(--ink-dim)]">
                {emptyScentNotesText}
              </div>
            )}

            <button
              type="button"
              onClick={() => onAddScentNote?.()}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)]"
            >
              <Plus size={14} />
              {addScentNoteLabel}
            </button>
          </div>
        </SenseCard>
      </div>
    </div>
  );
}
