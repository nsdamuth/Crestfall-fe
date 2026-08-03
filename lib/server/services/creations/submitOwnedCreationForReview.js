import { toCreationEditPayload } from "@/lib/server/services/creations/getOwnedCreationForEdit";

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

const SUBMITTABLE_STATUSES = ["DRAFT", "REJECTED"];

export async function submitOwnedCreationForReview({
  creationRepository,
  ownerId,
  creationId,
  reviewType,
}) {
  const normalizedReviewType = String(reviewType || "").toUpperCase();

  if (!["PUBLIC", "CANON"].includes(normalizedReviewType)) {
    return {
      data: null,
      error: null,
      validationErrors: ["Review type must be PUBLIC or CANON."],
      code: "INVALID_REVIEW_TYPE",
    };
  }

  const { data: currentCreation, error: loadError } =
    await creationRepository.getOwnedById({
      ownerId,
      creationId,
    });

  if (loadError) {
    return {
      data: null,
      error: loadError,
      validationErrors: [],
      code: "CREATION_LOAD_FAILED",
    };
  }

  if (!currentCreation) {
    return {
      data: null,
      error: null,
      validationErrors: [],
      code: "CREATION_NOT_FOUND",
    };
  }

  if (currentCreation.canon_status === "OFFICIAL") {
    return {
      data: null,
      error: null,
      validationErrors: [
        "Official canon creations cannot be resubmitted from owner tools.",
      ],
      code: "OFFICIAL_CANON_LOCKED",
    };
  }

  if (!SUBMITTABLE_STATUSES.includes(currentCreation.status)) {
    return {
      data: null,
      error: null,
      validationErrors: [
        "Only draft or rejected creations can be submitted for review.",
      ],
      code: "NOT_SUBMITTABLE",
    };
  }

  const currentData = isPlainObject(currentCreation.data)
    ? currentCreation.data
    : {};

  const review = isPlainObject(currentData.review)
    ? currentData.review
    : {};

  const submittedAt = new Date().toISOString();

  const reviewData =
    normalizedReviewType === "CANON"
      ? {
          requested_visibility: "PUBLIC",
          requested_canon_status: "OFFICIAL",
          previous_canon_status: currentCreation.canon_status || "NONE",
          canon_submitted_at: submittedAt,
          canon_review_status: "PENDING",
          last_submitted_at: submittedAt,
          last_submission_type: "CANON",
        }
      : {
          requested_visibility: "PUBLIC",
          public_submitted_at: submittedAt,
          public_review_status: "PENDING",
          last_submitted_at: submittedAt,
          last_submission_type: "PUBLIC",
        };

  const updates = {
    status: "IN_REVIEW",
    visibility:
      currentCreation.visibility === "UNLISTED" ? "UNLISTED" : "PRIVATE",
    data: {
      ...currentData,
      review: {
        ...review,
        ...reviewData,
      },
    },
  };

  if (normalizedReviewType === "CANON") {
    updates.canon_status = "CANDIDATE";
  }

  const { data: submittedCreation, error: updateError } =
    await creationRepository.updateOwned({
      ownerId,
      creationId,
      updates,
    });

  if (updateError) {
    return {
      data: null,
      error: updateError,
      validationErrors: [],
      code: "REVIEW_SUBMIT_FAILED",
    };
  }

  return {
    data: submittedCreation ? toCreationEditPayload(submittedCreation) : null,
    error: null,
    validationErrors: [],
    code: null,
  };
}