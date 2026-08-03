import {
  ReadOnlyField,
  SectionTitle,
  TextField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function PoseIdentitySectionView({
  sectionEyebrow = "Pose Editor",
  sectionTitle = "Pose Identity",
  sectionDescription = "",
  nameLabel = "Pose Name",
  nameValue = "",
  categoryLabel = "Pose Type / Category",
  categoryValue = "",
  intendedUseLabel = "Intended Use",
  intendedUseValue = "",
  tagsLabel = "Tags",
  tagsValue = "",
  creationTypeLabel = "Creation Type",
  creationTypeValue = "",
  onChangeName = null,
  onChangeCategory = null,
  onChangeIntendedUse = null,
  onChangeTags = null,
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
          label={categoryLabel}
          value={categoryValue}
          onChange={(value) => onChangeCategory?.(value)}
        />

        <TextField
          label={intendedUseLabel}
          value={intendedUseValue}
          onChange={(value) => onChangeIntendedUse?.(value)}
        />

        <TextField
          label={tagsLabel}
          value={tagsValue}
          onChange={(value) => onChangeTags?.(value)}
        />

        <ReadOnlyField
          label={creationTypeLabel}
          value={creationTypeValue}
        />
      </div>
    </div>
  );
}
