import {
  asMechanicsArray,
  asMechanicsObject,
  normalizeMechanicsDefaults,
  normalizeMechanicsDocument,
} from "./mechanicsDocumentNormalization.js";

export function replaceMechanicsRootFields(document, updates = {}) {
  return normalizeMechanicsDocument({
    ...asMechanicsObject(document),
    ...asMechanicsObject(updates),
  });
}

export function replaceMechanicsInstanceData(document, updates = {}) {
  const current = normalizeMechanicsDocument(document);

  return normalizeMechanicsDocument({
    ...current,
    instanceData: {
      ...current.instanceData,
      ...asMechanicsObject(updates),
    },
  });
}

export function replaceMechanicsTrackers(document, trackers) {
  return replaceMechanicsInstanceData(document, {
    trackers: asMechanicsArray(trackers),
  });
}

export function replaceMechanicsCommands(document, commands) {
  return replaceMechanicsInstanceData(document, {
    commands: asMechanicsArray(commands),
  });
}

export function replaceMechanicsDefaults(document, defaults) {
  return replaceMechanicsInstanceData(document, {
    defaults: normalizeMechanicsDefaults(defaults),
  });
}

export function replaceMechanicsStatusBlocks(document, statusBlocks) {
  return replaceMechanicsInstanceData(document, {
    statusBlocks: asMechanicsArray(statusBlocks),
  });
}

export function replaceMechanicsGuards(document, guards) {
  return replaceMechanicsInstanceData(document, {
    guards: asMechanicsArray(guards),
  });
}
