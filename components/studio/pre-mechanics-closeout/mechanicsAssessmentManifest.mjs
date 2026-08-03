export const MECHANICS_ASSESSMENT_VERSION =
  "crestfall.loom.mechanics-assessment.v15";

export const MECHANICS_ASSESSMENT_STATUS =
  "MECHANICS_DECOMPOSITION_CLOSED_READY_FOR_REPOSITORY_EXTRACTION";

export const PRIMARY_MECHANICS_FILES = Object.freeze([
  Object.freeze({
    path: "components/studio/my-creations/edit/sections/mechanics-modules/MechanicsModuleFieldsSection.jsx",
    classification: "THIN_CREATE_EDIT_PERSISTENCE_BINDING_SHELL",
    expectedMinimumLines: 25,
    expectedMaximumLines: 55,
    decision:
      "M9 reduces the original parent to the create/edit persistence boundary only. It retains normalized atomic complete-document replacement and mounts the portable Mechanics Module assembly package.",
  }),
  Object.freeze({
    path: "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx",
    classification: "MECHANICS_DOMAIN_ASSEMBLY_BINDING_SHELL",
    expectedMinimumLines: 250,
    expectedMaximumLines: 420,
    decision:
      "Compose the extracted Mechanics domain Binding Shells and inject them into the portable assembly View. Do not own route, API, auth, database, or page-save persistence behavior.",
  }),
  Object.freeze({
    path: "components/studio/my-creations/edit/sections/locations/TrackersModuleConfigModal.jsx",
    classification: "QUARANTINED_UNREFERENCED_LEGACY_OR_FUTURE",
    expectedMinimumLines: 1800,
    decision:
      "Quarantine until its intended caller and saved-data contract are confirmed. Do not delete or convert by assumption.",
  }),
  Object.freeze({
    path: "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-progression-profile/MechanicsProgressionProfileFields.jsx",
    classification: "SHARED_PROGRESSION_DOMAIN_BINDING_SHELL",
    expectedMinimumLines: 8,
    expectedMaximumLines: 20,
    decision:
      "M3 extracted the shared effect-level progression editor into a LOOM package while preserving both active callers and the complete Mechanics document boundary.",
  }),
  Object.freeze({
    path: "components/studio/my-creations/edit/sections/mechanics-modules/RuntimeMechanicsModulesSection.jsx",
    classification: "RUNTIME_ATTACHMENT_SURFACE",
    expectedMinimumLines: 350,
    decision:
      "Keep separate from Mechanics Module definition abstraction; it attaches reusable modules to owners.",
  }),
]);

export const ACTIVE_MECHANICS_CALLERS = Object.freeze({
  mechanicsModuleFields: Object.freeze([
    "components/studio/create/mechanics-module/MechanicsModuleBuilderShell.jsx",
    "components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx",
  ]),
  moduleAssembly: Object.freeze([
    "components/studio/my-creations/edit/sections/mechanics-modules/MechanicsModuleFieldsSection.jsx",
  ]),
  trackersSection: Object.freeze([
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx",
  ]),
  commandCore: Object.freeze([
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx",
  ]),
  commandOutcomes: Object.freeze([
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx",
  ]),
  commandRequirements: Object.freeze([
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx",
  ]),
  commandEffects: Object.freeze([
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx",
  ]),
  commandDomainActions: Object.freeze([
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx",
  ]),
  commandResolution: Object.freeze([
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx",
  ]),
  defaultsSection: Object.freeze([
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx",
  ]),
  statusBlocksSection: Object.freeze([
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx",
  ]),
  guardsSection: Object.freeze([
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx",
  ]),
  documentOrchestration: Object.freeze([
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-module-assembly/MechanicsModuleAssembly.jsx",
  ]),
  progressionProfile: Object.freeze([
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-command-effects/MechanicsCommandEffects.jsx",
    "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-composition-builder/MechanicsCompositionBuilder.jsx",
  ]),
  runtimeAttachments: Object.freeze([
    "components/studio/my-creations/creation-edit-shell/CreationEditSectionContent.jsx",
    "components/studio/my-creations/edit/sections/locations/LocationRuntimeModulesSection.jsx",
  ]),
  trackersModal: Object.freeze([]),
});

export const MECHANICS_DOMAIN_MAP = Object.freeze([
  "saved-data compatibility and alias normalization",
  "module identity, contract version, priority, triggers, and tags",
  "tracker definitions",
  "tracker phases and mutation hints",
  "progression profiles and observability",
  "command identity, prefix, arguments, and invocation",
  "command requirements and progression enforcement",
  "command outcome branches and presentation",
  "command effects and effect values",
  "effect target binding",
  "domain actions including location travel",
  "resolution modifiers and modifier sources",
  "mechanics defaults for flags, counters, and stages",
  "status blocks",
  "guards and guard conditions",
  "preset catalog, library, validation, and safe application",
  "whole-document JSON authoring and atomic replacement",
  "legacy fixtures, freeze manifests, and saved-asset migration",
  "runtime module attachments as a separate owner-binding domain",
]);

export const PROPOSED_MECHANICS_PATCH_ORDER = Object.freeze([
  Object.freeze({
    order: 1,
    name: "Compatibility Freeze and Cross-Service Baseline",
    scope:
      "Run the deferred service-dependent audits, freeze representative saved assets, and confirm create/edit round trips before extraction.",
  }),
  Object.freeze({
    order: 2,
    name: "Shared Normalization and Compatibility",
    scope:
      "Extract pure normalization, alias, ID, and default-value utilities with fixture parity tests.",
  }),
  Object.freeze({
    order: 3,
    name: "Trackers and Progression",
    scope:
      "Separate tracker definitions, phases, mutation hints, and the shared progression-profile editor.",
  }),
  Object.freeze({
    order: 4,
    name: "Command Core",
    scope:
      "Separate command identity, invocation, arguments, presentation, and outcome-branch shape.",
  }),
  Object.freeze({
    order: 5,
    name: "Requirements, Effects, Targets, and Domain Actions",
    scope:
      "Separate requirement enforcement, effects, target binding, and location-travel/domain-action editors.",
  }),
  Object.freeze({
    order: 6,
    name: "Resolution and Outcomes",
    scope:
      "Separate resolution modifiers, modifier sources, and outcome resolution controls.",
  }),
  Object.freeze({
    order: 7,
    name: "Defaults, Status Blocks, and Guards",
    scope:
      "Separate the remaining runtime-context editors while preserving current stored keys.",
  }),
  Object.freeze({
    order: 8,
    name: "Preset and JSON Orchestration",
    scope:
      "Keep catalog/application/validation and JSON replacement at the parent orchestration boundary with atomic replaceData.",
  }),
  Object.freeze({
    order: 9,
    name: "Parent Assembly and Portability Proof",
    scope:
      "Reduce MechanicsModuleFieldsSection to a thin assembly shell only after all extracted domains pass create/edit compatibility tests.",
  }),
]);

export const DEFERRED_MECHANICS_DIAGNOSTICS = Object.freeze([
  "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc7ReferenceRuntimeImplementationDiagnostics.mjs",
  "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc7xCharacterAdvancementDiagnostics.mjs",
  "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-composition-builder/mechanicsCompositionBuilderDiagnostics.mjs",
]);
