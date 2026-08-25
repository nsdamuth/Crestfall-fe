// mock, pending CR-050: the owned-creations list for picker surfaces
// (SW1, Vault parity; docs/plans/FABLE-GATE-2-STUDIO.md, CONTRACT AND
// CR LEDGER). This is the ONE named mock module the creation picker's
// Binding Shell reads from; no live query exists yet. One fixture
// item per product creation type (all 25,
// lib/server/creations/constants.js CREATION_TYPES), so every vault
// bucket (creationPickerBuckets.js) has real coverage and the "More"
// bucket is exercised at its full ten-type width.
//
// Art reuses the existing alpha-test mockup image set
// (public/tmp-mockup-images/) the same way app/studio/v2/vault/
// VaultV2Mockup.jsx does; filenames are real files, titles are not
// tied to the pictured character.
//
// Deleted whole, and this comment with it, when CR-050 lands the real
// owned-creations read for picker surfaces.
import { resolveCreationBucket } from "./creationPickerBuckets";

function canonArt(name) {
  return encodeURI(`/tmp-mockup-images/canon-character-images/${name}.png`);
}

function creatorArt(name) {
  return encodeURI(`/tmp-mockup-images/alpha-test-creator-images/${name}.png`);
}

// Highest recency first; recency is a rank, not a timestamp, higher
// number sorts as more recently touched.
const RAW_OWNED_CREATIONS = [
  { type: "CHARACTER", title: "Lilith of the Vermillion Coast", visibility: "PUBLIC", isCanon: true, imageSrc: canonArt("Lilith") },
  { type: "PLAYER_CHARACTER", title: "Vesper Ash", visibility: "PRIVATE", imageSrc: canonArt("Jax Riker") },
  { type: "CHARACTER_TEMPLATE", title: "Vermillion Coast Rogue Template", visibility: "UNLISTED", imageSrc: canonArt("Fox Vane") },
  { type: "LOCATION", title: "The Vermillion Coast Tavern", visibility: "PRIVATE", imageSrc: canonArt("athelgard-ampitheater-profile") },
  { type: "LOCATION_REGISTRY", title: "Coastal Landmark Registry", visibility: "PRIVATE", imageSrc: creatorArt("vermillion-4") },
  { type: "FACTION_REGISTRY", title: "Coastal Trade Factions", visibility: "UNLISTED", imageSrc: creatorArt("vermillion-5") },
  { type: "ORGANIZATION_REGISTRY", title: "Vermillion Merchant Guild", visibility: "PRIVATE", imageSrc: creatorArt("vermillion-6") },
  { type: "EVENT_REGISTRY", title: "The Ashfall Reckoning", visibility: "PUBLIC", imageSrc: creatorArt("vermillion-7") },
  { type: "OUTFIT", title: "Traveler's Garb of the Vermillion Coast", visibility: "PRIVATE", imageSrc: creatorArt("vermillion-2") },
  { type: "WARDROBE", title: "Lilith's Wardrobe", visibility: "PRIVATE", imageSrc: creatorArt("vermillion-3") },
  { type: "POSE", title: "Windswept Overlook Pose", visibility: "UNLISTED", imageSrc: creatorArt("vermillion-10") },
  { type: "IMAGE_PRESET", title: "Dusklight Preset", visibility: "PUBLIC", imageSrc: creatorArt("vermillion-11") },
  { type: "ROOM_TEMPLATE", title: "Coldwater Vigil", visibility: "PUBLIC", imageSrc: creatorArt("vermillion-12") },
  { type: "STORYLINE", title: "Neon Harbor Cycle", visibility: "PUBLIC", isCanon: true, imageSrc: creatorArt("vermillion-13") },
  { type: "SCENARIO", title: "The Black Crown Gambit", visibility: "PRIVATE", imageSrc: creatorArt("vermillion-14") },
  { type: "NARRATOR", title: "The Vermillion Narrator", visibility: "PRIVATE", imageSrc: creatorArt("vermillion-15") },
  { type: "NPC_REGISTRY", title: "Coastal NPC Roster", visibility: "PRIVATE", imageSrc: creatorArt("vermillion-16") },
  { type: "QUEST_REGISTRY", title: "The Ferry Contract Quest Line", visibility: "UNLISTED", imageSrc: creatorArt("vermillion-17") },
  { type: "ITEM_REGISTRY", title: "Salvage and Trade Item Registry", visibility: "PRIVATE", imageSrc: creatorArt("vermillion-18") },
  { type: "MECHANICS_MODULE", title: "Tideglass Combat Module", visibility: "PUBLIC", imageSrc: creatorArt("vermillion-19") },
  { type: "RULES_CODEX", title: "Coastal Trade Rules Codex", visibility: "PRIVATE", imageSrc: creatorArt("vermillion-20") },
  { type: "LORE", title: "The Black Crown Sky Lore", visibility: "PUBLIC", isCanon: true, imageSrc: creatorArt("vermillion-21") },
  { type: "ACTOR_MECHANICS_PROFILE", title: "Vermillion Actor Mechanics Profile", visibility: "PRIVATE", imageSrc: creatorArt("vermillion-22") },
  { type: "STATS_POOLS_PROFILE", title: "Coastal Stats and Pools", visibility: "UNLISTED", imageSrc: creatorArt("vermillion-24") },
  { type: "PROGRESSION_PROFILE", title: "Vermillion Progression Track", visibility: "PRIVATE", imageSrc: creatorArt("vermillion-25") },
];

export const OWNED_CREATIONS_PICKER_MOCK = Object.freeze(
  RAW_OWNED_CREATIONS.map((entry, index) => ({
    id: `owned-${entry.type.toLowerCase()}`,
    type: entry.type,
    bucket: resolveCreationBucket(entry.type),
    title: entry.title,
    visibility: entry.visibility,
    isCanon: Boolean(entry.isCanon),
    imageSrc: entry.imageSrc,
    recency: RAW_OWNED_CREATIONS.length - index,
  }))
);

export function resolveOwnedCreationsPickerMock() {
  return OWNED_CREATIONS_PICKER_MOCK;
}
