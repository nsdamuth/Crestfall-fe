export const CREATION_EDIT_SHELL_VIEW_CONTRACT_VERSION =
  "crestfall.creation-edit-shell.view.v1";

/**
 * @typedef {Object} CreationEditSectionTab
 * @property {string} id
 * @property {string} label
 * @property {import("react").ComponentType<{size?: number}>} [icon]
 */

/**
 * @typedef {Object} CreationEditShellViewProps
 * @property {string} creationId
 * @property {string} title
 * @property {boolean} isTemplate
 * @property {string} activeSection
 * @property {CreationEditSectionTab[]} activeSections
 * @property {boolean} canSetDefaultPc
 * @property {boolean} settingDefaultPc
 * @property {() => void} onSetDefaultPc
 * @property {(sectionId: string) => void} onSelectSection
 * @property {boolean} showMechanicsQuickNav
 * @property {import("react").ReactNode} backAction
 * @property {import("react").ReactNode} mediaPanel
 * @property {import("react").ReactNode} mechanicsQuickNav
 * @property {import("react").ReactNode} sectionContent
 * @property {import("react").ReactNode} stickyActionBar
 * @property {import("react").ReactNode} featuredImagePicker
 */

export const creationEditShellViewDefaults = Object.freeze({
  title: "Untitled Creation",
  isTemplate: false,
  activeSection: "overview",
  activeSections: [],
  canSetDefaultPc: false,
  settingDefaultPc: false,
  showMechanicsQuickNav: false,
});
