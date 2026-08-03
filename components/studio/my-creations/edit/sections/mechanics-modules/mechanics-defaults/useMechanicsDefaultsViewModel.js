"use client";

import { useMemo } from "react";

import { MECHANICS_DEFAULT_BUCKETS } from "./MechanicsDefaults.contract.js";
import {
  countMechanicsDefaultEntries,
  normalizeMechanicsDefaults,
} from "./mechanicsDefaultsNormalization.js";
import {
  addMechanicsDefaultEntry,
  patchMechanicsDefaultEntry,
  removeMechanicsDefaultEntry,
} from "./mechanicsDefaultsOperations.js";

export default function useMechanicsDefaultsViewModel({ defaults, onChange }) {
  const normalizedDefaults = useMemo(
    () => normalizeMechanicsDefaults(defaults),
    [defaults]
  );

  function commit(nextDefaults) {
    onChange?.(normalizeMechanicsDefaults(nextDefaults));
  }

  return {
    defaults: normalizedDefaults,
    buckets: MECHANICS_DEFAULT_BUCKETS.map((config) => ({
      config,
      entries: normalizedDefaults[config.key] || [],
    })),
    entryCount: countMechanicsDefaultEntries(normalizedDefaults),
    addEntry(bucketKey) {
      commit(addMechanicsDefaultEntry(normalizedDefaults, bucketKey));
    },
    patchEntry(bucketKey, entryIndex, patch) {
      commit(
        patchMechanicsDefaultEntry(
          normalizedDefaults,
          bucketKey,
          entryIndex,
          patch
        )
      );
    },
    removeEntry(bucketKey, entryIndex) {
      commit(
        removeMechanicsDefaultEntry(
          normalizedDefaults,
          bucketKey,
          entryIndex
        )
      );
    },
  };
}
