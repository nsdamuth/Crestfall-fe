import assert from "node:assert/strict";
import test from "node:test";

import { voiceModuleOptions } from "./voiceModules.js";

const EXPECTED_VOICE_MODULE_IDS = Object.freeze([
  "playful_vocal_emphasis",
  "catlike_vocal_texture",
  "urgent_vocal_emphasis",
  "dry_wit",
  "command_voice",
  "formal_restraint",
  "market_trader",
  "courtly_noble",
  "noir_detective",
  "academic_scholar",
  "old_west_frontier",
  "cornish_west_country_period",
  "cockney_streetwise",
  "full_cajun",
  "warm_appalachian",
  "gentle_grounding",
  "archaic_saga_register",
  "clinical_systems_register",
  "plainspoken_practical_register",
  "warm_synthetic_register",
  "mesmeric_cadence",
  "tactical_brevity",
  "psychological_pressure",
  "adaptive_social_mirroring",
  "dramatic_flourish",
  "bombastic_confidence",
  "playful_provocation",
  "aphoristic_authority",
  "corrective_courtesy",
  "subtle_vocal_emphasis",
  "whispered_vocal_emphasis",
  "oracular_symbolism",
  "underworld_gravitas",
  "investigative_reasoning",
  "operational_analysis",
  "covert_tradecraft",
  "procedural_specialist",
  "conversational_rapport",
  "observational_understatement",
  "guided_discovery",
  "transactional_negotiation",
]);

const EXPECTED_CATEGORY_COUNTS = Object.freeze({
  "Vocal Texture": 6,
  "Format Emphasis": 3,
  "Authority Register": 4,
  "Formality Register": 3,
  "Social Register": 6,
  "Genre Register": 3,
  "Knowledge Register": 7,
  "Dialect / Register": 9,
});

test("FE voice module picker mirrors all runtime registry module IDs", () => {
  const ids = voiceModuleOptions.map((entry) => entry.value);
  assert.equal(ids.length, 41);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual([...ids].sort(), [...EXPECTED_VOICE_MODULE_IDS].sort());
});

test("voice modules retain the expected picker category distribution", () => {
  const counts = Object.fromEntries(
    Object.keys(EXPECTED_CATEGORY_COUNTS).map((category) => [
      category,
      voiceModuleOptions.filter((entry) => entry.category === category).length,
    ])
  );

  assert.deepEqual(counts, EXPECTED_CATEGORY_COUNTS);
});

test("restored expansion modules are visible to the picker", () => {
  const byId = new Map(voiceModuleOptions.map((entry) => [entry.value, entry]));

  for (const id of [
    "mesmeric_cadence",
    "dramatic_flourish",
    "tactical_brevity",
    "psychological_pressure",
    "investigative_reasoning",
    "transactional_negotiation",
  ]) {
    assert.ok(byId.has(id), `${id} should be present`);
    assert.ok(byId.get(id).label);
    assert.ok(byId.get(id).description);
  }
});
