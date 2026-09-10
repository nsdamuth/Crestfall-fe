export const IMAGE_STUDIO_OUTPUT_COUNT_BACKEND_MAX = 4;
export const IMAGE_STUDIO_DEFAULT_MIN_OUTPUT_COUNT = 2;

function normalizeInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function resolveImageStudioMinimumOutputCount(
  value = process.env.NEXT_PUBLIC_CRESTFALL_IMAGE_STUDIO_MIN_OUTPUT_COUNT
) {
  const parsed = normalizeInteger(value, IMAGE_STUDIO_DEFAULT_MIN_OUTPUT_COUNT);
  return Math.min(
    Math.max(parsed, 1),
    IMAGE_STUDIO_OUTPUT_COUNT_BACKEND_MAX
  );
}

export const IMAGE_STUDIO_MIN_OUTPUT_COUNT =
  resolveImageStudioMinimumOutputCount();

export function clampImageStudioOutputCount(
  value,
  {
    minimum = IMAGE_STUDIO_MIN_OUTPUT_COUNT,
    maximum = IMAGE_STUDIO_OUTPUT_COUNT_BACKEND_MAX,
  } = {}
) {
  const safeMinimum = Math.min(Math.max(normalizeInteger(minimum, 1), 1), maximum);
  const parsed = normalizeInteger(value, safeMinimum);
  return Math.min(Math.max(parsed, safeMinimum), maximum);
}

export function buildImageStudioOutputCountValues(
  minimum = IMAGE_STUDIO_MIN_OUTPUT_COUNT
) {
  const safeMinimum = resolveImageStudioMinimumOutputCount(minimum);
  const canonical = [1, 2, 4, 8, 16, 32, 64, 128, 256];
  const values = new Set([safeMinimum]);

  canonical.forEach((count) => {
    if (count >= safeMinimum) values.add(count);
  });

  return [...values].sort((left, right) => left - right);
}
