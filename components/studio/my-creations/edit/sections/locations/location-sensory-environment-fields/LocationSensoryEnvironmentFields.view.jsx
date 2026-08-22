import { Ear, Eye, Plus, Trash2, Wind, X } from "lucide-react";
import { NumberField } from "@/components/studio/my-creations/edit/sections/SharedFields";

// Section 5 de-nesting: Vision/Hearing/Scent are sub-groups inside
// the section box, not repeatable list items, so they lose their
// bordered/backgrounded panel and icon plaque for the inset-hairline
// pattern with an inline icon.
function SenseCard({ icon, eyebrow, title, body, children }) {
  return (
    <div className="border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
      <div className="flex items-start gap-[var(--space-3)]">
        <span className="mt-[2px] flex-none text-[var(--gold-ornament)]">{icon}</span>

        <div>
          <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
            {eyebrow}
          </p>
          <h3 className="mt-[var(--space-1)] text-[length:var(--text-body)] leading-[var(--lh-body)] font-medium text-[var(--ink)]">
            {title}
          </h3>
          <p className="mt-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
            {body}
          </p>
        </div>
      </div>

      <div className="mt-[var(--space-5)]">{children}</div>
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
      <span className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
        Tags
      </span>

      <div className="mt-[var(--space-1)] flex gap-[var(--space-2)]">
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
          className="kit-focus min-w-0 flex-1 min-h-[var(--control-md)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-faint)] hover:border-[var(--state-hover-line)]"
        />

        <button
          type="button"
          onClick={() => onAddTags?.(noteIndex)}
          disabled={!canAddTags}
          className="inline-flex h-[var(--control-md)] w-[var(--control-md)] shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/35 bg-[var(--gold-ornament)]/10 text-[var(--gold-ornament)] transition hover:bg-[var(--gold-ornament)]/20 hover:text-[var(--ink)] disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]"
          aria-label="Add scent tag"
        >
          <Plus size={15} />
        </button>
      </div>

      <span className="mt-[var(--space-2)] block text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        Type a tag, then press Enter or the plus button. Commas are also accepted when pasting multiple tags.
      </span>

      {tags.length ? (
        <div className="mt-[var(--space-3)] flex flex-wrap gap-[var(--space-2)]">
          {tags.map((tag) => (
            <span
              key={tag.toLowerCase()}
              className="inline-flex items-center gap-[var(--space-2)] rounded-full border border-[var(--line-whisper)] bg-[var(--surface-1)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-ui)] text-[var(--ink)]"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemoveTag?.(noteIndex, tag)}
                className="inline-flex items-center gap-[var(--space-1)] text-[var(--status-danger)] transition"
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
  addScentNoteLabel = "Add scent note",
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
      {/* CLEANUP fix: guidance banner drops the gold-washed inner
          panel for a tier 7 helper line. */}
      <p className="text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
        {guidanceText}
      </p>

      <div className="mt-[var(--space-5)] grid gap-[var(--space-4)] xl:grid-cols-2">
        <SenseCard
          icon={<Eye size={19} />}
          eyebrow={visionEyebrow}
          title={visionTitle}
          body={visionDescription}
        >
          <div className="grid gap-[var(--space-4)] md:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
            <NumberField
              label="Light Level"
              value={visionLightLevelValue ?? ""}
              onChange={onChangeVisionLightLevel}
              min={scaleMin}
              max={scaleMax}
              placeholder="Inherit"
              helperText="1 is effectively lightless, 2 resembles a moonless night, 5 is ordinary dim indoor light, and 8 is clear daylight."
            />

            <NumberField
              label="Visual Obstruction"
              value={visionObstructionLevelValue ?? ""}
              onChange={onChangeVisionObstructionLevel}
              min={scaleMin}
              max={scaleMax}
              placeholder="Inherit"
              helperText="Fog, smoke, dust, clutter, foliage, crowds, partitions, or other conditions that complicate sight."
            />

            <NumberField
              label="Glare Level"
              value={visionGlareLevelValue ?? ""}
              onChange={onChangeVisionGlareLevel}
              min={scaleMin}
              max={scaleMax}
              placeholder="Inherit"
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
          <div className="grid gap-[var(--space-4)] md:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
            <NumberField
              label="Ambient Noise"
              value={hearingAmbientNoiseLevelValue ?? ""}
              onChange={onChangeHearingAmbientNoiseLevel}
              min={scaleMin}
              max={scaleMax}
              placeholder="Inherit"
              helperText="Crowds, machinery, weather, music, traffic, wildlife, or other background noise."
            />

            <NumberField
              label="Sound Obstruction"
              value={hearingObstructionLevelValue ?? ""}
              onChange={onChangeHearingObstructionLevel}
              min={scaleMin}
              max={scaleMax}
              placeholder="Inherit"
              helperText="Walls, heavy doors, insulation, terrain, water, or other barriers that suppress sound."
            />

            <NumberField
              label="Echo Level"
              value={hearingEchoLevelValue ?? ""}
              onChange={onChangeHearingEchoLevel}
              min={scaleMin}
              max={scaleMax}
              placeholder="Inherit"
              helperText="Echo may reveal that something made a sound while making its exact position harder to determine."
            />
          </div>
        </SenseCard>
      </div>

      <div className="mt-[var(--space-4)]">
        <SenseCard
          icon={<Wind size={19} />}
          eyebrow={scentEyebrow}
          title={scentTitle}
          body={scentDescription}
        >
          <div className="grid gap-[var(--space-4)] md:grid-cols-2">
            <NumberField
              label="Scent Masking"
              value={scentMaskingLevelValue ?? ""}
              onChange={onChangeScentMaskingLevel}
              min={scaleMin}
              max={scaleMax}
              placeholder="Inherit"
              helperText="Strong ambient odors that make characters, items, or temporary scent traces harder to distinguish."
            />

            <NumberField
              label="Scent Dispersal"
              value={scentDispersalLevelValue ?? ""}
              onChange={onChangeScentDispersalLevel}
              min={scaleMin}
              max={scaleMax}
              placeholder="Inherit"
              helperText="How readily scent travels through the space due to openness, airflow, ventilation, or similar narrative factors."
            />
          </div>

          <div className="mt-[var(--space-5)] grid gap-[var(--space-3)]">
            {scentNotes.length ? (
              scentNotes.map((note) => (
                <div
                  key={note.loomViewId}
                  className="grid gap-[var(--space-3)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-[var(--space-4)] md:grid-cols-[1fr_150px_1fr_auto] md:items-end"
                >
                  <label className="block">
                    <span className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--ink-faint)]">
                      Scent Note
                    </span>
                    <input
                      type="text"
                      value={note.label}
                      onChange={(event) =>
                        onChangeScentNoteLabel?.(note.loomRowIndex, event.target.value)
                      }
                      placeholder="e.g., machine oil"
                      className="kit-focus mt-[var(--space-1)] w-full min-h-[var(--control-md)] rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-2)] px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-faint)] hover:border-[var(--state-hover-line)]"
                    />
                  </label>

                  <NumberField
                    label="Strength"
                    value={note.strength ?? ""}
                    onChange={(value) => onChangeScentNoteStrength?.(note.loomRowIndex, value)}
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
                    className="cf-btn cf-btn--danger cf-btn--sm"
                    aria-label={`Remove scent note ${note.loomRowIndex + 1}`}
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-[length:var(--text-body)] leading-[var(--lh-body)] text-[var(--ink-dim)]">
                {emptyScentNotesText}
              </p>
            )}

            <button
              type="button"
              onClick={() => onAddScentNote?.()}
              className="cf-btn cf-btn--primary w-fit"
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
