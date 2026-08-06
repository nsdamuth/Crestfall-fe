import CrestfallSelect from "@/components/ui/CrestfallSelect";
import {
  ActionPanel,
  SectionTitle,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

function getTemplateActionClassName(emphasis) {
  if (emphasis === "primary") {
    return "cf-btn cf-btn--primary";
  }

  return "cf-btn cf-btn--secondary";
}

export default function CreationPublishingSectionView({
  sectionEyebrow = "Publishing",
  sectionTitle = "Publishing & Review",
  sectionDescription = "",
  visibilityLabel = "Visibility",
  visibilityValue = "PRIVATE",
  visibilityOptions = [],
  contentRatingLabel = "Content Rating",
  contentRatingValue = "SFW",
  contentRatingOptions = [],
  templateEyebrow = "Template Management",
  templateTitle = "Template Operations",
  templateDescription = "",
  templateActions = [],
  publicReviewTitle = "Public Review",
  publicReviewDescription = "",
  publicReviewButtonLabel = "Submit for Public Review",
  publicReviewDisabled = false,
  canonReviewTitle = "Canon Review",
  canonReviewDescription = "",
  canonReviewButtonLabel = "Submit for Canon Review",
  canonReviewDisabled = false,
  reviewMessage = "",
  reviewMessageTone = "success",
  onSelectVisibility = null,
  onSelectContentRating = null,
  onSubmitPublicReview = null,
  onSubmitCanonReview = null,
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <CrestfallSelect
          label={visibilityLabel}
          value={visibilityValue}
          onChange={(value) => onSelectVisibility?.(value)}
          options={visibilityOptions}
        />

        <CrestfallSelect
          label={contentRatingLabel}
          value={contentRatingValue}
          onChange={(value) => onSelectContentRating?.(value)}
          options={contentRatingOptions}
        />
      </div>

      <div className="mt-8 rounded-[var(--radius-md)] border border-[var(--gold-ornament)]/20 bg-black/25 p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold-ornament)]">
          {templateEyebrow}
        </p>

        <h3 className="mt-2 font-display text-3xl">{templateTitle}</h3>

        <p className="mt-3 leading-7 text-[var(--ink-dim)]">
          {templateDescription}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {templateActions.map((action) => (
            <button
              key={action.id}
              type="button"
              disabled={action.disabled}
              className={getTemplateActionClassName(action.emphasis)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <ActionPanel
          title={publicReviewTitle}
          body={publicReviewDescription}
          button={publicReviewButtonLabel}
          disabled={publicReviewDisabled}
          onClick={() => onSubmitPublicReview?.()}
        />

        <ActionPanel
          title={canonReviewTitle}
          body={canonReviewDescription}
          button={canonReviewButtonLabel}
          disabled={canonReviewDisabled}
          onClick={() => onSubmitCanonReview?.()}
        />

        {reviewMessage ? (
          <p
            className={`md:col-span-2 text-sm ${
              reviewMessageTone === "error"
                ? "text-red-200"
                : "text-emerald-200"
            }`}
          >
            {reviewMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}
