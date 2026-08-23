// Five-bucket type filter, RULED 23 Aug 2026 (build-0823 pass 3):
// promoted from two identical copies (Vault, Community) into one
// shared module. Applies to mixed-asset-kind lists (Vault, Community);
// Stories keeps its own playable-kinds filter, other list pages keep
// their own domain filters.
//
// "worlds" has no fixture data yet (no location/lore/faction card
// kind exists in the v2 model); its option ships with an honest zero
// count rather than fabricated fixture items. CR-032 filed for the
// card-kind field extension needed to populate it for real.
//
// Community's prior copy carried a flag for Brian: the ruling this
// bucket set originates from names only Vault, and extending it to
// Community was an inference pending veto. This pass's ruling
// (23 Aug 2026 spec) ratifies the five-bucket filter as standard
// wherever a list mixes asset kinds, resolving that open flag.
export const ASSET_KIND_TO_TYPE_BUCKET = Object.freeze({
  character: "characters",
  story: "stories",
  adventure: "adventures",
  image: "looks",
});

export const TYPE_BUCKET_OPTIONS = Object.freeze([
  { value: "characters", label: "Characters" },
  { value: "worlds", label: "Worlds" },
  { value: "looks", label: "Looks" },
  { value: "stories", label: "Stories" },
  { value: "adventures", label: "Adventures" },
]);
