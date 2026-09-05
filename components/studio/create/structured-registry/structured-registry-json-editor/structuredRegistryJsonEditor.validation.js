import { getStructuredRegistryConfig } from "../../../registries/structuredRegistryConfigs.js";
import {
  LINKED_CREATION_FIELDS,
  STRUCTURED_REGISTRY_VERSION,
  normalizeStructuredRegistryData,
} from "../../../registries/structuredRegistryUtils.js";

function issue(path, message) {
  return { path, message };
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function sourceLinkMap(data = {}) {
  const links = new Map();
  for (const entry of Array.isArray(data?.entries) ? data.entries : []) {
    const entryId = typeof entry?.id === "string" ? entry.id.trim() : "";
    if (!entryId) continue;

    for (const field of LINKED_CREATION_FIELDS) {
      for (const link of Array.isArray(entry?.[field]) ? entry[field] : []) {
        const creationId = typeof link?.creationId === "string"
          ? link.creationId.trim()
          : "";
        if (!creationId) continue;
        links.set(`${entryId}|${field}|${creationId}`, link);
      }
    }
  }
  return links;
}

export function formatStructuredRegistryJsonData(data = {}, registryType) {
  return JSON.stringify(
    normalizeStructuredRegistryData(data, registryType),
    null,
    2
  );
}

export function formatStructuredRegistryJsonText(text = "") {
  try {
    const data = JSON.parse(String(text || ""));
    return { valid: true, data, text: JSON.stringify(data, null, 2), error: null };
  } catch (error) {
    return {
      valid: false,
      data: null,
      text: String(text || ""),
      error: issue("$", error?.message || "Invalid JSON syntax."),
    };
  }
}

export function validateStructuredRegistryJsonText(
  text,
  { registryType, sourceData = {} } = {}
) {
  const parsed = formatStructuredRegistryJsonText(text);
  if (!parsed.valid) {
    return {
      valid: false,
      data: null,
      formattedText: String(text || ""),
      errors: [parsed.error],
      warnings: [],
    };
  }

  const expectedType = String(registryType || "").toUpperCase();
  const config = getStructuredRegistryConfig(expectedType);
  const errors = [];
  const warnings = [];
  const data = parsed.data;

  if (!isPlainObject(data)) {
    errors.push(issue("$", "Registry JSON must be one complete object."));
    return { valid: false, data: null, formattedText: parsed.text, errors, warnings };
  }

  if (String(data.registry_kind || "").toUpperCase() !== expectedType) {
    errors.push(
      issue(
        "$.registry_kind",
        `This editor only accepts ${expectedType}. Preserve the registry kind exactly.`
      )
    );
  }

  if (String(data.registry_version || "") !== STRUCTURED_REGISTRY_VERSION) {
    errors.push(
      issue(
        "$.registry_version",
        `Expected registry_version ${STRUCTURED_REGISTRY_VERSION}.`
      )
    );
  }

  if (!Array.isArray(data.entries)) {
    errors.push(issue("$.entries", "entries must be an array."));
  }

  if (data.relationships != null && !Array.isArray(data.relationships)) {
    errors.push(issue("$.relationships", "relationships must be an array."));
  }

  if (data.prompt_guidance != null && !isPlainObject(data.prompt_guidance)) {
    errors.push(issue("$.prompt_guidance", "prompt_guidance must be an object."));
  }

  if (data.middleware_hints != null && !isPlainObject(data.middleware_hints)) {
    errors.push(issue("$.middleware_hints", "middleware_hints must be an object."));
  }

  const allowedCategories = new Set(config.categoryOptions || []);
  const existingLinks = sourceLinkMap(sourceData);
  const seenEntryIds = new Set();
  let generatedLocalIdCount = 0;

  for (const [index, entry] of (Array.isArray(data.entries) ? data.entries : []).entries()) {
    const path = `$.entries[${index}]`;
    if (!isPlainObject(entry)) {
      errors.push(issue(path, "Each registry entry must be an object."));
      continue;
    }

    if (entry.id != null && typeof entry.id !== "string") {
      errors.push(issue(`${path}.id`, "Entry id must be a string when present."));
    } else if (typeof entry.id === "string" && entry.id.trim()) {
      const id = entry.id.trim();
      if (seenEntryIds.has(id)) {
        errors.push(issue(`${path}.id`, `Duplicate registry-local entry id: ${id}`));
      }
      seenEntryIds.add(id);
    } else {
      generatedLocalIdCount += 1;
    }

    if (entry.name != null && typeof entry.name !== "string") {
      errors.push(issue(`${path}.name`, "Entry name must be text."));
    }

    if (entry.category != null) {
      if (typeof entry.category !== "string") {
        errors.push(issue(`${path}.category`, "Entry category must be text."));
      } else if (!allowedCategories.has(entry.category)) {
        errors.push(
          issue(
            `${path}.category`,
            `Unsupported ${config.categoryLabel.toLowerCase()}: ${entry.category}. Use one of the builder's allowed values.`
          )
        );
      }
    }

    if (entry.aliases != null) {
      if (!Array.isArray(entry.aliases)) {
        errors.push(issue(`${path}.aliases`, "aliases must be an array of strings."));
      } else if (entry.aliases.some((alias) => typeof alias !== "string")) {
        errors.push(issue(`${path}.aliases`, "Every alias must be text."));
      }
    }

    for (const field of LINKED_CREATION_FIELDS) {
      const links = entry[field];
      if (links == null) continue;
      if (!Array.isArray(links)) {
        errors.push(issue(`${path}.${field}`, `${field} must be an array.`));
        continue;
      }

      for (const [linkIndex, link] of links.entries()) {
        const linkPath = `${path}.${field}[${linkIndex}]`;
        if (!isPlainObject(link)) {
          errors.push(issue(linkPath, "Linked creation references must be objects."));
          continue;
        }

        const creationId = typeof link.creationId === "string"
          ? link.creationId.trim()
          : "";

        if (creationId) {
          const entryId = typeof entry.id === "string" ? entry.id.trim() : "";
          const sourceKey = `${entryId}|${field}|${creationId}`;
          if (!entryId || !existingLinks.has(sourceKey)) {
            errors.push(
              issue(
                `${linkPath}.creationId`,
                "Do not invent, move, or add Creation relationships in JSON. Preserve already-linked IDs in the same existing entry/relationship field only, then use the visual link picker for new asset relationships."
              )
            );
          }
        }
      }
    }
  }

  if (generatedLocalIdCount) {
    warnings.push(
      issue(
        "$.entries",
        `${generatedLocalIdCount} new ${generatedLocalIdCount === 1 ? "entry" : "entries"} will receive fresh registry-local IDs when applied.`
      )
    );
  }

  if ((Array.isArray(data.entries) ? data.entries.length : 0) > 250) {
    warnings.push(
      issue(
        "$.entries",
        "This registry contains more than 250 entries. That is supported for bulk authoring, but review the result carefully before saving."
      )
    );
  }

  if (errors.length) {
    return {
      valid: false,
      data: null,
      formattedText: parsed.text,
      errors,
      warnings,
    };
  }

  const sanitizedData = JSON.parse(JSON.stringify(data));
  for (const entry of Array.isArray(sanitizedData.entries) ? sanitizedData.entries : []) {
    const entryId = typeof entry?.id === "string" ? entry.id.trim() : "";
    for (const field of LINKED_CREATION_FIELDS) {
      for (const link of Array.isArray(entry?.[field]) ? entry[field] : []) {
        const creationId = typeof link?.creationId === "string"
          ? link.creationId.trim()
          : "";
        const source = existingLinks.get(`${entryId}|${field}|${creationId}`);
        if (!source) continue;

        link.id = source.id;
        link.creationId = source.creationId;
        link.title = source.title;
        link.type = source.type;
        link.description = source.description;
        link.imageUrl = source.imageUrl;
      }
    }
  }

  const normalized = normalizeStructuredRegistryData(sanitizedData, expectedType);
  return {
    valid: true,
    data: normalized,
    formattedText: JSON.stringify(normalized, null, 2),
    errors,
    warnings,
  };
}
