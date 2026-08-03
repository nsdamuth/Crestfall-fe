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
  bodyNotesLabel = "Custom Body Notes",
  bodyNotesValue = "",
  bodyNotesPlaceholder = "",
  onChangeBodyNotes = null,
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">{kibbePresetControl}</div>

        {bodyTypeControl}
        {heightControl}
        {buildControl}
        {proportionsControl}

        <div className="md:col-span-2">
          <TextAreaField
            label={bodyNotesLabel}
            value={bodyNotesValue}
            onChange={(value) => onChangeBodyNotes?.(value)}
            placeholder={bodyNotesPlaceholder}
          />
        </div>
      </div>
    </div>
  );
}
