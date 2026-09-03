import {
  SectionTitle,
  TextAreaField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function CharacterBodySectionView({
  sectionEyebrow = "Character Editor",
  sectionTitle = "Body",
  sectionDescription = "",
  kibbePresetControl = null,
  bodyTypeControl = null,
  heightControl = null,
  buildControl = null,
  proportionsControl = null,
  bodyPromptLabel = "Custom Body Prompt",
  bodyPromptValue = "",
  bodyPromptPlaceholder = "",
  onChangeBodyPrompt = null,
  fantasyPromptLabel = "Fantasy Specific Prompt Details",
  fantasyPromptValue = "",
  fantasyPromptPlaceholder = "",
  onChangeFantasyPrompt = null,
  realisticPromptLabel = "Realistic Specific Prompt Details",
  realisticPromptValue = "",
  realisticPromptPlaceholder = "",
  onChangeRealisticPrompt = null,
}) {
  return (
    <div className="min-w-0 max-w-full">
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="grid min-w-0 max-w-full gap-4 md:grid-cols-2 [&>*]:min-w-0">
        <div className="md:col-span-2">{kibbePresetControl}</div>

        {bodyTypeControl}
        {heightControl}
        {buildControl}
        {proportionsControl}

        <div className="md:col-span-2">
          <TextAreaField
            label={bodyPromptLabel}
            value={bodyPromptValue}
            onChange={(value) => onChangeBodyPrompt?.(value)}
            placeholder={bodyPromptPlaceholder}
          />
        </div>

        <div>
          <TextAreaField
            label={fantasyPromptLabel}
            value={fantasyPromptValue}
            onChange={(value) => onChangeFantasyPrompt?.(value)}
            placeholder={fantasyPromptPlaceholder}
          />
        </div>

        <div>
          <TextAreaField
            label={realisticPromptLabel}
            value={realisticPromptValue}
            onChange={(value) => onChangeRealisticPrompt?.(value)}
            placeholder={realisticPromptPlaceholder}
          />
        </div>
      </div>
    </div>
  );
}
