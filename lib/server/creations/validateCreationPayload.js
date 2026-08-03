import {
  CREATION_CONTENT_RATINGS,
  CREATION_DESCRIPTION_MAX,
  CREATION_TITLE_MAX,
  CREATION_TYPES,
  OWNER_EDITABLE_STATUSES,
  OWNER_EDITABLE_VISIBILITIES,
} from "@/lib/server/creations/constants";

function hasOwn(payload, key) {
  return Object.prototype.hasOwnProperty.call(payload, key);
}

function cleanString(value) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length ? trimmed : null;
}

function cleanOptionalString(value) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length ? trimmed : null;
}

function isPlainObject(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      !Array.isArray(value)
  );
}

export function normalizeCreationPayload(payload, { partial = false } = {}) {
  const errors = [];
  const normalized = {};

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {
      data: null,
      errors: ["Invalid creation payload."],
    };
  }

  if (!partial || hasOwn(payload, "type")) {
    const type = cleanString(payload.type);

    if (!type) {
      errors.push("Creation type is required.");
    } else if (!CREATION_TYPES.includes(type)) {
      errors.push("Invalid creation type.");
    } else {
      normalized.type = type;
    }
  }

  if (!partial || hasOwn(payload, "title")) {
    const title = cleanString(payload.title);

    if (!title) {
      errors.push("Creation title is required.");
    } else if (title.length > CREATION_TITLE_MAX) {
      errors.push(`Title must be ${CREATION_TITLE_MAX} characters or fewer.`);
    } else {
      normalized.title = title;
    }
  }

  if (hasOwn(payload, "description")) {
    const description = cleanOptionalString(payload.description);

    if (description && description.length > CREATION_DESCRIPTION_MAX) {
      errors.push(
        `Description must be ${CREATION_DESCRIPTION_MAX} characters or fewer.`
      );
    } else {
      normalized.description = description;
    }
  } else if (!partial) {
    normalized.description = null;
  }

  if (hasOwn(payload, "visibility")) {
    if (!OWNER_EDITABLE_VISIBILITIES.includes(payload.visibility)) {
      errors.push("Visibility must be PRIVATE or UNLISTED for draft editing.");
    } else {
      normalized.visibility = payload.visibility;
    }
  } else if (!partial) {
    normalized.visibility = "PRIVATE";
  }

  if (hasOwn(payload, "status")) {
    if (!OWNER_EDITABLE_STATUSES.includes(payload.status)) {
      errors.push("Status can only be DRAFT or ARCHIVED from this endpoint.");
    } else {
      normalized.status = payload.status;
    }
  } else if (!partial) {
    normalized.status = "DRAFT";
  }

  if (hasOwn(payload, "content_rating")) {
    if (!CREATION_CONTENT_RATINGS.includes(payload.content_rating)) {
      errors.push("Invalid content rating.");
    } else {
      normalized.content_rating = payload.content_rating;
    }
  } else if (!partial) {
    normalized.content_rating = "SFW";
  }

  if (hasOwn(payload, "data")) {
    if (!isPlainObject(payload.data)) {
      errors.push("Creation data must be an object.");
    } else {
      normalized.data = payload.data;
    }
  } else if (!partial) {
    normalized.data = {};
  }

  return {
    data: normalized,
    errors,
  };
}