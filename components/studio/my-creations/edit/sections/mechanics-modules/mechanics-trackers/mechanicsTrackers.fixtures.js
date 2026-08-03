import { normalizeMechanicsTrackers } from "./mechanicsTrackersNormalization.js";

const FIXTURES = Object.freeze([
  {
    id: "empty",
    label: "Empty",
    description: "No trackers are defined.",
    trackers: [],
  },
  {
    id: "relationship",
    label: "Relationship Meter",
    description: "A current tracker with phases and mutation hints.",
    trackers: [
      {
        id: "trust",
        kind: "meter",
        label: "Trust",
        min: 0,
        max: 100,
        initial: 40,
        phases: [
          { id: "guarded", label: "Guarded", min: 0, max: 29 },
          { id: "curious", label: "Curious", min: 30, max: 69 },
          { id: "open", label: "Open", min: 70, max: 100 },
        ],
        mutationHints: [
          {
            id: "accepted_redirect",
            eventTypes: ["ACCEPTED_REDIRECT"],
            triggers: ["accepts redirect"],
            delta: 2,
            reason: "The player accepted the redirect without pushing.",
          },
        ],
      },
    ],
  },
  {
    id: "legacy",
    label: "Legacy Aliases",
    description: "Legacy mutation_hints, event_types, and amount aliases.",
    trackers: [
      {
        id: "affection",
        label: "Affection",
        min: 0,
        max: 100,
        initial: 55,
        mutation_hints: [
          {
            id: "care",
            event_types: ["accepted_care"],
            triggers: ["accepts care"],
            amount: 3,
            reason: "Legacy alias fixture.",
            futureHintMetadata: { retained: true },
          },
        ],
        futureTrackerMetadata: { retained: true },
      },
    ],
  },
  {
    id: "recoverable",
    label: "Malformed but Recoverable",
    description: "Invalid collections and out-of-range initial values recover safely.",
    trackers: [
      {
        id: "health",
        label: "Health",
        min: 0,
        max: 10,
        initial: 50,
        phases: null,
        mutationHints: "invalid",
      },
    ],
  },
]);

export function listMechanicsTrackerFixtures() {
  return FIXTURES.map((fixture) => ({
    ...fixture,
    trackers: fixture.trackers.map((tracker) => structuredClone(tracker)),
    normalized: normalizeMechanicsTrackers(fixture.trackers),
  }));
}
