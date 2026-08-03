"use client";

import { useMemo } from "react";

import {
  MECHANICS_TRACKERS_CONTRACT_VERSION,
  MECHANICS_TRACKERS_PHASE,
  MECHANICS_TRACKERS_STATUS,
  MECHANICS_TRACKERS_STORAGE_PATH,
} from "./MechanicsTrackersSection.contract.js";
import {
  normalizeMechanicsTracker,
  normalizeMechanicsTrackers,
  normalizeTrackerString,
  slugifyTrackerId,
  createUniqueTrackerId,
  summarizeMechanicsTracker,
} from "./mechanicsTrackersNormalization.js";
import {
  addMechanicsTracker,
  addMechanicsTrackerMutationHint,
  addMechanicsTrackerPhase,
  clampMechanicsTrackerInitial,
  patchMechanicsTracker,
  patchMechanicsTrackerMutationHint,
  patchMechanicsTrackerPhase,
  removeMechanicsTracker,
  removeMechanicsTrackerMutationHint,
  removeMechanicsTrackerPhase,
} from "./mechanicsTrackersOperations.js";

export function useMechanicsTrackersViewModel({
  trackers = [],
  onChange = () => {},
  foldSignal = null,
} = {}) {
  const normalizedTrackers = useMemo(
    () => normalizeMechanicsTrackers(trackers),
    [trackers]
  );

  const entries = useMemo(
    () =>
      normalizedTrackers.map((tracker, index) => ({
        tracker,
        index,
        key: tracker.id || index,
        title: tracker.label || tracker.id || `Tracker ${index + 1}`,
        summary: summarizeMechanicsTracker(tracker, index),
        defaultExpanded: index === 0,
        hadExplicitId: Boolean(normalizeTrackerString(trackers[index]?.id)),
      })),
    [normalizedTrackers, trackers]
  );

  function commit(nextTrackers) {
    onChange(normalizeMechanicsTrackers(nextTrackers));
  }

  return {
    contractVersion: MECHANICS_TRACKERS_CONTRACT_VERSION,
    phase: MECHANICS_TRACKERS_PHASE,
    status: MECHANICS_TRACKERS_STATUS,
    storagePath: MECHANICS_TRACKERS_STORAGE_PATH,
    trackers: normalizedTrackers,
    entries,
    foldSignal,
    addTracker: () => commit(addMechanicsTracker(normalizedTrackers)),
    removeTracker: (trackerIndex) =>
      commit(removeMechanicsTracker(normalizedTrackers, trackerIndex)),
    patchTracker: (trackerIndex, patch) =>
      commit(patchMechanicsTracker(normalizedTrackers, trackerIndex, patch)),
    updateTrackerId: (trackerIndex, value) =>
      commit(
        patchMechanicsTracker(normalizedTrackers, trackerIndex, {
          id: slugifyTrackerId(
            value,
            createUniqueTrackerId("tracker", normalizedTrackers)
          ),
        })
      ),
    updateTrackerLabel: (trackerIndex, value, hadExplicitId) => {
      const patch = { label: value };
      if (!hadExplicitId) {
        patch.id = slugifyTrackerId(
          value,
          createUniqueTrackerId("tracker", normalizedTrackers)
        );
      }
      commit(patchMechanicsTracker(normalizedTrackers, trackerIndex, patch));
    },
    updateTrackerInitial: (trackerIndex, value) => {
      const tracker = normalizeMechanicsTracker(
        normalizedTrackers[trackerIndex],
        trackerIndex
      );
      commit(
        patchMechanicsTracker(normalizedTrackers, trackerIndex, {
          initial: clampMechanicsTrackerInitial(value, tracker),
        })
      );
    },
    addPhase: (trackerIndex) =>
      commit(addMechanicsTrackerPhase(normalizedTrackers, trackerIndex)),
    patchPhase: (trackerIndex, phaseIndex, patch) =>
      commit(
        patchMechanicsTrackerPhase(
          normalizedTrackers,
          trackerIndex,
          phaseIndex,
          patch
        )
      ),
    removePhase: (trackerIndex, phaseIndex) =>
      commit(
        removeMechanicsTrackerPhase(
          normalizedTrackers,
          trackerIndex,
          phaseIndex
        )
      ),
    addMutationHint: (trackerIndex) =>
      commit(
        addMechanicsTrackerMutationHint(normalizedTrackers, trackerIndex)
      ),
    patchMutationHint: (trackerIndex, hintIndex, patch) =>
      commit(
        patchMechanicsTrackerMutationHint(
          normalizedTrackers,
          trackerIndex,
          hintIndex,
          patch
        )
      ),
    removeMutationHint: (trackerIndex, hintIndex) =>
      commit(
        removeMechanicsTrackerMutationHint(
          normalizedTrackers,
          trackerIndex,
          hintIndex
        )
      ),
  };
}
