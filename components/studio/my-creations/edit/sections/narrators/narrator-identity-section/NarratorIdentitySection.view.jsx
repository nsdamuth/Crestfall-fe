import CrestfallSelect from "@/components/ui/CrestfallSelect";
import {
  ReadOnlyField,
  SectionTitle,
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

      <div className="mt-6 grid gap-4 md:grid-cols-2">
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

        <CrestfallSelect
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
