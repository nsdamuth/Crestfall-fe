import {
  countCustomCommandOutcomeBranches,
  listCommandOutcomeEffects,
  normalizeCommandOutcomes,
} from "../mechanics-command-outcomes/mechanicsCommandOutcomesNormalization.js";
import {
  countTargetBoundMechanicsEffects,
  normalizeMechanicsCommandEffect,
} from "../mechanics-command-effects/mechanicsCommandEffectsNormalization.js";
import {
  normalizeMechanicsCommandDomainAction,
} from "../mechanics-command-domain-actions/mechanicsCommandDomainActionsNormalization.js";
import {
  normalizeMechanicsCommandDomainQuery,
} from "../mechanics-command-domain-query/mechanicsCommandDomainQueryNormalization.js";
import {
  formatMechanicsCommandResolutionSummary,
  normalizeMechanicsCommandResolution,
} from "../mechanics-command-resolution/mechanicsCommandResolutionNormalization.js";
import {
  normalizeCommandInvocation,
  normalizeCommandPresentation,
} from "../mechanics-command-core/mechanicsCommandCoreNormalization.js";
import {
  normalizeMechanicsCommandRequirements,
} from "../mechanics-command-requirements/mechanicsCommandRequirementsNormalization.js";
import {
  normalizeMechanicsCommandCompositionBuilder,
  summarizeMechanicsCommandCompositionBuilder,
} from "../mechanicsCommandCompositionBuilder.js";
import {
  normalizeMechanicsCommandStateReadoutBuilder,
} from "../mechanicsCommandStateReadoutBuilder.js";
import {
  countMechanicsDefaultEntries,
  normalizeMechanicsDefaults,
} from "../mechanics-defaults/mechanicsDefaultsNormalization.js";
import {
  normalizeMechanicsGuards,
} from "../mechanics-guards/mechanicsGuardsNormalization.js";
import {
  normalizeMechanicsStatusBlocks,
} from "../mechanics-status-blocks/mechanicsStatusBlocksNormalization.js";
import {
  normalizeMechanicsTracker,
} from "../mechanics-trackers/mechanicsTrackersNormalization.js";
import {
  normalizeMechanicsDocument,
} from "../mechanics-core/mechanicsDocumentNormalization.js";

export function asMechanicsObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export function asMechanicsArray(value) {
  return Array.isArray(value) ? value : [];
}

export function normalizeMechanicsString(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeMechanicsTags(value) {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag || "").trim()).filter(Boolean);
  }

  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function normalizeMechanicsAssemblyCommand(command, fallbackIndex = 0) {
  const source = asMechanicsObject(command);
  const id = normalizeMechanicsString(source.id) || `command_${fallbackIndex + 1}`;

  return {
    ...source,
    id,
    label: normalizeMechanicsString(source.label) || id,
    commandContractVersion:
      normalizeMechanicsString(source.commandContractVersion) ||
      "mechanics_command_contract_v1",
    invocation: normalizeCommandInvocation(source.invocation),
    requirements: normalizeMechanicsCommandRequirements(source.requirements),
    attemptEffects: asMechanicsArray(
      source.attemptEffects ||
        source.attempt_effects ||
        source.costs ||
        source.preResolutionEffects ||
        source.pre_resolution_effects ||
        source.onAttemptEffects ||
        source.on_attempt_effects
    ).map((effect) => normalizeMechanicsCommandEffect(effect, effect?.type)),
    resolution: normalizeMechanicsCommandResolution(source.resolution),
    outcomes: normalizeCommandOutcomes(source.outcomes, {
      normalizeEffect: normalizeMechanicsCommandEffect,
    }),
    domainAction: normalizeMechanicsCommandDomainAction(
      source.domainAction ||
        source.domain_action ||
        source.domainAdapter ||
        source.domain_adapter
    ),
    domainQuery: normalizeMechanicsCommandDomainQuery(
      source.domainQuery ||
        source.domain_query ||
        source.queryAdapter ||
        source.query_adapter
    ),
    composition: normalizeMechanicsCommandCompositionBuilder(
      source.composition ||
        source.commandComposition ||
        source.command_composition ||
        source.executionComposition ||
        source.execution_composition
    ),
    presentation: normalizeCommandPresentation(
      source.presentation,
      normalizeMechanicsCommandStateReadoutBuilder
    ),
    triggers: asMechanicsArray(source.triggers).map(String).filter(Boolean),
    effects: asMechanicsArray(source.effects).map((effect) =>
      normalizeMechanicsCommandEffect(effect, effect?.type)
    ),
  };
}

export function createUniqueMechanicsId(prefix, existingItems = []) {
  const existingIds = new Set(
    asMechanicsArray(existingItems)
      .map((item) => normalizeMechanicsString(item?.id))
      .filter(Boolean)
  );
  let index = existingIds.size + 1;
  let candidate = `${prefix}_${index}`;

  while (existingIds.has(candidate)) {
    index += 1;
    candidate = `${prefix}_${index}`;
  }

  return candidate;
}

export function pluralizeMechanicsCount(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function getMechanicsCommandFoldSummary(command, commandIndex) {
  const safeCommand = normalizeMechanicsAssemblyCommand(command, commandIndex);
  const invocation = normalizeCommandInvocation(safeCommand.invocation);
  const resolution = normalizeMechanicsCommandResolution(safeCommand.resolution);
  const outcomes = normalizeCommandOutcomes(safeCommand.outcomes, {
    normalizeEffect: normalizeMechanicsCommandEffect,
  });
  const domainAction = normalizeMechanicsCommandDomainAction(safeCommand.domainAction);
  const domainQuery = normalizeMechanicsCommandDomainQuery(safeCommand.domainQuery);
  const composition = normalizeMechanicsCommandCompositionBuilder(
    safeCommand.composition
  );
  const compositionSummary = summarizeMechanicsCommandCompositionBuilder(composition);
  const attemptEffectCount = asMechanicsArray(safeCommand.attemptEffects).length;
  const customOutcomeCount = countCustomCommandOutcomeBranches(outcomes, {
    normalizeEffect: normalizeMechanicsCommandEffect,
  });
  const targetBoundEffectCount = countTargetBoundMechanicsEffects([
    ...asMechanicsArray(safeCommand.effects),
    ...asMechanicsArray(safeCommand.attemptEffects),
    ...listCommandOutcomeEffects(outcomes, {
      normalizeEffect: normalizeMechanicsCommandEffect,
    }),
    ...composition.mechanicsSteps.flatMap((step) => asMechanicsArray(step.effects)),
  ]);
  const commandName = invocation.command
    ? `${invocation.prefixes[0] || "/"}${invocation.command}`
    : safeCommand.id;

  return [
    commandName,
    pluralizeMechanicsCount(asMechanicsArray(invocation.arguments).length, "argument"),
    pluralizeMechanicsCount(asMechanicsArray(safeCommand.requirements).length, "requirement"),
    formatMechanicsCommandResolutionSummary(resolution),
    domainQuery.enabled ? `${domainQuery.domain} / ${domainQuery.operation}` : "",
    domainAction.enabled ? domainAction.type.replaceAll("_", " ") : "",
    attemptEffectCount ? pluralizeMechanicsCount(attemptEffectCount, "attempt effect") : "",
    pluralizeMechanicsCount(asMechanicsArray(safeCommand.effects).length, "base effect"),
    targetBoundEffectCount
      ? pluralizeMechanicsCount(targetBoundEffectCount, "target-bound effect")
      : "",
    pluralizeMechanicsCount(customOutcomeCount, "custom outcome"),
    compositionSummary.enabledMechanicsStepCount
      ? pluralizeMechanicsCount(
          compositionSummary.enabledMechanicsStepCount,
          "composition step"
        )
      : "",
    compositionSummary.enabledDomainStepCount
      ? pluralizeMechanicsCount(
          compositionSummary.enabledDomainStepCount,
          "domain step"
        )
      : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

export function patchMechanicsAssemblyCommand(commands, commandIndex, patch) {
  return asMechanicsArray(commands).map((command, index) =>
    index === commandIndex ? { ...command, ...asMechanicsObject(patch) } : command
  );
}

export function removeMechanicsAssemblyCommand(commands, commandIndex) {
  return asMechanicsArray(commands).filter((_command, index) => index !== commandIndex);
}

export function addMechanicsAssemblyCommand(commands) {
  const current = asMechanicsArray(commands);
  const commandId = createUniqueMechanicsId("command", current);

  return [
    ...current,
    normalizeMechanicsAssemblyCommand(
      {
        id: commandId,
        label: `Command ${current.length + 1}`,
        commandContractVersion: "mechanics_command_contract_v1",
        invocation: {
          command: commandId,
          prefixes: ["/"],
          aliases: [],
          arguments: [],
        },
        presentation: {
          mode: "MECHANICS_ACTION",
          continueNarrative: true,
          advanceTime: true,
          resultVisibility: "FULL",
        },
        triggers: [],
        reason: "",
        effects: [],
        outcomes: normalizeCommandOutcomes({}, {
          normalizeEffect: normalizeMechanicsCommandEffect,
        }),
      },
      current.length
    ),
  ];
}

export function buildMechanicsModuleAssemblyProjection(value) {
  const data = normalizeMechanicsDocument(value);
  const instanceData = asMechanicsObject(data.instanceData);
  const trackers = asMechanicsArray(instanceData.trackers);
  const commands = asMechanicsArray(instanceData.commands);
  const defaults = normalizeMechanicsDefaults(instanceData.defaults);
  const statusBlocks = normalizeMechanicsStatusBlocks(instanceData.statusBlocks);
  const guards = normalizeMechanicsGuards(instanceData.guards);

  const trackerSummary = trackers
    .map((tracker, index) => normalizeMechanicsTracker(tracker, index).label)
    .filter(Boolean)
    .slice(0, 3)
    .join(", ");
  const commandSummary = commands
    .map((command, index) => {
      const invocation = normalizeCommandInvocation(
        normalizeMechanicsAssemblyCommand(command, index).invocation
      );
      return invocation.command
        ? `${invocation.prefixes[0] || "/"}${invocation.command}`
        : "";
    })
    .filter(Boolean)
    .slice(0, 3)
    .join(", ");

  return {
    data,
    instanceData,
    trackers,
    commands,
    defaults,
    statusBlocks,
    guards,
    tagsText: asMechanicsArray(data.tags).join(", "),
    priority: Number.isFinite(Number(data.priority)) ? String(data.priority) : "65",
    trackerSummary,
    commandSummary,
    defaultEntryCount: countMechanicsDefaultEntries(defaults),
  };
}
