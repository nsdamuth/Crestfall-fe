import {
  COMMAND_DOMAIN_ACTION_OUTCOMES,
  COMMAND_DOMAIN_ACTION_TYPE_VALUES,
} from "./MechanicsCommandDomainActions.contract.js";
import {
  getMechanicsCommandDomainArgumentOptions,
  getMechanicsCommandDomainActionFlags,
  normalizeMechanicsCommandDomainAction,
} from "./mechanicsCommandDomainActionsNormalization.js";

function retainOrFirst(currentValue, options, fallback) {
  return options.some((item) => item.name === currentValue)
    ? currentValue
    : options[0]?.name || fallback;
}

export function patchMechanicsCommandDomainAction(current, patch) {
  return normalizeMechanicsCommandDomainAction({
    ...normalizeMechanicsCommandDomainAction(current),
    ...patch,
  });
}

export function changeMechanicsCommandDomainActionType(
  current,
  requestedType,
  invocation = {}
) {
  const domainAction = normalizeMechanicsCommandDomainAction(current);
  const type = COMMAND_DOMAIN_ACTION_TYPE_VALUES.includes(requestedType)
    ? requestedType
    : "NONE";
  const options = getMechanicsCommandDomainArgumentOptions(invocation);
  const flags = getMechanicsCommandDomainActionFlags(type);
  const nextItemOptions = flags.usesVisibleItem
    ? options.visibleItems
    : options.heldItems;
  const locationAction = flags.usesLocation;
  const participantConditionAction = flags.usesParticipantCondition;

  return normalizeMechanicsCommandDomainAction({
    ...domainAction,
    enabled: type !== "NONE",
    type,
    itemArgumentName:
      type !== "NONE" && !locationAction && !participantConditionAction
        ? retainOrFirst(domainAction.itemArgumentName, nextItemOptions, "item")
        : "",
    destinationArgumentName:
      type === "LOCATION_TRANSITION"
        ? retainOrFirst(
            domainAction.destinationArgumentName,
            options.connectedLocations,
            "destination"
          )
        : "",
    travelOperation:
      type === "LOCATION_TRAVEL_OPERATION"
        ? domainAction.travelOperation || "CONTINUE"
        : "",
    targetArgumentName:
      type === "ITEM_GIVE"
        ? domainAction.targetArgumentName ||
          options.presentCharacters[0]?.name ||
          "target"
        : participantConditionAction
          ? retainOrFirst(
              domainAction.targetArgumentName,
              options.presentCharacters,
              "target"
            )
          : "",
    conditionArgumentName: participantConditionAction
      ? retainOrFirst(domainAction.conditionArgumentName, options.text, "condition")
      : "",
    placementArgumentName: flags.requiresPlacement
      ? domainAction.placementArgumentName || options.text[0]?.name || "placement"
      : "",
    quantityArgumentName:
      type === "ITEM_CONSUME" ? domainAction.quantityArgumentName || "" : "",
    amountArgumentName: flags.requiresAmount
      ? domainAction.amountArgumentName || options.numbers[0]?.name || "amount"
      : "",
    applyOnOutcomes:
      type !== "NONE"
        ? domainAction.applyOnOutcomes.length
          ? domainAction.applyOnOutcomes
          : ["CRITICAL_SUCCESS", "SUCCESS"]
        : [],
  });
}

export function toggleMechanicsCommandDomainActionOutcome(
  current,
  outcome,
  checked
) {
  const domainAction = normalizeMechanicsCommandDomainAction(current);
  if (!COMMAND_DOMAIN_ACTION_OUTCOMES.includes(outcome)) return domainAction;
  const next = checked
    ? [...new Set([...domainAction.applyOnOutcomes, outcome])]
    : domainAction.applyOnOutcomes.filter((value) => value !== outcome);
  return patchMechanicsCommandDomainAction(domainAction, {
    enabled: true,
    type: domainAction.type,
    applyOnOutcomes: next,
  });
}
