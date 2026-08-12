import { Eye } from "lucide-react";

import {
  SectionTitle,
  TextAreaField,
  TextField,
  SHORT_LONGFORM_MAX_LENGTH,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

export default function CreationOverviewSectionView({
  sectionEyebrow = "Creation Editor",
  sectionTitle = "Overview",
  sectionDescription = "",
  titleLabel = "Title",
  titleValue = "",
  descriptionLabel = "Public Description",
  descriptionValue = "",
  descriptionPlaceholder = "",
  previewButtonLabel = "Preview soon",
  previewDisabled = true,
  onChangeTitle = null,
  onChangeDescription = null,
  onPreview = null,
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-6 grid gap-4">
        <TextField
          label={titleLabel}
          value={titleValue}
          onChange={(value) => onChangeTitle?.(value)}
        />

        <TextAreaField
          label={descriptionLabel}
          value={descriptionValue}
          onChange={(value) => onChangeDescription?.(value)}
          placeholder={descriptionPlaceholder}
          maxLength={SHORT_LONGFORM_MAX_LENGTH}
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={previewDisabled}
          onClick={() => onPreview?.()}
          className="cf-btn cf-btn--secondary"
        >
          <Eye size={14} />
          {previewButtonLabel}
        </button>
      </div>
    </div>
  );
}
