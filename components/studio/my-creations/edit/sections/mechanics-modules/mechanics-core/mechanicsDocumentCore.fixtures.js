import { listMechanicsM0Fixtures } from "../mechanics-compatibility-baseline/mechanicsCompatibilityBaseline.fixtures.js";
import { replaceMechanicsTrackers } from "./mechanicsDocumentCompatibility.js";
import { normalizeMechanicsDocument } from "./mechanicsDocumentNormalization.js";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const sourceFixtures = listMechanicsM0Fixtures().filter(
  (fixture) => fixture.moduleData
);

export const mechanicsDocumentCoreFixtures = Object.freeze(
  sourceFixtures.map((fixture) => {
    const input = clone(fixture.moduleData);
    const normalized = normalizeMechanicsDocument(input);
    const replacementProbe = replaceMechanicsTrackers(normalized, [
      ...normalized.instanceData.trackers,
      {
        id: "m1_preview_probe",
        label: "M1 Preview Probe",
        kind: "meter",
        min: 0,
        max: 1,
        initial: 0,
      },
    ]);

    return Object.freeze({
      id: fixture.id,
      label: fixture.label,
      classification: fixture.classification,
      input,
      normalized,
      replacementProbe,
    });
  })
);

export function listMechanicsDocumentCoreFixtures() {
  return clone(mechanicsDocumentCoreFixtures);
}
