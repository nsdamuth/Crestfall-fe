export const UNREGISTERED_DIAGNOSTIC_EXCLUSIONS = Object.freeze([
  Object.freeze({
    path: "components/studio/create/lore/lorePatchDiagnostics.mjs",
    category: "cross-service",
    reason:
      "Reads services/api Lore validation and publication sources and must run from the complete multi-service repository.",
  }),
  Object.freeze({
    path: "components/studio/create/rules-codex/rules-codex-json-editor/rulesCodexJsonEditorDiagnostics.mjs",
    category: "installed-runtime",
    reason:
      "Imports React-backed editor modules and remains covered by the complete installed repository diagnostic chain.",
  }),
  Object.freeze({
    path: "components/studio/create/actor-mechanics-profile/actor-mechanics-profile-json-editor/actorMechanicsProfileJsonEditorDiagnostics.mjs",
    category: "installed-runtime",
    reason:
      "Imports React-backed editor modules and remains covered by the complete installed repository diagnostic chain.",
  }),
  Object.freeze({
    path: "components/studio/create/stats-pools/stats-pools-json-editor/statsPoolsJsonEditorDiagnostics.mjs",
    category: "installed-runtime",
    reason:
      "Imports React-backed editor modules and remains covered by the complete installed repository diagnostic chain.",
  }),
  Object.freeze({
    path: "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc7ReferenceRuntimeImplementationDiagnostics.mjs",
    category: "mechanics-cross-service",
    reason:
      "Reads services/api and services/engine-middleware runtime sources and is deferred to the Mechanics assessment.",
  }),
  Object.freeze({
    path: "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc7xCharacterAdvancementDiagnostics.mjs",
    category: "mechanics-cross-service",
    reason:
      "Reads Character advancement service sources and is deferred to the Mechanics assessment.",
  }),
  Object.freeze({
    path: "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-composition-builder/mechanicsCompositionBuilderDiagnostics.mjs",
    category: "mechanics-cross-service",
    reason:
      "Reads Mechanics composition runtime sources and is deferred to the Mechanics assessment.",
  }),
]);
