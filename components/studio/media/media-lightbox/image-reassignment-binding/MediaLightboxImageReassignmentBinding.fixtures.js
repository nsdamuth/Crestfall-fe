export const mediaLightboxImageReassignmentActiveMediaFixture =
  Object.freeze({
    id: "media-1",
    title: "Workshop Study",
    imageOutputId:
      "11111111-1111-4111-8111-111111111111",
    sourceCreationId:
      "33333333-3333-4333-8333-333333333333",
    canReassign: true,
  });

export const mediaLightboxImageReassignmentReadyFixture =
  Object.freeze({
    activeMedia:
      mediaLightboxImageReassignmentActiveMediaFixture,
    reassignment: {
      open: true,
      status: "ready",
      message: "",
      context: {
        version:
          "image_reassignment_transaction_v0",
        coinCost: 1,
        imageOutputId:
          "11111111-1111-4111-8111-111111111111",
        sourceCreation: {
          id:
            "33333333-3333-4333-8333-333333333333",
          type: "CHARACTER",
          title: "Kessa Cindervell",
          contentRating: "SFW",
        },
        targets: [
          {
            id:
              "44444444-4444-4444-8444-444444444444",
            type: "LOCATION",
            title: "Brasswhisker Workshop",
            contentRating: "SFW",
          },
          {
            id:
              "55555555-5555-4555-8555-555555555555",
            type: "CHARACTER",
            title: "Mira Quill",
            contentRating: "TEEN",
          },
        ],
      },
      destinationCreationId:
        "44444444-4444-4444-8444-444444444444",
      result: null,
    },
  });

export const mediaLightboxImageReassignmentLoadingFixture =
  Object.freeze({
    activeMedia:
      mediaLightboxImageReassignmentActiveMediaFixture,
    reassignment: {
      open: true,
      status: "loading",
      message: "",
      context: null,
      destinationCreationId: "",
      result: null,
    },
  });

export const mediaLightboxImageReassignmentSubmittingFixture =
  Object.freeze({
    ...mediaLightboxImageReassignmentReadyFixture,
    reassignment: {
      ...mediaLightboxImageReassignmentReadyFixture.reassignment,
      status: "submitting",
    },
  });

export const mediaLightboxImageReassignmentSuccessFixture =
  Object.freeze({
    ...mediaLightboxImageReassignmentReadyFixture,
    reassignment: {
      ...mediaLightboxImageReassignmentReadyFixture.reassignment,
      status: "success",
      result: {
        ok: true,
        destinationCreationId:
          "44444444-4444-4444-8444-444444444444",
        destinationTitle:
          "Brasswhisker Workshop",
        coinsSpent: 1,
      },
    },
  });

export const mediaLightboxImageReassignmentErrorFixture =
  Object.freeze({
    ...mediaLightboxImageReassignmentReadyFixture,
    reassignment: {
      ...mediaLightboxImageReassignmentReadyFixture.reassignment,
      status: "error",
      message:
        "This image is no longer assigned to the selected source asset. Refresh and try again.",
      context: null,
      destinationCreationId: "",
    },
  });

export const mediaLightboxImageReassignmentUnavailableFixture =
  Object.freeze({
    activeMedia: {
      id: "media-2",
      title: "Public Catalogue Image",
      imageOutputId:
        "66666666-6666-4666-8666-666666666666",
      sourceCreationId:
        "77777777-7777-4777-8777-777777777777",
      canReassign: false,
    },
    reassignment: {
      open: false,
      status: "idle",
      context: null,
      destinationCreationId: "",
    },
  });

export const mediaLightboxImageReassignmentMissingSourceFixture =
  Object.freeze({
    activeMedia: {
      id: "media-3",
      title: "Unassigned Image",
      imageOutputId:
        "88888888-8888-4888-8888-888888888888",
      sourceCreationId: "",
      canReassign: true,
    },
    reassignment: {
      open: false,
      status: "idle",
      context: null,
      destinationCreationId: "",
    },
  });
