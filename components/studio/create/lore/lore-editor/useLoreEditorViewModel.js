"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchCommunityCreations,
  fetchCreationImageLibrary,
  fetchOwnedCreations,
} from "@/lib/client/studio/creations/creationClient";
import {
  fetchCreationReactions,
} from "@/lib/client/studio/engagement/creationReactionClient";
import {
  LORE_BLOCK_TYPES,
  LORE_COLUMN_BLOCK_TYPES,
  LORE_DOCUMENT_CONTRACT_VERSION,
  LORE_EDITOR_LIMITS,
  LORE_IMAGE_ALIGN_OPTIONS,
  LORE_IMAGE_SIZE_OPTIONS,
} from "./LoreEditor.contract";

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function truncate(value, limit) {
  return typeof value === "string" ? value.slice(0, limit) : "";
}

function normalizeStringList(values, limit, itemLimit) {
  return normalizeArray(values)
    .map((value) => truncate(normalizeString(value), itemLimit))
    .filter(Boolean)
    .slice(0, limit);
}

const CONTENT_RATING_RANK = Object.freeze({ SFW: 0, MATURE: 1, EXPLICIT: 2 });

function normalizeContentRating(value) {
  const normalized = normalizeString(value).toUpperCase();
  return Object.prototype.hasOwnProperty.call(CONTENT_RATING_RANK, normalized)
    ? normalized
    : "SFW";
}

function isImageRatingAllowed(imageRating, loreRating) {
  return (
    CONTENT_RATING_RANK[normalizeContentRating(imageRating)] <=
    CONTENT_RATING_RANK[normalizeContentRating(loreRating)]
  );
}

export function createLoreId(prefix = "item") {
  const randomId =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return `${prefix}-${randomId}`.toLowerCase();
}

function normalizeCharacterRef(value) {
  const source = normalizeObject(value);
  const id = normalizeString(source.id || source.creationId || source.creation_id);

  if (!id) return null;

  return {
    id,
    type: "CHARACTER",
    title: normalizeString(source.title || source.name) || "Untitled Character",
    imageUrl: normalizeString(
      source.imageUrl || source.image_url || source.thumbnailUrl || source.thumbnail_url
    ),
  };
}

function uniqueCharacterRefs(values, limit) {
  const result = [];
  const seen = new Set();

  for (const value of normalizeArray(values)) {
    const normalized = normalizeCharacterRef(value);
    if (!normalized || seen.has(normalized.id)) continue;
    seen.add(normalized.id);
    result.push(normalized);
    if (result.length >= limit) break;
  }

  return result;
}

function normalizeLocationRef(value) {
  const source = normalizeObject(value);
  const id = normalizeString(source.id || source.creationId || source.creation_id);

  if (!id) return null;

  return {
    id,
    type: "LOCATION",
    title: normalizeString(source.title || source.name) || "Untitled Location",
    imageUrl: normalizeString(
      source.imageUrl || source.image_url || source.thumbnailUrl || source.thumbnail_url
    ),
  };
}

function uniqueLocationRefs(values, limit) {
  const result = [];
  const seen = new Set();

  for (const value of normalizeArray(values)) {
    const normalized = normalizeLocationRef(value);
    if (!normalized || seen.has(normalized.id)) continue;
    seen.add(normalized.id);
    result.push(normalized);
    if (result.length >= limit) break;
  }

  return result;
}

function normalizeStatItems(values) {
  return normalizeArray(values)
    .map((value, index) => {
      const source = normalizeObject(value);
      const label = truncate(source.label, LORE_EDITOR_LIMITS.maxStatLabelLength);
      const itemValue = truncate(source.value, LORE_EDITOR_LIMITS.maxStatValueLength);

      return {
        id: normalizeString(source.id) || createLoreId(`stat-${index + 1}`),
        label,
        value: itemValue,
      };
    })
    .slice(0, LORE_EDITOR_LIMITS.maxStatItems);
}

function normalizeColumn(value, index) {
  const source = normalizeObject(value);

  return {
    id: normalizeString(source.id) || createLoreId(`column-${index + 1}`),
    blocks: normalizeArray(source.blocks)
      .slice(0, LORE_EDITOR_LIMITS.maxBlocksPerColumn)
      .map((block, blockIndex) =>
        normalizeBlock(block, blockIndex, { allowColumns: false })
      ),
  };
}

function normalizeBlock(value, index, { allowColumns = true } = {}) {
  const source = normalizeObject(value);
  const allowedTypes = new Set(
    (allowColumns ? LORE_BLOCK_TYPES : LORE_COLUMN_BLOCK_TYPES).map(
      (option) => option.value
    )
  );
  const type = allowedTypes.has(source.type) ? source.type : "text";
  const sourceColumns = normalizeArray(source.columns);
  const columns =
    type === "two-column"
      ? [0, 1].map((columnIndex) =>
          normalizeColumn(
            sourceColumns[columnIndex] || {
              id: createLoreId(`column-${columnIndex + 1}`),
              blocks: [
                {
                  id: createLoreId("block"),
                  type: "text",
                  body:
                    columnIndex === 0
                      ? "Add the left-column passage."
                      : "Add the right-column passage.",
                },
              ],
            },
            columnIndex
          )
        )
      : [];

  return {
    id: normalizeString(source.id) || createLoreId(`block-${index + 1}`),
    type,
    title: truncate(source.title, LORE_EDITOR_LIMITS.maxTitleLength),
    subtitle: truncate(source.subtitle, LORE_EDITOR_LIMITS.maxSubtitleLength),
    text: truncate(source.text, LORE_EDITOR_LIMITS.maxBlockBodyLength),
    body: truncate(source.body, LORE_EDITOR_LIMITS.maxBlockBodyLength),
    attribution: truncate(source.attribution, LORE_EDITOR_LIMITS.maxTitleLength),
    items:
      type === "stat-block"
        ? normalizeStatItems(source.items)
        : normalizeStringList(
            source.items,
            LORE_EDITOR_LIMITS.maxSidebarItems,
            LORE_EDITOR_LIMITS.maxSidebarItemLength
          ),
    columns,
    level: Number(source.level) === 3 ? 3 : 2,
    dropCap: source.dropCap === true,
    indent: source.indent === true,
    sourceCharacterId: normalizeString(source.sourceCharacterId),
    libraryEntryId: normalizeString(source.libraryEntryId),
    imageOutputId: normalizeString(source.imageOutputId),
    src: normalizeString(source.src),
    alt: truncate(source.alt, LORE_EDITOR_LIMITS.maxSubtitleLength),
    caption: truncate(source.caption, LORE_EDITOR_LIMITS.maxSubtitleLength),
    size: LORE_IMAGE_SIZE_OPTIONS.some((option) => option.value === source.size)
      ? source.size
      : "full",
    align: LORE_IMAGE_ALIGN_OPTIONS.some((option) => option.value === source.align)
      ? source.align
      : "center",
    metadata: normalizeObject(source.metadata),
  };
}

function createLegacySectionId(chapterId, sectionIndex = 0) {
  const normalizedChapterId = normalizeString(chapterId) || "chapter";
  return `${normalizedChapterId}-section-${sectionIndex + 1}`.toLowerCase();
}

function normalizeSection(value, index, chapterId) {
  const source = normalizeObject(value);

  return {
    id: normalizeString(source.id) || createLegacySectionId(chapterId, index),
    title: truncate(source.title, LORE_EDITOR_LIMITS.maxTitleLength),
    subtitle: truncate(source.subtitle, LORE_EDITOR_LIMITS.maxSubtitleLength),
    summary: truncate(source.summary, LORE_EDITOR_LIMITS.maxSummaryLength),
    eyebrow: truncate(source.eyebrow, LORE_EDITOR_LIMITS.maxTitleLength),
    era: truncate(source.era, LORE_EDITOR_LIMITS.maxTitleLength),
    displayDate: truncate(source.displayDate, LORE_EDITOR_LIMITS.maxTitleLength),
    timelineOrder: Number.isFinite(Number(source.timelineOrder))
      ? Number(source.timelineOrder)
      : index,
    characterRefs: uniqueCharacterRefs(
      source.characterRefs,
      LORE_EDITOR_LIMITS.maxSectionCharacterRefs
    ),
    locationRefs: uniqueLocationRefs(
      source.locationRefs,
      LORE_EDITOR_LIMITS.maxSectionLocationRefs
    ),
    blocks: normalizeArray(source.blocks)
      .slice(0, LORE_EDITOR_LIMITS.maxBlocksPerSection)
      .map(normalizeBlock),
    metadata: normalizeObject(source.metadata),
  };
}

function normalizeChapter(value, index) {
  const source = normalizeObject(value);
  const chapterId = normalizeString(source.id) || createLoreId(`chapter-${index + 1}`);
  const sourceSections = normalizeArray(source.sections);
  const legacyBlocks = normalizeArray(source.blocks);
  const sections = sourceSections.length
    ? sourceSections
    : legacyBlocks.length
      ? [
          {
            id: createLegacySectionId(chapterId),
            title: "",
            characterRefs: [],
            locationRefs: [],
            blocks: legacyBlocks,
            metadata: { migratedFromChapterBlocks: true },
          },
        ]
      : [];

  return {
    id: chapterId,
    title: truncate(source.title, LORE_EDITOR_LIMITS.maxTitleLength),
    subtitle: truncate(source.subtitle, LORE_EDITOR_LIMITS.maxSubtitleLength),
    summary: truncate(source.summary, LORE_EDITOR_LIMITS.maxSummaryLength),
    eyebrow: truncate(source.eyebrow, LORE_EDITOR_LIMITS.maxTitleLength),
    era: truncate(source.era, LORE_EDITOR_LIMITS.maxTitleLength),
    displayDate: truncate(source.displayDate, LORE_EDITOR_LIMITS.maxTitleLength),
    timelineOrder: Number.isFinite(Number(source.timelineOrder))
      ? Number(source.timelineOrder)
      : index,
    characterRefs: uniqueCharacterRefs(
      source.characterRefs,
      LORE_EDITOR_LIMITS.maxChapterCharacterRefs
    ),
    locationRefs: uniqueLocationRefs(
      source.locationRefs,
      LORE_EDITOR_LIMITS.maxChapterLocationRefs
    ),
    sections: sections
      .slice(0, LORE_EDITOR_LIMITS.maxSectionsPerChapter)
      .map((section, sectionIndex) => normalizeSection(section, sectionIndex, chapterId)),
    metadata: normalizeObject(source.metadata),
  };
}

function createSection(title = "New Section") {
  return normalizeSection(
    {
      id: createLoreId("section"),
      title,
      subtitle: "",
      summary: "",
      eyebrow: "",
      era: "",
      displayDate: "",
      characterRefs: [],
      locationRefs: [],
      blocks: [createBlock("text")],
      metadata: {},
    },
    0,
    "chapter"
  );
}

export function createEmptyLoreDocument() {
  return normalizeLoreDocument({
    subtitle: "",
    eyebrow: "Lore Archive",
    summary: "",
    era: "",
    displayDate: "",
    realm: "",
    characterRefs: [],
    locationRefs: [],
    chapters: [
      {
        id: createLoreId("chapter"),
        title: "Opening Chapter",
        subtitle: "",
        summary: "",
        characterRefs: [],
        locationRefs: [],
        sections: [
          {
            id: createLoreId("section"),
            title: "Opening Section",
            subtitle: "",
            summary: "",
            characterRefs: [],
            locationRefs: [],
            blocks: [
              {
                id: createLoreId("block"),
                type: "text",
                title: "",
                body: "Begin writing your lore here.",
                dropCap: true,
              },
            ],
          },
        ],
      },
    ],
  });
}

export function normalizeLoreDocument(value) {
  const source = normalizeObject(value);

  return {
    contractVersion: LORE_DOCUMENT_CONTRACT_VERSION,
    subtitle: truncate(source.subtitle, LORE_EDITOR_LIMITS.maxSubtitleLength),
    eyebrow: truncate(source.eyebrow || "Lore Archive", LORE_EDITOR_LIMITS.maxTitleLength),
    summary: truncate(source.summary, LORE_EDITOR_LIMITS.maxSummaryLength),
    era: truncate(source.era, LORE_EDITOR_LIMITS.maxTitleLength),
    displayDate: truncate(source.displayDate, LORE_EDITOR_LIMITS.maxTitleLength),
    realm: truncate(source.realm, LORE_EDITOR_LIMITS.maxTitleLength),
    characterRefs: uniqueCharacterRefs(
      source.characterRefs,
      LORE_EDITOR_LIMITS.maxDocumentCharacterRefs
    ),
    locationRefs: uniqueLocationRefs(
      source.locationRefs,
      LORE_EDITOR_LIMITS.maxDocumentLocationRefs
    ),
    chapters: normalizeArray(source.chapters)
      .slice(0, LORE_EDITOR_LIMITS.maxChapters)
      .map(normalizeChapter),
    metadata: normalizeObject(source.metadata),
  };
}

function issue(code, path, message, severity = "ERROR") {
  return { code, path, message, severity };
}

export function validateLoreDocument(value) {
  const document = normalizeLoreDocument(value);
  const issues = [];
  const chapterIds = new Set();
  const sectionIds = new Set();
  const blockIds = new Set();
  const columnIds = new Set();
  let totalSections = 0;
  let totalBlocks = 0;
  let totalTextCharacters = 0;

  function validateBlock(block, blockPath, eligibleCharacterIds) {
    totalBlocks += 1;

    if (blockIds.has(block.id)) {
      issues.push(
        issue(
          "LORE_BLOCK_ID_DUPLICATE",
          `${blockPath}.id`,
          "Block identifiers must be unique."
        )
      );
    }
    blockIds.add(block.id);

    const itemText =
      block.type === "stat-block"
        ? block.items.flatMap((item) => [item.label, item.value])
        : block.items;

    totalTextCharacters += [
      block.title,
      block.subtitle,
      block.text,
      block.body,
      block.attribution,
      block.caption,
      ...itemText,
    ]
      .filter(Boolean)
      .join("").length;

    if (block.type === "text" && !normalizeString(block.body)) {
      issues.push(
        issue("LORE_TEXT_REQUIRED", `${blockPath}.body`, "Body Text blocks need text.")
      );
    }
    if (block.type === "heading" && !normalizeString(block.text)) {
      issues.push(
        issue(
          "LORE_HEADING_REQUIRED",
          `${blockPath}.text`,
          "Heading blocks need a heading."
        )
      );
    }
    if (
      ["quote", "inline-quote", "pull-quote"].includes(block.type) &&
      !normalizeString(block.text)
    ) {
      issues.push(
        issue("LORE_QUOTE_REQUIRED", `${blockPath}.text`, "Quote blocks need quote text.")
      );
    }
    if (
      ["excerpt", "story-excerpt"].includes(block.type) &&
      !normalizeString(block.body)
    ) {
      issues.push(
        issue(
          "LORE_EXCERPT_REQUIRED",
          `${blockPath}.body`,
          "Excerpt blocks need body text."
        )
      );
    }
    if (
      block.type === "sidebar" &&
      !normalizeString(block.body) &&
      !block.items.length
    ) {
      issues.push(
        issue(
          "LORE_SIDEBAR_REQUIRED",
          `${blockPath}.items`,
          "Sidebar blocks need body text or at least one list item."
        )
      );
    }
    if (block.type === "callout" && !normalizeString(block.body)) {
      issues.push(
        issue(
          "LORE_CALLOUT_REQUIRED",
          `${blockPath}.body`,
          "Callout blocks need body text."
        )
      );
    }
    if (block.type === "stat-block") {
      if (!block.items.length) {
        issues.push(
          issue(
            "LORE_STAT_ITEMS_REQUIRED",
            `${blockPath}.items`,
            "Reference Stat Blocks need at least one label and value row."
          )
        );
      }
      block.items.forEach((item, itemIndex) => {
        if (!normalizeString(item.label) || !normalizeString(item.value)) {
          issues.push(
            issue(
              "LORE_STAT_ITEM_INCOMPLETE",
              `${blockPath}.items[${itemIndex}]`,
              "Each Reference Stat Block row needs both a label and a value."
            )
          );
        }
      });
    }
    if (block.type === "image") {
      if (!block.sourceCharacterId || !eligibleCharacterIds.has(block.sourceCharacterId)) {
        issues.push(
          issue(
            "LORE_IMAGE_CHARACTER_REQUIRED",
            `${blockPath}.sourceCharacterId`,
            "Character Image blocks must use a Character tagged on the Lore Asset, chapter, or section."
          )
        );
      }
      if (!block.libraryEntryId || !block.src) {
        issues.push(
          issue(
            "LORE_IMAGE_REQUIRED",
            `${blockPath}.libraryEntryId`,
            "Select an eligible image from the tagged Character's library."
          )
        );
      }
    }
    if (block.type === "two-column") {
      if (block.columns.length !== 2) {
        issues.push(
          issue(
            "LORE_TWO_COLUMN_REQUIRED",
            `${blockPath}.columns`,
            "Two Column Layout blocks require exactly two columns."
          )
        );
      }
      block.columns.forEach((column, columnIndex) => {
        if (columnIds.has(column.id)) {
          issues.push(
            issue(
              "LORE_COLUMN_ID_DUPLICATE",
              `${blockPath}.columns[${columnIndex}].id`,
              "Column identifiers must be unique."
            )
          );
        }
        columnIds.add(column.id);

        if (!column.blocks.length) {
          issues.push(
            issue(
              "LORE_COLUMN_EMPTY",
              `${blockPath}.columns[${columnIndex}].blocks`,
              "Each column needs at least one content block.",
              "WARNING"
            )
          );
        }
        column.blocks.forEach((columnBlock, columnBlockIndex) =>
          validateBlock(
            columnBlock,
            `${blockPath}.columns[${columnIndex}].blocks[${columnBlockIndex}]`,
            eligibleCharacterIds
          )
        );
      });
    }
  }

  if (!document.chapters.length) {
    issues.push(issue("LORE_CHAPTER_REQUIRED", "chapters", "Add at least one chapter."));
  }

  document.chapters.forEach((chapter, chapterIndex) => {
    const chapterPath = `chapters[${chapterIndex}]`;

    if (!normalizeString(chapter.title)) {
      issues.push(
        issue(
          "LORE_CHAPTER_TITLE_REQUIRED",
          `${chapterPath}.title`,
          "Every chapter needs a title."
        )
      );
    }
    if (chapterIds.has(chapter.id)) {
      issues.push(
        issue(
          "LORE_CHAPTER_ID_DUPLICATE",
          `${chapterPath}.id`,
          "Chapter identifiers must be unique."
        )
      );
    }
    chapterIds.add(chapter.id);

    totalSections += chapter.sections.length;
    if (!chapter.sections.length) {
      issues.push(
        issue(
          "LORE_CHAPTER_EMPTY",
          `${chapterPath}.sections`,
          "This chapter has no sections.",
          "WARNING"
        )
      );
    }

    chapter.sections.forEach((section, sectionIndex) => {
      const sectionPath = `${chapterPath}.sections[${sectionIndex}]`;

      if (sectionIds.has(section.id)) {
        issues.push(
          issue(
            "LORE_SECTION_ID_DUPLICATE",
            `${sectionPath}.id`,
            "Section identifiers must be unique."
          )
        );
      }
      sectionIds.add(section.id);

      if (!section.blocks.length) {
        issues.push(
          issue(
            "LORE_SECTION_EMPTY",
            `${sectionPath}.blocks`,
            "This section has no content blocks.",
            "WARNING"
          )
        );
      }

      const eligibleCharacterIds = new Set([
        ...document.characterRefs.map((ref) => ref.id),
        ...chapter.characterRefs.map((ref) => ref.id),
        ...section.characterRefs.map((ref) => ref.id),
      ]);

      section.blocks.forEach((block, blockIndex) =>
        validateBlock(block, `${sectionPath}.blocks[${blockIndex}]`, eligibleCharacterIds)
      );
    });
  });

  if (totalSections > LORE_EDITOR_LIMITS.maxTotalSections) {
    issues.push(
      issue(
        "LORE_SECTION_LIMIT",
        "chapters",
        `Lore Assets cannot exceed ${LORE_EDITOR_LIMITS.maxTotalSections.toLocaleString()} sections.`
      )
    );
  }
  if (totalBlocks > LORE_EDITOR_LIMITS.maxTotalBlocks) {
    issues.push(
      issue(
        "LORE_BLOCK_LIMIT",
        "chapters",
        `Lore Assets cannot exceed ${LORE_EDITOR_LIMITS.maxTotalBlocks.toLocaleString()} blocks.`
      )
    );
  }
  if (totalTextCharacters > LORE_EDITOR_LIMITS.maxTotalTextCharacters) {
    issues.push(
      issue(
        "LORE_TEXT_LIMIT",
        "chapters",
        `Lore Assets cannot exceed ${LORE_EDITOR_LIMITS.maxTotalTextCharacters.toLocaleString()} text characters.`
      )
    );
  }

  return issues;
}

async function fetchCreationReactionsInBatches(creationIds, batchSize = 100) {
  const ids = [...new Set(normalizeArray(creationIds).filter(Boolean))];
  const reactions = [];

  for (let index = 0; index < ids.length; index += batchSize) {
    const batch = ids.slice(index, index + batchSize);
    reactions.push(...(await fetchCreationReactions(batch)));
  }

  return reactions;
}

function normalizeCreationReference(creation, type) {
  const data = normalizeObject(creation?.data);
  const featured = normalizeArray(
    creation?.featuredMedia ||
      creation?.featured_media ||
      data.featuredMedia ||
      data.featured_media
  );
  const primary = featured[0] || {};
  const value = {
    id: creation?.id,
    title: creation?.title || data.name,
    imageUrl:
      primary.imageUrl || primary.url || data.profileImage || data.profile_image,
  };

  return type === "LOCATION"
    ? normalizeLocationRef(value)
    : normalizeCharacterRef(value);
}

function getImageLibrary(payload) {
  return payload?.data?.imageLibrary || payload?.imageLibrary || null;
}

function normalizeLibraryImage(image) {
  return {
    ...image,
    displayImageUrl:
      image?.displayImageUrl ||
      image?.displayUrl ||
      image?.thumbnailUrl ||
      image?.imageUrl ||
      image?.url ||
      "",
  };
}

function createBlock(type) {
  const base = {
    id: createLoreId("block"),
    type,
    title: "",
    subtitle: "",
    text: "",
    body: "",
    attribution: "",
    items: [],
    columns: [],
    level: 2,
    dropCap: false,
    indent: false,
    sourceCharacterId: "",
    libraryEntryId: "",
    imageOutputId: "",
    src: "",
    alt: "",
    caption: "",
    size: "full",
    align: "center",
    metadata: {},
  };

  if (type === "text") base.body = "New lore passage.";
  if (type === "heading") base.text = "New Heading";
  if (["quote", "inline-quote", "pull-quote"].includes(type)) {
    base.text = "New quote";
  }
  if (type === "excerpt") {
    base.title = "Recovered Fragment";
    base.body = "Add an archival excerpt or reconstructed account.";
  }
  if (type === "story-excerpt") {
    base.title = "Recovered Fragment";
    base.subtitle = "Untitled Account";
    base.body = "Add the narrative excerpt here.";
  }
  if (type === "sidebar") {
    base.title = "Persistent Rumors";
    base.items = ["Add the first sidebar item."];
  }
  if (type === "stat-block") {
    base.title = "Quick Reference";
    base.items = [
      {
        id: createLoreId("stat"),
        label: "Role",
        value: "Add a reference detail.",
      },
    ];
  }
  if (type === "two-column") {
    base.columns = [
      {
        id: createLoreId("column"),
        blocks: [{ ...createBlock("text"), body: "Add the left-column passage." }],
      },
      {
        id: createLoreId("column"),
        blocks: [{ ...createBlock("text"), body: "Add the right-column passage." }],
      },
    ];
  }
  if (type === "callout") {
    base.title = "Archive Note";
    base.body = "Add context, a rumor, or an uncertain account.";
  }

  return base;
}

function countLoreBlocks(blocks) {
  return normalizeArray(blocks).reduce(
    (total, block) =>
      total +
      1 +
      (block?.type === "two-column"
        ? normalizeArray(block.columns).reduce(
            (columnTotal, column) =>
              columnTotal + countLoreBlocks(normalizeArray(column?.blocks)),
            0
          )
        : 0),
    0
  );
}

export function useLoreEditorViewModel({ value, onChange, contentRating = "SFW" } = {}) {
  const document = useMemo(() => normalizeLoreDocument(value), [value]);
  const [ownedCharacters, setOwnedCharacters] = useState([]);
  const [likedCharacters, setLikedCharacters] = useState([]);
  const [ownedCharacterLoadStatus, setOwnedCharacterLoadStatus] = useState("idle");
  const [likedCharacterLoadStatus, setLikedCharacterLoadStatus] = useState("idle");
  const [ownedCharacterLoadMessage, setOwnedCharacterLoadMessage] = useState("");
  const [likedCharacterLoadMessage, setLikedCharacterLoadMessage] = useState("");
  const [ownedLocations, setOwnedLocations] = useState([]);
  const [likedLocations, setLikedLocations] = useState([]);
  const [ownedLocationLoadStatus, setOwnedLocationLoadStatus] = useState("idle");
  const [likedLocationLoadStatus, setLikedLocationLoadStatus] = useState("idle");
  const [ownedLocationLoadMessage, setOwnedLocationLoadMessage] = useState("");
  const [likedLocationLoadMessage, setLikedLocationLoadMessage] = useState("");
  const [expandedChapterId, setExpandedChapterId] = useState(
    () => document.chapters[0]?.id || ""
  );
  const [expandedSectionId, setExpandedSectionId] = useState(
    () => document.chapters[0]?.sections[0]?.id || ""
  );
  const [imagePicker, setImagePicker] = useState(null);
  const [imageLibraryStatus, setImageLibraryStatus] = useState("idle");
  const [imageLibraryMessage, setImageLibraryMessage] = useState("");
  const [imageLibraryImages, setImageLibraryImages] = useState([]);
  const [jsonEditorOpen, setJsonEditorOpen] = useState(false);

  useEffect(() => {
    if (!expandedChapterId) return;
    if (document.chapters.some((chapter) => chapter.id === expandedChapterId)) return;
    const nextChapter = document.chapters[0];
    setExpandedChapterId(nextChapter?.id || "");
    setExpandedSectionId(nextChapter?.sections[0]?.id || "");
  }, [document.chapters, expandedChapterId]);

  useEffect(() => {
    if (!expandedSectionId) return;

    const sectionExists = document.chapters.some((chapter) =>
      chapter.sections.some((section) => section.id === expandedSectionId)
    );
    if (sectionExists) return;

    const expandedChapter = document.chapters.find(
      (chapter) => chapter.id === expandedChapterId
    );
    setExpandedSectionId(expandedChapter?.sections[0]?.id || "");
  }, [document.chapters, expandedChapterId, expandedSectionId]);

  useEffect(() => {
    let active = true;

    setOwnedCharacterLoadStatus("loading");
    setOwnedCharacterLoadMessage("");
    fetchOwnedCreations({ type: "CHARACTER" })
      .then((creations) => {
        if (!active) return;
        setOwnedCharacters(
          normalizeArray(creations)
            .map((creation) => normalizeCreationReference(creation, "CHARACTER"))
            .filter(Boolean)
        );
        setOwnedCharacterLoadStatus("loaded");
      })
      .catch((error) => {
        if (!active) return;
        setOwnedCharacters([]);
        setOwnedCharacterLoadStatus("error");
        setOwnedCharacterLoadMessage(
          error?.message || "Owned Characters could not be loaded."
        );
      });

    setLikedCharacterLoadStatus("loading");
    setLikedCharacterLoadMessage("");
    fetchCommunityCreations({ type: "CHARACTER" })
      .then(async (creations) => {
        const publicCharacters = normalizeArray(creations);
        const reactions = await fetchCreationReactionsInBatches(
          publicCharacters.map((creation) => creation?.id).filter(Boolean)
        );
        const likedIds = new Set(
          normalizeArray(reactions)
            .filter((reaction) => reaction?.reactionType === "LIKE")
            .map((reaction) => reaction?.creationId)
            .filter(Boolean)
        );

        if (!active) return;
        setLikedCharacters(
          publicCharacters
            .filter((creation) => likedIds.has(creation?.id))
            .map((creation) => normalizeCreationReference(creation, "CHARACTER"))
            .filter(Boolean)
        );
        setLikedCharacterLoadStatus("loaded");
      })
      .catch((error) => {
        if (!active) return;
        setLikedCharacters([]);
        setLikedCharacterLoadStatus("error");
        setLikedCharacterLoadMessage(
          error?.message || "Liked Characters could not be loaded."
        );
      });

    setOwnedLocationLoadStatus("loading");
    setOwnedLocationLoadMessage("");
    fetchOwnedCreations({ type: "LOCATION" })
      .then((creations) => {
        if (!active) return;
        setOwnedLocations(
          normalizeArray(creations)
            .map((creation) => normalizeCreationReference(creation, "LOCATION"))
            .filter(Boolean)
        );
        setOwnedLocationLoadStatus("loaded");
      })
      .catch((error) => {
        if (!active) return;
        setOwnedLocations([]);
        setOwnedLocationLoadStatus("error");
        setOwnedLocationLoadMessage(
          error?.message || "Owned Locations could not be loaded."
        );
      });

    setLikedLocationLoadStatus("loading");
    setLikedLocationLoadMessage("");
    fetchCommunityCreations({ type: "LOCATION" })
      .then(async (creations) => {
        const publicLocations = normalizeArray(creations);
        const reactions = await fetchCreationReactionsInBatches(
          publicLocations.map((creation) => creation?.id).filter(Boolean)
        );
        const likedIds = new Set(
          normalizeArray(reactions)
            .filter((reaction) => reaction?.reactionType === "LIKE")
            .map((reaction) => reaction?.creationId)
            .filter(Boolean)
        );

        if (!active) return;
        setLikedLocations(
          publicLocations
            .filter((creation) => likedIds.has(creation?.id))
            .map((creation) => normalizeCreationReference(creation, "LOCATION"))
            .filter(Boolean)
        );
        setLikedLocationLoadStatus("loaded");
      })
      .catch((error) => {
        if (!active) return;
        setLikedLocations([]);
        setLikedLocationLoadStatus("error");
        setLikedLocationLoadMessage(
          error?.message || "Liked Locations could not be loaded."
        );
      });

    return () => {
      active = false;
    };
  }, []);

  function commit(nextDocument) {
    onChange?.(normalizeLoreDocument(nextDocument));
  }

  function applyJsonDocument(nextDocument) {
    const normalized = normalizeLoreDocument(nextDocument);
    commit(normalized);
    setExpandedChapterId(normalized.chapters[0]?.id || "");
    setExpandedSectionId(normalized.chapters[0]?.sections[0]?.id || "");
  }

  function updateDocumentField(field, nextValue) {
    commit({ ...document, [field]: nextValue });
  }

  function toggleDocumentCharacter(character) {
    const exists = document.characterRefs.some((ref) => ref.id === character.id);
    if (
      !exists &&
      document.characterRefs.length >= LORE_EDITOR_LIMITS.maxDocumentCharacterRefs
    ) {
      return;
    }
    commit({
      ...document,
      characterRefs: exists
        ? document.characterRefs.filter((ref) => ref.id !== character.id)
        : [...document.characterRefs, character],
    });
  }

  function toggleDocumentLocation(location) {
    const exists = document.locationRefs.some((ref) => ref.id === location.id);
    if (
      !exists &&
      document.locationRefs.length >= LORE_EDITOR_LIMITS.maxDocumentLocationRefs
    ) {
      return;
    }
    commit({
      ...document,
      locationRefs: exists
        ? document.locationRefs.filter((ref) => ref.id !== location.id)
        : [...document.locationRefs, location],
    });
  }

  function updateChapter(chapterId, updater) {
    commit({
      ...document,
      chapters: document.chapters.map((chapter) =>
        chapter.id === chapterId ? updater(chapter) : chapter
      ),
    });
  }

  function setExpandedChapter(chapterId) {
    setExpandedChapterId(chapterId);
    if (!chapterId) return;

    const chapter = document.chapters.find((candidate) => candidate.id === chapterId);
    const currentSectionBelongsToChapter = chapter?.sections.some(
      (section) => section.id === expandedSectionId
    );
    if (!currentSectionBelongsToChapter) {
      setExpandedSectionId(chapter?.sections[0]?.id || "");
    }
  }

  function addChapter() {
    if (document.chapters.length >= LORE_EDITOR_LIMITS.maxChapters) return;

    const section = createSection("Opening Section");
    const chapter = normalizeChapter(
      {
        id: createLoreId("chapter"),
        title: `Chapter ${document.chapters.length + 1}`,
        characterRefs: [],
        locationRefs: [],
        sections: [section],
      },
      document.chapters.length
    );

    commit({ ...document, chapters: [...document.chapters, chapter] });
    setExpandedChapterId(chapter.id);
    setExpandedSectionId(section.id);
  }

  function removeChapter(chapterId) {
    const next = document.chapters.filter((chapter) => chapter.id !== chapterId);
    commit({ ...document, chapters: next });

    if (expandedChapterId === chapterId) {
      setExpandedChapterId(next[0]?.id || "");
      setExpandedSectionId(next[0]?.sections[0]?.id || "");
    }
  }

  function moveChapter(chapterId, direction) {
    const index = document.chapters.findIndex((chapter) => chapter.id === chapterId);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= document.chapters.length) return;

    const chapters = [...document.chapters];
    [chapters[index], chapters[nextIndex]] = [chapters[nextIndex], chapters[index]];
    commit({ ...document, chapters });
  }

  function updateChapterField(chapterId, field, nextValue) {
    updateChapter(chapterId, (chapter) => ({ ...chapter, [field]: nextValue }));
  }

  function toggleChapterCharacter(chapterId, character) {
    updateChapter(chapterId, (chapter) => {
      const exists = chapter.characterRefs.some((ref) => ref.id === character.id);
      if (
        !exists &&
        chapter.characterRefs.length >= LORE_EDITOR_LIMITS.maxChapterCharacterRefs
      ) {
        return chapter;
      }
      return {
        ...chapter,
        characterRefs: exists
          ? chapter.characterRefs.filter((ref) => ref.id !== character.id)
          : [...chapter.characterRefs, character],
      };
    });
  }

  function toggleChapterLocation(chapterId, location) {
    updateChapter(chapterId, (chapter) => {
      const exists = chapter.locationRefs.some((ref) => ref.id === location.id);
      if (
        !exists &&
        chapter.locationRefs.length >= LORE_EDITOR_LIMITS.maxChapterLocationRefs
      ) {
        return chapter;
      }
      return {
        ...chapter,
        locationRefs: exists
          ? chapter.locationRefs.filter((ref) => ref.id !== location.id)
          : [...chapter.locationRefs, location],
      };
    });
  }

  function updateSection(chapterId, sectionId, updater) {
    updateChapter(chapterId, (chapter) => ({
      ...chapter,
      sections: chapter.sections.map((section) =>
        section.id === sectionId ? updater(section) : section
      ),
    }));
  }

  function addSection(chapterId) {
    const chapter = document.chapters.find((candidate) => candidate.id === chapterId);
    if (!chapter || chapter.sections.length >= LORE_EDITOR_LIMITS.maxSectionsPerChapter) {
      return;
    }

    const section = createSection(`Section ${chapter.sections.length + 1}`);
    updateChapter(chapterId, (currentChapter) => ({
      ...currentChapter,
      sections: [...currentChapter.sections, section],
    }));
    setExpandedSectionId(section.id);
  }

  function removeSection(chapterId, sectionId) {
    const chapter = document.chapters.find((candidate) => candidate.id === chapterId);
    if (!chapter) return;

    const nextSections = chapter.sections.filter((section) => section.id !== sectionId);
    updateChapter(chapterId, (currentChapter) => ({
      ...currentChapter,
      sections: nextSections,
    }));

    if (expandedSectionId === sectionId) {
      setExpandedSectionId(nextSections[0]?.id || "");
    }
  }

  function moveSection(chapterId, sectionId, direction) {
    updateChapter(chapterId, (chapter) => {
      const index = chapter.sections.findIndex((section) => section.id === sectionId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= chapter.sections.length) {
        return chapter;
      }

      const sections = [...chapter.sections];
      [sections[index], sections[nextIndex]] = [sections[nextIndex], sections[index]];
      return { ...chapter, sections };
    });
  }

  function updateSectionField(chapterId, sectionId, field, nextValue) {
    updateSection(chapterId, sectionId, (section) => ({
      ...section,
      [field]: nextValue,
    }));
  }

  function toggleSectionCharacter(chapterId, sectionId, character) {
    updateSection(chapterId, sectionId, (section) => {
      const exists = section.characterRefs.some((ref) => ref.id === character.id);
      if (
        !exists &&
        section.characterRefs.length >= LORE_EDITOR_LIMITS.maxSectionCharacterRefs
      ) {
        return section;
      }
      return {
        ...section,
        characterRefs: exists
          ? section.characterRefs.filter((ref) => ref.id !== character.id)
          : [...section.characterRefs, character],
      };
    });
  }

  function toggleSectionLocation(chapterId, sectionId, location) {
    updateSection(chapterId, sectionId, (section) => {
      const exists = section.locationRefs.some((ref) => ref.id === location.id);
      if (
        !exists &&
        section.locationRefs.length >= LORE_EDITOR_LIMITS.maxSectionLocationRefs
      ) {
        return section;
      }
      return {
        ...section,
        locationRefs: exists
          ? section.locationRefs.filter((ref) => ref.id !== location.id)
          : [...section.locationRefs, location],
      };
    });
  }

  function addBlock(chapterId, sectionId, type) {
    updateSection(chapterId, sectionId, (section) => ({
      ...section,
      blocks:
        section.blocks.length >= LORE_EDITOR_LIMITS.maxBlocksPerSection
          ? section.blocks
          : [...section.blocks, createBlock(type)],
    }));
  }

  function updateTopLevelBlock(chapterId, sectionId, blockId, updater) {
    updateSection(chapterId, sectionId, (section) => ({
      ...section,
      blocks: section.blocks.map((block) =>
        block.id === blockId ? updater(block) : block
      ),
    }));
  }

  function updateBlock(chapterId, sectionId, blockId, field, nextValue) {
    updateTopLevelBlock(chapterId, sectionId, blockId, (block) => ({
      ...block,
      [field]: nextValue,
    }));
  }

  function removeBlock(chapterId, sectionId, blockId) {
    updateSection(chapterId, sectionId, (section) => ({
      ...section,
      blocks: section.blocks.filter((block) => block.id !== blockId),
    }));
  }

  function moveBlock(chapterId, sectionId, blockId, direction) {
    updateSection(chapterId, sectionId, (section) => {
      const index = section.blocks.findIndex((block) => block.id === blockId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= section.blocks.length) {
        return section;
      }

      const blocks = [...section.blocks];
      [blocks[index], blocks[nextIndex]] = [blocks[nextIndex], blocks[index]];
      return { ...section, blocks };
    });
  }

  function addStatItem(chapterId, sectionId, blockId) {
    updateTopLevelBlock(chapterId, sectionId, blockId, (block) => {
      if (block.items.length >= LORE_EDITOR_LIMITS.maxStatItems) return block;
      return {
        ...block,
        items: [
          ...block.items,
          { id: createLoreId("stat"), label: "", value: "" },
        ],
      };
    });
  }

  function updateStatItem(chapterId, sectionId, blockId, itemId, field, nextValue) {
    updateTopLevelBlock(chapterId, sectionId, blockId, (block) => ({
      ...block,
      items: block.items.map((item) =>
        item.id === itemId ? { ...item, [field]: nextValue } : item
      ),
    }));
  }

  function removeStatItem(chapterId, sectionId, blockId, itemId) {
    updateTopLevelBlock(chapterId, sectionId, blockId, (block) => ({
      ...block,
      items: block.items.filter((item) => item.id !== itemId),
    }));
  }

  function moveStatItem(chapterId, sectionId, blockId, itemId, direction) {
    updateTopLevelBlock(chapterId, sectionId, blockId, (block) => {
      const index = block.items.findIndex((item) => item.id === itemId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= block.items.length) {
        return block;
      }
      const items = [...block.items];
      [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
      return { ...block, items };
    });
  }

  function updateColumnBlockList(
    chapterId,
    sectionId,
    parentBlockId,
    columnIndex,
    updater
  ) {
    updateTopLevelBlock(chapterId, sectionId, parentBlockId, (block) => ({
      ...block,
      columns: block.columns.map((column, index) =>
        index === columnIndex
          ? { ...column, blocks: updater(column.blocks) }
          : column
      ),
    }));
  }

  function addColumnBlock(chapterId, sectionId, parentBlockId, columnIndex, type) {
    updateColumnBlockList(
      chapterId,
      sectionId,
      parentBlockId,
      columnIndex,
      (blocks) =>
        blocks.length >= LORE_EDITOR_LIMITS.maxBlocksPerColumn
          ? blocks
          : [...blocks, createBlock(type)]
    );
  }

  function updateColumnBlock(
    chapterId,
    sectionId,
    parentBlockId,
    columnIndex,
    blockId,
    field,
    nextValue
  ) {
    updateColumnBlockList(
      chapterId,
      sectionId,
      parentBlockId,
      columnIndex,
      (blocks) =>
        blocks.map((block) =>
          block.id === blockId ? { ...block, [field]: nextValue } : block
        )
    );
  }

  function removeColumnBlock(
    chapterId,
    sectionId,
    parentBlockId,
    columnIndex,
    blockId
  ) {
    updateColumnBlockList(
      chapterId,
      sectionId,
      parentBlockId,
      columnIndex,
      (blocks) => blocks.filter((block) => block.id !== blockId)
    );
  }

  function moveColumnBlock(
    chapterId,
    sectionId,
    parentBlockId,
    columnIndex,
    blockId,
    direction
  ) {
    updateColumnBlockList(
      chapterId,
      sectionId,
      parentBlockId,
      columnIndex,
      (blocks) => {
        const index = blocks.findIndex((block) => block.id === blockId);
        const nextIndex = index + direction;
        if (index < 0 || nextIndex < 0 || nextIndex >= blocks.length) {
          return blocks;
        }
        const nextBlocks = [...blocks];
        [nextBlocks[index], nextBlocks[nextIndex]] = [
          nextBlocks[nextIndex],
          nextBlocks[index],
        ];
        return nextBlocks;
      }
    );
  }

  function openImagePicker(
    chapterId,
    sectionId,
    blockId,
    columnIndex = null,
    columnBlockId = ""
  ) {
    const chapter = document.chapters.find((candidate) => candidate.id === chapterId);
    const section = chapter?.sections.find((candidate) => candidate.id === sectionId);
    const ownedCharacterIds = new Set(ownedCharacters.map((item) => item.id));
    const eligibleCharacters = [
      ...document.characterRefs,
      ...(chapter?.characterRefs || []),
      ...(section?.characterRefs || []),
    ].filter(
      (item, index, values) =>
        ownedCharacterIds.has(item.id) &&
        values.findIndex((candidate) => candidate.id === item.id) === index
    );

    setImagePicker({
      chapterId,
      sectionId,
      blockId,
      columnIndex,
      columnBlockId,
      eligibleCharacters,
      selectedCharacterId: "",
    });
    setImageLibraryStatus("idle");
    setImageLibraryMessage("");
    setImageLibraryImages([]);
  }

  async function selectImageCharacter(characterId) {
    if (!imagePicker || !characterId) return;

    setImagePicker((current) => ({ ...current, selectedCharacterId: characterId }));
    setImageLibraryStatus("loading");
    setImageLibraryMessage("");
    setImageLibraryImages([]);

    try {
      const payload = await fetchCreationImageLibrary(characterId);
      const library = getImageLibrary(payload);
      const eligibleImages = normalizeArray(library?.images)
        .map(normalizeLibraryImage)
        .filter(
          (image) =>
            image.libraryVisibility === "VISIBLE" &&
            image.canUseAsFeatured === true &&
            isImageRatingAllowed(image.contentRating, contentRating) &&
            image.displayImageUrl
        );

      setImageLibraryImages(eligibleImages);
      setImageLibraryStatus("loaded");
    } catch (error) {
      setImageLibraryStatus("error");
      setImageLibraryMessage(
        error?.message || "Character image library could not be loaded."
      );
    }
  }

  function applySelectedImage(block, image, selectedCharacterId) {
    const imageOutputId = normalizeString(image.imageOutputId);
    const durableImageSrc = imageOutputId
      ? `/api/media/images/${encodeURIComponent(imageOutputId)}/file`
      : normalizeString(image.displayImageUrl);

    return {
      ...block,
      sourceCharacterId: selectedCharacterId,
      libraryEntryId: normalizeString(image.id || image.libraryEntryId),
      imageOutputId,
      src: durableImageSrc,
      alt: block.alt || image.title || "Lore character image",
    };
  }

  function chooseImage(image) {
    if (!imagePicker?.selectedCharacterId) return;

    const {
      chapterId,
      sectionId,
      blockId,
      columnIndex,
      columnBlockId,
      selectedCharacterId,
    } = imagePicker;

    if (Number.isInteger(columnIndex) && columnBlockId) {
      updateColumnBlockList(
        chapterId,
        sectionId,
        blockId,
        columnIndex,
        (blocks) =>
          blocks.map((block) =>
            block.id === columnBlockId
              ? applySelectedImage(block, image, selectedCharacterId)
              : block
          )
      );
    } else {
      updateTopLevelBlock(chapterId, sectionId, blockId, (block) =>
        applySelectedImage(block, image, selectedCharacterId)
      );
    }

    setImagePicker(null);
  }

  const issues = useMemo(() => validateLoreDocument(document), [document]);
  const sectionCount = document.chapters.reduce(
    (total, chapter) => total + chapter.sections.length,
    0
  );
  const blockCount = document.chapters.reduce(
    (chapterTotal, chapter) =>
      chapterTotal +
      chapter.sections.reduce(
        (sectionTotal, section) =>
          sectionTotal + countLoreBlocks(section.blocks),
        0
      ),
    0
  );

  return {
    document,
    ownedCharacters,
    likedCharacters,
    ownedCharacterLoadStatus,
    likedCharacterLoadStatus,
    ownedCharacterLoadMessage,
    likedCharacterLoadMessage,
    ownedLocations,
    likedLocations,
    ownedLocationLoadStatus,
    likedLocationLoadStatus,
    ownedLocationLoadMessage,
    likedLocationLoadMessage,
    expandedChapterId,
    expandedSectionId,
    blockTypes: LORE_BLOCK_TYPES,
    columnBlockTypes: LORE_COLUMN_BLOCK_TYPES,
    imageSizeOptions: LORE_IMAGE_SIZE_OPTIONS,
    imageAlignOptions: LORE_IMAGE_ALIGN_OPTIONS,
    issues,
    chapterCount: document.chapters.length,
    sectionCount,
    blockCount,
    limits: LORE_EDITOR_LIMITS,
    imagePicker,
    imageLibraryStatus,
    imageLibraryMessage,
    imageLibraryImages,
    jsonEditorOpen,
    onOpenJsonEditor: () => setJsonEditorOpen(true),
    onCloseJsonEditor: () => setJsonEditorOpen(false),
    onApplyJsonDocument: applyJsonDocument,
    onUpdateDocumentField: updateDocumentField,
    onToggleDocumentCharacter: toggleDocumentCharacter,
    onToggleDocumentLocation: toggleDocumentLocation,
    onSetExpandedChapter: setExpandedChapter,
    onSetExpandedSection: setExpandedSectionId,
    onAddChapter: addChapter,
    onRemoveChapter: removeChapter,
    onMoveChapter: moveChapter,
    onUpdateChapterField: updateChapterField,
    onToggleChapterCharacter: toggleChapterCharacter,
    onToggleChapterLocation: toggleChapterLocation,
    onAddSection: addSection,
    onRemoveSection: removeSection,
    onMoveSection: moveSection,
    onUpdateSectionField: updateSectionField,
    onToggleSectionCharacter: toggleSectionCharacter,
    onToggleSectionLocation: toggleSectionLocation,
    onAddBlock: addBlock,
    onUpdateBlock: updateBlock,
    onRemoveBlock: removeBlock,
    onMoveBlock: moveBlock,
    onAddStatItem: addStatItem,
    onUpdateStatItem: updateStatItem,
    onRemoveStatItem: removeStatItem,
    onMoveStatItem: moveStatItem,
    onAddColumnBlock: addColumnBlock,
    onUpdateColumnBlock: updateColumnBlock,
    onRemoveColumnBlock: removeColumnBlock,
    onMoveColumnBlock: moveColumnBlock,
    onOpenImagePicker: openImagePicker,
    onCloseImagePicker: () => setImagePicker(null),
    onSelectImageCharacter: selectImageCharacter,
    onChooseImage: chooseImage,
  };
}
