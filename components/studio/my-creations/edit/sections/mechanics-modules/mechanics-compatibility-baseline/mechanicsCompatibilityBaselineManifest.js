import {
  MECHANICS_ATOMIC_REPLACEMENT_BOUNDARIES,
  MECHANICS_COMPATIBILITY_BASELINE_CONTRACT_VERSION,
  MECHANICS_COMPATIBILITY_BASELINE_PHASE,
  MECHANICS_COMPATIBILITY_BASELINE_STATUS,
  MECHANICS_CREATE_PAYLOAD_ALLOWLIST,
  MECHANICS_CURRENT_IDENTITIES,
} from "./MechanicsCompatibilityBaseline.contract.js";

export const MECHANICS_M0_MANIFEST_VERSION =
  "crestfall.mechanics.m0.baseline-manifest.v1";

export const MECHANICS_M0_FRONTEND_DIAGNOSTICS = Object.freeze([
  "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc7BuilderLiveValidationDiagnostics.mjs",
  "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc7PresetApplicationDiagnostics.mjs",
  "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-preset-application/mc7PresetLibraryLayoutDiagnostics.mjs",
]);

export const MECHANICS_M0_EXTERNAL_REPOSITORIES = Object.freeze([
  Object.freeze({
    id: "SERVICES_API",
    environmentVariable: "CRESTFALL_SERVICES_API_ROOT",
    repositoryHint: "Crestfall services-api repository root",
    requiredPaths: Object.freeze(["package.json", "src/services/chat/mechanics/mc8ServiceContractBaselineDiagnostics.mjs", "src/services/chat/mechanics/mc4CrossDomainRegression.mjs"]),
    requiredCommand: "npm run diagnostics:mc8a",
    statusWhenUnavailable: "EXTERNAL_REPOSITORY_REQUIRED",
  }),
  Object.freeze({
    id: "ENGINE_MIDDLEWARE",
    environmentVariable: "CRESTFALL_ENGINE_MIDDLEWARE_ROOT",
    repositoryHint: "Crestfall engine-middleware repository root",
    requiredPaths: Object.freeze(["package.json", "src"]),
    requiredCommand: "Run the current Mechanics composition/runtime diagnostic command documented by that repository.",
    statusWhenUnavailable: "EXTERNAL_REPOSITORY_REQUIRED",
  }),
]);

export const MECHANICS_M0_DEFERRED_CROSS_TIER_DIAGNOSTICS = Object.freeze([
  Object.freeze({ id: "REFERENCE_RUNTIME_IMPLEMENTATIONS", frontendDiagnostic: "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc7ReferenceRuntimeImplementationDiagnostics.mjs", requires: ["SERVICES_API", "ENGINE_MIDDLEWARE"] }),
  Object.freeze({ id: "CHARACTER_ADVANCEMENT_RUNTIME", frontendDiagnostic: "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-presets/mc7xCharacterAdvancementDiagnostics.mjs", requires: ["SERVICES_API", "ENGINE_MIDDLEWARE"] }),
  Object.freeze({ id: "MECHANICS_COMPOSITION_RUNTIME", frontendDiagnostic: "components/studio/my-creations/edit/sections/mechanics-modules/mechanics-composition-builder/mechanicsCompositionBuilderDiagnostics.mjs", requires: ["SERVICES_API", "ENGINE_MIDDLEWARE"] }),
]);

export function getMechanicsM0BaselineManifest() {
  return JSON.parse(JSON.stringify({
    version: MECHANICS_M0_MANIFEST_VERSION,
    contractVersion: MECHANICS_COMPATIBILITY_BASELINE_CONTRACT_VERSION,
    phase: MECHANICS_COMPATIBILITY_BASELINE_PHASE,
    status: MECHANICS_COMPATIBILITY_BASELINE_STATUS,
    identities: MECHANICS_CURRENT_IDENTITIES,
    createPayloadAllowlist: MECHANICS_CREATE_PAYLOAD_ALLOWLIST,
    atomicReplacementBoundaries: MECHANICS_ATOMIC_REPLACEMENT_BOUNDARIES,
    frontendDiagnostics: MECHANICS_M0_FRONTEND_DIAGNOSTICS,
    externalRepositories: MECHANICS_M0_EXTERNAL_REPOSITORIES,
    deferredCrossTierDiagnostics: MECHANICS_M0_DEFERRED_CROSS_TIER_DIAGNOSTICS,
  }));
}
