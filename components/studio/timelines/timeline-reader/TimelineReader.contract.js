export const TIMELINE_READER_VIEW_CONTRACT_VERSION = "1.2.0";

// 1.2.0 (additive, eight-fix package FIX 4, 12 Sep 2026): optional
// `breadcrumbs` items (Lore, then the timeline title) render the
// shared KitBreadcrumbs row above the action row, through the same
// LinkComponent the View already receives. Absent, 1.1.0 is unchanged.

/**
 * @typedef {Object} TimelineReaderEntry
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} subtitle
 * @property {string} era
 * @property {string} displayDate
 * @property {string} chronologyLabel
 * @property {string} chapterId
 * @property {number|null} orderOverride
 * @property {boolean} isUnavailable
 */

/**
 * @typedef {Object} TimelineReaderGroup
 * @property {string} id
 * @property {string} label
 * @property {TimelineReaderEntry[]} entries
 * @property {boolean} collapsible
 * @property {boolean} defaultOpen
 */

/**
 * Portable Timeline reader contract. The View receives display-ready chronology
 * and semantic navigation callbacks only. Owner/public data authority stays in
 * the caller/ViewModel.
 *
 * @typedef {Object} TimelineReaderViewProps
 * @property {string} timelineId
 * @property {"loading"|"ready"|"error"} loadStatus
 * @property {string} loadMessage
 * @property {string} title
 * @property {string} description
 * @property {boolean} publicEnabled
 * @property {"ASC"|"DESC"} sortDirection
 * @property {"CHAPTERS"|"ERA"|"NONE"} groupingMode
 * @property {number} entryCount
 * @property {TimelineReaderGroup[]} groups
 * @property {boolean} showEditAction
 * @property {(() => void)|null} onBack
 * @property {(() => void)|null} onEdit
 */
