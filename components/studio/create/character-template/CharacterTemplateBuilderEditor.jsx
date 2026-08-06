"use client";

import CrestfallSelect from "@/components/ui/CrestfallSelect";
import CrestfallOptionModal from "@/components/ui/CrestfallOptionModal";
import SkinToneModal from "@/components/studio/create/character/SkinToneModal";
import HairEyesModal from "@/components/studio/create/character/HairEyesModal";
import PersonalityModal from "@/components/studio/create/character/PersonalityModal";
import TraitModal from "@/components/studio/create/character/TraitModal";
import MultiTraitModal from "@/components/studio/create/character/MultiTraitModal";
import KibbePresetModal from "@/components/studio/create/character/KibbePresetModal";
import {
  bodyTypeOptions,
  buildOptions,
  eastAsianZodiacOptions,
  heightOptions,
  interestOptions,
  mbtiTypeOptions,
  movementStyleOptions,
  proportionOptions,
  roleArchetypeOptions,
  speechStyleOptions,
  westernZodiacOptions,
} from "@/components/studio/create/character/constants/constants";

const speciesOptions = [
  { value: "", label: "Not chosen" },
  { value: "HUMAN", label: "Human" },
  { value: "BASTET", label: "Bastet / Catfolk" },
  { value: "KITSUNE", label: "Kitsune" },
  { value: "LAMIA", label: "Lamia / Gorgon" },
  { value: "GENIE", label: "Genie" },
  { value: "CONSTRUCT", label: "Construct / Robot" },
  { value: "DEMON", label: "Demon" },
  { value: "ANGEL", label: "Angel" },
  { value: "ELF", label: "Elf" },
  { value: "ALIEN", label: "Alien" },
  { value: "MERFOLK", label: "Merfolk" },
  { value: "CUSTOM", label: "Custom" },
];

const genderPresentationOptions = [
  { value: "", label: "Not chosen" },
  { value: "FEMALE", label: "Female" },
  { value: "MALE", label: "Male" },
  { value: "ANDROGYNOUS", label: "Androgynous" },
  { value: "CUSTOM", label: "Custom" },
];

const verbosityOptions = [
  { value: "", label: "Not chosen" },
  { value: "1", label: "1 · Terse" },
  { value: "2", label: "2 · Concise" },
  { value: "3", label: "3 · Balanced" },
  { value: "4", label: "4 · Expressive" },
  { value: "5", label: "5 · Highly Verbose" },
];

export default function CharacterTemplateBuilderEditor({
  activeStep,
  form,
  completion,
  filledFieldCount,
  sectionStatus,
  updateField,
}) {
  if (activeStep === "template") {
    return <TemplateInfoStep form={form} updateField={updateField} />;
  }

  if (activeStep === "identity") {
    return <IdentityDefaultsStep form={form} updateField={updateField} />;
  }

  if (activeStep === "appearance") {
    return <AppearanceDefaultsStep form={form} updateField={updateField} />;
  }

  if (activeStep === "body") {
    return <BodyDefaultsStep form={form} updateField={updateField} />;
  }

  if (activeStep === "behavior") {
    return <BehaviorDefaultsStep form={form} updateField={updateField} />;
  }

  if (activeStep === "review") {
    return (
      <ReviewTemplateStep
        form={form}
        completion={completion}
        filledFieldCount={filledFieldCount}
        sectionStatus={sectionStatus}
      />
    );
  }

  return null;
}

function TemplateInfoStep({ form, updateField }) {
  return (
    <StepPanel
      eyebrow="Template Info"
      title="Reusable Blueprint"
      body="Name and describe the archetype so creators can find and understand it later."
    >
      <div className="grid gap-4">
        <Field
          label="Template Name"
          value={form.title}
          placeholder="Badass Biker, Hero, Princess..."
          onChange={(value) => updateField("title", value)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Category"
            value={form.category}
            placeholder="Hero, Villain, Romance, Modern..."
            onChange={(value) => updateField("category", value)}
          />

          <Field
            label="Tags"
            value={form.tags}
            placeholder="hero, biker, romance, modern, fantasy"
            onChange={(value) => updateField("tags", value)}
          />
        </div>

        <TextAreaField
          label="Short Description"
          value={form.description}
          rows={3}
          placeholder="A short creator-facing summary of what this template helps create..."
          onChange={(value) => updateField("description", value)}
        />
      </div>
    </StepPanel>
  );
}

function IdentityDefaultsStep({ form, updateField }) {
  return (
    <StepPanel
      eyebrow="Identity Defaults"
      title="Starting Identity"
      body="Optional defaults for the Character Creator identity step. Leave fields blank when the creator should decide."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Default Name"
          value={form.name}
          placeholder="Usually blank unless this is for a named archetype."
          onChange={(value) => updateField("name", value)}
        />

        <Field
          label="Default Title"
          value={form.character_title}
          placeholder="The Crimson Knight, The Brasswhisker..."
          onChange={(value) => updateField("character_title", value)}
        />

        <CrestfallSelect
          label="Species"
          value={form.species}
          onChange={(value) => updateField("species", value)}
          options={speciesOptions}
        />

        <CrestfallSelect
          label="Gender Presentation"
          value={form.gender_presentation}
          onChange={(value) => updateField("gender_presentation", value)}
          options={genderPresentationOptions}
        />

        <div className="md:col-span-2">
          <CrestfallOptionModal
            title="Select Role Archetype"
            triggerLabel="Role Archetype"
            value={form.short_concept}
            onChange={(value) => updateField("short_concept", value)}
            options={roleArchetypeOptions}
            groups={["Fantasy", "Modern", "Sci-Fi"]}
            columns={3}
          />
        </div>
      </div>
    </StepPanel>
  );
}

function AppearanceDefaultsStep({ form, updateField }) {
  return (
    <StepPanel
      eyebrow="Appearance Defaults"
      title="First Visual Anchor"
      body="Reusable visual defaults for appearance and styling."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <SkinToneModal form={form} updateField={updateField} />

        <HairEyesModal
          label="Eye Color"
          summaryField="eye_color"
          form={form}
          updateField={updateField}
        />

        <HairEyesModal
          label="Hair Color"
          summaryField="hair_color"
          form={form}
          updateField={updateField}
        />

        <HairEyesModal
          label="Hair Style"
          summaryField="hair_style"
          form={form}
          updateField={updateField}
        />

        <div className="md:col-span-2">
          <Field
            label="Clothing Style"
            value={form.clothing_style}
            placeholder="Leather jacket, noble gown, silver armor..."
            onChange={(value) => updateField("clothing_style", value)}
          />
        </div>
      </div>
    </StepPanel>
  );
}

function BodyDefaultsStep({ form, updateField }) {
  return (
    <StepPanel
      eyebrow="Body Defaults"
      title="Silhouette"
      body="Optional physical silhouette defaults for the Body step."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <KibbePresetModal form={form} updateField={updateField} />
        </div>

        <TraitModal
          label="Body Type"
          field="body_type"
          form={form}
          updateField={updateField}
          options={bodyTypeOptions}
          description="Choose a broad body silhouette."
        />

        <TraitModal
          label="Height"
          field="height"
          form={form}
          updateField={updateField}
          options={heightOptions}
          description="Use relative adult height descriptors rather than exact measurements."
        />

        <TraitModal
          label="Build"
          field="build"
          form={form}
          updateField={updateField}
          options={buildOptions}
          description="Choose how the character’s frame feels physically."
        />

        <MultiTraitModal
          label="Proportions"
          field="proportions"
          form={form}
          updateField={updateField}
          options={proportionOptions}
          description="Optional silhouette emphasis for image generation and narration. You can select multiple compatible traits."
        />

        <div className="md:col-span-2">
          <TextAreaField
            label="Custom Body Notes"
            value={form.body_notes}
            placeholder="Optional physical details that should affect image generation or narration."
            onChange={(value) => updateField("body_notes", value)}
          />
        </div>
      </div>
    </StepPanel>
  );
}

function BehaviorDefaultsStep({ form, updateField }) {
  return (
    <StepPanel
      eyebrow="Behavior Defaults"
      title="Personality and Voice"
      body="Optional defaults for how this archetype speaks, moves, thinks, and expresses itself."
    >
      <div className="grid gap-4 md:grid-cols-2">
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
            These optional defaults provide soft narrative flavor when the
            composer needs more characterization. Explicit personality choices
            and creator guidance always take priority.
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

        <CrestfallSelect
          label="Verbosity"
          value={form.verbosity_level}
          onChange={(value) => updateField("verbosity_level", value)}
          options={verbosityOptions}
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
            placeholder="What does this archetype believe about the world?"
            onChange={(value) => updateField("philosophy", value)}
          />
        </div>
      </div>
    </StepPanel>
  );
}

function ReviewTemplateStep({
  form,
  completion,
  filledFieldCount,
  sectionStatus,
}) {
  return (
    <StepPanel
      eyebrow="Review"
      title="Review Template"
      body="Review the reusable defaults before saving. Advanced character-specific story fields are intentionally not part of templates yet."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <SummaryItem
          label="Template Name"
          value={form.title || "Untitled Template"}
        />
        <SummaryItem label="Category" value={form.category || "Not set"} />
        <SummaryItem label="Completion" value={`${completion}%`} />
        <SummaryItem label="Defaults Filled" value={String(filledFieldCount)} />
      </div>

      <div className="mt-5 rounded-[var(--radius-md)] border border-white/10 bg-black/25 p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
          Filled Sections
        </p>

        <div className="mt-4 grid gap-2 md:grid-cols-2">
          <SectionStatus label="Template Info" active={sectionStatus.template} />
          <SectionStatus
            label="Identity Defaults"
            active={sectionStatus.identity}
          />
          <SectionStatus
            label="Appearance Defaults"
            active={sectionStatus.appearance}
          />
          <SectionStatus label="Body Defaults" active={sectionStatus.body} />
          <SectionStatus
            label="Behavior Defaults"
            active={sectionStatus.behavior}
          />
        </div>
      </div>
    </StepPanel>
  );
}

function StepPanel({ eyebrow, title, body, children }) {
  return (
    <section>
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold-ornament)]">
        {eyebrow}
      </p>

      <h3 className="mt-2 font-display text-4xl">{title}</h3>

      <p className="mt-3 max-w-3xl leading-7 text-[var(--ink-dim)]">{body}</p>

      <div className="mt-6">{children}</div>
    </section>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold-ornament)]">
        {label}
      </p>
      <p className="mt-1 text-sm text-[var(--ink)]">{value}</p>
    </div>
  );
}

function Field({ label, value, placeholder, onChange }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
    </label>
  );
}

function SectionStatus({ label, active }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3">
      <p className="text-sm text-[var(--ink)]">{label}</p>
      <p
        className={`mt-1 text-xs ${
          active ? "text-emerald-200" : "text-[var(--ink-dim)]"
        }`}
      >
        {active ? "Has defaults" : "No defaults set"}
      </p>
    </div>
  );
}

function TextAreaField({
  label,
  value,
  placeholder,
  onChange,
  rows = 4,
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold-ornament)]">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-[var(--ink)] outline-none placeholder:text-[var(--ink-dim)] focus:border-[var(--gold-ornament)]/50"
      />
    </label>
  );
}
