"use client";
import MechanicsCompatibilityBaselineView from "./MechanicsCompatibilityBaseline.view";
import { useMechanicsCompatibilityBaselineViewModel } from "./useMechanicsCompatibilityBaselineViewModel";
export default function MechanicsCompatibilityBaseline() {
  return <MechanicsCompatibilityBaselineView {...useMechanicsCompatibilityBaselineViewModel()} />;
}
