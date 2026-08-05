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
  previewButtonLabel = "Preview Soon",
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
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={previewDisabled}
          onClick={() => onPreview?.()}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--ink-dim)] opacity-60"
        >
          <Eye size={14} />
          {previewButtonLabel}
        </button>
      </div>
    </div>
  );
}
