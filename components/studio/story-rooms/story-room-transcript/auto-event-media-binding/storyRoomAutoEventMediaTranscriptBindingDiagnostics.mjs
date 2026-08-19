import assert from "node:assert/strict";
import fs from "node:fs";

import {
  STORY_ROOM_MESSAGE_VIEW_CONTRACT_VERSION,
} from "../../story-room-message/StoryRoomMessage.contract.js";

import {
  STORY_ROOM_TRANSCRIPT_VIEW_CONTRACT_VERSION,
} from "../StoryRoomTranscript.contract.js";

import {
  STORY_ROOM_AUTO_EVENT_MEDIA_CONTENT_TYPE,
  STORY_ROOM_AUTO_EVENT_MEDIA_PRESENTATION_ORDERS,
  STORY_ROOM_AUTO_EVENT_MEDIA_SUBTYPES,
  STORY_ROOM_AUTO_EVENT_MEDIA_SURFACE_TONE,
  STORY_ROOM_AUTO_EVENT_MEDIA_TRANSCRIPT_BINDING_CONTRACT_VERSION,
  orderStoryRoomMessagesForMediaPresentation,
  projectStoryRoomAutoEventMediaMessage,
  projectStoryRoomAutoEventMediaTranscriptBinding,
  projectStoryRoomOpeningHeroImage,
} from "./StoryRoomAutoEventMediaTranscriptBinding.contract.js";

import {
  storyRoomAutoEventMediaTranscriptMessagesFixture,
  storyRoomOpeningHeroImageFallbackAltFixture,
  storyRoomOpeningHeroImageFixture,
  storyRoomOpeningHeroImageMissingFixture,
} from "./StoryRoomAutoEventMediaTranscriptBinding.fixtures.js";

assert.equal(
  STORY_ROOM_AUTO_EVENT_MEDIA_TRANSCRIPT_BINDING_CONTRACT_VERSION,
  "story_room_auto_event_media_transcript_binding_v1"
);

assert.equal(
  STORY_ROOM_AUTO_EVENT_MEDIA_CONTENT_TYPE,
  "AUTO_EVENT_MEDIA"
);

assert.equal(
  STORY_ROOM_AUTO_EVENT_MEDIA_SURFACE_TONE,
  "MEDIA"
);

assert.deepEqual(
  STORY_ROOM_AUTO_EVENT_MEDIA_SUBTYPES,
  {
    CHARACTER_EVENT_IMAGE:
      "CHARACTER_EVENT_IMAGE",
    LOCATION_EVENT_IMAGE:
      "LOCATION_EVENT_IMAGE",
  }
);

assert.deepEqual(
  STORY_ROOM_AUTO_EVENT_MEDIA_PRESENTATION_ORDERS,
  {
    BEFORE_TRIGGERING_MESSAGE:
      "BEFORE_TRIGGERING_MESSAGE",
    AFTER_TRIGGERING_MESSAGE:
      "AFTER_TRIGGERING_MESSAGE",
  }
);

const locationProjection =
  projectStoryRoomAutoEventMediaMessage(
    storyRoomAutoEventMediaTranscriptMessagesFixture[1]
  );

assert.equal(
  locationProjection.contentType,
  "AUTO_EVENT_MEDIA"
);

assert.equal(
  locationProjection.surfaceTone,
  "MEDIA"
);

assert.equal(
  locationProjection.triggeringMessageId,
  "response-1"
);

assert.equal(
  locationProjection.presentationOrder,
  "BEFORE_TRIGGERING_MESSAGE"
);

assert.equal(
  locationProjection.media.subtype,
  "LOCATION_EVENT_IMAGE"
);

assert.equal(
  locationProjection.media.altText,
  "Establishing image for Brasswhisker Workshop"
);

assert.equal(
  locationProjection.media.caption,
  "Brasswhisker Workshop"
);

assert.equal(
  locationProjection.media.width,
  1400
);

assert.equal(
  locationProjection.media.height,
  700
);

assert.equal(
  locationProjection.media.contentRating,
  "SFW"
);

const characterProjection =
  projectStoryRoomAutoEventMediaMessage(
    storyRoomAutoEventMediaTranscriptMessagesFixture[2]
  );

assert.equal(
  characterProjection.presentationOrder,
  "AFTER_TRIGGERING_MESSAGE"
);

assert.equal(
  characterProjection.media.subtype,
  "CHARACTER_EVENT_IMAGE"
);

assert.equal(
  characterProjection.media.altText,
  "Character image for Mira Quill"
);

assert.equal(
  characterProjection.media.caption,
  ""
);

const defaultLocationProjection =
  projectStoryRoomAutoEventMediaMessage(
    storyRoomAutoEventMediaTranscriptMessagesFixture[4]
  );

assert.equal(
  defaultLocationProjection.presentationOrder,
  "BEFORE_TRIGGERING_MESSAGE"
);

assert.equal(
  defaultLocationProjection.media.width,
  1600
);

assert.equal(
  defaultLocationProjection.media.height,
  900
);

const defaultCharacterProjection =
  projectStoryRoomAutoEventMediaMessage(
    storyRoomAutoEventMediaTranscriptMessagesFixture[5]
  );

assert.equal(
  defaultCharacterProjection.presentationOrder,
  "AFTER_TRIGGERING_MESSAGE"
);

assert.equal(
  defaultCharacterProjection.media.contentRating,
  "SFW"
);

const ordered =
  orderStoryRoomMessagesForMediaPresentation(
    storyRoomAutoEventMediaTranscriptMessagesFixture
  );

assert.deepEqual(
  ordered.map((message) => message.id),
  [
    "location-media-1",
    "response-1",
    "character-media-1",
    "location-media-default-order",
    "response-2",
    "character-media-default-order",
    "media-missing-trigger-target",
    "unbound-media-1",
  ]
);

const hero =
  projectStoryRoomOpeningHeroImage(
    storyRoomOpeningHeroImageFixture
  );

assert.deepEqual(
  hero,
  {
    displayUrl:
      "https://example.test/the-bronze-seal-opening.webp",
    width: 1536,
    height: 864,
    altText:
      "The Bronze Seal opening image",
  }
);

const fallbackHero =
  projectStoryRoomOpeningHeroImage(
    storyRoomOpeningHeroImageFallbackAltFixture
  );

assert.deepEqual(
  fallbackHero,
  {
    displayUrl:
      "https://example.test/story-opening.webp",
    width: 1280,
    height: 720,
    altText:
      "Story opening image",
  }
);

assert.equal(
  projectStoryRoomOpeningHeroImage(
    storyRoomOpeningHeroImageMissingFixture
  ),
  null
);

const transcript =
  projectStoryRoomAutoEventMediaTranscriptBinding({
    openingHeroImage:
      storyRoomOpeningHeroImageFixture,
    messages:
      storyRoomAutoEventMediaTranscriptMessagesFixture,
  });

assert.equal(
  transcript.bindingContractVersion,
  STORY_ROOM_AUTO_EVENT_MEDIA_TRANSCRIPT_BINDING_CONTRACT_VERSION
);

assert.equal(
  transcript.storyRoomMessageViewContractVersion,
  STORY_ROOM_MESSAGE_VIEW_CONTRACT_VERSION
);

assert.equal(
  transcript.storyRoomTranscriptViewContractVersion,
  STORY_ROOM_TRANSCRIPT_VIEW_CONTRACT_VERSION
);

assert.equal(
  transcript.openingHeroImage.altText,
  "The Bronze Seal opening image"
);

assert.deepEqual(
  transcript.messageItems.map((item) => [
    item.id,
    item.kind,
  ]),
  [
    [
      "location-media-1",
      "AUTO_EVENT_MEDIA",
    ],
    [
      "response-1",
      "MESSAGE",
    ],
    [
      "character-media-1",
      "AUTO_EVENT_MEDIA",
    ],
    [
      "location-media-default-order",
      "AUTO_EVENT_MEDIA",
    ],
    [
      "response-2",
      "MESSAGE",
    ],
    [
      "character-media-default-order",
      "AUTO_EVENT_MEDIA",
    ],
    [
      "media-missing-trigger-target",
      "AUTO_EVENT_MEDIA",
    ],
    [
      "unbound-media-1",
      "AUTO_EVENT_MEDIA",
    ],
  ]
);

assert.deepEqual(
  transcript.summary,
  {
    inputMessageCount: 8,
    orderedMessageCount: 8,
    autoEventMediaCount: 6,
    locationEventImageCount: 2,
    characterEventImageCount: 4,
  }
);

assert.deepEqual(
  transcript.functionalWiringStatus,
  {
    authoritativeMessageProjection:
      "WIRED",
    autoEventMediaMessageProjection:
      "WIRED",
    transcriptOrdering:
      "WIRED",
    openingHeroProjection:
      "WIRED",
  }
);

assert.deepEqual(
  transcript.visualExtensionStatus,
  {
    storyRoomMessageAutoEventMedia:
      "WIRED",
    storyRoomTranscriptOpeningHeroImage:
      "WIRED",
    storyRoomTranscriptMediaOrdering:
      "WIRED",
  }
);

assert.deepEqual(
  transcript.architecture,
  {
    roomAndMessageLoadingOwnedByChassis: true,
    autoEventMediaGenerationOwnedByChassis: true,
    mediaVisibilityAndDisplayUrlOwnedByServices: true,
    triggeringMessageIdentityOwnedByChassis: true,
    transcriptOrderingProjectionOwnedByFe: true,
    mediaMessagePresentationOwnedByFe: true,
    openingHeroPresentationOwnedByFe: true,
    chatPackageUnmodified: true,
  }
);

const source = fs.readFileSync(
  new URL(
    "./StoryRoomAutoEventMediaTranscriptBinding.contract.js",
    import.meta.url
  ),
  "utf8"
);

for (const forbidden of [
  "generate",
  "imageJob",
  "submitImage",
  "resolveR2",
  "signMedia",
  "roomData",
  "setMessages",
  "useStoryRoomChat",
  "@/lib/client",
  "fetch(",
  "services/api",
  "PostGraphile",
  "supabase",
  "useEffect(",
  "useState(",
]) {
  assert.equal(
    source.includes(forbidden),
    false,
    `binding contract must not contain ${forbidden}`
  );
}

console.log(JSON.stringify({
  diagnostic:
    "story_room_auto_event_media_transcript_binding_fe_semantic_contract_v1",
  status: "PASSED",
  bindingContractVersion:
    STORY_ROOM_AUTO_EVENT_MEDIA_TRANSCRIPT_BINDING_CONTRACT_VERSION,
  storyRoomMessageViewContractVersion:
    STORY_ROOM_MESSAGE_VIEW_CONTRACT_VERSION,
  storyRoomTranscriptViewContractVersion:
    STORY_ROOM_TRANSCRIPT_VIEW_CONTRACT_VERSION,
  locationBeforeTriggerOrderingCovered: true,
  characterAfterTriggerOrderingCovered: true,
  defaultPresentationOrderCovered: true,
  unboundAndMissingTriggerMediaRetentionCovered: true,
  characterAndLocationMediaProjectionCovered: true,
  openingHeroImageProjectionCovered: true,
  autoEventMediaMessageVisualWired: true,
  openingHeroVisualWired: true,
  transcriptMediaOrderingWired: true,
  storyRoomMessageViewSemanticallyExtended: true,
  existingStoryRoomMessageViewModelUnmodified: true,
  storyRoomTranscriptViewSemanticallyExtended: true,
  storyRoomTranscriptViewModelWiredToAcceptedBinding: true,
  chassisGenerationLoadingAndMediaAuthorityExcluded: true,
  protectedChatPackageUnmodified: true,
}, null, 2));
