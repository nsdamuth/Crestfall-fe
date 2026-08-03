"use client";

import { useMemo, useState } from "react";

import {
  MECHANICS_DOCUMENT_CORE_CONTRACT_VERSION,
  MECHANICS_DOCUMENT_CORE_PHASE,
  MECHANICS_DOCUMENT_CORE_STATUS,
} from "./MechanicsDocumentCore.contract.js";
import { listMechanicsDocumentCoreFixtures } from "./mechanicsDocumentCore.fixtures.js";
import { selectMechanicsDomainCounts } from "./mechanicsDocumentSelectors.js";

export function useMechanicsDocumentCoreViewModel() {
  const fixtures = useMemo(() => listMechanicsDocumentCoreFixtures(), []);
  const [selectedFixtureId, setSelectedFixtureId] = useState(
    fixtures[0]?.id || ""
  );
  const selectedFixture =
    fixtures.find((fixture) => fixture.id === selectedFixtureId) ||
    fixtures[0] ||
    null;

  return {
    contractVersion: MECHANICS_DOCUMENT_CORE_CONTRACT_VERSION,
    phase: MECHANICS_DOCUMENT_CORE_PHASE,
    status: MECHANICS_DOCUMENT_CORE_STATUS,
    fixtures,
    selectedFixture,
    selectedFixtureId,
    onSelectFixture: setSelectedFixtureId,
    domainCounts: selectedFixture
      ? selectMechanicsDomainCounts(selectedFixture.normalized)
      : null,
  };
}
