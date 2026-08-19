import {
  STORY_ROOM_CAST_PANEL_VIEW_CONTRACT_VERSION,
} from "../StoryRoomCastPanel.contract.js";

import {
  STORY_CHARACTER_LIFECYCLE_RUNTIME_PRESENTATION_CONTRACT_VERSION,
} from "../../story-character-lifecycle-runtime/StoryCharacterLifecycleRuntimePresentation.contract.js";

export const STORY_ROOM_CAST_LIFECYCLE_BINDING_CONTRACT_VERSION =
  "story_room_cast_lifecycle_binding_v1";

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function joinNonEmpty(parts, separator = " · ") {
  return parts.map(text).filter(Boolean).join(separator);
}

function releaseTurnLabel(value) {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? `Released on turn ${parsed}`
    : "";
}

export function projectStoryRoomCastLifecycleMember({
  castMember = {},
  lifecycleParticipant = null,
} = {}) {
  const member = object(castMember);
  const lifecycle = object(lifecycleParticipant);

  if (!text(lifecycle.participantId)) {
    return {
      ...member,
      lifecycle: null,
    };
  }

  const lifecycleLabel = text(lifecycle.lifecycleLabel);
  const lifecycleStateLabel = text(lifecycle.stateLabel);
  const releasePolicyLabel = text(lifecycle.releasePolicyLabel);
  const releaseReasonMessage = text(
    lifecycle.releaseReasonMessage
  );
  const releasedAtLabel = releaseTurnLabel(
    lifecycle.releasedAtTurn
  );

  const lifecycleHelper = joinNonEmpty(
    [
      releasePolicyLabel,
      releaseReasonMessage,
      releasedAtLabel,
    ],
    " "
  );

  const composedState = joinNonEmpty([
    text(member.state),
    lifecycleLabel,
    lifecycleStateLabel,
  ]);

  const composedNote = joinNonEmpty(
    [
      text(member.note),
      lifecycleHelper,
    ],
    " — "
  );

  return {
    ...member,

    // Existing cast-card fields remain compatible with the current View.
    // Chassis-supplied responder authority is deliberately preserved.
    state: composedState,
    note: composedNote,
    isActive: Boolean(member.isActive),
    selectable: Boolean(member.selectable),
    selected: Boolean(member.selected),
    selectionLabel: text(member.selectionLabel),
    selectionAriaLabel: text(
      member.selectionAriaLabel
    ),

    lifecycle: {
      participantId: text(lifecycle.participantId),
      authoringContractVersion:
        text(lifecycle.authoringContractVersion),
      lifecycleKind:
        text(lifecycle.lifecycleKind),
      lifecycleLabel,
      loadPolicy:
        text(lifecycle.loadPolicy),
      requiredAtStoryBoot:
        lifecycle.requiredAtStoryBoot === true,
      releasePolicy:
        text(lifecycle.releasePolicy),
      releasePolicyLabel,
      lifecycleStatus:
        text(lifecycle.lifecycleStatus),
      stateLabel:
        lifecycleStateLabel,
      stateTone:
        text(lifecycle.stateTone),
      releaseReady:
        lifecycle.releaseReady === true,
      isReleased:
        lifecycle.isReleased === true,
      releaseReason:
        text(lifecycle.releaseReason) || null,
      releaseReasonMessage,
      releasedAtTurn:
        Number.isFinite(
          Number(lifecycle.releasedAtTurn)
        )
          ? Number(lifecycle.releasedAtTurn)
          : null,
      releasedAtLabel,
      releaseVersion:
        text(lifecycle.releaseVersion) || null,
      releaseEvidence:
        object(lifecycle.releaseEvidence),
      helper: lifecycleHelper,
    },
  };
}

export function projectStoryRoomCastLifecycleBinding({
  castMembers = [],
  lifecycleRuntimePresentation = null,
} = {}) {
  const lifecycleProjection = object(
    lifecycleRuntimePresentation
  );

  const lifecycleByParticipantId = new Map(
    array(lifecycleProjection.participants)
      .filter((participant) =>
        text(participant?.participantId)
      )
      .map((participant) => [
        text(participant.participantId),
        participant,
      ])
  );

  const projectedCastMembers = array(castMembers).map(
    (member) =>
      projectStoryRoomCastLifecycleMember({
        castMember: member,
        lifecycleParticipant:
          lifecycleByParticipantId.get(
            text(member?.id)
          ) || null,
      })
  );

  const lifecycleMembers =
    projectedCastMembers.filter(
      (member) => member.lifecycle
    );

  return {
    bindingContractVersion:
      STORY_ROOM_CAST_LIFECYCLE_BINDING_CONTRACT_VERSION,

    castPanelViewContractVersion:
      STORY_ROOM_CAST_PANEL_VIEW_CONTRACT_VERSION,

    lifecycleRuntimePresentationContractVersion:
      STORY_CHARACTER_LIFECYCLE_RUNTIME_PRESENTATION_CONTRACT_VERSION,

    functionalWiringStatus: {
      authoritativeParticipantSnapshotBridge:
        "WIRED",
      lifecycleRuntimeProjection:
        "WIRED",
      castPanelLifecycleBinding:
        "WIRED",
      clientReleaseEligibilityInference:
        "NOT_PERMITTED",
    },

    castMembers: projectedCastMembers,

    summary: {
      castMemberCount:
        projectedCastMembers.length,
      lifecycleMemberCount:
        lifecycleMembers.length,
      persistentCount:
        lifecycleMembers.filter(
          (member) =>
            member.lifecycle.lifecycleKind ===
            "STORY_PINNED"
        ).length,
      openingOnlyCount:
        lifecycleMembers.filter(
          (member) =>
            member.lifecycle.lifecycleKind ===
            "OPENING_TEMPORARY"
        ).length,
      temporaryCount:
        lifecycleMembers.filter(
          (member) =>
            member.lifecycle.lifecycleKind ===
            "TEMPORARY"
        ).length,
      releaseReadyCount:
        lifecycleMembers.filter(
          (member) =>
            member.lifecycle.releaseReady
        ).length,
      releasedCount:
        lifecycleMembers.filter(
          (member) =>
            member.lifecycle.isReleased
        ).length,
    },

    architecture: {
      responderEligibilityOwnedByChassis: true,
      selectedResponderOwnedByChassis: true,
      participantActiveStateOwnedByChassis: true,
      lifecycleReleaseEvaluationOwnedByChassis: true,
      lifecycleParticipantMutationOwnedByChassis: true,
      lifecyclePresentationOwnedByFe: true,
      castPanelVisualCompositionOwnedByFe: true,
      registryNpcLifecycleRemainsSeparate: true,
    },
  };
}
