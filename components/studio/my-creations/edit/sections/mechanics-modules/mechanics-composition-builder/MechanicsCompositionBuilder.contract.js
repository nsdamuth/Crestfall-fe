export const MECHANICS_COMPOSITION_BUILDER_VIEW_CONTRACT_VERSION = "1.0.0";

/**
 * Portable View contract for the Mechanics command composition editor.
 *
 * The View receives display-ready composition steps, argument choices,
 * reference configurations, validation messages, and semantic callbacks.
 * It must not know creation form storage, persistence, services-api calls,
 * room runtime state, or PostGraphile/database details.
 */
// Doc-only correction (ED1G sw12), no version bump: 10 view props
// already read by the View were undeclared here (9 option lists plus
// the injected ProgressionProfileFieldsComponent).
export const MECHANICS_COMPOSITION_BUILDER_VIEW_CONTRACT = Object.freeze({
  version: MECHANICS_COMPOSITION_BUILDER_VIEW_CONTRACT_VERSION,
  values: [
    "title",
    "description",
    "summary",
    "referenceId",
    "referenceOptions",
    "mechanicsSteps",
    "domainSteps",
    "phaseOptions",
    "outcomeOptions",
    "failurePolicyOptions",
    "conditionModeOptions",
    "conditionBucketOptions",
    "conditionScopeOptions",
    "conditionOperatorOptions",
    "effectTypeOptions",
    "travelOperationOptions",
    "canAddMechanicsStep",
    "canAddDomainStep",
    "validationMessages",
  ],
  applicationSlots: ["ProgressionProfileFieldsComponent"],
  callbacks: [
    "onChooseReference",
    "onApplyReference",
    "onAddMechanicsStep",
    "onPatchMechanicsStep",
    "onRemoveMechanicsStep",
    "onMoveMechanicsStep",
    "onToggleMechanicsDependency",
    "onToggleMechanicsOutcome",
    "onAddCondition",
    "onPatchCondition",
    "onRemoveCondition",
    "onAddEffect",
    "onPatchEffect",
    "onRemoveEffect",
    "onAddDomainStep",
    "onPatchDomainStep",
    "onRemoveDomainStep",
    "onMoveDomainStep",
    "onToggleDomainDependency",
    "onToggleDomainOutcome",
  ],
});
