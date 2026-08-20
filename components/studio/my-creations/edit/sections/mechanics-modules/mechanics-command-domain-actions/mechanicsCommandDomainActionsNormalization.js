import {
  ABILITY_SPELL_ACTOR_ARGUMENT_TYPES,
  ABILITY_SPELL_USE_ACTOR_ARGUMENT_TYPES,
  ABILITY_SPELL_KNOWLEDGE_STATES,
  ABILITY_SPELL_UNLOCK_STATES,
  COMMAND_DOMAIN_ACTION_OUTCOMES,
  COMMAND_DOMAIN_ACTION_TYPE_VALUES,
  COMMAND_DOMAIN_ARGUMENT_TYPES,
  LOCATION_TRAVEL_OPERATIONS,
  MECHANICS_COMMAND_DOMAIN_ACTION_VERSION,
  MECHANICS_COMMAND_DOMAIN_ACTION_VERSION_V2,
  MECHANICS_COMMAND_DOMAIN_ACTION_VERSION_V3,
} from "./MechanicsCommandDomainActions.contract.js";

function asObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeBoolean(value, fallback = false) {
  if (value === true || value === false) return value;
  const normalized = normalizeString(value).toLowerCase();
  if (["true", "yes", "1", "on"].includes(normalized)) return true;
  if (["false", "no", "0", "off"].includes(normalized)) return false;
  return fallback;
}

function slugifyId(value, fallback = "") {
  const slug = normalizeString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug || fallback;
}

function normalizeStringList(value) {
  const values = Array.isArray(value) ? value : String(value || "").split(",");
  return [...new Set(values.map(normalizeString).filter(Boolean))];
}

function normalizeArgumentOption(argument, fallbackLabel) {
  const source = asObject(argument);
  const name = normalizeString(source.name);
  if (!name) return null;
  return {
    name,
    label:
      normalizeString(source.label) ||
      normalizeString(source.name) ||
      fallbackLabel,
    type: normalizeString(source.type).toUpperCase(),
  };
}

function listArgumentsByType(invocation, type, fallbackLabel) {
  return asArray(asObject(invocation).arguments)
    .filter(
      (argument) => normalizeString(argument?.type).toUpperCase() === type
    )
    .map((argument) => normalizeArgumentOption(argument, fallbackLabel))
    .filter(Boolean);
}

function listArgumentsByTypes(invocation, types, fallbackLabel) {
  const allowed = new Set(types);
  return asArray(asObject(invocation).arguments)
    .filter((argument) => allowed.has(normalizeString(argument?.type).toUpperCase()))
    .map((argument) => normalizeArgumentOption(argument, fallbackLabel))
    .filter(Boolean);
}

export function getMechanicsCommandDomainArgumentOptions(invocation = {}) {
  return {
    heldItems: listArgumentsByType(
      invocation,
      COMMAND_DOMAIN_ARGUMENT_TYPES.heldItem,
      "Item"
    ),
    visibleItems: listArgumentsByType(
      invocation,
      COMMAND_DOMAIN_ARGUMENT_TYPES.visibleItem,
      "Item"
    ),
    connectedLocations: listArgumentsByType(
      invocation,
      COMMAND_DOMAIN_ARGUMENT_TYPES.connectedLocation,
      "Destination"
    ),
    presentCharacters: listArgumentsByType(
      invocation,
      COMMAND_DOMAIN_ARGUMENT_TYPES.presentCharacter,
      "Recipient"
    ),
    abilityActors: listArgumentsByTypes(
      invocation,
      ABILITY_SPELL_ACTOR_ARGUMENT_TYPES,
      "Actor"
    ),
    abilityUseActors: listArgumentsByTypes(
      invocation,
      ABILITY_SPELL_USE_ACTOR_ARGUMENT_TYPES,
      "Actor"
    ),
    text: listArgumentsByType(
      invocation,
      COMMAND_DOMAIN_ARGUMENT_TYPES.text,
      "Placement"
    ),
    numbers: listArgumentsByType(
      invocation,
      COMMAND_DOMAIN_ARGUMENT_TYPES.number,
      "Number"
    ),
  };
}

export function normalizeMechanicsCommandDomainAction(value = {}) {
  const source = asObject(value);
  const requestedType = normalizeString(
    source.type ||
      source.actionType ||
      source.action_type ||
      source.adapterType ||
      source.adapter_type ||
      "NONE"
  ).toUpperCase();
  const version =
    normalizeString(source.version) || MECHANICS_COMMAND_DOMAIN_ACTION_VERSION;
  const typeAllowedByVersion =
    requestedType === "ABILITY_SPELL_USE_REQUEST"
      ? version === MECHANICS_COMMAND_DOMAIN_ACTION_VERSION_V3
      : requestedType === "ABILITY_SPELL_KNOWLEDGE_SET"
        ? [
            MECHANICS_COMMAND_DOMAIN_ACTION_VERSION_V2,
            MECHANICS_COMMAND_DOMAIN_ACTION_VERSION_V3,
          ].includes(version)
        : true;
  const type =
    typeAllowedByVersion && COMMAND_DOMAIN_ACTION_TYPE_VALUES.includes(requestedType)
      ? requestedType
      : "NONE";
  const enabled = type !== "NONE" && normalizeBoolean(source.enabled, true);
  const requestedOutcomes = normalizeStringList(
    source.applyOnOutcomes || source.apply_on_outcomes || source.outcomes
  )
    .map((outcome) => normalizeString(outcome).toUpperCase())
    .filter((outcome) => COMMAND_DOMAIN_ACTION_OUTCOMES.includes(outcome));

  const rawTravelOperation = normalizeString(
    source.travelOperation ||
      source.travel_operation ||
      source.operation ||
      source.operationType ||
      source.operation_type
  ).toUpperCase();

  return {
    ...source,
    version,
    enabled,
    type: enabled ? type : "NONE",
    itemArgumentName:
      enabled && type.startsWith("ITEM_")
        ? slugifyId(
            source.itemArgumentName ||
              source.item_argument_name ||
              source.itemArgument ||
              source.item_argument,
            "item"
          )
        : "",
    destinationArgumentName:
      enabled && type === "LOCATION_TRANSITION"
        ? slugifyId(
            source.destinationArgumentName ||
              source.destination_argument_name ||
              source.locationArgumentName ||
              source.location_argument_name ||
              source.destinationArgument ||
              source.destination_argument,
            "destination"
          )
        : "",
    travelOperation:
      enabled && type === "LOCATION_TRAVEL_OPERATION"
        ? LOCATION_TRAVEL_OPERATIONS.includes(rawTravelOperation)
          ? rawTravelOperation
          : "CONTINUE"
        : "",
    targetArgumentName:
      enabled &&
      [
        "ITEM_GIVE",
        "PARTICIPANT_CONDITION_APPLY",
        "PARTICIPANT_CONDITION_REMOVE",
      ].includes(type)
        ? slugifyId(
            source.targetArgumentName ||
              source.target_argument_name ||
              source.recipientArgumentName ||
              source.recipient_argument_name ||
              source.characterArgumentName ||
              source.character_argument_name ||
              source.targetArgument ||
              source.target_argument,
            "target"
          )
        : enabled && type === "ABILITY_SPELL_USE_REQUEST"
          ? slugifyId(
              source.targetArgumentName ||
                source.target_argument_name ||
                source.targetArgument ||
                source.target_argument,
              ""
            )
          : "",
    conditionArgumentName:
      enabled &&
      ["PARTICIPANT_CONDITION_APPLY", "PARTICIPANT_CONDITION_REMOVE"].includes(
        type
      )
        ? slugifyId(
            source.conditionArgumentName ||
              source.condition_argument_name ||
              source.statusArgumentName ||
              source.status_argument_name ||
              source.conditionArgument ||
              source.condition_argument,
            "condition"
          )
        : "",
    placementArgumentName:
      enabled && ["ITEM_STORE", "ITEM_PLACE"].includes(type)
        ? slugifyId(
            source.placementArgumentName ||
              source.placement_argument_name ||
              source.destinationArgumentName ||
              source.destination_argument_name ||
              source.placementArgument ||
              source.placement_argument,
            "placement"
          )
        : "",
    quantityArgumentName:
      enabled && type === "ITEM_CONSUME"
        ? slugifyId(
            source.quantityArgumentName ||
              source.quantity_argument_name ||
              source.quantityArgument ||
              source.quantity_argument,
            ""
          )
        : "",
    amountArgumentName:
      enabled && ["ITEM_DAMAGE", "ITEM_REPAIR"].includes(type)
        ? slugifyId(
            source.amountArgumentName ||
              source.amount_argument_name ||
              source.conditionAmountArgumentName ||
              source.condition_amount_argument_name ||
              source.condition_amount_argument ||
              source.amountArgument ||
              source.amount_argument,
            "amount"
          )
        : "",
    actorArgumentName:
      enabled && ["ABILITY_SPELL_KNOWLEDGE_SET", "ABILITY_SPELL_USE_REQUEST"].includes(type)
        ? slugifyId(
            source.actorArgumentName ||
              source.actor_argument_name ||
              source.targetArgumentName ||
              source.target_argument_name,
            "actor"
          )
        : "",
    abilityArgumentName:
      enabled && ["ABILITY_SPELL_KNOWLEDGE_SET", "ABILITY_SPELL_USE_REQUEST"].includes(type)
        ? slugifyId(
            source.abilityArgumentName ||
              source.ability_argument_name ||
              source.subjectArgumentName ||
              source.subject_argument_name,
            "ability"
          )
        : "",
    knowledgeState:
      enabled && type === "ABILITY_SPELL_KNOWLEDGE_SET"
        ? (() => {
            const requested = normalizeString(
              source.knowledgeState || source.knowledge_state || source.knownState || source.known_state || "KEEP"
            ).toUpperCase();
            return ABILITY_SPELL_KNOWLEDGE_STATES.includes(requested)
              ? requested
              : "KEEP";
          })()
        : "KEEP",
    unlockState:
      enabled && type === "ABILITY_SPELL_KNOWLEDGE_SET"
        ? (() => {
            const requested = normalizeString(
              source.unlockState || source.unlock_state || "KEEP"
            ).toUpperCase();
            return ABILITY_SPELL_UNLOCK_STATES.includes(requested)
              ? requested
              : "KEEP";
          })()
        : "KEEP",
    applyOnOutcomes: enabled
      ? requestedOutcomes.length
        ? requestedOutcomes
        : ["CRITICAL_SUCCESS", "SUCCESS"]
      : [],
  };
}

export function getMechanicsCommandDomainActionFlags(type) {
  return {
    requiresPlacement: ["ITEM_STORE", "ITEM_PLACE"].includes(type),
    supportsQuantity: type === "ITEM_CONSUME",
    requiresAmount: ["ITEM_DAMAGE", "ITEM_REPAIR"].includes(type),
    usesConnectedLocation: type === "LOCATION_TRANSITION",
    usesTravelOperation: type === "LOCATION_TRAVEL_OPERATION",
    usesLocation: ["LOCATION_TRANSITION", "LOCATION_TRAVEL_OPERATION"].includes(
      type
    ),
    usesParticipantCondition: [
      "PARTICIPANT_CONDITION_APPLY",
      "PARTICIPANT_CONDITION_REMOVE",
    ].includes(type),
    usesAbilitySpellKnowledge: type === "ABILITY_SPELL_KNOWLEDGE_SET",
    usesAbilitySpellUse: type === "ABILITY_SPELL_USE_REQUEST",
    usesVisibleItem: ["ITEM_TAKE", "ITEM_DAMAGE", "ITEM_REPAIR"].includes(type),
  };
}

export function getMechanicsCommandDomainActionDescription(type) {
  const descriptions = {
    ITEM_GIVE:
      "Give transfers one unique or single-quantity Item runtime instance from the active Player Character to a resolved present Character.",
    ITEM_DROP:
      "Drop moves the complete tracked Item instance from the active Player Character into the current Location inventory.",
    ITEM_TAKE:
      "Take moves an accessible visible Item instance from the current Location or Story inventory into the active Player Character inventory.",
    ITEM_EQUIP:
      "Equip preserves Player Character custody and changes the Item placement to Equipped.",
    ITEM_UNEQUIP:
      "Unequip requires an equipped Item and changes its placement back to Carried.",
    ITEM_STORE:
      "Store preserves Player Character custody and records the explicit carried storage placement supplied by the TEXT argument.",
    ITEM_PLACE:
      "Place moves the Item into the active Location at the explicit placement supplied by the TEXT argument.",
    ITEM_USE:
      "Use records an authoritative Item use event while preserving current custody, placement, quantity, and condition.",
    ITEM_CONSUME:
      "Consume decrements the tracked numeric quantity by one or by the optional NUMBER argument. At zero, the Item becomes Unassigned.",
    ITEM_DAMAGE:
      "Damage subtracts the positive NUMBER amount from tracked conditionPercent and clamps the result at 0%.",
    ITEM_REPAIR:
      "Repair adds the positive NUMBER amount to tracked conditionPercent and clamps the result at 100%.",
    PARTICIPANT_CONDITION_APPLY:
      "Apply Condition creates an UNTIL_REMOVED active condition for the resolved present Character through the existing sensory condition runtime.",
    PARTICIPANT_CONDITION_REMOVE:
      "Remove Condition requires the named condition to be active on the resolved present Character and writes the matching REMOVED condition marker through the existing sensory condition runtime.",
    ABILITY_SPELL_KNOWLEDGE_SET:
      "Set Ability / Spell Knowledge mutates authoritative actor-owned known and unlocked state for a definition resolved through the actor’s graph-bound Ability & Spell Profile. It does not cast, spend resources, start cooldowns, or consume charges.",
    ABILITY_SPELL_USE_REQUEST:
      "Authorize Ability / Spell Use creates a deterministic pre-commit use transaction only after the existing Ability/Spell authorization envelope returns AUTHORIZED. It does not spend resources, consume charges, start cooldowns, execute operation references, or commit the use.",
    // Preserve the existing parent fallback wording for current Location actions.
    LOCATION_TRANSITION:
      "Remove Condition requires the named condition to be active on the resolved present Character and writes the matching REMOVED condition marker through the existing sensory condition runtime.",
    LOCATION_TRAVEL_OPERATION:
      "Remove Condition requires the named condition to be active on the resolved present Character and writes the matching REMOVED condition marker through the existing sensory condition runtime.",
  };
  return descriptions[type] ||
    "No cross-domain state mutation is configured. The command may still use ordinary Mechanics effects.";
}

export function projectMechanicsCommandDomainAction(value, invocation = {}) {
  const domainAction = normalizeMechanicsCommandDomainAction(value);
  const options = getMechanicsCommandDomainArgumentOptions(invocation);
  const flags = getMechanicsCommandDomainActionFlags(domainAction.type);
  const activeItemOptions = flags.usesVisibleItem
    ? options.visibleItems
    : options.heldItems;
  const activeItemType = flags.usesVisibleItem ? "ITEM_VISIBLE" : "ITEM_HELD";
  const activeItemLabel = flags.usesVisibleItem
    ? "Visible Item Argument"
    : "Held Item Argument";

  let missingBindingMessage = "";
  if (flags.usesParticipantCondition) {
    if (!options.presentCharacters.length || !options.text.length) {
      missingBindingMessage = `${
        domainAction.type === "PARTICIPANT_CONDITION_APPLY"
          ? "Apply Character Condition"
          : "Remove Character Condition"
      } requires one CHARACTER_PRESENT argument and one TEXT condition argument.`;
    }
  } else if (flags.usesAbilitySpellUse) {
    if (!options.abilityUseActors.length || !options.text.length) {
      missingBindingMessage =
        "Authorize Ability / Spell Use requires one PLAYER_CHARACTER actor argument and one TEXT ability argument.";
    }
  } else if (flags.usesAbilitySpellKnowledge) {
    if (!options.abilityActors.length || !options.text.length) {
      missingBindingMessage =
        "Set Ability / Spell Knowledge requires one PLAYER_CHARACTER or CHARACTER_PRESENT actor argument and one TEXT ability argument.";
    } else if (
      domainAction.knowledgeState === "KEEP" &&
      domainAction.unlockState === "KEEP"
    ) {
      missingBindingMessage =
        "Set Ability / Spell Knowledge must change known state, unlock state, or both.";
    }
  } else if (domainAction.type === "ITEM_GIVE") {
    if (!options.heldItems.length || !options.presentCharacters.length) {
      missingBindingMessage =
        "Give Held Item requires one ITEM_HELD argument and one CHARACTER_PRESENT argument.";
    }
  } else if (domainAction.type === "ITEM_TAKE") {
    if (!options.visibleItems.length) {
      missingBindingMessage =
        "Take Visible Item requires one ITEM_VISIBLE argument.";
    }
  } else if (flags.requiresPlacement) {
    if (!options.heldItems.length || !options.text.length) {
      missingBindingMessage = `${
        domainAction.type === "ITEM_STORE"
          ? "Store Held Item"
          : "Place Held Item"
      } requires one ITEM_HELD argument and one TEXT placement argument.`;
    }
  } else if (flags.requiresAmount) {
    if (!options.visibleItems.length || !options.numbers.length) {
      missingBindingMessage = `${
        domainAction.type === "ITEM_DAMAGE"
          ? "Damage Visible Item"
          : "Repair Visible Item"
      } requires one ITEM_VISIBLE argument and one NUMBER amount argument.`;
    }
  } else if (
    domainAction.type !== "NONE" &&
    !flags.usesLocation &&
    !activeItemOptions.length
  ) {
    const label =
      domainAction.type === "ITEM_EQUIP"
        ? "Equip Held Item"
        : domainAction.type === "ITEM_UNEQUIP"
          ? "Unequip Held Item"
          : domainAction.type === "ITEM_USE"
            ? "Use Held Item"
            : domainAction.type === "ITEM_CONSUME"
              ? "Consume Held Item"
              : "Drop Held Item";
    missingBindingMessage = `${label} requires one ITEM_HELD argument.`;
  }

  return {
    domainAction,
    options,
    flags,
    activeItemOptions,
    activeItemType,
    activeItemLabel,
    missingBindingMessage,
    description: getMechanicsCommandDomainActionDescription(domainAction.type),
  };
}
