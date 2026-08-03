export const MECHANICS_STATUS_BLOCKS_LOOM_CONTRACT = Object.freeze({
  id: "crestfall.loom.mechanics-status-blocks.v1",
  storagePath: "instanceData.statusBlocks",
  placements: Object.freeze(["response_end", "response_start"]),
  visibilities: Object.freeze(["public", "private", "hidden"]),
  blockFields: Object.freeze([
    "id",
    "slot",
    "label",
    "placement",
    "required",
    "visibility",
    "lines",
  ]),
});

export const MECHANICS_STATUS_BLOCK_PLACEMENTS =
  MECHANICS_STATUS_BLOCKS_LOOM_CONTRACT.placements;
export const MECHANICS_STATUS_BLOCK_VISIBILITIES =
  MECHANICS_STATUS_BLOCKS_LOOM_CONTRACT.visibilities;
