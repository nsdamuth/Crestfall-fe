import {
  normalizeCommandInvocation,
  normalizeCommandPresentation,
  normalizeCommandTriggers,
} from "./mechanicsCommandCoreNormalization.js";

const FIXTURES = [
  {
    id: "standard",
    label: "Standard Command",
    description: "Canonical slash command with text and target arguments.",
    command: {
      id: "cast_spell",
      label: "Cast Spell",
      reason: "Resolve a spell through the Mechanics runtime.",
      commandContractVersion: "mechanics_command_contract_v1",
      invocation: {
        version: "mechanics_command_invocation_v1",
        command: "cast",
        prefixes: ["/"],
        aliases: ["spell"],
        arguments: [
          {
            name: "spell_name",
            label: "Spell",
            type: "TEXT",
            required: true,
            consumeRemaining: false,
            allowQuoted: true,
          },
          {
            name: "target",
            label: "Target",
            type: "CHARACTER_PRESENT",
            required: true,
            consumeRemaining: false,
            allowQuoted: true,
          },
        ],
      },
      presentation: {
        mode: "MECHANICS_ACTION",
        continueNarrative: true,
        advanceTime: true,
        resultVisibility: "FULL",
      },
      triggers: ["/cast"],
      futureCommandMetadata: { retained: true },
    },
  },
  {
    id: "implicit",
    label: "Implicit Actor",
    description: "SELF arguments consume no authored command text.",
    command: {
      id: "inspect_self",
      label: "Inspect Self",
      invocation: {
        command: "inspect",
        prefixes: ["#"],
        aliases: [],
        arguments: [
          {
            name: "actor",
            label: "Actor",
            type: "SELF",
            required: true,
            consumeRemaining: true,
            allowQuoted: true,
          },
        ],
      },
      presentation: {
        mode: "QUERY",
        continueNarrative: false,
        advanceTime: false,
        resultVisibility: "TOTAL_ONLY",
      },
      triggers: ["#inspect"],
    },
  },
  {
    id: "legacy",
    label: "Legacy Aliases",
    description: "Legacy argument and presentation aliases normalize safely.",
    command: {
      id: "legacy_command",
      label: "Legacy Command",
      invocation: {
        command: "/LEGACY COMMAND",
        prefixes: ["/", "bad prefix"],
        aliases: ["Legacy Alias", "legacy-command"],
        arguments: [
          {
            id: "amount",
            title: "Amount",
            type: "NUMBER",
            consume_remaining: true,
            allow_quoted: false,
            min: "1",
            max: "5",
            futureArgumentMetadata: { retained: true },
          },
        ],
        futureInvocationMetadata: { retained: true },
      },
      presentation: {
        mode: "state_setting",
        continue_narrative: false,
        advance_time: false,
        result_visibility: "outcome_only",
        futurePresentationMetadata: { retained: true },
      },
      triggers: [" /legacy ", "/legacy", ""],
    },
  },
  {
    id: "recoverable",
    label: "Malformed but Recoverable",
    description: "Invalid collections and values fall back to safe command defaults.",
    command: {
      id: "recoverable",
      invocation: {
        command: "!!!",
        prefixes: ["letters", "//"],
        aliases: null,
        arguments: [null, { type: "UNKNOWN" }],
      },
      presentation: {
        mode: "UNKNOWN",
        resultVisibility: "UNKNOWN",
      },
      triggers: null,
    },
  },
];

export function listMechanicsCommandCoreFixtures() {
  return FIXTURES.map((fixture) => ({
    ...fixture,
    command: {
      ...fixture.command,
      invocation: normalizeCommandInvocation(fixture.command.invocation),
      presentation: normalizeCommandPresentation(fixture.command.presentation),
      triggers: normalizeCommandTriggers(fixture.command.triggers),
    },
  }));
}
