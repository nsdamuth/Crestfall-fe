import {
  LORE_BLOCK_TYPES,
  LORE_COLUMN_BLOCK_TYPES,
  LORE_DOCUMENT_CONTRACT_VERSION,
  LORE_EDITOR_LIMITS,
} from "../lore-editor/LoreEditor.contract";
import {
  normalizeLoreDocument,
  validateLoreDocument,
} from "../lore-editor/useLoreEditorViewModel";

export const LORE_JSON_EDITOR_VALIDATION_VERSION =
  "lore_json_editor_validation_v1";

const BLOCK_TYPES = new Set(LORE_BLOCK_TYPES.map((option) => option.value));
const COLUMN_BLOCK_TYPES = new Set(
  LORE_COLUMN_BLOCK_TYPES.map((option) => option.value)
);

function isObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function addIssue(target, path, message) {
  target.push({ path, message });
}

function collectSourceReferenceIds(document) {
  const characterIds = new Set();
  const locationIds = new Set();
  const imageReferences = new Map();

  function collectRefs(scope) {
    asArray(scope?.characterRefs).forEach((ref) => {
      const id = normalizeString(ref?.id);
      if (id) characterIds.add(id);
    });
    asArray(scope?.locationRefs).forEach((ref) => {
      const id = normalizeString(ref?.id);
      if (id) locationIds.add(id);
    });
  }

  function collectBlocks(blocks) {
    asArray(blocks).forEach((block) => {
      const libraryEntryId = normalizeString(block?.libraryEntryId);
      if (libraryEntryId && !imageReferences.has(libraryEntryId)) {
        imageReferences.set(libraryEntryId, {
          sourceCharacterId: normalizeString(block?.sourceCharacterId),
          imageOutputId: normalizeString(block?.imageOutputId),
          src: normalizeString(block?.src),
        });
      }

      if (block?.type === "two-column") {
        asArray(block?.columns).forEach((column) =>
          collectBlocks(column?.blocks)
        );
      }
    });
  }

  collectRefs(document);
  asArray(document?.chapters).forEach((chapter) => {
    collectRefs(chapter);
    asArray(chapter?.sections).forEach((section) => {
      collectRefs(section);
      collectBlocks(section?.blocks);
    });
  });

  return { characterIds, locationIds, imageReferences };
}

function validateReferenceArray({
  value,
  path,
  maxSelections,
  allowedIds,
  label,
  errors,
}) {
  if (value === undefined) return;

  if (!Array.isArray(value)) {
    addIssue(errors, path, `Expected ${label} references to be a JSON array.`);
    return;
  }

  if (value.length > maxSelections) {
    addIssue(
      errors,
      path,
      `${label} references cannot exceed ${maxSelections} selections at this scope.`
    );
  }

  const seen = new Set();

  value.forEach((ref, index) => {
    const refPath = `${path}[${index}]`;
    if (!isObject(ref)) {
      addIssue(errors, refPath, `Expected a ${label} reference object.`);
      return;
    }

    const id = normalizeString(ref.id || ref.creationId || ref.creation_id);
    if (!id) {
      addIssue(errors, `${refPath}.id`, `${label} references need an id.`);
      return;
    }

    if (seen.has(id)) {
      addIssue(errors, `${refPath}.id`, `Duplicate ${label} reference "${id}".`);
    }
    seen.add(id);

    if (!allowedIds.has(id)) {
      addIssue(
        errors,
        `${refPath}.id`,
        `${label} reference "${id}" is not already available in this Lore document. Add it with the visual selector before using it in JSON.`
      );
    }
  });
}

function validateRawLoreShape(value, sourceDocument) {
  const errors = [];
  const warnings = [];

  if (!isObject(value)) {
    addIssue(errors, "$", "Expected one complete Lore document JSON object.");
    return { errors, warnings };
  }

  const sourceReferences = collectSourceReferenceIds(sourceDocument);

  if (!normalizeString(value.contractVersion)) {
    addIssue(
      warnings,
      "contractVersion",
      `Missing contractVersion. Crestfall will normalize it to ${LORE_DOCUMENT_CONTRACT_VERSION}.`
    );
  } else if (value.contractVersion !== LORE_DOCUMENT_CONTRACT_VERSION) {
    addIssue(
      errors,
      "contractVersion",
      `Expected ${LORE_DOCUMENT_CONTRACT_VERSION}; received ${String(
        value.contractVersion
      )}.`
    );
  }

  validateReferenceArray({
    value: value.characterRefs,
    path: "characterRefs",
    maxSelections: LORE_EDITOR_LIMITS.maxDocumentCharacterRefs,
    allowedIds: sourceReferences.characterIds,
    label: "Character",
    errors,
  });
  validateReferenceArray({
    value: value.locationRefs,
    path: "locationRefs",
    maxSelections: LORE_EDITOR_LIMITS.maxDocumentLocationRefs,
    allowedIds: sourceReferences.locationIds,
    label: "Location",
    errors,
  });

  if (!Array.isArray(value.chapters)) {
    addIssue(errors, "chapters", "Lore documents need a chapters array.");
    return { errors, warnings };
  }

  if (value.chapters.length > LORE_EDITOR_LIMITS.maxChapters) {
    addIssue(
      errors,
      "chapters",
      `Lore documents cannot exceed ${LORE_EDITOR_LIMITS.maxChapters} chapters.`
    );
  }

  let totalSections = 0;
  let totalBlocks = 0;

  function validateBlock(block, path, { nested = false } = {}) {
    totalBlocks += 1;

    if (!isObject(block)) {
      addIssue(errors, path, "Expected a Lore block object.");
      return;
    }

    if (!normalizeString(block.id)) {
      addIssue(
        warnings,
        `${path}.id`,
        "Missing block id. Crestfall will generate a new stable id."
      );
    }

    const type = normalizeString(block.type);
    const allowedTypes = nested ? COLUMN_BLOCK_TYPES : BLOCK_TYPES;

    if (!allowedTypes.has(type)) {
      addIssue(
        errors,
        `${path}.type`,
        `Unsupported ${nested ? "column " : ""}block type "${type || "(empty)"}".`
      );
      return;
    }

    if (type === "stat-block") {
      if (!Array.isArray(block.items)) {
        addIssue(errors, `${path}.items`, "Reference Stat Block items must be an array.");
      } else if (block.items.length > LORE_EDITOR_LIMITS.maxStatItems) {
        addIssue(
          errors,
          `${path}.items`,
          `Reference Stat Blocks cannot exceed ${LORE_EDITOR_LIMITS.maxStatItems} rows.`
        );
      }
    }

    if (type === "sidebar" && block.items !== undefined && !Array.isArray(block.items)) {
      addIssue(errors, `${path}.items`, "Sidebar items must be an array of strings.");
    }

    if (type === "image") {
      const libraryEntryId = normalizeString(block.libraryEntryId);
      const existingImage = sourceReferences.imageReferences.get(libraryEntryId);

      if (libraryEntryId && !existingImage) {
        addIssue(
          errors,
          `${path}.libraryEntryId`,
          "This image-library reference is not already available in the Lore document. Select the image through the visual editor first."
        );
      } else if (existingImage) {
        [
          ["sourceCharacterId", existingImage.sourceCharacterId],
          ["imageOutputId", existingImage.imageOutputId],
          ["src", existingImage.src],
        ].forEach(([field, expectedValue]) => {
          if (normalizeString(block[field]) !== expectedValue) {
            addIssue(
              errors,
              `${path}.${field}`,
              `Preserve the existing ${field} value for image-library entry "${libraryEntryId}".`
            );
          }
        });
      }
    }

    if (type === "two-column") {
      if (!Array.isArray(block.columns) || block.columns.length !== 2) {
        addIssue(
          errors,
          `${path}.columns`,
          "Two Column Layout blocks require exactly two columns."
        );
        return;
      }

      block.columns.forEach((column, columnIndex) => {
        const columnPath = `${path}.columns[${columnIndex}]`;
        if (!isObject(column)) {
          addIssue(errors, columnPath, "Expected a column object.");
          return;
        }
        if (!normalizeString(column.id)) {
          addIssue(
            warnings,
            `${columnPath}.id`,
            "Missing column id. Crestfall will generate a new stable id."
          );
        }
        if (!Array.isArray(column.blocks)) {
          addIssue(errors, `${columnPath}.blocks`, "Columns need a blocks array.");
          return;
        }
        if (column.blocks.length > LORE_EDITOR_LIMITS.maxBlocksPerColumn) {
          addIssue(
            errors,
            `${columnPath}.blocks`,
            `Columns cannot exceed ${LORE_EDITOR_LIMITS.maxBlocksPerColumn} blocks.`
          );
        }
        column.blocks.forEach((columnBlock, columnBlockIndex) =>
          validateBlock(
            columnBlock,
            `${columnPath}.blocks[${columnBlockIndex}]`,
            { nested: true }
          )
        );
      });
    }
  }

  value.chapters.forEach((chapter, chapterIndex) => {
    const chapterPath = `chapters[${chapterIndex}]`;

    if (!isObject(chapter)) {
      addIssue(errors, chapterPath, "Expected a chapter object.");
      return;
    }

    if (!normalizeString(chapter.id)) {
      addIssue(
        warnings,
        `${chapterPath}.id`,
        "Missing chapter id. Crestfall will generate a new stable id."
      );
    }

    validateReferenceArray({
      value: chapter.characterRefs,
      path: `${chapterPath}.characterRefs`,
      maxSelections: LORE_EDITOR_LIMITS.maxChapterCharacterRefs,
      allowedIds: sourceReferences.characterIds,
      label: "Character",
      errors,
    });
    validateReferenceArray({
      value: chapter.locationRefs,
      path: `${chapterPath}.locationRefs`,
      maxSelections: LORE_EDITOR_LIMITS.maxChapterLocationRefs,
      allowedIds: sourceReferences.locationIds,
      label: "Location",
      errors,
    });

    if (!Array.isArray(chapter.sections)) {
      addIssue(errors, `${chapterPath}.sections`, "Chapters need a sections array.");
      return;
    }

    if (chapter.sections.length > LORE_EDITOR_LIMITS.maxSectionsPerChapter) {
      addIssue(
        errors,
        `${chapterPath}.sections`,
        `A chapter cannot exceed ${LORE_EDITOR_LIMITS.maxSectionsPerChapter} sections.`
      );
    }

    totalSections += chapter.sections.length;

    chapter.sections.forEach((section, sectionIndex) => {
      const sectionPath = `${chapterPath}.sections[${sectionIndex}]`;

      if (!isObject(section)) {
        addIssue(errors, sectionPath, "Expected a section object.");
        return;
      }

      if (!normalizeString(section.id)) {
        addIssue(
          warnings,
          `${sectionPath}.id`,
          "Missing section id. Crestfall will generate a new stable id."
        );
      }

      validateReferenceArray({
        value: section.characterRefs,
        path: `${sectionPath}.characterRefs`,
        maxSelections: LORE_EDITOR_LIMITS.maxSectionCharacterRefs,
        allowedIds: sourceReferences.characterIds,
        label: "Character",
        errors,
      });
      validateReferenceArray({
        value: section.locationRefs,
        path: `${sectionPath}.locationRefs`,
        maxSelections: LORE_EDITOR_LIMITS.maxSectionLocationRefs,
        allowedIds: sourceReferences.locationIds,
        label: "Location",
        errors,
      });

      if (!Array.isArray(section.blocks)) {
        addIssue(errors, `${sectionPath}.blocks`, "Sections need a blocks array.");
        return;
      }

      if (section.blocks.length > LORE_EDITOR_LIMITS.maxBlocksPerSection) {
        addIssue(
          errors,
          `${sectionPath}.blocks`,
          `A section cannot exceed ${LORE_EDITOR_LIMITS.maxBlocksPerSection} top-level blocks.`
        );
      }

      section.blocks.forEach((block, blockIndex) =>
        validateBlock(block, `${sectionPath}.blocks[${blockIndex}]`)
      );
    });
  });

  if (totalSections > LORE_EDITOR_LIMITS.maxTotalSections) {
    addIssue(
      errors,
      "chapters",
      `Lore documents cannot exceed ${LORE_EDITOR_LIMITS.maxTotalSections.toLocaleString()} total sections.`
    );
  }

  if (totalBlocks > LORE_EDITOR_LIMITS.maxTotalBlocks) {
    addIssue(
      errors,
      "chapters",
      `Lore documents cannot exceed ${LORE_EDITOR_LIMITS.maxTotalBlocks.toLocaleString()} total blocks.`
    );
  }

  return { errors, warnings };
}

export function formatLoreJsonData(value) {
  return JSON.stringify(normalizeLoreDocument(value), null, 2);
}

export function formatLoreJsonText(jsonText) {
  try {
    const parsed = JSON.parse(String(jsonText || ""));
    return {
      valid: true,
      text: JSON.stringify(parsed, null, 2),
      error: null,
    };
  } catch (error) {
    return {
      valid: false,
      text: String(jsonText || ""),
      error: {
        path: "$",
        message: error?.message || "The JSON could not be parsed.",
      },
    };
  }
}

export function validateLoreJsonText(jsonText, { sourceDocument = {} } = {}) {
  let parsed;

  try {
    parsed = JSON.parse(String(jsonText || ""));
  } catch (error) {
    return {
      valid: false,
      data: null,
      formattedText: String(jsonText || ""),
      errors: [
        {
          path: "$",
          message: error?.message || "The JSON could not be parsed.",
        },
      ],
      warnings: [],
    };
  }

  const rawResult = validateRawLoreShape(parsed, sourceDocument);

  if (rawResult.errors.length) {
    return {
      valid: false,
      data: null,
      formattedText: JSON.stringify(parsed, null, 2),
      errors: rawResult.errors,
      warnings: rawResult.warnings,
    };
  }

  const normalized = normalizeLoreDocument(parsed);
  const semanticIssues = validateLoreDocument(normalized);
  const semanticErrors = semanticIssues
    .filter((issue) => issue.severity !== "WARNING")
    .map((issue) => ({ path: issue.path, message: issue.message }));
  const semanticWarnings = semanticIssues
    .filter((issue) => issue.severity === "WARNING")
    .map((issue) => ({ path: issue.path, message: issue.message }));

  return {
    valid: semanticErrors.length === 0,
    data: semanticErrors.length ? null : normalized,
    formattedText: JSON.stringify(normalized, null, 2),
    errors: semanticErrors,
    warnings: [...rawResult.warnings, ...semanticWarnings],
  };
}
