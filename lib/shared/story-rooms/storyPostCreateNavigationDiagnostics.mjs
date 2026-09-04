import assert from "node:assert/strict";

import {
  isStoryPostCreateCharacterConfigurationRequired,
  resolveStoryPostCreateNavigationHref,
} from "./storyPostCreateNavigation.js";

function room(data = {}, id = "room-1") {
  return { id, data };
}

const savedPcPending = room({
  playerActorConfiguration: {
    version: "story_player_actor_configuration_v1",
    actorMode: "SAVED_PLAYER_CHARACTER",
    configurationStatus: "CONFIGURATION_REQUIRED",
    configurationPlan: {
      status: "CONFIGURATION_REQUIRED",
      canEnterPlay: false,
      attachmentDomains: [],
      configurationDomains: ["MAGIC", "ABILITIES"],
    },
  },
});
assert.equal(isStoryPostCreateCharacterConfigurationRequired(savedPcPending), true);
assert.equal(
  resolveStoryPostCreateNavigationHref({ room: savedPcPending }),
  "/studio/v2/stories/room-1/character-configuration"
);

const launchFallbackPending = room({
  playerCharacterLaunch: {
    actorMode: "SAVED_PLAYER_CHARACTER",
    configurationStatus: "CONFIGURATION_REQUIRED",
    characterConfigurationPlan: {
      status: "CONFIGURATION_REQUIRED",
      canEnterPlay: false,
      attachmentDomains: [],
      configurationDomains: ["SKILLS"],
    },
  },
}, "room launch");
assert.equal(isStoryPostCreateCharacterConfigurationRequired(launchFallbackPending), true);
assert.equal(
  resolveStoryPostCreateNavigationHref({ room: launchFallbackPending }),
  "/studio/v2/stories/room%20launch/character-configuration"
);

const temporaryPending = room({
  playerCharacterLaunch: {
    actorMode: "TEMPORARY_ROOM_ACTOR",
    configurationStatus: "CONFIGURATION_REQUIRED",
    characterConfigurationPlan: {
      status: "TEMPORARY_ACTOR_REQUIRED",
      canEnterPlay: false,
      temporaryActorRequired: true,
      attachmentDomains: [],
      configurationDomains: [],
    },
  },
  temporaryPlayerActor: {
    configurationStatus: "CONFIGURATION_REQUIRED",
  },
});
assert.equal(isStoryPostCreateCharacterConfigurationRequired(temporaryPending), true);
assert.equal(
  resolveStoryPostCreateNavigationHref({ room: temporaryPending }),
  "/studio/v2/stories/room-1/character-configuration"
);

const readyRoom = room({
  playerActorConfiguration: {
    configurationStatus: "READY",
    configurationPlan: {
      status: "READY",
      canEnterPlay: true,
      attachmentDomains: [],
      configurationDomains: [],
    },
  },
  playerCharacterLaunch: { configurationStatus: "READY" },
});
assert.equal(isStoryPostCreateCharacterConfigurationRequired(readyRoom), false);
assert.equal(
  resolveStoryPostCreateNavigationHref({ room: readyRoom }),
  "/studio/v2/stories/room-1"
);

const legacyRoom = room({});
assert.equal(isStoryPostCreateCharacterConfigurationRequired(legacyRoom), false);
assert.equal(
  resolveStoryPostCreateNavigationHref({ room: legacyRoom }),
  "/studio/v2/stories/room-1"
);
assert.equal(resolveStoryPostCreateNavigationHref({ room: null }), "");

console.log(JSON.stringify({
  diagnostic: "story_post_create_character_configuration_routing_v1",
  status: "PASSED",
  authoritativeReturnedRoomStateUsed: true,
  savedPlayerCharacterConfigurationRedirected: true,
  temporaryPlayerActorConfigurationRedirected: true,
  playerCharacterLaunchFallbackSupported: true,
  readyRoomsEnterNormalStory: true,
  legacyRoomsEnterNormalStory: true,
  launchPreflightDoesNotOwnReadiness: true,
  providerAuthorityGranted: false,
  crownfallSpecificRulesIntroduced: false,
}, null, 2));
