import assert from "node:assert/strict";

import {
  getImageFocalAnalysis,
  getImagePresentationMetadata,
  resolveImageFocalObjectPosition,
} from "./imageFocalPresentation.js";

const faceMetadata = {
  presentationMetadata: {
    focalAnalysis: {
      version: "image_focal_analysis_v1",
      faceDetected: true,
      faceCount: 1,
      focalPoint: { x: 0.72, y: 0.23 },
      horizontalTarget: "RIGHT",
      source: "FACE_DETECTION",
    },
  },
};

assert.equal(resolveImageFocalObjectPosition(faceMetadata), "72% 23%");
assert.equal(
  resolveImageFocalObjectPosition(
    {
      presentationMetadata: {
        focalAnalysis: {
          faceDetected: true,
          horizontalTarget: "LEFT",
          source: "FACE_DETECTION",
        },
      },
    },
    { verticalFallback: 0.18 }
  ),
  "25% 18%"
);

assert.equal(
  resolveImageFocalObjectPosition(
    {
      presentationMetadata: {
        focalAnalysis: {
          faceDetected: false,
          focalPoint: { x: 0.5, y: 0.5 },
          source: "DEFAULT_CENTER",
        },
      },
    },
    { fallback: "center 10%" }
  ),
  "center 10%"
);

assert.equal(
  resolveImageFocalObjectPosition({}, { fallback: "center center" }),
  "center center"
);

const providerWrapped = {
  providerMetadata: {
    crestfallImagePresentation: faceMetadata.presentationMetadata,
  },
};
assert.deepEqual(
  getImagePresentationMetadata(providerWrapped),
  faceMetadata.presentationMetadata
);
assert.equal(getImageFocalAnalysis(providerWrapped)?.faceCount, 1);

console.log(
  JSON.stringify(
    {
      diagnostic: "image_focal_presentation_v1",
      status: "PASSED",
      faceDetectionDrivesObjectPosition: true,
      horizontalFallbackSupported: true,
      defaultCenterPreservesExistingViewFallback: true,
      absentMetadataPreservesExistingViewFallback: true,
      providerMetadataCompatibilitySupported: true,
      browserInferenceDependencyIntroduced: false,
    },
    null,
    2
  )
);
