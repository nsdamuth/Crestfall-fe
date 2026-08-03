import { toCreationEditPayload } from "@/lib/server/services/creations/getOwnedCreationForEdit";

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export async function cancelOwnedCreationReview({
  creationRepository,
  ownerId,
  creationId,
}) {
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
        "Official canon creations cannot be removed from review through owner tools.",
      ],
      code: "OFFICIAL_CANON_LOCKED",
    };
  }

  if (currentCreation.status !== "IN_REVIEW") {
    return {
      data: null,
      error: null,
      validationErrors: ["Only creations currently in review can be cancelled."],
      code: "NOT_IN_REVIEW",
    };
  }

  const currentData = isPlainObject(currentCreation.data)
    ? currentCreation.data
    : {};

  const review = isPlainObject(currentData.review)
    ? currentData.review
    : {};

  const cancelledAt = new Date().toISOString();

  const updates = {
    status: "DRAFT",
    visibility: "UNLISTED",
    data: {
      ...currentData,
      review: {
        ...review,
        needs_resubmission: true,
        cancelled_at: cancelledAt,
        cancelled_from_review_at: cancelledAt,
        last_review_status: "CANCELLED",
      },
    },
  };

  if (currentCreation.canon_status === "CANDIDATE") {
    updates.canon_status = review.previous_canon_status || "NONE";
  }

  const { data: updatedCreation, error: updateError } =
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
      code: "CANCEL_REVIEW_FAILED",
    };
  }

  return {
    data: updatedCreation ? toCreationEditPayload(updatedCreation) : null,
    error: null,
    validationErrors: [],
    code: null,
  };
}