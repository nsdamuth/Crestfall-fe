export const LOCATION_IDENTITY_SECTION_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Stable UI boundary for the portable Location Identity View.
 *
 * The View receives display-ready location identity values, normalized parent
 * metadata, and semantic callbacks. It must not inspect a Creation form,
 * translate legacy JSONB keys, open the application parent picker, or persist
 * location hierarchy and inheritance changes.
 *
 * @typedef {Object} LocationIdentityOption
 * @property {string} value
 * @property {string} label
 *
 * @typedef {Object} LocationParentMetadata
 * @property {string} id
 * @property {string} title
 * @property {string} imageUrl
 * @property {string} scale
 * @property {string} spaceType
 *
 * @typedef {Object} LocationInheritanceItem
 * @property {string} key
 * @property {string} label
 * @property {boolean} checked
 */
export const LOCATION_IDENTITY_SECTION_APPLICATION_BOUNDARY = Object.freeze({
  applicationOwnedControls: ["LocationParentPickerModal"],
  storageFields: [
    "name",
    "category",
    "space_type",
    "locationScale",
    "parentLocationId",
    "parentLocationTitle",
    "parentLocationDescription",
    "parentLocationImageUrl",
    "parentLocationScale",
    "parentLocationSpaceType",
    "intended_use",
    "tags",
    "inheritance",
  ],
  legacyReadFields: [
    "location_type",
    "spaceType",
    "location_scale",
    "parent_location_id",
    "parent_location_title",
    "parent_location_image_url",
    "parent_location_scale",
    "parent_location_space_type",
  ],
});

export {};
