export const MECHANICS_MODULE_ASSEMBLY_VIEW_CONTRACT_VERSION =
  "mechanics_module_assembly_view_contract_v1";

export const MECHANICS_MODULE_ASSEMBLY_SECTION_IDS = Object.freeze({
  overview: "mechanics-runtime-overview",
  trackers: "mechanics-runtime-trackers",
  commands: "mechanics-runtime-commands",
  defaults: "mechanics-runtime-defaults",
  statusBlocks: "mechanics-runtime-status-blocks",
  storyStatusSurfaces: "mechanics-runtime-story-status-surfaces",
  guards: "mechanics-runtime-guards",
});

export const DEFAULT_MECHANICS_MODULE_ASSEMBLY_SECTION_STATE = Object.freeze({
  overview: true,
  trackers: true,
  commands: false,
  defaults: false,
  statusBlocks: false,
  storyStatusSurfaces: false,
  guards: false,
});

/**
 * Portable Mechanics Module assembly contract.
 *
 * The View owns presentation, folds, and slot placement only. It receives
 * already-bound content for each extracted Mechanics domain and knows nothing
 * about creation persistence, JSONB, saved asset IDs, API routes, Supabase,
 * PostGraphile, or how complete document replacement is implemented.
 */
