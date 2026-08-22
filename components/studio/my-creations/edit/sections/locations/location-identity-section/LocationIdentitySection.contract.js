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
 *
 * Doc-only correction (ED1G sw12), no version bump: 39 view props
 * already read by the View were undeclared here (no
 * LocationIdentitySectionViewProps typedef existed at all).
 *
 * @typedef {Object} LocationIdentitySectionViewProps
 * @property {string} [sectionEyebrow]
 * @property {string} [sectionTitle]
 * @property {string} [sectionDescription]
 * @property {string} [locationNameLabel]
 * @property {string} [locationNameValue]
 * @property {string} [locationCategoryLabel]
 * @property {string} [locationCategoryValue]
 * @property {string} [spaceTypeLabel]
 * @property {string} [spaceTypeValue]
 * @property {LocationIdentityOption[]} [spaceTypeOptions]
 * @property {string} [locationScaleLabel]
 * @property {string} [locationScaleValue]
 * @property {LocationIdentityOption[]} [locationScaleOptions]
 * @property {string} [parentLocationLabel]
 * @property {LocationParentMetadata} [parentLocation]
 * @property {string} [parentImageFallbackUrl]
 * @property {string} [selectedParentFallbackTitle]
 * @property {string} [noParentTitle]
 * @property {string} [noParentDescription]
 * @property {string} [selectParentLabel]
 * @property {string} [changeParentLabel]
 * @property {string} [clearParentLabel]
 * @property {string} [intendedUseLabel]
 * @property {string} [intendedUseValue]
 * @property {string} [tagsLabel]
 * @property {string} [tagsValue]
 * @property {string} [creationTypeLabel]
 * @property {string} [creationTypeValue]
 * @property {string} [inheritanceEyebrow]
 * @property {string} [inheritanceDescription]
 * @property {LocationInheritanceItem[]} [inheritanceItems]
 * @property {((value:string) => void)|null} [onChangeLocationName]
 * @property {((value:string) => void)|null} [onChangeLocationCategory]
 * @property {((value:string) => void)|null} [onChangeSpaceType]
 * @property {((value:string) => void)|null} [onChangeLocationScale]
 * @property {(() => void)|null} [onOpenParentPicker]
 * @property {(() => void)|null} [onClearParentLocation]
 * @property {((value:string) => void)|null} [onChangeIntendedUse]
 * @property {((value:string) => void)|null} [onChangeTags]
 * @property {((key:string, checked:boolean) => void)|null} [onChangeInheritance]
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
