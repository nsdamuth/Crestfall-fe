export const TIMELINE_BUILDER_VIEW_CONTRACT_VERSION = "1.1.0";

export const TIMELINE_DRAFT_VISIBILITY_OPTIONS = Object.freeze([
  { value: "PRIVATE", label: "Private" },
  { value: "UNLISTED", label: "Unlisted" },
]);

export const TIMELINE_SORT_OPTIONS = Object.freeze([
  { value: "ASC", label: "Oldest / earliest first" },
  { value: "DESC", label: "Newest / latest first" },
]);

export const TIMELINE_GROUPING_OPTIONS = Object.freeze([
  { value: "CHAPTERS", label: "Chapters" },
  { value: "ERA", label: "Lore eras" },
  { value: "NONE", label: "Continuous chronology" },
]);
