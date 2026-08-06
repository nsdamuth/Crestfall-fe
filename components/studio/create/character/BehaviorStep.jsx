
import {
    StepTitle,
    TextAreaField,
} from "@/components/studio/create/character/CharacterCreatorUtils"
import PersonalityModal from "@/components/studio/create/character/PersonalityModal";
import TraitModal from "@/components/studio/create/character/TraitModal";
import VoiceModulePickerModal from "@/components/studio/create/character/VoiceModulePickerModal";
import CrestfallSelect from "@/components/ui/CrestfallSelect";
import {
  eastAsianZodiacOptions,
  interestOptions,
  mbtiTypeOptions,
  movementStyleOptions,
  speechStyleOptions,
  westernZodiacOptions,
} from "@/components/studio/create/character/constants/constants"

export default function BehaviorStep({ form, updateField }) {
  return (
    <div>
      <StepTitle
        title="Behavior"
        body="Define how this character speaks, moves, thinks, and expresses themselves. These choices help prevent every character from feeling the same."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <PersonalityModal
          label="Outward Personality"
          field="outward_personality"
          form={form}
          updateField={updateField}
        />

        <PersonalityModal
          label="Internal Personality"
          field="internal_personality"
          form={form}
          updateField={updateField}
        />

        <div className="md:col-span-2 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
            Optional Personality Frameworks
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
            These provide soft narrative flavor when the composer needs more
            characterization. They are optional and never override explicit
            personality choices, behavior settings, or creator notes.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <TraitModal
              label="MBTI Personality Type"
              field="mbti_type"
              form={form}
              updateField={updateField}
              options={mbtiTypeOptions}
              description="Choose an optional MBTI-style archetype for supplemental personality flavor only."
            />

            <TraitModal
              label="Western Zodiac"
              field="western_zodiac_sign"
              form={form}
              updateField={updateField}
              options={westernZodiacOptions}
              description="Choose an optional Western zodiac archetype for supplemental narrative flavor only."
            />

            <TraitModal
              label="East Asian Zodiac"
              field="east_asian_zodiac_sign"
              form={form}
              updateField={updateField}
              options={eastAsianZodiacOptions}
              description="Choose an optional East Asian zodiac animal for supplemental narrative flavor only."
            />
          </div>
        </div>

      <TraitModal
        label="Speech Style"
        field="speech_style"
        form={form}
        updateField={updateField}
        options={speechStyleOptions}
        description="How the character tends to speak in dialogue."
      />

      <TraitModal
        label="Movement Style"
        field="movement_style"
        form={form}
        updateField={updateField}
        options={movementStyleOptions}
        description="How the character physically carries themselves in scenes."
      />

        <VoiceModulePickerModal
          value={
            Array.isArray(form.voice_module_ids)
              ? form.voice_module_ids
              : []
          }
          onChange={(nextVoiceModuleIds) =>
            updateField("voice_module_ids", nextVoiceModuleIds)
          }
          description="Attach one or more reusable tone, emphasis, accent, or dialogue modules. These modify expression without replacing the character’s core voice."
        />
        <CrestfallSelect
          label="Verbosity"
          value={form.verbosity_level}
          onChange={(value) => updateField("verbosity_level", value)}
          options={[
            { value: "1", label: "1 · Terse" },
            { value: "2", label: "2 · Concise" },
            { value: "3", label: "3 · Balanced" },
            { value: "4", label: "4 · Expressive" },
            { value: "5", label: "5 · Highly Verbose" },
          ]}
          description="Controls how talkative the character should be during scenes."
        />

      <TraitModal
            label="Interests"
            field="interests"
            form={form}
            updateField={updateField}
            options={interestOptions}
            description="Core subjects, goals, or fascinations the character naturally gravitates toward."
          />
        <div className="md:col-span-2">
          <TextAreaField
            label="Philosophy"
            value={form.philosophy}
            onChange={(value) => updateField("philosophy", value)}
            placeholder="What does this character believe about the world, people, power, duty, freedom, love, fear, or survival?"
          />
        </div>
      </div>
    </div>
  );
}