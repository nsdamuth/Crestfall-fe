export const VIDEO_DIRECTOR_JSON_CONTRACT_VERSION = "video_director_contract_v1";
export const VIDEO_DIRECTOR_JSON_AI_GUIDE_VERSION =
  "video_director_json_ai_authoring_guide_v1";
export const VIDEO_DIRECTOR_JSON_AI_GUIDE_FILENAME =
  "crestfall-video-director-json-ai-authoring-guide.md";
export const VIDEO_DIRECTOR_JSON_AI_GUIDE_MIME_TYPE =
  "text/markdown;charset=utf-8";

const ROOT_KEYS = Object.freeze([
  "contractVersion",
  "customPrompt",
  "timeline",
  "settings",
]);
const TIMELINE_KEYS = Object.freeze([
  "startSeconds",
  "endSeconds",
  "prompt",
]);
const SETTINGS_KEYS = Object.freeze([
  "durationSeconds",
  "aspectRatio",
  "quality",
]);

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function roundTenth(value) {
  return Math.round((Number(value) + Number.EPSILON) * 10) / 10;
}

function issue(path, message) {
  return { path, message };
}

function unknownKeys(value, allowedKeys) {
  if (!isPlainObject(value)) return [];
  const allowed = new Set(allowedKeys);
  return Object.keys(value).filter((key) => !allowed.has(key));
}

function displayAllowed(values = []) {
  return values.map((value) => `\`${value}\``).join(", ");
}

function normalizeCue(cue = {}, index = 0) {
  return {
    id: `cue-${index + 1}`,
    fromSecond: roundTenth(cue.startSeconds),
    toSecond: roundTenth(cue.endSeconds),
    prompt: String(cue.prompt || ""),
  };
}

export function buildVideoDirectorJsonDocument({
  customPrompt = "",
  cues = [],
  durationSeconds = 5,
  aspectRatio = "PORTRAIT_4_5",
  quality = "720p",
} = {}) {
  const timeline = (Array.isArray(cues) ? cues : [])
    .map((cue) => ({
      startSeconds: roundTenth(cue?.fromSecond),
      endSeconds: roundTenth(cue?.toSecond),
      prompt: String(cue?.prompt || ""),
    }))
    .sort(
      (left, right) =>
        left.startSeconds - right.startSeconds ||
        left.endSeconds - right.endSeconds
    );

  return {
    contractVersion: VIDEO_DIRECTOR_JSON_CONTRACT_VERSION,
    customPrompt: String(customPrompt || ""),
    timeline,
    settings: {
      durationSeconds: Number(durationSeconds),
      aspectRatio: String(aspectRatio || ""),
      quality: String(quality || ""),
    },
  };
}

export function formatVideoDirectorJsonData(value = {}) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function formatVideoDirectorJsonText(jsonText = "") {
  try {
    const parsed = JSON.parse(String(jsonText || ""));
    return {
      valid: true,
      data: parsed,
      text: formatVideoDirectorJsonData(parsed),
      error: null,
    };
  } catch (error) {
    return {
      valid: false,
      data: null,
      text: String(jsonText || ""),
      error: issue("$", error?.message || "Enter valid JSON."),
    };
  }
}

export function validateVideoDirectorJsonText(
  jsonText = "",
  {
    durationMin = 5,
    durationMax = 30,
    durationStep = 5,
    allowedAspectRatios = [],
    allowedQualities = [],
  } = {}
) {
  const formatted = formatVideoDirectorJsonText(jsonText);
  if (!formatted.valid) {
    return {
      valid: false,
      data: null,
      errors: [formatted.error],
      warnings: [],
      formattedText: formatted.text,
    };
  }

  const input = formatted.data;
  const errors = [];
  const warnings = [];

  if (!isPlainObject(input)) {
    errors.push(issue("$", "Video Director JSON must be one object."));
    return {
      valid: false,
      data: null,
      errors,
      warnings,
      formattedText: formatted.text,
    };
  }

  for (const key of unknownKeys(input, ROOT_KEYS)) {
    errors.push(
      issue(
        `$.${key}`,
        /(?:id|uuid|character|pose|outfit|location|preset|image|asset)/i.test(key)
          ? "Asset and Creation selections are not editable in Director JSON. Select them manually in Crestfall."
          : `Unknown root field \`${key}\` is not part of ${VIDEO_DIRECTOR_JSON_CONTRACT_VERSION}.`
      )
    );
  }

  if (input.contractVersion !== VIDEO_DIRECTOR_JSON_CONTRACT_VERSION) {
    errors.push(
      issue(
        "$.contractVersion",
        `contractVersion must be \`${VIDEO_DIRECTOR_JSON_CONTRACT_VERSION}\`.`
      )
    );
  }

  if (typeof input.customPrompt !== "string") {
    errors.push(issue("$.customPrompt", "customPrompt must be text."));
  }

  if (!Array.isArray(input.timeline)) {
    errors.push(issue("$.timeline", "timeline must be an array."));
  }

  if (!isPlainObject(input.settings)) {
    errors.push(issue("$.settings", "settings must be an object."));
  }

  const safeMin = Number(durationMin);
  const safeMax = Number(durationMax);
  const safeStep = Number(durationStep);
  const duration = Number(input.settings?.durationSeconds);

  if (isPlainObject(input.settings)) {
    for (const key of unknownKeys(input.settings, SETTINGS_KEYS)) {
      errors.push(
        issue(
          `$.settings.${key}`,
          `Unknown settings field \`${key}\` is not part of the Director JSON contract.`
        )
      );
    }

    if (!Number.isFinite(duration)) {
      errors.push(
        issue("$.settings.durationSeconds", "durationSeconds must be a number.")
      );
    } else {
      if (Number.isFinite(safeMin) && duration < safeMin) {
        errors.push(
          issue(
            "$.settings.durationSeconds",
            `durationSeconds must be at least ${safeMin}.`
          )
        );
      }
      if (Number.isFinite(safeMax) && duration > safeMax) {
        errors.push(
          issue(
            "$.settings.durationSeconds",
            `durationSeconds must be no more than ${safeMax}.`
          )
        );
      }
      if (
        Number.isFinite(safeStep) &&
        safeStep > 0 &&
        Number.isFinite(safeMin) &&
        Math.abs((duration - safeMin) / safeStep - Math.round((duration - safeMin) / safeStep)) >
          1e-9
      ) {
        errors.push(
          issue(
            "$.settings.durationSeconds",
            `durationSeconds must use the current ${safeStep}-second Video duration step.`
          )
        );
      }
    }

    const aspectRatio = String(input.settings.aspectRatio || "");
    if (!allowedAspectRatios.includes(aspectRatio)) {
      errors.push(
        issue(
          "$.settings.aspectRatio",
          `aspectRatio must be one of: ${displayAllowed(allowedAspectRatios)}.`
        )
      );
    }

    const quality = String(input.settings.quality || "");
    if (!allowedQualities.includes(quality)) {
      errors.push(
        issue(
          "$.settings.quality",
          `quality must be one of: ${displayAllowed(allowedQualities)}.`
        )
      );
    }
  }

  const normalizedTimeline = [];
  if (Array.isArray(input.timeline)) {
    input.timeline.forEach((cue, index) => {
      const path = `$.timeline[${index}]`;
      if (!isPlainObject(cue)) {
        errors.push(issue(path, "Each timeline cue must be an object."));
        return;
      }

      for (const key of unknownKeys(cue, TIMELINE_KEYS)) {
        errors.push(
          issue(
            `${path}.${key}`,
            `Unknown timeline field \`${key}\`. Cue ids and asset references are not part of Director JSON.`
          )
        );
      }

      const startSeconds = Number(cue.startSeconds);
      const endSeconds = Number(cue.endSeconds);
      const prompt = cue.prompt;

      if (!Number.isFinite(startSeconds)) {
        errors.push(issue(`${path}.startSeconds`, "startSeconds must be a number."));
      }
      if (!Number.isFinite(endSeconds)) {
        errors.push(issue(`${path}.endSeconds`, "endSeconds must be a number."));
      }
      if (typeof prompt !== "string") {
        errors.push(issue(`${path}.prompt`, "prompt must be text."));
      }

      if (Number.isFinite(startSeconds) && Number.isFinite(endSeconds)) {
        const roundedStart = roundTenth(startSeconds);
        const roundedEnd = roundTenth(endSeconds);
        if (Math.abs(roundedStart - startSeconds) > 1e-9) {
          errors.push(
            issue(
              `${path}.startSeconds`,
              "Director timing supports tenths of a second (0.1s precision)."
            )
          );
        }
        if (Math.abs(roundedEnd - endSeconds) > 1e-9) {
          errors.push(
            issue(
              `${path}.endSeconds`,
              "Director timing supports tenths of a second (0.1s precision)."
            )
          );
        }
        if (startSeconds < 0) {
          errors.push(issue(`${path}.startSeconds`, "Cue start cannot be negative."));
        }
        if (endSeconds <= startSeconds) {
          errors.push(
            issue(`${path}.endSeconds`, "Cue end must be after cue start.")
          );
        }
        if (Number.isFinite(duration) && endSeconds > duration) {
          errors.push(
            issue(
              `${path}.endSeconds`,
              `Cue must end at or before the ${duration}s video duration.`
            )
          );
        }

        normalizedTimeline.push({
          startSeconds: roundedStart,
          endSeconds: roundedEnd,
          prompt: typeof prompt === "string" ? prompt : "",
          sourceIndex: index,
        });
      }
    });
  }

  normalizedTimeline.sort(
    (left, right) =>
      left.startSeconds - right.startSeconds || left.endSeconds - right.endSeconds
  );

  for (let index = 1; index < normalizedTimeline.length; index += 1) {
    const previous = normalizedTimeline[index - 1];
    const current = normalizedTimeline[index];
    if (current.startSeconds < previous.endSeconds) {
      errors.push(
        issue(
          `$.timeline[${current.sourceIndex}]`,
          `Timeline cues cannot overlap (${previous.startSeconds}-${previous.endSeconds}s overlaps ${current.startSeconds}-${current.endSeconds}s). Gaps are allowed.`
        )
      );
    }
  }

  if (errors.length) {
    return {
      valid: false,
      data: null,
      errors,
      warnings,
      formattedText: formatted.text,
    };
  }

  const data = {
    contractVersion: VIDEO_DIRECTOR_JSON_CONTRACT_VERSION,
    customPrompt: input.customPrompt,
    timeline: normalizedTimeline.map(({ sourceIndex: _sourceIndex, ...cue }) => cue),
    settings: {
      durationSeconds: duration,
      aspectRatio: input.settings.aspectRatio,
      quality: input.settings.quality,
    },
  };

  return {
    valid: true,
    data,
    errors,
    warnings,
    formattedText: formatVideoDirectorJsonData(data),
  };
}

export function videoDirectorDocumentToCueState(document = {}) {
  return (Array.isArray(document.timeline) ? document.timeline : []).map(
    (cue, index) => normalizeCue(cue, index)
  );
}

export function buildVideoDirectorJsonAiAuthoringGuide(
  currentDocument = {},
  {
    durationMin = 5,
    durationMax = 30,
    durationStep = 5,
    allowedAspectRatios = [],
    allowedQualities = [],
  } = {}
) {
  const currentJson = formatVideoDirectorJsonData(currentDocument).trimEnd();

  return `# Crestfall Video Director JSON AI Authoring Guide

**Guide contract:** \`${VIDEO_DIRECTOR_JSON_AI_GUIDE_VERSION}\`

**Director contract:** \`${VIDEO_DIRECTOR_JSON_CONTRACT_VERSION}\`

## Your task

Modify the complete current Video Director JSON at the end of this guide according to the creator's request.

Return **one complete JSON object only**. Do not return Markdown fences, commentary, explanations, summaries, or partial fragments. The creator will paste the result into Crestfall and choose **Validate & Apply**.

## What this JSON may author

- \`customPrompt\`: the overall freeform video direction.
- \`timeline\`: precise temporal cues. Gaps are allowed. Cues may not overlap.
- \`settings.durationSeconds\`: current supported range ${durationMin}-${durationMax} seconds in ${durationStep}-second steps.
- \`settings.aspectRatio\`: one of ${displayAllowed(allowedAspectRatios)}.
- \`settings.quality\`: one of ${displayAllowed(allowedQualities)}.

## Asset authority — do not add ids

Character, source Image, Pose, Outfit, Location, and Image Preset selections are **not part of this JSON contract**. They are selected manually in Crestfall because those selections resolve authoritative Crestfall creations/media and UUIDs.

Do not add or invent:
- Character ids or UUIDs
- image/output/library ids or URLs
- Pose ids
- Outfit ids
- Location ids
- Image Preset ids
- any generic asset/reference id field

If the creator wants different assets, leave the JSON asset-free and tell them to select those assets manually in Crestfall outside the returned JSON.

## Timing law

- Use decimal numbers with at most one digit after the decimal point (0.1-second precision).
- Every cue must satisfy: \`0 <= startSeconds < endSeconds <= durationSeconds\`.
- Gaps are valid. A gap simply leaves that stretch governed by the overall custom prompt and provider behavior.
- Cues may not overlap.
- Keep cues in chronological order.
- An empty \`timeline\` is valid.

## Exact JSON shape

\`\`\`json
{
  "contractVersion": "${VIDEO_DIRECTOR_JSON_CONTRACT_VERSION}",
  "customPrompt": "Overall motion, scene beat, or direction.",
  "timeline": [
    {
      "startSeconds": 0,
      "endSeconds": 1,
      "prompt": "What happens in this stretch."
    }
  ],
  "settings": {
    "durationSeconds": ${durationMin},
    "aspectRatio": "${allowedAspectRatios[0] || ""}",
    "quality": "${allowedQualities[0] || ""}"
  }
}
\`\`\`

Do not add unknown fields. In particular, do not add cue ids, UUIDs, selected assets, provider settings, model names, seeds, costs, or backend job fields.

## Current Director JSON

\`\`\`json
${currentJson}
\`\`\`
`;
}
