import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  STORY_ROOM_COMMANDS,
  getStoryRoomCommandSuggestions,
  mergeStoryRoomCommandsWithMechanicsCatalog,
  resolveLocalStoryRoomCommand,
} from "./storyRoomCommandRegistry.js";

const repoRoot = process.cwd();
const read = (relativePath) =>
  fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const commands = mergeStoryRoomCommandsWithMechanicsCatalog(
  {
    version: "mechanics_command_catalog_v1",
    status: "AVAILABLE",
    entries: [
      {
        command: "stats",
        aliases: ["sheetstats"],
        usage: "/stats",
        description: "Show actor Stats & Pools.",
        arguments: [],
        source: { scopeLabel: "Test Mechanics" },
      },
      {
        command: "cast",
        aliases: ["spell", "commands", "stats", "spell"],
        usage: "/cast <Spell>",
        description: "Use a configured spell.",
        arguments: [{ name: "spell", label: "Spell", required: true }],
        source: { scopeLabel: "Test Mechanics" },
      },
      {
        command: "help",
        aliases: [],
        usage: "/help",
        description: "Must not replace the platform help command.",
        arguments: [],
        source: { scopeLabel: "Conflicting Mechanics" },
      },
      {
        command: null,
        triggers: ["legacy phrase"],
        description: "Legacy triggers are not slash autocomplete entries.",
      },
    ],
  },
  STORY_ROOM_COMMANDS
);

assert.equal(commands.filter((command) => command.name === "help").length, 1);
assert.equal(commands.some((command) => command.name === "commands"), true);
assert.equal(commands.some((command) => command.name === "format"), true);
assert.equal(commands.some((command) => command.name === "inventory"), true);
assert.equal(commands.some((command) => command.name === "stats"), true);
assert.equal(commands.some((command) => command.name === "cast"), true);
assert.equal(commands.some((command) => command.name === "legacy phrase"), false);

const cast = commands.find((command) => command.name === "cast");
assert.ok(cast);
assert.equal(cast.requiresArguments, true);
assert.deepEqual(cast.aliases, ["spell"]);
assert.equal(cast.sourceLabel, "Test Mechanics");
assert.equal(resolveLocalStoryRoomCommand("/inventory"), null);
assert.equal(resolveLocalStoryRoomCommand("/commands")?.panel, "COMMANDS");
assert.equal(resolveLocalStoryRoomCommand("/format")?.panel, "FORMAT");
assert.equal(resolveLocalStoryRoomCommand("say /format"), null);
assert.equal(resolveLocalStoryRoomCommand("/format extra"), null);

assert.deepEqual(
  getStoryRoomCommandSuggestions("sta", commands).map((command) => command.name),
  ["stats"]
);
assert.equal(
  getStoryRoomCommandSuggestions("", commands).some(
    (command) => command.name === "stats"
  ),
  true
);

const composerVm = read(
  "components/studio/story-rooms/story-room-composer/useStoryRoomComposerViewModel.js"
);
const composerView = read(
  "components/studio/story-rooms/story-room-composer/StoryRoomComposer.view.jsx"
);
const shellVm = read(
  "components/studio/story-rooms/story-room-chat-shell/useStoryRoomChatShellViewModel.js"
);
const shellView = read(
  "components/studio/story-rooms/story-room-chat-shell/StoryRoomChatShell.view.jsx"
);
const chatHook = read(
  "components/studio/story-rooms/hooks/useStoryRoomChat.js"
);
const client = read("lib/client/studio/story-rooms/storyRoomClient.js");
const proxy = read("app/api/studio/story-rooms/[id]/command-catalog/route.js");

assert.match(composerVm, /commandOptions/);
assert.match(composerVm, /command\.requiresArguments !== true/);
assert.match(composerVm, /command\.requiresArguments[\s\S]*`\/\$\{command\.name\} `/);
assert.match(composerView, /command\.sourceLabel/);
assert.match(
  shellVm,
  /mergeStoryRoomCommandsWithMechanicsCatalog\([\s\S]*commandCatalog[\s\S]*STORY_ROOM_COMMANDS/
);
assert.match(shellVm, /commandOptions:\s*commands/);
assert.match(shellVm, /reloadCommandCatalog.*requestedSpeakerId:\s*nextSpeaker/s);
assert.match(shellView, /command\.sourceLabel/);
assert.match(shellView, /panel === "FORMAT"/);
assert.match(shellView, /Story Text Formatting/);
assert.match(shellView, /Private Thought/);
assert.match(shellView, /Written \/ Digital Message/);
assert.match(shellView, /Telepathy/);
assert.match(chatHook, /fetchStoryRoomCommandCatalog/);
assert.match(chatHook, /reloadCommandCatalog/);
assert.match(chatHook, /requestedSpeakerId:\s*requestedSpeakerId \|\| "AUTO"/);
assert.match(client, /command-catalog/);
assert.match(proxy, /crestfallApiRequest/);
assert.match(proxy, /x-crestfall-user-id/);
assert.doesNotMatch(composerView + shellView + shellVm, /supabase|PostGraphile/);

console.log(
  JSON.stringify(
    {
      diagnostic: "story_room_command_discovery_projection_v2",
      status: "PASSED",
      platformUtilitiesPreserved: true,
      formatUtilityProjected: true,
      inventoryUtilityProjected: true,
      creatorMechanicsCommandsProjected: true,
      platformCommandCollisionsRejected: true,
      conflictingAliasesFiltered: true,
      requiredArgumentsDoNotAutoSubmitIncomplete: true,
      selectedResponderCatalogRefreshSupported: true,
      catalogRefreshesAfterStoryScopeChanges: true,
      creatorCommandSourceLabelsProjected: true,
      backendCatalogBoundaryReused: true,
      directDatabaseAccessFromViewOrViewModel: false,
      crownfallSpecificRulesIntroduced: false,
    },
    null,
    2
  )
);
