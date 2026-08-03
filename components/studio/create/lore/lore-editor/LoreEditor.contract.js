export const LORE_DOCUMENT_CONTRACT_VERSION = "lore_document_contract_v4";

export const LORE_BLOCK_TYPES = Object.freeze([
  {
    value: "text",
    label: "Body Text",
    category: "Writing",
    description: "Long-form narrative copy with optional drop-cap and indent styling.",
  },
  {
    value: "heading",
    label: "Heading",
    category: "Writing",
    description: "A standalone second- or third-level heading inside the section.",
  },
  {
    value: "image",
    label: "Character Image",
    category: "Media & Layout",
    description: "An approved image from an owned Character tagged on this Lore scope.",
  },
  {
    value: "two-column",
    label: "Two Column Layout",
    category: "Media & Layout",
    description: "A responsive left-and-right layout containing smaller narrative blocks.",
  },
  {
    value: "divider",
    label: "Divider",
    category: "Media & Layout",
    description: "A visual break between passages or ideas.",
  },
  {
    value: "quote",
    label: "Quote",
    category: "Quotations",
    description: "A traditional centered quotation with optional attribution.",
  },
  {
    value: "inline-quote",
    label: "Inline Quote",
    category: "Quotations",
    description: "A compact quotation that sits naturally within the reading flow.",
  },
  {
    value: "pull-quote",
    label: "Pull Quote",
    category: "Quotations",
    description: "A large, prominent quotation used to emphasize a key line.",
  },
  {
    value: "stat-block",
    label: "Reference Stat Block",
    category: "Archive & Reference",
    description: "An ordered set of label-and-value facts for quick reference.",
  },
  {
    value: "excerpt",
    label: "Archive Excerpt",
    category: "Archive & Reference",
    description: "A recovered record, transcript, report, or archival fragment.",
  },
  {
    value: "story-excerpt",
    label: "Story Excerpt",
    category: "Archive & Reference",
    description: "A styled narrative scene or reconstructed story fragment.",
  },
  {
    value: "sidebar",
    label: "Sidebar List",
    category: "Archive & Reference",
    description: "A titled supporting panel with an optional introduction and list items.",
  },
  {
    value: "callout",
    label: "Callout",
    category: "Archive & Reference",
    description: "A highlighted note, warning, rumor, or central contextual point.",
  },
]);

export const LORE_COLUMN_BLOCK_TYPES = Object.freeze([
  { value: "text", label: "Body Text" },
  { value: "image", label: "Character Image" },
  { value: "inline-quote", label: "Inline Quote" },
  { value: "divider", label: "Divider" },
]);

export const LORE_EDITOR_LIMITS = Object.freeze({
  maxChapters: 128,
  maxSectionsPerChapter: 256,
  maxBlocksPerSection: 256,
  maxBlocksPerColumn: 64,
  maxStatItems: 32,
  maxTotalSections: 4096,
  maxTotalBlocks: 4096,
  maxDocumentCharacterRefs: 5,
  maxChapterCharacterRefs: 5,
  maxSectionCharacterRefs: 5,
  maxDocumentLocationRefs: 5,
  maxChapterLocationRefs: 5,
  maxSectionLocationRefs: 5,
  maxTitleLength: 180,
  maxSubtitleLength: 300,
  maxSummaryLength: 4000,
  maxBlockBodyLength: 50000,
  maxSidebarItems: 64,
  maxSidebarItemLength: 1000,
  maxStatLabelLength: 180,
  maxStatValueLength: 2000,
  maxTotalTextCharacters: 2000000,
});

export const LORE_IMAGE_SIZE_OPTIONS = Object.freeze([
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "full", label: "Full Width" },
]);

export const LORE_IMAGE_ALIGN_OPTIONS = Object.freeze([
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
]);
