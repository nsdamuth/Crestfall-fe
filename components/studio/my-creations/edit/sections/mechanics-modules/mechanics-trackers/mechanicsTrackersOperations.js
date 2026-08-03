import {
  clampTrackerNumber,
  createUniqueTrackerId,
  normalizeMechanicsTracker,
  normalizeMechanicsTrackerMutationHint,
  normalizeMechanicsTrackerPhase,
  normalizeMechanicsTrackers,
} from "./mechanicsTrackersNormalization.js";

function commit(trackers) {
  return normalizeMechanicsTrackers(trackers);
}

export function addMechanicsTracker(trackers) {
  const current = commit(trackers);
  const trackerId = createUniqueTrackerId("tracker", current);

  return commit([
    ...current,
    {
      id: trackerId,
      kind: "meter",
      label: `Tracker ${current.length + 1}`,
      min: 0,
      max: 100,
      initial: 50,
      phases: [],
      mutationHints: [],
    },
  ]);
}

export function patchMechanicsTracker(trackers, trackerIndex, patch) {
  return commit(
    commit(trackers).map((tracker, index) =>
      index === trackerIndex
        ? normalizeMechanicsTracker({ ...tracker, ...patch }, index)
        : tracker
    )
  );
}

export function removeMechanicsTracker(trackers, trackerIndex) {
  return commit(
    commit(trackers).filter((_tracker, index) => index !== trackerIndex)
  );
}

export function addMechanicsTrackerPhase(trackers, trackerIndex) {
  const current = commit(trackers);
  const tracker = normalizeMechanicsTracker(current[trackerIndex], trackerIndex);
  const phases = tracker.phases;

  return patchMechanicsTracker(current, trackerIndex, {
    phases: [
      ...phases,
      normalizeMechanicsTrackerPhase(
        {
          id: createUniqueTrackerId("phase", phases),
          label: `Phase ${phases.length + 1}`,
          min: tracker.min,
          max: tracker.max,
        },
        phases.length
      ),
    ],
  });
}

export function patchMechanicsTrackerPhase(
  trackers,
  trackerIndex,
  phaseIndex,
  patch
) {
  const current = commit(trackers);
  const tracker = normalizeMechanicsTracker(current[trackerIndex], trackerIndex);

  return patchMechanicsTracker(current, trackerIndex, {
    phases: tracker.phases.map((phase, index) =>
      index === phaseIndex
        ? normalizeMechanicsTrackerPhase({ ...phase, ...patch }, index)
        : phase
    ),
  });
}

export function removeMechanicsTrackerPhase(trackers, trackerIndex, phaseIndex) {
  const current = commit(trackers);
  const tracker = normalizeMechanicsTracker(current[trackerIndex], trackerIndex);

  return patchMechanicsTracker(current, trackerIndex, {
    phases: tracker.phases.filter((_phase, index) => index !== phaseIndex),
  });
}

export function addMechanicsTrackerMutationHint(trackers, trackerIndex) {
  const current = commit(trackers);
  const tracker = normalizeMechanicsTracker(current[trackerIndex], trackerIndex);
  const hints = tracker.mutationHints;

  return patchMechanicsTracker(current, trackerIndex, {
    mutationHints: [
      ...hints,
      normalizeMechanicsTrackerMutationHint(
        {
          id: createUniqueTrackerId("hint", hints),
          eventTypes: [],
          triggers: [],
          delta: 1,
          reason: "",
        },
        hints.length
      ),
    ],
  });
}

export function patchMechanicsTrackerMutationHint(
  trackers,
  trackerIndex,
  hintIndex,
  patch
) {
  const current = commit(trackers);
  const tracker = normalizeMechanicsTracker(current[trackerIndex], trackerIndex);

  return patchMechanicsTracker(current, trackerIndex, {
    mutationHints: tracker.mutationHints.map((hint, index) =>
      index === hintIndex
        ? normalizeMechanicsTrackerMutationHint({ ...hint, ...patch }, index)
        : hint
    ),
  });
}

export function removeMechanicsTrackerMutationHint(
  trackers,
  trackerIndex,
  hintIndex
) {
  const current = commit(trackers);
  const tracker = normalizeMechanicsTracker(current[trackerIndex], trackerIndex);

  return patchMechanicsTracker(current, trackerIndex, {
    mutationHints: tracker.mutationHints.filter(
      (_hint, index) => index !== hintIndex
    ),
  });
}

export function clampMechanicsTrackerInitial(value, tracker) {
  const safeTracker = normalizeMechanicsTracker(tracker);
  return clampTrackerNumber(
    value,
    safeTracker.min,
    safeTracker.min,
    safeTracker.max
  );
}
