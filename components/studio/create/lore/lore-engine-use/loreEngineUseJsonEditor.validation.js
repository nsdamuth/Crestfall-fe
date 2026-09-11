import {
  LORE_ENGINE_USE_AUTHORING_JSON_CONTRACT_VERSION,
  LORE_ENGINE_USE_BINDING_SCOPE_TYPES,
  LORE_ENGINE_USE_KNOWLEDGE_MODES,
} from "./LoreEngineUse.contract";

const SCOPE_MODES = new Set(["ENTIRE_ASSET", "SELECTED_SECTIONS"]);
const KNOWLEDGE_MODES = new Set(
  LORE_ENGINE_USE_KNOWLEDGE_MODES.map((item) => item.value)
);
const BINDING_SCOPE_TYPES = new Set(
  LORE_ENGINE_USE_BINDING_SCOPE_TYPES.map((item) => item.value)
);

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUpper(value) {
  return normalizeString(value).toUpperCase();
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(normalizeString).filter(Boolean))];
}

function createIssue(path, message) {
  return { path, message };
}

function collectDraftReferences(document, field) {
  const refs = [];
  const append = (value) => {
    (Array.isArray(value) ? value : []).forEach((candidate) => {
      const ref = candidate && typeof candidate === "object" ? candidate : {};
      const id = normalizeString(ref.id);
      if (!id) return;
      refs.push({
        id,
        type: normalizeUpper(ref.type),
        title: normalizeString(ref.title) || "Untitled",
        imageUrl: normalizeString(ref.imageUrl || ref.image_url),
      });
    });
  };

  append(document?.[field]);
  (Array.isArray(document?.chapters) ? document.chapters : []).forEach((chapter) => {
    append(chapter?.[field]);
    (Array.isArray(chapter?.sections) ? chapter.sections : []).forEach((section) => {
      append(section?.[field]);
    });
  });

  return [...new Map(refs.map((ref) => [ref.id, ref])).values()];
}

function collectDraftSectionBlocks(blocks, context) {
  const sources = [];

  const visit = (values, { parentBlockId = null, columnIndex = null } = {}) => {
    (Array.isArray(values) ? values : []).forEach((candidate, blockIndex) => {
      const block = candidate && typeof candidate === "object" ? candidate : {};
      const id = normalizeString(block.id);
      const type = normalizeString(block.type).toLowerCase();

      if (type === "two-column") {
        (Array.isArray(block.columns) ? block.columns : []).forEach(
          (column, nestedColumnIndex) => {
            visit(column?.blocks, {
              parentBlockId: id || null,
              columnIndex: nestedColumnIndex,
            });
          }
        );
        return;
      }

      if (!id || type === "divider") return;

      sources.push({
        id,
        type: type || "block",
        title:
          normalizeString(block.title) ||
          normalizeString(block.text).slice(0, 120) ||
          `${type || "Lore"} block`,
        chapterId: context.chapterId,
        chapterTitle: context.chapterTitle,
        sectionId: context.sectionId,
        sectionTitle: context.sectionTitle,
        parentBlockId,
        columnIndex,
        blockIndex,
      });
    });
  };

  visit(blocks);
  return sources;
}

export function buildLoreEngineUseDraftSource({ document = {}, title = "" } = {}) {
  const chapters = (Array.isArray(document?.chapters) ? document.chapters : []).map(
    (chapter) => {
      const chapterId = normalizeString(chapter?.id);
      const chapterTitle = normalizeString(chapter?.title) || "Untitled Chapter";
      return {
        id: chapterId,
        title: chapterTitle,
        sections: (Array.isArray(chapter?.sections) ? chapter.sections : []).map(
          (section) => {
            const sectionId = normalizeString(section?.id);
            const sectionTitle =
              normalizeString(section?.title) || "Untitled Section";
            return {
              id: sectionId,
              title: sectionTitle,
              blocks: collectDraftSectionBlocks(section?.blocks, {
                chapterId,
                chapterTitle,
                sectionId,
                sectionTitle,
              }),
            };
          }
        ),
      };
    }
  );

  return {
    publicReleaseId: "",
    revisionNumber: 0,
    validationSubmissionId: "",
    snapshotHash: "",
    publishedAt: null,
    title: normalizeString(title) || "Untitled Lore",
    chapters,
    characterRefs: collectDraftReferences(document, "characterRefs").filter(
      (ref) => ref.type === "CHARACTER"
    ),
    locationRefs: collectDraftReferences(document, "locationRefs").filter(
      (ref) => ref.type === "LOCATION"
    ),
    authoringSourceKind: "DRAFT",
  };
}

function normalizeTimePoint(value, path, errors) {
  if (value == null) return null;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    errors.push(createIssue(path, "Expected null or a Story time object."));
    return null;
  }

  const day = Number(value.day);
  const minutes = Number(value.minutes);
  if (!Number.isInteger(day) || day < 1) {
    errors.push(createIssue(`${path}.day`, "Story day must be an integer of 1 or greater."));
  }
  if (!Number.isInteger(minutes) || minutes < 0 || minutes > 10079) {
    errors.push(
      createIssue(
        `${path}.minutes`,
        "Minute-of-day must be an integer from 0 through 10079."
      )
    );
  }

  return { day, minutes };
}

function compareTimePoints(left, right) {
  if (left.day !== right.day) return left.day - right.day;
  return left.minutes - right.minutes;
}

function normalizeBindingAccess(binding) {
  const from = binding.knowledgeAvailableFrom || null;
  const until = binding.knowledgeAvailableUntil || null;
  let availabilityMode = "ALWAYS";
  if (from && until) availabilityMode = "BETWEEN";
  else if (from) availabilityMode = "FROM";
  else if (until) availabilityMode = "UNTIL";

  return {
    scopeType: binding.scopeType,
    chapterId: binding.chapterId || "",
    sectionId: binding.sectionId || "",
    excludedChapterIds: binding.excludedChapterIds,
    excludedSectionIds: binding.excludedSectionIds,
    excludedBlockIds: binding.excludedBlockIds,
    availabilityMode,
    knowledgeAvailableFrom: from || { day: "", minutes: "" },
    knowledgeAvailableUntil: until || { day: "", minutes: "" },
    allowedScenarioIds: binding.allowedScenarioIds,
    allowedRoomTemplateIds: binding.allowedRoomTemplateIds,
  };
}

export function buildLoreEngineUseAuthoringConfiguration({
  scopeMode = "ENTIRE_ASSET",
  selectedSectionIds = [],
  selectedCharacterIds = [],
  selectedLocationIds = [],
  knowledgeModes = {},
  characterAccess = {},
} = {}) {
  const characterBindings = normalizeStringArray(selectedCharacterIds).map(
    (subjectId) => {
      const access = characterAccess?.[subjectId] || {};
      const availabilityMode = normalizeUpper(access.availabilityMode) || "ALWAYS";
      const from = ["FROM", "BETWEEN"].includes(availabilityMode)
        ? {
            day: Number(access?.knowledgeAvailableFrom?.day),
            minutes: Number(access?.knowledgeAvailableFrom?.minutes),
          }
        : null;
      const until = ["UNTIL", "BETWEEN"].includes(availabilityMode)
        ? {
            day: Number(access?.knowledgeAvailableUntil?.day),
            minutes: Number(access?.knowledgeAvailableUntil?.minutes),
          }
        : null;

      return {
        subjectId,
        knowledgeMode: normalizeUpper(knowledgeModes?.[subjectId]) || "SECONDHAND",
        scopeType: normalizeUpper(access.scopeType) || "ASSET",
        chapterId: normalizeString(access.chapterId) || null,
        sectionId: normalizeString(access.sectionId) || null,
        excludedChapterIds: normalizeStringArray(access.excludedChapterIds),
        excludedSectionIds: normalizeStringArray(access.excludedSectionIds),
        excludedBlockIds: normalizeStringArray(access.excludedBlockIds),
        knowledgeAvailableFrom: from,
        knowledgeAvailableUntil: until,
        allowedScenarioIds: normalizeStringArray(access.allowedScenarioIds),
        allowedRoomTemplateIds: normalizeStringArray(access.allowedRoomTemplateIds),
      };
    }
  );

  return {
    contractVersion: LORE_ENGINE_USE_AUTHORING_JSON_CONTRACT_VERSION,
    scopeMode: normalizeUpper(scopeMode) || "ENTIRE_ASSET",
    selectedSectionIds: normalizeStringArray(selectedSectionIds),
    characterBindings,
    locationBindings: normalizeStringArray(selectedLocationIds).map((subjectId) => ({
      subjectId,
    })),
  };
}

export function mergeLoreEngineUseAuthoringIntoDraftDocument(
  document = {},
  configuration = {}
) {
  const source =
    document && typeof document === "object" && !Array.isArray(document)
      ? document
      : {};
  const metadata =
    source.metadata &&
    typeof source.metadata === "object" &&
    !Array.isArray(source.metadata)
      ? source.metadata
      : {};

  return {
    ...source,
    metadata: {
      ...metadata,
      engineUseAuthoring: configuration,
    },
  };
}

export function formatLoreEngineUseJsonData(value) {
  return `${JSON.stringify(value || {}, null, 2)}\n`;
}

export function formatLoreEngineUseJsonText(value) {
  try {
    const parsed = JSON.parse(String(value || ""));
    return { valid: true, text: formatLoreEngineUseJsonData(parsed), error: null };
  } catch (error) {
    return {
      valid: false,
      text: String(value || ""),
      error: createIssue("$", error?.message || "Invalid JSON syntax."),
    };
  }
}

export function validateLoreEngineUseJsonText(
  value,
  {
    source = {},
    storyContextOptions = { scenarios: [], roomTemplates: [] },
    storyContextLoadStatus = "IDLE",
  } = {}
) {
  const errors = [];
  const warnings = [];
  let parsed = null;

  try {
    parsed = JSON.parse(String(value || ""));
  } catch (error) {
    return {
      valid: false,
      errors: [createIssue("$", error?.message || "Invalid JSON syntax.")],
      warnings,
      data: null,
      formattedText: String(value || ""),
    };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      valid: false,
      errors: [createIssue("$", "Engine Use JSON must be one object.")],
      warnings,
      data: null,
      formattedText: formatLoreEngineUseJsonData(parsed),
    };
  }

  const contractVersion = normalizeString(parsed.contractVersion);
  if (!contractVersion) {
    warnings.push(
      createIssue(
        "$.contractVersion",
        `Legacy abbreviated configuration accepted and normalized to ${LORE_ENGINE_USE_AUTHORING_JSON_CONTRACT_VERSION}.`
      )
    );
  } else if (contractVersion !== LORE_ENGINE_USE_AUTHORING_JSON_CONTRACT_VERSION) {
    errors.push(
      createIssue(
        "$.contractVersion",
        `Expected ${LORE_ENGINE_USE_AUTHORING_JSON_CONTRACT_VERSION}.`
      )
    );
  }

  const chapters = Array.isArray(source.chapters) ? source.chapters : [];
  const chapterById = new Map(
    chapters.map((chapter) => [normalizeString(chapter?.id), chapter]).filter(([id]) => id)
  );
  const sectionById = new Map();
  const blockById = new Map();
  chapters.forEach((chapter) => {
    const chapterId = normalizeString(chapter?.id);
    (Array.isArray(chapter?.sections) ? chapter.sections : []).forEach((section) => {
      const sectionId = normalizeString(section?.id);
      if (!sectionId) return;
      sectionById.set(sectionId, { ...section, chapterId });
      (Array.isArray(section?.blocks) ? section.blocks : []).forEach((block) => {
        const blockId = normalizeString(block?.id);
        if (blockId) blockById.set(blockId, { ...block, chapterId, sectionId });
      });
    });
  });

  const scopeMode = normalizeUpper(parsed.scopeMode) || "ENTIRE_ASSET";
  if (!SCOPE_MODES.has(scopeMode)) {
    errors.push(createIssue("$.scopeMode", "Use ENTIRE_ASSET or SELECTED_SECTIONS."));
  }

  const selectedSectionIds = normalizeStringArray(parsed.selectedSectionIds);
  if (scopeMode === "SELECTED_SECTIONS" && !selectedSectionIds.length) {
    errors.push(
      createIssue(
        "$.selectedSectionIds",
        "SELECTED_SECTIONS requires at least one section id."
      )
    );
  }
  if (scopeMode === "ENTIRE_ASSET" && selectedSectionIds.length) {
    warnings.push(
      createIssue(
        "$.selectedSectionIds",
        "Selected section ids are ignored when scopeMode is ENTIRE_ASSET."
      )
    );
  }

  selectedSectionIds.forEach((sectionId, index) => {
    if (!sectionById.has(sectionId)) {
      errors.push(
        createIssue(
          `$.selectedSectionIds[${index}]`,
          "Section is not part of the current Lore authoring source."
        )
      );
    }
  });

  const includedSectionIds = new Set(
    scopeMode === "SELECTED_SECTIONS"
      ? selectedSectionIds.filter((id) => sectionById.has(id))
      : [...sectionById.keys()]
  );
  const includedChapterIds = new Set(
    [...includedSectionIds]
      .map((id) => sectionById.get(id)?.chapterId)
      .filter(Boolean)
  );

  const taggedCharacterIds = new Set(
    (Array.isArray(source.characterRefs) ? source.characterRefs : [])
      .map((ref) => normalizeString(ref?.id))
      .filter(Boolean)
  );
  const taggedLocationIds = new Set(
    (Array.isArray(source.locationRefs) ? source.locationRefs : [])
      .map((ref) => normalizeString(ref?.id))
      .filter(Boolean)
  );

  const rawCharacterBindings = Array.isArray(parsed.characterBindings)
    ? parsed.characterBindings
    : [];
  if (!rawCharacterBindings.length) {
    errors.push(
      createIssue(
        "$.characterBindings",
        "Select at least one tagged Character for Engine Use."
      )
    );
  }

  const seenCharacterIds = new Set();
  const characterBindings = rawCharacterBindings.map((candidate, index) => {
    const path = `$.characterBindings[${index}]`;
    const binding = candidate && typeof candidate === "object" && !Array.isArray(candidate)
      ? candidate
      : {};
    if (binding !== candidate) {
      errors.push(createIssue(path, "Character binding must be an object."));
    }

    const subjectId = normalizeString(binding.subjectId);
    if (!subjectId) {
      errors.push(createIssue(`${path}.subjectId`, "Character subjectId is required."));
    } else if (!taggedCharacterIds.has(subjectId)) {
      errors.push(
        createIssue(
          `${path}.subjectId`,
          "Character is not tagged in the current Lore authoring source."
        )
      );
    } else if (seenCharacterIds.has(subjectId)) {
      errors.push(createIssue(`${path}.subjectId`, "Character binding is duplicated."));
    }
    seenCharacterIds.add(subjectId);

    const knowledgeMode = normalizeUpper(binding.knowledgeMode) || "SECONDHAND";
    if (!KNOWLEDGE_MODES.has(knowledgeMode)) {
      errors.push(createIssue(`${path}.knowledgeMode`, "Knowledge relationship is invalid."));
    }

    const scopeType = normalizeUpper(binding.scopeType) || "ASSET";
    if (!BINDING_SCOPE_TYPES.has(scopeType)) {
      errors.push(createIssue(`${path}.scopeType`, "Knowledge scope is invalid."));
    }

    const chapterId = normalizeString(binding.chapterId) || null;
    const sectionId = normalizeString(binding.sectionId) || null;
    let scopedSectionIds = new Set(includedSectionIds);

    if (scopeType === "CHAPTER") {
      if (!chapterId || !chapterById.has(chapterId) || !includedChapterIds.has(chapterId)) {
        errors.push(
          createIssue(
            `${path}.chapterId`,
            "Chapter must be included in the submitted Lore scope."
          )
        );
      }
      if (sectionId) {
        errors.push(createIssue(`${path}.sectionId`, "sectionId must be null for CHAPTER scope."));
      }
      scopedSectionIds = new Set(
        [...includedSectionIds].filter(
          (id) => sectionById.get(id)?.chapterId === chapterId
        )
      );
    } else if (scopeType === "SECTION") {
      if (!sectionId || !sectionById.has(sectionId) || !includedSectionIds.has(sectionId)) {
        errors.push(
          createIssue(
            `${path}.sectionId`,
            "Section must be included in the submitted Lore scope."
          )
        );
      }
      if (chapterId) {
        warnings.push(
          createIssue(
            `${path}.chapterId`,
            "chapterId is ignored for SECTION scope and will be normalized to null."
          )
        );
      }
      scopedSectionIds = new Set(sectionId ? [sectionId] : []);
    } else if (scopeType === "ASSET") {
      if (chapterId || sectionId) {
        warnings.push(
          createIssue(
            path,
            "chapterId and sectionId are ignored for ASSET scope and will be normalized to null."
          )
        );
      }
    }

    const scopedChapterIds = new Set(
      [...scopedSectionIds]
        .map((id) => sectionById.get(id)?.chapterId)
        .filter(Boolean)
    );

    const excludedChapterIds = normalizeStringArray(binding.excludedChapterIds);
    const excludedSectionIds = normalizeStringArray(binding.excludedSectionIds);
    const excludedBlockIds = normalizeStringArray(binding.excludedBlockIds);

    if (scopeType !== "ASSET" && excludedChapterIds.length) {
      errors.push(
        createIssue(
          `${path}.excludedChapterIds`,
          "Chapter exclusions are only valid for ASSET knowledge scope."
        )
      );
    }
    excludedChapterIds.forEach((id, exclusionIndex) => {
      if (!scopedChapterIds.has(id)) {
        errors.push(
          createIssue(
            `${path}.excludedChapterIds[${exclusionIndex}]`,
            "Excluded chapter is outside this Character knowledge scope."
          )
        );
      }
    });

    if (scopeType === "SECTION" && excludedSectionIds.length) {
      errors.push(
        createIssue(
          `${path}.excludedSectionIds`,
          "Section exclusions are not valid for SECTION knowledge scope."
        )
      );
    }
    excludedSectionIds.forEach((id, exclusionIndex) => {
      if (!scopedSectionIds.has(id)) {
        errors.push(
          createIssue(
            `${path}.excludedSectionIds[${exclusionIndex}]`,
            "Excluded section is outside this Character knowledge scope."
          )
        );
      }
    });

    excludedBlockIds.forEach((id, exclusionIndex) => {
      const block = blockById.get(id);
      if (!block || !scopedSectionIds.has(block.sectionId)) {
        errors.push(
          createIssue(
            `${path}.excludedBlockIds[${exclusionIndex}]`,
            "Excluded block is outside this Character knowledge scope or is not in the active public revision."
          )
        );
      }
    });

    const knowledgeAvailableFrom = normalizeTimePoint(
      binding.knowledgeAvailableFrom,
      `${path}.knowledgeAvailableFrom`,
      errors
    );
    const knowledgeAvailableUntil = normalizeTimePoint(
      binding.knowledgeAvailableUntil,
      `${path}.knowledgeAvailableUntil`,
      errors
    );
    if (
      knowledgeAvailableFrom &&
      knowledgeAvailableUntil &&
      compareTimePoints(knowledgeAvailableFrom, knowledgeAvailableUntil) > 0
    ) {
      errors.push(
        createIssue(
          path,
          "knowledgeAvailableFrom must not be later than knowledgeAvailableUntil."
        )
      );
    }

    const allowedScenarioIds = normalizeStringArray(binding.allowedScenarioIds);
    const allowedRoomTemplateIds = normalizeStringArray(binding.allowedRoomTemplateIds);
    const scenarioIds = new Set(
      (Array.isArray(storyContextOptions?.scenarios) ? storyContextOptions.scenarios : [])
        .map((item) => normalizeString(item?.id))
        .filter(Boolean)
    );
    const roomTemplateIds = new Set(
      (Array.isArray(storyContextOptions?.roomTemplates)
        ? storyContextOptions.roomTemplates
        : [])
        .map((item) => normalizeString(item?.id))
        .filter(Boolean)
    );

    if (normalizeUpper(storyContextLoadStatus) === "READY") {
      allowedScenarioIds.forEach((id, allowIndex) => {
        if (!scenarioIds.has(id)) {
          errors.push(
            createIssue(
              `${path}.allowedScenarioIds[${allowIndex}]`,
              "Scenario is not available to the current author."
            )
          );
        }
      });
      allowedRoomTemplateIds.forEach((id, allowIndex) => {
        if (!roomTemplateIds.has(id)) {
          errors.push(
            createIssue(
              `${path}.allowedRoomTemplateIds[${allowIndex}]`,
              "Room Template is not available to the current author."
            )
          );
        }
      });
    } else if (allowedScenarioIds.length || allowedRoomTemplateIds.length) {
      warnings.push(
        createIssue(
          path,
          "Story-context allowlists were imported before owned Scenario/Room Template options finished loading; final authority is still checked on submission."
        )
      );
    }

    return {
      subjectId,
      knowledgeMode,
      scopeType,
      chapterId: scopeType === "CHAPTER" ? chapterId : null,
      sectionId: scopeType === "SECTION" ? sectionId : null,
      excludedChapterIds,
      excludedSectionIds,
      excludedBlockIds,
      knowledgeAvailableFrom,
      knowledgeAvailableUntil,
      allowedScenarioIds,
      allowedRoomTemplateIds,
    };
  });

  const rawLocationBindings = Array.isArray(parsed.locationBindings)
    ? parsed.locationBindings
    : [];
  const seenLocationIds = new Set();
  const locationBindings = rawLocationBindings.map((candidate, index) => {
    const path = `$.locationBindings[${index}]`;
    const binding = candidate && typeof candidate === "object" && !Array.isArray(candidate)
      ? candidate
      : {};
    if (binding !== candidate) {
      errors.push(createIssue(path, "Location binding must be an object."));
    }
    const subjectId = normalizeString(binding.subjectId);
    if (!subjectId) {
      errors.push(createIssue(`${path}.subjectId`, "Location subjectId is required."));
    } else if (!taggedLocationIds.has(subjectId)) {
      errors.push(
        createIssue(
          `${path}.subjectId`,
          "Location is not tagged in the current Lore authoring source."
        )
      );
    } else if (seenLocationIds.has(subjectId)) {
      errors.push(createIssue(`${path}.subjectId`, "Location binding is duplicated."));
    }
    seenLocationIds.add(subjectId);
    return { subjectId };
  });

  const configuration = {
    contractVersion: LORE_ENGINE_USE_AUTHORING_JSON_CONTRACT_VERSION,
    scopeMode,
    selectedSectionIds: scopeMode === "SELECTED_SECTIONS" ? selectedSectionIds : [],
    characterBindings,
    locationBindings,
  };

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    data: errors.length ? null : configuration,
    formattedText: formatLoreEngineUseJsonData(configuration),
  };
}

export function projectLoreEngineUseConfigurationToAuthoringState(configuration) {
  const source = configuration && typeof configuration === "object" ? configuration : {};
  const characterBindings = Array.isArray(source.characterBindings)
    ? source.characterBindings
    : [];
  const knowledgeModes = {};
  const characterAccess = {};

  characterBindings.forEach((binding) => {
    const subjectId = normalizeString(binding?.subjectId);
    if (!subjectId) return;
    knowledgeModes[subjectId] = normalizeUpper(binding?.knowledgeMode) || "SECONDHAND";
    characterAccess[subjectId] = normalizeBindingAccess(binding);
  });

  return {
    scopeMode: normalizeUpper(source.scopeMode) || "ENTIRE_ASSET",
    selectedSectionIds: normalizeStringArray(source.selectedSectionIds),
    selectedCharacterIds: characterBindings
      .map((binding) => normalizeString(binding?.subjectId))
      .filter(Boolean),
    selectedLocationIds: (Array.isArray(source.locationBindings)
      ? source.locationBindings
      : []
    )
      .map((binding) => normalizeString(binding?.subjectId))
      .filter(Boolean),
    knowledgeModes,
    characterAccess,
  };
}
