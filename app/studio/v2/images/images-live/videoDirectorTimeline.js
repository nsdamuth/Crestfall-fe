export const VIDEO_DIRECTOR_TIME_STEP_SECONDS = 0.1;
export const VIDEO_DIRECTOR_DEFAULT_CUE_SECONDS = 1;

function roundDirectorSecond(value) {
  return Math.round((Number(value) + Number.EPSILON) * 10) / 10;
}

function normalizeDuration(durationSeconds) {
  const duration = Number(durationSeconds);
  return Number.isFinite(duration) && duration > 0 ? roundDirectorSecond(duration) : 0;
}

function normalizeCueSecond(value, durationSeconds, fallback = 0) {
  const duration = normalizeDuration(durationSeconds);
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return roundDirectorSecond(Math.min(duration, Math.max(0, numeric)));
}

function nextCueId(cues = []) {
  const highest = cues.reduce((max, cue) => {
    const match = String(cue?.id || "").match(/^cue-(\d+)$/);
    return match ? Math.max(max, Number(match[1]) || 0) : max;
  }, 0);
  return `cue-${highest + 1}`;
}

export function createInitialVideoDirectorCues(durationSeconds) {
  const duration = normalizeDuration(durationSeconds);
  if (!duration) return [];
  return [
    {
      id: "cue-1",
      fromSecond: 0,
      toSecond: Math.min(VIDEO_DIRECTOR_DEFAULT_CUE_SECONDS, duration),
      prompt: "",
    },
  ];
}

export function updateVideoDirectorCue(
  cues = [],
  cueId,
  patch = {},
  { durationSeconds } = {}
) {
  const duration = normalizeDuration(durationSeconds);
  return cues.map((cue) => {
    if (cue?.id !== cueId) return cue;
    const next = { ...cue };

    if (Object.prototype.hasOwnProperty.call(patch, "fromSecond")) {
      next.fromSecond = normalizeCueSecond(
        patch.fromSecond,
        duration,
        cue.fromSecond
      );
    }
    if (Object.prototype.hasOwnProperty.call(patch, "toSecond")) {
      next.toSecond = normalizeCueSecond(
        patch.toSecond,
        duration,
        cue.toSecond
      );
    }
    if (Object.prototype.hasOwnProperty.call(patch, "prompt")) {
      next.prompt = String(patch.prompt || "");
    }

    return next;
  });
}

export function removeVideoDirectorCue(cues = [], cueId) {
  return cues.filter((cue) => cue?.id !== cueId);
}

export function clipVideoDirectorCuesToDuration(cues = [], durationSeconds) {
  const duration = normalizeDuration(durationSeconds);
  if (!duration) return [];

  return cues
    .filter((cue) => Number(cue?.fromSecond) < duration)
    .map((cue) => ({
      ...cue,
      fromSecond: normalizeCueSecond(cue.fromSecond, duration, 0),
      toSecond: normalizeCueSecond(cue.toSecond, duration, duration),
    }))
    .filter((cue) => cue.toSecond > cue.fromSecond);
}

function validRanges(cues = [], durationSeconds) {
  const duration = normalizeDuration(durationSeconds);
  return cues
    .map((cue) => ({
      fromSecond: Number(cue?.fromSecond),
      toSecond: Number(cue?.toSecond),
    }))
    .filter(
      (cue) =>
        Number.isFinite(cue.fromSecond) &&
        Number.isFinite(cue.toSecond) &&
        cue.fromSecond >= 0 &&
        cue.toSecond <= duration &&
        cue.toSecond > cue.fromSecond
    )
    .sort((left, right) => left.fromSecond - right.fromSecond || left.toSecond - right.toSecond);
}

export function getNextVideoDirectorCueRange(cues = [], durationSeconds) {
  const duration = normalizeDuration(durationSeconds);
  if (!duration) return null;

  let cursor = 0;
  for (const range of validRanges(cues, duration)) {
    if (range.fromSecond - cursor >= VIDEO_DIRECTOR_TIME_STEP_SECONDS) {
      return {
        fromSecond: roundDirectorSecond(cursor),
        toSecond: roundDirectorSecond(
          Math.min(cursor + VIDEO_DIRECTOR_DEFAULT_CUE_SECONDS, range.fromSecond)
        ),
      };
    }
    cursor = Math.max(cursor, range.toSecond);
  }

  if (duration - cursor < VIDEO_DIRECTOR_TIME_STEP_SECONDS) return null;
  return {
    fromSecond: roundDirectorSecond(cursor),
    toSecond: roundDirectorSecond(
      Math.min(cursor + VIDEO_DIRECTOR_DEFAULT_CUE_SECONDS, duration)
    ),
  };
}

export function addVideoDirectorCue(cues = [], durationSeconds) {
  const range = getNextVideoDirectorCueRange(cues, durationSeconds);
  if (!range) return cues;

  const nextCue = {
    id: nextCueId(cues),
    ...range,
    prompt: "",
  };

  const next = [...cues, nextCue];
  return next.sort(
    (left, right) =>
      Number(left.fromSecond) - Number(right.fromSecond) ||
      Number(left.toSecond) - Number(right.toSecond)
  );
}

export function projectVideoDirectorRows(cues = [], durationSeconds) {
  const duration = normalizeDuration(durationSeconds);
  const ranges = cues.map((cue) => ({
    id: cue?.id,
    fromSecond: Number(cue?.fromSecond),
    toSecond: Number(cue?.toSecond),
  }));

  return cues.map((cue, index) => {
    const fromSecond = Number(cue?.fromSecond);
    const toSecond = Number(cue?.toSecond);
    let errorText = "";

    if (!Number.isFinite(fromSecond) || !Number.isFinite(toSecond)) {
      errorText = "Enter a valid time range.";
    } else if (fromSecond < 0 || toSecond > duration) {
      errorText = `Keep the cue between 0 and ${duration}s.`;
    } else if (fromSecond >= toSecond) {
      errorText = "Start time must be before end time.";
    } else {
      const overlaps = ranges.some(
        (other) =>
          other.id !== cue?.id &&
          Number.isFinite(other.fromSecond) &&
          Number.isFinite(other.toSecond) &&
          other.fromSecond >= 0 &&
          other.toSecond <= duration &&
          other.toSecond > other.fromSecond &&
          fromSecond < other.toSecond &&
          toSecond > other.fromSecond
      );
      if (overlaps) errorText = "Director cues cannot overlap.";
    }

    return {
      id: String(cue?.id || `cue-${index + 1}`),
      index,
      fromSecond,
      toSecond,
      prompt: String(cue?.prompt || ""),
      isInvalid: Boolean(errorText),
      errorText,
    };
  });
}
