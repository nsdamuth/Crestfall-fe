export const imageReassignmentOwnedContextFixture =
  Object.freeze({
    version: "image_reassignment_transaction_v0",
    coinCost: 1,
    imageOutputId:
      "11111111-1111-4111-8111-111111111111",
    libraryEntryId:
      "22222222-2222-4222-8222-222222222222",
    sourceCreation: {
      id: "33333333-3333-4333-8333-333333333333",
      type: "CHARACTER",
      title: "Kessa Cindervell",
      status: "APPROVED",
      visibility: "PUBLIC",
      contentRating: "SFW",
    },
    targets: [
      {
        id: "44444444-4444-4444-8444-444444444444",
        type: "LOCATION",
        title: "Brasswhisker Workshop",
        status: "DRAFT",
        visibility: "PRIVATE",
        contentRating: "SFW",
      },
      {
        id: "55555555-5555-4555-8555-555555555555",
        type: "CHARACTER",
        title: "Mira Quill",
        status: "APPROVED",
        visibility: "PUBLIC",
        content_rating: "TEEN",
      },
    ],
  });

export const imageReassignmentReadyFixture =
  Object.freeze({
    open: true,
    status: "ready",
    canReassign: true,
    imageOutputId:
      "11111111-1111-4111-8111-111111111111",
    sourceCreationId:
      "33333333-3333-4333-8333-333333333333",
    context: imageReassignmentOwnedContextFixture,
    destinationCreationId:
      "44444444-4444-4444-8444-444444444444",
  });

export const imageReassignmentLoadingFixture =
  Object.freeze({
    open: true,
    status: "loading",
    canReassign: true,
    imageOutputId:
      "11111111-1111-4111-8111-111111111111",
    sourceCreationId:
      "33333333-3333-4333-8333-333333333333",
    context: null,
    destinationCreationId: "",
  });

export const imageReassignmentSubmittingFixture =
  Object.freeze({
    ...imageReassignmentReadyFixture,
    status: "submitting",
  });

export const imageReassignmentSuccessFixture =
  Object.freeze({
    ...imageReassignmentReadyFixture,
    status: "success",
    result: {
      ok: true,
      destinationCreationId:
        "44444444-4444-4444-8444-444444444444",
      destinationTitle:
        "Brasswhisker Workshop",
      coinsSpent: 1,
    },
  });

export const imageReassignmentNoTargetsFixture =
  Object.freeze({
    open: true,
    status: "ready",
    canReassign: true,
    imageOutputId:
      "11111111-1111-4111-8111-111111111111",
    sourceCreationId:
      "33333333-3333-4333-8333-333333333333",
    context: {
      ...imageReassignmentOwnedContextFixture,
      targets: [],
    },
    destinationCreationId: "",
  });

export const imageReassignmentErrorFixture =
  Object.freeze({
    ...imageReassignmentReadyFixture,
    status: "error",
    message:
      "This image is no longer assigned to the selected source asset. Refresh and try again.",
  });
