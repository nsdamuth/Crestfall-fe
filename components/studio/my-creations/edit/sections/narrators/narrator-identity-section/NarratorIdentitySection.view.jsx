import {
  ReadOnlyField,
  SectionTitle,
  SelectField,
  TextField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function NarratorIdentitySectionView({
  sectionEyebrow = "Narrator Editor",
  sectionTitle = "Narrator Identity",
  sectionDescription = "",
  nameLabel = "Narrator Name",
  nameValue = "",
  tagsLabel = "Tags",
  tagsValue = "",
  toneLabel = "Tone",
  toneValue = "",
  toneOptions = [],
  creationTypeLabel = "Creation Type",
  creationTypeValue = "",
  onChangeName = null,
  onChangeTags = null,
  onSelectTone = null,
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-[var(--space-6)] grid gap-[var(--space-4)] md:grid-cols-2">
        <TextField
          label={nameLabel}
          value={nameValue}
          onChange={(value) => onChangeName?.(value)}
        />

        <TextField
          label={tagsLabel}
          value={tagsValue}
          onChange={(value) => onChangeTags?.(value)}
        />

        <SelectField
          label={toneLabel}
          value={toneValue}
          onChange={(value) => onSelectTone?.(value)}
          options={Array.isArray(toneOptions) ? toneOptions : []}
        />

        <ReadOnlyField
          label={creationTypeLabel}
          value={creationTypeValue}
        />
      </div>
    </div>
  );
}
