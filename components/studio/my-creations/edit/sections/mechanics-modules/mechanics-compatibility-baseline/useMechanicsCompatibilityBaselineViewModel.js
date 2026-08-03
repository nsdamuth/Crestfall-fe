"use client";

import { useMemo, useState } from "react";
import {
  MECHANICS_COMPATIBILITY_BASELINE_CONTRACT_VERSION,
  MECHANICS_COMPATIBILITY_BASELINE_STATUS,
  MECHANICS_CURRENT_IDENTITIES,
} from "./MechanicsCompatibilityBaseline.contract.js";
import { listMechanicsM0Fixtures } from "./mechanicsCompatibilityBaseline.fixtures.js";
import { MECHANICS_M0_DEFERRED_CROSS_TIER_DIAGNOSTICS, MECHANICS_M0_EXTERNAL_REPOSITORIES } from "./mechanicsCompatibilityBaselineManifest.js";

export function useMechanicsCompatibilityBaselineViewModel() {
  const fixtures = useMemo(() => listMechanicsM0Fixtures(), []);
  const [selectedFixtureId, setSelectedFixtureId] = useState(fixtures[0]?.id || "");
  return {
    contractVersion: MECHANICS_COMPATIBILITY_BASELINE_CONTRACT_VERSION,
    status: MECHANICS_COMPATIBILITY_BASELINE_STATUS,
    identities: MECHANICS_CURRENT_IDENTITIES,
    fixtures: fixtures.map(({ id, label, classification, domains }) => ({ id, label, classification, domains })),
    selectedFixture: fixtures.find((fixture) => fixture.id === selectedFixtureId) || fixtures[0] || null,
    selectedFixtureId,
    onSelectFixture: setSelectedFixtureId,
    externalRepositories: MECHANICS_M0_EXTERNAL_REPOSITORIES,
    deferredDiagnostics: MECHANICS_M0_DEFERRED_CROSS_TIER_DIAGNOSTICS,
  };
}
