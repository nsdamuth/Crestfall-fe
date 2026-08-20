"use client";

import { useCallback, useMemo, useState } from "react";

import {
  CREATION_TYPE_SECTIONS,
  CREATION_TYPE_SECTION_GROUPS,
  sections,
} from "@/components/studio/my-creations/edit/creationEditConstants";
import { useCreationEditViewModel } from "@/components/studio/my-creations/edit/hooks/useCreationEditViewModel";
import { isStructuredRegistryType } from "@/components/studio/registries/structuredRegistryConfigs";
import { setDefaultPlayerCharacter } from "@/lib/client/studio/profile/defaultPlayerCharacterClient";
import { isChatCapableCreationType } from "@/lib/shared/creations/creationTypePolicy";

export const FEATURED_SLOT_INDEX_BY_KEY = {
  primary: 0,
  alt1: 1,
  alt2: 2,
  alt3: 3,
};

export function buildCreationEditTypeFlags({ form = {}, creationId = "" } = {}) {
  const creationType = String(form.type || "").toUpperCase();
  const isCharacter = creationType === "CHARACTER";
  const isPlayerCharacter = creationType === "PLAYER_CHARACTER";

  return {
    creationType,
    isTemplate:
      form.type === "CHARACTER_TEMPLATE" ||
      form.type === "TEMPLATE" ||
      String(creationId || "").includes("template"),
    supportsChatMedia: isChatCapableCreationType(creationType),
    isCharacter,
    isPlayerCharacter,
    canSetDefaultPc: isPlayerCharacter && Boolean(creationId),
    isCharacterLike: isCharacter || isPlayerCharacter,
    isOutfit: creationType === "OUTFIT",
    isWardrobe: creationType === "WARDROBE",
    isLocation: creationType === "LOCATION",
    isPose: creationType === "POSE",
    isImagePreset: creationType === "IMAGE_PRESET",
    isScenario: creationType === "SCENARIO",
    isNarrator: creationType === "NARRATOR",
    isRoomTemplate: creationType === "ROOM_TEMPLATE",
    isStoryline: creationType === "STORYLINE",
    isCharacterTemplate: creationType === "CHARACTER_TEMPLATE",
    isNpcRegistry: creationType === "NPC_REGISTRY",
    isItemRegistry: creationType === "ITEM_REGISTRY",
    isLocationRegistry: creationType === "LOCATION_REGISTRY",
    isMechanicsModule: creationType === "MECHANICS_MODULE",
    isRulesCodex: creationType === "RULES_CODEX",
    isLore: creationType === "LORE",
    isActorMechanicsProfile: creationType === "ACTOR_MECHANICS_PROFILE",
    isStatsPoolsProfile: creationType === "STATS_POOLS_PROFILE",
    isProgressionProfile: creationType === "PROGRESSION_PROFILE",
    isSkillsProfile: creationType === "SKILLS_PROFILE",
    isAbilitySpellProfile: creationType === "ABILITY_SPELL_PROFILE",
    isWalletProfile: creationType === "WALLET_PROFILE",
    isStructuredRegistry: isStructuredRegistryType(creationType),
  };
}

// Registry-as-data, ED1 (docs/plans/FABLE-GATE-2-STUDIO.md, ruling
// N1 option A): replaces the nested ternary this function used to be.
// CREATION_TYPE_SECTIONS carries every type's own array unchanged;
// PLAYER_CHARACTER and any unlisted type fall through to `sections`
// (CHARACTER_EDIT_SECTIONS), matching the ternary's own final default
// exactly, byte for byte the same resolution the old chain produced.
export function resolveCreationEditSections(flags = {}) {
  return CREATION_TYPE_SECTIONS[flags.creationType] || sections;
}

// Group grammar resolver, ED1: schema-as-data section grouping. Falls
// back to the Character grammar for PLAYER_CHARACTER and any type
// without a named grouping, mirroring resolveCreationEditSections's
// own default.
export function resolveCreationEditSectionGroups(flags = {}) {
  return (
    CREATION_TYPE_SECTION_GROUPS[flags.creationType] ||
    CREATION_TYPE_SECTION_GROUPS.CHARACTER
  );
}

function groupIdForSection(groups, sectionId) {
  const match = groups.find((group) => group.sectionIds.includes(sectionId));
  return match ? match.id : groups[0]?.id || null;
}

export function useCreationEditShellViewModel({ creationId, creation } = {}) {
  const edit = useCreationEditViewModel({
    creationId,
    creation,
  });
  const [activeSlotPickerKey, setActiveSlotPickerKey] = useState(null);
  const [defaultPcStatus, setDefaultPcStatus] = useState("");
  const [defaultPcError, setDefaultPcError] = useState("");
  const [settingDefaultPc, setSettingDefaultPc] = useState(false);

  const flags = useMemo(
    () =>
      buildCreationEditTypeFlags({
        form: edit.form,
        creationId,
      }),
    [creationId, edit.form]
  );

  const activeSections = useMemo(
    () => resolveCreationEditSections(flags),
    [flags]
  );

  const activeSectionGroups = useMemo(
    () => resolveCreationEditSectionGroups(flags),
    [flags]
  );

  const activeGroupId = useMemo(
    () => groupIdForSection(activeSectionGroups, edit.activeSection),
    [activeSectionGroups, edit.activeSection]
  );

  const handleSelectGroup = useCallback(
    (groupId) => {
      const group = activeSectionGroups.find((entry) => entry.id === groupId);
      const firstSectionId = group?.sectionIds?.[0];
      if (firstSectionId) edit.setActiveSection(firstSectionId);
    },
    [activeSectionGroups, edit]
  );

  const handleSetDefaultPc = useCallback(async () => {
    if (!flags.canSetDefaultPc || settingDefaultPc) return;

    setDefaultPcStatus("");
    setDefaultPcError("");
    setSettingDefaultPc(true);

    try {
      await setDefaultPlayerCharacter(creationId);
      setDefaultPcStatus("Default Player Character set.");
    } catch (error) {
      setDefaultPcError(
        error?.message || "Default Player Character could not be saved."
      );
    } finally {
      setSettingDefaultPc(false);
    }
  }, [creationId, flags.canSetDefaultPc, settingDefaultPc]);

  const handleFeaturedImageSelected = useCallback(
    ({ slotKey, image } = {}) => {
      edit.updateFeaturedMediaSlot(slotKey, image);

      const nextActiveIndex =
        FEATURED_SLOT_INDEX_BY_KEY[String(slotKey || "").toLowerCase()];

      if (Number.isInteger(nextActiveIndex)) {
        edit.setActiveMediaSlot(nextActiveIndex);
      }

      setActiveSlotPickerKey(null);
    },
    [edit]
  );

  const sectionContentProps = {
    creationId,
    creationType: flags.creationType,
    activeSection: edit.activeSection,
    form: edit.form,
    hasUnsavedChanges: edit.hasUnsavedChanges,
    updateField: edit.updateField,
    updateDataField: edit.updateDataField,
    isTemplate: flags.isTemplate,
    isCharacterLike: flags.isCharacterLike,
    isOutfit: flags.isOutfit,
    isWardrobe: flags.isWardrobe,
    isLocation: flags.isLocation,
    isPose: flags.isPose,
    isImagePreset: flags.isImagePreset,
    isScenario: flags.isScenario,
    isNarrator: flags.isNarrator,
    isRoomTemplate: flags.isRoomTemplate,
    isStoryline: flags.isStoryline,
    isCharacterTemplate: flags.isCharacterTemplate,
    isNpcRegistry: flags.isNpcRegistry,
    isItemRegistry: flags.isItemRegistry,
    isLocationRegistry: flags.isLocationRegistry,
    isMechanicsModule: flags.isMechanicsModule,
    isRulesCodex: flags.isRulesCodex,
    isLore: flags.isLore,
    isActorMechanicsProfile: flags.isActorMechanicsProfile,
    isStatsPoolsProfile: flags.isStatsPoolsProfile,
    isProgressionProfile: flags.isProgressionProfile,
    isSkillsProfile: flags.isSkillsProfile,
    isAbilitySpellProfile: flags.isAbilitySpellProfile,
    isWalletProfile: flags.isWalletProfile,
    isStructuredRegistry: flags.isStructuredRegistry,
    reviewStatus: edit.reviewStatus,
    reviewMessage: edit.reviewMessage,
    reviewAction: edit.reviewAction,
    handleSubmitReview: edit.handleSubmitReview,
    archiveStatus: edit.archiveStatus,
    archiveMessage: edit.archiveMessage,
    handleArchive: edit.handleArchive,
    deleteStatus: edit.deleteStatus,
    deleteMessage: edit.deleteMessage,
    handleDelete: edit.handleDelete,
    onUnlistForEditing: edit.handleUnlistForEditing,
    onCancelReview: edit.handleCancelReview,
  };

  return {
    viewProps: {
      creationId,
      title: edit.form?.title || "Untitled Creation",
      isTemplate: flags.isTemplate,
      activeSection: edit.activeSection,
      activeSections,
      activeSectionGroups,
      activeGroupId,
      onSelectGroup: handleSelectGroup,
      canSetDefaultPc: flags.canSetDefaultPc,
      settingDefaultPc,
      onSetDefaultPc: handleSetDefaultPc,
      onSelectSection: edit.setActiveSection,
      showMechanicsQuickNav:
        flags.isMechanicsModule && edit.activeSection === "fields",
    },
    mediaPanelProps: {
      creationId,
      form: edit.form,
      activeMediaSlot: edit.activeMediaSlot,
      setActiveMediaSlot: edit.setActiveMediaSlot,
      supportsChatMedia: flags.supportsChatMedia,
      onReplaceSlot: setActiveSlotPickerKey,
    },
    mechanicsQuickNavProps: {
      form: edit.form,
    },
    sectionContentProps,
    stickyActionBarProps: {
      form: edit.form,
      updateField: edit.updateField,
      onSave: edit.handleSave,
      saveStatus: edit.saveStatus,
      saveMessage: edit.saveMessage,
      onOpenPublishing: () => edit.setActiveSection("publishing"),
      onUnlistForEditing: edit.handleUnlistForEditing,
      onCancelReview: edit.handleCancelReview,
      reviewStatus: edit.reviewStatus,
    },
    saveBarProps: {
      hasUnsavedChanges: edit.hasUnsavedChanges,
      onSave: edit.handleSave,
      saveStatus: edit.saveStatus,
      saveMessage: edit.saveMessage,
    },
    featuredImagePickerProps: activeSlotPickerKey
      ? {
          creationId,
          slotKey: activeSlotPickerKey,
          onClose: () => setActiveSlotPickerKey(null),
          onSelected: handleFeaturedImageSelected,
        }
      : null,
    defaultPcStatus,
    defaultPcError,
  };
}
