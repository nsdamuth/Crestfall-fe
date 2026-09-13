export const TIMELINE_BUILDER_VIEW_CONTRACT_VERSION = "1.2.0";

// 1.2.0 (additive, eight-fix package FIX 4, 12 Sep 2026): optional
// `breadcrumbs` items (the origin section, then the timeline title)
// and an optional `LinkComponent` render the shared KitBreadcrumbs
// row above the Back control. Absent, 1.1.0 is unchanged.

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
