export const MECHANICS_DEFAULTS_LOOM_CONTRACT = Object.freeze({
  id: "crestfall.loom.mechanics-defaults.v1",
  storagePath: "instanceData.defaults",
  buckets: Object.freeze(["flags", "counters", "stages"]),
  entryFields: Object.freeze(["id", "label", "initial"]),
});

export const MECHANICS_DEFAULT_BUCKETS = Object.freeze([
  Object.freeze({
    key: "flags",
    title: "Default Flags",
    singularLabel: "Flag",
    addLabel: "Add Flag",
    placeholderId: "player_settled",
    placeholderLabel: "Player Settled",
    defaultInitial: false,
  }),
  Object.freeze({
    key: "counters",
    title: "Default Counters",
    singularLabel: "Counter",
    addLabel: "Add Counter",
    placeholderId: "boundary_warning_count",
    placeholderLabel: "Boundary Warnings",
    defaultInitial: 0,
  }),
  Object.freeze({
    key: "stages",
    title: "Default Stages",
    singularLabel: "Stage",
    addLabel: "Add Stage",
    placeholderId: "current_perspective",
    placeholderLabel: "Current Perspective",
    defaultInitial: "auto",
  }),
]);
