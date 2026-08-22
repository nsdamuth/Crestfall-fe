"use client";

import { useState } from "react";

// Terminology map (4.6, D8/F2, ED1G): a raw data-layer enum never
// surfaces to the screen. Matches the same map pattern in
// character-identity-section/useCharacterIdentitySectionViewModel.js.
const CREATION_TYPE_LABELS = Object.freeze({
  LOCATION: "Location",
});

const DEFAULT_COPY = Object.freeze({
  sectionEyebrow: "Location Editor",
  sectionTitle: "Location Identity",
  sectionDescription:
    "Define what this visual location asset is, how it sits in the world hierarchy, and how it may inherit runtime rules such as weather, time, knowledge, and travel.",
  locationNameLabel: "Location Name",
  locationCategoryLabel: "Location Type / Category",
  spaceTypeLabel: "Space Type",
  locationScaleLabel: "Location Scale",
  parentLocationLabel: "Parent Location",
  selectedParentFallbackTitle: "Selected Parent Location",
  noParentTitle: "No parent location selected",
  noParentDescription:
    "Choose a broader parent location such as realm, city, district, or building. This controls inherited runtime context.",
  selectParentLabel: "Select Parent",
  changeParentLabel: "Change Parent",
  clearParentLabel: "Clear",
  intendedUseLabel: "Intended Use",
  tagsLabel: "Tags",
  creationTypeLabel: "Creation Type",
  inheritanceEyebrow: "Inheritance",
  inheritanceDescription:
    "These settings control whether this location inherits runtime context from parent locations. They do not change image generation directly.",
});

export const LOCATION_SPACE_TYPE_OPTIONS = Object.freeze([
  { value: "", label: "Not chosen" },
  { value: "INTERIOR", label: "Interior" },
  { value: "EXTERIOR", label: "Exterior" },
  { value: "CITY", label: "City" },
  { value: "WILDERNESS", label: "Wilderness" },
  { value: "RUIN", label: "Ruin" },
  { value: "DREAMLIKE", label: "Dreamlike" },
]);

export const LOCATION_SCALE_OPTIONS = Object.freeze([
  { value: "", label: "Not chosen" },
  { value: "REALM", label: "Realm / Plane" },
  { value: "PLANET", label: "Planet" },
  { value: "CONTINENT", label: "Continent" },
  { value: "REGION", label: "Region" },
  { value: "KINGDOM", label: "Kingdom / Nation" },
  { value: "CITY", label: "City" },
  { value: "DISTRICT", label: "District" },
  { value: "NEIGHBORHOOD", label: "Neighborhood" },
  { value: "BUILDING", label: "Building" },
  { value: "ROOM", label: "Room" },
  { value: "LANDMARK", label: "Landmark" },
  { value: "WILDERNESS", label: "Wilderness" },
  { value: "DUNGEON", label: "Dungeon" },
  { value: "POCKET_DIMENSION", label: "Pocket Dimension" },
  { value: "OTHER", label: "Other" },
]);

export const LOCATION_INHERITANCE_ITEMS = Object.freeze([
  { key: "inheritsWeather", label: "Inherit Weather" },
  { key: "inheritsTime", label: "Inherit Time / Calendar" },
  { key: "inheritsKnowledgeRules", label: "Inherit Knowledge Rules" },
  { key: "inheritsTravelRules", label: "Inherit Travel Rules" },
]);

export function formatLocationIdentityTags(value) {
  if (Array.isArray(value)) return value.join(", ");
  return value || "";
}

export function parseLocationIdentityTags(value) {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function normalizeLocationInheritance(value) {
  const inheritance =
    value && typeof value === "object" && !Array.isArray(value) ? value : {};

  return {
    inheritsWeather: inheritance.inheritsWeather !== false,
    inheritsTime: inheritance.inheritsTime !== false,
    inheritsKnowledgeRules: inheritance.inheritsKnowledgeRules !== false,
    inheritsTravelRules: inheritance.inheritsTravelRules !== false,
  };
}

export function resolveLocationParentMetadata(data = {}) {
  return {
    id: data.parentLocationId || data.parent_location_id || "",
    title: data.parentLocationTitle || data.parent_location_title || "",
    imageUrl:
      data.parentLocationImageUrl || data.parent_location_image_url || "",
    scale: data.parentLocationScale || data.parent_location_scale || "",
    spaceType:
      data.parentLocationSpaceType || data.parent_location_space_type || "",
  };
}

export function useLocationIdentitySectionViewModel({
  form = {},
  creationId = "",
  updateDataField = null,
} = {}) {
  const [isParentPickerOpen, setIsParentPickerOpen] = useState(false);
  const data = form?.data || {};
  const inheritance = normalizeLocationInheritance(data.inheritance);
  const parentLocation = resolveLocationParentMetadata(data);

  function updateInheritanceField(field, value) {
    updateDataField?.("inheritance", {
      ...inheritance,
      [field]: Boolean(value),
    });
  }

  function selectParentLocation(selection = {}) {
    updateDataField?.("parentLocationId", selection.parentLocationId);
    updateDataField?.("parentLocationTitle", selection.parentLocationTitle);
    updateDataField?.(
      "parentLocationDescription",
      selection.parentLocationDescription
    );
    updateDataField?.("parentLocationImageUrl", selection.parentLocationImageUrl);
    updateDataField?.("parentLocationScale", selection.parentLocationScale);
    updateDataField?.(
      "parentLocationSpaceType",
      selection.parentLocationSpaceType
    );
    setIsParentPickerOpen(false);
  }

  function clearParentLocation() {
    updateDataField?.("parentLocationId", "");
    updateDataField?.("parentLocationTitle", "");
    updateDataField?.("parentLocationDescription", "");
    updateDataField?.("parentLocationImageUrl", "");
    updateDataField?.("parentLocationScale", "");
    updateDataField?.("parentLocationSpaceType", "");
  }

  return {
    viewProps: {
      ...DEFAULT_COPY,
      locationNameValue: data.name ?? form?.title ?? "",
      locationCategoryValue: data.category || data.location_type || "",
      spaceTypeValue: data.space_type || data.spaceType || "",
      spaceTypeOptions: LOCATION_SPACE_TYPE_OPTIONS,
      locationScaleValue: data.locationScale || data.location_scale || "",
      locationScaleOptions: LOCATION_SCALE_OPTIONS,
      parentLocation,
      parentImageFallbackUrl: "/images/placeholder-card.jpg",
      intendedUseValue: data.intended_use || "",
      tagsValue: formatLocationIdentityTags(data.tags),
      creationTypeValue: CREATION_TYPE_LABELS[form?.type] || form?.type || "",
      inheritanceItems: LOCATION_INHERITANCE_ITEMS.map((item) => ({
        ...item,
        checked: inheritance[item.key],
      })),
      onChangeLocationName: (value) => updateDataField?.("name", value),
      onChangeLocationCategory: (value) =>
        updateDataField?.("category", value),
      onChangeSpaceType: (value) => updateDataField?.("space_type", value),
      onChangeLocationScale: (value) =>
        updateDataField?.("locationScale", value),
      onOpenParentPicker: () => setIsParentPickerOpen(true),
      onClearParentLocation: clearParentLocation,
      onChangeIntendedUse: (value) =>
        updateDataField?.("intended_use", value),
      onChangeTags: (value) =>
        updateDataField?.("tags", parseLocationIdentityTags(value)),
      onChangeInheritance: updateInheritanceField,
    },
    isParentPickerOpen,
    parentPickerProps: {
      currentLocationId: creationId,
      selectedLocationId: parentLocation.id,
      onClose: () => setIsParentPickerOpen(false),
      onSelect: selectParentLocation,
    },
  };
}
