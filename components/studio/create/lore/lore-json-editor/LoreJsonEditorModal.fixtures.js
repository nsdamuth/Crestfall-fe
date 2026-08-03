const noop = () => {};

export const loreJsonEditorTextFixture = "{\n  \"contractVersion\": \"lore_document_contract_v4\",\n  \"eyebrow\": \"Crestfall Archive\",\n  \"subtitle\": \"JSON fixture\",\n  \"summary\": \"A minimal valid Lore document for isolated JSON editing.\",\n  \"era\": \"\",\n  \"displayDate\": \"\",\n  \"realm\": \"Aster Reach\",\n  \"characterRefs\": [],\n  \"locationRefs\": [],\n  \"chapters\": [\n    {\n      \"id\": \"chapter-json-fixture\",\n      \"title\": \"JSON Fixture Chapter\",\n      \"subtitle\": \"\",\n      \"summary\": \"\",\n      \"eyebrow\": \"Chapter One\",\n      \"era\": \"\",\n      \"displayDate\": \"\",\n      \"timelineOrder\": 0,\n      \"characterRefs\": [],\n      \"locationRefs\": [],\n      \"sections\": [\n        {\n          \"id\": \"section-json-fixture\",\n          \"title\": \"JSON Fixture Section\",\n          \"subtitle\": \"\",\n          \"summary\": \"\",\n          \"eyebrow\": \"\",\n          \"era\": \"\",\n          \"displayDate\": \"\",\n          \"timelineOrder\": 0,\n          \"characterRefs\": [],\n          \"locationRefs\": [],\n          \"blocks\": [\n            {\n              \"id\": \"block-json-fixture\",\n              \"type\": \"text\",\n              \"title\": \"\",\n              \"subtitle\": \"\",\n              \"text\": \"\",\n              \"body\": \"Edit this fixture without saving a Creation.\",\n              \"attribution\": \"\",\n              \"items\": [],\n              \"columns\": [],\n              \"level\": 2,\n              \"dropCap\": true,\n              \"indent\": false,\n              \"sourceCharacterId\": \"\",\n              \"libraryEntryId\": \"\",\n              \"imageOutputId\": \"\",\n              \"src\": \"\",\n              \"alt\": \"\",\n              \"caption\": \"\",\n              \"size\": \"full\",\n              \"align\": \"center\",\n              \"metadata\": {}\n            }\n          ],\n          \"metadata\": {}\n        }\n      ],\n      \"metadata\": {}\n    }\n  ],\n  \"metadata\": {\n    \"fixture\": true\n  }\n}";

export const loreJsonEditorFixture = {
  title: "Lore JSON Editor",
  description:
    "Edit one complete Lore document object. This fixture never persists data.",
  jsonText: loreJsonEditorTextFixture,
  errors: [],
  warnings: [],
  statusMessage: "Fixture JSON is ready for isolated validation.",
  copyStatus: "idle",
  guideDownloadStatus: "idle",
  canApply: true,
  hasDraftChanges: false,
  characterCount: loreJsonEditorTextFixture.length,
  lineCount: loreJsonEditorTextFixture.split("\n").length,
  onClose: noop,
  onChangeJson: noop,
  onCopy: noop,
  onDownloadAiGuide: noop,
  onFormat: noop,
  onReset: noop,
  onValidateAndApply: noop,
};

export const loreJsonEditorErrorFixture = {
  ...loreJsonEditorFixture,
  jsonText: '{\n  "contractVersion": "unsupported_contract"\n}',
  errors: [
    {
      path: "$.contractVersion",
      message: "The Lore document contract version is not supported.",
    },
  ],
  warnings: [],
  statusMessage: "Fix the blocking JSON issue before applying.",
  hasDraftChanges: true,
  canApply: true,
};
