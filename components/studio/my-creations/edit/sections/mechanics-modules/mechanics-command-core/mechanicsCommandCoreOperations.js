import {
  MECHANICS_COMMAND_CONTRACT_VERSION,
} from "./MechanicsCommandCore.contract.js";
import {
  getLastPositionalArgumentIndex,
  isImplicitTargetArgumentType,
  normalizeCommandArgument,
  normalizeCommandInvocation,
  normalizeCommandName,
  normalizeCommandPrefix,
  normalizeCommandPresentation,
  normalizeCommandStringList,
  normalizeCommandTriggers,
  slugifyCommandId,
  uniqueCommandId,
} from "./mechanicsCommandCoreNormalization.js";

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function createCommandCoreController({
  command,
  commandIndex,
  commands,
  onPatchCommand,
  normalizeStateReadout,
}) {
  const safeCommand = command && typeof command === "object" ? command : {};
  const invocation = normalizeCommandInvocation(safeCommand.invocation);
  const presentation = normalizeCommandPresentation(
    safeCommand.presentation,
    normalizeStateReadout
  );

  function patchCommand(patch) {
    onPatchCommand(commandIndex, patch);
  }

  function patchInvocation(patch) {
    patchCommand({
      commandContractVersion: MECHANICS_COMMAND_CONTRACT_VERSION,
      invocation: normalizeCommandInvocation({ ...invocation, ...patch }),
    });
  }

  function patchPresentation(patch) {
    patchCommand({
      presentation: normalizeCommandPresentation(
        { ...presentation, ...patch },
        normalizeStateReadout
      ),
    });
  }

  function addArgument() {
    const argumentsList = asArray(invocation.arguments);
    patchInvocation({
      arguments: [
        ...argumentsList,
        normalizeCommandArgument(
          {
            name: uniqueCommandId("argument", argumentsList),
            label: `Argument ${argumentsList.length + 1}`,
            type: "TEXT",
            required: true,
            consumeRemaining: argumentsList.length === 0,
            allowQuoted: true,
          },
          argumentsList.length
        ),
      ],
    });
  }

  function patchArgument(argumentIndex, patch) {
    patchInvocation({
      arguments: asArray(invocation.arguments).map((argument, index) =>
        index === argumentIndex
          ? normalizeCommandArgument({ ...argument, ...patch }, index)
          : argument
      ),
    });
  }

  function removeArgument(argumentIndex) {
    patchInvocation({
      arguments: asArray(invocation.arguments).filter(
        (_argument, index) => index !== argumentIndex
      ),
    });
  }

  function addTrigger(trigger) {
    const normalized = String(trigger || "").trim();
    if (!normalized) return false;
    const triggers = normalizeCommandTriggers(safeCommand.triggers);
    if (triggers.includes(normalized)) return false;
    patchCommand({ triggers: [...triggers, normalized] });
    return true;
  }

  function removeTrigger(triggerIndex) {
    patchCommand({
      triggers: normalizeCommandTriggers(safeCommand.triggers).filter(
        (_trigger, index) => index !== triggerIndex
      ),
    });
  }

  function patchIdentity(field, value) {
    if (field === "id") {
      patchCommand({
        id: slugifyCommandId(
          value,
          uniqueCommandId("command", commands)
        ),
      });
      return;
    }

    if (field === "label") {
      patchCommand({
        label: value,
        id:
          safeCommand.id ||
          slugifyCommandId(value, uniqueCommandId("command", commands)),
      });
      return;
    }

    patchCommand({ [field]: value });
  }

  return {
    safeCommand,
    invocation,
    presentation,
    triggers: normalizeCommandTriggers(safeCommand.triggers),
    lastPositionalArgumentIndex: getLastPositionalArgumentIndex(
      invocation.arguments
    ),
    patchIdentity,
    patchInvocation,
    patchPresentation,
    addArgument,
    patchArgument,
    removeArgument,
    addTrigger,
    removeTrigger,
    normalizeCommandName,
    normalizeCommandPrefix,
    normalizeCommandStringList,
    slugifyCommandId,
    isImplicitTargetArgumentType,
  };
}
