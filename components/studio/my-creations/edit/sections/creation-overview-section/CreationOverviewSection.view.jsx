import { Eye } from "lucide-react";

import {
  SectionTitle,
  TextAreaField,
  TextField,
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
  previewButtonLabel = "Preview",
  previewDisabled = true,
  onChangeTitle = null,
  onChangeDescription = null,
  onPreview = null,
}) {
  return (
    <div className="min-w-0 max-w-full">
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="grid min-w-0 max-w-full gap-4 [&>*]:min-w-0">
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
        />
      </div>

      <div className="mt-[var(--space-4)] flex flex-wrap items-center gap-[var(--space-3)]">
        <button
          type="button"
          disabled={previewDisabled}
          onClick={() => onPreview?.()}
          className="cf-btn cf-btn--secondary"
        >
          <Eye size={14} />
          {previewButtonLabel}
        </button>
        {/* 4.7 composed disabled recipe: the word "Soon" lives beside
            the control as tier 8 meta, never baked into the label. */}
        {previewDisabled ? (
          <span className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-faint)]">
            Soon
          </span>
        ) : null}
      </div>
    </div>
  );
}
