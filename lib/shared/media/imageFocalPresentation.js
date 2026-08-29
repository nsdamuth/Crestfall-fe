export const IMAGE_FOCAL_ANALYSIS_FACE_SOURCE = "FACE_DETECTION";

const HORIZONTAL_TARGET_X = Object.freeze({
  LEFT: 0.25,
  CENTER: 0.5,
  RIGHT: 0.75,
});

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function normalizeFiniteNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function clampUnit(value) {
  const parsed = normalizeFiniteNumber(value);
  if (parsed == null) return null;
  return Math.min(Math.max(parsed, 0), 1);
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function formatPercent(value) {
  const percent = Math.round(value * 1000) / 10;
  return `${Number.isInteger(percent) ? percent.toFixed(0) : percent}%`;
}

export function getImagePresentationMetadata(value) {
  const source = normalizeObject(value);

  const direct = normalizeObject(
    source.presentationMetadata || source.presentation_metadata
  );
  if (Object.keys(direct).length) return direct;

  if (source.focalAnalysis || source.focal_analysis) {
    return source;
  }

  const providerMetadata = normalizeObject(
    source.providerMetadata || source.provider_metadata
  );
  const stored = normalizeObject(
    providerMetadata.crestfallImagePresentation ||
      providerMetadata.crestfall_image_presentation
  );

  return Object.keys(stored).length ? stored : null;
}

export function getImageFocalAnalysis(value) {
  const presentationMetadata = getImagePresentationMetadata(value);
  if (!presentationMetadata) return null;

  const focalAnalysis = normalizeObject(
    presentationMetadata.focalAnalysis ||
      presentationMetadata.focal_analysis
  );

  return Object.keys(focalAnalysis).length ? focalAnalysis : null;
}

/**
 * Convert backend face-aware focal metadata into display-ready CSS object-position.
 *
 * Only FACE_DETECTION results override the caller's existing crop policy. A
 * DEFAULT_CENTER backend result means detection found nothing useful, so Views
 * retain their current fallback rather than replacing a hand-tuned banner anchor.
 */
export function resolveImageFocalObjectPosition(
  value,
  { fallback = null, verticalFallback = 0.2 } = {}
) {
  const focalAnalysis = getImageFocalAnalysis(value);
  if (!focalAnalysis) return fallback;

  const source = normalizeText(focalAnalysis.source).toUpperCase();
  if (
    source !== IMAGE_FOCAL_ANALYSIS_FACE_SOURCE ||
    focalAnalysis.faceDetected === false
  ) {
    return fallback;
  }

  const point = normalizeObject(
    focalAnalysis.focalPoint || focalAnalysis.focal_point
  );

  let x = clampUnit(point.x);
  let y = clampUnit(point.y);

  if (x == null) {
    const target = normalizeText(
      focalAnalysis.horizontalTarget || focalAnalysis.horizontal_target
    ).toUpperCase();
    x = HORIZONTAL_TARGET_X[target] ?? null;
  }

  if (x == null) return fallback;
  if (y == null) y = clampUnit(verticalFallback) ?? 0.2;

  return `${formatPercent(x)} ${formatPercent(y)}`;
}
