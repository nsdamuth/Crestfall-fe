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
