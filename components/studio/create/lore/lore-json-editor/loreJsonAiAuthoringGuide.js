import {
  LORE_BLOCK_TYPES,
  LORE_COLUMN_BLOCK_TYPES,
  LORE_DOCUMENT_CONTRACT_VERSION,
  LORE_EDITOR_LIMITS,
} from "../lore-editor/LoreEditor.contract";
import { normalizeLoreDocument } from "../lore-editor/useLoreEditorViewModel";

export const LORE_JSON_AI_AUTHORING_GUIDE_VERSION =
  "lore_json_ai_authoring_guide_v1";

export const LORE_JSON_AI_AUTHORING_GUIDE_FILENAME =
  "crestfall-lore-json-ai-authoring-guide.md";

export const LORE_JSON_AI_AUTHORING_GUIDE_MIME_TYPE =
  "text/markdown;charset=utf-8";

function blockTypeLines() {
  return LORE_BLOCK_TYPES.map(
    (block) => `- \`${block.value}\` — ${block.label}: ${block.description}`
  ).join("\n");
}

function columnBlockTypeLines() {
  return LORE_COLUMN_BLOCK_TYPES.map(
    (block) => `- \`${block.value}\` — ${block.label}`
  ).join("\n");
}

function formatCurrentDocument(document) {
  return JSON.stringify(normalizeLoreDocument(document), null, 2);
}

export function buildLoreJsonAiAuthoringGuide(loreDocument = {}) {
  const currentJson = formatCurrentDocument(loreDocument);

  return `# Crestfall Lore JSON AI Authoring Guide

**Guide contract:** \`${LORE_JSON_AI_AUTHORING_GUIDE_VERSION}\`

**Lore document contract:** \`${LORE_DOCUMENT_CONTRACT_VERSION}\`

## Your task

Modify the complete current Lore document JSON at the end of this guide according to the creator's request.

Return **one complete JSON object only**. Do not return Markdown fences, commentary, explanations, summaries, or partial fragments. The creator will paste the result into Crestfall and choose **Validate & Apply**.

## Non-negotiable rules

- Preserve all existing content outside the requested changes.
- Preserve existing \`id\` values for chapters, sections, blocks, columns, and stat rows unless the creator explicitly asks to remove that object.
- New authored objects may use readable unique ids such as \`chapter-santosa-war\`, \`section-marriage-treaty\`, or \`block-opening-account\`.
- Do not invent database UUIDs, Character ids, Location ids, image-library ids, image URLs, or private identifiers.
- Character and Location references may only reuse exact reference objects already present somewhere in the current JSON.
- Image blocks may only reuse image reference fields already present in the current JSON. To add a new Character, Location, or image, tell the creator to add it through Crestfall's visual editor first rather than inventing identifiers.
- Keep \`contractVersion\` exactly \`${LORE_DOCUMENT_CONTRACT_VERSION}\`.
- Keep every chapter title non-empty.
- Keep all ids unique across their respective object types.
- Do not exceed the limits listed below.
- Return valid JSON using double-quoted property names and strings. Do not include trailing commas or comments.

## Root Lore document shape

\`\`\`json
{
  "contractVersion": "${LORE_DOCUMENT_CONTRACT_VERSION}",
  "subtitle": "",
  "eyebrow": "Lore Archive",
  "summary": "",
  "era": "",
  "displayDate": "",
  "realm": "",
  "characterRefs": [],
  "locationRefs": [],
  "chapters": [],
  "metadata": {}
}
\`\`\`

## Chapter shape

\`\`\`json
{
  "id": "chapter-example",
  "title": "Chapter Title",
  "subtitle": "",
  "summary": "",
  "eyebrow": "",
  "era": "",
  "displayDate": "",
  "timelineOrder": 0,
  "characterRefs": [],
  "locationRefs": [],
  "sections": [],
  "metadata": {}
}
\`\`\`

## Section shape

\`\`\`json
{
  "id": "section-example",
  "title": "Section Title",
  "subtitle": "",
  "summary": "",
  "eyebrow": "",
  "era": "",
  "displayDate": "",
  "characterRefs": [],
  "locationRefs": [],
  "blocks": [],
  "metadata": {}
}
\`\`\`

## Reference shape

Use only references already present in the current JSON.

\`\`\`json
{
  "id": "existing-creation-id",
  "type": "CHARACTER",
  "title": "Existing Character Title",
  "imageUrl": ""
}
\`\`\`

Location references use the same shape with \`"type": "LOCATION"\`.

## Supported top-level block types

${blockTypeLines()}

## Common block fields

All blocks normalize to this common field set. Keep fields that are not used by a block type as their existing values or safe empty defaults.

\`\`\`json
{
  "id": "block-example",
  "type": "text",
  "title": "",
  "subtitle": "",
  "text": "",
  "body": "",
  "attribution": "",
  "items": [],
  "columns": [],
  "level": 2,
  "dropCap": false,
  "indent": false,
  "sourceCharacterId": "",
  "libraryEntryId": "",
  "imageOutputId": "",
  "src": "",
  "alt": "",
  "caption": "",
  "size": "full",
  "align": "center",
  "metadata": {}
}
\`\`\`

## Block-specific requirements

### Body Text — \`text\`

- Put the passage in \`body\`.
- \`body\` must not be empty.
- Optional: \`dropCap\` and \`indent\`.

### Heading — \`heading\`

- Put the heading in \`text\`.
- \`level\` is \`2\` or \`3\`.

### Quote types — \`quote\`, \`inline-quote\`, \`pull-quote\`

- Put the quotation in \`text\`.
- Put the speaker/source in \`attribution\` when known.

### Archive Excerpt — \`excerpt\`

- Put the excerpt title in \`title\`.
- Put the excerpt body in \`body\`.
- Optional source in \`attribution\`.

### Story Excerpt — \`story-excerpt\`

- Put the label in \`title\`.
- Put the scene/excerpt title in \`subtitle\`.
- Put the narrative in \`body\`.
- Optional source in \`attribution\`.

### Sidebar List — \`sidebar\`

- Put the panel title in \`title\`.
- Optional introduction in \`body\`.
- Put list entries in \`items\` as an array of strings.

### Callout — \`callout\`

- Put the callout label in \`title\`.
- Put its content in \`body\`.

### Reference Stat Block — \`stat-block\`

- Put the panel title in \`title\`.
- \`items\` is an array of objects with \`id\`, \`label\`, and \`value\`.
- Every row needs both a label and value.

\`\`\`json
{
  "id": "block-quick-reference",
  "type": "stat-block",
  "title": "Quick Reference",
  "items": [
    {
      "id": "stat-period",
      "label": "Period",
      "value": "1991–1994"
    }
  ]
}
\`\`\`

### Character Image — \`image\`

- Preserve existing \`sourceCharacterId\`, \`libraryEntryId\`, \`imageOutputId\`, and \`src\` values exactly.
- The source Character must be tagged at the Asset, chapter, or section scope.
- Do not invent or alter image URLs or image identifiers.
- \`size\`: \`small\`, \`medium\`, \`large\`, or \`full\`.
- \`align\`: \`left\`, \`center\`, or \`right\`.

### Divider — \`divider\`

- No authored text is required.

### Two Column Layout — \`two-column\`

- Must contain exactly two column objects in \`columns\`.
- Each column has a unique \`id\` and a \`blocks\` array.
- Columns may contain only these block types:

${columnBlockTypeLines()}

- Do not nest another two-column layout inside a column.

## Limits

- Chapters: ${LORE_EDITOR_LIMITS.maxChapters}
- Sections per chapter: ${LORE_EDITOR_LIMITS.maxSectionsPerChapter}
- Top-level blocks per section: ${LORE_EDITOR_LIMITS.maxBlocksPerSection}
- Blocks per column: ${LORE_EDITOR_LIMITS.maxBlocksPerColumn}
- Total sections: ${LORE_EDITOR_LIMITS.maxTotalSections}
- Total blocks, including column blocks: ${LORE_EDITOR_LIMITS.maxTotalBlocks}
- Character references per Asset/chapter/section scope: 5
- Location references per Asset/chapter/section scope: 5
- Stat rows per Reference Stat Block: ${LORE_EDITOR_LIMITS.maxStatItems}
- Sidebar list items: ${LORE_EDITOR_LIMITS.maxSidebarItems}
- Total authored text characters: ${LORE_EDITOR_LIMITS.maxTotalTextCharacters}

## Final self-check before responding

Confirm all of the following:

- The response is one complete JSON object.
- There is no prose before or after the JSON.
- All braces and arrays close correctly.
- \`contractVersion\` is exactly \`${LORE_DOCUMENT_CONTRACT_VERSION}\`.
- Every chapter has a title.
- Existing stable ids were preserved.
- All new ids are unique and readable.
- No Character, Location, image, UUID, URL, or private identifier was invented.
- All references were copied exactly from the current JSON.
- Every block uses a supported type and required content field.
- Two-column blocks have exactly two columns and only supported child blocks.
- The complete current Lore document was preserved outside the requested changes.
- The creator can paste the result into Crestfall and choose **Validate & Apply**.
- The creator must still use the page-level **Save** action to persist the Lore Asset.

## Current Lore document JSON

Use this as the source of truth. Return the complete updated replacement object.

\`\`\`json
${currentJson}
\`\`\`
`;
}
