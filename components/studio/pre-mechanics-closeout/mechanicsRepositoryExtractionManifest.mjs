export const MECHANICS_REPOSITORY_EXTRACTION_VERSION =
  "crestfall.loom.mechanics-repository-extraction.v1";

export const MECHANICS_REPOSITORY_EXTRACTION_STATUS =
  "READY_FOR_EXTERNAL_REPOSITORY_EXTRACTION_AFTER_COMMIT";

export const MECHANICS_RUNTIME_ENTRYPOINTS = Object.freeze([
  "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx",
  "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-core/mechanicsDocumentNormalization.js",
]);

export const MECHANICS_PUBLIC_CONSUMER_CONTRACT = Object.freeze({
  assemblyExport: "MechanicsModuleAssembly",
  normalizationExport: "normalizeMechanicsDocument",
  hostBindingFile:
    "components/studio/my-creations/edit/sections/mechanics-modules/MechanicsModuleFieldsSection.jsx",
  props: Object.freeze([
    "mechanicsData",
    "updateDataField",
    "canReplaceData",
    "onReplaceMechanicsData",
  ]),
  hostResponsibilities: Object.freeze([
    "Bind the current Creation data document.",
    "Normalize and atomically replace the complete Mechanics data document.",
    "Own create/edit page persistence and save lifecycle.",
    "Provide any Crestfall-specific UI adapters required by the external package.",
  ]),
  packageResponsibilities: Object.freeze([
    "Render and author the complete Mechanics Module definition UI.",
    "Own domain normalization, compatibility aliases, local folds, and modal interaction state.",
    "Emit complete-document replacement requests without persisting them.",
    "Remain independent of auth, routes, product-data clients, services, and databases.",
  ]),
});

export const MECHANICS_PORTABLE_PACKAGE_DIRECTORIES = Object.freeze([
  "mechanics-command-core",
  "mechanics-command-domain-actions",
  "mechanics-command-effects",
  "mechanics-command-outcomes",
  "mechanics-command-requirements",
  "mechanics-command-resolution",
  "mechanics-compatibility-baseline",
  "mechanics-composition-builder",
  "mechanics-core",
  "mechanics-defaults",
  "mechanics-document-orchestration",
  "mechanics-guards",
  "mechanics-json-editor",
  "mechanics-module-assembly",
  "mechanics-preset-application",
  "mechanics-preset-validation",
  "mechanics-presets",
  "mechanics-progression-profile",
  "mechanics-saved-asset-migration",
  "mechanics-status-blocks",
  "mechanics-trackers",
]);

export const MECHANICS_PORTABLE_SUPPORT_FILES = Object.freeze([
  "mechanicsCommandCompositionBuilder.js",
  "mechanicsCommandResolutionBuilder.js",
  "mechanicsCommandStateReadoutBuilder.js",
  "mechanicsEffectValueBindingBuilder.js",
  "mechanicsProgressionProfileBuilder.js",
  "mechanicsProgressionRequirementAuthoring.js",
  "mechanicsProgressionRequirementAuthoringDiagnostics.mjs",
]);

export const MECHANICS_EXTERNAL_RUNTIME_DEPENDENCIES = Object.freeze([
  "react",
  "lucide-react",
]);

export const MECHANICS_HOST_UI_SEAMS = Object.freeze([
  Object.freeze({
    importSpecifier: "@/components/ui/ModalShell",
    importer:
      "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-json-editor/MechanicsJsonEditorModal.view.jsx",
    extractionDecision:
      "Resolve during repository extraction by moving a generic ModalShell primitive into the package or injecting an equivalent host adapter. Do not change the current Crestfall runtime in the closeout patch.",
  }),
]);

export const MECHANICS_EXCLUDED_HOST_SURFACES = Object.freeze([
  Object.freeze({
    path: "components/studio/my-creations/edit/sections/mechanics-modules/RuntimeMechanicsModulesSection.jsx",
    reason:
      "Runtime owner-to-module attachment is a Crestfall application workflow, not Mechanics definition authoring.",
  }),
  Object.freeze({
    path: "components/studio/my-creations/edit/sections/mechanics-modules/MechanicsModulePickerModal.jsx",
    reason:
      "The picker belongs to Crestfall runtime attachment and product-data lookup.",
  }),
  Object.freeze({
    path: "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-picker",
    reason:
      "The picker package imports Crestfall creation clients and remains host-owned.",
  }),
  Object.freeze({
    path: "components/studio/my-creations/edit/sections/locations/TrackersModuleConfigModal.jsx",
    reason:
      "The unreferenced legacy/future modal remains quarantined pending explicit product classification.",
  }),
]);

export const MECHANICS_HOST_CONSUMER_FILES = Object.freeze([
  "components/studio/my-creations/edit/sections/mechanics-modules/MechanicsModuleFieldsSection.jsx",
  "components/studio/create/mechanics-module/MechanicsModuleBuilderShell.jsx",
  "components/studio/create/mechanics-module/mechanics-module-builder/useMechanicsModuleBuilderViewModel.js",
  "components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx",
]);

export const MECHANICS_EXTRACTION_VERIFICATION_SURFACES = Object.freeze([
  "/dev/ui-preview/mechanics-module-assembly",
  "/studio/create/mechanics-module",
  "/studio/my-creations/<mechanics-module-id>/edit",
]);

export const MECHANICS_EXTRACTION_SEQUENCE = Object.freeze([
  "Commit the validated Crestfall M0-M9 decomposition and this closeout patch.",
  "Create the external repository without changing the public consumer contract.",
  "Move the portable package directories, support files, fixtures, diagnostics, and documentation.",
  "Resolve the single ModalShell host UI seam without introducing route, auth, API, or persistence ownership.",
  "Expose the assembly and document-normalization entrypoints from the external package.",
  "Replace only the two imports in the thin Crestfall MechanicsModuleFieldsSection binding shell.",
  "Run package diagnostics in the external repository and all Crestfall cumulative diagnostics as the consumer.",
  "Browser-test the preview, create route, edit route, complete JSON replacement, preset application, save, and reload.",
]);

export const MECHANICS_FROZEN_RUNTIME_GRAPH_FILE_COUNT = 107;
