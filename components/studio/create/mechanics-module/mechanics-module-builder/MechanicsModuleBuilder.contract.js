import {
  MECHANICS_DOCUMENT_IDENTITIES,
} from "../../../my-creations/edit/sections/mechanics-modules/mechanics-core/MechanicsDocumentCore.contract.js";

export const MECHANICS_MODULE_BUILDER_VIEW_CONTRACT_VERSION = "1.0.0";

export const MECHANICS_MODULE_DEFAULT_MODULE_ID =
  MECHANICS_DOCUMENT_IDENTITIES.moduleId;
export const MECHANICS_MODULE_DEFAULT_CONTRACT_VERSION =
  MECHANICS_DOCUMENT_IDENTITIES.contractVersion;

export const MECHANICS_MODULE_VISIBILITY_OPTIONS = Object.freeze([
  { value: "PRIVATE", label: "Private" },
  { value: "UNLISTED", label: "Unlisted" },
]);

export const MECHANICS_MODULE_CONTENT_RATING_OPTIONS = Object.freeze([
  { value: "SFW", label: "SFW" },
  { value: "MATURE", label: "Mature" },
  { value: "EXPLICIT", label: "Explicit" },
]);

/**
 * Portable View contract.
 *
 * The View receives normalized identity values, runtime-contract display
 * values, semantic callbacks, and a presentation slot supplied by the Binding
 * Shell. It must not build persistence payloads, know JSONB field mappings,
 * call APIs, or navigate.
 */
export const MECHANICS_MODULE_BUILDER_VIEW_CONTRACT = Object.freeze({
  identity: {
    title: "string",
    description: "string",
    visibility: "string",
    contentRating: "string",
  },
  options: {
    visibilityOptions: "array",
    contentRatingOptions: "array",
  },
  runtimeContract: {
    moduleId: "string",
    contractVersion: "string",
    runtimeStorageNote: "string",
    runtimeFieldsContent: "ReactNode | null",
  },
  saveStatus: "idle | saving | saved | error",
  saveMessage: "string",
  saveDisabled: "boolean",
  onUpdateField: "function(field, value)",
  onSave: "function()",
});
