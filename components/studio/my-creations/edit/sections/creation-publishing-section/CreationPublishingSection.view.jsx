import { useState } from "react";

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
      <div className="rounded-[var(--radius-md)] border border-[var(--line-whisper)] bg-[var(--surface-1)] p-5">
        <h3 className="font-display text-[length:var(--text-lead)] leading-[var(--lh-lead)]">
          {title}
        </h3>
        <p className="mt-2 leading-7 text-[var(--ink-dim)]">
          Are you sure? This confirms: {button}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
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
      className="text-sm text-[var(--status-danger)] underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-45"
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
              className={`text-sm ${
                reviewMessageTone === "error"
                  ? "text-red-200"
                  : "text-emerald-200"
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
