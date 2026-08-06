import { Sparkles } from "lucide-react";
import {
  StepTitle,
  TextField,
} from "@/components/studio/create/character/CharacterCreatorUtils";
import CrestfallSelect from "@/components/ui/CrestfallSelect";
import CrestfallOptionModal from "@/components/ui/CrestfallOptionModal";
import CharacterColorPaletteModal from "@/components/studio/create/character/CharacterColorPaletteModal";
import {
  CUSTOM_APPEARANCE_VALUE_MAX_LENGTH,
  genderPresentationOptions,
  roleArchetypeOptions,
  speciesOptions,
} from "@/components/studio/create/character/constants/constants";

export default function IdentityStep({ form, updateField, onOpenTemplates }) {
  return (
    <div>
      <StepTitle
        title="Identity"
        body="Start with the simplest version of who this character is. You can skip anything and refine it later."
      />

      <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/25 bg-[var(--gold-ornament)]/10 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
              <Sparkles size={14} />
              Character Templates
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
              Start from a built-in, personal, or community template. Applying a
              template prefills fields, then you can edit everything normally.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenTemplates}
            className="cf-btn cf-btn--primary"
          >
            Use template
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <TextField
          label="Name"
          value={form.name}
          onChange={(value) => updateField("name", value)}
        />
        <TextField
          label="Title"
          value={form.title}
          onChange={(value) => updateField("title", value)}
        />

        <div className="space-y-4">
          <CrestfallSelect
            label="Species"
            value={form.species}
            onChange={(value) => updateField("species", value)}
            options={speciesOptions}
          />

          {form.species === "CUSTOM" ? (
            <TextField
              label="Custom Species"
              value={form.custom_species || ""}
              onChange={(value) =>
                updateField(
                  "custom_species",
                  value.slice(0, CUSTOM_APPEARANCE_VALUE_MAX_LENGTH)
                )
              }
              placeholder="Describe the character’s species or ancestry."
            />
          ) : null}
        </div>

        <div className="space-y-4">
          <CrestfallSelect
            label="Gender Presentation"
            value={form.gender_presentation}
            onChange={(value) => updateField("gender_presentation", value)}
            options={genderPresentationOptions}
          />

          {form.gender_presentation === "CUSTOM" ? (
            <TextField
              label="Custom Gender Presentation"
              value={form.custom_gender_presentation || ""}
              onChange={(value) =>
                updateField(
                  "custom_gender_presentation",
                  value.slice(0, CUSTOM_APPEARANCE_VALUE_MAX_LENGTH)
                )
              }
              placeholder="Describe how the character presents."
            />
          ) : null}
        </div>

        <CrestfallOptionModal
          title="Select Role Archetype"
          triggerLabel="Role Archetype"
          value={form.short_concept}
          onChange={(value) => updateField("short_concept", value)}
          options={roleArchetypeOptions}
          groups={["Fantasy", "Modern", "Sci-Fi"]}
          columns={3}
        />

        <div className="md:col-span-2">
          <CharacterColorPaletteModal
            value={form.character_color_palette_id}
            onChange={(value) =>
              updateField("character_color_palette_id", value)
            }
          />
        </div>
      </div>
    </div>
  );
}
