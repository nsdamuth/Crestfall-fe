export const CREATION_EDIT_STICKY_ACTION_BAR_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the Creation Edit sticky action bar.
 *
 * The portable View owns only the sticky presentation, status summary,
 * visibility controls, action buttons, and feedback styling. It does not
 * receive the raw creation form and does not interpret Crestfall lifecycle,
 * visibility, review, canon, ownership, or persistence rules.
 *
 * @typedef {Object} CreationEditVisibilityOptionViewItem
 * @property {string} value Semantic visibility value.
 * @property {string} label Visible button label.
 * @property {boolean} active Whether this option is currently selected.
 * @property {boolean} disabled Whether this option may be selected.
 *
 * @typedef {Object} CreationEditActionViewItem
 * @property {boolean} visible Whether the action should render.
 * @property {boolean} disabled Whether the action may be invoked.
 * @property {boolean} busy Whether the action is currently in progress.
 * @property {string} label Visible idle-state label.
 * @property {string} busyLabel Visible busy-state label.
 *
 * @typedef {Object} CreationEditStickyActionBarViewProps
 * @property {string} eyebrow
 * @property {string} visibilityLabel
 * @property {string} lifecycleStatusLabel
 * @property {string} canonStatusLabel
 * @property {string|null} editLockMessage
 * @property {CreationEditVisibilityOptionViewItem[]} visibilityOptions
 * @property {{active:boolean, disabled:boolean, title:string, label:string}} publicVisibility
 * @property {{disabled:boolean, label:string}} reviewAction
 * @property {CreationEditActionViewItem} unlistAction
 * @property {CreationEditActionViewItem} saveAction
 * @property {CreationEditActionViewItem} cancelReviewAction
 * @property {{message:string, tone:"success"|"error"}|null} saveFeedback
 * @property {(visibility:string)=>void} onSelectVisibility
 * @property {()=>void} onOpenReviewActions
 * @property {()=>void} onUnlistForEditing
 * @property {()=>void} onSaveChanges
 * @property {()=>void} onCancelReview
 */

export {};
