import { useState } from "react";

import {
  ActionPanel,
  SectionTitle,
  SelectField,
} from "@/components/studio/my-creations/edit/sections/SharedFields";

function getTemplateActionClassName(emphasis) {
  if (emphasis === "primary") {
    return "cf-btn cf-btn--primary";
  }

  return "cf-btn cf-btn--secondary";
}

// Confirm step, ED1 (docs/plans/FABLE-GATE-2-STUDIO.md): a quiet
// trigger arms into an inline Confirm/Cancel pair on first tap, no
// window.confirm, matching the destructive-law shape for
// consequential (not destructive) actions. Wraps the existing
// ActionPanel unmodified: the panel's own button becomes the arm
// trigger, and a small Confirm/Cancel row replaces it once armed.
function ConfirmableActionPanel({ title, body, button, disabled, onConfirm }) {
  const [armed, setArmed] = useState(false);

  if (armed) {
    return (
      <div className="border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
        <p className="text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)]">
          {title}
        </p>
        <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          Are you sure? This confirms: {button}
        </p>
        <div className="mt-[var(--space-3)] flex flex-wrap gap-[var(--space-3)]">
          <button
            type="button"
            className="cf-btn cf-btn--primary"
            onClick={() => {
              setArmed(false);
              onConfirm?.();
            }}
          >
            Confirm
          </button>
          <button
            type="button"
            className="cf-btn cf-btn--secondary"
            onClick={() => setArmed(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <ActionPanel
      title={title}
      body={body}
      button={button}
      disabled={disabled}
      onClick={() => setArmed(true)}
    />
  );
}

function ConfirmableGhostAction({ label, disabled = false, onConfirm }) {
  const [armed, setArmed] = useState(false);

  if (armed) {
    return (
      <span className="inline-flex flex-wrap items-center gap-3 text-sm">
        <span className="text-[var(--ink-dim)]">Are you sure?</span>
        <button
          type="button"
          className="cf-btn cf-btn--secondary"
          onClick={() => {
            setArmed(false);
            onConfirm?.();
          }}
        >
          Confirm
        </button>
        <button
          type="button"
          className="cf-btn cf-btn--secondary"
          onClick={() => setArmed(false)}
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => setArmed(true)}
      className="cf-btn cf-btn--danger cf-btn--sm disabled:cursor-not-allowed disabled:opacity-[var(--state-disabled-opacity)]"
    >
      {label}
    </button>
  );
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
  unlistTitle = "Unlist for Editing",
  unlistDescription = "",
  showUnlist = false,
  unlistButtonLabel = "Unlist for editing",
  unlistDisabled = false,
  onUnlistForEditing = null,
  showCancelReview = false,
  cancelReviewButtonLabel = "Cancel review",
  cancelReviewDisabled = false,
  onCancelReview = null,
}) {
  return (
    <div>
      <SectionTitle
        eyebrow={sectionEyebrow}
        title={sectionTitle}
        body={sectionDescription}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label={visibilityLabel}
          value={visibilityValue}
          onChange={(value) => onSelectVisibility?.(value)}
          options={visibilityOptions}
        />

        <SelectField
          label={contentRatingLabel}
          value={contentRatingValue}
          onChange={(value) => onSelectContentRating?.(value)}
          options={contentRatingOptions}
        />
      </div>

      {/* Section 5, "Template Operations" (D4): inset hairline, ONE
          tier 4 label, one helper line, seated action row. The
          separate eyebrow/display-title stack this used to render
          (outranking the box's own header) collapses to a single
          label; templateEyebrow stays an accepted prop for callers
          that still pass it, unrendered here by design. */}
      <div className="mt-[var(--space-4)] border-t border-[var(--line-whisper)] pt-[var(--space-4)]">
        <p className="flex items-center gap-[var(--space-3)] text-[length:var(--text-label)] leading-[var(--lh-label)] uppercase tracking-[var(--track-label)] text-[var(--gold-ornament)] after:content-[''] after:h-px after:w-[var(--space-8)] after:shrink-0 after:bg-[image:var(--grad-rule)]">
          {templateTitle}
        </p>

        <p className="mt-[var(--space-2)] text-[length:var(--text-ui)] leading-[var(--lh-ui)] text-[var(--ink-dim)]">
          {templateDescription}
        </p>

        <div className="mt-[var(--space-3)] flex flex-wrap items-center gap-[var(--space-3)]">
          {templateActions.map((action) => (
            <span key={action.id} className="inline-flex items-center gap-[var(--space-2)]">
              <button
                type="button"
                disabled={action.disabled}
                className={getTemplateActionClassName(action.emphasis)}
              >
                {action.label}
              </button>
              {action.disabled ? (
                <span className="text-[length:var(--text-label)] leading-[var(--lh-label)] text-[var(--ink-faint)]">
                  Soon
                </span>
              ) : null}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-[var(--space-4)] grid gap-4 md:grid-cols-2">
        <ConfirmableActionPanel
          title={publicReviewTitle}
          body={publicReviewDescription}
          button={publicReviewButtonLabel}
          disabled={publicReviewDisabled}
          onConfirm={() => onSubmitPublicReview?.()}
        />

        <ConfirmableActionPanel
          title={canonReviewTitle}
          body={canonReviewDescription}
          button={canonReviewButtonLabel}
          disabled={canonReviewDisabled}
          onConfirm={() => onSubmitCanonReview?.()}
        />

        {showUnlist ? (
          <ConfirmableActionPanel
            title={unlistTitle}
            body={unlistDescription}
            button={unlistButtonLabel}
            disabled={unlistDisabled}
            onConfirm={() => onUnlistForEditing?.()}
          />
        ) : null}

        <div className="md:col-span-2 flex flex-wrap items-center gap-4">
          {reviewMessage ? (
            <p
              className={`text-[length:var(--text-ui)] leading-[var(--lh-ui)] ${
                reviewMessageTone === "error"
                  ? "text-[var(--status-danger)]"
                  : "text-[var(--status-success)]"
              }`}
            >
              {reviewMessage}
            </p>
          ) : null}

          {showCancelReview ? (
            <ConfirmableGhostAction
              label={cancelReviewButtonLabel}
              disabled={cancelReviewDisabled}
              onConfirm={() => onCancelReview?.()}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
